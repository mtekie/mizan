'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Store, Cloud, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Ledger & Transfer', href: '/ledger', icon: ReceiptText },
  { name: 'Catalogue', href: '/catalogue', icon: Store },
  { name: 'Dreams', href: '/dreams', icon: Cloud },
  { name: 'Wealth', href: '/wealth', icon: TrendingUp },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 w-full bg-white border-t border-slate-100 py-3 px-6 flex justify-between items-center text-[10px] font-medium text-slate-400 z-50 pb-safe">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 transition-colors",
              isActive ? "text-[#3EA63B]" : "hover:text-slate-600"
            )}
          >
            <item.icon className={cn("w-6 h-6", isActive && "fill-current")} />
            <span className={cn(isActive && "font-bold")}>{item.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}
