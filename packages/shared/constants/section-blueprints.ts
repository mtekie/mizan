import type { SurfaceSectionKey } from './app-surfaces';

// ─── Layout Types ───
// Each section uses one of these structural patterns.
// Both platforms must render the same layout type for parity.
export type SectionLayout =
  | 'stat-grid'       // Grid of stat cards (e.g. Total Balance | Monthly In | Monthly Out)
  | 'card-list'       // Vertical list of cards (e.g. accounts, goals, bills)
  | 'hero-number'     // Single big number with label (e.g. Net Worth)
  | 'action-row'      // Horizontal row of icon+label buttons (e.g. Send, Request, Pay)
  | 'progress-card'   // Card with progress bar/ring (e.g. budget overview)
  | 'search-bar'      // Search input with filter icon
  | 'pill-strip'      // Horizontal scrollable pills (e.g. categories, institutions)
  | 'info-card'       // Static card with icon + text (e.g. insight, verification)
  | 'profile-header'  // Avatar + name + subtitle
  | 'transaction-list' // List of transaction rows with icon, title, amount
  | 'donut-chart'     // Pie/donut chart with legend
  | 'bar-chart'       // Horizontal bar chart (e.g. 6-month trend)
  | 'dark-card'       // Dark-themed card (e.g. security/privacy)
  | 'link-list';      // List of tappable rows with chevrons (e.g. settings)

// ─── Card Variants ───
export type CardVariant = 'elevated' | 'flat' | 'gradient' | 'outlined' | 'colored-tile' | 'dark';

// ─── Section Blueprint ───
// The visual specification for a single section.
// Both platforms MUST render this section to match this spec.
export interface SectionBlueprint {
  key: SurfaceSectionKey;
  title: string;
  layout: SectionLayout;
  /** The data keys this section expects. Both platforms must provide the same shape. */
  dataShape: Record<string, 'string' | 'number' | 'boolean' | 'array' | 'object'>;
  style: {
    cardVariant: CardVariant;
    /** Use MizanComponentTokens key for consistency */
    tokenRef: string;
  };
  emptyState?: {
    emoji: string;
    message: string;
  };
  /** Platform-specific behavior overrides */
  platformNotes?: {
    web?: string;
    native?: string;
  };
}

// ═══════════════════════════════════════════
//  SECTION BLUEPRINTS — Visual Specification
// ═══════════════════════════════════════════

export const sectionBlueprints: Record<string, SectionBlueprint> = {
  // ─── HOME ───
  profile_status: {
    key: 'profile_status',
    title: 'Profile Status',
    layout: 'progress-card',
    dataShape: {
      completionPercent: 'number',
      missingFields: 'array',
      isCoreComplete: 'boolean',
    },
    style: { cardVariant: 'outlined', tokenRef: 'progressCard' },
  },

  automation_prompt: {
    key: 'automation_prompt',
    title: 'Get Started',
    layout: 'info-card',
    dataShape: {
      type: 'string',
      userName: 'string',
    },
    style: { cardVariant: 'outlined', tokenRef: 'infoCard' },
  },

  mizan_score: {
    key: 'mizan_score',
    title: 'Mizan Score',
    layout: 'info-card',
    dataShape: {
      score: 'number',
      label: 'string',
      trend: 'string',
    },
    style: { cardVariant: 'elevated', tokenRef: 'scoreCard' },
  },

  quick_actions: {
    key: 'quick_actions',
    title: 'Quick Actions',
    layout: 'action-row',
    dataShape: {
      actions: 'array', // [{ icon, label, color }]
    },
    style: { cardVariant: 'flat', tokenRef: 'actionRow' },
  },

  insight: {
    key: 'insight',
    title: 'Mizan Insight',
    layout: 'info-card',
    dataShape: {
      text: 'string',
      emoji: 'string',
    },
    style: { cardVariant: 'outlined', tokenRef: 'insightCard' },
    platformNotes: {
      web: 'Cycles through multiple tips with dot indicators',
      native: 'Shows single contextual tip',
    },
  },

  // ─── MONEY ───
  money_summary: {
    key: 'money_summary',
    title: 'Money Summary',
    layout: 'stat-grid',
    dataShape: {
      totalBalance: 'number',
      monthlyIn: 'number',
      monthlyOut: 'number',
      savingsRate: 'number',
    },
    style: { cardVariant: 'elevated', tokenRef: 'statCard' },
  },

  accounts: {
    key: 'accounts',
    title: 'My Accounts',
    layout: 'card-list',
    dataShape: {
      accounts: 'array', // [{ id, name, type, number, balance, color, bank }]
    },
    style: { cardVariant: 'colored-tile', tokenRef: 'accountTile' },
    emptyState: {
      emoji: '🏦',
      message: 'No accounts connected. Add your first bank account.',
    },
  },

  spending_summary: {
    key: 'spending_summary',
    title: 'Monthly Spending',
    layout: 'donut-chart',
    dataShape: {
      totalSpent: 'number',
      monthLabel: 'string',
      categories: 'array', // [{ name, amount, percent, color }]
    },
    style: { cardVariant: 'elevated', tokenRef: 'spendingChart' },
  },

  recent_transactions: {
    key: 'recent_transactions',
    title: 'Recent Activity',
    layout: 'transaction-list',
    dataShape: {
      transactions: 'array', // [{ id, title, category, amount, source, date, emoji }]
      hasMore: 'boolean',
    },
    style: { cardVariant: 'elevated', tokenRef: 'transactionRow' },
    emptyState: {
      emoji: '📭',
      message: 'No transactions yet.',
    },
  },

  // ─── FIND ───
  product_search: {
    key: 'product_search',
    title: 'Search',
    layout: 'search-bar',
    dataShape: {
      query: 'string',
      placeholder: 'string',
    },
    style: { cardVariant: 'flat', tokenRef: 'searchBar' },
  },

  product_categories: {
    key: 'product_categories',
    title: 'Categories',
    layout: 'pill-strip',
    dataShape: {
      categories: 'array', // [{ key, label, icon }]
      activeKey: 'string',
    },
    style: { cardVariant: 'flat', tokenRef: 'pillStrip' },
  },

  institutions: {
    key: 'institutions',
    title: 'Institutions',
    layout: 'pill-strip',
    dataShape: {
      institutions: 'array', // [{ id, name }]
      activeId: 'string',
    },
    style: { cardVariant: 'flat', tokenRef: 'pillStrip' },
  },

  secondary_filters: {
    key: 'secondary_filters',
    title: 'Filters',
    layout: 'pill-strip',
    dataShape: {
      filters: 'array', // [{ key, label, active }]
    },
    style: { cardVariant: 'flat', tokenRef: 'pillStrip' },
  },

  product_count: {
    key: 'product_count',
    title: 'Results',
    layout: 'info-card',
    dataShape: {
      count: 'number',
    },
    style: { cardVariant: 'flat', tokenRef: 'productCount' },
  },

  product_list: {
    key: 'product_list',
    title: 'Products',
    layout: 'card-list',
    dataShape: {
      products: 'array',
    },
    style: { cardVariant: 'elevated', tokenRef: 'productCard' },
    emptyState: {
      emoji: '🔍',
      message: 'No products found. Try clearing filters.',
    },
  },

  // ─── GOALS ───
  budget_overview: {
    key: 'budget_overview',
    title: 'Monthly Budget',
    layout: 'progress-card',
    dataShape: {
      totalBudget: 'number',
      totalSpent: 'number',
      percent: 'number',
      categories: 'array', // [{ id, name, allocated, spent }]
    },
    style: { cardVariant: 'elevated', tokenRef: 'budgetCard' },
    emptyState: {
      emoji: '📋',
      message: 'No budget yet. Choose a template to start.',
    },
  },

  bill_reminders: {
    key: 'bill_reminders',
    title: 'Upcoming Bills',
    layout: 'card-list',
    dataShape: {
      bills: 'array', // [{ id, name, amount, dueDay, isPaid, isSkipped }]
    },
    style: { cardVariant: 'elevated', tokenRef: 'billCard' },
    emptyState: {
      emoji: '📅',
      message: 'No bills yet. Tap + to add a reminder.',
    },
  },

  budget_forecast: {
    key: 'budget_forecast',
    title: 'Plan Insight',
    layout: 'info-card',
    dataShape: {
      text: 'string',
    },
    style: { cardVariant: 'outlined', tokenRef: 'insightCard' },
  },

  savings_goals: {
    key: 'savings_goals',
    title: 'Savings Goals',
    layout: 'card-list',
    dataShape: {
      goals: 'array', // [{ id, name, emoji, target, saved, percent, deadline }]
    },
    style: { cardVariant: 'elevated', tokenRef: 'goalCard' },
    emptyState: {
      emoji: '🎯',
      message: 'No savings goals yet. Set your first target.',
    },
  },

  quick_stats: {
    key: 'quick_stats',
    title: 'Quick Stats',
    layout: 'stat-grid',
    dataShape: {
      avgMonthlySave: 'number',
      goalsOnTrack: 'number',
      totalGoals: 'number',
    },
    style: { cardVariant: 'elevated', tokenRef: 'statCard' },
  },

  // ─── ME ───
  profile_identity: {
    key: 'profile_identity',
    title: 'Profile',
    layout: 'profile-header',
    dataShape: {
      name: 'string',
      email: 'string',
      initial: 'string',
      isComplete: 'boolean',
    },
    style: { cardVariant: 'flat', tokenRef: 'profileHeader' },
  },

  profile_verification: {
    key: 'profile_verification',
    title: 'Verified Identity',
    layout: 'info-card',
    dataShape: {
      isVerified: 'boolean',
      message: 'string',
    },
    style: { cardVariant: 'outlined', tokenRef: 'verificationCard' },
  },

  security_privacy: {
    key: 'security_privacy',
    title: 'Security & Privacy',
    layout: 'dark-card',
    dataShape: {
      message: 'string',
    },
    style: { cardVariant: 'dark', tokenRef: 'securityCard' },
  },

  settings_links: {
    key: 'settings_links',
    title: 'Settings & Support',
    layout: 'link-list',
    dataShape: {
      links: 'array', // [{ icon, label, route, destructive? }]
    },
    style: { cardVariant: 'elevated', tokenRef: 'linkList' },
  },
} as const;

export function getSectionBlueprint(key: SurfaceSectionKey): SectionBlueprint | undefined {
  return sectionBlueprints[key];
}
