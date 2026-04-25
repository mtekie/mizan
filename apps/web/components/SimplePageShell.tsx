'use client';

import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface SimplePageShellProps {
  title: string;
  children: React.ReactNode;
  /** Optional right-side header action button */
  headerAction?: React.ReactNode;
  /** Show back button (default: true) */
  showBack?: boolean;
  /** Back button href (default: /) */
  backHref?: string;
}

/**
 * SimplePageShell
 * 
 * Reusable Mint-themed page wrapper for Simple mode.
 * Provides the consistent gradient hero header, back navigation,
 * and main content area with negative margin overlap.
 * 
 * Used to wrap pages that don't have full Simple variants
 * (Score, Dreams, Transfer, Wealth) so they get a consistent
 * Mint look even without a dedicated SimpleFoo component.
 */
export function SimplePageShell({
  title,
  children,
  headerAction,
  showBack = true,
  backHref = '/',
}: SimplePageShellProps) {
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24 md:pb-0 md:max-w-lg md:mx-auto">
      <header className="mint-gradient-hero px-6 pt-12 pb-6 flex items-center justify-between text-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href={backHref}
              className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center"
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {headerAction}
      </header>

      <main className="px-6 -mt-4 relative z-10 space-y-4 flex-1">
        {children}
      </main>
    </div>
  );
}
