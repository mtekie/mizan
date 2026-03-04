'use client';

import { useState } from 'react';
import { tips, type Tip } from '@/lib/data/tips';
import { ChevronRight, Bookmark, BookmarkCheck, Search, Filter } from 'lucide-react';

const topicFilters = ['All', 'Savings', 'Budgeting', 'Investing', 'Debt'];

export function TipsFeed({ userAudience }: { userAudience?: string }) {
    const [filter, setFilter] = useState('All');
    const [search, setSearch] = useState('');
    const [saved, setSaved] = useState<Set<string>>(new Set());
    const [expanded, setExpanded] = useState<string | null>(null);

    const audience = userAudience || 'professional';
    const personalized = tips.filter(t => t.audience.includes(audience));
    const filtered = personalized
        .filter(t => filter === 'All' || t.topic === filter)
        .filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.preview.toLowerCase().includes(search.toLowerCase()));

    const toggleSave = (id: string) => setSaved(s => {
        const next = new Set(s);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
    });

    return (
        <section className="space-y-4">
            {/* Search & Filters */}
            <div className="flex gap-2 items-center">
                <div className="flex-1 relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search tips..."
                        className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-[#3EA63B] transition"
                    />
                </div>
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 hide-scrollbar">
                {topicFilters.map(t => (
                    <button
                        key={t}
                        onClick={() => setFilter(t)}
                        className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition ${filter === t ? 'bg-[#0F172A] text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* Tips Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map(tip => {
                    const Icon = tip.icon;
                    const isExpanded = expanded === tip.id;
                    return (
                        <div key={tip.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 transition-all hover:shadow-md">
                            <div className="flex items-start justify-between mb-3">
                                <div className={`w-8 h-8 rounded-lg ${tip.bg} flex items-center justify-center`}>
                                    <Icon className={`w-4 h-4 ${tip.color}`} />
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="text-[9px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{tip.readTime}</span>
                                    <button onClick={() => toggleSave(tip.id)} className="text-slate-300 hover:text-[#3EA63B] transition">
                                        {saved.has(tip.id) ? <BookmarkCheck className="w-4 h-4 text-[#3EA63B]" /> : <Bookmark className="w-4 h-4" />}
                                    </button>
                                </div>
                            </div>
                            <h3 className="text-sm font-black text-slate-900 mb-1 leading-tight">{tip.title}</h3>
                            <p className="text-xs text-slate-500 leading-relaxed mb-2">{isExpanded ? tip.body : tip.preview}</p>
                            <div className="flex items-center justify-between">
                                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${tip.bg} ${tip.color}`}>{tip.topic}</span>
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : tip.id)}
                                    className="text-[10px] font-bold text-[#3EA63B] flex items-center gap-0.5 hover:underline"
                                >
                                    {isExpanded ? 'Show less' : 'Read more'} <ChevronRight className="w-3 h-3" />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-10">
                    <p className="text-sm text-slate-400 font-bold">No tips match your search</p>
                </div>
            )}
        </section>
    );
}

/** Compact carousel variant for the dashboard */
export function TipsCarousel({ userAudience }: { userAudience?: string }) {
    const audience = userAudience || 'professional';
    const top3 = tips.filter(t => t.audience.includes(audience)).slice(0, 3);

    return (
        <div className="flex gap-3 overflow-x-auto pb-2 snap-x hide-scrollbar">
            {top3.map(tip => {
                const Icon = tip.icon;
                return (
                    <div key={tip.id} className="min-w-[240px] bg-white rounded-2xl border border-slate-100 shadow-sm p-4 snap-center shrink-0">
                        <div className="flex items-center gap-2 mb-2">
                            <div className={`w-7 h-7 rounded-lg ${tip.bg} flex items-center justify-center`}>
                                <Icon className={`w-3.5 h-3.5 ${tip.color}`} />
                            </div>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${tip.bg} ${tip.color}`}>{tip.topic}</span>
                        </div>
                        <h4 className="text-xs font-black text-slate-900 mb-1 leading-tight line-clamp-2">{tip.title}</h4>
                        <p className="text-[10px] text-slate-400 line-clamp-2">{tip.preview}</p>
                    </div>
                );
            })}
        </div>
    );
}
