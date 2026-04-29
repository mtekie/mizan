'use client';

import { Settings, User as UserIcon, ShieldCheck, CreditCard, ChevronRight, PlusCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppPageShell } from '@/components/AppPageShell';
import { buildProfileVM, buildAccountsVM, type ProfileScreenDataContract } from '@mizan/shared';
import { appendParityQuery } from '@/lib/parity-query';

export default function ProfileClient({ user, accounts, profileScreen }: { user: any, accounts: any[], profileScreen?: ProfileScreenDataContract }) {
  const profileVM = profileScreen?.profile ?? buildProfileVM(user, accounts);
  const accountsVM = profileScreen?.accounts ?? buildAccountsVM(accounts);
  const searchParams = useSearchParams();
  const parityHref = (href: string) => appendParityQuery(href, searchParams);

  return (
    <AppPageShell
      title="Me"
      subtitle="Manage your identity and connected accounts"
      variant="hero"
      actions={
        <>
          {/* SECTION: settings_links */}
          <Link href={parityHref('/settings')} className="flex items-center gap-2 bg-white/20 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-white/30 transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </Link>
        </>
      }
    >
      <div className="md:grid md:grid-cols-12 md:gap-8 space-y-6 md:space-y-0">
        <div className="md:col-span-4 space-y-6">
          {/* Profile Card */}
          {/* SECTION: profile_identity */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 text-center flex flex-col items-center">
            <div className="w-24 h-24 rounded-full bg-[var(--color-mint-primary)] text-white flex items-center justify-center text-4xl font-black border-4 border-white shadow-lg mb-4 transition-transform hover:scale-105">
              {profileVM.initial}
            </div>
            <h2 className="text-xl font-black text-slate-800">{profileVM.name}</h2>
            <p className="text-xs font-semibold text-slate-400 mb-6">{user.email}</p>
            
            <Link href={parityHref('/score?action=complete-profile')} className="inline-flex items-center justify-center bg-[var(--color-mint-primary)] text-white px-6 py-3 rounded-2xl text-xs font-black w-full hover:opacity-90 transition-all shadow-md">
              {profileVM.isComplete ? 'Edit Profile' : 'Complete Profile Setup'}
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

          <Link href={parityHref('/score')} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md group">
            <div className="relative w-14 h-14 rounded-2xl bg-[#3EA63B]/10 text-[#3EA63B] flex items-center justify-center shrink-0">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-black text-slate-800">Mizan Score</p>
              <p className="text-[11px] font-medium text-slate-500">{profileVM.score} • {profileVM.scoreLabel}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-mint-primary)] transition-colors" />
          </Link>
        </div>

        <div className="md:col-span-8 space-y-6">
          {/* Connected Accounts */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-lg font-black text-slate-900">Connected Accounts</h3>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">Live balances from {accountsVM.length} sources</p>
              </div>
              <button className="flex items-center gap-2 bg-[var(--color-mint-primary)]/10 text-[var(--color-mint-primary)] px-4 py-2 rounded-xl text-xs font-bold hover:bg-[var(--color-mint-primary)]/20 transition-colors">
                <PlusCircle className="w-4 h-4" /> Add New
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {accountsVM.map((a) => (
                <div key={a.id} className="flex items-center justify-between p-4 rounded-2xl border border-slate-50 hover:bg-slate-50 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-110" style={{ backgroundColor: a.color }}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-800">{a.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{a.typeLabel} • {a.number}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{a.balanceFormatted}</p>
                  </div>
                </div>
              ))}
              {accountsVM.length === 0 && (
                <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-6 text-center">
                  <p className="text-sm font-bold text-slate-700">{profileScreen?.states.accountsEmpty.title ?? 'No accounts connected'}</p>
                  <p className="mt-1 text-xs text-slate-400">{profileScreen?.states.accountsEmpty.description ?? 'Add your first account from Money.'}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Security Overview Peek */}
          {/* SECTION: security_privacy */}
          <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="relative z-10 max-w-md">
              <h3 className="text-lg font-black mb-2">Security & Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-6">Your data is encrypted using bank-grade protocols. We never share your personal information with 3rd parties without your explicit consent.</p>
              <Link href={parityHref('/settings')} className="inline-flex items-center gap-2 text-xs font-bold text-[var(--color-mint-primary)] hover:underline">
                Review security settings <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AppPageShell>
  );
}
