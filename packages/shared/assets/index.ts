export type AssetPlatformKey = 'web' | 'native' | 'ios' | 'android';

export interface VisualAsset {
  key: string;
  label: string;
  shortLabel: string;
  color: string;
  textColor: string;
  icon: string;
}

export const providerAssets = {
  cbe: {
    key: 'cbe',
    label: 'CBE',
    shortLabel: 'C',
    color: '#2F3E9E',
    textColor: '#FFFFFF',
    icon: 'landmark',
  },
  'cbe-birr': {
    key: 'cbe-birr',
    label: 'CBE Birr',
    shortLabel: 'CB',
    color: '#2F3E9E',
    textColor: '#FFFFFF',
    icon: 'credit-card',
  },
  telebirr: {
    key: 'telebirr',
    label: 'telebirr',
    shortLabel: 'TB',
    color: '#4B83F1',
    textColor: '#FFFFFF',
    icon: 'wallet',
  },
  dashen: {
    key: 'dashen',
    label: 'Dashen',
    shortLabel: 'D',
    color: '#E03131',
    textColor: '#FFFFFF',
    icon: 'landmark',
  },
  awash: {
    key: 'awash',
    label: 'Awash',
    shortLabel: 'A',
    color: '#243A8F',
    textColor: '#FFFFFF',
    icon: 'landmark',
  },
  cash: {
    key: 'cash',
    label: 'Cash',
    shortLabel: 'CA',
    color: '#45BFA0',
    textColor: '#FFFFFF',
    icon: 'wallet',
  },
  unknown: {
    key: 'unknown',
    label: 'Account',
    shortLabel: '--',
    color: '#94A3B8',
    textColor: '#FFFFFF',
    icon: 'credit-card',
  },
} as const satisfies Record<string, VisualAsset>;

export const accountTypeAssets = {
  savings: {
    key: 'savings',
    label: 'Savings',
    shortLabel: 'SAVINGS',
    color: '#2F3E9E',
    textColor: '#FFFFFF',
    icon: 'piggy-bank',
  },
  wallet: {
    key: 'wallet',
    label: 'Wallet',
    shortLabel: 'WALLET',
    color: '#4B83F1',
    textColor: '#FFFFFF',
    icon: 'wallet',
  },
  bank: {
    key: 'bank',
    label: 'Bank',
    shortLabel: 'BANK',
    color: '#45BFA0',
    textColor: '#FFFFFF',
    icon: 'landmark',
  },
  cash: {
    key: 'cash',
    label: 'Cash',
    shortLabel: 'CASH',
    color: '#45BFA0',
    textColor: '#FFFFFF',
    icon: 'wallet',
  },
  asset: {
    key: 'asset',
    label: 'Asset',
    shortLabel: 'ASSET',
    color: '#64748B',
    textColor: '#FFFFFF',
    icon: 'building',
  },
  unknown: {
    key: 'unknown',
    label: 'Account',
    shortLabel: 'ACCOUNT',
    color: '#94A3B8',
    textColor: '#FFFFFF',
    icon: 'credit-card',
  },
} as const satisfies Record<string, VisualAsset>;

export const productCategoryAssets = {
  savings: {
    key: 'savings',
    label: 'Savings',
    shortLabel: 'Savings',
    color: '#16A34A',
    textColor: '#FFFFFF',
    icon: 'piggy-bank',
  },
  loans: {
    key: 'loans',
    label: 'Loans',
    shortLabel: 'Loans',
    color: '#2563EB',
    textColor: '#FFFFFF',
    icon: 'landmark',
  },
  insurance: {
    key: 'insurance',
    label: 'Insurance',
    shortLabel: 'Insurance',
    color: '#0EA5E9',
    textColor: '#FFFFFF',
    icon: 'shield',
  },
  payments: {
    key: 'payments',
    label: 'Payments',
    shortLabel: 'Payments',
    color: '#7C3AED',
    textColor: '#FFFFFF',
    icon: 'credit-card',
  },
  unknown: {
    key: 'unknown',
    label: 'Product',
    shortLabel: 'Product',
    color: '#94A3B8',
    textColor: '#FFFFFF',
    icon: 'box',
  },
} as const satisfies Record<string, VisualAsset>;

function normalizeAssetKey(value?: string | null) {
  return (value || '')
    .trim()
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

export function getProviderAsset(providerName?: string | null): VisualAsset {
  const key = normalizeAssetKey(providerName);
  if (key.includes('telebirr')) return providerAssets.telebirr;
  if (key.includes('cbe-birr')) return providerAssets['cbe-birr'];
  if (key.includes('commercial-bank-of-ethiopia') || key === 'cbe') return providerAssets.cbe;
  if (key.includes('dashen')) return providerAssets.dashen;
  if (key.includes('awash')) return providerAssets.awash;
  if (key.includes('cash') || key.includes('manual')) return providerAssets.cash;
  return providerAssets.unknown;
}

export function getAccountTypeAsset(accountType?: string | null): VisualAsset {
  const key = normalizeAssetKey(accountType);
  if (key.includes('saving')) return accountTypeAssets.savings;
  if (key.includes('wallet') || key.includes('mobile')) return accountTypeAssets.wallet;
  if (key.includes('cash') || key.includes('manual')) return accountTypeAssets.cash;
  if (key.includes('asset') || key.includes('property')) return accountTypeAssets.asset;
  if (key.includes('bank')) return accountTypeAssets.bank;
  return accountTypeAssets.unknown;
}

export function getProductCategoryAsset(category?: string | null): VisualAsset {
  const key = normalizeAssetKey(category);
  if (key.includes('saving')) return productCategoryAssets.savings;
  if (key.includes('loan') || key.includes('credit')) return productCategoryAssets.loans;
  if (key.includes('insurance')) return productCategoryAssets.insurance;
  if (key.includes('payment')) return productCategoryAssets.payments;
  return productCategoryAssets.unknown;
}

export function getAccountVisual(account: {
  name?: string | null;
  type?: string | null;
  color?: string | null;
}) {
  const providerAsset = getProviderAsset(account.name);
  const typeAsset = getAccountTypeAsset(account.type);
  const fallback = providerAsset.key === 'unknown' ? typeAsset : providerAsset;

  return {
    provider: providerAsset,
    type: typeAsset,
    color: account.color || fallback.color,
    textColor: fallback.textColor,
    icon: fallback.icon,
    shortLabel: typeAsset.shortLabel,
  };
}
