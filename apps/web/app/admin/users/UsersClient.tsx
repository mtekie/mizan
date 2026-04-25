'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, Save, Search, Shield, UserCog } from 'lucide-react';

type UserRow = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  image: string | null;
  role: 'USER' | 'ADMIN' | 'MODERATOR';
  mizanScore: number;
  onboardingPhase: string;
  isProfileComplete: boolean;
  employmentStatus: string | null;
  employmentSector: string | null;
  residencyStatus: string;
  monthlyIncomeRange: string | null;
  createdAt: Date | string;
  _count: {
    mizanAccounts: number;
    productApplications: number;
    productReviews: number;
    accountLinks: number;
  };
};

const roles = ['USER', 'ADMIN', 'MODERATOR'] as const;
const residencyStatuses = ['RESIDENT', 'DIASPORA', 'EXPAT'] as const;

export function UsersClient({ users }: { users: UserRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');
  const [drafts, setDrafts] = useState<Record<string, UserRow>>({});
  const [message, setMessage] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((user) =>
      [user.name || '', user.username || '', user.email || '', user.role, user.residencyStatus, user.employmentSector || '']
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [users, query]);

  function draftFor(user: UserRow) {
    return drafts[user.id] || user;
  }

  function updateDraft<K extends keyof UserRow>(user: UserRow, key: K, value: UserRow[K]) {
    setDrafts((current) => ({
      ...current,
      [user.id]: { ...draftFor(user), [key]: value },
    }));
  }

  async function save(user: UserRow) {
    setMessage(null);
    const draft = draftFor(user);
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: draft.id,
        role: draft.role,
        mizanScore: draft.mizanScore,
        onboardingPhase: draft.onboardingPhase,
        isProfileComplete: draft.isProfileComplete,
        employmentSector: draft.employmentSector || '',
        residencyStatus: draft.residencyStatus,
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      setMessage(body.error || 'Save failed');
      return;
    }

    setMessage('User saved.');
    setDrafts((current) => {
      const next = { ...current };
      delete next[user.id];
      return next;
    });
    startTransition(() => router.refresh());
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-[#0F172A] px-6 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#3EA63B]">
              <UserCog className="size-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Users</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Roles, scores, and profile status</p>
            </div>
          </div>
          <a href="/admin" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">
            Admin Home
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-4 px-6 py-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search users..."
              className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3EA63B]"
            />
          </div>
          {message && <p className="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{message}</p>}
        </div>

        <div className="grid gap-3">
          {filteredUsers.map((user) => {
            const draft = draftFor(user);
            return (
              <article key={user.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="grid gap-4 lg:grid-cols-[1fr_420px] lg:items-center">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-sm font-black text-slate-900">{user.name || user.username || user.email || 'Unnamed user'}</h2>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">{user.role}</span>
                      {user.isProfileComplete && <BadgeCheck className="size-4 text-[#3EA63B]" />}
                      {user.role === 'ADMIN' && <Shield className="size-4 text-blue-600" />}
                    </div>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-500">{user.email || user.id}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-black text-slate-500">
                      <span className="rounded-full bg-slate-100 px-2 py-1">Score {user.mizanScore}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">{user.onboardingPhase}</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">{user._count.accountLinks} links</span>
                      <span className="rounded-full bg-slate-100 px-2 py-1">{user._count.productApplications} applications</span>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-2">
                    <Select value={draft.role} options={roles} onChange={(value) => updateDraft(user, 'role', value as UserRow['role'])} />
                    <Select value={draft.residencyStatus} options={residencyStatuses} onChange={(value) => updateDraft(user, 'residencyStatus', value)} />
                    <Input value={draft.employmentSector || ''} placeholder="Sector" onChange={(value) => updateDraft(user, 'employmentSector', value)} />
                    <Input value={String(draft.mizanScore)} type="number" placeholder="Score" onChange={(value) => updateDraft(user, 'mizanScore', Number(value) || 600)} />
                    <Input value={draft.onboardingPhase} placeholder="Phase" onChange={(value) => updateDraft(user, 'onboardingPhase', value)} />
                    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-600">
                      <input type="checkbox" checked={draft.isProfileComplete} onChange={(event) => updateDraft(user, 'isProfileComplete', event.target.checked)} />
                      Complete
                    </label>
                    <button onClick={() => save(user)} disabled={isPending} className="sm:col-span-2 flex items-center justify-center gap-2 rounded-xl bg-[#3EA63B] px-4 py-2.5 text-xs font-black text-white hover:bg-[#2e7d2c] disabled:opacity-50">
                      <Save className="size-4" /> Save User
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }: { value: string; onChange: (value: string) => void; placeholder: string; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-[#3EA63B]"
    />
  );
}

function Select({ value, options, onChange }: { value: string; options: readonly string[]; onChange: (value: string) => void }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-900 outline-none focus:border-[#3EA63B]">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  );
}
