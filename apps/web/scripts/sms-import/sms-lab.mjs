import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';

const MONEY_WORDS = [
  'etb', 'birr', 'br', 'usd', 'eur', 'amount', 'balance', 'bal',
  'debited', 'credited', 'debit', 'credit', 'sent', 'received',
  'paid', 'payment', 'transfer', 'withdraw', 'deposit', 'purchase',
  'transaction', 'txn', 'reference', 'ref', 'invoice',
];

const NEGATIVE_WORDS = [
  'otp', 'verification code', 'password', 'login code', 'promo',
  'offer', 'bundle', 'airtime package',
];

const PROVIDER_HINTS = [
  [/tele\s?birr|telebirr/i, 'telebirr'],
  [/\bcbe\b|commercial bank of ethiopia/i, 'CBE'],
  [/awash/i, 'Awash'],
  [/dashen/i, 'Dashen'],
  [/abyssinia|boa/i, 'Bank of Abyssinia'],
  [/coop/i, 'Coopbank'],
  [/wegagen/i, 'Wegagen'],
  [/zemen/i, 'Zemen'],
  [/amole/i, 'Amole'],
  [/mpesa|m-pesa/i, 'M-Pesa'],
];

export const DEFAULT_IMPORT_SENDERS = [
  '127',
  '994',
  '251994',
  'CBE',
  'cbe',
  'CBEBirr',
  'cbe birr',
  'BOA',
  'boa',
  '810',
  '836',
  'HuluBeje',
  'ethio bill',
  'hellocash',
  'DashenBank',
  'MPESA',
  'MPESA Info',
  'Awash Bank',
  'Tsehay Bank',
  '8611',
];

export function readMessagesFromPath(inputPath) {
  if (!existsSync(inputPath)) {
    throw new Error(`Input path does not exist: ${inputPath}`);
  }

  const stats = statSync(inputPath);
  if (stats.isDirectory()) {
    return readdirSync(inputPath)
      .filter((name) => ['.csv', '.html', '.htm'].includes(extname(name).toLowerCase()))
      .flatMap((name) => readMessagesFromFile(join(inputPath, name)));
  }

  return readMessagesFromFile(inputPath);
}

function readMessagesFromFile(filePath) {
  const ext = extname(filePath).toLowerCase();
  const content = readFileSync(filePath, 'utf8');

  if (ext === '.csv') return readCsvMessages(content, filePath);
  if (ext === '.html' || ext === '.htm') return readHtmlMessages(content, filePath);
  return [];
}

function readCsvMessages(content, sourceFile) {
  const rows = parseCsv(content);
  const [header, ...records] = rows;
  if (!header?.length) return [];

  const key = new Map(header.map((name, index) => [name.trim(), index]));
  const value = (row, column) => {
    const index = key.get(column);
    return index === undefined ? undefined : row[index]?.trim();
  };

  return records
    .filter((row) => row.some(Boolean))
    .map((row) => normalizeMessage({
      sourceFile: value(row, 'source_file') || sourceFile,
      sender: value(row, 'sender') || '',
      timestampRaw: value(row, 'message_timestamp_raw'),
      timestampIso: value(row, 'message_timestamp_iso'),
      direction: value(row, 'direction'),
      body: value(row, 'raw_message') || '',
      amount: parseOptionalNumber(value(row, 'amount')),
      currency: value(row, 'currency'),
      txnType: value(row, 'txn_type'),
      referenceId: value(row, 'reference_id'),
      balanceAfter: parseOptionalNumber(value(row, 'balance_after')),
      confidenceScore: parseOptionalNumber(value(row, 'confidence_score')),
      classification: value(row, 'classification'),
    }));
}

function readHtmlMessages(content, sourceFile) {
  const sender = sourceFile.split('/').pop()?.replace(/\.(html|htm)$/i, '') || '';
  const text = content
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|tr|h\d)>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .split('\n')
    .map((line) => line.replace(/\s+/g, ' ').trim())
    .filter(Boolean);

  return text.map((body, index) => normalizeMessage({
    sourceFile,
    sender,
    body,
    timestampRaw: `html-line-${index + 1}`,
  }));
}

function normalizeMessage(message) {
  const fingerprint = createHash('sha256')
    .update([message.sender, message.timestampIso || message.timestampRaw || '', message.body].join('\n'))
    .digest('hex');

  return {
    ...message,
    sender: message.sender || inferSenderFromSource(message.sourceFile),
    fingerprint,
  };
}

function inferSenderFromSource(sourceFile) {
  return sourceFile.split('/').pop()?.replace(/\.(csv|html|htm)$/i, '') || 'unknown';
}

export function scoreFinancialRelevance(message) {
  const body = message.body.toLowerCase();
  const sender = message.sender.toLowerCase();
  const reasons = [];
  let score = 0;

  if (message.amount !== undefined || moneyAmountRegex().test(message.body)) {
    score += 35;
    reasons.push('amount');
  }

  const keywordHits = MONEY_WORDS.filter((word) => body.includes(word));
  if (keywordHits.length) {
    score += Math.min(30, keywordHits.length * 6);
    reasons.push(`keywords:${keywordHits.slice(0, 5).join(',')}`);
  }

  const provider = inferProvider(message.sender, message.body);
  if (provider !== 'Unknown') {
    score += 20;
    reasons.push(`provider:${provider}`);
  }

  if (/^\+?\d{4,8}$/.test(sender) || /^[a-z][a-z0-9_-]{2,16}$/i.test(message.sender)) {
    score += 8;
    reasons.push('sender-shape');
  }

  const negativeHits = NEGATIVE_WORDS.filter((word) => body.includes(word));
  if (negativeHits.length) {
    score -= Math.min(35, negativeHits.length * 12);
    reasons.push(`negative:${negativeHits.join(',')}`);
  }

  return { score: Math.max(0, Math.min(100, score)), reasons };
}

export function parseTransactionCandidate(message) {
  const relevance = scoreFinancialRelevance(message);
  const amount = message.amount ?? extractAmount(message.body);
  if (!amount || relevance.score < 40) return null;

  const direction = inferDirection(message);
  if (!direction) return null;

  const provider = inferProvider(message.sender, message.body);
  const reference = message.referenceId || extractReference(message.body);
  const balanceAfter = message.balanceAfter ?? extractBalance(message.body);
  const confidence = Math.min(100, relevance.score + (reference ? 5 : 0) + (balanceAfter ? 5 : 0));

  return {
    source: provider,
    title: buildTitle(provider, direction, reference),
    amount,
    type: direction,
    category: inferCategory(message.body, direction),
    date: message.timestampIso,
    reference,
    balanceAfter,
    confidence,
    reasons: relevance.reasons,
  };
}

export function isAllowedSender(message, allowlist = DEFAULT_IMPORT_SENDERS) {
  const normalizedSender = normalizeForMatch(message.sender);
  const normalizedSourceFile = normalizeForMatch(message.sourceFile.split('/').pop() || '');
  return allowlist.some((sender) => {
    const normalized = normalizeForMatch(sender);
    return normalizedSender === normalized || normalizedSourceFile === normalized;
  });
}

export function buildImportCandidates(messages, options = {}) {
  const minConfidence = options.minConfidence ?? 75;
  const allowlist = options.allowAllSenders ? null : (options.senderAllowlist || DEFAULT_IMPORT_SENDERS);
  const since = options.since ? new Date(options.since) : null;
  const until = options.until ? new Date(options.until) : null;

  return messages
    .filter((message) => isInDateWindow(message, since, until))
    .map((message) => ({
      message,
      parsed: parseTransactionCandidate(message),
      relevance: scoreFinancialRelevance(message),
    }))
    .filter((item) => {
      if (!item.parsed || item.parsed.confidence < minConfidence) return false;
      return allowlist ? isAllowedSender(item.message, allowlist) : true;
    });
}

export function filterMessagesByDate(messages, options = {}) {
  const since = options.since ? new Date(options.since) : null;
  const until = options.until ? new Date(options.until) : null;
  return messages.filter((message) => isInDateWindow(message, since, until));
}

export function resolveDateWindow(args, now = new Date()) {
  const sinceArg = args.find((arg) => arg.startsWith('--since='));
  const untilArg = args.find((arg) => arg.startsWith('--until='));
  const monthsArg = args.find((arg) => arg.startsWith('--months='));
  const daysArg = args.find((arg) => arg.startsWith('--days='));

  let since = sinceArg?.split('=')[1];
  const until = untilArg?.split('=')[1];

  if (!since && monthsArg) {
    const months = Number(monthsArg.split('=')[1]);
    const date = new Date(now);
    date.setMonth(date.getMonth() - months);
    since = date.toISOString();
  }

  if (!since && daysArg) {
    const days = Number(daysArg.split('=')[1]);
    const date = new Date(now);
    date.setDate(date.getDate() - days);
    since = date.toISOString();
  }

  return { since, until };
}

export function summarizeSenders(messages) {
  const senders = new Map();

  for (const message of messages) {
    const current = senders.get(message.sender) || {
      sender: message.sender,
      count: 0,
      financialScoreTotal: 0,
      moneyLike: 0,
      parsed: 0,
      currencies: new Set(),
      classifications: new Set(),
      reasons: new Map(),
    };
    const relevance = scoreFinancialRelevance(message);
    const parsed = parseTransactionCandidate(message);
    current.count += 1;
    current.financialScoreTotal += relevance.score;
    current.moneyLike += relevance.score >= 40 ? 1 : 0;
    current.parsed += parsed ? 1 : 0;
    if (message.currency) current.currencies.add(message.currency);
    if (message.classification) current.classifications.add(message.classification);
    for (const reason of relevance.reasons) {
      current.reasons.set(reason, (current.reasons.get(reason) || 0) + 1);
    }
    if (message.timestampIso) {
      if (!current.firstIso || message.timestampIso < current.firstIso) current.firstIso = message.timestampIso;
      if (!current.lastIso || message.timestampIso > current.lastIso) current.lastIso = message.timestampIso;
    }
    senders.set(message.sender, current);
  }

  return [...senders.values()]
    .map((sender) => ({
      sender: sender.sender,
      count: sender.count,
      averageScore: Math.round(sender.financialScoreTotal / sender.count),
      moneyLike: sender.moneyLike,
      parsed: sender.parsed,
      firstIso: sender.firstIso,
      lastIso: sender.lastIso,
      currencies: [...sender.currencies].sort(),
      classifications: [...sender.classifications].sort(),
      topReasons: [...sender.reasons.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([reason, count]) => `${reason}(${count})`),
    }))
    .sort((a, b) => b.parsed - a.parsed || b.averageScore - a.averageScore || b.count - a.count);
}

function parseCsv(input) {
  const rows = [];
  let row = [];
  let cell = '';
  let quoted = false;

  for (let index = 0; index < input.length; index += 1) {
    const char = input[index];
    const next = input[index + 1];

    if (quoted && char === '"' && next === '"') {
      cell += '"';
      index += 1;
    } else if (char === '"') {
      quoted = !quoted;
    } else if (!quoted && char === ',') {
      row.push(cell);
      cell = '';
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && next === '\n') index += 1;
      row.push(cell);
      rows.push(row);
      row = [];
      cell = '';
    } else {
      cell += char;
    }
  }

  if (cell || row.length) {
    row.push(cell);
    rows.push(row);
  }

  return rows;
}

function parseOptionalNumber(value) {
  if (!value) return undefined;
  const normalized = value.replace(/[^\d.-]/g, '');
  if (!normalized) return undefined;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : undefined;
}

function moneyAmountRegex() {
  return /(?:etb|birr|br|usd|eur)?\s*[-+]?\d[\d,]*(?:\.\d{1,2})?\s*(?:etb|birr|br|usd|eur)?/i;
}

function extractAmount(body) {
  const patterns = [
    /(?:etb|birr|br|usd|eur)\s*([\d,]+(?:\.\d{1,2})?)/i,
    /([\d,]+(?:\.\d{1,2})?)\s*(?:etb|birr|br|usd|eur)/i,
  ];

  for (const pattern of patterns) {
    const match = body.match(pattern);
    const amount = parseOptionalNumber(match?.[1]);
    if (amount) return amount;
  }
  return undefined;
}

function extractReference(body) {
  return body.match(/\b(?:ref(?:erence)?|txn|transaction id|receipt)\s*[:#-]?\s*([a-z0-9/-]{4,})/i)?.[1];
}

function extractBalance(body) {
  const match = body.match(/\b(?:balance|bal)\s*(?:is|after|:)?\s*(?:etb|birr|br)?\s*([\d,]+(?:\.\d{1,2})?)/i);
  return parseOptionalNumber(match?.[1]);
}

function inferProvider(sender, body) {
  const haystack = `${sender} ${body}`;
  return PROVIDER_HINTS.find(([pattern]) => pattern.test(haystack))?.[1] || normalizeSource(sender);
}

function normalizeSource(sender) {
  if (!sender || /^\+?\d{9,}$/.test(sender)) return 'Unknown';
  return sender.replace(/\.html$/i, '').trim() || 'Unknown';
}

function normalizeForMatch(value) {
  return value.toLowerCase().replace(/\.(html|htm|csv)$/i, '').replace(/\s+/g, ' ').trim();
}

function isInDateWindow(message, since, until) {
  if (!since && !until) return true;
  if (!message.timestampIso) return false;
  const timestamp = new Date(message.timestampIso);
  if (Number.isNaN(timestamp.getTime())) return false;
  if (since && timestamp < since) return false;
  if (until && timestamp > until) return false;
  return true;
}

function inferDirection(message) {
  const body = message.body.toLowerCase();
  const explicit = `${message.txnType || ''} ${message.classification || ''}`.toLowerCase();
  if (/\b(income|credit|credited|received|deposit)\b/.test(explicit)) return 'INCOME';
  if (/\b(expense|debit|debited|sent|paid|withdraw|purchase|payment)\b/.test(explicit)) return 'EXPENSE';
  if (/\b(credited|received|deposit|incoming)\b/.test(body)) return 'INCOME';
  if (/\b(debited|sent|paid|payment|withdraw|purchase|transferred to)\b/.test(body)) return 'EXPENSE';
  return undefined;
}

function inferCategory(body, direction) {
  const text = body.toLowerCase();
  if (text.includes('airtime')) return 'Airtime';
  if (text.includes('utility') || text.includes('bill')) return 'Bills';
  if (text.includes('merchant') || text.includes('paid')) return 'Payment';
  if (text.includes('transfer') || text.includes('sent') || text.includes('received')) return 'Transfer';
  return direction === 'INCOME' ? 'Income' : 'Expense';
}

function buildTitle(provider, direction, reference) {
  const action = direction === 'INCOME' ? 'Received' : 'Spent';
  return reference ? `${action} via ${provider} (${reference})` : `${action} via ${provider}`;
}
