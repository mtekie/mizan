'use client';

import Link from 'next/link';
import { ChevronRight, MapPin } from 'lucide-react';
import type { Bank } from '@/lib/data/banks';

interface InstitutionCardProps {
  bank: Bank;
  productCount: number;
  /** Compact variant for horizontal strip */
  compact?: boolean;
}

/**
 * InstitutionCard
 * 
 * Branded card for Ethiopian financial institutions using each bank's
 * own color palette from banks.ts. Shows the 2-letter logo in a large
 * circle avatar, type badge, founding year, and product count.
 */
export function InstitutionCard({ bank, productCount, compact = false }: InstitutionCardProps) {
  if (compact) {
    return (
      <Link href={`/catalogue?institution=${bank.id}`} className="block group shrink-0">
        <div className="w-28 flex flex-col items-center text-center p-3 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group-hover:-translate-y-0.5">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-sm mb-2 ${bank.color || 'bg-slate-600'} ${bank.textColor || 'text-white'}`}
          >
            {bank.logo || bank.shortCode || bank.name.slice(0, 2).toUpperCase()}
          </div>
          <p className="text-[11px] font-bold text-slate-800 leading-tight truncate w-full">{bank.shortCode || bank.name.split(' ')[0]}</p>
          <p className="text-[9px] text-slate-400 font-semibold mt-0.5">{productCount} products</p>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/catalogue?institution=${bank.id}`} className="block group">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all group-hover:-translate-y-0.5 h-full flex flex-col">
        {/* Header with brand-colored avatar */}
        <div className="flex items-start gap-3 mb-3">
          <div
            className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg shrink-0 ${bank.color || 'bg-slate-600'} ${bank.textColor || 'text-white'} shadow-sm`}
          >
            {bank.logo || bank.shortCode || bank.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[var(--color-primary)] transition-colors leading-tight">
              {bank.name}
            </h3>
            {bank.nameAmh && (
              <p className="text-[10px] text-slate-400 mt-0.5">{bank.nameAmh}</p>
            )}
          </div>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-1.5 mb-3 flex-1">
          <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-slate-50 text-slate-600">
            {bank.type}
          </span>
          {bank.founded && (
            <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-slate-50 text-slate-500">
              Est. {bank.founded}
            </span>
          )}
          {bank.branches && (
            <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-slate-50 text-slate-500 flex items-center gap-0.5">
              <MapPin className="w-2.5 h-2.5" /> {bank.branches.toLocaleString()} branches
            </span>
          )}
          {bank.esxListed && (
            <span className="text-[9px] font-bold px-2 py-1 rounded-md bg-emerald-50 text-emerald-700">
              ESX Listed
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-50">
          <span className="text-[10px] font-bold text-slate-500">{productCount} product{productCount !== 1 ? 's' : ''}</span>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-primary)] transition-colors" />
        </div>
      </div>
    </Link>
  );
}
