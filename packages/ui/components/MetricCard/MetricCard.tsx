/**
 * MetricCard — Stat / KPI card
 *
 * Matches MizanComponentTokens.statCard sizing and
 * sectionHeader token visual language.
 *
 * Platform resolution:
 *  Metro (native)  → MetricCard.native.tsx
 *  Next.js (web)   → MetricCard.web.tsx
 */

export interface MetricCardProps {
  /** Short uppercase label (e.g. "TOTAL BALANCE") */
  label: string;
  /** Formatted value string (e.g. "ETB 48,200") */
  value: string;
  /** Icon node rendered beside the label */
  icon?: React.ReactNode;
  /** Trend string (e.g. "+12% this month") */
  trend?: string;
  /** Tone of the trend: positive (mint), negative (coral), neutral (slate) */
  trendTone?: 'positive' | 'negative' | 'neutral';
  /** Override the card background color */
  color?: string;
  onPress?: () => void;
}

export { MetricCard } from './MetricCard.web';
