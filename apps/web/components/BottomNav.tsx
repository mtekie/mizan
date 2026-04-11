'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Store, Cloud, TrendingUp, Compass, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';

// Pro mode: 5 tabs — power user layout
const proNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Ledger & Transfer', href: '/ledger', icon: ReceiptText },
  { name: 'Catalogue', href: '/catalogue', icon: Store },
  { name: 'Dreams', href: '/dreams', icon: Cloud },
  { name: 'Wealth', href: '/wealth', icon: TrendingUp },
];

// Simple mode: 4 tabs — friendly, approachable naming
const simpleNavItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Money', href: '/ledger', icon: ReceiptText },
  { name: 'Explore', href: '/catalogue', icon: Compass },
  { name: 'Me', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();
  const uiMode = useStore((s) => s.uiMode);
  const navItems = uiMode === 'simple' ? simpleNavItems : proNavItems;

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-100 py-2 px-4 flex justify-around items-center z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-0.5 transition-all py-1 min-w-[56px]",
              isActive ? "text-[var(--color-mint-primary)]" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {/* Simple mode: active item gets a pill background */}
            {uiMode === 'simple' && isActive ? (
              <div className="bg-[var(--color-mint-primary)]/10 rounded-xl px-3 py-1 transition-all">
                <item.icon className="w-5 h-5 text-[var(--color-mint-primary)]" />
              </div>
            ) : (
              <item.icon className={cn(
                "w-5 h-5",
                isActive && "text-[var(--color-mint-primary)]"
              )} />
            )}
            <span className={cn(
              "text-[10px] font-semibold transition-colors",
              isActive && "font-bold"
            )}>
              {item.name}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
