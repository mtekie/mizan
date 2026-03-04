'use client';

import { TrendingUp, Users, Target, Award } from 'lucide-react';

type Props = {
    mizanScore?: number;
    savingsRate?: number;
    profileComplete?: boolean;
};

export function LeaderboardWidget({ mizanScore = 680, savingsRate = 72, profileComplete = true }: Props) {
    // Demo percentile data — would be computed from aggregated DB data in production
    const scorePercentile = Math.min(99, Math.round((mizanScore / 850) * 100));
    const savingsPercentile = savingsRate;

    const stats = [
        {
            label: 'Savings Rate',
            value: `Top ${100 - savingsPercentile}%`,
            detail: `You save more than ${savingsPercentile}% of users in your age group`,
            icon: TrendingUp,
            color: 'text-[#3EA63B]',
            bg: 'bg-[#3EA63B]/10',
            bar: savingsPercentile,
        },
        {
            label: 'Mizan Score',
            value: `${mizanScore}`,
            detail: `Higher than ${scorePercentile}% of all Mizan users`,
            icon: Award,
            color: 'text-blue-600',
            bg: 'bg-blue-50',
            bar: scorePercentile,
        },
        {
            label: 'Profile Status',
            value: profileComplete ? 'Complete' : 'Incomplete',
            detail: profileComplete ? 'You\'re in the top 15% of fully onboarded users' : 'Complete your profile to boost your score',
            icon: Users,
            color: profileComplete ? 'text-emerald-600' : 'text-amber-600',
            bg: profileComplete ? 'bg-emerald-50' : 'bg-amber-50',
            bar: profileComplete ? 85 : 40,
        },
    ];

    return (
        <section className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-slate-400" />
                <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">How You Compare</h3>
                <span className="text-[9px] font-bold text-slate-300 bg-slate-100 px-1.5 py-0.5 rounded ml-auto">Anonymous</span>
            </div>
            <div className="space-y-4">
                {stats.map(stat => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.label}>
                            <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-lg ${stat.bg} flex items-center justify-center`}>
                                        <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                                    </div>
                                    <span className="text-xs font-bold text-slate-900">{stat.label}</span>
                                </div>
                                <span className={`text-xs font-black ${stat.color}`}>{stat.value}</span>
                            </div>
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mb-1">
                                <div className={`h-full rounded-full transition-all bg-gradient-to-r from-slate-300 ${stat.bar > 50 ? 'to-[#3EA63B]' : 'to-amber-400'}`} style={{ width: `${stat.bar}%` }} />
                            </div>
                            <p className="text-[10px] text-slate-400">{stat.detail}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
