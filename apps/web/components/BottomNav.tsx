'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Compass, Target, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Money', href: '/ledger', icon: ReceiptText },
  { name: 'Find', href: '/catalogue', icon: Compass },
  { name: 'Plan', href: '/dreams', icon: Target },
  { name: 'Me', href: '/profile', icon: User },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-100 py-3 px-4 flex justify-around items-center z-50 pb-safe md:hidden" role="navigation" aria-label="Bottom navigation">
      {navItems.map((item) => {
        const isActive = pathname === item.href || 
          (item.href !== '/' && pathname.startsWith(item.href));
        
        return (
          <Link
            key={item.name}
            href={item.href}
            aria-current={isActive ? 'page' : undefined}
            aria-label={item.name}
            className={cn(
              "flex flex-col items-center gap-0.5 transition-all py-1 min-w-[56px]",
              isActive ? "text-[var(--color-mint-primary)]" : "text-slate-400 hover:text-slate-600"
            )}
          >
            {isActive ? (
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
