import { Platform } from 'react-native';
import { readSmsAsync } from '../../modules/mizan-sms';
import { parseSmsBody, ETHIOPIAN_BANK_PATTERNS } from './patterns';

export interface ParsedTransaction {
  amount: number;
  source: string; // e.g., 'CBE', 'Awash', 'telebirr'
  date: Date;
  reference?: string;
  type: 'INCOME' | 'EXPENSE';
}

export async function checkSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  return false; // Stub until we add android.permission.READ_SMS request via expo-modules core or permissions api
}

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  return false; // Stub
}

export async function syncBankSmsMessages(): Promise<ParsedTransaction[]> {
  if (Platform.OS !== 'android') return [];
  
  try {
    // 1. Get all known sender IDs
    const allSenderIds = ETHIOPIAN_BANK_PATTERNS.flatMap(bank => bank.senderIds);
    
    // 2. Read SMS natively filtering by these sender IDs
    const messages = await readSmsAsync(allSenderIds);
    
    // 3. Parse and extract
    const transactions: ParsedTransaction[] = [];
    
    for (const msg of messages) {
      const parsed = parseSmsBody(msg.body, msg.address);
      if (parsed && parsed.amount && parsed.type && parsed.source) {
        transactions.push({
          amount: parsed.amount,
          source: parsed.source,
          date: new Date(msg.date),
          type: parsed.type as 'INCOME' | 'EXPENSE',
          reference: `sms-${msg.date}`
        });
      }
    }
    
    return transactions;
  } catch (error) {
    console.error("Failed to parse SMS:", error);
    return [];
  }
}
