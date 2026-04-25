'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { ReactNode } from 'react';

/**
 * Maps static pathnames to readable breadcrumb labels.
 */
const routeLabels: Record<string, string> = {
  '/catalogue': 'Find',
  '/dreams': 'Plan',
  '/transfer': 'Transfer Log',
  '/score': 'Mizan Score',
  '/settings': 'Settings',
  '/profile': 'Me',
  '/ledger': 'Money',
};

interface PageHeaderProps {
  title?: string;
  description?: string;
  actions?: ReactNode;
  showBreadcrumbs?: boolean;
}

export function PageHeader({ title, description, actions, showBreadcrumbs = true }: PageHeaderProps) {
  const pathname = usePathname();
  const paths = pathname.split('/').filter(Boolean);
  
  const baseKey = `/${paths[0]}`;
  const label = routeLabels[baseKey] || title;

  return (
    <header className="hidden md:block bg-white border-b border-slate-100 px-8 py-6 md:py-8">
      <div className="max-w-7xl mx-auto">
        {showBreadcrumbs && pathname !== '/' && (
          <nav className="hidden md:flex items-center gap-2 mb-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <Link href="/" className="hover:text-slate-900 transition-colors flex items-center gap-1">
              <Home className="w-3 h-3" /> Home
            </Link>
            <ChevronRight className="w-2.5 h-2.5" />
            <span className="text-[var(--color-mint-primary)]">{label}</span>
            
            {paths.length > 1 && (
              <>
                <ChevronRight className="w-2.5 h-2.5" />
                <span className="truncate max-w-[200px]">Detail</span>
              </>
            )}
          </nav>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-none">
              {title || label}
            </h1>
            {description && (
              <p className="text-slate-500 text-sm mt-1.5 max-w-2xl">
                {description}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex items-center gap-3">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
