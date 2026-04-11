'use client';

import { ArrowLeft, Star, TrendingUp, Info, FileText } from 'lucide-react';
import Link from 'next/link';

export default function StockDetail() {
  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent md:py-8">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-4 py-3 md:bg-transparent md:border-none">
        <div className="flex items-center justify-between">
          <Link href="/wealth" className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <ArrowLeft className="w-6 h-6 text-slate-900" />
          </Link>
          <div className="flex flex-col items-center">
            <h1 className="text-base font-bold text-slate-900">Ethio Telecom</h1>
            <span className="text-xs text-slate-500 font-mono">ETHIO</span>
          </div>
          <button className="flex size-10 items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
            <Star className="w-6 h-6 text-slate-900" />
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto pb-32 md:pb-0">
        <div className="px-6 pt-6 pb-2 text-center">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-4xl font-extrabold tracking-tight text-slate-900">185.00</span>
            <span className="text-lg font-medium text-slate-500">ETB</span>
          </div>
          <div className="mt-2 flex items-center justify-center gap-2">
            <TrendingUp className="text-[#3EA63B] w-5 h-5" />
            <span className="text-lg font-bold text-[#3EA63B]">+5.20%</span>
            <span className="text-sm text-slate-500">(+9.15 ETB)</span>
          </div>
          <p className="mt-1 text-xs text-slate-400">Last updated: Today, 10:45 AM</p>
        </div>

        <div className="mt-4 px-4">
          <div className="flex justify-between px-2 mb-4">
            <button className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm border border-slate-200">1D</button>
            <button className="rounded-lg bg-[#3EA63B] text-white px-3 py-1 text-xs font-bold shadow-md">1W</button>
            <button className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm border border-slate-200">1M</button>
            <button className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm border border-slate-200">1Y</button>
            <button className="rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm border border-slate-200">ALL</button>
          </div>

          {/* Candlestick Chart Placeholder */}
          <div className="relative h-48 w-full rounded-2xl bg-white border border-slate-200 p-4 overflow-hidden shadow-sm">
            <div className="absolute inset-0 flex flex-col justify-between p-4 opacity-10">
              <div className="h-px w-full bg-slate-500"></div>
              <div className="h-px w-full bg-slate-500"></div>
              <div className="h-px w-full bg-slate-500"></div>
              <div className="h-px w-full bg-slate-500"></div>
              <div className="h-px w-full bg-slate-500"></div>
            </div>
            <div className="relative flex h-full items-end justify-between px-2">
              <div className="group relative flex w-3 flex-col items-center justify-end h-full">
                <div className="h-16 w-[1px] bg-[#3EA63B] absolute bottom-8"></div>
                <div className="h-8 w-full rounded-sm bg-[#3EA63B] absolute bottom-12"></div>
              </div>
              <div className="group relative flex w-3 flex-col items-center justify-end h-full">
                <div className="h-14 w-[1px] bg-red-500 absolute bottom-6"></div>
                <div className="h-6 w-full rounded-sm bg-red-500 absolute bottom-10"></div>
              </div>
              <div className="group relative flex w-3 flex-col items-center justify-end h-full">
                <div className="h-20 w-[1px] bg-[#3EA63B] absolute bottom-10"></div>
                <div className="h-12 w-full rounded-sm bg-[#3EA63B] absolute bottom-14"></div>
              </div>
              <div className="group relative flex w-3 flex-col items-center justify-end h-full">
                <div className="h-24 w-[1px] bg-[#3EA63B] absolute bottom-12"></div>
                <div className="h-10 w-full rounded-sm bg-[#3EA63B] absolute bottom-16"></div>
              </div>
              <div className="group relative flex w-3 flex-col items-center justify-end h-full">
                <div className="h-16 w-[1px] bg-red-500 absolute bottom-18"></div>
                <div className="h-4 w-full rounded-sm bg-red-500 absolute bottom-24"></div>
              </div>
              <div className="group relative flex w-3 flex-col items-center justify-end h-full">
                <div className="h-28 w-[1px] bg-[#3EA63B] absolute bottom-16"></div>
                <div className="h-14 w-full rounded-sm bg-[#3EA63B] absolute bottom-20"></div>
              </div>
              <div className="group relative flex w-3 flex-col items-center justify-end h-full">
                <div className="h-32 w-[1px] bg-[#3EA63B] absolute bottom-20"></div>
                <div className="h-16 w-full rounded-sm bg-[#3EA63B] absolute bottom-28 animate-pulse"></div>
                <div className="absolute top-[26%] left-full w-screen border-t border-dashed border-[#3EA63B]/50 pl-2 flex items-center">
                  <span className="bg-[#3EA63B] text-white text-[10px] px-1 rounded">185.00</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Market Insights</h2>
            <Info className="w-5 h-5 text-slate-400" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-white p-3 border border-slate-200 flex flex-col items-center text-center shadow-sm">
              <span className="text-xs text-slate-500 mb-1">P/E Ratio</span>
              <span className="text-sm font-bold text-slate-900">12.4</span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-slate-200 flex flex-col items-center text-center shadow-sm">
              <span className="text-xs text-slate-500 mb-1">Market Cap</span>
              <span className="text-sm font-bold text-slate-900">350B</span>
            </div>
            <div className="rounded-xl bg-white p-3 border border-slate-200 flex flex-col items-center text-center shadow-sm">
              <span className="text-xs text-slate-500 mb-1">Div Yield</span>
              <span className="text-sm font-bold text-[#3EA63B]">4.8%</span>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Company News</h2>
            <button className="text-xs font-semibold text-[#3EA63B]">View All</button>
          </div>
          <div className="space-y-3">
            <div className="group flex gap-3 rounded-xl bg-white p-3 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                <FileText className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <h3 className="text-sm font-semibold text-slate-900 leading-snug font-ethiopic">ኢትዮ ቴሌኮም አዲስ የ5ጂ አገልግሎት አስጀመረ</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#6ED063]/10 text-[#3EA63B] px-1.5 py-0.5 rounded">News</span>
                  <span className="text-[10px] text-slate-500">2 hours ago</span>
                </div>
              </div>
            </div>
            <div className="group flex gap-3 rounded-xl bg-white p-3 border border-slate-200 shadow-sm hover:shadow-md transition-all">
              <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-slate-400" />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <h3 className="text-sm font-semibold text-slate-900 leading-snug">Ethio Telecom reports 22% profit surge in Q3</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] bg-[#6ED063]/10 text-[#3EA63B] px-1.5 py-0.5 rounded">Financials</span>
                  <span className="text-[10px] text-slate-500">Yesterday</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 px-4 pb-6">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">About Ethio Telecom</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Ethio Telecom is the Ethiopian telecommunications service provider. It provides telecom services including internet, voice, and mobile money services via Telebirr.
          </p>
        </div>
      </div>

      <div className="fixed md:absolute bottom-[80px] md:bottom-4 left-0 right-0 max-w-md md:max-w-none mx-auto px-4 pb-2 z-40">
        <div className="flex gap-3">
          <button className="flex-1 rounded-xl border border-slate-200 bg-white py-3.5 text-center text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50 transition-all active:scale-[0.98]">
            Set Price Alert
          </button>
          <button className="flex-1 rounded-xl bg-[#0F172A] py-3.5 text-center text-sm font-bold text-white shadow-lg hover:bg-slate-800 transition-all active:scale-[0.98]">
            Add to Watchlist
          </button>
        </div>
      </div>
    </div>
  );
}
