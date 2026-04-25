'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Send, Building2, Smartphone, Users, ArrowDownUp, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { EmptyState } from '@/components/EmptyState';
import { SimplePageShell } from '@/components/SimplePageShell';
import { useFocusTrap } from '@/hooks/useFocusTrap';

type Transfer = {
  id: number;
  description: string;
  fromAccount: string;
  toAccount: string;
  amount: number;
  date: string;
  type: 'sent' | 'received';
};

export default function TransferClient({ initialTransfers, initialAccounts }: { initialTransfers: any[], initialAccounts: any[] }) {
  const [showForm, setShowForm] = useState(false);
  const modalRef = useFocusTrap(showForm, () => setShowForm(false));
  const [form, setForm] = useState({ description: '', from: '', to: '', amount: '', date: '' });

  const recentTransfers: Transfer[] = initialTransfers.map((t: any) => ({
    id: t.id,
    description: t.title,
    fromAccount: t.amount < 0 ? t.source : 'External',
    toAccount: t.amount > 0 ? t.source : 'External',
    amount: Math.abs(t.amount),
    date: new Date(t.date).toDateString() === new Date().toDateString() ? 'Today' : 'Earlier',
    type: t.amount < 0 ? 'sent' : 'received'
  }));

  const accounts = initialAccounts.map((a: any) => ({
    id: a.id,
    label: a.name,
    icon: Building2
  }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app this would persist to the DB
    setShowForm(false);
    setForm({ description: '', from: '', to: '', amount: '', date: '' });
  };

  const content = (
    <>
      <div className="flex-1 overflow-y-auto hide-scrollbar pb-24 md:pb-0 px-6 space-y-6 pt-4">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Sent this month</p>
            <p className="text-xl font-bold text-[#D84315]">- {recentTransfers.filter(t => t.type === 'sent').reduce((s, t) => s + t.amount, 0).toLocaleString()} ETB</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
            <p className="text-xs text-slate-500 mb-1">Received</p>
            <p className="text-xl font-bold text-[#3EA63B]">+ {recentTransfers.filter(t => t.type === 'received').reduce((s, t) => s + t.amount, 0).toLocaleString()} ETB</p>
          </div>
        </div>

        {/* Recent Transfers */}
        <section>
          <h2 className="text-lg font-bold text-slate-900 mb-3">Recent Transfers</h2>
          {recentTransfers.length === 0 ? (
            <EmptyState
              icon={Send}
              title="No transfers yet"
              description="Log your first transfer to start tracking money movement between your accounts."
              action={{ label: 'Log a Transfer', href: '#' }}
            />
          ) : (
          <div className="space-y-3">
            {Object.entries(
              recentTransfers.reduce((acc, t) => {
                if (!acc[t.date]) acc[t.date] = [];
                acc[t.date].push(t);
                return acc;
              }, {} as Record<string, Transfer[]>)
            ).map(([date, txs]) => (
              <div key={date}>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">{date}</p>
                <div className="space-y-2">
                  {txs.map((tx) => (
                    <div key={tx.id} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${tx.type === 'received' ? 'bg-green-50 text-[#3EA63B]' : 'bg-slate-100 text-slate-500'}`}>
                        {tx.type === 'received' ? <ArrowDownUp className="w-5 h-5 rotate-180" /> : <Send className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">{tx.description}</p>
                        <p className="text-xs text-slate-500 truncate">{tx.fromAccount} → {tx.toAccount}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${tx.type === 'received' ? 'text-[#3EA63B]' : 'text-slate-900'}`}>
                          {tx.type === 'received' ? '+' : '-'} {tx.amount.toLocaleString()} ETB
                        </p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          )}
        </section>
      </div>
    </>
  );

  return (
    <>
      <SimplePageShell
        title="Transfer Log"
        headerAction={
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 text-white transition-colors hover:bg-white/30"
          >
            <Plus className="w-5 h-5" />
          </button>
        }
      >
        {content}
      </SimplePageShell>

      {/* Log Transfer Modal */}
      {showForm && (
        <div ref={modalRef} className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full md:max-w-md rounded-t-3xl md:rounded-3xl p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900">Log a Transfer</h3>
              <button onClick={() => setShowForm(false)} className="text-slate-400 hover:text-slate-700 text-2xl leading-none">&times;</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Description</label>
                <input
                  type="text"
                  placeholder="e.g. Rent payment"
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6ED063]"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">From</label>
                  <select
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6ED063]"
                    value={form.from}
                    onChange={(e) => setForm({ ...form, from: e.target.value })}
                    required
                  >
                    <option value="">Account</option>
                    {accounts.map((a) => <option key={a.id} value={a.label}>{a.label}</option>)}
                    <option value="other">Other...</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">To</label>
                  <input
                    type="text"
                    placeholder="Recipient"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6ED063]"
                    value={form.to}
                    onChange={(e) => setForm({ ...form, to: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Amount (ETB)</label>
                  <input
                    type="number"
                    placeholder="0"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6ED063]"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Date</label>
                  <input
                    type="date"
                    className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#6ED063]"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl mizan-gradient-bg text-white font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Save Transfer
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
