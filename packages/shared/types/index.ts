export interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  emailVerified?: Date | string | null;
  image?: string | null;
  gender?: string | null;
  dateOfBirth?: Date | string | null;
  educationLevel?: string | null;
  employmentStatus?: string | null;
  monthlyIncomeRange?: string | null;
  familyStatus?: string | null;
  financialPriority?: string | null;
  riskAppetite?: string | null;
  interestFree: boolean;
  dependents: number;
  housingStatus?: string | null;
  incomeStability?: string | null;
  digitalAdoption?: string | null;
  behavioralStyle?: string | null;
  onboardingPhase: string;
  isProfileComplete: boolean;
  currency: string;
  language: string;
  mizanScore: number;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  theme?: string | null;
  notificationPreferences?: any | null;
  createdAt: Date | string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  nameAmh?: string | null;
  type: string;
  number?: string | null;
  balance: number;
  color?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Transaction {
  id: string;
  userId: string;
  accountId?: string | null;
  title: string;
  titleAmh?: string | null;
  amount: number;
  source: string;
  category?: string | null;
  date: Date | string;
}

export interface Asset {
  id: string;
  userId: string;
  name: string;
  value: number;
  category: string;
  imageUrl?: string | null;
  purchasePrice?: number | null;
  purchasedAt?: Date | string | null;
  createdAt: Date | string;
}

export interface Goal {
  id: string;
  userId: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  deadline?: Date | string | null;
  createdAt: Date | string;
}

export interface Budget {
  id: string;
  userId: string;
  month: number;
  year: number;
  totalLimit: number;
  createdAt: Date | string;
}

export interface Bill {
  id: string;
  userId: string;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  isPaid: boolean;
  lastPaid?: Date | string | null;
  createdAt: Date | string;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  titleAmh?: string | null;
  subtitle?: string | null;
  icon?: string | null;
  isRead: boolean;
  createdAt: Date | string;
}

export interface Product {
  id: string;
  category: string;
  bankId?: string | null;
  bankName?: string | null;
  bankLogo?: string | null;
  bankIconBg?: string | null;
  title: string;
  matchScore?: number | null;
  highlight?: string | null;
  description: string;
  interestRate?: number | null;
  interestMax?: number | null;
  features: string[];
  eligibility: string[];
  requirements: string[];
  maxAmount?: number | null;
  term?: string | null;
  fees?: string | null;
  loanCategory?: string | null;
  minBalance?: number | null;
  digital?: boolean | null;
  interestFree?: boolean | null;
  genderBased?: boolean | null;
  currency?: string | null;
  repaymentFrequency?: string | null;
  disbursementTime?: string | null;
  collateralRequirements?: string | null;
  prepaymentPenalties?: string | null;
  latePaymentPenalties?: string | null;
  insuranceRequirements?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}
