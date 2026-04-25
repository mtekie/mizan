'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

/**
 * Maps static pathnames to readable breadcrumb labels.
 */
const routeLabels: Record<string, string> = {
  '/catalogue': 'Find',
  '/dreams': 'Goals',
  '/transfer': 'Transfer Log',
  '/score': 'Mizan Score',
  '/settings': 'Settings',
  '/profile': 'Me',
  '/ledger': 'Money',
};

export function DesktopBreadcrumbs() {
  const pathname = usePathname();

  // Do not show on Home page
  if (!pathname || pathname === '/') return null;

  const paths = pathname.split('/').filter(Boolean);
  
  const baseKey = `/${paths[0]}`;
  const label = routeLabels[baseKey];

  if (!label) return null;

  return (
    <div className="hidden md:flex items-center gap-2 px-6 py-3 border-b border-[var(--border-muted)] bg-[var(--surface-bg)] text-xs text-slate-500 max-w-7xl mx-auto w-full">
      <Link href="/" className="hover:text-[var(--text-primary)] transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" /> Home
      </Link>
      <ChevronRight className="w-3 h-3 text-slate-400" />
      <span className="font-semibold text-[var(--color-primary)]">{label}</span>
      
      {paths.length > 1 && (
        <>
          <ChevronRight className="w-3 h-3 text-slate-400" />
          <span className="text-slate-400 truncate max-w-[200px]">Detail</span>
        </>
      )}
    </div>
  );
}
