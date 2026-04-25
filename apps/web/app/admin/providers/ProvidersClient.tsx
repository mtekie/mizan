'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, ExternalLink, Pencil, Plus, Save, Search, ShieldCheck, Trash2, X } from 'lucide-react';

type ProviderRow = {
  id: string;
  slug: string;
  name: string;
  nameAmh: string | null;
  shortCode: string | null;
  type: string;
  tier: string | null;
  logoUrl: string | null;
  iconUrl: string | null;
  brandColor: string | null;
  brandColorBg: string | null;
  description: string | null;
  founded: number | null;
  headquarters: string | null;
  region: string | null;
  website: string | null;
  appStoreUrl: string | null;
  playStoreUrl: string | null;
  branches: number | null;
  branchNetwork: unknown;
  isDigital: boolean;
  esxListed: boolean;
  esxSymbol: string | null;
  isVerified: boolean;
  isActive: boolean;
  _count: { products: number; reviews: number };
};

type ProviderForm = Omit<ProviderRow, 'id' | 'branchNetwork' | '_count'> & {
  id?: string;
  branchNetwork: string;
};

const providerTypes = ['BANK', 'MFI', 'INSURANCE', 'WALLET', 'SACCO', 'BROKER', 'BNPL_MERCHANT', 'GOVERNMENT'];

const emptyProvider: ProviderForm = {
  slug: '',
  name: '',
  nameAmh: '',
  shortCode: '',
  type: 'BANK',
  tier: '',
  logoUrl: '',
  iconUrl: '',
  brandColor: '#334155',
  brandColorBg: '',
  description: '',
  founded: null,
  headquarters: '',
  region: '',
  website: '',
  appStoreUrl: '',
  playStoreUrl: '',
  branches: null,
  branchNetwork: '',
  isDigital: false,
  esxListed: false,
  esxSymbol: '',
  isVerified: false,
  isActive: true,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function toForm(provider: ProviderRow): ProviderForm {
  return {
    id: provider.id,
    slug: provider.slug,
    name: provider.name,
    nameAmh: provider.nameAmh || '',
    shortCode: provider.shortCode || '',
    type: provider.type,
    tier: provider.tier || '',
    logoUrl: provider.logoUrl || '',
    iconUrl: provider.iconUrl || '',
    brandColor: provider.brandColor || '',
    brandColorBg: provider.brandColorBg || '',
    description: provider.description || '',
    founded: provider.founded,
    headquarters: provider.headquarters || '',
    region: provider.region || '',
    website: provider.website || '',
    appStoreUrl: provider.appStoreUrl || '',
    playStoreUrl: provider.playStoreUrl || '',
    branches: provider.branches,
    branchNetwork: provider.branchNetwork ? JSON.stringify(provider.branchNetwork, null, 2) : '',
    isDigital: provider.isDigital,
    esxListed: provider.esxListed,
    esxSymbol: provider.esxSymbol || '',
    isVerified: provider.isVerified,
    isActive: provider.isActive,
  };
}

export function ProvidersClient({ providers }: { providers: ProviderRow[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<ProviderForm>(emptyProvider);
  const [query, setQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const filteredProviders = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return providers;
    return providers.filter((provider) =>
      [provider.name, provider.slug, provider.shortCode || '', provider.type, provider.region || '', provider.headquarters || '']
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [providers, query]);

  const isEditing = Boolean(form.id);

  function update<K extends keyof ProviderForm>(key: K, value: ProviderForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function save() {
    setMessage(null);

    let branchNetwork = null;
    if (form.branchNetwork.trim()) {
      try {
        branchNetwork = JSON.parse(form.branchNetwork);
      } catch {
        setMessage('Branch network must be valid JSON.');
        return;
      }
    }

    const res = await fetch('/api/admin/providers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: isEditing ? 'update' : 'create',
        data: {
          ...form,
          founded: form.founded || null,
          branches: form.branches ?? null,
          branchNetwork,
        },
      }),
    });

    const body = await res.json();
    if (!res.ok) {
      setMessage(body.error || 'Save failed');
      return;
    }

    setMessage(isEditing ? 'Provider saved.' : 'Provider created.');
    setForm(emptyProvider);
    startTransition(() => router.refresh());
  }

  async function remove(id: string) {
    setMessage(null);
    const res = await fetch(`/api/admin/providers?id=${id}`, { method: 'DELETE' });
    const body = await res.json();

    if (!res.ok) {
      setMessage(body.error || 'Delete failed');
      return;
    }

    setMessage('Provider deleted.');
    startTransition(() => router.refresh());
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-[#0F172A] px-6 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#3EA63B]">
              <Building2 className="size-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Providers</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Institutions, branding, and regional reach</p>
            </div>
          </div>
          <a href="/admin" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">
            Admin Home
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[390px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isEditing ? 'Edit' : 'Create'}</p>
              <h2 className="text-lg font-black text-slate-900">Provider</h2>
            </div>
            {isEditing && (
              <button onClick={() => setForm(emptyProvider)} className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200" title="Clear form">
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="space-y-3">
            <TextInput label="Name" value={form.name} onChange={(name) => setForm((current) => ({ ...current, name, slug: current.slug || slugify(name) }))} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Slug" value={form.slug} onChange={(value) => update('slug', value)} />
              <TextInput label="Short Code" value={form.shortCode || ''} onChange={(value) => update('shortCode', value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <SelectInput label="Type" value={form.type} options={providerTypes} onChange={(value) => update('type', value)} />
              <TextInput label="Tier" value={form.tier || ''} onChange={(value) => update('tier', value)} />
            </div>
            <TextInput label="Amharic Name" value={form.nameAmh || ''} onChange={(value) => update('nameAmh', value)} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Brand Color" value={form.brandColor || ''} onChange={(value) => update('brandColor', value)} />
              <TextInput label="Brand BG" value={form.brandColorBg || ''} onChange={(value) => update('brandColorBg', value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Founded" type="number" value={form.founded ? String(form.founded) : ''} onChange={(value) => update('founded', value ? Number(value) : null)} />
              <TextInput label="Branches" type="number" value={form.branches !== null ? String(form.branches) : ''} onChange={(value) => update('branches', value ? Number(value) : null)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="HQ" value={form.headquarters || ''} onChange={(value) => update('headquarters', value)} />
              <TextInput label="Region" value={form.region || ''} onChange={(value) => update('region', value)} />
            </div>
            <TextInput label="Website" value={form.website || ''} onChange={(value) => update('website', value)} />
            <TextArea label="Description" value={form.description || ''} onChange={(value) => update('description', value)} />
            <TextArea label="Branch Network JSON" value={form.branchNetwork} onChange={(value) => update('branchNetwork', value)} />
            <div className="grid grid-cols-2 gap-2">
              <Checkbox label="Digital" checked={form.isDigital} onChange={(value) => update('isDigital', value)} />
              <Checkbox label="ESX Listed" checked={form.esxListed} onChange={(value) => update('esxListed', value)} />
              <Checkbox label="Verified" checked={form.isVerified} onChange={(value) => update('isVerified', value)} />
              <Checkbox label="Active" checked={form.isActive} onChange={(value) => update('isActive', value)} />
            </div>
            <TextInput label="ESX Symbol" value={form.esxSymbol || ''} onChange={(value) => update('esxSymbol', value)} />
            <SubmitButton pending={isPending} editing={isEditing} onClick={save} />
          </div>

          {message && <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{message}</p>}
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search providers..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3EA63B]"
              />
            </div>
          </div>

          <div className="grid gap-3">
            {filteredProviders.map((provider) => (
              <article key={provider.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-700 text-sm font-black text-white" style={provider.brandColor ? { backgroundColor: provider.brandColor } : undefined}>
                  {provider.shortCode || provider.slug.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-black text-slate-900">{provider.name}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">{provider.type}</span>
                    {provider.isVerified && <ShieldCheck className="size-4 text-[#3EA63B]" />}
                    {provider.website && <a href={provider.website} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#3EA63B]"><ExternalLink className="size-4" /></a>}
                  </div>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                    {provider.slug} / {provider.region || provider.headquarters || 'No region'} / {provider._count.products} products
                  </p>
                </div>
                <button onClick={() => setForm(toForm(provider))} className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Edit">
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => remove(provider.id)} className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
                  <Trash2 className="size-4" />
                </button>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

function TextInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#3EA63B]" />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#3EA63B]" />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#3EA63B]">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      {label}
    </label>
  );
}

function SubmitButton({ pending, editing, onClick }: { pending: boolean; editing: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={pending} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3EA63B] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#2e7d2c] disabled:opacity-50">
      {editing ? <Save className="size-4" /> : <Plus className="size-4" />}
      {editing ? 'Save Changes' : 'Create Provider'}
    </button>
  );
}
