'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Store, Cloud, TrendingUp, Settings, User, ArrowLeftRight, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Ledger & Transfer', href: '/ledger', icon: ReceiptText },
  { name: 'Catalogue', href: '/catalogue', icon: Store },
  { name: 'Dreams', href: '/dreams', icon: Cloud },
  { name: 'Wealth', href: '/wealth', icon: TrendingUp },
  { name: 'Score', href: '/score', icon: Star },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 h-screen sticky top-0">
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg mizan-gradient-bg flex items-center justify-center text-white font-bold">
          M
        </div>
        <span className="text-xl font-bold text-slate-900">Mizan</span>
      </div>

      <nav className="flex-1 px-4 space-y-1 mt-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-[#6ED063]/10 text-[#3EA63B] font-bold"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive && "fill-current")} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 space-y-2">
        <Link href="/settings" className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors">
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <div className="flex items-center gap-3 px-4 py-3 mt-2">
          <div className="w-10 h-10 rounded-full mizan-gradient-bg flex items-center justify-center text-white font-bold shadow-sm">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-900 truncate">Dawit</p>
            <p className="text-xs text-slate-500 truncate">dawit@mizan.et</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
