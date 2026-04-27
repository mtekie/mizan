export type PrimarySurfaceKey = 'home' | 'money' | 'find' | 'goals' | 'me';

export type SurfaceHeaderVariant = 'hero' | 'plain' | 'compact';

export type SurfaceSectionKey =
  | 'profile_status'
  | 'automation_prompt'
  | 'quick_actions'
  | 'insight'
  | 'recent_transactions'
  | 'money_summary'
  | 'accounts'
  | 'spending_summary'
  | 'product_search'
  | 'product_categories'
  | 'institutions'
  | 'secondary_filters'
  | 'product_count'
  | 'product_list'
  | 'budget_overview'
  | 'bill_reminders'
  | 'budget_forecast'
  | 'savings_goals'
  | 'quick_stats'
  | 'profile_identity'
  | 'profile_verification'
  | 'mizan_score'
  | 'security_privacy'
  | 'settings_links';

export type SurfaceActionKey =
  | 'notifications'
  | 'settings'
  | 'add_account'
  | 'add_transaction'
  | 'transfer'
  | 'filter'
  | 'log_expense'
  | 'add_goal'
  | 'add_bill'
  | 'add_contribution'
  | 'edit_profile'
  | 'open_score'
  | 'sign_out';

export interface AppSurfaceContract {
  key: PrimarySurfaceKey;
  title: string;
  subtitle?: string;
  headerVariant: SurfaceHeaderVariant;
  sections: readonly SurfaceSectionKey[];
  primaryActions?: readonly SurfaceActionKey[];
}

export const appSurfaceContracts = {
  home: {
    key: 'home',
    title: 'Home',
    subtitle: 'Your financial overview',
    headerVariant: 'hero',
    sections: [
      'profile_status',
      'automation_prompt',
      'mizan_score',
      'quick_actions',
      'insight',
      'recent_transactions',
    ],
    primaryActions: ['notifications'],
  },
  money: {
    key: 'money',
    title: 'Money',
    subtitle: 'Track your spending and manage your accounts',
    headerVariant: 'hero',
    sections: ['money_summary', 'accounts', 'spending_summary', 'recent_transactions'],
    primaryActions: ['add_account', 'add_transaction', 'transfer', 'filter'],
  },
  find: {
    key: 'find',
    title: 'Find',
    subtitle: 'Discover financial products tailored for your goals',
    headerVariant: 'hero',
    sections: [
      'product_search',
      'product_categories',
      'institutions',
      'secondary_filters',
      'product_count',
      'product_list',
    ],
  },
  goals: {
    key: 'goals',
    title: 'Goals',
    subtitle: 'Budgets, bills, and savings goals in one place',
    headerVariant: 'plain',
    sections: ['budget_overview', 'bill_reminders', 'budget_forecast', 'savings_goals', 'quick_stats'],
    primaryActions: ['log_expense', 'add_goal', 'add_bill', 'add_contribution'],
  },
  me: {
    key: 'me',
    title: 'Me',
    subtitle: 'Manage your identity and connected accounts',
    headerVariant: 'hero',
    sections: [
      'profile_identity',
      'profile_verification',
      'mizan_score',
      'accounts',
      'security_privacy',
      'settings_links',
    ],
    primaryActions: ['settings', 'edit_profile', 'open_score', 'add_account', 'sign_out'],
  },
} as const satisfies Record<PrimarySurfaceKey, AppSurfaceContract>;

export const primarySurfaceOrder = ['home', 'money', 'find', 'goals', 'me'] as const satisfies readonly PrimarySurfaceKey[];

export function getAppSurfaceContract(key: PrimarySurfaceKey): AppSurfaceContract {
  return appSurfaceContracts[key];
}
