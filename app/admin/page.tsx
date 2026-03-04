'use client';

import { useState } from 'react';
import { LayoutDashboard, Users, Package, MessageCircle, Search, ChevronRight, Shield, TrendingUp, Activity, BarChart3 } from 'lucide-react';

type Tab = 'overview' | 'users' | 'products' | 'reviews';

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

    const tabs: { id: Tab; label: string; icon: typeof LayoutDashboard }[] = [
        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
        { id: 'users', label: 'Users', icon: Users },
        { id: 'products', label: 'Products', icon: Package },
        { id: 'reviews', label: 'Reviews', icon: MessageCircle },
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
                    <span className="text-[9px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-1 rounded-full border border-[#3EA63B]/20">Admin Access</span>
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
                            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search users..."
                                className="w-full pl-9 pr-4 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#3EA63B] transition" />
                        </div>
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-slate-200">
                                        <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">User</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Score</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="text-left px-4 py-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">Joined</th>
                                        <th className="px-4 py-3"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demoUsers.filter(u => !searchQuery || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.includes(searchQuery.toLowerCase())).map(user => (
                                        <tr key={user.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6ED063] to-[#3EA63B] flex items-center justify-center text-white font-bold text-[10px]">{user.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                                                        <p className="text-[10px] text-slate-400">{user.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-xs font-black ${user.score >= 700 ? 'text-[#3EA63B]' : user.score >= 600 ? 'text-amber-600' : 'text-red-500'}`}>{user.score}</span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${user.status === 'Active' ? 'bg-[#3EA63B]/10 text-[#3EA63B]' : 'bg-slate-100 text-slate-500'}`}>{user.status}</span>
                                            </td>
                                            <td className="px-4 py-3 text-xs text-slate-500">{user.joined}</td>
                                            <td className="px-4 py-3"><ChevronRight className="w-4 h-4 text-slate-300" /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ──── Products ──── */}
                {tab === 'products' && (
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 text-center">
                        <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                        <h3 className="text-sm font-black text-slate-900 mb-1">Product Management</h3>
                        <p className="text-xs text-slate-500 mb-4">{stats.totalProducts} products across Banks, MFIs, SACCOs, BNPL, and Insurance</p>
                        <p className="text-[10px] text-slate-400">CMS integration coming soon. Products are currently managed via <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px]">lib/data/products.ts</code></p>
                    </div>
                )}

                {/* ──── Reviews ──── */}
                {tab === 'reviews' && (
                    <div className="space-y-3">
                        {demoReviews.map(review => (
                            <div key={review.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{review.author.charAt(0)}</div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-900">{review.author} reviewed <span className="text-[#3EA63B]">{review.product}</span></p>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <span className="text-[9px] text-slate-400">{review.date}</span>
                                            <span className="text-[9px] font-bold text-amber-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {review.status === 'Pending' && (
                                        <>
                                            <button className="text-[9px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2.5 py-1 rounded-lg hover:bg-[#3EA63B]/20 transition">Approve</button>
                                            <button className="text-[9px] font-bold text-red-500 bg-red-50 px-2.5 py-1 rounded-lg hover:bg-red-100 transition">Reject</button>
                                        </>
                                    )}
                                    {review.status === 'Approved' && (
                                        <span className="text-[9px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2.5 py-1 rounded-lg">Approved</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
