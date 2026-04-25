#!/usr/bin/env node
import { readMessagesFromPath, summarizeSenders } from './sms-lab.mjs';

const inputPath = process.argv[2];
const limit = Number(process.argv[3] || 40);

if (!inputPath) {
  console.error('Usage: node scripts/sms-import/profile.mjs <csv-or-export-folder> [limit]');
  process.exit(1);
}

const messages = readMessagesFromPath(inputPath);
const senderSummary = summarizeSenders(messages).slice(0, limit);

console.log(JSON.stringify({
  inputPath,
  totalMessages: messages.length,
  senderCount: new Set(messages.map((message) => message.sender)).size,
  topSenders: senderSummary,
}, null, 2));
