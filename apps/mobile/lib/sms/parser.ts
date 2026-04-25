import { PermissionsAndroid, Platform } from 'react-native';
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
  return PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
}

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  const result = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_SMS, {
    title: 'Allow bank SMS scan',
    message: 'Mizan can read bank and wallet SMS messages on this device to find transactions. Personal messages are not sent to Mizan.',
    buttonPositive: 'Allow',
    buttonNegative: 'Not now',
  });
  return result === PermissionsAndroid.RESULTS.GRANTED;
}

export async function syncBankSmsMessages(): Promise<ParsedTransaction[]> {
  if (Platform.OS !== 'android') return [];
  const hasPermission = await checkSmsPermission();
  if (!hasPermission) return [];
  
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
