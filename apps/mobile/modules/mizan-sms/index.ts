import { requireNativeModule } from 'expo-modules-core';

interface SmsMessage {
  address: string;
  body: string;
  date: number;
}

const MizanSms = requireNativeModule('MizanSms');

export async function readSmsAsync(senders?: string[]): Promise<SmsMessage[]> {
  return await MizanSms.readSmsAsync(senders);
}
