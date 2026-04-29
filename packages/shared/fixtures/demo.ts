import type { Account, Bill, Budget, Goal, Product, Transaction, User } from '../types';

const now = '2026-04-26T09:00:00.000Z';

export type DemoAccount = Account & {
  bank?: string;
};

export type DemoBudget = Budget & {
  category?: string;
  limit?: number;
  spent?: number;
  categories?: Array<{
    id: string;
    name: string;
    allocated: number;
    spent: number;
  }>;
};

export type DemoBill = Bill & {
  title?: string;
  dueDate?: string;
  lastSkipped?: string | null;
};

export type DemoProduct = Product & Record<string, unknown>;

export const demoUser: User & Record<string, unknown> = {
  id: 'guest',
  name: 'Guest User',
  fullName: 'Guest User',
  username: 'guest',
  email: 'guest@mizan.local',
  gender: 'prefer_not_to_say',
  residencyStatus: 'resident',
  monthlyIncomeRange: '25000_50000',
  educationLevel: 'secondary',
  employmentStatus: 'self_employed',
  employmentSector: 'retail',
  financialPriority: 'resilience',
  riskAppetite: 'balanced',
  housingStatus: 'renting',
  incomeStability: 'variable',
  digitalAdoption: 'high',
  interestFree: false,
  dependents: 0,
  onboardingPhase: 'preview',
  isProfileComplete: false,
  currency: 'ETB',
  language: 'en',
  mizanScore: 690,
  role: 'USER',
  createdAt: now,
};

export const demoAccounts: DemoAccount[] = [
  {
    id: 'demo-cbe-birr',
    userId: 'guest',
    name: 'CBE Birr',
    type: 'Savings',
    number: '6789',
    balance: 45200.5,
    color: '#2F4494',
    bank: 'CBE',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-telebirr',
    userId: 'guest',
    name: 'telebirr',
    type: 'Wallet',
    number: '2400',
    balance: 1240,
    color: '#4B83F1',
    bank: 'Ethio Telecom',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-cash',
    userId: 'guest',
    name: 'Cash',
    type: 'Cash',
    number: '0000',
    balance: 0,
    color: '#45BFA0',
    bank: 'Manual',
    createdAt: now,
    updatedAt: now,
  },
];

export const demoTransactions: Transaction[] = [
  {
    id: 'demo-tx-ethio-telecom',
    userId: 'guest',
    title: 'Paid Ethio Telecom',
    amount: -450,
    category: 'Utilities',
    source: 'Bill Reminder',
    accountId: 'demo-telebirr',
    date: '2026-04-26T08:30:00.000Z',
  },
  {
    id: 'demo-tx-telebirr-airtime',
    userId: 'guest',
    title: 'Spent via telebirr',
    amount: -228,
    category: 'Airtime',
    source: 'telebirr',
    accountId: 'demo-telebirr',
    date: '2026-04-25T16:00:00.000Z',
  },
  {
    id: 'demo-tx-transfer',
    userId: 'guest',
    title: 'Transfer to CBE Birr',
    amount: 35000,
    category: 'Transfer',
    source: 'CBE',
    accountId: 'demo-cbe-birr',
    date: '2026-04-24T12:00:00.000Z',
  },
];

export const demoGoals: Goal[] = [
  {
    id: 'demo-emergency-fund',
    userId: 'guest',
    name: 'Emergency Fund',
    emoji: 'SOS',
    target: 100000,
    saved: 45000,
    deadline: '2026-05-31T00:00:00.000Z',
    createdAt: now,
  },
];

export const demoBudgets: DemoBudget[] = [
  {
    id: 'demo-april-budget',
    userId: 'guest',
    month: 4,
    year: 2026,
    totalLimit: 26000,
    category: 'Monthly Budget',
    limit: 26000,
    spent: 0,
    categories: [
      { id: 'demo-budget-rent', name: 'Rent & Housing', allocated: 6500, spent: 0 },
      { id: 'demo-budget-business', name: 'Business Costs', allocated: 5200, spent: 0 },
      { id: 'demo-budget-savings', name: 'Savings', allocated: 5200, spent: 0 },
      { id: 'demo-budget-food', name: 'Food & Groceries', allocated: 3900, spent: 0 },
    ],
    createdAt: now,
  },
];

export const demoBills: DemoBill[] = [
  {
    id: 'demo-bill-canal-plus',
    userId: 'guest',
    name: 'Canal+',
    title: 'Canal+',
    amount: 600,
    dueDay: 20,
    dueDate: 'Due day 20',
    category: 'Entertainment',
    isPaid: false,
    lastSkipped: '2026-04-10T09:00:00.000Z',
    createdAt: now,
  },
  {
    id: 'demo-bill-ethio-telecom',
    userId: 'guest',
    name: 'Ethio Telecom',
    title: 'Ethio Telecom',
    amount: 450,
    dueDay: 20,
    dueDate: 'Due day 20',
    category: 'Utilities',
    isPaid: true,
    lastPaid: '2026-04-26T08:30:00.000Z',
    createdAt: now,
  },
];

export const demoProducts: DemoProduct[] = [
  {
    id: 'demo-product-cbe-savings',
    category: 'SAVINGS',
    bankId: 'cbe',
    bankName: 'Commercial Bank of Ethiopia',
    bankLogo: 'CB',
    bankIconBg: 'bg-[#68246D]',
    title: 'CBE Youth Savings Account',
    description: 'A simple savings account for students and young professionals building consistent deposits.',
    productClass: 'SAVINGS',
    productType: 'YOUTH_SAVINGS',
    matchScore: 92,
    highlight: 'Digital onboarding',
    interestRate: 7,
    minBalance: 100,
    digital: true,
    interestFree: false,
    genderBased: false,
    currency: 'ETB',
    isFeatured: true,
    isVerified: true,
    features: ['Mobile banking access', 'Low opening balance', 'ATM access'],
    eligibility: ['Valid ID', 'Ethiopian resident'],
    requirements: ['National ID or passport', 'Phone number'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-product-telebirr-wallet',
    category: 'PAYMENT',
    bankId: 'ethiotelecom',
    bankName: 'Ethio Telecom',
    bankLogo: 'ET',
    bankIconBg: 'bg-cyan-600',
    title: 'telebirr Wallet',
    description: 'Mobile wallet for transfers, airtime, merchant payments, and everyday bill payments.',
    productClass: 'PAYMENT',
    productType: 'MOBILE_WALLET',
    matchScore: 89,
    highlight: 'Everyday payments',
    interestRate: 0,
    maxAmount: 30000,
    digital: true,
    interestFree: true,
    genderBased: false,
    currency: 'ETB',
    isFeatured: true,
    isVerified: true,
    features: ['Airtime top-up', 'Bill payments', 'Merchant QR payments'],
    eligibility: ['Active mobile number'],
    requirements: ['SIM registration'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-product-enat-women-credit',
    category: 'CREDIT',
    bankId: 'enat',
    bankName: 'Enat Bank',
    bankLogo: 'EN',
    bankIconBg: 'bg-pink-600',
    title: 'Credit Guarantee for Women',
    description: 'Credit facility designed to expand financing access for women-owned businesses.',
    productClass: 'CREDIT',
    productType: 'WOMENS_BUSINESS_LOAN',
    matchScore: 86,
    interestRate: 0,
    maxAmount: 250000,
    term: '12-36 months',
    digital: false,
    interestFree: true,
    genderBased: true,
    currency: 'ETB',
    isFeatured: false,
    isVerified: true,
    features: ['Women-focused eligibility', 'Business support', 'Flexible collateral review'],
    eligibility: ['Women-owned business', 'Business plan'],
    requirements: ['Valid ID', 'Trade license where applicable'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'demo-product-wegagen-house-loan',
    category: 'CREDIT',
    bankId: 'wegagen',
    bankName: 'Wegagen Bank',
    bankLogo: 'WE',
    bankIconBg: 'bg-teal-600',
    title: 'House Completion Loan',
    description: 'Financing for customers completing residential housing construction.',
    productClass: 'CREDIT',
    productType: 'HOME_COMPLETION_LOAN',
    matchScore: 84,
    interestRate: 13.5,
    maxAmount: 1500000,
    term: 'Up to 10 years',
    digital: false,
    interestFree: false,
    genderBased: false,
    currency: 'ETB',
    isFeatured: false,
    isVerified: true,
    features: ['Construction financing', 'Longer repayment period'],
    eligibility: ['Proof of property ownership', 'Stable income'],
    requirements: ['Collateral documents', 'Income evidence'],
    createdAt: now,
    updatedAt: now,
  },
];

export const demoDashboard = {
  netWorth: 46440.5,
  monthlyIn: 145509.79,
  monthlyOut: 165577.9,
  savingsRate: -14,
};
