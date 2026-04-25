'use client';

import { ChevronRight } from 'lucide-react';
import type { Bank } from '@/lib/data/banks';
import { InstitutionCard } from './InstitutionCard';

interface InstitutionStripProps {
  banks: Bank[];
  /** Map of bankId → product count */
  productCounts: Record<string, number>;
  /** Currently filter-selected bank ID */
  activeId?: string;
  onSelect?: (bankId: string) => void;
}

/**
 * InstitutionStrip
 * 
 * Horizontally scrollable Netflix-style row of institution cards.
 * Groups banks by type and shows the most prominent institutions first.
 * Each card links to the filtered catalogue for that institution.
 */
export function InstitutionStrip({ banks, productCounts, activeId, onSelect }: InstitutionStripProps) {
  // Sort: banks with more products first, then by name
  const sorted = [...banks]
    .filter(b => (productCounts[b.id] || 0) > 0)
    .sort((a, b) => (productCounts[b.id] || 0) - (productCounts[a.id] || 0));

  if (sorted.length === 0) return null;

  return (
    <section className="mb-6">
      <div className="flex items-center justify-between mb-3 px-1">
        <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
          Institutions ({sorted.length})
        </h2>
        <button className="text-[10px] font-bold text-[var(--color-primary)] flex items-center gap-0.5 hover:underline">
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
        {sorted.slice(0, 15).map(bank => (
          <div key={bank.id} onClick={() => onSelect?.(bank.id)}>
            <InstitutionCard
              bank={bank}
              productCount={productCounts[bank.id] || 0}
              compact
            />
          </div>
        ))}
      </div>
    </section>
  );
}
