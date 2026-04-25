'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, Landmark, X } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from './catalogue/ProductCard';
import { InstitutionStrip } from './catalogue/InstitutionStrip';
import { getBankById, getBanksWithProducts } from '@/lib/data/bankLookup';
import { EmptyState } from './EmptyState';

const filterTabs = [
  { key: 'All', label: 'All' },
  { key: 'Banks', label: 'Banks' },
  { key: 'Insurance', label: 'Insurance' },
  { key: 'SACCOs', label: 'SACCOs' },
  { key: 'BNPL', label: 'BNPL' },
] as const;

export function SimpleCatalogue({ products, categories }: { products: any[], categories: readonly any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeFilter !== 'All') {
      result = result.filter(p => p.category === activeFilter);
    }
    if (selectedInstitution) {
      result = result.filter(p => (p.bankId || p.instituteId) === selectedInstitution);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.title || p.name || '').toLowerCase().includes(q) ||
        (p.bankName || '').toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [products, activeFilter, selectedInstitution, searchQuery]);

  // Get institution data
  const { banks: institutionBanks, counts: productCounts } = useMemo(
    () => getBanksWithProducts(products),
    [products]
  );

  const handleInstitutionSelect = (bankId: string) => {
    setSelectedInstitution(prev => prev === bankId ? null : bankId);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24 md:pb-0 md:max-w-lg md:mx-auto">
      {/* Header */}
      <header className="mint-gradient-hero px-6 pt-12 pb-6 text-white sticky top-0 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center" aria-label="Go back">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-xl font-bold">Explore</h1>
          </div>
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-10 h-10 rounded-full bg-white text-[var(--color-mint-primary)] flex items-center justify-center shadow-md"
            aria-label={showSearch ? 'Close search' : 'Search products'}
          >
            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
          </button>
        </div>

        {/* Search bar */}
        {showSearch && (
          <div className="relative animate-slide-up">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search banks, loans, savings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-white/30"
            />
          </div>
        )}
      </header>

      <main className="px-6 -mt-4 relative z-10 space-y-4 flex-1">
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-1">
          {filterTabs.map(f => (
            <button
              key={f.key}
              onClick={() => { setActiveFilter(f.key); setSelectedInstitution(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f.key
                  ? 'bg-[var(--color-mint-primary)] text-white shadow-md'
                  : 'bg-white text-slate-600 shadow-sm border border-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Institution Strip */}
        <InstitutionStrip
          banks={institutionBanks}
          productCounts={productCounts}
          activeId={selectedInstitution || undefined}
          onSelect={handleInstitutionSelect}
        />

        {/* Selected institution badge */}
        {selectedInstitution && (() => {
          const bank = getBankById(selectedInstitution);
          return bank ? (
            <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 shadow-sm border border-slate-100">
              <div className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-[8px] ${bank.color} ${bank.textColor}`}>
                {bank.logo}
              </div>
              <span className="text-xs font-bold text-slate-800 flex-1">{bank.name}</span>
              <button onClick={() => setSelectedInstitution(null)} className="text-slate-400 hover:text-slate-600" aria-label="Clear filter">
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : null;
        })()}

        {/* Product Count */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No products found"
            description="Try adjusting your filters or search terms to find financial products."
          />
        ) : (
          <div className="space-y-3 pb-4">
            {filteredProducts.map((product: any) => {
              const bank = getBankById(product.bankId || product.instituteId);
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  bankColor={bank?.color}
                  bankTextColor={bank?.textColor}
                  simpleMode
                />
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
