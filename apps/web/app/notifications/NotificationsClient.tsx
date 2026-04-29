'use client';

import { useState } from 'react';
import { ArrowLeft, Settings, AlertTriangle, Bell, Wallet, TrendingUp, Trophy } from 'lucide-react';
import Link from 'next/link';
import type { NotificationFilterKey, NotificationVM, NotificationsScreenDataContract } from '@mizan/shared';

const iconMap = {
  'alert-triangle': AlertTriangle,
  AlertTriangle,
  bell: Bell,
  Bell,
  Wallet,
  wallet: Wallet,
  Trophy,
  trophy: Trophy,
  TrendingUp,
  'trending-up': TrendingUp,
};

function getToneClasses(item: NotificationVM) {
  if (item.isActionable) {
    return {
      color: 'bg-orange-500',
      iconBg: 'bg-orange-50 text-orange-600',
    };
  }

  return {
    color: 'bg-blue-500',
    iconBg: 'bg-blue-50 text-blue-600',
  };
}

export default function NotificationsClient({ notificationsScreen }: { notificationsScreen: NotificationsScreenDataContract }) {
  const [tab, setTab] = useState<NotificationFilterKey>('All');

  const filtered = notificationsScreen.notifications.filter(item => tab === 'All' || item.type === tab);
  const grouped = notificationsScreen.groups
    .map(group => ({
      ...group,
      items: group.items.filter(item => tab === 'All' || item.type === tab),
    }))
    .filter(group => group.items.length > 0);

  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent md:py-8">
      <header className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between md:bg-transparent md:border-none">
        <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
          <ArrowLeft className="w-6 h-6 text-slate-900" />
        </Link>
        <div className="text-center">
          <h1 className="text-lg font-bold text-slate-900">Notifications</h1>
          {notificationsScreen.unreadCount > 0 && (
            <p className="text-[11px] font-bold text-[#3EA63B]">{notificationsScreen.unreadCount} unread</p>
          )}
        </div>
        <Link href="/settings" className="p-2 -mr-2 rounded-full hover:bg-slate-100 transition-colors">
          <Settings className="w-6 h-6 text-slate-900" />
        </Link>
      </header>

      <div className="px-6 py-2">
        <div className="flex gap-1 p-1 bg-white rounded-xl border border-slate-200 shadow-sm">
          {notificationsScreen.filters.map(filter => (
            <button
              key={filter.key}
              onClick={() => setTab(filter.key)}
              className={`flex-1 py-2 px-3 rounded-lg font-medium text-sm text-center transition-all ${tab === filter.key ? 'bg-[#6ED063]/10 text-[#3EA63B] font-semibold' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              {filter.label} {filter.count > 0 ? `(${filter.count})` : ''}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6 pb-24 md:pb-0">
        {grouped.map(group => (
          <div key={group.date}>
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">{group.date}</h3>
              <div className="h-[1px] flex-1 bg-slate-200" />
            </div>
            <div className="space-y-4">
              {group.items.map(item => {
                const tone = getToneClasses(item);
                const Icon = iconMap[item.icon as keyof typeof iconMap] ?? Bell;

                return (
                  <div key={item.id} className={`group relative overflow-hidden rounded-xl bg-white shadow-sm border border-slate-100 transition-all hover:shadow-md ${item.isRead ? 'opacity-75' : ''}`}>
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${tone.color}`} />
                    <div className="flex gap-4 p-4">
                      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${tone.iconBg}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="font-semibold text-base text-slate-900 truncate">{item.title}</h4>
                          <span className="text-xs text-slate-500 whitespace-nowrap ml-2">{item.time}</span>
                        </div>
                        {item.titleAmh && <p className="text-sm text-slate-600 font-medium mt-0.5 font-ethiopic">{item.titleAmh}</p>}
                        <p className="text-xs text-slate-500 mt-1">{item.subtitle}</p>
                      </div>
                    </div>
                    {item.isActionable && (
                      <div className="flex border-t border-slate-100">
                        <button className="flex-1 py-3 text-sm font-medium hover:bg-slate-50 transition-colors text-slate-700">Dismiss</button>
                        <button className="flex-1 py-3 text-sm font-bold hover:bg-slate-50 transition-colors text-[#3EA63B] border-l border-slate-100">Review</button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-center">
            <p className="font-bold text-slate-600">{notificationsScreen.states.empty.title}</p>
            <p className="mt-1 text-sm">{notificationsScreen.states.empty.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
