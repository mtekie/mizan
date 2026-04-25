#!/usr/bin/env node
import { DEFAULT_IMPORT_SENDERS, buildImportCandidates, filterMessagesByDate, isAllowedSender, readMessagesFromPath, parseTransactionCandidate, resolveDateWindow, scoreFinancialRelevance, summarizeSenders } from './sms-lab.mjs';

const inputPath = process.argv[2];
const minConfidenceArg = process.argv.find((arg) => arg.startsWith('--min-confidence='));
const positionalConfidence = process.argv[3] && !process.argv[3].startsWith('--') ? process.argv[3] : undefined;
const minConfidence = Number(minConfidenceArg?.split('=')[1] || positionalConfidence || 55);
const allowAllSenders = process.argv.includes('--all-senders');
const dateWindow = resolveDateWindow(process.argv.slice(2));

if (!inputPath) {
  console.error('Usage: node scripts/sms-import/dry-run.mjs <csv-or-export-folder> [minConfidence|--min-confidence=75] [--months=3|--since=YYYY-MM-DD]');
  process.exit(1);
}

const messages = readMessagesFromPath(inputPath);
const scopedMessages = filterMessagesByDate(messages, dateWindow);
const candidates = buildImportCandidates(messages, { minConfidence, allowAllSenders, ...dateWindow });

const duplicateFingerprints = candidates.length - new Set(candidates.map((item) => item.message.fingerprint)).size;
const accountNames = [...new Set(candidates.map((item) => item.parsed?.source).filter(Boolean))].sort();
const byType = candidates.reduce((acc, item) => {
  const type = item.parsed?.type || 'UNKNOWN';
  acc[type] = (acc[type] || 0) + 1;
  return acc;
}, {});

const skipped = scopedMessages.reduce((acc, message) => {
  const relevance = scoreFinancialRelevance(message);
  const parsed = parseTransactionCandidate(message);
  const reason = parsed
    ? parsed.confidence < minConfidence ? 'below_min_confidence' : (!allowAllSenders && !isAllowedSender(message) ? 'sender_not_allowlisted' : 'importable')
    : relevance.score < 40 ? 'low_financial_relevance' : 'missing_amount_or_direction';
  acc[reason] = (acc[reason] || 0) + 1;
  return acc;
}, {});

console.log(JSON.stringify({
  inputPath,
  mode: 'dry-run',
  minConfidence,
  dateWindow,
  senderMode: allowAllSenders ? 'all-senders' : 'default-allowlist',
  senderAllowlist: allowAllSenders ? null : DEFAULT_IMPORT_SENDERS,
  totalMessages: messages.length,
  scopedMessages: scopedMessages.length,
  importableTransactions: candidates.length,
  duplicateFingerprints,
  accountNames,
  byType,
  skipped,
  topSenders: summarizeSenders(scopedMessages).slice(0, 25),
  sampleImportPreview: candidates.slice(0, 20).map((item) => ({
    sender: item.message.sender,
    date: item.parsed?.date,
    title: item.parsed?.title,
    amount: item.parsed?.amount,
    type: item.parsed?.type,
    source: item.parsed?.source,
    category: item.parsed?.category,
    confidence: item.parsed?.confidence,
    fingerprint: item.message.fingerprint.slice(0, 12),
  })),
}, null, 2));
