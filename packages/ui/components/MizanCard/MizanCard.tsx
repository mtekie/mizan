/**
 * MizanCard — Universal surface card
 *
 * Platform resolution:
 *  Metro (native)  → MizanCard.native.tsx
 *  Next.js (web)   → MizanCard.web.tsx
 */
import type { CSSProperties } from 'react';

export interface MizanCardProps {
  /**
   * Visual variant:
   * - `default`  White surface with subtle shadow
   * - `primary`  Mint-teal filled
   * - `outline`  Transparent with border
   * - `glass`    Frosted-glass effect (white/60 + blur)
   */
  variant?: 'default' | 'primary' | 'outline' | 'glass';
  /** Pressable — fires on tap/click */
  onPress?: () => void;
  /** Additional styles passed to the root element */
  style?: CSSProperties | object;
  children: React.ReactNode;
}

export { MizanCard } from './MizanCard.web';
