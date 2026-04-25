'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    Home, 
    ReceiptText, 
    Compass, 
    Target, 
    User, 
    Bell, 
    Settings, 
    ShieldCheck, 
    ChevronLeft, 
    ChevronRight,
    LogOut,
    Gauge
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'motion/react';
import { appSections, secondarySections } from '@mizan/shared';

const iconMap = {
    home: Home,
    receipt: ReceiptText,
    compass: Compass,
    target: Target,
    user: User,
    gauge: Gauge,
    settings: Settings,
    bell: Bell,
};

const navItems = appSections.map(s => ({
    name: s.label,
    href: s.webHref,
    icon: iconMap[s.icon as keyof typeof iconMap] || Compass
}));

export function Sidebar() {
    const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [userName, setUserName] = useState('User');
    const [userEmail, setUserEmail] = useState('');

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                setUserName(user?.user_metadata?.name || user?.email?.split('@')[0] || 'User');
                setUserEmail(user?.email || '');
            }
        };
        fetchUser();
    }, []);

    return (
        <aside 
            className={cn(
                "hidden md:flex flex-col bg-[#0f172a] text-slate-300 h-screen sticky top-0 border-r border-slate-800 transition-all duration-300 ease-in-out z-50",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Collapse Toggle */}
            <button 
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 w-6 h-6 bg-[var(--color-mint-primary)] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-50"
            >
                {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            {/* Logo */}
            <div className={cn("h-20 flex items-center mb-6 px-6", isCollapsed && "justify-center px-0")}>
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-mint-primary)] to-[var(--color-mint-deep)] flex items-center justify-center text-white font-black text-lg shadow-lg shadow-[var(--color-mint-primary)]/20 transition-transform group-hover:scale-105">
                        M
                    </div>
                    {!isCollapsed && (
                        <span className="text-2xl font-black tracking-tighter text-white animate-in fade-in slide-in-from-left-2 duration-300">
                            mizan<span className="text-[var(--color-mint-primary)]">.</span>
                        </span>
                    )}
                </Link>
            </div>

            {/* Navigation */}
            <nav className="flex-1 flex flex-col gap-1.5 px-3">
                {navItems.map((item) => {
                    const isActive = pathname === item.href ||
                        (item.href !== '/' && pathname.startsWith(item.href));
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            title={isCollapsed ? item.name : ''}
                            className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all group relative",
                                isActive
                                    ? "bg-[var(--color-mint-primary)] text-white shadow-md shadow-[var(--color-mint-primary)]/10"
                                    : "hover:bg-slate-800/50 hover:text-white"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive && "text-white")} />
                            {!isCollapsed && (
                                <span className="animate-in fade-in slide-in-from-left-1 duration-200">{item.name}</span>
                            )}
                            {isActive && !isCollapsed && (
                                <motion.div 
                                    layoutId="activeNav"
                                    className="absolute left-0 w-1 h-6 bg-white rounded-r-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile Section */}
            <div className={cn(
                "mt-auto p-4 border-t border-slate-800 bg-slate-900/30",
                isCollapsed ? "items-center" : ""
            )}>
                {!isCollapsed && (
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <Link href="/notifications" className="relative text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800" aria-label="Notifications">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0f172a]" />
                        </Link>
                        <Link href="/settings" className="text-slate-400 hover:text-white transition-colors p-2 rounded-lg hover:bg-slate-800" aria-label="Settings">
                            <Settings className="w-5 h-5" />
                        </Link>
                        <button className="text-slate-400 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-400/10 ml-auto" title="Sign Out">
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                )}

                <Link 
                    href="/profile" 
                    className={cn(
                        "flex items-center gap-3 p-2 rounded-2xl transition-all hover:bg-slate-800 group",
                        isCollapsed && "justify-center"
                    )}
                >
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400/20 to-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-sm shrink-0 shadow-inner group-hover:scale-105 transition-transform">
                        {userName[0]}
                    </div>
                    {!isCollapsed && (
                        <div className="min-w-0 flex-1 animate-in fade-in slide-in-from-bottom-1 duration-300">
                            <p className="text-sm font-black text-white truncate leading-tight">{userName}</p>
                            <p className="text-[10px] text-slate-500 font-bold flex items-center gap-1 truncate mt-0.5">
                                <ShieldCheck className="w-3 h-3 text-[var(--color-mint-primary)]" /> Verified Member
                            </p>
                        </div>
                    )}
                </Link>
            </div>
        </aside>
    );
}
