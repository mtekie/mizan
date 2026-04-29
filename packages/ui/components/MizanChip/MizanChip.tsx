/**
 * MizanChip — Filter / category pill
 *
 * Platform resolution:
 *  Metro (native)  → MizanChip.native.tsx
 *  Next.js (web)   → MizanChip.web.tsx
 */

export interface MizanChipProps {
  label: string;
  /** Optional emoji prepended to the label */
  emoji?: string;
  /** Whether this chip is the active/selected one */
  active?: boolean;
  onPress?: () => void;
  className?: string;
}

export { MizanChip } from './MizanChip.web';
