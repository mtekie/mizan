import {
  buildMoneySummaryVM,
  buildSpendingSummaryVM,
  demoAccounts,
  demoBills,
  demoBudgets,
  demoGoals,
  demoTransactions,
  demoUser,
  safePercent,
} from '@mizan/shared';

export type SearchParamsInput =
  | Promise<Record<string, string | string[] | undefined>>
  | Record<string, string | string[] | undefined>
  | undefined;

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export async function isParityDemo(searchParams: SearchParamsInput) {
  const params = searchParams instanceof Promise ? await searchParams : searchParams;
  return firstParam(params?.demo) === '1' || firstParam(params?.parity) === '1';
}

export const demoWebUser = {
  ...demoUser,
  score: demoUser.mizanScore,
};

export function buildDemoDashboardSummary() {
  const moneyVM = buildMoneySummaryVM(demoAccounts, demoTransactions);
  const spendingVM = buildSpendingSummaryVM(demoTransactions);
  const topGoal = demoGoals[0] ?? null;

  return {
    netWorth: moneyVM.totalBalance,
    monthlyIn: moneyVM.monthlyIn,
    monthlyOut: moneyVM.monthlyOut,
    savingsRate: moneyVM.savingsRate,
    topGoal,
    budgets: demoBudgets,
    cashFlowData: [
      { day: '30D Ago', amount: Math.max(0, moneyVM.totalBalance - 2500) },
      { day: '20D Ago', amount: Math.max(0, moneyVM.totalBalance - 1400) },
      { day: '10D Ago', amount: Math.max(0, moneyVM.totalBalance - 800) },
      { day: 'Today', amount: moneyVM.totalBalance },
      { day: '+10D', amount: Math.max(0, moneyVM.totalBalance - 500), isProjection: true },
      { day: '+20D', amount: Math.max(0, moneyVM.totalBalance - 1000), isProjection: true },
      { day: '+30D', amount: Math.max(0, moneyVM.totalBalance - 1500), isProjection: true },
    ],
    spendingData: spendingVM.categories.map(category => ({
      name: category.name,
      value: category.amount,
      color: category.color,
    })),
  };
}

export function buildDemoLedgerSummary() {
  const moneyVM = buildMoneySummaryVM(demoAccounts, demoTransactions);
  const spendingVM = buildSpendingSummaryVM(demoTransactions);

  return {
    totalBalance: moneyVM.totalBalance,
    monthlyIn: moneyVM.monthlyIn,
    monthlyOut: moneyVM.monthlyOut,
    savingsRate: moneyVM.savingsRate,
    totalSpending: spendingVM.totalSpent,
    spendingData: spendingVM.categories.map(category => ({
      name: category.name,
      value: category.amount,
      color: category.color,
    })),
    monthlyTrend: [
      { month: 'Nov', income: 0, expense: 0 },
      { month: 'Dec', income: 0, expense: 0 },
      { month: 'Jan', income: 0, expense: 0 },
      { month: 'Feb', income: 0, expense: 0 },
      { month: 'Mar', income: 0, expense: 0 },
      { month: 'Apr', income: moneyVM.monthlyIn, expense: moneyVM.monthlyOut },
    ],
  };
}

export function buildDemoGoalSummary() {
  const topGoal = demoGoals[0];
  return topGoal
    ? {
        ...topGoal,
        progress: safePercent(topGoal.saved, topGoal.target),
      }
    : null;
}
