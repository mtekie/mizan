/**
 * Shared View Models
 *
 * Platform-agnostic data transformations.
 * Both web and mobile MUST use these functions to compute section data.
 * This guarantees identical numbers, labels, and formatting across platforms.
 */

import type { Account, Transaction, Goal, Budget, Bill, User } from '../types';
import { formatMoney, formatSignedMoney, toFiniteNumber, safePercent } from '../formatters';

// ─── Category Emoji Map ───
const CATEGORY_EMOJI: Record<string, string> = {
  'Food & Drink': '🍕', 'Food': '🍕', 'Groceries': '🛒',
  'Transport': '🚕', 'Transfer': '↗️', 'Income': '💰',
  'Utilities': '⚡', 'Bills': '📄', 'Payment': '💳',
  'Airtime': '📱', 'Housing': '🏠', 'Entertainment': '🎬',
  'Education': '🎓', 'Health': '❤️', 'Shopping': '🛍️',
  'Expense': '💸', 'Savings': '🏦',
};

export function getCategoryEmoji(title: string, category?: string): string {
  if (category && CATEGORY_EMOJI[category]) return CATEGORY_EMOJI[category];
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes('salary') || lowerTitle.includes('received')) return '💰';
  if (lowerTitle.includes('transfer')) return '↗️';
  if (lowerTitle.includes('telecom') || lowerTitle.includes('airtime')) return '📱';
  if (lowerTitle.includes('coffee') || lowerTitle.includes('food')) return '🍕';
  return '💳';
}

// ═══════════════════════════════════════════
//  MONEY TAB VIEW MODELS
// ═══════════════════════════════════════════

export interface MoneySummaryVM {
  totalBalance: number;
  totalBalanceFormatted: string;
  monthlyIn: number;
  monthlyInFormatted: string;
  monthlyOut: number;
  monthlyOutFormatted: string;
  savingsRate: number;
  savingsRateFormatted: string;
  changePercent: number;
  changeFormatted: string;
}

export function buildMoneySummaryVM(
  accounts: Account[],
  transactions: Transaction[],
): MoneySummaryVM {
  const totalBalance = accounts.reduce((s, a) => s + toFiniteNumber(a.balance), 0);
  const monthlyIn = transactions
    .filter(t => toFiniteNumber(t.amount) > 0)
    .reduce((s, t) => s + toFiniteNumber(t.amount), 0);
  const monthlyOut = transactions
    .filter(t => toFiniteNumber(t.amount) < 0)
    .reduce((s, t) => s + Math.abs(toFiniteNumber(t.amount)), 0);
  const savingsRate = monthlyIn > 0
    ? Math.round(((monthlyIn - monthlyOut) / monthlyIn) * 100)
    : 0;
  const changePercent = totalBalance > 0
    ? Math.round(((monthlyIn - monthlyOut) / totalBalance) * 100)
    : 0;

  return {
    totalBalance,
    totalBalanceFormatted: formatMoney(totalBalance),
    monthlyIn,
    monthlyInFormatted: formatSignedMoney(monthlyIn),
    monthlyOut,
    monthlyOutFormatted: formatSignedMoney(-monthlyOut),
    savingsRate,
    savingsRateFormatted: `${savingsRate}%`,
    changePercent,
    changeFormatted: `${changePercent >= 0 ? '+' : ''}${changePercent}%`,
  };
}

// ─── Accounts ───

export interface AccountVM {
  id: string;
  name: string;
  type: string;
  number: string;
  balance: number;
  balanceFormatted: string;
  color: string;
  bank: string;
  /** Short code for tile display, e.g. "SAVINGS", "WALLET" */
  typeLabel: string;
}

export function buildAccountsVM(accounts: Account[]): AccountVM[] {
  return accounts.map(a => ({
    id: a.id,
    name: a.name,
    type: a.type || 'Savings',
    number: (a as any).number || 'N/A',
    balance: toFiniteNumber(a.balance),
    balanceFormatted: formatMoney(a.balance),
    color: a.color || '#45BFA0',
    bank: (a as any).bank || a.type || 'Bank',
    typeLabel: (a.type || 'Savings').toUpperCase(),
  }));
}

// ─── Spending Summary ───

export interface SpendingCategoryVM {
  name: string;
  amount: number;
  amountFormatted: string;
  percent: number;
  color: string;
}

export interface SpendingSummaryVM {
  totalSpent: number;
  totalSpentFormatted: string;
  monthLabel: string;
  categories: SpendingCategoryVM[];
  topCategory: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  'Transfer': '#8B5CF6', 'Payment': '#3B82F6', 'Bills': '#10B981',
  'Expense': '#F59E0B', 'Airtime': '#F97316', 'Utilities': '#06B6D4',
  'Food & Drink': '#EF4444', 'Housing': '#F59E0B', 'Groceries': '#84CC16',
  'Transport': '#6366F1', 'Entertainment': '#EC4899', 'Education': '#14B8A6',
};

export function buildSpendingSummaryVM(transactions: Transaction[]): SpendingSummaryVM {
  const expenses = transactions.filter(t => toFiniteNumber(t.amount) < 0);
  const totalSpent = expenses.reduce((s, t) => s + Math.abs(toFiniteNumber(t.amount)), 0);

  // Group by category
  const categoryMap = new Map<string, number>();
  for (const tx of expenses) {
    const cat = tx.category || 'Expense';
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + Math.abs(toFiniteNumber(tx.amount)));
  }

  const categories: SpendingCategoryVM[] = Array.from(categoryMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, amount]) => ({
      name,
      amount,
      amountFormatted: formatMoney(amount),
      percent: totalSpent > 0 ? Math.round((amount / totalSpent) * 100) : 0,
      color: CATEGORY_COLORS[name] || '#94A3B8',
    }));

  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long' });
  const topCategory = categories[0]?.name || 'N/A';

  return {
    totalSpent,
    totalSpentFormatted: formatMoney(totalSpent),
    monthLabel,
    categories,
    topCategory,
  };
}

// ─── Recent Transactions ───

export interface TransactionVM {
  id: string;
  title: string;
  category: string;
  amount: number;
  amountFormatted: string;
  source: string;
  date: string;
  emoji: string;
  isIncome: boolean;
}

export function buildRecentTransactionsVM(
  transactions: Transaction[],
  limit = 5,
): { transactions: TransactionVM[]; hasMore: boolean } {
  const sorted = [...transactions].sort((a, b) => {
    const da = a.date ? new Date(a.date).getTime() : 0;
    const db = b.date ? new Date(b.date).getTime() : 0;
    return db - da;
  });

  const items: TransactionVM[] = sorted.slice(0, limit).map(tx => {
    const amount = toFiniteNumber(tx.amount);
    return {
      id: tx.id,
      title: tx.title,
      category: tx.category || 'Expense',
      amount,
      amountFormatted: formatMoney(Math.abs(amount)),
      source: tx.source || 'Manual',
      date: tx.date ? String(tx.date) : '',
      emoji: getCategoryEmoji(tx.title, tx.category ?? undefined),
      isIncome: amount > 0,
    };
  });

  return { transactions: items, hasMore: transactions.length > limit };
}

// ═══════════════════════════════════════════
//  GOALS TAB VIEW MODELS
// ═══════════════════════════════════════════

export interface BudgetCategoryVM {
  id: string;
  name: string;
  allocated: number;
  allocatedFormatted: string;
  spent: number;
  spentFormatted: string;
  percent: number;
  isOverBudget: boolean;
}

export interface BudgetOverviewVM {
  totalBudget: number;
  totalBudgetFormatted: string;
  totalSpent: number;
  totalSpentFormatted: string;
  remainingFormatted: string;
  percent: number;
  isOverBudget: boolean;
  categories: BudgetCategoryVM[];
  monthLabel: string;
}

export function buildBudgetOverviewVM(budgets: Budget[]): BudgetOverviewVM {
  const allCategories: BudgetCategoryVM[] = budgets.flatMap(budget => {
    const cats = (budget as any).categories;
    if (Array.isArray(cats)) {
      return cats.map((c: any) => ({
        id: c.id,
        name: c.name,
        allocated: toFiniteNumber(c.allocated),
        allocatedFormatted: formatMoney(c.allocated),
        spent: toFiniteNumber(c.spent),
        spentFormatted: formatMoney(c.spent),
        percent: safePercent(c.spent, c.allocated),
        isOverBudget: toFiniteNumber(c.spent) > toFiniteNumber(c.allocated),
      }));
    }
    return [{
      id: budget.id,
      name: (budget as any).category || 'Budget',
      allocated: toFiniteNumber((budget as any).limit || budget.totalLimit),
      allocatedFormatted: formatMoney((budget as any).limit || budget.totalLimit),
      spent: toFiniteNumber((budget as any).spent),
      spentFormatted: formatMoney((budget as any).spent),
      percent: safePercent((budget as any).spent, (budget as any).limit || budget.totalLimit),
      isOverBudget: toFiniteNumber((budget as any).spent) > toFiniteNumber((budget as any).limit || budget.totalLimit),
    }];
  });

  const totalBudget = allCategories.reduce((s, c) => s + c.allocated, 0);
  const totalSpent = allCategories.reduce((s, c) => s + c.spent, 0);
  const remaining = Math.max(0, totalBudget - totalSpent);
  const percent = safePercent(totalSpent, totalBudget);

  const now = new Date();
  const monthLabel = now.toLocaleString('default', { month: 'long' });

  return {
    totalBudget,
    totalBudgetFormatted: formatMoney(totalBudget),
    totalSpent,
    totalSpentFormatted: formatMoney(totalSpent),
    remainingFormatted: formatMoney(remaining),
    percent,
    isOverBudget: totalSpent > totalBudget,
    categories: allCategories,
    monthLabel,
  };
}

// ─── Goals ───

export interface GoalVM {
  id: string;
  name: string;
  emoji: string;
  target: number;
  targetFormatted: string;
  saved: number;
  savedFormatted: string;
  remaining: number;
  remainingFormatted: string;
  percent: number;
  deadline: string;
}

export function buildGoalsVM(goals: Goal[]): {
  goals: GoalVM[];
  onTrackCount: number;
  totalGoals: number;
} {
  const items = goals.map(g => {
    const target = toFiniteNumber(g.target);
    const saved = toFiniteNumber(g.saved);
    const remaining = Math.max(0, target - saved);
    const percent = Math.min(100, safePercent(saved, target));
    return {
      id: g.id,
      name: g.name,
      emoji: g.emoji || '🎯',
      target,
      targetFormatted: formatMoney(target),
      saved,
      savedFormatted: formatMoney(saved),
      remaining,
      remainingFormatted: formatMoney(remaining),
      percent,
      deadline: g.deadline ? new Date(g.deadline).toLocaleDateString() : 'N/A',
    };
  });

  const onTrackCount = items.filter(g => g.percent >= 50).length;
  return { goals: items, onTrackCount, totalGoals: items.length };
}

// ─── Quick Stats ───

export interface QuickStatsVM {
  avgMonthlySave: number;
  avgMonthlySaveFormatted: string;
  goalsOnTrack: string; // "2 / 3"
}

export function buildQuickStatsVM(budgetVM: BudgetOverviewVM, goalsVM: ReturnType<typeof buildGoalsVM>): QuickStatsVM {
  return {
    avgMonthlySave: Math.max(0, budgetVM.totalBudget - budgetVM.totalSpent),
    avgMonthlySaveFormatted: formatMoney(Math.max(0, budgetVM.totalBudget - budgetVM.totalSpent)),
    goalsOnTrack: `${goalsVM.onTrackCount} / ${goalsVM.totalGoals}`,
  };
}

// ─── Bills ───

export interface BillVM {
  id: string;
  name: string;
  amount: number;
  amountFormatted: string;
  dueDay: number;
  dueLabel: string;
  category: string;
  isPaid: boolean;
  isSkipped: boolean;
}

export function buildBillsVM(bills: Bill[]): BillVM[] {
  const now = new Date();
  return bills.map(b => {
    const isSkippedThisMonth = !b.isPaid && b.lastPaid
      ? false
      : (() => {
          const skipped = (b as any).lastSkipped;
          if (!skipped) return false;
          const d = new Date(skipped);
          return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
        })();

    return {
      id: b.id,
      name: (b as any).title || b.name,
      amount: toFiniteNumber(b.amount),
      amountFormatted: formatMoney(b.amount),
      dueDay: b.dueDay || 1,
      dueLabel: isSkippedThisMonth ? 'Skipped this month' : `Due day ${b.dueDay}`,
      category: b.category || 'Bills',
      isPaid: !!b.isPaid,
      isSkipped: isSkippedThisMonth,
    };
  });
}

// ═══════════════════════════════════════════
//  ME TAB VIEW MODELS
// ═══════════════════════════════════════════

export interface ProfileVM {
  name: string;
  email: string;
  initial: string;
  score: number;
  scoreLabel: string;
  isVerified: boolean;
  isComplete: boolean;
  accounts: AccountVM[];
}

export function buildProfileVM(user: Partial<User> & Record<string, any>, accounts: Account[]): ProfileVM {
  const name = user.name || 'User';
  const score = toFiniteNumber(user.mizanScore || user.score, 600);
  return {
    name,
    email: user.email || '',
    initial: name[0] || 'U',
    score,
    scoreLabel: score > 750 ? 'Excellent' : score > 600 ? 'Good' : 'Fair',
    isVerified: !!user.isProfileComplete,
    isComplete: !!user.isProfileComplete,
    accounts: buildAccountsVM(accounts),
  };
}

// ─── Forecast ───

export function buildForecastText(goalsVM: ReturnType<typeof buildGoalsVM>, budgetVM: BudgetOverviewVM): string {
  if (goalsVM.goals.length === 0) {
    return 'Set a savings goal to start getting personalized insights about your progress.';
  }
  const topGoal = goalsVM.goals[0];
  const onSchedule = budgetVM.percent < 70;
  return `At your current saving rate, you'll hit your ${topGoal.name} target ${onSchedule ? 'ahead of schedule' : 'on time'}!${onSchedule ? ' Consider redirecting surplus to another goal.' : ''}`;
}
