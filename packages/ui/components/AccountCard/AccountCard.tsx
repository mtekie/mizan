/**
 * AccountCard — Coloured account tile (horizontal-scroll variant)
 *
 * Matches MizanComponentTokens.accountTile sizing.
 *
 * Platform resolution:
 *  Metro (native)  → AccountCard.native.tsx
 *  Next.js (web)   → AccountCard.web.tsx
 */

export interface AccountCardProps {
  /** Account / wallet name */
  name: string;
  /** Formatted balance string (e.g. "ETB 12,450") */
  balance: string;
  /** Account type label (e.g. "Savings", "Loan") */
  type: string;
  /** Background color for the card (hex / CSS color) */
  color: string;
  /** Icon node rendered in the top-right corner */
  icon?: React.ReactNode;
  onPress?: () => void;
}

export { AccountCard } from './AccountCard.web';
