'use client';

import { ArrowLeft, Search, Sparkles, AlertCircle, ShoppingBag, Landmark, Shield, Users, Building2, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function SimpleCatalogue({ products, categories }: { products: any[], categories: readonly any[] }) {
  console.log(categories); // Just to clear unused variable warning
  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24">
      <header className="mint-gradient-hero px-6 pt-12 pb-6 flex items-center justify-between text-white sticky top-0 z-20">
        <div className="flex items-center gap-3">
          <Link href="/" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-xl font-bold">Explore</h1>
        </div>
        <button className="w-10 h-10 rounded-full bg-white text-[var(--color-mint-primary)] flex items-center justify-center shadow-md">
          <Search className="w-5 h-5" />
        </button>
      </header>

      <main className="px-6 -mt-4 relative z-10 space-y-4">
        {/* Quick Filters */}
        <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
          {['Banks', 'Insurance', 'Loans', 'Savings'].map(f => (
            <button key={f} className="px-4 py-2 rounded-xl bg-white text-slate-600 text-xs font-bold whitespace-nowrap shadow-sm border border-slate-100">
              {f}
            </button>
          ))}
        </div>

        {/* Top Picks */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 pb-2">
          <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Top Picks for You
          </h2>

          <div className="space-y-4">
            {products.slice(0, 3).map((p: any) => (
              <div key={p.id} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                  {p.bankLogo || 'BK'}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-sm text-slate-800">{p.title || p.name}</h3>
                  <p className="text-[10px] text-slate-400 font-semibold mb-1">{p.bankName}</p>
                  <div className="flex gap-2">
                    {(p.details || []).slice(0, 2).map((d: any, i: number) => (
                      <span key={i} className="text-[9px] bg-slate-50 text-slate-500 px-2 py-0.5 rounded font-bold">
                        {d.value}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        <button className="w-full py-4 text-center text-xs font-bold text-[var(--color-mint-primary)] bg-[var(--color-mint-primary)]/10 rounded-2xl">
          View All Products
        </button>
      </main>
    </div>
  );
}
