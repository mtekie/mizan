'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { AlertTriangle, CheckCircle2, Clock, Package, Pencil, Plus, Save, Search, Star, Trash2, X } from 'lucide-react';

type ProviderOption = { id: string; slug: string; name: string; shortCode: string | null };
type ProductTypeOption = { slug: string; label: string; productClass: string };
type TagOption = { id: string; slug: string; label: string; category: string };

type ProductRow = {
  id: string;
  slug: string | null;
  providerId: string | null;
  provider: ProviderOption | null;
  productClass: string | null;
  productType: string | null;
  name: string | null;
  nameAmh: string | null;
  title: string | null;
  description: string;
  highlight: string | null;
  category: string | null;
  bankName: string | null;
  loanCategory: string | null;
  matchScore: number | null;
  interestRate: number | null;
  interestMax: number | null;
  maxAmount: number | null;
  minBalance: number | null;
  term: string | null;
  fees: string | null;
  currency: string | null;
  repaymentFrequency: string | null;
  disbursementTime: string | null;
  collateralRequirements: string | null;
  prepaymentPenalties: string | null;
  latePaymentPenalties: string | null;
  insuranceRequirements: string | null;
  features: string[];
  eligibility: string[];
  requirements: string[];
  attributes: unknown;
  isActive: boolean;
  isFeatured: boolean;
  isVerified: boolean;
  digital: boolean | null;
  interestFree: boolean | null;
  genderBased: boolean | null;
  sourceName: string | null;
  sourceUrl: string | null;
  sourceType: string | null;
  lastReviewedAt: Date | string | null;
  reviewedBy: string | null;
  dataConfidence: number | null;
  updatedAt: Date | string;
  tags: { tag: TagOption }[];
};

type ProductForm = Omit<ProductRow, 'id' | 'provider' | 'tags' | 'features' | 'eligibility' | 'requirements' | 'attributes' | 'bankName' | 'updatedAt'> & {
  id?: string;
  features: string;
  eligibility: string;
  requirements: string;
  attributes: string;
  tagIds: string[];
};

const productClasses = ['SAVINGS', 'CREDIT', 'INSURANCE', 'PAYMENT', 'CAPITAL_MARKET', 'COMMUNITY'];
const qualityFilters = ['ALL', 'UNVERIFIED', 'STALE', 'MISSING_SOURCE'] as const;

const emptyProduct: ProductForm = {
  slug: '',
  providerId: '',
  productClass: 'CREDIT',
  productType: '',
  name: '',
  nameAmh: '',
  title: '',
  description: '',
  highlight: '',
  category: '',
  loanCategory: '',
  matchScore: null,
  interestRate: null,
  interestMax: null,
  maxAmount: null,
  minBalance: null,
  term: '',
  fees: '',
  currency: 'ETB',
  repaymentFrequency: '',
  disbursementTime: '',
  collateralRequirements: '',
  prepaymentPenalties: '',
  latePaymentPenalties: '',
  insuranceRequirements: '',
  features: '',
  eligibility: '',
  requirements: '',
  attributes: '',
  tagIds: [],
  isActive: true,
  isFeatured: false,
  isVerified: true,
  digital: false,
  interestFree: false,
  genderBased: false,
  sourceName: '',
  sourceUrl: '',
  sourceType: '',
  lastReviewedAt: '',
  reviewedBy: '',
  dataConfidence: null,
};

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function linesToArray(value: string) {
  return value.split('\n').map((line) => line.trim()).filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join('\n');
}

function toForm(product: ProductRow): ProductForm {
  return {
    id: product.id,
    slug: product.slug || '',
    providerId: product.providerId || '',
    productClass: product.productClass || 'CREDIT',
    productType: product.productType || '',
    name: product.name || '',
    nameAmh: product.nameAmh || '',
    title: product.title || '',
    description: product.description || '',
    highlight: product.highlight || '',
    category: product.category || '',
    loanCategory: product.loanCategory || '',
    matchScore: product.matchScore,
    interestRate: product.interestRate,
    interestMax: product.interestMax,
    maxAmount: product.maxAmount,
    minBalance: product.minBalance,
    term: product.term || '',
    fees: product.fees || '',
    currency: product.currency || 'ETB',
    repaymentFrequency: product.repaymentFrequency || '',
    disbursementTime: product.disbursementTime || '',
    collateralRequirements: product.collateralRequirements || '',
    prepaymentPenalties: product.prepaymentPenalties || '',
    latePaymentPenalties: product.latePaymentPenalties || '',
    insuranceRequirements: product.insuranceRequirements || '',
    features: arrayToLines(product.features || []),
    eligibility: arrayToLines(product.eligibility || []),
    requirements: arrayToLines(product.requirements || []),
    attributes: product.attributes ? JSON.stringify(product.attributes, null, 2) : '',
    tagIds: product.tags.map(({ tag }) => tag.id),
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    isVerified: product.isVerified,
    digital: product.digital || false,
    interestFree: product.interestFree || false,
    genderBased: product.genderBased || false,
    sourceName: product.sourceName || '',
    sourceUrl: product.sourceUrl || '',
    sourceType: product.sourceType || '',
    lastReviewedAt: product.lastReviewedAt ? new Date(product.lastReviewedAt).toISOString().slice(0, 10) : '',
    reviewedBy: product.reviewedBy || '',
    dataConfidence: product.dataConfidence,
  };
}

export function ProductsClient({
  products,
  providers,
  productTypes,
  tags,
}: {
  products: ProductRow[];
  providers: ProviderOption[];
  productTypes: ProductTypeOption[];
  tags: TagOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<ProductForm>(emptyProduct);
  const [query, setQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [qualityFilter, setQualityFilter] = useState<(typeof qualityFilters)[number]>('ALL');
  const [message, setMessage] = useState<string | null>(null);

  const isEditing = Boolean(form.id);

  const filteredProducts = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesClass = classFilter === 'ALL' || product.productClass === classFilter;
      if (!matchesClass) return false;
      if (qualityFilter === 'UNVERIFIED' && product.isVerified) return false;
      if (qualityFilter === 'STALE' && !isStale(product)) return false;
      if (qualityFilter === 'MISSING_SOURCE' && getSourceRef(product)) return false;
      if (!q) return true;
      return [
        product.name || '',
        product.title || '',
        product.slug || '',
        product.provider?.name || '',
        product.productType || '',
        product.productClass || '',
      ].some((value) => value.toLowerCase().includes(q));
    });
  }, [products, query, classFilter, qualityFilter]);

  const qualityCounts = useMemo(() => ({
    total: products.length,
    unverified: products.filter((product) => !product.isVerified).length,
    stale: products.filter(isStale).length,
    missingSource: products.filter((product) => !getSourceRef(product)).length,
  }), [products]);

  const availableTypes = useMemo(() => {
    return productTypes.filter((type) => !form.productClass || type.productClass === form.productClass);
  }, [productTypes, form.productClass]);

  function update<K extends keyof ProductForm>(key: K, value: ProductForm[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleTag(tagId: string) {
    setForm((current) => ({
      ...current,
      tagIds: current.tagIds.includes(tagId)
        ? current.tagIds.filter((id) => id !== tagId)
        : [...current.tagIds, tagId],
    }));
  }

  async function save() {
    setMessage(null);

    let attributes = null;
    if (form.attributes.trim()) {
      try {
        attributes = JSON.parse(form.attributes);
      } catch {
        setMessage('Attributes must be valid JSON.');
        return;
      }
    }

    const payload = {
      ...form,
      providerId: form.providerId || null,
      productClass: form.productClass || null,
      productType: form.productType || null,
      matchScore: form.matchScore ?? null,
      interestRate: form.interestRate ?? null,
      interestMax: form.interestMax ?? null,
      maxAmount: form.maxAmount ?? null,
      minBalance: form.minBalance ?? null,
      features: linesToArray(form.features),
      eligibility: linesToArray(form.eligibility),
      requirements: linesToArray(form.requirements),
      attributes,
    };

    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: isEditing ? 'update' : 'create', data: payload }),
    });

    const body = await res.json();
    if (!res.ok) {
      setMessage(body.error || 'Save failed');
      return;
    }

    setMessage(isEditing ? 'Product saved.' : 'Product created.');
    setForm(emptyProduct);
    startTransition(() => router.refresh());
  }

  async function remove(id: string) {
    setMessage(null);
    const res = await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
    const body = await res.json();

    if (!res.ok) {
      setMessage(body.error || 'Delete failed');
      return;
    }

    setMessage('Product deleted.');
    startTransition(() => router.refresh());
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-[#0F172A] px-6 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#3EA63B]">
              <Package className="size-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Products</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Catalogue, attributes, and tags</p>
            </div>
          </div>
          <a href="/admin" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">
            Admin Home
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 xl:grid-cols-[430px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isEditing ? 'Edit' : 'Create'}</p>
              <h2 className="text-lg font-black text-slate-900">Product</h2>
            </div>
            {isEditing && (
              <button onClick={() => setForm(emptyProduct)} className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200" title="Clear form">
                <X className="size-4" />
              </button>
            )}
          </div>

          <div className="max-h-[calc(100vh-190px)] space-y-3 overflow-y-auto pr-2">
            <TextInput label="Display Name" value={form.name || ''} onChange={(name) => setForm((current) => ({ ...current, name, title: current.title || name, slug: current.slug || slugify(name) }))} />
            <TextInput label="Title" value={form.title || ''} onChange={(value) => update('title', value)} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Slug" value={form.slug || ''} onChange={(value) => update('slug', value)} />
              <TextInput label="Match Score" type="number" value={form.matchScore !== null ? String(form.matchScore) : ''} onChange={(value) => update('matchScore', value ? Number(value) : null)} />
            </div>
            <SelectInput label="Provider" value={form.providerId || ''} options={[{ value: '', label: 'Unassigned' }, ...providers.map((provider) => ({ value: provider.id, label: provider.name }))]} onChange={(value) => update('providerId', value)} />
            <div className="grid grid-cols-2 gap-3">
              <SelectInput label="Class" value={form.productClass || ''} options={productClasses.map((value) => ({ value, label: value }))} onChange={(value) => update('productClass', value)} />
              <SelectInput label="Type" value={form.productType || ''} options={[{ value: '', label: 'Select type' }, ...availableTypes.map((type) => ({ value: type.slug, label: type.label }))]} onChange={(value) => update('productType', value)} />
            </div>
            <TextArea label="Description" value={form.description} onChange={(value) => update('description', value)} />
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Interest" type="number" value={form.interestRate !== null ? String(form.interestRate) : ''} onChange={(value) => update('interestRate', value ? Number(value) : null)} />
              <TextInput label="Interest Max" type="number" value={form.interestMax !== null ? String(form.interestMax) : ''} onChange={(value) => update('interestMax', value ? Number(value) : null)} />
              <TextInput label="Max Amount" type="number" value={form.maxAmount !== null ? String(form.maxAmount) : ''} onChange={(value) => update('maxAmount', value ? Number(value) : null)} />
              <TextInput label="Min Balance" type="number" value={form.minBalance !== null ? String(form.minBalance) : ''} onChange={(value) => update('minBalance', value ? Number(value) : null)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <TextInput label="Term" value={form.term || ''} onChange={(value) => update('term', value)} />
              <TextInput label="Currency" value={form.currency || ''} onChange={(value) => update('currency', value)} />
              <TextInput label="Fees" value={form.fees || ''} onChange={(value) => update('fees', value)} />
              <TextInput label="Highlight" value={form.highlight || ''} onChange={(value) => update('highlight', value)} />
            </div>
            <TextArea label="Features (one per line)" value={form.features} onChange={(value) => update('features', value)} />
            <TextArea label="Eligibility (one per line)" value={form.eligibility} onChange={(value) => update('eligibility', value)} />
            <TextArea label="Requirements (one per line)" value={form.requirements} onChange={(value) => update('requirements', value)} />
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">Source Metadata</p>
              <div className="space-y-3">
                <TextInput label="Source Name" value={form.sourceName || ''} onChange={(value) => update('sourceName', value)} />
                <TextInput label="Source URL" value={form.sourceUrl || ''} onChange={(value) => update('sourceUrl', value)} />
                <div className="grid grid-cols-2 gap-3">
                  <SelectInput
                    label="Source Type"
                    value={form.sourceType || ''}
                    options={[
                      { value: '', label: 'Select source' },
                      { value: 'website', label: 'Website' },
                      { value: 'spreadsheet', label: 'Spreadsheet' },
                      { value: 'pdf', label: 'PDF' },
                      { value: 'manual_review', label: 'Manual review' },
                      { value: 'partner', label: 'Partner' },
                    ]}
                    onChange={(value) => update('sourceType', value)}
                  />
                  <TextInput label="Confidence" type="number" value={form.dataConfidence !== null ? String(form.dataConfidence) : ''} onChange={(value) => update('dataConfidence', value ? Number(value) : null)} />
                  <TextInput label="Reviewed At" type="date" value={form.lastReviewedAt ? String(form.lastReviewedAt) : ''} onChange={(value) => update('lastReviewedAt', value)} />
                  <TextInput label="Reviewed By" value={form.reviewedBy || ''} onChange={(value) => update('reviewedBy', value)} />
                </div>
              </div>
            </div>
            <TextArea label="Attributes JSON" value={form.attributes} onChange={(value) => update('attributes', value)} />
            <div className="grid grid-cols-2 gap-2">
              <Checkbox label="Active" checked={form.isActive} onChange={(value) => update('isActive', value)} />
              <Checkbox label="Featured" checked={form.isFeatured} onChange={(value) => update('isFeatured', value)} />
              <Checkbox label="Verified" checked={form.isVerified} onChange={(value) => update('isVerified', value)} />
              <Checkbox label="Digital" checked={Boolean(form.digital)} onChange={(value) => update('digital', value)} />
              <Checkbox label="Interest-Free" checked={Boolean(form.interestFree)} onChange={(value) => update('interestFree', value)} />
              <Checkbox label="Gender-Based" checked={Boolean(form.genderBased)} onChange={(value) => update('genderBased', value)} />
            </div>

            <div>
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">Tags</p>
              <div className="grid max-h-52 gap-2 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-2">
                {tags.map((tag) => (
                  <label key={tag.id} className="flex items-center gap-2 rounded-lg bg-white px-2 py-2 text-xs font-bold text-slate-700">
                    <input type="checkbox" checked={form.tagIds.includes(tag.id)} onChange={() => toggleTag(tag.id)} />
                    <span className="truncate">{tag.label}</span>
                    <span className="ml-auto shrink-0 text-[9px] font-black text-slate-400">{tag.category}</span>
                  </label>
                ))}
              </div>
            </div>

            <SubmitButton pending={isPending} editing={isEditing} onClick={save} />
          </div>

          {message && <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{message}</p>}
        </section>

        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <QualityStat label="Total" value={qualityCounts.total} />
            <QualityStat label="Unverified" value={qualityCounts.unverified} tone={qualityCounts.unverified ? 'warn' : 'good'} />
            <QualityStat label="Stale" value={qualityCounts.stale} tone={qualityCounts.stale ? 'warn' : 'good'} />
            <QualityStat label="Missing Source" value={qualityCounts.missingSource} tone={qualityCounts.missingSource ? 'warn' : 'good'} />
          </div>
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3EA63B]"
              />
            </div>
            <SelectInput label="Class" value={classFilter} options={[{ value: 'ALL', label: 'All classes' }, ...productClasses.map((value) => ({ value, label: value }))]} onChange={setClassFilter} compact />
            <SelectInput
              label="Quality"
              value={qualityFilter}
              options={[
                { value: 'ALL', label: 'All quality' },
                { value: 'UNVERIFIED', label: 'Unverified' },
                { value: 'STALE', label: 'Stale' },
                { value: 'MISSING_SOURCE', label: 'Missing source' },
              ]}
              onChange={(value) => setQualityFilter(value as (typeof qualityFilters)[number])}
              compact
            />
          </div>

          <div className="grid gap-3">
            {filteredProducts.map((product) => (
              <article key={product.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex size-12 items-center justify-center rounded-xl bg-slate-700 text-sm font-black text-white">
                  {(product.provider?.shortCode || product.provider?.slug || product.productClass || 'PR').slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate text-sm font-black text-slate-900">{product.name || product.title || 'Untitled product'}</h3>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black text-slate-500">{product.productClass || 'UNCLASSIFIED'}</span>
                    {product.isFeatured && <Star className="size-4 fill-amber-400 text-amber-400" />}
                    {product.isVerified ? <CheckCircle2 className="size-4 text-[#3EA63B]" /> : <AlertTriangle className="size-4 text-amber-500" />}
                    {isStale(product) && <Clock className="size-4 text-orange-500" />}
                  </div>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                    {product.provider?.name || product.bankName || 'No provider'} / {product.productType || 'No type'} / {product.tags.length} tags
                  </p>
                  <p className="mt-1 truncate text-[10px] font-bold text-slate-400">
                    {formatReviewed(product)} / {getSourceRef(product) || 'No source reference'}
                  </p>
                </div>
                <button onClick={() => setForm(toForm(product))} className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Edit">
                  <Pencil className="size-4" />
                </button>
                <button onClick={() => remove(product.id)} className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
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

function getSourceRef(product: ProductRow) {
  const attributes = product.attributes as { sourceSheet?: string; sourceUrl?: string; source?: string } | null;
  return product.sourceName || product.sourceUrl || attributes?.sourceSheet || attributes?.sourceUrl || attributes?.source || '';
}

function getReviewedDate(product: ProductRow) {
  const attributes = product.attributes as { lastReviewedAt?: string } | null;
  const value = product.lastReviewedAt || attributes?.lastReviewedAt || product.updatedAt;
  const date = value ? new Date(value) : null;
  return date && !Number.isNaN(date.getTime()) ? date : null;
}

function isStale(product: ProductRow) {
  const date = getReviewedDate(product);
  if (!date) return true;
  const ageMs = Date.now() - date.getTime();
  return ageMs > 90 * 24 * 60 * 60 * 1000;
}

function formatReviewed(product: ProductRow) {
  const date = getReviewedDate(product);
  if (!date) return 'Review date pending';
  return `Reviewed ${date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}`;
}

function QualityStat({ label, value, tone = 'neutral' }: { label: string; value: number; tone?: 'neutral' | 'good' | 'warn' }) {
  const toneClass = tone === 'good'
    ? 'text-[#3EA63B]'
    : tone === 'warn'
      ? 'text-amber-600'
      : 'text-slate-900';

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-black ${toneClass}`}>{value}</p>
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

function SelectInput({
  label,
  value,
  options,
  onChange,
  compact = false,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  compact?: boolean;
}) {
  return (
    <label className={compact ? 'min-w-48' : 'block'}>
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#3EA63B]">
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
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
      {editing ? 'Save Changes' : 'Create Product'}
    </button>
  );
}
