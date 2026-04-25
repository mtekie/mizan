'use client';

import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { BottomNav } from './BottomNav';
import { DesktopBreadcrumbs } from './DesktopBreadcrumbs';
import { Sidebar } from './Sidebar';

export function LayoutWrapper({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  
  // Suppress nav on auth/onboarding routes
  const isAuthRoute = pathname?.startsWith('/login') || pathname?.startsWith('/onboarding');

  if (isAuthRoute) {
    return (
      <div className="flex flex-col min-h-screen bg-[var(--surface-bg)]">
        {children}
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--surface-bg)] relative">
      {/* Mint-inspired desktop sidebar */}
      <Sidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <main className="flex-1 pb-[calc(6rem+env(safe-area-inset-bottom))] md:pb-0 hide-scrollbar flex flex-col">
          <div className="w-full flex-1 flex flex-col relative">
            {children}
          </div>
        </main>
        <BottomNav />
      </div>
    </div>
  );
}
