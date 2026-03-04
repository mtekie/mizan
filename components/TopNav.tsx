'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Store, Cloud, TrendingUp, User, ArrowLeftRight, Star, Settings, Bell, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Catalogue', href: '/catalogue', icon: Store },
    { name: 'Wealth', href: '/wealth', icon: TrendingUp },
    { name: 'Dreams', href: '/dreams', icon: Cloud },
    { name: 'Ledger & Transfer', href: '/ledger', icon: ReceiptText },
    { name: 'Score', href: '/score', icon: Star },
];

export function TopNav() {
    const pathname = usePathname();

    return (
        <header className="hidden md:flex w-full bg-[#0F172A] border-b border-slate-800 text-white items-center justify-between px-6 h-14 sticky top-0 z-50">

            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 mr-8 group">
                <div className="w-8 h-8 rounded bg-gradient-to-br from-[#6ED063] to-[#3EA63B] flex items-center justify-center text-white font-black text-sm shadow-[0_0_15px_rgba(62,166,59,0.3)] group-hover:shadow-[0_0_20px_rgba(62,166,59,0.5)] transition-shadow">
                    M
                </div>
                <span className="text-lg font-black tracking-tight">Mizan</span>
            </Link>

            {/* Main Navigation */}
            <nav className="flex-1 flex items-center gap-1">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                isActive
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                            )}
                        >
                            <item.icon className={cn("w-3.5 h-3.5", isActive && "text-[#6ED063]")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Right User Actions */}
            <div className="flex items-center gap-4 ml-8 pl-6 border-l border-slate-800">

                <div className="flex items-center gap-3">
                    <Link href="/notifications" className="relative text-slate-400 hover:text-white transition-colors">
                        <Bell className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#D84315] rounded-full"></span>
                    </Link>
                    <Link href="/settings" className="text-slate-400 hover:text-white transition-colors">
                        <Settings className="w-4 h-4" />
                    </Link>
                </div>

                <Link href="/profile" className="flex items-center gap-2 hover:bg-white/5 py-1 px-2 rounded-lg transition-colors cursor-pointer">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs font-bold text-white leading-tight">Dawit</p>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 justify-end">
                            <ShieldCheck className="w-3 h-3 text-[#3EA63B]" /> Verified
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-[#6ED063]/20 to-[#3EA63B]/20 border border-[#3EA63B]/30 flex items-center justify-center text-[#6ED063] font-bold text-xs">
                        D
                    </div>
                </Link>
            </div>

        </header>
    );
}
