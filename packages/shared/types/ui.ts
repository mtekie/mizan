/**
 * Shared UI Types for Mizan
 * 
 * These interfaces are the single source of truth for data shapes
 * passed between server components (page.tsx) and client components
 * (DashboardClient, SimpleDashboard, etc.).
 */

// ── Core User ──
export interface MizanUser {
  name: string | null;
  email: string | null;
  score: number;
  onboardingPhase: string;
  isProfileComplete: boolean;
  goals?: MizanGoal[];
  mizanScore?: number;
}

// ── Account ──
export interface MizanAccount {
  id: string;
  name: string;
  nameAmh?: string | null;
  type: string;
  number?: string | null;
  balance: number;
  color?: string | null;
}

// ── Transaction ──
export interface MizanTransaction {
  id: string;
  title: string;
  titleAmh?: string | null;
  amount: number;
  source: string;
  category?: string | null;
  date: string | Date;
}

// ── Goal ──
export interface MizanGoal {
  id: string;
  name: string;
  emoji: string;
  target: number;
  saved: number;
  deadline?: string | Date | null;
}

// ── Dashboard Summary ──
export interface DashboardSummary {
  netWorth: number;
  monthlyIn: number;
  monthlyOut: number;
  savingsRate: number;
  cashFlowData: CashFlowPoint[];
  topGoal: MizanGoal | null;
  budgets?: any[];
  spendingData?: any[];
}

export interface CashFlowPoint {
  day: string;
  amount: number;
  isProjection?: boolean;
}

// ── Product (for catalogue) ──
export interface MizanProduct {
  id: string;
  title?: string;
  name?: string;
  category?: string;
  bankId?: string;
  bankName?: string;
  bankLogo?: string;
  bankIconBg?: string;
  matchScore?: number;
  description: string;
  interestRate?: number;
  details?: { label: string; value: string; positive?: boolean }[];
  highlight?: string;
  href?: string;
}

// ── Notification ──
export interface MizanNotification {
  id: string;
  type: 'actionable' | 'info';
  title: string;
  titleAmh?: string | null;
  subtitle?: string | null;
  icon?: string | null;
  isRead: boolean;
  createdAt: string | Date;
}

// ── Bill ──
export interface MizanBill {
  id: string;
  name: string;
  amount: number;
  dueDay: number;
  category: string;
  isPaid: boolean;
  lastPaid?: string | Date | null;
}
