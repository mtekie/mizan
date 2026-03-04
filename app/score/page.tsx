'use client';

import { ArrowLeft, MoreHorizontal, Lightbulb, CheckCircle2, TrendingUp, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { LeaderboardWidget } from '@/components/LeaderboardWidget';

export default function Score() {
  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent md:py-8">
      <header className="flex items-center justify-between px-6 pt-6 pb-4 bg-slate-50 md:bg-transparent sticky top-0 z-10">
        <Link href="/" className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-slate-900 transition-transform active:scale-95">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold">Mizan Score</h1>
        <button className="flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-slate-900 transition-transform active:scale-95">
          <MoreHorizontal className="w-6 h-6" />
        </button>
      </header>

      <main className="flex-1 flex flex-col gap-6 px-6 pb-24 md:pb-0 overflow-y-auto hide-scrollbar">
        <section className="flex flex-col items-center justify-center py-6">
          <div className="relative flex items-center justify-center w-64 h-64">
            <div className="absolute inset-0 rounded-full border-[20px] border-[#6ED063]/20"></div>
            <svg className="absolute inset-0 transform -rotate-90 w-full h-full drop-shadow-lg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="#3EA63B" strokeWidth="8" strokeLinecap="round" strokeDasharray="251.2" strokeDashoffset="70"></circle>
            </svg>
            <div className="flex flex-col items-center justify-center text-center z-10 bg-white w-48 h-48 rounded-full shadow-inner">
              <span className="text-5xl font-bold text-slate-900 tracking-tighter">720</span>
              <span className="text-sm font-medium text-[#3EA63B] uppercase tracking-wider mt-1">Excellent</span>
              <p className="text-xs text-slate-500 mt-2">Updated today</p>
            </div>
          </div>
          <p className="mt-4 text-center text-sm text-slate-600 px-8">
            Your financial health is strong. Keep up the consistency with your Equb contributions.
          </p>
        </section>

        <section className="rounded-xl bg-gradient-to-br from-[#6ED063]/10 to-[#3EA63B]/5 p-5 border border-[#6ED063]/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <Lightbulb className="w-16 h-16 text-[#3EA63B]" />
          </div>
          <div className="flex items-start gap-3 relative z-10">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#3EA63B] text-white flex items-center justify-center shadow-lg shadow-[#3EA63B]/30">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base mb-1 text-slate-900">Mizan AI Tip</h3>
              <p className="text-sm text-slate-700 leading-relaxed">
                Increasing your monthly savings by just 500 ETB could boost your score to <span className="font-bold text-[#3EA63B]">745</span> by next month.
              </p>
            </div>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900">Impact Factors</h2>
            <button className="text-xs font-semibold text-[#3EA63B] hover:underline transition-colors">View All</button>
          </div>
          <div className="flex flex-col gap-3">
            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-[#3EA63B] shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">Equb Consistency</h4>
                <p className="text-xs text-slate-500 truncate">On time for 6 cycles</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-[#3EA63B] bg-[#6ED063]/10 px-2 py-1 rounded-full">+15 pts</span>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">Savings Growth</h4>
                <p className="text-xs text-slate-500 truncate">Growing, but below target</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">Stable</span>
              </div>
            </div>

            <div className="group flex items-center gap-4 p-4 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-green-100 text-[#3EA63B] shrink-0">
                <CheckCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-slate-900 truncate">Utility Payments</h4>
                <p className="text-xs text-slate-500 truncate">All bills paid on time</p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xs font-bold text-[#3EA63B] bg-[#6ED063]/10 px-2 py-1 rounded-full">+5 pts</span>
              </div>
            </div>
          </div>
        </section>

        {/* How You Compare */}
        <LeaderboardWidget mizanScore={720} />
      </main>
    </div>
  );
}
