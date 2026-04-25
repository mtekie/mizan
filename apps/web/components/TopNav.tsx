'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ReceiptText, Compass, Target, User, Bell, Settings, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

const navItems = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Money', href: '/ledger', icon: ReceiptText },
    { name: 'Find', href: '/catalogue', icon: Compass },
    { name: 'Goals', href: '/dreams', icon: Target },
    { name: 'Me', href: '/profile', icon: User },
];

export function TopNav() {
    const pathname = usePathname();
    const [userName, setUserName] = useState('User');

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user?.user_metadata?.name || user?.email?.split('@')[0] || 'User');
            }
        };
        fetchUser();
    }, []);

    return (
        <header className="hidden md:flex w-full bg-white border-b border-slate-200 items-center justify-between px-6 h-14 sticky top-0 z-50 shadow-sm">

            {/* Logo & Brand */}
            <Link href="/" className="flex items-center gap-3 mr-8 group">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-mint-primary)] to-[var(--color-mint-deep)] flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:shadow-md transition-shadow">
                    M
                </div>
                <span className="text-lg font-black tracking-tight text-[var(--color-mint-text)]">Mizan</span>
            </Link>

            {/* Main Navigation */}
            <nav className="flex-1 flex items-center gap-1" role="navigation" aria-label="Main navigation">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            aria-current={isActive ? 'page' : undefined}
                            className={cn(
                                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                                isActive
                                    ? "bg-[var(--color-mint-primary)]/10 text-[var(--color-mint-deep)]"
                                    : "text-slate-500 hover:text-[var(--color-mint-text)] hover:bg-slate-50"
                            )}
                        >
                            <item.icon className={cn("w-3.5 h-3.5", isActive && "text-[var(--color-mint-primary)]")} />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Right User Actions */}
            <div className="flex items-center gap-4 ml-8 pl-6 border-l border-slate-200">

                <div className="flex items-center gap-3">
                    <Link href="/notifications" className="relative text-slate-400 hover:text-[var(--color-mint-text)] transition-colors" aria-label="Notifications">
                        <Bell className="w-4 h-4" />
                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-mint-coral)] rounded-full" aria-hidden="true"></span>
                    </Link>
                    <Link href="/settings" className="text-slate-400 hover:text-[var(--color-mint-text)] transition-colors" aria-label="Settings">
                        <Settings className="w-4 h-4" />
                    </Link>
                </div>

                <Link href="/profile" className="flex items-center gap-2 hover:bg-slate-50 py-1 px-2 rounded-lg transition-colors cursor-pointer">
                    <div className="text-right hidden lg:block">
                        <p className="text-xs font-bold text-[var(--color-mint-text)] leading-tight">{userName.split(' ')[0]}</p>
                        <p className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 justify-end">
                            <ShieldCheck className="w-3 h-3 text-[var(--color-mint-primary)]" /> Verified
                        </p>
                    </div>
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-mint-primary)]/20 to-[var(--color-mint-deep)]/20 border border-[var(--color-mint-primary)]/30 flex items-center justify-center text-[var(--color-mint-primary)] font-bold text-xs">
                        {userName[0]}
                    </div>
                </Link>
            </div>

        </header>
    );
}
