'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  /** Compact variant for inline use within cards */
  compact?: boolean;
}

/**
 * EmptyState
 * 
 * Reusable empty state component for data-dependent sections.
 * Replaces plain text like "No transactions yet." with a visually
 * appealing, actionable placeholder.
 */
export function EmptyState({ icon: Icon, title, description, action, compact = false }: EmptyStateProps) {
  if (compact) {
    return (
      <div className="flex flex-col items-center justify-center py-6 px-4 text-center">
        <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
          <Icon className="w-5 h-5 text-slate-400 dark:text-slate-500" />
        </div>
        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">{title}</p>
        <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed max-w-[200px]">{description}</p>
        {action && (
          <Link
            href={action.href}
            className="mt-3 text-[11px] font-bold text-[var(--color-mint-primary,#3EA63B)] hover:underline"
          >
            {action.label} →
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
      </div>
      <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">{title}</h3>
      <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs mb-4">{description}</p>
      {action && (
        <Link
          href={action.href}
          className="inline-flex items-center gap-1.5 bg-[var(--color-mint-primary,#3EA63B)] text-white text-xs font-bold px-5 py-2.5 rounded-xl hover:opacity-90 transition-opacity shadow-sm"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
