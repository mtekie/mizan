'use client';

import React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { PageHeader } from './PageHeader';
import { cn } from '@/lib/utils';
import { appendParityQuery } from '@/lib/parity-query';

export interface AppPageShellProps {
  title: string;
  subtitle?: string;
  variant?: 'hero' | 'plain' | 'compact';
  backHref?: string;
  showBack?: boolean;
  actions?: React.ReactNode;
  primaryAction?: React.ReactNode;
  secondaryActions?: React.ReactNode;
  children: React.ReactNode;
  maxWidth?: '7xl' | '5xl' | '3xl' | 'full';
}

/**
 * AppPageShell
 * 
 * Standardized page wrapper for Mizan Web.
 * Replaces bespoke headers and content spacing logic.
 */
export function AppPageShell({
  title,
  subtitle,
  variant = 'plain',
  backHref = '/',
  showBack = false,
  actions,
  primaryAction,
  secondaryActions,
  children,
  maxWidth = '7xl',
}: AppPageShellProps) {
  const searchParams = useSearchParams();
  const headerActions = actions || (
    primaryAction || secondaryActions ? (
      <>
        {secondaryActions}
        {primaryAction}
      </>
    ) : null
  );
  
  const containerClasses = cn(
    "mx-auto px-6 md:px-8 relative z-10 w-full",
    {
      "max-w-7xl": maxWidth === '7xl',
      "max-w-5xl": maxWidth === '5xl',
      "max-w-3xl": maxWidth === '3xl',
      "max-w-full": maxWidth === 'full',
    }
  );

  return (
    <div className={cn(
      "flex flex-col min-h-screen pb-24 md:pb-0 w-full",
      variant === 'hero' ? "bg-[var(--color-mint-bg)]" : "bg-slate-50/50"
    )}>
      {/* Desktop Header */}
      <PageHeader 
        title={title}
        description={subtitle}
        actions={headerActions}
      />

      {/* Mobile Header */}
      <header className={cn(
        "md:hidden px-6 pt-12 pb-6 flex items-center justify-between sticky top-0 z-20",
        variant === 'hero' ? "mint-gradient-hero text-white" : "bg-white border-b border-slate-100 text-slate-900"
      )}>
        <div className="flex items-center gap-3">
          {showBack && (
            <Link
              href={appendParityQuery(backHref, searchParams)}
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                variant === 'hero' ? "bg-white/20 hover:bg-white/30" : "bg-slate-100 hover:bg-slate-200"
              )}
              aria-label="Go back"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="text-xl font-black tracking-tight">{title}</h1>
            {subtitle && (
              <p className={cn(
                "text-[12px] mt-1",
                variant === 'hero' ? "text-white/80" : "text-slate-500"
              )}>
                {subtitle}
              </p>
            )}
          </div>
        </div>
        {headerActions && (
          <div className="flex items-center gap-2">
            {headerActions}
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className={cn(
        containerClasses,
        variant === 'hero' ? "-mt-4 md:mt-0" : "mt-6 md:mt-8",
        "space-y-6 flex-1"
      )}>
        {children}
      </main>
    </div>
  );
}
