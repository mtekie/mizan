/**
 * MizanScreen — Universal screen wrapper
 *
 * Handles safe-area insets, sticky headers, scroll/refresh, and
 * back navigation. Provides visual parity between Mobile and Web.
 *
 * Platform resolution:
 *  Metro (native)  → MizanScreen.native.tsx
 *  Next.js (web)   → MizanScreen.web.tsx
 */

export interface MizanScreenProps {
  /** Page/screen title shown in the header */
  title: string;
  /** Optional subtitle shown beneath the title */
  subtitle?: string;
  /**
   * Visual style of the header.
   * - `hero`    Mint-teal gradient background
   * - `plain`   White background with bottom border
   * - `compact` Smaller padding, plain background
   */
  variant?: 'hero' | 'plain' | 'compact';
  /** Show a back-navigation button */
  showBack?: boolean;
  /** href / path to navigate back to (web only, mobile uses router.back()) */
  backHref?: string;
  /** Node(s) to render in the header action area (right-hand side) */
  actions?: React.ReactNode;
  /** Primary CTA rendered in the header action area */
  primaryAction?: React.ReactNode;
  /** Secondary actions rendered before primaryAction */
  secondaryActions?: React.ReactNode;
  /** Allow the content area to scroll (default: true) */
  scrollable?: boolean;
  /** Pull-to-refresh active state (native only) */
  refreshing?: boolean;
  /** Pull-to-refresh callback (native only) */
  onRefresh?: () => void;
  children: React.ReactNode;
}

// Re-export from the web implementation as the default for TypeScript
// that does not resolve platform extensions (e.g., type-checking the package).
export { MizanScreen } from './MizanScreen.web';
