/**
 * MizanButton — Universal CTA button
 *
 * Platform resolution:
 *  Metro (native)  → MizanButton.native.tsx
 *  Next.js (web)   → MizanButton.web.tsx
 */

export interface MizanButtonProps {
  label: string;
  /**
   * - `primary`    Mint-teal filled
   * - `secondary`  Mint-teal outlined
   * - `ghost`      Transparent, tinted text
   * - `danger`     Coral/red destructive action
   */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
  onPress?: () => void;
  /** Show spinner and disable interactions */
  loading?: boolean;
  disabled?: boolean;
  /** Icon rendered before the label (ReactNode — consumer picks Lucide package) */
  iconLeft?: React.ReactNode;
  /** Icon rendered after the label */
  iconRight?: React.ReactNode;
  /** HTML button type (web only) */
  type?: 'button' | 'submit' | 'reset';
  /** Additional className (web only) */
  className?: string;
}

export { MizanButton } from './MizanButton.web';
