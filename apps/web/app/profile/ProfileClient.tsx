'use client';

import { Settings, ShieldCheck, CreditCard, ChevronRight, PlusCircle, TrendingUp, HelpCircle, Info, Shield, LogOut } from 'lucide-react';
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
  const isGuest = user.id === 'guest' || user.email === 'guest@mizan.local';

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
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {/* Profile Card */}
        {/* SECTION: profile_identity */}
        <div className="text-center flex flex-col items-center py-4">
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-full bg-[var(--color-mint-primary)] text-white flex items-center justify-center text-4xl font-black border-4 border-white shadow-lg">
              {profileVM.initial}
            </div>
            <span className="absolute bottom-1 right-1 rounded-full bg-white p-1 text-[var(--color-mint-primary)] shadow-sm">
              <ShieldCheck className="h-4 w-4" />
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-800">{profileVM.name}</h2>
          <p className="text-xs font-semibold text-slate-400 mb-5">{user.email}</p>
          
          <Link href={parityHref('/score?action=complete-profile')} className="inline-flex min-w-40 items-center justify-center bg-[var(--color-mint-primary)] text-white px-6 py-3 rounded-2xl text-xs font-black hover:opacity-90 transition-all shadow-md">
            {profileVM.isComplete ? 'Edit Profile' : 'Complete Profile'}
          </Link>
        </div>

        {/* Profile Completeness / Guest State */}
        {isGuest ? (
          <div className="rounded-3xl border border-red-300 bg-red-50 p-5 shadow-sm">
            <p className="text-sm leading-relaxed text-slate-700">You are currently in Guest Mode. Data will not be saved permanently.</p>
            <Link href={parityHref('/login')} className="mt-4 inline-flex w-full items-center justify-center rounded-xl bg-[var(--color-mint-primary)] px-4 py-3 text-sm font-black text-white">
              Create Real Account
            </Link>
          </div>
        ) : user.isProfileComplete ? (
          <div className="bg-emerald-50 rounded-3xl p-5 shadow-sm border border-emerald-100 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-black text-slate-800">Verified Identity</p>
              <p className="text-[11px] font-medium text-slate-500">Your profile meets standard requirements for tier 2 banking.</p>
            </div>
          </div>
        ) : null}

        {/* Mizan Score */}
        <Link href={parityHref('/score')} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 flex items-center gap-4 transition-all hover:shadow-md group">
          <div className="relative w-14 h-14 rounded-2xl bg-[#3EA63B]/10 text-[#3EA63B] flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-slate-800">Mizan Score</p>
            <p className="text-[11px] font-medium text-slate-500">{profileVM.scoreLabel} • Last updated today</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-black text-[var(--color-mint-primary)] leading-none">{profileVM.score}</p>
            <p className="text-[10px] font-black uppercase text-[var(--color-mint-primary)]">{profileVM.scoreLabel}</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-mint-primary)] transition-colors" />
        </Link>

        {/* Connected Accounts */}
        <section>
          <h3 className="mb-3 pl-1 text-xs font-black uppercase tracking-widest text-slate-400">Connected Accounts</h3>
          <div className="bg-white rounded-3xl p-1 shadow-sm border border-slate-100">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">Live balances from {accountsVM.length} sources</p>
              <button className="flex items-center gap-1.5 rounded-xl bg-[var(--color-mint-primary)]/10 px-3 py-2 text-xs font-bold text-[var(--color-mint-primary)]">
                <PlusCircle className="w-4 h-4" /> Add New
              </button>
            </div>
            
            <div>
              {accountsVM.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-3 border-t border-slate-100 p-4">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm shrink-0" style={{ backgroundColor: a.color }}>
                      <CreditCard className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-800">{a.name}</p>
                      <p className="text-[10px] font-bold text-slate-400">{a.typeLabel} • {a.number}</p>
                    </div>
                  </div>
                  <p className="text-right text-sm font-black text-slate-900">{a.balanceFormatted}</p>
                </div>
              ))}
              {accountsVM.length === 0 && (
                <div className="border-t border-slate-100 p-6 text-center">
                  <p className="text-sm font-bold text-slate-700">{profileScreen?.states.accountsEmpty.title ?? 'No accounts connected'}</p>
                  <p className="mt-1 text-xs text-slate-400">{profileScreen?.states.accountsEmpty.description ?? 'Add your first account from Money.'}</p>
                </div>
              )}
            </div>
          </div>
        </section>
          
        {/* Security Overview Peek */}
        {/* SECTION: security_privacy */}
        <section>
          <h3 className="mb-3 pl-1 text-xs font-black uppercase tracking-widest text-slate-400">Security & Privacy</h3>
          <div className="bg-slate-900 rounded-3xl p-6 text-white relative overflow-hidden">
            <div className="relative z-10 flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10">
                <Shield className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-black mb-2">Your data is encrypted</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Bank-grade protocols. We never share your personal information without explicit consent.</p>
                <Link href={parityHref('/settings')} className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[var(--color-mint-primary)] hover:underline">
                  Review security settings <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION: settings_links */}
        <section>
          <h3 className="mb-3 pl-1 text-xs font-black uppercase tracking-widest text-slate-400">Settings & Support</h3>
          <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white p-1 shadow-sm">
            {[
              { label: 'Settings', icon: Settings, href: '/settings', tone: 'text-slate-900' },
              { label: 'Send Feedback', icon: HelpCircle, href: '#', tone: 'text-slate-900' },
              { label: 'Privacy Policy', icon: Info, href: '#', tone: 'text-slate-900' },
              { label: 'Terms of Service', icon: Shield, href: '#', tone: 'text-slate-900' },
              { label: 'Log Out', icon: LogOut, href: '/login', tone: 'text-red-500' },
            ].map((item, index) => (
              <Link key={item.label} href={item.href === '#' ? '#' : parityHref(item.href)} className={`flex items-center gap-3 px-4 py-4 ${index > 0 ? 'border-t border-slate-100' : ''}`}>
                <item.icon className={`h-5 w-5 ${item.tone === 'text-red-500' ? 'text-red-500' : 'text-slate-600'}`} />
                <span className={`flex-1 text-sm font-semibold ${item.tone}`}>{item.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </section>

        <div className="py-8 text-center">
          <p className="text-xs font-bold text-slate-400">Mizan v0.4.2 Beta</p>
          <p className="mt-2 text-[11px] text-slate-400">This app is for educational purposes only.</p>
        </div>
      </div>
    </AppPageShell>
  );
}
