'use client';

import { useState } from 'react';
import { ArrowLeft, Settings, AlertTriangle, Wallet, TrendingUp, Trophy } from 'lucide-react';
import Link from 'next/link';

type NotifType = 'All' | 'Actionable' | 'Info';

const notifications = [
  {
    id: 1, type: 'Actionable', date: 'Today', color: 'bg-orange-500',
    icon: AlertTriangle, iconBg: 'bg-orange-50 text-orange-600',
    title: 'High spending detected', titleAmh: 'ከፍተኛ ወጪ ተገኝቷል',
    subtitle: "Kaldi's Coffee - 450 ETB", time: '2m ago',
    actions: [{ label: 'Dismiss', style: '' }, { label: 'Review', style: 'text-[#3EA63B]' }],
  },
  {
    id: 2, type: 'Actionable', date: 'Today', color: 'bg-[#3EA63B]',
    icon: Wallet, iconBg: 'bg-[#6ED063]/10 text-[#3EA63B]',
    title: 'Equb payment due', titleAmh: 'የእቁብ ክፍያ በ2 ቀናት ውስጥ',
    subtitle: 'Due in 2 days • 5,000 ETB', time: '1h ago',
    actions: [],
    cta: 'Mark as Paid',
  },
  {
    id: 3, type: 'Info', date: 'Today', color: 'bg-blue-500',
    icon: TrendingUp, iconBg: 'bg-blue-50 text-blue-600',
    title: 'ESX Stock Alert', titleAmh: 'የኢትዮ ቴሌኮም አክሲዮን በ5% ጨምሯል',
    subtitle: 'ETHIO +5.2% — Ethio Telecom', time: '3h ago',
    actions: [],
  },
  {
    id: 4, type: 'Info', date: 'Yesterday', color: '',
    icon: Trophy, iconBg: 'bg-purple-50 text-purple-600',
    title: 'Savings Goal Reached!', titleAmh: 'የቁጠባ ግብዎን አሳክተዋል',
    subtitle: 'Car Fund - 100% Complete', time: '1d ago',
    actions: [],
    faded: true,
  },
];

export default function Notifications() {
  const [tab, setTab] = useState<NotifType>('All');

  const filtered = notifications.filter((n) => tab === 'All' || n.type === tab);
  const grouped = filtered.reduce((acc, n) => {
    if (!acc[n.date]) acc[n.date] = [];
    acc[n.date].push(n);
    return acc;
  }, {} as Record<string, typeof notifications>);

  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent md:py-8">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between md:bg-transparent md:border-none">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900">Notifications</h1>
        <button className="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors">
          <Settings className="w-6 h-6 text-slate-900" />
        </button>
      </header>

      <div className="px-6 py-2">
        <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
          {(['All', 'Actionable', 'Info'] as NotifType[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm text-center transition-all ${tab === t ? 'bg-[#6ED063]/10 text-[#3EA63B] font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-24 md:pb-0">
        {Object.entries(grouped).map(([date, items]) => (
          <div key={date}>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{date}</h3>
              <div className="h-[1px] flex-1 bg-slate-200"></div>
            </div>
            <div className="space-y-4">
              {items.map((n) => (
                <div key={n.id} className={`group relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md ${n.faded ? 'opacity-75' : ''}`}>
                  {n.color && <div className={`absolute left-0 top-0 bottom-0 w-1 ${n.color}`}></div>}
                  <div className="flex gap-4 p-4">
                    <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${n.iconBg}`}>
                      <n.icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-base text-slate-900 truncate">{n.title}</h4>
                        <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{n.time}</span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mt-0.5 font-ethiopic">{n.titleAmh}</p>
                      <p className="text-xs text-slate-500 mt-1">{n.subtitle}</p>
                    </div>
                  </div>
                  {n.cta && (
                    <div className="px-4 pb-4">
                      <button className="w-full rounded-lg bg-[#3EA63B] py-2.5 text-sm font-bold text-white shadow-sm hover:bg-[#2e7d2c] transition-colors">{n.cta}</button>
                    </div>
                  )}
                  {n.actions.length > 0 && (
                    <div className="flex border-t border-slate-100">
                      {n.actions.map((a, i) => (
                        <button key={i} className={`flex-1 py-3 text-sm font-medium hover:bg-slate-50 transition-colors ${a.style || 'text-slate-700'} ${i > 0 ? 'border-l border-slate-100 font-bold' : ''}`}>{a.label}</button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <p className="font-medium">No {tab.toLowerCase()} notifications</p>
          </div>
        )}
      </div>
    </div>
  );
}
