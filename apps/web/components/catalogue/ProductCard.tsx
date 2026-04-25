'use client';

import Link from 'next/link';
import { ChevronRight, Sparkles } from 'lucide-react';
import type { Product } from '@/lib/data/types';

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
  const logo = product.bankLogo || 'FI';
  const avatarBg = bankColor || product.bankIconBg || 'bg-slate-200';
  const avatarText = bankTextColor || 'text-white';

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
              {product.title || product.name}
            </h3>
            <p className="text-[10px] text-slate-400 font-semibold mb-1.5">{product.bankName}</p>
            <div className="flex gap-1.5 flex-wrap">
              {(product.details || []).slice(0, 2).map((d, i) => (
                <span key={i} className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${d.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                  {d.value}
                </span>
              ))}
              {product.type && (
                <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-[var(--color-mint-primary)]/10 text-[var(--color-mint-primary)]">
                  {product.type}
                </span>
              )}
            </div>
          </div>

          {/* Match Score */}
          {product.matchScore && product.matchScore > 80 && (
            <div className="text-right shrink-0">
              <span className="text-[10px] font-black text-[var(--color-mint-primary)]">{product.matchScore}%</span>
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
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${avatarBg} ${avatarText} shadow-sm`}>
            {logo}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
              {product.title || product.name}
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide mt-0.5">{product.bankName}</p>
          </div>
          {product.matchScore && (
            <span className={`text-[10px] font-black px-2 py-1 rounded-full shrink-0 ${
              product.matchScore > 85
                ? 'text-[var(--color-primary)] bg-[var(--color-primary-muted)]'
                : 'text-slate-500 bg-slate-100'
            }`}>
              {product.matchScore}%
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

        {/* Description */}
        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{product.description}</p>

        {/* Detail chips */}
        <div className="flex gap-1.5 flex-wrap">
          {(product.details || []).slice(0, 3).map((d, i) => (
            <span key={i} className={`text-[10px] font-semibold px-2.5 py-1 rounded-md ${d.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
              {d.label}: {d.value}
            </span>
          ))}
          {product.category && product.category !== 'Banks' && (
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-blue-50 text-blue-700">{product.category}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
