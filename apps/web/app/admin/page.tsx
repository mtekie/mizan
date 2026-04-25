'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, Package, MessageCircle, Search, ChevronRight, Shield, TrendingUp, Activity, BarChart3, Settings, Database, Globe, BrainCircuit } from 'lucide-react';
import Link from 'next/link';

type Tab = 'overview' | 'users' | 'products' | 'equb' | 'ai' | 'content' | 'analytics' | 'settings';

// Demo data
const stats = {
    totalUsers: 1247,
    activeToday: 89,
    avgScore: 642,
    totalProducts: 387,
    totalTransactions: 5892,
    pendingReviews: 12,
};

const demoUsers = [
    { id: 1, name: 'Dawit T.', email: 'dawit@mizan.et', score: 720, status: 'Active', joined: 'Jan 2026' },
    { id: 2, name: 'Sara M.', email: 'sara@mizan.et', score: 680, status: 'Active', joined: 'Dec 2025' },
    { id: 3, name: 'Robel H.', email: 'robel@mizan.et', score: 590, status: 'Inactive', joined: 'Nov 2025' },
    { id: 4, name: 'Hanna B.', email: 'hanna@mizan.et', score: 750, status: 'Active', joined: 'Jan 2026' },
    { id: 5, name: 'Yonas K.', email: 'yonas@mizan.et', score: 610, status: 'Active', joined: 'Feb 2026' },
];

const demoReviews = [
    { id: 1, author: 'Abebe T.', product: 'CBE Housing Loan', rating: 5, status: 'Pending', date: 'Today' },
    { id: 2, author: 'Meron A.', product: 'Awash Savings', rating: 3, status: 'Pending', date: 'Yesterday' },
    { id: 3, author: 'Kidus L.', product: 'Dashen Business Loan', rating: 4, status: 'Approved', date: '2 days ago' },
];

export default function AdminPage() {
    const [tab, setTab] = useState<Tab>('overview');
    const [searchQuery, setSearchQuery] = useState('');

    const tabs: { id: Tab; label: string; icon: any }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users & CRM', icon: Users },
        { id: 'products', label: 'Products & Rates', icon: Package },
        { id: 'equb', label: 'Equb Manager', icon: Activity },
        { id: 'ai', label: 'AI & API Tuning', icon: BrainCircuit },
        { id: 'content', label: 'Content & Loc', icon: Globe },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent">
            <header className="sticky top-0 z-20 bg-[#0F172A] px-6 py-4">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[#3EA63B] flex items-center justify-center">
                            <Shield className="w-4 h-4 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black text-white">Mizan Admin</h1>
                            <p className="text-[10px] text-slate-400">Management Dashboard</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href="/admin/products" className="text-[10px] font-black text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition">
                            Products
                        </Link>
                        <Link href="/admin/users" className="text-[10px] font-black text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition">
                            Users
                        </Link>
                        <Link href="/admin/moderation" className="text-[10px] font-black text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition">
                            Moderation
                        </Link>
                        <Link href="/admin/providers" className="text-[10px] font-black text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition">
                            Providers
                        </Link>
                        <Link href="/admin/taxonomy" className="text-[10px] font-black text-white bg-white/10 px-3 py-2 rounded-lg hover:bg-white/15 transition">
                            Taxonomy
                        </Link>
                        <span className="text-[9px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-1 rounded-full border border-[#3EA63B]/20">Admin Access</span>
                    </div>
                </div>
            </header>

            <div className="max-w-7xl mx-auto w-full flex-1 px-6 py-6 pb-24 md:pb-6">
                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-sm mb-6">
                    {tabs.map(t => {
                        const Icon = t.icon;
                        return (
                            <button
                                key={t.id}
                                onClick={() => setTab(t.id)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg text-xs font-bold transition ${tab === t.id ? 'bg-[#0F172A] text-white shadow-sm' : 'text-slate-500 hover:bg-slate-50'}`}
                            >
                                <Icon className="w-3.5 h-3.5" /> {t.label}
                            </button>
                        );
                    })}
                </div>

                {/* ──── Overview ──── */}
                {tab === 'overview' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                            {[
                                { label: 'Total Users', value: stats.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600 bg-blue-50' },
                                { label: 'Active Today', value: stats.activeToday.toString(), icon: Activity, color: 'text-[#3EA63B] bg-[#3EA63B]/10' },
                                { label: 'Avg. Score', value: stats.avgScore.toString(), icon: TrendingUp, color: 'text-amber-600 bg-amber-50' },
                                { label: 'Products', value: stats.totalProducts.toString(), icon: Package, color: 'text-purple-600 bg-purple-50' },
                                { label: 'Transactions', value: stats.totalTransactions.toLocaleString(), icon: BarChart3, color: 'text-indigo-600 bg-indigo-50' },
                                { label: 'Pending Reviews', value: stats.pendingReviews.toString(), icon: MessageCircle, color: 'text-red-600 bg-red-50' },
                            ].map(stat => {
                                const Icon = stat.icon;
                                return (
                                    <div key={stat.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 text-center">
                                        <div className={`w-8 h-8 rounded-lg mx-auto mb-2 flex items-center justify-center ${stat.color}`}>
                                            <Icon className="w-4 h-4" />
                                        </div>
                                        <p className="text-xl font-black text-slate-900">{stat.value}</p>
                                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                {[
                                    { text: 'New user Hanna B. completed onboarding', time: '2 min ago', type: 'success' },
                                    { text: 'New review submitted for CBE Housing Loan', time: '15 min ago', type: 'info' },
                                    { text: 'Expense logger usage up 23% this week', time: '1 hr ago', type: 'success' },
                                    { text: 'Exchange rate API returned fallback rates', time: '3 hr ago', type: 'warning' },
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50">
                                        <div className={`w-2 h-2 rounded-full shrink-0 ${item.type === 'success' ? 'bg-[#3EA63B]' : item.type === 'warning' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                                        <p className="text-xs text-slate-700 flex-1">{item.text}</p>
                                        <span className="text-[9px] text-slate-400 font-bold">{item.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ──── Users ──── */}
                {tab === 'users' && (
                    <div className="space-y-4">
                        <div className="relative">
                            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users... (ID, Email, Phone, Name)"
                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#3EA63B] transition" />
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden p-6 text-center">
                            <Users className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                            <h3 className="text-sm font-black text-slate-900 mb-1">User Management & CRM</h3>
                            <p className="text-xs text-slate-500 mb-4">View users, manage roles, handle KYC approvals, suspend accounts, trigger password resets, and view audit logs.</p>
                            <p className="text-[10px] text-slate-400">Framework scaffolded. Database integration pending.</p>
                        </div>
                    </div>
                )}

                {/* ──── Products ──── */}
                {tab === 'products' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 mb-1">Product & Dynamic Rate Management</h3>
                        <p className="text-xs text-slate-500 mb-4">Full CRUD interface for 387+ banking products. Manage dynamic interest rates, loan terms, and MFI offerings in real-time.</p>
                        <p className="text-[10px] text-slate-400">Framework scaffolded. CRUD API pending.</p>
                    </div>
                )}

                {/* ──── Equb ──── */}
                {tab === 'equb' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <Activity className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 mb-1">Equb / Group Savings Management</h3>
                        <p className="text-xs text-slate-500 mb-4">Monitor active Equb circles, member standing, payout queues, dispute resolution, and platform fee collection.</p>
                        <p className="text-[10px] text-slate-400">Framework scaffolded. Core Equb engine pending.</p>
                    </div>
                )}

                {/* ──── AI Tuning ──── */}
                {tab === 'ai' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <BrainCircuit className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 mb-1">AI & API Control Center</h3>
                        <p className="text-xs text-slate-500 mb-4">Manage Gemini usage quotas per user, override broken prompts, and view external API failure rates (e.g., Banks, ESX).</p>
                        <p className="text-[10px] text-slate-400">Framework scaffolded. Usage tracking pending.</p>
                    </div>
                )}

                {/* ──── Content & Loc ──── */}
                {tab === 'content' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <Globe className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 mb-1">Content & Localization</h3>
                        <p className="text-xs text-slate-500 mb-4">Interface to manage translations (English/Amharic) and update in-app financial tips dynamically without deployments.</p>
                        <p className="text-[10px] text-slate-400">Framework scaffolded. CMS integration pending.</p>
                    </div>
                )}

                {/* ──── Analytics ──── */}
                {tab === 'analytics' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <BarChart3 className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 mb-1">Financial & Platform Analytics</h3>
                        <p className="text-xs text-slate-500 mb-4">Deep insights into MAU, retention, transaction volumes, revenue tracking, and cohort analysis.</p>
                        <p className="text-[10px] text-slate-400">Framework scaffolded. Metrics collection pending.</p>
                    </div>
                )}

                {/* ──── Settings ──── */}
                {tab === 'settings' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <Settings className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 mb-1">Global System Settings</h3>
                        <p className="text-xs text-slate-500 mb-4">Feature flags, maintenance mode toggles, and global fallback configurations (e.g., adjusting default FX rates if APIs fail).</p>
                        <p className="text-[10px] text-slate-400">Framework scaffolded. Config DB pending.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
