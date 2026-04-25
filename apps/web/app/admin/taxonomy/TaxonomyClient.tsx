'use client';

import { useMemo, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Activity, Database, Pencil, Plus, Save, Search, Tag, Trash2, X } from 'lucide-react';

type ProductTypeRow = {
  id: string;
  slug: string;
  label: string;
  labelAmh: string | null;
  productClass: string;
  icon: string | null;
  description: string | null;
  sortOrder: number;
  isActive: boolean;
};

type TagRow = {
  id: string;
  slug: string;
  label: string;
  labelAmh: string | null;
  category: string;
  icon: string | null;
  description: string | null;
  profileField: string | null;
  profileValue: string | null;
  _count?: { productTags: number };
};

type ProductTypeForm = Omit<ProductTypeRow, 'id'> & { id?: string };
type TagForm = Omit<TagRow, 'id' | '_count'> & { id?: string };

const productClasses = ['SAVINGS', 'CREDIT', 'INSURANCE', 'PAYMENT', 'CAPITAL_MARKET', 'COMMUNITY'];
const tagCategories = ['AUDIENCE', 'SECTOR', 'FEATURE', 'COMPLIANCE', 'ACCESS_REQUIREMENT', 'COLLATERAL_TYPE'];

const emptyProductType: ProductTypeForm = {
  slug: '',
  label: '',
  labelAmh: '',
  productClass: 'CREDIT',
  icon: '',
  description: '',
  sortOrder: 0,
  isActive: true,
};

const emptyTag: TagForm = {
  slug: '',
  label: '',
  labelAmh: '',
  category: 'FEATURE',
  icon: '',
  description: '',
  profileField: '',
  profileValue: '',
};

function toProductTypeForm(item: ProductTypeRow): ProductTypeForm {
  return {
    id: item.id,
    slug: item.slug,
    label: item.label,
    labelAmh: item.labelAmh || '',
    productClass: item.productClass,
    icon: item.icon || '',
    description: item.description || '',
    sortOrder: item.sortOrder,
    isActive: item.isActive,
  };
}

function toTagForm(item: TagRow): TagForm {
  return {
    id: item.id,
    slug: item.slug,
    label: item.label,
    labelAmh: item.labelAmh || '',
    category: item.category,
    icon: item.icon || '',
    description: item.description || '',
    profileField: item.profileField || '',
    profileValue: item.profileValue || '',
  };
}

function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

export function TaxonomyClient({
  productTypes,
  tags,
}: {
  productTypes: ProductTypeRow[];
  tags: TagRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [view, setView] = useState<'productTypes' | 'tags'>('productTypes');
  const [query, setQuery] = useState('');
  const [productTypeForm, setProductTypeForm] = useState<ProductTypeForm>(emptyProductType);
  const [tagForm, setTagForm] = useState<TagForm>(emptyTag);
  const [message, setMessage] = useState<string | null>(null);

  const filteredProductTypes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return productTypes;
    return productTypes.filter((item) =>
      [item.slug, item.label, item.productClass].some((value) => value.toLowerCase().includes(q))
    );
  }, [productTypes, query]);

  const filteredTags = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tags;
    return tags.filter((item) =>
      [item.slug, item.label, item.category, item.profileField || '', item.profileValue || '']
        .some((value) => value.toLowerCase().includes(q))
    );
  }, [tags, query]);

  async function mutate(kind: 'productType' | 'tag', action: 'create' | 'update', data: ProductTypeForm | TagForm) {
    setMessage(null);
    const res = await fetch('/api/admin/taxonomy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, action, data }),
    });

    const body = await res.json();
    if (!res.ok) {
      setMessage(body.error || 'Save failed');
      return;
    }

    setMessage(action === 'create' ? 'Created.' : 'Saved.');
    if (kind === 'productType') setProductTypeForm(emptyProductType);
    if (kind === 'tag') setTagForm(emptyTag);
    startTransition(() => router.refresh());
  }

  async function remove(kind: 'productType' | 'tag', id: string) {
    setMessage(null);
    const res = await fetch(`/api/admin/taxonomy?kind=${kind}&id=${id}`, { method: 'DELETE' });
    const body = await res.json();

    if (!res.ok) {
      setMessage(body.error || 'Delete failed');
      return;
    }

    setMessage('Deleted.');
    startTransition(() => router.refresh());
  }

  const activeForm = view === 'productTypes' ? productTypeForm : tagForm;
  const isEditing = Boolean(activeForm.id);

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-[#0F172A] px-6 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#3EA63B]">
              <Database className="size-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Taxonomy</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Product types and match tags</p>
            </div>
          </div>
          <a href="/admin" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">
            Admin Home
          </a>
        </div>
      </header>

      <main className="mx-auto grid w-full max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[360px_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{isEditing ? 'Edit' : 'Create'}</p>
              <h2 className="text-lg font-black text-slate-900">{view === 'productTypes' ? 'Product Type' : 'Tag'}</h2>
            </div>
            {isEditing && (
              <button
                onClick={() => view === 'productTypes' ? setProductTypeForm(emptyProductType) : setTagForm(emptyTag)}
                className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-500 hover:bg-slate-200"
                title="Clear form"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {view === 'productTypes' ? (
            <div className="space-y-3">
              <TextInput label="Label" value={productTypeForm.label} onChange={(label) => setProductTypeForm((f) => ({ ...f, label, slug: f.slug || slugify(label) }))} />
              <TextInput label="Slug" value={productTypeForm.slug} onChange={(slug) => setProductTypeForm((f) => ({ ...f, slug }))} />
              <SelectInput label="Class" value={productTypeForm.productClass} options={productClasses} onChange={(productClass) => setProductTypeForm((f) => ({ ...f, productClass }))} />
              <div className="grid grid-cols-2 gap-3">
                <TextInput label="Icon" value={productTypeForm.icon || ''} onChange={(icon) => setProductTypeForm((f) => ({ ...f, icon }))} />
                <TextInput label="Sort" type="number" value={String(productTypeForm.sortOrder)} onChange={(sortOrder) => setProductTypeForm((f) => ({ ...f, sortOrder: Number(sortOrder) || 0 }))} />
              </div>
              <TextInput label="Amharic Label" value={productTypeForm.labelAmh || ''} onChange={(labelAmh) => setProductTypeForm((f) => ({ ...f, labelAmh }))} />
              <TextArea label="Description" value={productTypeForm.description || ''} onChange={(description) => setProductTypeForm((f) => ({ ...f, description }))} />
              <label className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs font-bold text-slate-600">
                <input type="checkbox" checked={productTypeForm.isActive} onChange={(e) => setProductTypeForm((f) => ({ ...f, isActive: e.target.checked }))} />
                Active in catalogue filters
              </label>
              <SubmitButton pending={isPending} editing={isEditing} onClick={() => mutate('productType', isEditing ? 'update' : 'create', productTypeForm)} />
            </div>
          ) : (
            <div className="space-y-3">
              <TextInput label="Label" value={tagForm.label} onChange={(label) => setTagForm((f) => ({ ...f, label, slug: f.slug || slugify(label) }))} />
              <TextInput label="Slug" value={tagForm.slug} onChange={(slug) => setTagForm((f) => ({ ...f, slug }))} />
              <SelectInput label="Category" value={tagForm.category} options={tagCategories} onChange={(category) => setTagForm((f) => ({ ...f, category }))} />
              <TextInput label="Icon" value={tagForm.icon || ''} onChange={(icon) => setTagForm((f) => ({ ...f, icon }))} />
              <div className="grid grid-cols-2 gap-3">
                <TextInput label="Profile Field" value={tagForm.profileField || ''} onChange={(profileField) => setTagForm((f) => ({ ...f, profileField }))} />
                <TextInput label="Profile Value" value={tagForm.profileValue || ''} onChange={(profileValue) => setTagForm((f) => ({ ...f, profileValue }))} />
              </div>
              <TextInput label="Amharic Label" value={tagForm.labelAmh || ''} onChange={(labelAmh) => setTagForm((f) => ({ ...f, labelAmh }))} />
              <TextArea label="Description" value={tagForm.description || ''} onChange={(description) => setTagForm((f) => ({ ...f, description }))} />
              <SubmitButton pending={isPending} editing={isEditing} onClick={() => mutate('tag', isEditing ? 'update' : 'create', tagForm)} />
            </div>
          )}

          {message && (
            <p className="mt-4 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{message}</p>
          )}
        </section>

        <section className="space-y-4">
          <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex rounded-xl bg-slate-100 p-1">
              <SegmentButton active={view === 'productTypes'} onClick={() => setView('productTypes')} icon={Activity} label={`Product Types (${productTypes.length})`} />
              <SegmentButton active={view === 'tags'} onClick={() => setView('tags')} icon={Tag} label={`Tags (${tags.length})`} />
            </div>
            <div className="relative md:w-80">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search taxonomy..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-medium text-slate-800 outline-none focus:border-[#3EA63B]"
              />
            </div>
          </div>

          {view === 'productTypes' ? (
            <div className="grid gap-3">
              {filteredProductTypes.map((item) => (
                <RowCard
                  key={item.id}
                  title={item.label}
                  subtitle={`${item.slug} / ${item.productClass}`}
                  meta={item.isActive ? 'Active' : 'Inactive'}
                  count={item.sortOrder}
                  onEdit={() => setProductTypeForm(toProductTypeForm(item))}
                  onDelete={() => remove('productType', item.id)}
                />
              ))}
            </div>
          ) : (
            <div className="grid gap-3">
              {filteredTags.map((item) => (
                <RowCard
                  key={item.id}
                  title={item.label}
                  subtitle={`${item.slug} / ${item.category}${item.profileField ? ` / ${item.profileField}=${item.profileValue || ''}` : ''}`}
                  meta={`${item._count?.productTags || 0} products`}
                  onEdit={() => setTagForm(toTagForm(item))}
                  onDelete={() => remove('tag', item.id)}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function TextInput({ label, value, onChange, type = 'text' }: { label: string; value: string; onChange: (value: string) => void; type?: string }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#3EA63B]"
      />
    </label>
  );
}

function TextArea({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#3EA63B]"
      />
    </label>
  );
}

function SelectInput({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-900 outline-none focus:border-[#3EA63B]"
      >
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SubmitButton({ pending, editing, onClick }: { pending: boolean; editing: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      disabled={pending}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#3EA63B] px-4 py-3 text-sm font-black text-white shadow-sm transition hover:bg-[#2e7d2c] disabled:opacity-50"
    >
      {editing ? <Save className="size-4" /> : <Plus className="size-4" />}
      {editing ? 'Save Changes' : 'Create'}
    </button>
  );
}

function SegmentButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: any; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-black transition ${active ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:bg-white'}`}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function RowCard({
  title,
  subtitle,
  meta,
  count,
  onEdit,
  onDelete,
}: {
  title: string;
  subtitle: string;
  meta: string;
  count?: number;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-black text-slate-900">{title}</h3>
          <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-slate-500">{meta}</span>
          {count !== undefined && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">Sort {count}</span>}
        </div>
        <p className="mt-1 truncate text-xs font-semibold text-slate-500">{subtitle}</p>
      </div>
      <button onClick={onEdit} className="flex size-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200" title="Edit">
        <Pencil className="size-4" />
      </button>
      <button onClick={onDelete} className="flex size-9 items-center justify-center rounded-lg bg-red-50 text-red-600 hover:bg-red-100" title="Delete">
        <Trash2 className="size-4" />
      </button>
    </article>
  );
}
