import { ParsedTransaction } from './parser';

export interface BankRegexPattern {
  bankId: string;
  senderIds: string[];
  patterns: {
    income: RegExp[];
    expense: RegExp[];
  };
}

export const ETHIOPIAN_BANK_PATTERNS: BankRegexPattern[] = [
  {
    bankId: 'CBE',
    senderIds: ['CBE', 'CBEBirr'],
    patterns: {
      income: [
        /Credited with ETB\s+([\d,.]+)/i,
        /Account credited with ETB\s+([\d,.]+)/i
      ],
      expense: [
        /Debited with ETB\s+([\d,.]+)/i,
        /Account debited with ETB\s+([\d,.]+)/i,
        /Transfer of ETB\s+([\d,.]+).*?successful/i
      ],
    }
  },
  {
    bankId: 'Telebirr',
    senderIds: ['telebirr', 'Telebirr'],
    patterns: {
      income: [
        /You have received ETB\s+([\d,.]+)/i
      ],
      expense: [
        /You have sent ETB\s+([\d,.]+)/i,
        /Payment of ETB\s+([\d,.]+).*?successful/i
      ],
    }
  },
  {
    bankId: 'Awash',
    senderIds: ['AwashBank', 'Awash', 'AWASH'],
    patterns: {
      income: [
        /Your account .*? credited .*? ETB\s+([\d,.]+)/i
      ],
      expense: [
        /Your account .*? debited .*? ETB\s+([\d,.]+)/i
      ],
    }
  }
  // Add other 50-100 banks here incrementally
];

export function parseSmsBody(body: string, senderId: string): Partial<ParsedTransaction> | null {
  const bank = ETHIOPIAN_BANK_PATTERNS.find(b => b.senderIds.includes(senderId));
  if (!bank) return null;

  // Check Expense
  for (const expRegex of bank.patterns.expense) {
    const match = body.match(expRegex);
    if (match && match[1]) {
      return {
        amount: parseFloat(match[1].replace(/,/g, '')),
        type: 'EXPENSE',
        source: bank.bankId
      };
    }
  }

  // Check Income
  for (const incRegex of bank.patterns.income) {
    const match = body.match(incRegex);
    if (match && match[1]) {
      return {
        amount: parseFloat(match[1].replace(/,/g, '')),
        type: 'INCOME',
        source: bank.bankId
      };
    }
  }

  return null;
}
