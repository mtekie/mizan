/**
 * MizanHeader — Universal header bar
 *
 * Platform resolution:
 *  Metro (native)  → MizanHeader.native.tsx
 *  Next.js (web)   → MizanHeader.web.tsx
 */

export interface MizanHeaderProps {
  title: string;
  subtitle?: string;
  variant?: 'hero' | 'plain' | 'compact';
  showBack?: boolean;
  /** href to navigate to on back press (web); native always calls router.back() */
  backHref?: string;
  /** Node rendered in the leading (left) slot, overrides default back button */
  leftAction?: React.ReactNode;
  /** Node rendered in the trailing (right) slot */
  rightAction?: React.ReactNode;
}

export { MizanHeader } from './MizanHeader.web';
