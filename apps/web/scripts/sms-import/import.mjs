#!/usr/bin/env node
import { PrismaClient } from '@prisma/client';
import { DEFAULT_IMPORT_SENDERS, buildImportCandidates, filterMessagesByDate, readMessagesFromPath, resolveDateWindow } from './sms-lab.mjs';

const PARSER_VERSION = 'sms-lab-v1';
const ACCOUNT_COLORS = ['#16a34a', '#2563eb', '#7c3aed', '#dc2626', '#0891b2', '#ca8a04'];

const args = new Set(process.argv.slice(2));
const inputPath = process.argv[2];
const minConfidenceArg = process.argv.find((arg) => arg.startsWith('--min-confidence='));
const userIdArg = process.argv.find((arg) => arg.startsWith('--user-id='));
const minConfidence = Number(minConfidenceArg?.split('=')[1] || 75);
const commit = args.has('--commit');
const allowAllSenders = args.has('--all-senders');
const senderAllowlist = allowAllSenders ? null : DEFAULT_IMPORT_SENDERS;
const dateWindow = resolveDateWindow(process.argv.slice(2));

if (!inputPath || inputPath.startsWith('--')) {
  console.error('Usage: node scripts/sms-import/import.mjs <csv-or-export-folder> [--commit] [--min-confidence=75] [--user-id=<uuid>] [--months=3|--since=YYYY-MM-DD] [--all-senders]');
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const adminUser = await resolveAdminUser(userIdArg?.split('=')[1]);
  const messages = readMessagesFromPath(inputPath);
  const scopedMessages = filterMessagesByDate(messages, dateWindow);
  const candidates = buildImportCandidates(messages, { minConfidence, allowAllSenders, senderAllowlist, ...dateWindow });
  const existing = await prisma.importedMessage.findMany({
    where: { fingerprint: { in: candidates.map((item) => item.message.fingerprint) } },
    select: { fingerprint: true },
  });
  const existingFingerprints = new Set(existing.map((message) => message.fingerprint));
  const newCandidates = candidates.filter((item) => !existingFingerprints.has(item.message.fingerprint));
  const accountNames = [...new Set(newCandidates.map((item) => item.parsed.source))].sort();

  const summary = {
    mode: commit ? 'commit' : 'dry-run',
    adminUser: { id: adminUser.id, email: adminUser.email, username: adminUser.username },
    inputPath,
    totalMessages: messages.length,
    scopedMessages: scopedMessages.length,
    importableTransactions: candidates.length,
    alreadyImported: existingFingerprints.size,
    newTransactions: newCandidates.length,
    minConfidence,
    dateWindow,
    senderMode: allowAllSenders ? 'all-senders' : 'default-allowlist',
    senderAllowlist,
    accountNames,
  };

  if (!commit) {
    console.log(JSON.stringify(summary, null, 2));
    console.error('Dry run only. Re-run with --commit to write to the admin account.');
    process.exit(0);
  }

  const batch = await prisma.importBatch.create({
    data: {
      userId: adminUser.id,
      sourcePath: inputPath,
      status: 'RUNNING',
      totalMessages: messages.length,
      importableMessages: candidates.length,
      skippedMessages: scopedMessages.length - candidates.length,
      minConfidence,
      senderAllowlist,
    },
  });

  const accounts = new Map();
  for (const [index, name] of accountNames.entries()) {
    const account = await prisma.account.upsert({
      where: {
        id: await findExistingAccountId(prisma, adminUser.id, name),
      },
      update: {},
      create: {
        userId: adminUser.id,
        name,
        type: accountTypeFor(name),
        balance: 0,
        color: ACCOUNT_COLORS[index % ACCOUNT_COLORS.length],
      },
    });
    accounts.set(name, account);
  }

  const transactionRows = newCandidates.map((item) => {
    const account = accounts.get(item.parsed.source);
    return {
      id: transactionIdFor(item.message.fingerprint),
      userId: adminUser.id,
      accountId: account?.id,
      title: item.parsed.title,
      amount: item.parsed.type === 'EXPENSE' ? -Math.abs(item.parsed.amount) : Math.abs(item.parsed.amount),
      source: item.parsed.source,
      category: item.parsed.category,
      date: item.parsed.date ? new Date(item.parsed.date) : new Date(),
    };
  });

  const importedRows = newCandidates.map((item) => ({
    batchId: batch.id,
    userId: adminUser.id,
    transactionId: transactionIdFor(item.message.fingerprint),
    fingerprint: item.message.fingerprint,
    sender: item.message.sender,
    timestamp: item.parsed.date ? new Date(item.parsed.date) : null,
    parserVersion: PARSER_VERSION,
    confidence: item.parsed.confidence,
    status: 'IMPORTED',
    reason: item.parsed.reasons.join('; '),
  }));

  let imported = 0;
  try {
    for (const chunkRows of chunks(transactionRows, 500)) {
      await prisma.transaction.createMany({ data: chunkRows, skipDuplicates: true });
    }
    for (const chunkRows of chunks(importedRows, 500)) {
      const result = await prisma.importedMessage.createMany({ data: chunkRows, skipDuplicates: true });
      imported += result.count;
    }

    await prisma.importBatch.update({
      where: { id: batch.id },
      data: {
        status: 'COMPLETED',
        importedMessages: imported,
        completedAt: new Date(),
      },
    });
  } catch (error) {
    await prisma.importBatch.update({
      where: { id: batch.id },
      data: {
        status: 'FAILED',
        completedAt: new Date(),
      },
    });
    throw error;
  }

  const result = { batchId: batch.id, imported };

  console.log(JSON.stringify({ ...summary, ...result }, null, 2));
} finally {
  await prisma.$disconnect();
}

async function resolveAdminUser(explicitUserId) {
  if (explicitUserId) {
    const user = await prisma.user.findUnique({ where: { id: explicitUserId } });
    if (!user) throw new Error(`No user found for --user-id=${explicitUserId}`);
    if (user.role !== 'ADMIN') throw new Error(`User ${explicitUserId} is not ADMIN`);
    return user;
  }

  const admins = await prisma.user.findMany({ where: { role: 'ADMIN' } });
  if (admins.length !== 1) {
    throw new Error(`Expected exactly one ADMIN user, found ${admins.length}. Re-run with --user-id=<admin uuid>.`);
  }
  return admins[0];
}

async function findExistingAccountId(tx, userId, name) {
  const account = await tx.account.findFirst({ where: { userId, name }, select: { id: true } });
  return account?.id || `new-${name}`;
}

function accountTypeFor(name) {
  if (/telebirr|m-pesa|hello/i.test(name)) return 'Mobile Wallet';
  return 'Bank';
}

function transactionIdFor(fingerprint) {
  return `sms_${fingerprint.slice(0, 24)}`;
}

function chunks(rows, size) {
  const result = [];
  for (let index = 0; index < rows.length; index += size) {
    result.push(rows.slice(index, index + size));
  }
  return result;
}
