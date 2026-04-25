'use client';

import { useState, useTransition } from 'react';
import { CheckCircle2, Link2, MessageCircle, RotateCcw, ShieldCheck, Star, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

type ProductReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  isVerified: boolean;
  createdAt: Date | string;
  user: { name: string | null; email: string | null };
  product: { name: string | null; title: string | null; slug: string | null };
};

type ProviderReviewRow = {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  createdAt: Date | string;
  user: { name: string | null; email: string | null };
  provider: { name: string; slug: string };
};

type AccountLinkRow = {
  id: string;
  level: string;
  accountNumber: string | null;
  verifiedAt: Date | string | null;
  user: { name: string | null; email: string | null };
};

export function ModerationClient({
  productReviews,
  providerReviews,
  accountLinks,
}: {
  productReviews: ProductReviewRow[];
  providerReviews: ProviderReviewRow[];
  accountLinks: AccountLinkRow[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [tab, setTab] = useState<'productReviews' | 'providerReviews' | 'accountLinks'>('productReviews');
  const [message, setMessage] = useState<string | null>(null);

  async function act(kind: string, action: string, id: string) {
    setMessage(null);
    const res = await fetch('/api/admin/moderation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ kind, action, id }),
    });

    const body = await res.json();
    if (!res.ok) {
      setMessage(body.error || 'Action failed');
      return;
    }

    setMessage('Action applied.');
    startTransition(() => router.refresh());
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 bg-[#0F172A] px-6 py-4">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-lg bg-[#3EA63B]">
              <ShieldCheck className="size-4 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-black text-white">Moderation</h1>
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Reviews and account-link verification</p>
            </div>
          </div>
          <a href="/admin" className="rounded-lg border border-white/10 px-3 py-2 text-xs font-bold text-slate-300 hover:bg-white/10">
            Admin Home
          </a>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl space-y-4 px-6 py-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
          <div className="flex rounded-xl bg-slate-100 p-1">
            <TabButton active={tab === 'productReviews'} onClick={() => setTab('productReviews')} label={`Product Reviews (${productReviews.length})`} />
            <TabButton active={tab === 'providerReviews'} onClick={() => setTab('providerReviews')} label={`Provider Reviews (${providerReviews.length})`} />
            <TabButton active={tab === 'accountLinks'} onClick={() => setTab('accountLinks')} label={`Account Links (${accountLinks.length})`} />
          </div>
          {message && <p className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-600">{message}</p>}
        </div>

        {tab === 'productReviews' && (
          <div className="grid gap-3">
            {productReviews.map((review) => (
              <ReviewCard
                key={review.id}
                title={review.title || review.product.title || review.product.name || 'Product review'}
                subtitle={`${review.user.name || review.user.email || 'Unknown user'} / ${review.product.slug || 'product'}`}
                rating={review.rating}
                body={review.body}
                verified={review.isVerified}
                actions={
                  <>
                    <IconButton label={review.isVerified ? 'Unverify' : 'Verify'} onClick={() => act('productReview', review.isVerified ? 'unverify' : 'verify', review.id)} icon={review.isVerified ? RotateCcw : CheckCircle2} disabled={isPending} />
                    <IconButton label="Delete" onClick={() => act('productReview', 'delete', review.id)} icon={Trash2} danger disabled={isPending} />
                  </>
                }
              />
            ))}
          </div>
        )}

        {tab === 'providerReviews' && (
          <div className="grid gap-3">
            {providerReviews.map((review) => (
              <ReviewCard
                key={review.id}
                title={review.title || review.provider.name}
                subtitle={`${review.user.name || review.user.email || 'Unknown user'} / ${review.provider.slug}`}
                rating={review.rating}
                body={review.body}
                actions={<IconButton label="Delete" onClick={() => act('providerReview', 'delete', review.id)} icon={Trash2} danger disabled={isPending} />}
              />
            ))}
          </div>
        )}

        {tab === 'accountLinks' && (
          <div className="grid gap-3">
            {accountLinks.map((link) => (
              <article key={link.id} className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                  <Link2 className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-black text-slate-900">{link.user.name || link.user.email || 'Unknown user'}</h3>
                  <p className="mt-1 truncate text-xs font-semibold text-slate-500">{link.level} / {link.accountNumber || 'No account number'}</p>
                </div>
                <IconButton label="Verify" onClick={() => act('accountLink', 'verify', link.id)} icon={CheckCircle2} disabled={isPending} />
                <IconButton label="Reset" onClick={() => act('accountLink', 'reset', link.id)} icon={RotateCcw} disabled={isPending} />
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function TabButton({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={`rounded-lg px-3 py-2 text-xs font-black transition ${active ? 'bg-[#0F172A] text-white' : 'text-slate-500 hover:bg-white'}`}>
      {label}
    </button>
  );
}

function ReviewCard({
  title,
  subtitle,
  rating,
  body,
  verified,
  actions,
}: {
  title: string;
  subtitle: string;
  rating: number;
  body: string | null;
  verified?: boolean;
  actions: React.ReactNode;
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex gap-4">
        <div className="flex size-11 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
          <MessageCircle className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-black text-slate-900">{title}</h3>
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-black text-amber-700">
              <Star className="size-3 fill-amber-400 text-amber-400" /> {rating}
            </span>
            {verified && <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-black text-emerald-700">Verified</span>}
          </div>
          <p className="mt-1 truncate text-xs font-semibold text-slate-500">{subtitle}</p>
          {body && <p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p>}
        </div>
        <div className="flex shrink-0 items-center gap-2">{actions}</div>
      </div>
    </article>
  );
}

function IconButton({ label, icon: Icon, onClick, danger, disabled }: { label: string; icon: any; onClick: () => void; danger?: boolean; disabled?: boolean }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-black disabled:opacity-50 ${danger ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
      title={label}
    >
      <Icon className="size-4" />
      {label}
    </button>
  );
}
