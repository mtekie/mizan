import { Platform, NativeModules } from 'react-native';

export interface ParsedTransaction {
  amount: number;
  source: string; // e.g., 'CBE', 'Awash', 'telebirr'
  date: Date;
  reference?: string;
  type: 'INCOME' | 'EXPENSE';
}

export async function checkSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  
  // This will bridge to a custom Expo Module checking for android.permission.READ_SMS
  // For scaffolding purposes:
  return false; 
}

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') return false;
  
  // Bridge to request android.permission.READ_SMS
  return false;
}

export async function syncBankSmsMessages(): Promise<ParsedTransaction[]> {
  if (Platform.OS !== 'android') return [];
  
  // The actual native module will query ContentResolver for sms matching bank addresses
  // e.g. address IN ('CBE', 'Awash', 'telebirr')
  
  // Return fake stub for now
  console.log("Mock Android SMS Parse Triggered");
  return [];
}
