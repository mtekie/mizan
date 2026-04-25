'use client';

import { useState, useEffect, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, Landmark, X } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from './catalogue/ProductCard';
import { InstitutionStrip } from './catalogue/InstitutionStrip';
import { getBankById, getBanksWithProducts } from '@/lib/data/bankLookup';
import { EmptyState } from './EmptyState';
import { PageHeader } from './PageHeader';

const filterTabs = [
  { key: 'all', label: 'All', icon: '✨' },
  { key: 'SAVINGS', label: 'Savings', icon: '💰' },
  { key: 'CREDIT', label: 'Loans', icon: '🏦' },
  { key: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { key: 'PAYMENT', label: 'Payments', icon: '📱' },
] as const;

export function SimpleCatalogue({ products, categories, loading = false }: { products: any[], categories: readonly any[], loading?: boolean }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeFilter !== 'all') {
      result = result.filter(p => p.productClass === activeFilter || p.category === activeFilter);
    }
    if (selectedInstitution) {
      result = result.filter(p => (p.bankId || p.instituteId || p.providerId) === selectedInstitution);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        (p.title || p.name || '').toLowerCase().includes(q) ||
        (p.bankName || p.provider?.name || '').toLowerCase().includes(q) ||
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
    <div className="flex flex-col min-h-screen bg-[var(--color-mint-bg)] pb-24 md:pb-0 w-full max-w-7xl mx-auto">
      {/* Desktop Header */}
      <PageHeader 
        title="Find"
        description="Discover financial products tailored for your goals"
        actions={
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 text-sm border-none focus:ring-2 focus:ring-[var(--color-mint-primary)]/20"
            />
          </div>
        }
      />

      {/* Mobile Header */}
      <header className="md:hidden mint-gradient-hero px-6 pt-12 pb-6 text-white sticky top-0 z-20">
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

        {selectedInstitution && (() => {
          const bank = getBankById(selectedInstitution);
          return bank ? (
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-100 animate-slide-up">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${bank.color} ${bank.textColor} shadow-sm`}>
                {bank.logo}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{bank.name}</p>
                <Link href={`/catalogue/bank/${bank.id}`} className="text-[10px] font-bold text-[var(--color-mint-primary)] hover:underline">
                  View Profile →
                </Link>
              </div>
              <button onClick={() => setSelectedInstitution(null)} className="p-1.5 hover:bg-slate-50 rounded-full transition-colors" aria-label="Clear filter">
                <X className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          ) : null;
        })()}

        {/* Product Count */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          {loading ? 'Loading products' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''} found`}
        </p>

        {/* Products List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-20 rounded-2xl bg-white/70 border border-slate-100 shadow-sm animate-pulse" />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            icon={Landmark}
            title="No products found"
            description="Try adjusting your filters or search terms to find financial products."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {filteredProducts.map((product: any) => {
              const bank = getBankById(product.bankId || product.instituteId || product.providerId);
              // Merge provider data from API if available
              const displayBank = product.provider ? {
                  color: product.provider.brandColor || bank?.color,
                  textColor: 'text-white', // Default
                  logo: product.provider.shortCode || bank?.logo || product.bankLogo
              } : bank;

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  bankColor={displayBank?.color}
                  bankTextColor={displayBank?.textColor}
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
