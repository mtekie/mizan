'use client';

import { ArrowLeft, Settings, User as UserIcon, ShieldCheck, CreditCard, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export function SimpleProfile({ user, accounts }: { user: any, accounts: any[] }) {
  const displayAccounts = accounts.map((a: any) => ({
    name: a.name, value: a.balance, color: a.color || '#68246D', type: a.type, number: a.number || 'N/A'
  }));

  const initial = user.name?.[0] || 'U';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24">
      <header className="mint-gradient-hero px-6 pt-12 pb-24 flex items-center justify-between text-white relative">
        <h1 className="text-xl font-bold">Profile</h1>
        <Link href="/settings" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      <main className="px-6 -mt-16 relative z-10 space-y-4">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-[var(--color-mint-primary)] text-white flex items-center justify-center text-3xl font-black border-4 border-white shadow-md -mt-12 mb-3">
            {initial}
          </div>
          <h2 className="text-lg font-bold text-slate-800">{user.name || 'User'}</h2>
          <p className="text-xs text-slate-500 mb-4">{user.email}</p>
          
          <Link href="/onboarding" className="inline-flex items-center justify-center bg-[var(--color-mint-primary)]/10 text-[var(--color-mint-primary)] px-4 py-2 rounded-full text-xs font-bold w-full hover:bg-[var(--color-mint-primary)]/20 transition-colors">
            {user.isProfileComplete ? 'Edit Profile' : 'Complete Profile Setup'}
          </Link>
        </div>

        {/* Verification Status */}
        {user.isProfileComplete && (
          <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">Verified Identity</p>
              <p className="text-[10px] text-slate-500">Your profile meets standard requirements.</p>
            </div>
          </div>
        )}

        {/* Connected Accounts */}
        <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100">
          <h3 className="text-sm font-bold text-slate-800 mb-4">Connected Accounts</h3>
          <div className="space-y-3">
            {displayAccounts.map((a: any, i: number) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-white" style={{ backgroundColor: a.color }}>
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{a.name}</p>
                    <p className="text-[10px] text-slate-500">{a.number}</p>
                  </div>
                </div>
                <p className="text-sm font-bold text-slate-800">{a.value.toLocaleString()} <span className="text-[10px] text-slate-400">ETB</span></p>
              </div>
            ))}
          </div>
          <button className="mt-4 w-full py-3 rounded-2xl bg-slate-50 text-slate-600 text-xs font-bold border border-slate-100 hover:bg-slate-100 transition-colors">
            + Add Account
          </button>
        </div>

      </main>
    </div>
  );
}
