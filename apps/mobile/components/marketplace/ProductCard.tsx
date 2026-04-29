/**
 * @deprecated Moved to @mizan/ui — import ProductCard from '@mizan/ui' instead.
 *
 * API change: the shared ProductCard accepts pre-computed `facts`, `trustLabel`,
 * and `trustTone` props rather than calling @mizan/shared utilities internally.
 * Update call sites to compute facts before passing to the component.
 *
 * Migration example:
 *   import { ProductCard } from '@mizan/ui';
 *   import { getProductFacts, getProductTrustMeta } from '@mizan/shared';
 *
 *   const facts = getProductFacts(product, 3);
 *   const trust = getProductTrustMeta(product);
 *   <ProductCard product={product} facts={facts} trustLabel={trust.label} trustTone={trust.tone} />
 */
export { ProductCard } from '@mizan/ui';
export type { ProductCardProps, ProductCardProduct, ProductFact } from '@mizan/ui';
