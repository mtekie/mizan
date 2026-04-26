export type ProductCategoryKey =
  | 'all'
  | 'SAVINGS'
  | 'CREDIT'
  | 'INSURANCE'
  | 'PAYMENT'
  | 'CAPITAL_MARKET'
  | 'COMMUNITY';

export const productCategories: { key: ProductCategoryKey; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'SAVINGS', label: 'Savings' },
  { key: 'CREDIT', label: 'Loans' },
  { key: 'INSURANCE', label: 'Insurance' },
  { key: 'PAYMENT', label: 'Payments' },
  { key: 'CAPITAL_MARKET', label: 'Capital Markets' },
  { key: 'COMMUNITY', label: 'Community' },
];

type LooseProduct = Record<string, any>;

function formatCompactMoney(value: unknown, currency = 'ETB'): string {
  const number = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(number)) return '';
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(number % 1_000_000 === 0 ? 0 : 1)}M ${currency}`;
  if (number >= 1_000) return `${(number / 1_000).toFixed(number % 1_000 === 0 ? 0 : 1)}k ${currency}`;
  return `${number.toLocaleString()} ${currency}`;
}

export function labelProductClass(value?: string | null): string {
  return productCategories.find(category => category.key === value)?.label || 'Product';
}

export function labelProductType(value?: string | null): string {
  if (!value) return 'Financial product';
  return value
    .replace(/_/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

export function getProductTitle(product: LooseProduct): string {
  return product.name || product.title || 'Financial product';
}

export function getProductProviderName(product: LooseProduct): string {
  return product.provider?.name || product.bankName || 'Financial institution';
}

export function getProductMatchScore(product: LooseProduct): number {
  const score = Number(product.personalizedScore ?? product.matchScore ?? 50);
  return Number.isFinite(score) ? Math.round(score) : 50;
}

export function getProductFacts(product: LooseProduct, limit = 3): { label: string; value: string; positive?: boolean }[] {
  const facts: { label: string; value: string; positive?: boolean }[] = [];
  const currency = product.currency || 'ETB';

  if (typeof product.interestRate === 'number') {
    const max = typeof product.interestMax === 'number' && product.interestMax > product.interestRate
      ? `-${product.interestMax}%`
      : '';
    facts.push({ label: 'Rate', value: `${product.interestRate}%${max}`, positive: true });
  }

  if (typeof product.maxAmount === 'number' && product.maxAmount > 0) {
    facts.push({ label: 'Max', value: formatCompactMoney(product.maxAmount, currency) });
  } else if (typeof product.minBalance === 'number' && product.minBalance > 0) {
    facts.push({ label: 'Min', value: formatCompactMoney(product.minBalance, currency) });
  }

  if (product.term) {
    facts.push({ label: 'Term', value: String(product.term) });
  }

  if (product.digital) {
    facts.push({ label: 'Access', value: 'Digital', positive: true });
  }

  if (product.interestFree) {
    facts.push({ label: 'Finance', value: 'Interest-free', positive: true });
  }

  if (facts.length === 0) {
    facts.push({ label: 'Type', value: labelProductType(product.productType || product.productClass || product.category) });
  }

  return facts.slice(0, limit);
}

export function getProductTrustMeta(product: LooseProduct): { label: string; tone: 'good' | 'warn'; freshness: string; source: string } {
  const reviewedAt = product.lastReviewedAt || product.attributes?.lastReviewedAt || product.updatedAt || product.createdAt;
  const reviewedDate = reviewedAt ? new Date(reviewedAt) : null;
  const freshness = reviewedDate && !Number.isNaN(reviewedDate.getTime())
    ? `Reviewed ${reviewedDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`
    : 'Review date pending';
  const sourceRef = product.sourceName || product.sourceUrl || product.attributes?.sourceSheet || product.attributes?.sourceUrl || product.attributes?.source;
  const source = sourceRef ? `Source: ${sourceRef}` : 'Source pending';

  return {
    label: product.isVerified === false ? 'Needs review' : 'Verified',
    tone: product.isVerified === false ? 'warn' : 'good',
    freshness,
    source,
  };
}

export function getMatchExplanation(product: LooseProduct): string {
  const score = getProductMatchScore(product);
  const type = labelProductType(product.productType || product.productClass);
  if (score >= 80) return `Strong fit based on your profile and this ${type.toLowerCase()}'s eligibility signals.`;
  if (score >= 60) return `Potential fit, but compare the requirements and fees before applying.`;
  return `Useful to review, but it may need more profile data before Mizan can rank it confidently.`;
}
