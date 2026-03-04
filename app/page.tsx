'use client';

import { Bell, TrendingUp, PiggyBank, Send, ArrowRight, DollarSign, Globe, BarChart3, Wallet, ArrowUpRight, ArrowDownRight, Clock, Activity, ShieldCheck, Target, ShoppingBasket, Play, Sparkles, Book, CreditCard, Smartphone } from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AIAutopilot } from '@/components/AIAutopilot';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { currencyRates, esxMarket } from '@/lib/data/market';
import { allProducts } from '@/lib/data/products';
import { TipsCarousel } from '@/components/TipsFeed';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good Morning';
  if (h < 17) return 'Good Afternoon';
  return 'Good Evening';
}

const cashFlowData = [
  { day: '30D Ago', amount: 25000 },
  { day: '20D Ago', amount: 32000 },
  { day: '10D Ago', amount: 28000 },
  { day: 'Today', amount: 42500 },
  { day: '+10D', amount: 45000, isProjection: true },
  { day: '+20D', amount: 48000, isProjection: true },
  { day: '+30D', amount: 52000, isProjection: true },
];

const assetData = [
  { name: 'CBE', value: 25400, color: '#68246D', type: 'Bank Book', number: '1000 **** **** 8472' },
  { name: 'Telebirr', value: 12500, color: '#00ADEF', type: 'Mobile Wallet', number: '+251 *** *** 119' },
  { name: 'Awash', value: 4600, color: '#F15A22', type: 'Debit Card', number: '4452 **** **** 5133' },
  { name: 'Tsehay Bank', value: 18500, color: '#eab308', type: 'Credit Card', number: '5543 **** **** 9012', limit: 50000 },
];

export default function Home() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/transactions')
      .then(res => res.json())
      .then(data => {
        setTransactions(data.slice(0, 5));
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 md:bg-slate-100/50">
      {/* Desktop Market Marquee */}
      <div className="hidden md:flex w-full bg-[#0F172A] text-white py-1.5 px-6 items-center justify-between overflow-hidden border-b border-slate-800">
        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest whitespace-nowrap animate-marquee">
          <span className="flex items-center gap-1.5 text-slate-400"><Activity className="w-3 h-3 text-[#3EA63B]" /> Live Market Feed</span>
          {esxMarket.map(s => (
            <span key={s.symbol} className="flex items-center gap-1.5">
              <span className="text-slate-300">{s.symbol}</span>
              <span>{s.price.toFixed(2)}</span>
              <span className={s.change >= 0 ? 'text-[#3EA63B]' : 'text-red-500'}>{s.change >= 0 ? '+' : ''}{s.change}%</span>
            </span>
          ))}
          <span className="text-slate-600">|</span>
          {currencyRates.slice(0, 3).map(c => (
            <span key={c.pair} className="flex items-center gap-1.5">
              <span className="text-slate-300">{c.pair}</span>
              <span>{c.rate}</span>
              <span className={c.trend === 'up' ? 'text-[#3EA63B]' : 'text-red-500'}>{c.change}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Mobile Header */}
      <header className="md:hidden pt-12 pb-4 px-6 flex justify-between items-center bg-white sticky top-0 z-20 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full mizan-gradient-bg flex items-center justify-center text-white font-bold shadow-sm">
            D
          </div>
          <div>
            <h1 className="text-xs text-slate-500 font-medium">{getGreeting()},</h1>
            <h2 className="text-lg font-bold text-[#0F172A]">Dawit <span className="font-normal text-sm font-ethiopic text-slate-400">ዳዊት</span></h2>
          </div>
        </div>
        <Link href="/notifications" className="relative p-2 rounded-full hover:bg-slate-50 text-slate-600">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#D84315] rounded-full ring-2 ring-white"></span>
        </Link>
      </header>

      <div className="flex-1 p-4 md:p-6 max-w-[1600px] mx-auto w-full flex flex-col gap-4 pb-24 md:pb-6">

        {/* Desktop Header & Quick Stats */}
        <div className="hidden md:flex flex-col gap-4">
          <div className="flex justify-between items-end">
            <div className="flex items-baseline gap-3">
              <h1 className="text-2xl font-black text-[#0F172A] tracking-tight">Dawit <span className="text-slate-400 font-normal">ዳዊት</span></h1>
              <span className="text-xs text-slate-500 font-medium">{getGreeting()}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 flex items-center gap-2 shadow-sm">
                <ShieldCheck className="w-3.5 h-3.5 text-[#3EA63B]" />
                <span className="text-[10px] font-bold text-slate-600 flex items-center gap-1 uppercase tracking-wider">Status: <span className="text-[#3EA63B]">Secure & Synced</span></span>
              </div>
              <Link href="/notifications" className="relative p-2 rounded-lg bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-colors text-slate-600">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#D84315] rounded-full ring-2 ring-white"></span>
              </Link>
            </div>
          </div>

          {/* Dense Portfolio Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm-label">Net Worth</span>
              <div className="flex items-end gap-2">
                <span className="text-xl font-black text-[#0F172A] leading-none">42,500</span>
                <span className="text-[10px] font-bold text-slate-400 mb-0.5">ETB</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm-label">Monthly In</span>
              <div className="flex items-end gap-2">
                <span className="text-lg font-bold text-[#3EA63B] leading-none">+12,400</span>
                <span className="text-[10px] font-bold text-slate-400 mb-0.5">ETB</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm-label">Monthly Out</span>
              <div className="flex items-end gap-2">
                <span className="text-lg font-bold text-amber-600 leading-none">-4,250</span>
                <span className="text-[10px] font-bold text-slate-400 mb-0.5">ETB</span>
              </div>
            </div>
            <div className="bg-white rounded-xl p-3 border border-slate-200 shadow-sm flex flex-col justify-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 shadow-sm-label">Savings Rate</span>
              <div className="flex items-center gap-3">
                <span className="text-lg font-black text-[#0F172A] leading-none">65%</span>
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden"><div className="w-[65%] h-full bg-[#3EA63B]"></div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Dense 3-Column Desktop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

          {/* Left Column (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Compact Mizan Score */}
            <Link href="/score" className="bg-[#0F172A] rounded-xl p-4 shadow-sm group hover:ring-2 ring-[#3EA63B] transition-all relative overflow-hidden">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/5 rounded-full group-hover:scale-110 transition-transform"></div>
              <div className="flex justify-between items-start mb-3 relative z-10">
                <h3 className="text-white font-black text-xs uppercase tracking-widest">Mizan Score</h3>
                <span className="bg-[#3EA63B] text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Verified</span>
              </div>
              <div className="flex items-end gap-3 relative z-10">
                <span className="text-4xl font-black text-white leading-none">720</span>
                <div className="pb-1">
                  <span className="text-[10px] text-[#6ED063] font-bold flex items-center gap-0.5"><Activity className="w-3 h-3" /> Top 15%</span>
                </div>
              </div>
            </Link>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <Link href="/transfer" className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center gap-1.5 hover:bg-slate-50 transition-colors">
                <Send className="w-4 h-4 text-blue-600" />
                <span className="text-[10px] font-bold text-slate-700">Send</span>
              </Link>
              <Link href="/catalogue" className="bg-white p-3 rounded-xl border border-slate-200 flex flex-col items-center gap-1.5 hover:bg-slate-50 transition-colors">
                <PiggyBank className="w-4 h-4 text-orange-600" />
                <span className="text-[10px] font-bold text-slate-700">Save</span>
              </Link>
            </div>

            {/* Themed Stacking Account Cards */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-1 flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-center mb-4 relative z-10">
                <h3 className="text-[#0F172A] font-bold text-[10px] uppercase tracking-widest">My Cards</h3>
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="flex-1 relative mt-2 group perspective-1000">
                {assetData.map((asset, i) => (
                  <div
                    key={asset.name}
                    className="absolute inset-x-0 rounded-2xl p-4 text-white shadow-xl transition-all duration-300 border border-white/20 hover:-translate-y-4 hover:z-20 cursor-pointer"
                    style={{
                      backgroundColor: asset.color,
                      top: `${i * 35}px`,
                      zIndex: i * 10,
                      transform: `scale(${1 - (assetData.length - 1 - i) * 0.05}) translateZ(0)`,
                      opacity: 1 - (assetData.length - 1 - i) * 0.05
                    }}
                  >
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex flex-col">
                        <span className="font-black tracking-widest text-white/50">{asset.name}</span>
                        <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest">{asset.type}</span>
                      </div>
                      {asset.type === 'Bank Book' && <Book className="w-5 h-5 text-white/30" />}
                      {(asset.type === 'Debit Card' || asset.type === 'Credit Card') && <CreditCard className="w-5 h-5 text-white/30" />}
                      {asset.type === 'Mobile Wallet' && <Smartphone className="w-5 h-5 text-white/30" />}
                      {!asset.type && <Wallet className="w-5 h-5 text-white/30" />}
                    </div>
                    <div>
                      {asset.type === 'Credit Card' ? (
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="text-xl font-black drop-shadow-md">
                            {asset.value.toLocaleString()} <span className="text-[10px] font-bold ml-1 text-white/70">ETB</span>
                          </span>
                          <span className="text-[10px] text-white/50 font-bold uppercase tracking-wider">/ {asset.limit?.toLocaleString()} Limit</span>
                        </div>
                      ) : (
                        <div className="mb-1">
                          <span className="text-xl font-black drop-shadow-md">
                            {asset.value.toLocaleString()} <span className="text-[10px] font-bold ml-1 text-white/70">ETB</span>
                          </span>
                        </div>
                      )}
                      <p className="text-[10px] font-bold uppercase tracking-widest text-white/60 font-mono">{asset.number || `**** **** **** ${Math.floor(1000 + Math.random() * 9000)}`}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Column (Span 6) */}
          <div className="lg:col-span-6 flex flex-col gap-4">
            {/* Cash Flow Chart */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-64 flex flex-col">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Cash Flow Projection</h3>
                <span className="text-[10px] font-bold text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-0.5 rounded">+15.2% M/M</span>
              </div>
              <div className="flex-1 w-full -ml-4 mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={cashFlowData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#3EA63B" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#3EA63B" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="day" hide />
                    <YAxis hide domain={['dataMin - 2000', 'dataMax + 5000']} />
                    <Tooltip
                      contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', fontSize: '10px', fontWeight: 'bold' }}
                      formatter={(val: any) => [`${Number(val).toLocaleString()} ETB`, 'Predicted']}
                    />
                    <Area
                      type="monotone"
                      dataKey="amount"
                      stroke="#3EA63B"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorAmount)"
                      activeDot={{ r: 4, fill: '#3EA63B', stroke: '#fff', strokeWidth: 2 }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <AIAutopilot />

            {/* Cross-functional Widget Row: Goals & Burn Rate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              {/* Burn Rate Widget */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#0F172A] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <ShoppingBasket className="w-3 h-3 text-amber-500" /> Burn Rate
                  </h3>
                  <Link href="/dreams" className="text-[10px] font-bold text-[#3EA63B] hover:underline">Budget</Link>
                </div>
                <div className="flex items-end justify-between mb-2">
                  <div>
                    <span className="text-xl font-black text-slate-900 leading-none">4,250</span>
                    <span className="text-[10px] text-slate-400 font-bold ml-1">ETB spent</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 font-bold block">of 8,000 ETB</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '53%' }}></div>
                </div>
                <p className="text-[10px] font-bold text-slate-500 mt-3 flex items-center gap-1">
                  <Activity className="w-3 h-3 text-amber-500" /> 53% of monthly budget used.
                </p>
              </div>

              {/* Top Goal Widget */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 relative overflow-hidden group">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#0F172A] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                    <Target className="w-3 h-3 text-blue-500" /> Top Goal
                  </h3>
                  <Link href="/dreams" className="text-[10px] font-bold text-[#3EA63B] hover:underline">Dreams</Link>
                </div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="text-2xl">🛡️</div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">Emergency Fund</h4>
                    <p className="text-[10px] text-slate-400 font-bold">Target: Jun 2026</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                  <span className="text-[10px] font-black text-slate-900">65%</span>
                </div>
              </div>

            </div>
          </div>

          {/* Right Column (Span 3) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            {/* Dense Ledger */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex-1">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[#0F172A] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-slate-400" /> Recent Activity
                </h3>
                <Link href="/ledger" className="text-[10px] font-bold text-[#3EA63B] hover:underline">All</Link>
              </div>
              <div className="space-y-3">
                {loading ? (
                  [1, 2, 3, 4].map(i => <div key={i} className="h-6 w-full bg-slate-100 animate-pulse rounded"></div>)
                ) : transactions.map((tx) => (
                  <div key={tx.id} className="flex justify-between items-center group cursor-default">
                    <div className="min-w-0 pr-2">
                      <p className="text-[10px] font-bold text-slate-900 truncate leading-tight">{tx.title}</p>
                      <p className="text-[8px] text-slate-400 font-bold uppercase tracking-wider">{tx.source || 'SYS'}</p>
                    </div>
                    <p className={`text-[10px] font-black ${tx.amount < 0 ? 'text-slate-600' : 'text-[#3EA63B]'} shrink-0`}>
                      {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Dense Currency Hub */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-[#0F172A] font-bold text-[10px] uppercase tracking-widest flex items-center gap-1.5">
                  <Globe className="w-3 h-3 text-slate-400" /> FX Rates
                </h3>
              </div>
              <div className="space-y-2">
                {currencyRates.slice(0, 4).map((rate) => (
                  <div key={rate.pair} className="flex justify-between items-center">
                    <p className="text-[10px] font-bold text-slate-900">{rate.pair}</p>
                    <div className="text-right flex items-center gap-2">
                      <span className="text-[10px] font-medium text-slate-500">{rate.rate}</span>
                      <span className={`flex items-center text-[8px] font-black w-8 justify-end ${rate.trend === 'up' ? 'text-[#3EA63B]' : 'text-red-500'}`}>
                        {rate.change}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Recommendations */}
            <div className="bg-gradient-to-br from-indigo-900 to-slate-900 rounded-xl border border-indigo-800 shadow-sm p-4 text-white relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-[10px] text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" /> Selected For You
                </h3>
                {allProducts.slice(40, 42).map(p => (
                  <Link href={`/catalogue/${p.id}`} key={p.id} className="block bg-white/10 hover:bg-white/20 border border-white/10 rounded-lg p-2.5 mb-2 last:mb-0 transition-colors">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-xs font-bold text-white truncate pr-2">{p.title || p.name}</h4>
                    </div>
                    <p className="text-[10px] text-indigo-200 font-semibold truncate mb-1">{p.bankName}</p>
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black bg-[#3EA63B] text-white px-1.5 py-0.5 rounded">94% Match</span>
                      <Play className="w-3 h-3 text-white/50" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Financial Tips Carousel */}
            <div className="mt-6">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Financial Tips</h2>
                <Link href="/tips" className="text-[10px] font-bold text-[#3EA63B] hover:underline">See all</Link>
              </div>
              <TipsCarousel />
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
