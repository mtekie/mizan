'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Bell, Lightbulb, Plus, TrendingUp, ArrowDownLeft, ArrowUpRight, ChevronRight, Sparkles, Send, CreditCard, Smartphone } from 'lucide-react';
import { AppPageShell } from '@/components/AppPageShell';
import { OnboardingPrompt } from '@/components/OnboardingPrompt';
import { Nudge } from '@/components/Nudge';
import { useNudges } from '@/hooks/useNudges';
import { MintDonutChart } from '@/components/MintCharts';
import { SmartProfilePrompt } from '@/components/SmartProfilePrompt';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { type HomeScreenDataContract } from '@mizan/shared';
import { appendParityQuery } from '@/lib/parity-query';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { en: 'Good Morning', am: 'ጤና ይስጥልኝ' };
  if (h < 17) return { en: 'Good Afternoon', am: 'ደህና ዋሉ' };
  return { en: 'Good Evening', am: 'ደህና ዋሉ' };
}



const quickActionIconMap = {
  'arrow-up-right': ArrowUpRight,
  'arrow-down-left': ArrowDownLeft,
  'credit-card': CreditCard,
  smartphone: Smartphone,
};

export default function DashboardClient({ user, accounts, home }: { user: any, accounts: any[], home: HomeScreenDataContract }) {
  const [tipIndex, setTipIndex] = useState(0);
  const searchParams = useSearchParams();
  const parityHref = (href: string) => appendParityQuery(href, searchParams);
  const { activeNudge } = useNudges({ 
    user, 
    accounts, 
    goals: [], 
    mizanScore: user?.score || 600 
  });

  const aiTips = home.insights;
  const spendingData = home.spending.categories.map(category => ({
    name: category.name,
    value: category.amount,
    color: category.color,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(i => (i + 1) % aiTips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [aiTips.length]);

  const tip = aiTips[tipIndex];
  const greeting = getGreeting();

  return (
    <AppPageShell
      title="Home"
      variant="hero"
      actions={
        <Link href={parityHref('/notifications')} className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
          <Bell className="w-5 h-5 text-white" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[var(--color-mint-deep)]"></span>
        </Link>
      }
    >
      {/* ── Dashboard Content ── */}
      <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-6">
          
          {/* Left Column (Main insights & transactions) */}
          <div className="md:col-span-8 space-y-4 md:space-y-6">
            
            <ProfileCompleteness user={user} />

            {activeNudge && (
                <Nudge {...activeNudge} variant="card" />
            )}

            {accounts.length === 0 && !activeNudge && (
                <OnboardingPrompt type="accounts" userName={user?.name?.split(' ')[0]} />
            )}

            {/* Mizan Score Preview */}
            <Link href={parityHref('/score')} className="mint-card animate-slide-up flex items-center gap-4 group hover:shadow-md transition-shadow" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-mint-primary)]/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-[var(--color-mint-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-mint-text)]">Mizan Score</p>
                <p className="text-[11px] text-[var(--color-mint-text-muted)]">{home.score.status}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[var(--color-mint-deep)]">{home.score.value}</p>
                <p className="text-[10px] font-bold text-[var(--color-mint-primary)] uppercase">
                  {home.score.label}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-mint-primary)] transition-colors" />
            </Link>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              {home.quickActions.map(action => {
                const ActionIcon = quickActionIconMap[action.icon as keyof typeof quickActionIconMap] ?? ArrowUpRight;

                return (
                <Link key={action.key} href={parityHref(action.href)} className="flex flex-col items-center gap-2 group transition-transform hover:scale-105">
                  <div className="w-14 h-14 rounded-[20px] flex items-center justify-center" style={{ backgroundColor: `${action.color}1A` }}>
                    <ActionIcon className="w-6 h-6" style={{ color: action.color }} />
                  </div>
                  <span className="text-xs font-bold text-slate-600">{action.label}</span>
                </Link>
                );
              })}
            </div>

            {/* AI Insight Card */}
            <div className="mint-card animate-slide-up relative overflow-hidden" style={{ animationDelay: '0.2s' }}>
              <div className="absolute -right-4 -bottom-4 text-4xl opacity-10">{tip.emoji}</div>
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-[var(--color-mint-primary)]/10 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-4.5 h-4.5 text-[var(--color-mint-primary)]" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold text-[var(--color-mint-primary)] uppercase tracking-wider mb-1">Mizan Insight</p>
                  <p className="text-[13px] text-[var(--color-mint-text)] leading-relaxed">{tip.text}</p>
                </div>
              </div>
              <div className="flex justify-center gap-1.5 mt-4">
                {aiTips.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all duration-300 ${i === tipIndex ? 'w-4 bg-[var(--color-mint-primary)]' : 'w-1 bg-slate-200'}`}
                  />
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="mint-card animate-slide-up" style={{ animationDelay: '0.3s' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[var(--color-mint-text)]">Recent Transactions</h3>
                <Link href={parityHref('/ledger')} className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
                  See all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {home.recentTransactions.length === 0 ? (
                <div className="pt-2 pb-4 text-center">
                  <p className="text-xs font-bold text-[var(--color-mint-text)]">{home.states.transactionsEmpty.title}</p>
                  <p className="mt-1 text-xs text-[var(--color-mint-text-muted)]">{home.states.transactionsEmpty.description}</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {home.recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex items-center gap-4 py-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
                        {tx.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--color-mint-text)] truncate">{tx.title}</p>
                        <p className="text-[11px] text-[var(--color-mint-text-muted)]">{tx.source}</p>
                      </div>
                      <p className={`text-sm font-extrabold ${tx.isIncome ? 'text-[var(--color-mint-deep)]' : 'text-[var(--color-mint-text)]'}`}>
                        {tx.isIncome ? '+' : '-'}{tx.amountFormatted}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column (Charts & Plan) */}
          <div className="md:col-span-4 space-y-4 md:space-y-6">
            
            {/* Spending Insights */}
            <div className="mint-card animate-slide-up" style={{ animationDelay: '0.25s' }}>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold text-[var(--color-mint-text)]">Spending Insights</h3>
                <Link href={parityHref('/ledger')} className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <MintDonutChart data={spendingData} totalSpent={home.money.monthlyOut} />
            </div>

            {/* Savings Goal Peek */}
            <div className="mint-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-[var(--color-mint-text)]">Savings Goal</h3>
                <Link href={parityHref('/dreams')} className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{home.topGoal?.emoji || '🎯'}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--color-mint-text)]">{home.topGoal?.name || 'My Savings'}</h4>
                  <p className="text-[11px] text-[var(--color-mint-text-muted)]">
                    {home.topGoal ? `${home.topGoal.savedFormatted} / ${home.topGoal.targetFormatted}` : 'No goal yet'}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--color-mint-primary)]"
                        style={{ width: `${home.topGoal ? Math.min(100, home.topGoal.percent) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
      </div>
      <SmartProfilePrompt user={user} />
    </AppPageShell>
  );
}
