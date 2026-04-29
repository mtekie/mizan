import type { Account, Notification, Transaction } from '../types';
import {
  buildBudgetOverviewVM,
  buildBillsVM,
  buildAccountsVM,
  buildForecastText,
  buildGoalsVM,
  buildMoneySummaryVM,
  buildProfileVM,
  buildQuickStatsVM,
  buildRecentTransactionsVM,
  buildSpendingSummaryVM,
  type AccountVM,
  type BudgetOverviewVM,
  type BillVM,
  type GoalVM,
  type MoneySummaryVM,
  type ProfileVM,
  type SpendingSummaryVM,
  type TransactionVM,
} from '../view-models';
import { AccountResponseSchema, TransactionResponseSchema } from '../validators';
import { getProductCategoryAsset, getProviderAsset } from '../assets';
import { getProductMatchScore, getProductProviderName, getProductTitle, productCategories } from '../product-catalogue';
import { z } from 'zod';

export interface MoneyScreenDataContract {
  summary: MoneySummaryVM;
  accounts: AccountVM[];
  recentTransactions: TransactionVM[];
  spending: SpendingSummaryVM;
  monthlyTrend: MoneyMonthlyTrendVM[];
  states: MoneyScreenStates;
  hasMoreTransactions: boolean;
}

export interface MoneyMonthlyTrendVM {
  month: string;
  income: number;
  expense: number;
}

export interface MoneyScreenStateCopy {
  title: string;
  description: string;
  actionLabel?: string;
}

export interface MoneyScreenStates {
  loading: MoneyScreenStateCopy;
  error: MoneyScreenStateCopy;
  accountsEmpty: MoneyScreenStateCopy;
  transactionsEmpty: MoneyScreenStateCopy;
  filteredTransactionsEmpty: MoneyScreenStateCopy;
}

export interface HomeQuickActionVM {
  key: string;
  label: string;
  href: string;
  nativeRoute: string;
  icon: string;
  color: string;
}

export interface HomeInsightVM {
  text: string;
  emoji: string;
}

export interface HomeCashFlowPointVM {
  day: string;
  amount: number;
  isProjection?: boolean;
}

export interface HomeScreenDataContract {
  profile: ProfileVM;
  score: {
    value: number;
    label: string;
    status: string;
  };
  money: MoneySummaryVM;
  budget: BudgetOverviewVM;
  recentTransactions: TransactionVM[];
  spending: SpendingSummaryVM;
  topGoal: GoalVM | null;
  insights: HomeInsightVM[];
  quickActions: HomeQuickActionVM[];
  cashFlowData: HomeCashFlowPointVM[];
  states: HomeScreenStates;
}

export interface HomeScreenContractInput {
  user: Record<string, any>;
  accounts: Account[];
  transactions: Transaction[];
  budgets: any[];
  goals?: any[];
}

export interface HomeScreenStates {
  loading: MoneyScreenStateCopy;
  error: MoneyScreenStateCopy;
  transactionsEmpty: MoneyScreenStateCopy;
}

export interface FindCategoryVM {
  key: string;
  label: string;
  icon: string;
  color: string;
  count: number;
}

export interface FindProviderVM {
  id: string;
  name: string;
  shortLabel: string;
  color: string;
  textColor: string;
  icon: string;
  productCount: number;
}

export interface FindProductVM {
  id: string;
  title: string;
  providerName: string;
  category: string;
  matchScore: number;
  matchLabel: string;
  isFeatured: boolean;
}

export interface FindScreenDataContract {
  categories: FindCategoryVM[];
  providers: FindProviderVM[];
  featuredProducts: FindProductVM[];
  productCount: number;
  states: {
    loading: MoneyScreenStateCopy;
    error: MoneyScreenStateCopy;
    empty: MoneyScreenStateCopy;
  };
}

export interface FindScreenContractInput {
  products: any[];
  providers?: any[];
}

export interface GoalsScreenDataContract {
  budget: BudgetOverviewVM;
  goals: GoalVM[];
  quickStats: ReturnType<typeof buildQuickStatsVM>;
  bills: BillVM[];
  forecastText: string;
  states: {
    loading: MoneyScreenStateCopy;
    error: MoneyScreenStateCopy;
    goalsEmpty: MoneyScreenStateCopy;
    billsEmpty: MoneyScreenStateCopy;
  };
}

export interface GoalsScreenContractInput {
  budgets: any[];
  goals: any[];
  bills: any[];
}

export interface ProfileScreenDataContract {
  profile: ProfileVM;
  accounts: AccountVM[];
  states: {
    loading: MoneyScreenStateCopy;
    error: MoneyScreenStateCopy;
    accountsEmpty: MoneyScreenStateCopy;
  };
}

export interface ProfileScreenContractInput {
  user: Record<string, any>;
  accounts: Account[];
}

export type NotificationFilterKey = 'All' | 'Actionable' | 'Info';

export interface NotificationVM {
  id: string;
  type: NotificationFilterKey;
  dateGroup: string;
  title: string;
  titleAmh?: string | null;
  subtitle: string;
  time: string;
  icon: string;
  isRead: boolean;
  isActionable: boolean;
}

export interface NotificationsScreenDataContract {
  notifications: NotificationVM[];
  groups: Array<{
    date: string;
    items: NotificationVM[];
  }>;
  filters: Array<{
    key: NotificationFilterKey;
    label: string;
    count: number;
  }>;
  unreadCount: number;
  actionableCount: number;
  states: {
    loading: MoneyScreenStateCopy;
    error: MoneyScreenStateCopy;
    empty: MoneyScreenStateCopy;
  };
}

export interface NotificationsScreenContractInput {
  notifications: Notification[];
}

export interface ScoreFactorVM {
  label: string;
  score: number;
  impact: 'positive' | 'neutral' | 'negative';
  message: string;
}

export interface ScoreScreenDataContract {
  value: number;
  label: string;
  status: string;
  factors: ScoreFactorVM[];
  tip: string;
  states: {
    loading: MoneyScreenStateCopy;
    error: MoneyScreenStateCopy;
  };
}

export interface ScoreScreenContractInput {
  scoreValue: number;
  factors: any[];
  tip: string;
}

export interface ProductFactVM {
  label: string;
  value: string;
  positive: boolean;
}

export interface CatalogueProductCardVM {
  id: string;
  title: string;
  description: string;
  highlight?: string;
  interestDisplay: string;
  maxAmountDisplay?: string;
  minBalanceDisplay?: string;
  isDigital: boolean;
  isInterestFree: boolean;
}

export interface ProviderDetailDataContract {
  id: string;
  name: string;
  nameAmh?: string;
  shortCode: string;
  brandColor?: string;
  description: string;
  founded: string;
  stats: {
    productCount: number;
    interestRange: string;
    hasDigital: boolean;
  };
  badges: {
    isEsxListed: boolean;
    hasInterestFree: boolean;
    isMfi: boolean;
  };
  creditProducts: CatalogueProductCardVM[];
  savingsProducts: CatalogueProductCardVM[];
}

export interface ProductDetailDataContract {
  id: string;
  title: string;
  description: string;
  productKind: string;
  isCreditProduct: boolean;
  provider: {
    id: string;
    name: string;
    nameAmh?: string;
    logoUrl?: string;
    brandColor?: string;
    shortCode: string;
    tier?: string;
    description?: string;
  };
  badges: {
    isDigital: boolean;
    isInterestFree: boolean;
    isGenderFocused: boolean;
  };
  trust: {
    label: string;
    tone: 'good' | 'warn';
    freshness: string;
    source: string;
  };
  matchExplanation: string;
  facts: ProductFactVM[];
  metrics: {
    interestDisplay: string;
    amountLabel: string;
    amountDisplay: string;
    termDisplay?: string;
    currencyDisplay?: string;
  };
  details: {
    features: string[];
    eligibility: string[];
    requirements: string[];
    collateralRequirements?: string;
    insuranceRequirements?: string;
  };
  feesAndTerms: {
    processingFee?: string;
    repaymentFrequency?: string;
    disbursementTime?: string;
    prepaymentPenalties?: string;
    latePaymentPenalties?: string;
  } | null;
  dataQuality: {
    confidence?: number;
    sourceUrl?: string;
  };
  rawCalculatorData?: {
    interestRate?: number;
    interestMax?: number;
    maxAmount?: number;
    term?: string;
    fees?: string;
    repaymentFrequency?: string;
    disbursementTime?: string;
    collateralRequirements?: string;
    prepaymentPenalties?: string;
  };
  isBookmarked: boolean;
  personalizedScore?: number;
}


export const MoneySummaryVMSchema = z.object({
  totalBalance: z.number(),
  totalBalanceFormatted: z.string(),
  monthlyIn: z.number(),
  monthlyInFormatted: z.string(),
  monthlyOut: z.number(),
  monthlyOutFormatted: z.string(),
  savingsRate: z.number(),
  savingsRateFormatted: z.string(),
  changePercent: z.number(),
  changeFormatted: z.string(),
});

export const AccountVMSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  number: z.string(),
  balance: z.number(),
  balanceFormatted: z.string(),
  color: z.string(),
  textColor: z.string(),
  icon: z.string(),
  bank: z.string(),
  typeLabel: z.string(),
});

export const TransactionVMSchema = z.object({
  id: z.string(),
  title: z.string(),
  category: z.string(),
  amount: z.number(),
  amountFormatted: z.string(),
  source: z.string(),
  date: z.string(),
  emoji: z.string(),
  isIncome: z.boolean(),
});

export const SpendingCategoryVMSchema = z.object({
  name: z.string(),
  amount: z.number(),
  amountFormatted: z.string(),
  percent: z.number(),
  color: z.string(),
});

export const SpendingSummaryVMSchema = z.object({
  totalSpent: z.number(),
  totalSpentFormatted: z.string(),
  monthLabel: z.string(),
  categories: z.array(SpendingCategoryVMSchema),
  topCategory: z.string(),
});

export const MoneyMonthlyTrendVMSchema = z.object({
  month: z.string(),
  income: z.number(),
  expense: z.number(),
});

export const MoneyScreenStateCopySchema = z.object({
  title: z.string(),
  description: z.string(),
  actionLabel: z.string().optional(),
});

export const MoneyScreenStatesSchema = z.object({
  loading: MoneyScreenStateCopySchema,
  error: MoneyScreenStateCopySchema,
  accountsEmpty: MoneyScreenStateCopySchema,
  transactionsEmpty: MoneyScreenStateCopySchema,
  filteredTransactionsEmpty: MoneyScreenStateCopySchema,
});

export const MoneyScreenDataContractSchema = z.object({
  summary: MoneySummaryVMSchema,
  accounts: z.array(AccountVMSchema),
  recentTransactions: z.array(TransactionVMSchema),
  spending: SpendingSummaryVMSchema,
  monthlyTrend: z.array(MoneyMonthlyTrendVMSchema),
  states: MoneyScreenStatesSchema,
  hasMoreTransactions: z.boolean(),
});

export const MoneyScreenApiResponseSchema = z.object({
  accounts: z.array(AccountResponseSchema),
  transactions: z.array(TransactionResponseSchema),
  money: MoneyScreenDataContractSchema,
});

export type MoneyScreenApiResponse = z.infer<typeof MoneyScreenApiResponseSchema> & {
  money: MoneyScreenDataContract;
};

export const HomeQuickActionVMSchema = z.object({
  key: z.string(),
  label: z.string(),
  href: z.string(),
  nativeRoute: z.string(),
  icon: z.string(),
  color: z.string(),
});

export const HomeInsightVMSchema = z.object({
  text: z.string(),
  emoji: z.string(),
});

export const HomeCashFlowPointVMSchema = z.object({
  day: z.string(),
  amount: z.number(),
  isProjection: z.boolean().optional(),
});

export const HomeGoalVMSchema = z.object({
  id: z.string(),
  name: z.string(),
  emoji: z.string(),
  target: z.number(),
  targetFormatted: z.string(),
  saved: z.number(),
  savedFormatted: z.string(),
  remaining: z.number(),
  remainingFormatted: z.string(),
  percent: z.number(),
  deadline: z.string(),
});

export const HomeBudgetCategoryVMSchema = z.object({
  id: z.string(),
  name: z.string(),
  allocated: z.number(),
  allocatedFormatted: z.string(),
  spent: z.number(),
  spentFormatted: z.string(),
  percent: z.number(),
  isOverBudget: z.boolean(),
});

export const HomeBudgetOverviewVMSchema = z.object({
  totalBudget: z.number(),
  totalBudgetFormatted: z.string(),
  totalSpent: z.number(),
  totalSpentFormatted: z.string(),
  remainingFormatted: z.string(),
  percent: z.number(),
  isOverBudget: z.boolean(),
  categories: z.array(HomeBudgetCategoryVMSchema),
  monthLabel: z.string(),
});

export const HomeProfileVMSchema = z.object({
  name: z.string(),
  email: z.string(),
  initial: z.string(),
  score: z.number(),
  scoreLabel: z.string(),
  isVerified: z.boolean(),
  isComplete: z.boolean(),
  accounts: z.array(AccountVMSchema),
});

export const HomeScreenDataContractSchema = z.object({
  profile: HomeProfileVMSchema,
  score: z.object({
    value: z.number(),
    label: z.string(),
    status: z.string(),
  }),
  money: MoneySummaryVMSchema,
  budget: HomeBudgetOverviewVMSchema,
  recentTransactions: z.array(TransactionVMSchema),
  spending: SpendingSummaryVMSchema,
  topGoal: HomeGoalVMSchema.nullable(),
  insights: z.array(HomeInsightVMSchema),
  quickActions: z.array(HomeQuickActionVMSchema),
  cashFlowData: z.array(HomeCashFlowPointVMSchema),
  states: z.object({
    loading: MoneyScreenStateCopySchema,
    error: MoneyScreenStateCopySchema,
    transactionsEmpty: MoneyScreenStateCopySchema,
  }),
});

export const HomeScreenApiResponseSchema = z.object({
  user: z.any(),
  accounts: z.array(AccountResponseSchema),
  recentTransactions: z.array(TransactionResponseSchema),
  budgets: z.array(z.any()),
  home: HomeScreenDataContractSchema,
});

export type HomeScreenApiResponse = z.infer<typeof HomeScreenApiResponseSchema> & {
  home: HomeScreenDataContract;
};

export const FindCategoryVMSchema = z.object({
  key: z.string(),
  label: z.string(),
  icon: z.string(),
  color: z.string(),
  count: z.number(),
});

export const FindProviderVMSchema = z.object({
  id: z.string(),
  name: z.string(),
  shortLabel: z.string(),
  color: z.string(),
  textColor: z.string(),
  icon: z.string(),
  productCount: z.number(),
});

export const FindProductVMSchema = z.object({
  id: z.string(),
  title: z.string(),
  providerName: z.string(),
  category: z.string(),
  matchScore: z.number(),
  matchLabel: z.string(),
  isFeatured: z.boolean(),
});

export const FindScreenDataContractSchema = z.object({
  categories: z.array(FindCategoryVMSchema),
  providers: z.array(FindProviderVMSchema),
  featuredProducts: z.array(FindProductVMSchema),
  productCount: z.number(),
  states: z.object({
    loading: MoneyScreenStateCopySchema,
    error: MoneyScreenStateCopySchema,
    empty: MoneyScreenStateCopySchema,
  }),
});

export const FindScreenApiResponseSchema = z.object({
  products: z.array(z.any()),
  providers: z.array(z.any()),
  featured: z.array(z.any()),
  find: FindScreenDataContractSchema,
  profile: z.any().nullable(),
});

export type FindScreenApiResponse = z.infer<typeof FindScreenApiResponseSchema> & {
  find: FindScreenDataContract;
};

export const GoalsScreenDataContractSchema = z.object({
  budget: HomeBudgetOverviewVMSchema,
  goals: z.array(HomeGoalVMSchema),
  quickStats: z.object({
    avgMonthlySave: z.number(),
    avgMonthlySaveFormatted: z.string(),
    goalsOnTrack: z.string(),
  }),
  bills: z.array(z.object({
    id: z.string(),
    name: z.string(),
    amount: z.number(),
    amountFormatted: z.string(),
    dueDay: z.number(),
    dueLabel: z.string(),
    category: z.string(),
    isPaid: z.boolean(),
    isSkipped: z.boolean(),
  })),
  forecastText: z.string(),
  states: z.object({
    loading: MoneyScreenStateCopySchema,
    error: MoneyScreenStateCopySchema,
    goalsEmpty: MoneyScreenStateCopySchema,
    billsEmpty: MoneyScreenStateCopySchema,
  }),
});

export const GoalsScreenApiResponseSchema = z.object({
  budgets: z.array(z.any()),
  goals: z.array(z.any()),
  bills: z.array(z.any()),
  goalsScreen: GoalsScreenDataContractSchema,
});

export type GoalsScreenApiResponse = z.infer<typeof GoalsScreenApiResponseSchema> & {
  goalsScreen: GoalsScreenDataContract;
};

export const ProfileScreenDataContractSchema = z.object({
  profile: HomeProfileVMSchema,
  accounts: z.array(AccountVMSchema),
  states: z.object({
    loading: MoneyScreenStateCopySchema,
    error: MoneyScreenStateCopySchema,
    accountsEmpty: MoneyScreenStateCopySchema,
  }),
});

export const ProfileScreenApiResponseSchema = z.object({
  user: z.any(),
  accounts: z.array(AccountResponseSchema),
  profileScreen: ProfileScreenDataContractSchema,
});

export type ProfileScreenApiResponse = z.infer<typeof ProfileScreenApiResponseSchema> & {
  profileScreen: ProfileScreenDataContract;
};

export const NotificationVMSchema = z.object({
  id: z.string(),
  type: z.enum(['All', 'Actionable', 'Info']),
  dateGroup: z.string(),
  title: z.string(),
  titleAmh: z.string().nullable().optional(),
  subtitle: z.string(),
  time: z.string(),
  icon: z.string(),
  isRead: z.boolean(),
  isActionable: z.boolean(),
});

export const NotificationsScreenDataContractSchema = z.object({
  notifications: z.array(NotificationVMSchema),
  groups: z.array(z.object({
    date: z.string(),
    items: z.array(NotificationVMSchema),
  })),
  filters: z.array(z.object({
    key: z.enum(['All', 'Actionable', 'Info']),
    label: z.string(),
    count: z.number(),
  })),
  unreadCount: z.number(),
  actionableCount: z.number(),
  states: z.object({
    loading: MoneyScreenStateCopySchema,
    error: MoneyScreenStateCopySchema,
    empty: MoneyScreenStateCopySchema,
  }),
});

export const NotificationsScreenApiResponseSchema = z.object({
  notifications: z.array(z.any()),
  notificationsScreen: NotificationsScreenDataContractSchema,
});

export type NotificationsScreenApiResponse = z.infer<typeof NotificationsScreenApiResponseSchema> & {
  notificationsScreen: NotificationsScreenDataContract;
};

export const ScoreFactorVMSchema = z.object({
  label: z.string(),
  score: z.number(),
  impact: z.enum(['positive', 'neutral', 'negative']),
  message: z.string(),
});

export const ScoreScreenDataContractSchema = z.object({
  value: z.number(),
  label: z.string(),
  status: z.string(),
  factors: z.array(ScoreFactorVMSchema),
  tip: z.string(),
  states: z.object({
    loading: MoneyScreenStateCopySchema,
    error: MoneyScreenStateCopySchema,
  }),
});

export const ScoreScreenApiResponseSchema = z.object({
  scoreScreen: ScoreScreenDataContractSchema,
});

export type ScoreScreenApiResponse = z.infer<typeof ScoreScreenApiResponseSchema> & {
  scoreScreen: ScoreScreenDataContract;
};

export const ProductDetailApiResponseSchema = z.object({
  productDetail: z.any(),
});

export type ProductDetailApiResponse = {
  productDetail: ProductDetailDataContract;
};

export const ProviderDetailApiResponseSchema = z.object({
  providerDetail: z.any(),
});

export type ProviderDetailApiResponse = {
  providerDetail: ProviderDetailDataContract;
};

export interface MoneyScreenContractInput {
  accounts: Account[];
  transactions: Transaction[];
  recentTransactionLimit?: number;
}

export function buildMoneyScreenDataContract({
  accounts,
  transactions,
  recentTransactionLimit = 5,
}: MoneyScreenContractInput): MoneyScreenDataContract {
  const recent = buildRecentTransactionsVM(transactions, recentTransactionLimit);

  return {
    summary: buildMoneySummaryVM(accounts, transactions),
    accounts: buildAccountsVM(accounts),
    recentTransactions: recent.transactions,
    spending: buildSpendingSummaryVM(transactions),
    monthlyTrend: buildMoneyMonthlyTrendVM(transactions),
    states: buildMoneyScreenStates(),
    hasMoreTransactions: recent.hasMore,
  };
}

export function buildHomeScreenDataContract({
  user,
  accounts,
  transactions,
  budgets,
  goals = [],
}: HomeScreenContractInput): HomeScreenDataContract {
  const money = buildMoneySummaryVM(accounts, transactions);
  const budget = buildBudgetOverviewVM(budgets);
  const recent = buildRecentTransactionsVM(transactions, 3);
  const spending = buildSpendingSummaryVM(transactions);
  const goalsVM = buildGoalsVM(goals);
  const scoreValue = Number.isFinite(Number(user.mizanScore ?? user.score)) ? Number(user.mizanScore ?? user.score) : 600;
  const scoreLabel = scoreValue > 750 ? 'Excellent' : scoreValue > 600 ? 'Good' : 'Fair';

  return {
    profile: buildProfileVM(user, accounts),
    score: {
      value: scoreValue,
      label: scoreLabel,
      status: 'Improving • Last updated today',
    },
    money,
    budget,
    recentTransactions: recent.transactions,
    spending,
    topGoal: goalsVM.goals[0] ?? null,
    insights: buildHomeInsights(money, goalsVM, budget),
    quickActions: buildHomeQuickActions(),
    cashFlowData: buildHomeCashFlowData(accounts, transactions, money.monthlyOut),
    states: buildHomeScreenStates(),
  };
}

export function buildHomeScreenStates(): HomeScreenStates {
  return {
    loading: {
      title: 'Loading Home',
      description: 'Refreshing your score, money summary, and recent activity.',
    },
    error: {
      title: 'Home could not load',
      description: 'Check your connection and try again.',
      actionLabel: 'Try again',
    },
    transactionsEmpty: {
      title: 'No transactions yet',
      description: 'Log your first transaction to see recent activity here.',
      actionLabel: 'Open Money',
    },
  };
}

export function buildHomeQuickActions(): HomeQuickActionVM[] {
  return [
    { key: 'send', label: 'Send', href: '/transfer', nativeRoute: '/(tabs)/ledger', icon: 'arrow-up-right', color: '#3B82F6' },
    { key: 'request', label: 'Request', href: '/transfer', nativeRoute: '/(tabs)/ledger', icon: 'arrow-down-left', color: '#10B981' },
    { key: 'pay', label: 'Pay', href: '/ledger?action=pay', nativeRoute: '/(tabs)/ledger', icon: 'credit-card', color: '#8B5CF6' },
    { key: 'airtime', label: 'Airtime', href: '/ledger?action=airtime', nativeRoute: '/(tabs)/ledger', icon: 'smartphone', color: '#F59E0B' },
  ];
}

export function buildHomeInsights(
  money: MoneySummaryVM,
  goalsVM: ReturnType<typeof buildGoalsVM>,
  budget: BudgetOverviewVM,
): HomeInsightVM[] {
  return [
    {
      text: `You're saving ${money.savingsRate}% of your income this month. Keep the habit visible.`,
      emoji: 'target',
    },
    {
      text: money.monthlyOut > 20000
        ? `You've spent ${money.monthlyOutFormatted} this month. Review the top category before the month gets away from you.`
        : "You're doing great. Your spending is under control this month.",
      emoji: 'lightbulb',
    },
    {
      text: buildForecastText(goalsVM, budget),
      emoji: 'sparkles',
    },
    {
      text: `Your net worth is now ${money.totalBalanceFormatted}.`,
      emoji: 'chart',
    },
  ];
}

export function buildHomeCashFlowData(
  accounts: Account[],
  transactions: Transaction[],
  monthlyOut: number,
): HomeCashFlowPointVM[] {
  const now = new Date();
  const totalBalance = accounts.reduce((sum, account) => {
    const balance = Number.isFinite(Number(account.balance)) ? Number(account.balance) : 0;
    return sum + balance;
  }, 0);

  const historical = [30, 20, 10, 0].map(days => {
    const dateLimit = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const balanceDelta = transactions
      .filter(tx => new Date(tx.date) > dateLimit)
      .reduce((sum, tx) => {
        const amount = Number.isFinite(Number(tx.amount)) ? Number(tx.amount) : 0;
        return sum + amount;
      }, 0);

    return {
      day: days === 0 ? 'Today' : `${days}D Ago`,
      amount: Math.max(0, totalBalance - balanceDelta),
    };
  });

  const averageDailyOut = monthlyOut / 30;
  const projected = [10, 20, 30].map(days => ({
    day: `+${days}D`,
    amount: Math.max(0, totalBalance - averageDailyOut * days),
    isProjection: true,
  }));

  return [...historical, ...projected];
}

export function buildFindScreenDataContract({
  products,
  providers = [],
}: FindScreenContractInput): FindScreenDataContract {
  const categories = productCategories.map(category => {
    const asset = getProductCategoryAsset(category.key);
    const count = category.key === 'all'
      ? products.length
      : products.filter(product => product.productClass === category.key || product.category === category.key).length;

    return {
      key: category.key,
      label: category.label,
      icon: category.key === 'all' ? 'sparkles' : asset.icon,
      color: asset.color,
      count,
    };
  });

  const providerMap = new Map<string, FindProviderVM>();

  for (const provider of providers) {
    const id = String(provider.id);
    const asset = getProviderAsset(provider.name);
    providerMap.set(id, {
      id,
      name: provider.name || asset.label,
      shortLabel: provider.shortCode || asset.shortLabel,
      color: provider.brandColor || asset.color,
      textColor: asset.textColor,
      icon: asset.icon,
      productCount: Number(provider.productCount ?? provider._count?.products ?? 0),
    });
  }

  for (const product of products) {
    const id = product.provider?.id || product.providerId || product.bankId || product.instituteId || product.bankName || 'unknown';
    const key = String(id);
    if (!providerMap.has(key)) {
      const name = product.provider?.name || product.bankName || getProductProviderName(product);
      const asset = getProviderAsset(name);
      providerMap.set(key, {
        id: key,
        name,
        shortLabel: product.provider?.shortCode || product.bankLogo || asset.shortLabel,
        color: product.provider?.brandColor || asset.color,
        textColor: asset.textColor,
        icon: asset.icon,
        productCount: products.filter(item => String(item.provider?.id || item.providerId || item.bankId || item.instituteId || item.bankName || 'unknown') === key).length,
      });
    }
  }

  return {
    categories,
    providers: Array.from(providerMap.values()).sort((a, b) => a.name.localeCompare(b.name)),
    featuredProducts: products.filter(product => product.isFeatured).slice(0, 5).map(buildFindProductVM),
    productCount: products.length,
    states: buildFindScreenStates(),
  };
}

export function buildFindProductVM(product: any): FindProductVM {
  const matchScore = getProductMatchScore(product);
  return {
    id: String(product.id),
    title: getProductTitle(product),
    providerName: getProductProviderName(product),
    category: product.productClass || product.category || 'Product',
    matchScore,
    matchLabel: matchScore >= 80 ? 'Strong match' : matchScore >= 60 ? 'Potential match' : 'Needs profile data',
    isFeatured: Boolean(product.isFeatured),
  };
}

export function buildFindScreenStates() {
  return {
    loading: {
      title: 'Loading products',
      description: 'Refreshing providers, categories, and product matches.',
    },
    error: {
      title: 'Products could not load',
      description: 'Check your connection and try again.',
      actionLabel: 'Try again',
    },
    empty: {
      title: 'No products found',
      description: 'Try clearing filters or searching by provider, product type, or use case.',
      actionLabel: 'Clear filters',
    },
  };
}

export function buildGoalsScreenDataContract({
  budgets,
  goals,
  bills,
}: GoalsScreenContractInput): GoalsScreenDataContract {
  const budget = buildBudgetOverviewVM(budgets);
  const goalsVM = buildGoalsVM(goals);

  return {
    budget,
    goals: goalsVM.goals,
    quickStats: buildQuickStatsVM(budget, goalsVM),
    bills: buildBillsVM(bills),
    forecastText: buildForecastText(goalsVM, budget),
    states: buildGoalsScreenStates(),
  };
}

export function buildGoalsScreenStates() {
  return {
    loading: {
      title: 'Loading Goals',
      description: 'Refreshing budgets, bills, and savings goals.',
    },
    error: {
      title: 'Goals could not load',
      description: 'Check your connection and try again.',
      actionLabel: 'Try again',
    },
    goalsEmpty: {
      title: 'No goals yet',
      description: 'Create a savings goal to start tracking progress.',
      actionLabel: 'Add goal',
    },
    billsEmpty: {
      title: 'No bills yet',
      description: 'Add your first reminder to keep recurring payments visible.',
      actionLabel: 'Add bill',
    },
  };
}

export function buildProfileScreenDataContract({
  user,
  accounts,
}: ProfileScreenContractInput): ProfileScreenDataContract {
  return {
    profile: buildProfileVM(user, accounts),
    accounts: buildAccountsVM(accounts),
    states: buildProfileScreenStates(),
  };
}

export function buildProfileScreenStates() {
  return {
    loading: {
      title: 'Loading profile',
      description: 'Refreshing your identity and connected accounts.',
    },
    error: {
      title: 'Profile could not load',
      description: 'Check your connection and try again.',
      actionLabel: 'Try again',
    },
    accountsEmpty: {
      title: 'No accounts connected',
      description: 'Add your first account from Money to see balances here.',
      actionLabel: 'Open Money',
    },
  };
}

export function buildNotificationsScreenDataContract({
  notifications,
}: NotificationsScreenContractInput): NotificationsScreenDataContract {
  const normalized = notifications.map(buildNotificationVM);
  const groupsMap = new Map<string, NotificationVM[]>();

  for (const notification of normalized) {
    const current = groupsMap.get(notification.dateGroup) ?? [];
    current.push(notification);
    groupsMap.set(notification.dateGroup, current);
  }

  const filters: NotificationsScreenDataContract['filters'] = [
    { key: 'All', label: 'All', count: normalized.length },
    { key: 'Actionable', label: 'Actionable', count: normalized.filter(item => item.type === 'Actionable').length },
    { key: 'Info', label: 'Info', count: normalized.filter(item => item.type === 'Info').length },
  ];

  return {
    notifications: normalized,
    groups: Array.from(groupsMap.entries()).map(([date, items]) => ({ date, items })),
    filters,
    unreadCount: normalized.filter(item => !item.isRead).length,
    actionableCount: normalized.filter(item => item.isActionable).length,
    states: buildNotificationsScreenStates(),
  };
}

export function buildNotificationVM(notification: Notification): NotificationVM {
  const createdAt = notification.createdAt ? new Date(notification.createdAt) : new Date();
  const isToday = createdAt.toDateString() === new Date().toDateString();
  const type = String(notification.type || '').toLowerCase() === 'actionable' ? 'Actionable' : 'Info';

  return {
    id: notification.id,
    type,
    dateGroup: isToday ? 'Today' : 'Earlier',
    title: notification.title,
    titleAmh: notification.titleAmh,
    subtitle: notification.subtitle || '',
    time: isToday
      ? createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      : createdAt.toLocaleDateString([], { month: 'short', day: 'numeric' }),
    icon: notification.icon || (type === 'Actionable' ? 'alert-triangle' : 'bell'),
    isRead: Boolean(notification.isRead),
    isActionable: type === 'Actionable',
  };
}

export function buildNotificationsScreenStates() {
  return {
    loading: {
      title: 'Loading notifications',
      description: 'Refreshing reminders, alerts, and updates.',
    },
    error: {
      title: 'Notifications could not load',
      description: 'Check your connection and try again.',
      actionLabel: 'Try again',
    },
    empty: {
      title: 'All caught up',
      description: "You don't have any notifications at the moment.",
    },
  };
}

export function buildScoreScreenDataContract({
  scoreValue,
  factors,
  tip,
}: ScoreScreenContractInput): ScoreScreenDataContract {
  const value = Number.isFinite(Number(scoreValue)) ? Number(scoreValue) : 60;
  const label = value > 80 ? 'Excellent' : value > 60 ? 'Good' : 'Fair';

  const normalizedFactors: ScoreFactorVM[] = factors.map(f => ({
    label: f.label || '',
    score: Number(f.score) || 0,
    impact: ['positive', 'neutral', 'negative'].includes(f.impact) ? f.impact : 'neutral',
    message: f.message || '',
  }));

  return {
    value,
    label,
    status: 'Improving • Last updated today',
    factors: normalizedFactors,
    tip,
    states: buildScoreScreenStates(),
  };
}

export function buildScoreScreenStates() {
  return {
    loading: {
      title: 'Loading Mizan Score',
      description: 'Refreshing your trust indicators and financial health.',
    },
    error: {
      title: 'Score could not load',
      description: 'Check your connection and try again.',
      actionLabel: 'Try again',
    },
  };
}

export function buildMoneyScreenStates(): MoneyScreenStates {
  return {
    loading: {
      title: 'Loading money data',
      description: 'Refreshing your accounts and recent activity.',
    },
    error: {
      title: 'Money data could not load',
      description: 'Check your connection and try again.',
      actionLabel: 'Try again',
    },
    accountsEmpty: {
      title: 'Add your first account',
      description: 'Start with cash, telebirr, CBE, or any account you track manually.',
      actionLabel: 'Add Account',
    },
    transactionsEmpty: {
      title: 'No transactions yet',
      description: 'Log your first income, expense, or transfer to start seeing activity.',
      actionLabel: 'Log first transaction',
    },
    filteredTransactionsEmpty: {
      title: 'No matching transactions',
      description: 'Try clearing filters or log a transaction for this category.',
      actionLabel: 'Clear filters',
    },
  };
}

export function buildMoneyMonthlyTrendVM(transactions: Transaction[]): MoneyMonthlyTrendVM[] {
  const now = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  return Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
    const month = date.getMonth();
    const year = date.getFullYear();

    const monthTransactions = transactions.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === month && txDate.getFullYear() === year;
    });

    const totals = monthTransactions.reduce(
      (acc, tx) => {
        const amount = Number.isFinite(Number(tx.amount)) ? Number(tx.amount) : 0;
        if (amount > 0) acc.income += amount;
        if (amount < 0) acc.expense += Math.abs(amount);
        return acc;
      },
      { income: 0, expense: 0 },
    );

    return {
      month: monthNames[month],
      income: totals.income,
      expense: totals.expense,
    };
  });
}

export function buildProviderDetailDataContract(bank: any, bankProducts: any[]): ProviderDetailDataContract {
  const loanProducts = bankProducts.filter(p => p.productClass === 'CREDIT' || Boolean(p.loanCategory || p.maxAmount));
  const savingsProducts = bankProducts.filter(p => p.productClass === 'SAVINGS' || Boolean(p.minBalance));

  const interestRates = bankProducts.map(p => p.interestRate).filter(Boolean) as number[];
  const minRate = interestRates.length > 0 ? Math.min(...interestRates) : 0;
  const maxRate = interestRates.length > 0 ? Math.max(...interestRates) : 0;
  const formatInterest = (val: number) => val < 1 ? (val * 100).toFixed(0) : val.toFixed(0);
  const hasDigital = bankProducts.some(p => p.digital);
  const hasInterestFree = bankProducts.some(p => p.interestFree);

  const mapCard = (product: any): CatalogueProductCardVM => {
    const interestDisplay = `${formatInterest(product.interestRate || 0)}%${product.interestMax && product.interestMax > (product.interestRate || 0) ? `–${formatInterest(product.interestMax)}%` : ''}`;
    return {
      id: product.id,
      title: product.title || product.name,
      description: product.description,
      highlight: product.highlight,
      interestDisplay,
      maxAmountDisplay: product.maxAmount ? `Up to ${product.maxAmount.toLocaleString()} ETB` : undefined,
      minBalanceDisplay: product.minBalance ? `Min. ${product.minBalance.toLocaleString()} ETB` : undefined,
      isDigital: !!product.digital,
      isInterestFree: !!product.interestFree,
    };
  };

  return {
    id: bank.slug || bank.id,
    name: bank.name,
    nameAmh: bank.nameAmh,
    shortCode: bank.shortCode || bank.slug.slice(0, 2).toUpperCase(),
    brandColor: bank.brandColor,
    description: bank.description,
    founded: bank.founded || '—',
    stats: {
      productCount: bankProducts.length,
      interestRange: `${formatInterest(minRate)}–${formatInterest(maxRate)}%`,
      hasDigital,
    },
    badges: {
      isEsxListed: !!bank.esxListed,
      hasInterestFree,
      isMfi: bank.type === 'MFI',
    },
    creditProducts: loanProducts.map(mapCard),
    savingsProducts: savingsProducts.map(mapCard),
  };
}

export function buildProductDetailDataContract(product: any, isBookmarked: boolean, facts: any[], trust: any, matchExplanation: string): ProductDetailDataContract {
  const provider = product.provider || {};
  const isCreditProduct = product.productClass === 'CREDIT' || Boolean(product.loanCategory || product.maxAmount);
  const productKind = isCreditProduct ? 'Loan' : product.productClass === 'SAVINGS' ? 'Savings' : product.productType || product.productClass || 'Product';

  const formatInterest = (val: number) => val < 1 ? (val * 100).toFixed(0) : val.toFixed(0);
  const interestDisplay = product.interestMax && product.interestMax > (product.interestRate || 0)
      ? `${formatInterest(product.interestRate || 0)}–${formatInterest(product.interestMax)}%`
      : `${formatInterest(product.interestRate || 0)}%`;

  return {
    id: product.id,
    title: product.title || product.name,
    description: product.description,
    productKind,
    isCreditProduct,
    provider: {
      id: provider.id || product.bankId,
      name: provider.name || product.bankName || 'Financial Institution',
      nameAmh: provider.nameAmh,
      logoUrl: provider.logoUrl,
      brandColor: provider.brandColor,
      shortCode: provider.shortCode || product.bankLogo || 'FI',
      tier: provider.tier,
      description: provider.description,
    },
    badges: {
      isDigital: !!product.digital,
      isInterestFree: !!product.interestFree,
      isGenderFocused: !!product.genderBased,
    },
    trust: {
      label: trust.label,
      tone: trust.tone,
      freshness: trust.freshness,
      source: trust.source,
    },
    matchExplanation,
    facts: facts.map(f => ({ label: f.label, value: f.value, positive: !!f.positive })),
    metrics: {
      interestDisplay,
      amountLabel: isCreditProduct ? 'Max Loan' : 'Min Balance',
      amountDisplay: isCreditProduct
          ? (product.maxAmount ? `${product.maxAmount.toLocaleString()}` : 'N/A')
          : (product.minBalance ? `${product.minBalance.toLocaleString()}` : '0'),
      termDisplay: product.term,
      currencyDisplay: product.currency,
    },
    details: {
      features: product.features || [],
      eligibility: Array.isArray(product.eligibility) ? product.eligibility : (product.eligibility ? [product.eligibility] : []),
      requirements: Array.isArray(product.requirements) ? product.requirements : (product.requirements ? [product.requirements] : []),
      collateralRequirements: product.collateralRequirements,
      insuranceRequirements: product.insuranceRequirements,
    },
    feesAndTerms: (product.fees || product.prepaymentPenalties || product.latePaymentPenalties || product.repaymentFrequency || product.disbursementTime) ? {
      processingFee: product.fees,
      repaymentFrequency: product.repaymentFrequency,
      disbursementTime: product.disbursementTime,
      prepaymentPenalties: product.prepaymentPenalties,
      latePaymentPenalties: product.latePaymentPenalties,
    } : null,
    dataQuality: {
      confidence: product.dataConfidence,
      sourceUrl: product.sourceUrl,
    },
    rawCalculatorData: {
      interestRate: product.interestRate,
      interestMax: product.interestMax,
      maxAmount: product.maxAmount,
      term: product.term,
      fees: product.fees,
      repaymentFrequency: product.repaymentFrequency,
      disbursementTime: product.disbursementTime,
      collateralRequirements: product.collateralRequirements,
      prepaymentPenalties: product.prepaymentPenalties,
    },
    isBookmarked,
    personalizedScore: product.personalizedScore,
  };
}

// ------------------------------------------------------------------
// SETTINGS CONTRACTS
// ------------------------------------------------------------------

export interface NotificationPreferencesVM {
  bills: boolean;
  spending: boolean;
  insights: boolean;
  scores: boolean;
  marketing: boolean;
}

export interface SettingsScreenDataContract {
  user: {
    id: string;
    name: string;
    email: string;
    initial: string;
    isGoogleConnected: boolean;
    isActive: boolean;
  };
  preferences: {
    currency: string;
    language: string;
    theme: 'light' | 'dark';
  };
  notifications: NotificationPreferencesVM;
  security: {
    activeSessions: number;
    twoFactorEnabled: boolean;
  };
  appVersion: string;
}

export const SettingsUpdateSchema = z.object({
  currency: z.string().length(3).optional(),
  language: z.string().length(2).optional(),
  theme: z.enum(['light', 'dark']).optional(),
  notificationPreferences: z.record(z.string(), z.boolean()).optional(),
});

export type SettingsUpdateRequest = z.infer<typeof SettingsUpdateSchema>;

export const SettingsResponseSchema = z.object({
  settingsDetail: z.any() // Should ideally be z.custom<SettingsScreenDataContract>() but keeping it flexible
});

// ------------------------------------------------------------------
// CATALOGUE & PROVIDER CONTRACTS
// ------------------------------------------------------------------

export function buildSettingsScreenDataContract(
  user: any
): SettingsScreenDataContract {
  const notifs = (user.notificationPreferences as Record<string, boolean>) || {};
  
  return {
    user: {
      id: user.id,
      name: user.name || 'Mizan User',
      email: user.email || '',
      initial: user.name ? user.name.charAt(0).toUpperCase() : 'U',
      isGoogleConnected: true, // simplified for now
      isActive: true,
    },
    preferences: {
      currency: user.currency || 'ETB',
      language: user.language || 'en',
      theme: (user.theme as 'light' | 'dark') || 'light',
    },
    notifications: {
      bills: notifs.bills ?? true,
      spending: notifs.spending ?? true,
      insights: notifs.insights ?? true,
      scores: notifs.scores ?? false,
      marketing: notifs.marketing ?? false,
    },
    security: {
      activeSessions: 1, // mocked for UI
      twoFactorEnabled: false, // mocked for UI
    },
    appVersion: 'Mizan v1.0.0', // static
  };
}
