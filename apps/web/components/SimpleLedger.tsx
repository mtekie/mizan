'use client';

import { ArrowLeft, ArrowDownRight, ArrowUpRight, Plus } from 'lucide-react';
import Link from 'next/link';

export function SimpleLedger({ accounts, transactions, summary }: { accounts: any[], transactions: any[], summary: any }) {
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
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24">
      <header className="mint-gradient-hero px-6 pt-12 pb-6 flex items-center justify-between text-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Money</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white text-[var(--color-mint-primary)] flex items-center justify-center shadow-md">
          <Plus className="w-5 h-5" />
        </button>
      </header>

      <main className="px-6 -mt-4 relative z-10 space-y-4">
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Total Balance</p>
            <p className="text-2xl font-black text-slate-800">{(summary.netWorth ?? 0).toLocaleString()} <span className="text-sm">ETB</span></p>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Transactions</h3>
          {!transactions || transactions.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No transactions.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-xl">
                       {getCategoryEmoji(tx.title, tx.category)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{tx.title}</p>
                      <p className="text-[11px] text-slate-400">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className={`text-sm font-black ${tx.amount < 0 ? 'text-slate-800' : 'text-[#3EA63B]'}`}>
                    {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} <span className="text-[10px] text-slate-400 font-semibold">ETB</span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
