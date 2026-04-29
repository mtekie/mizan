/**
 * ProductCard — Financial product listing card
 *
 * Ported from apps/mobile/components/marketplace/ProductCard.tsx
 * and unified with the web equivalent.
 *
 * Platform resolution:
 *  Metro (native)  → ProductCard.native.tsx
 *  Next.js (web)   → ProductCard.web.tsx
 */

export interface ProductFact {
  label: string;
  value: string;
}

export interface ProductCardProduct {
  id?: string;
  title?: string;
  name?: string;
  productType?: string;
  productClass?: string;
  category?: string;
  personalizedScore?: number;
  matchScore?: number;
  isFeatured?: boolean;
  provider?: {
    name?: string;
    logoUrl?: string;
    brandColor?: string;
  };
  [key: string]: unknown;
}

export interface ProductCardProps {
  product: ProductCardProduct;
  /** `list` = standard row card; `featured` = fixed-size horizontal scroll card */
  variant?: 'list' | 'featured';
  onPress?: () => void;
  /** Trust label to render (e.g. "Verified · 3 days ago") */
  trustLabel?: string;
  /** Tone drives icon + colour: `good` = mint check, `warn` = amber triangle */
  trustTone?: 'good' | 'warn' | 'neutral';
  /** Pre-computed fact chips */
  facts?: ProductFact[];
  /** Formatted match score 0–100 */
  score?: number;
}

export { ProductCard } from './ProductCard.web';
