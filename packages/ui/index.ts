/**
 * @mizan/ui — Universal UI Component Library
 *
 * Platform resolution (Metro / Next.js) picks the correct
 * .native.tsx or .web.tsx file automatically. Consumers always
 * import from '@mizan/ui' — never from a platform-specific path.
 *
 * Components:
 *   MizanScreen    — Screen wrapper (safe-area, header, scroll)
 *   MizanHeader    — Standalone sticky header bar
 *   MizanCard      — Generic surface card (default/primary/outline/glass)
 *   MizanButton    — CTA button (primary/secondary/ghost/danger, sm/md/lg)
 *   MizanChip      — Filter / category pill
 *   MizanBottomNav — Bottom navigation bar
 *   AccountCard    — Coloured account tile (horizontal scroll)
 *   ProductCard    — Financial product listing card
 *   MetricCard     — Stat / KPI card
 */

// ─── Shared types ─────────────────────────────────────────────
export type { MizanScreenProps } from './components/MizanScreen/MizanScreen';
export type { MizanHeaderProps } from './components/MizanHeader/MizanHeader';
export type { MizanCardProps } from './components/MizanCard/MizanCard';
export type { MizanButtonProps } from './components/MizanButton/MizanButton';
export type { MizanChipProps } from './components/MizanChip/MizanChip';
export type { MizanBottomNavProps, MizanNavTab } from './components/MizanBottomNav/MizanBottomNav';
export type { AccountCardProps } from './components/AccountCard/AccountCard';
export type { ProductCardProps, ProductCardProduct, ProductFact } from './components/ProductCard/ProductCard';
export type { MetricCardProps } from './components/MetricCard/MetricCard';

// ─── Components ───────────────────────────────────────────────
// NOTE: Metro resolves .native.tsx, Next.js resolves .web.tsx.
// The platform-specific files are the actual implementations.
export { MizanScreen } from './components/MizanScreen/MizanScreen';
export { MizanHeader } from './components/MizanHeader/MizanHeader';
export { MizanCard } from './components/MizanCard/MizanCard';
export { MizanButton } from './components/MizanButton/MizanButton';
export { MizanChip } from './components/MizanChip/MizanChip';
export { MizanBottomNav } from './components/MizanBottomNav/MizanBottomNav';
export { AccountCard } from './components/AccountCard/AccountCard';
export { ProductCard } from './components/ProductCard/ProductCard';
export { MetricCard } from './components/MetricCard/MetricCard';
