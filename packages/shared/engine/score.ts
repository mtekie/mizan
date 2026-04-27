import { User, Account, Transaction, Goal, Budget, Bill } from '../types';

export interface ScoreFactor {
  label: string;
  score: number; // 0-100 for this factor
  weight: number; // 0-1
  impact: 'positive' | 'negative' | 'neutral';
  message: string;
}

export interface ScoreResult {
  score: number; // 0-100 total
  factors: ScoreFactor[];
  version: string;
  lastUpdated: string;
}

/**
 * Calculates the Mizan Score (or Readiness) based on user profile and financial activity.
 * Version 0.1.0 logic:
 * - Profile Completeness (30%)
 * - Savings Consistency (20%)
 * - Budget Discipline (20%)
 * - Bill Payment Consistency (20%)
 * - Identity/Account Verification (10%)
 */
export function calculateMizanScore(
  user: User,
  accounts: Account[],
  transactions: Transaction[],
  goals: Goal[],
  budgets: Budget[],
  bills: Bill[],
  accountLinks: any[] = []
): ScoreResult {
  const factors: ScoreFactor[] = [];
  
  // 1. Profile Completeness (30%)
  const profileScore = user.isProfileComplete ? 100 : calculateProfileCompleteness(user);
  factors.push({
    label: 'Profile Completeness',
    score: profileScore,
    weight: 0.3,
    impact: profileScore > 70 ? 'positive' : profileScore > 30 ? 'neutral' : 'negative',
    message: profileScore === 100 ? 'Your profile is fully complete!' : 'Complete your profile to improve your score.',
  });

  // 2. Savings Consistency (20%)
  const savingsScore = calculateSavingsConsistency(goals, accounts);
  factors.push({
    label: 'Savings Consistency',
    score: savingsScore,
    weight: 0.2,
    impact: savingsScore > 70 ? 'positive' : savingsScore > 30 ? 'neutral' : 'negative',
    message: savingsScore > 70 ? 'Great job on your savings goals!' : 'Setting and meeting savings goals helps your score.',
  });

  // 3. Budget Discipline (20%)
  const budgetScore = calculateBudgetDiscipline(budgets, transactions);
  factors.push({
    label: 'Budget Discipline',
    score: budgetScore,
    weight: 0.2,
    impact: budgetScore > 70 ? 'positive' : budgetScore > 30 ? 'neutral' : 'negative',
    message: budgetScore > 70 ? 'You are staying within your budget!' : 'Keeping a regular budget improves your readiness.',
  });

  // 4. Bill Payment Consistency (20%)
  const billScore = calculateBillConsistency(bills);
  factors.push({
    label: 'Bill Payment',
    score: billScore,
    weight: 0.2,
    impact: billScore > 70 ? 'positive' : billScore > 30 ? 'neutral' : 'negative',
    message: billScore > 70 ? 'All your bills are paid on time.' : 'On-time bill payments are a strong trust signal.',
  });

  // 5. Identity/Account Verification (10%)
  const verificationScore = calculateVerificationScore(user, accountLinks);
  factors.push({
    label: 'Verification',
    score: verificationScore,
    weight: 0.1,
    impact: verificationScore > 70 ? 'positive' : verificationScore > 30 ? 'neutral' : 'negative',
    message: verificationScore > 70 ? 'Your identity and accounts are verified.' : 'Verify your accounts to reach the highest level.',
  });

  // Calculate weighted average
  const totalScore = Math.round(
    factors.reduce((sum, f) => sum + f.score * f.weight, 0)
  );

  return {
    score: totalScore,
    factors,
    version: '0.1.0',
    lastUpdated: new Date().toISOString(),
  };
}

function calculateProfileCompleteness(user: User): number {
  const fields = [
    'gender', 'dateOfBirth', 'educationLevel', 'employmentStatus', 
    'monthlyIncomeRange', 'familyStatus', 'financialPriority', 
    'riskAppetite', 'housingStatus', 'incomeStability'
  ];
  const filled = fields.filter(f => !!(user as any)[f]).length;
  return Math.round((filled / fields.length) * 100);
}

function calculateSavingsConsistency(goals: Goal[], accounts: Account[]): number {
  if (goals.length === 0) return 0;
  const progress = goals.reduce((sum, g) => {
    if (g.target <= 0) return sum + 1;
    return sum + Math.min(g.saved / g.target, 1);
  }, 0) / goals.length;
  return Math.min(Math.round(progress * 100), 100);
}

function calculateBudgetDiscipline(budgets: Budget[], transactions: Transaction[]): number {
  if (budgets.length === 0) return 0;
  // For v0.1.0, having a budget defined is 100% of this factor.
  // Future: Compare actual spending vs. limits.
  return 100;
}

function calculateBillConsistency(bills: Bill[]): number {
  if (bills.length === 0) return 0;
  const paidCount = bills.filter(b => b.isPaid).length;
  return Math.round((paidCount / bills.length) * 100);
}

function calculateVerificationScore(user: User, accountLinks: any[]): number {
  let score = 0;
  if (user.emailVerified) score += 30;
  
  if (accountLinks && accountLinks.length > 0) {
    const highestLevel = accountLinks.reduce((max, link) => {
      if (link.level === 'PHOTO_VERIFIED') return 100;
      if (link.level === 'ACCOUNT_LINKED') return Math.max(max, 70);
      return Math.max(max, 40);
    }, 0);
    score += (highestLevel * 0.7);
  }
  
  return Math.min(Math.round(score), 100);
}
