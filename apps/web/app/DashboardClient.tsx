'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Lightbulb, Plus, TrendingUp, ArrowDownRight, ArrowUpRight, ChevronRight, Sparkles, Send, CreditCard, Smartphone } from 'lucide-react';
import { AppPageShell } from '@/components/AppPageShell';
import { OnboardingPrompt } from '@/components/OnboardingPrompt';
import { Nudge } from '@/components/Nudge';
import { useNudges } from '@/hooks/useNudges';
import { MintDonutChart, MintBudgetBar } from '@/components/MintCharts';
import { SmartProfilePrompt } from '@/components/SmartProfilePrompt';
import { ProfileCompleteness } from '@/components/ProfileCompleteness';
import { formatMoney, formatSignedMoney, safePercent } from '@mizan/shared';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { en: 'Good Morning', am: 'ጤና ይስጥልኝ' };
  if (h < 17) return { en: 'Good Afternoon', am: 'ደህና ዋሉ' };
  return { en: 'Good Evening', am: 'ደህና ዋሉ' };
}

const getCategoryEmoji = (title: string, category?: string) => {
    const t = (title || '').toLowerCase();
    const c = (category || '').toLowerCase();
    if (t.includes('kaldi') || t.includes('coffee') || c.includes('food') || c.includes('drink')) return '☕';
    if (t.includes('deposit') || t.includes('transfer') || c.includes('income')) return '💰';
    if (t.includes('supermarket') || t.includes('shoa') || c.includes('grocer')) return '🛒';
    if (t.includes('canal') || t.includes('dstv') || c.includes('entertain')) return '📺';
    if (t.includes('telebirr') || t.includes('mobile')) return '📱';
    if (c.includes('transport')) return '🚐';
    if (c.includes('health')) return '❤️';
    return '💳';
};

export default function DashboardClient({ user, accounts, transactions, summary, featuredProducts }: { user: any, accounts: any[], transactions: any[], summary: any, featuredProducts: any[] }) {
  const [tipIndex, setTipIndex] = useState(0);
  const { activeNudge } = useNudges({ 
    user, 
    accounts, 
    goals: [], 
    mizanScore: user?.score || 600 
  });

  const aiTips = [
    { text: `You're saving ${summary.savingsRate}% of your income this month — that's excellent! Keep it up.`, emoji: '🎯' },
    { text: summary.monthlyOut > 20000 ? "Your spending is a bit high this week. Try checking your 'Entertainment' category." : "Your coffee spend is down 12% from last month. Small wins add up!", emoji: '☕' },
    { text: "Tip: Setting aside 500 ETB weekly builds an emergency fund faster than monthly lump sums.", emoji: '💡' },
    { text: `Your net worth is now ${formatMoney(summary.netWorth)}. You're making great progress!`, emoji: '📈' },
  ];

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
        <Link href="/notifications" className="relative p-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
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
            <Link href="/score" className="mint-card animate-slide-up flex items-center gap-4 group hover:shadow-md transition-shadow" style={{ animationDelay: '0.1s' }}>
              <div className="w-12 h-12 rounded-2xl bg-[var(--color-mint-primary)]/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-5 h-5 text-[var(--color-mint-primary)]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-[var(--color-mint-text)]">Mizan Score</p>
                <p className="text-[11px] text-[var(--color-mint-text-muted)]">Improving • Last updated today</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-black text-[var(--color-mint-deep)]">{user?.score || user?.mizanScore || 720}</p>
                <p className="text-[10px] font-bold text-[var(--color-mint-primary)] uppercase">
                  {(user?.score || user?.mizanScore || 720) > 750 ? 'Excellent' : (user?.score || user?.mizanScore || 720) > 600 ? 'Good' : 'Fair'}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-mint-primary)] transition-colors" />
            </Link>

            {/* Quick Actions */}
            <div className="grid grid-cols-4 gap-3 animate-slide-up" style={{ animationDelay: '0.15s' }}>
              {[
                { icon: ArrowUpRight, label: 'Send', color: '#3B82F6', bg: 'bg-blue-50' },
                { icon: ArrowDownRight, label: 'Request', color: '#10B981', bg: 'bg-emerald-50' },
                { icon: CreditCard, label: 'Pay', color: '#8B5CF6', bg: 'bg-purple-50' },
                { icon: Smartphone, label: 'Airtime', color: '#F59E0B', bg: 'bg-amber-50' },
              ].map(action => (
                <button key={action.label} className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                  <div className={`w-10 h-10 rounded-xl ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <action.icon className="w-5 h-5" style={{ color: action.color }} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-600">{action.label}</span>
                </button>
              ))}
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
                <Link href="/ledger" className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
                  See all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {!transactions || transactions.length === 0 ? (
                <div className="pt-2 pb-4 text-center">
                  <p className="text-xs text-[var(--color-mint-text-muted)]">No transactions found.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-50">
                  {transactions.slice(0, 3).map((tx: any) => (
                    <div key={tx.id} className="flex items-center gap-4 py-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
                        {getCategoryEmoji(tx.title, tx.category)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-[var(--color-mint-text)] truncate">{tx.title}</p>
                        <p className="text-[11px] text-[var(--color-mint-text-muted)]">{tx.source || 'Manual'}</p>
                      </div>
                      <p className={`text-sm font-extrabold ${tx.amount < 0 ? 'text-[var(--color-mint-text)]' : 'text-[var(--color-mint-deep)]'}`}>
                        {formatSignedMoney(tx.amount)}
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
                <Link href="/ledger" className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
                  Details <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <MintDonutChart data={summary.spendingData || []} totalSpent={summary.monthlyOut} />
            </div>

            {/* Savings Goal Peek */}
            <div className="mint-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-sm font-bold text-[var(--color-mint-text)]">Savings Goal</h3>
                <Link href="/dreams" className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
                  View all <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-2xl">{summary.topGoal?.emoji || '🎯'}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-[var(--color-mint-text)]">{summary.topGoal?.name || 'My Savings'}</h4>
                  <p className="text-[11px] text-[var(--color-mint-text-muted)]">
                    {summary.topGoal ? `${formatMoney(summary.topGoal.saved)} / ${formatMoney(summary.topGoal.target)}` : 'No goal yet'}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[var(--color-mint-primary)]"
                        style={{ width: `${summary.topGoal ? Math.min(100, safePercent(summary.topGoal.saved, summary.topGoal.target)) : 0}%` }}
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
