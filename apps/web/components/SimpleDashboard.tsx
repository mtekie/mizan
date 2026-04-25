'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bell, Lightbulb, Plus, TrendingUp, ArrowDownRight, ArrowUpRight, ChevronRight, Sparkles } from 'lucide-react';
import { OnboardingPrompt } from '@/components/OnboardingPrompt';
import { Nudge } from '@/components/Nudge';
import { useNudges } from '@/hooks/useNudges';
import { MintDonutChart, MintBudgetBar } from './MintCharts';
import { SmartProfilePrompt } from './SmartProfilePrompt';
import { ProfileCompleteness } from './ProfileCompleteness';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return { en: 'Good Morning', am: 'ጤና ይስጥልኝ' };
  if (h < 17) return { en: 'Good Afternoon', am: 'ደህና ዋሉ' };
  return { en: 'Good Evening', am: 'ደህና ዋሉ' };
}

export function SimpleDashboard({ user, accounts, transactions, summary, featuredProducts }: { user: any, accounts: any[], transactions: any[], summary: any, featuredProducts: any[] }) {
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
    { text: `Your net worth is now ${summary.netWorth.toLocaleString()} ETB. You're making great progress!`, emoji: '📈' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex(i => (i + 1) % aiTips.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [aiTips.length]);

  const tip = aiTips[tipIndex];
  const greeting = getGreeting();

  // Category emoji mapping
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

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] md:bg-slate-50 md:p-8">
      {/* ── Mobile Hero Header (hidden on desktop) ── */}
      <div className="md:hidden mint-gradient-hero px-6 pt-14 pb-8 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/5"></div>
        <div className="absolute -left-6 bottom-0 w-24 h-24 rounded-full bg-white/5"></div>

        {/* Top bar */}
        <div className="flex justify-between items-center mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-black text-lg border border-white/20">
              {user?.name?.[0] || 'U'}
            </div>
            <div>
              <p className="text-white/70 text-xs font-semibold">{greeting.en}</p>
              <h1 className="text-white font-bold text-lg leading-tight">
                {user?.name?.split(' ')[0] || 'User'} <span className="font-ethiopic text-white/60 text-sm">👋</span>
              </h1>
            </div>
          </div>
          <Link href="/notifications" className="relative p-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/10">
            <Bell className="w-5 h-5 text-white" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--color-mint-coral)] rounded-full ring-2 ring-[var(--color-mint-deep)]"></span>
          </Link>
        </div>

        {/* Hero Balance */}
        <div className="text-center relative z-10 mb-6">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">Total Balance</p>
          <h2 className="text-white text-4xl font-black tracking-tight animate-count-up leading-none mb-1">
            {summary.netWorth.toLocaleString()}
            <span className="text-lg font-bold text-white/50 ml-2">ETB</span>
          </h2>
        </div>

        {/* In / Out Pills */}
        <div className="flex justify-center gap-3 relative z-10">
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-5 h-5 rounded-full bg-[#D4EDDA] flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3 text-[var(--color-mint-deep)]" />
            </div>
            <div>
              <p className="text-white/50 text-[9px] font-bold uppercase">Income</p>
              <p className="text-white font-bold text-sm leading-none">+{summary.monthlyIn.toLocaleString()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
            <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center">
              <ArrowDownRight className="w-3 h-3 text-[var(--color-mint-coral)]" />
            </div>
            <div>
              <p className="text-white/50 text-[9px] font-bold uppercase">Spent</p>
              <p className="text-white font-bold text-sm leading-none">-{summary.monthlyOut.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Desktop Header ── */}
      <div className="hidden md:flex justify-between items-end mb-8 max-w-6xl mx-auto w-full">
        <div>
          <p className="text-sm font-semibold text-slate-500 mb-1">{greeting.en}</p>
          <h1 className="text-3xl font-black text-slate-900 leading-none">
            {user?.name?.split(' ')[0] || 'User'} <span className="font-ethiopic text-2xl text-slate-400">👋</span>
          </h1>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Net Worth</p>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 leading-none">
            {summary.netWorth.toLocaleString()}
            <span className="text-lg font-bold text-slate-500 ml-2">ETB</span>
          </h2>
        </div>
      </div>

      {/* ── Content Area ── */}
      <div className="flex-1 px-5 md:px-0 -mt-4 md:mt-0 relative z-10 pb-28 md:pb-8 max-w-6xl mx-auto w-full">
        
        {/* On desktop, use a CSS grid for the cards */}
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

            {/* Quick Actions (Mobile only, on desktop they use the sidebar/navbar) */}
            <div className="md:hidden mint-card flex justify-around py-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          {[
            { label: 'Plan', icon: Plus, href: '/dreams', color: 'bg-[var(--color-mint-primary)]' },
            { label: 'Send', icon: ArrowUpRight, href: '/transfer', color: 'bg-blue-500' },
            { label: 'Score', icon: TrendingUp, href: '/score', color: 'bg-amber-500' },
            { label: 'More', icon: Sparkles, href: '/catalogue', color: 'bg-purple-500' },
          ].map((action) => (
            <Link
              key={action.label}
              href={action.href}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className={`w-12 h-12 rounded-2xl ${action.color} flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow group-active:scale-95 transition-transform`}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-bold text-[var(--color-mint-text-muted)]">{action.label}</span>
            </Link>
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
          {/* Tip progress dots */}
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
            <div>
              {transactions.slice(0, 3).map((tx: any) => (
                <div key={tx.id} className="mint-tx-row last:border-b-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-lg">
                    {getCategoryEmoji(tx.title, tx.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-[var(--color-mint-text)] truncate">{tx.title}</p>
                    <p className="text-[11px] text-[var(--color-mint-text-muted)]">{tx.source || 'Manual'}</p>
                  </div>
                  <p className={`text-sm font-extrabold ${tx.amount < 0 ? 'text-[var(--color-mint-text)]' : 'text-[var(--color-mint-deep)]'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-[10px] font-semibold text-[var(--color-mint-text-muted)]">ETB</span>
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
            <h3 className="text-sm font-bold text-[var(--color-mint-text)]">This month&apos;s spending</h3>
            <Link href="/ledger" className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
              Details <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <MintDonutChart data={summary.spendingData || []} totalSpent={summary.monthlyOut} />
        </div>

        {/* Budgets */}
        <div className="mint-card animate-slide-up" style={{ animationDelay: '0.35s' }}>
           <div className="flex justify-between items-center mb-4">
            <h3 className="text-sm font-bold text-[var(--color-mint-text)]">Monthly Budgets</h3>
            <Link href="/dreams" className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
              Edit <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {(!summary.budgets || summary.budgets.length === 0 || !summary.budgets[0].categories || summary.budgets[0].categories.length === 0) ? (
            <div className="text-center py-2">
              <p className="text-xs text-[var(--color-mint-text-muted)] mb-3">No budgets set up yet.</p>
              <MintBudgetBar spent={summary.monthlyOut} total={summary.monthlyOut > 0 ? summary.monthlyOut * 1.2 : 5000} title="Overall Estimate" />
            </div>
          ) : (
             <div className="space-y-4">
               {summary.budgets[0].categories.map((c: any) => (
                 <MintBudgetBar key={c.id} spent={c.spent} total={c.allocated} title={c.name} />
               ))}
             </div>
          )}
        </div>

        {/* Savings Goal Peek */}
        <div className="mint-card animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-[var(--color-mint-text)]">Top Goal</h3>
            <Link href="/dreams" className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
              Create goal <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-2xl">{summary.topGoal?.emoji || '➕'}</div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-[var(--color-mint-text)]">{summary.topGoal?.name || 'Start Saving'}</h4>
              <p className="text-[11px] text-[var(--color-mint-text-muted)]">
                {summary.topGoal ? `${summary.topGoal.saved.toLocaleString()} / ${summary.topGoal.target.toLocaleString()}` : 'No active goals'}
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${summary.topGoal ? (summary.topGoal.saved / summary.topGoal.target * 100) : 0}%`, background: 'linear-gradient(90deg, #45BFA0, #2D9E82)' }}
                  />
                </div>
                <span className="text-[11px] font-black text-[var(--color-mint-text)]">
                    {summary.topGoal ? Math.round(summary.topGoal.saved / summary.topGoal.target * 100) : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Products Peek */}
        {featuredProducts && featuredProducts.length > 0 && (
          <div className="mint-card animate-slide-up" style={{ animationDelay: '0.6s' }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-[var(--color-mint-text)]">Featured for You</h3>
              <Link href="/catalogue" className="text-xs font-bold text-[var(--color-mint-primary)] flex items-center gap-0.5 hover:underline">
                See all <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {featuredProducts.slice(0, 2).map((product: any) => (
                <Link href={`/catalogue/${product.id}`} key={product.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center font-bold text-xs text-slate-400 border border-slate-100 shadow-sm">
                    {product.bankLogo || '🏦'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 truncate">{product.title || product.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{product.bankName || 'Financial Institution'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[#3EA63B]">{product.interestRate}%</p>
                    <p className="text-[9px] text-slate-400 font-bold uppercase">Interest</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
        </div>
        </div>
      </div>
      <SmartProfilePrompt user={user} />
    </div>
  );
}
