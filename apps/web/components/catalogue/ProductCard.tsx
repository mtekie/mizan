'use client';

import Link from 'next/link';
import { CheckCircle2, ChevronRight, Sparkles, AlertTriangle } from 'lucide-react';
import type { Product } from '@/lib/data/types';
import { getProductFacts, getProductMatchScore, getProductProviderName, getProductTitle, getProductTrustMeta, labelProductType } from '@mizan/shared';

interface ProductCardProps {
  product: Product;
  /** Bank brand color class (e.g., 'bg-indigo-700') */
  bankColor?: string;
  /** Bank text color class (e.g., 'text-white') */
  bankTextColor?: string;
  /** Render in Simple (Mint) mode */
  simpleMode?: boolean;
}

/**
 * ProductCard
 * 
 * Redesigned product card with prominent institution branding.
 * Uses the bank's actual color from banks.ts for the avatar.
 * Two variants: Pro (detailed vertical with match score) and
 * Simple (clean horizontal with Mint accents).
 */
export function ProductCard({ product, bankColor, bankTextColor, simpleMode = false }: ProductCardProps) {
  const href = product.href || `/catalogue/${product.id}`;
  const providerName = getProductProviderName(product);
  const title = getProductTitle(product);
  const facts = getProductFacts(product);
  const trust = getProductTrustMeta(product);
  const logo = product.provider?.shortCode || product.bankLogo || providerName.slice(0, 2).toUpperCase();
  const avatarBg = bankColor || product.bankIconBg || 'bg-slate-200';
  const avatarText = bankTextColor || 'text-white';
  const score = getProductMatchScore(product);

  if (simpleMode) {
    return (
      <Link href={href} className="block group">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-all flex items-center gap-3">
          {/* Institution Avatar */}
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${avatarBg} ${avatarText} shadow-sm`}>
            {logo}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-900 truncate group-hover:text-[var(--color-mint-primary)] transition-colors">
              {title}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-1.5">{providerName} · {labelProductType(product.productType || product.productClass)}</p>
            <div className="flex gap-1.5 flex-wrap">
              {facts.slice(0, 2).map((d, i) => (
                <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${d.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                  {d.label}: {d.value}
                </span>
              ))}
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${trust.tone === 'good' ? 'bg-[var(--color-mint-primary)]/10 text-[var(--color-mint-primary)]' : 'bg-amber-50 text-amber-700'}`}>
                {trust.label}
              </span>
            </div>
          </div>

          {/* Match Score */}
          {score > 80 && (
            <div className="text-right shrink-0">
              <span className="text-[10px] font-black text-[var(--color-mint-primary)]">{score}%</span>
            </div>
          )}
          <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
        </div>
      </Link>
    );
  }

  // Pro mode — vertical card
  return (
    <Link href={href} className="block group">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all h-full flex flex-col">
        {/* Header with brand avatar */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${avatarBg} ${avatarText} shadow-sm`}>
            {logo[0]}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
              {title}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{providerName}</p>
          </div>
          {score > 0 && (
            <span className={`text-[9px] font-black px-2 py-1 rounded-md shrink-0 uppercase tracking-wider ${
              score > 85
                ? 'text-[var(--color-mint-primary)] bg-[var(--color-mint-primary)]/10'
                : 'text-slate-500 bg-slate-100'
            }`}>
              {score}% Match
            </span>
          )}
        </div>

        {/* Highlight badge */}
        {product.highlight && (
          <div className="flex items-center gap-1 mb-2">
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span className="text-[9px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full">{product.highlight}</span>
          </div>
        )}

        <div className="flex items-center gap-1.5 mb-2">
          {trust.tone === 'good' ? (
            <CheckCircle2 className="w-3 h-3 text-[#3EA63B]" />
          ) : (
            <AlertTriangle className="w-3 h-3 text-amber-500" />
          )}
          <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${trust.tone === 'good' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
            {trust.label}
          </span>
          <span className="text-[9px] font-semibold text-slate-400">{trust.freshness}</span>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

        {/* Detail chips */}
        <div className="flex gap-1.5 flex-wrap">
          {facts.map((d, i) => (
            <span key={i} className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${d.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
              {d.label}: {d.value}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}
