'use client';

import { ArrowLeft, Settings, User as UserIcon, ShieldCheck, CreditCard, ChevronRight, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { PageHeader } from './PageHeader';

export function SimpleProfile({ user, accounts }: { user: any, accounts: any[] }) {
  const displayAccounts = accounts.map((a: any) => ({
    name: a.name, value: a.balance, color: a.color || '#68246D', type: a.type, number: a.number || 'N/A'
  }));

  const initial = user.name?.[0] || 'U';

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24 md:pb-0 w-full">
      <PageHeader 
        title="Me"
        description="Manage your identity and connected accounts"
        actions={
          <Link href="/settings" className="flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-slate-200 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        }
      />

      {/* Mobile Header */}
      <header className="md:hidden mint-gradient-hero px-6 pt-12 pb-24 flex items-center justify-between text-white relative">
        <h1 className="text-xl font-bold">Me</h1>
        <Link href="/settings" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Settings className="w-5 h-5" />
        </Link>
      </header>

      <main className="px-6 md:px-8 -mt-16 md:mt-8 relative z-10 space-y-4 md:space-y-0 md:grid md:grid-cols-12 md:gap-8 flex-1 max-w-7xl mx-auto w-full">
        <div className="md:col-span-4 space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-mint-primary)] text-white flex items-center justify-center text-4xl font-black border-4 border-white shadow-lg md:mt-0 mb-4 transition-transform hover:scale-105">
              {initial}
            </div>
            <h2 className="text-xl font-black text-slate-800">{user.name || 'User'}</h2>
            <p className="text-xs font-semibold text-slate-400 mb-6">{user.email}</p>
            
            <Link href="/onboarding" className="inline-flex items-center justify-center bg-[var(--color-mint-primary)] text-white px-6 py-3 rounded-2xl text-xs font-black w-full hover:opacity-90 transition-all shadow-md">
              {user.isProfileComplete ? 'Edit Profile' : 'Complete Profile Setup'}
            </Link>
          </div>

          {/* Verification Status */}
          {user.isProfileComplete && (
            <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-black text-slate-800">Verified Identity</p>
                <p className="text-[11px] font-medium text-slate-500">Your profile meets standard requirements for tier 2 banking.</p>
              </div>
            </div>
          )}
        </div>

        <div className="md:col-span-8 space-y-6">
          {/* Connected Accounts */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Connected Accounts</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live balances from {displayAccounts.length} sources</p>
              </div>
              <button className="flex items-center gap-2 bg-[var(--color-mint-primary)]/10 text-[var(--color-mint-primary)] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[var(--color-mint-primary)]/20 transition-colors">
                <PlusCircle className="w-4 h-4" /> Add New
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {displayAccounts.map((a: any, i: number) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: a.color }}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{a.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{a.type} • {a.number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{a.value.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400">ETB</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Security Overview Peek */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="relative z-10 max-w-md">
              <h3 className="text-lg font-black mb-2">Security & Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Your data is encrypted using bank-grade protocols. We never share your personal information with 3rd parties without your explicit consent.</p>
              <Link href="/settings" className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-mint-primary)] hover:underline">
                Review security settings <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
