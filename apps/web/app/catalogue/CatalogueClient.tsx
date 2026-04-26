'use client';

import { useState, useMemo } from 'react';
import { Search, Landmark, X, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { ProductCard } from '@/components/catalogue/ProductCard';
import { InstitutionStrip } from '@/components/catalogue/InstitutionStrip';
import { getBankById, getBanksWithProducts } from '@/lib/data/bankLookup';
import { EmptyState } from '@/components/EmptyState';
import { AppPageShell } from '@/components/AppPageShell';

export function CatalogueClient({ products, categories }: { products: any[], categories: readonly any[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedInstitution, setSelectedInstitution] = useState<string | null>(null);
  const [digitalOnly, setDigitalOnly] = useState(false);
  const [interestFreeOnly, setInterestFreeOnly] = useState(false);
  const [audienceFilter, setAudienceFilter] = useState('');

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = products;
    if (activeFilter !== 'all') {
      result = result.filter(p => p.productClass === activeFilter || p.category === activeFilter);
    }
    if (selectedInstitution) {
      result = result.filter(p => (p.bankId || p.instituteId || p.providerId) === selectedInstitution);
    }
    if (digitalOnly) {
      result = result.filter(p => p.digital);
    }
    if (interestFreeOnly) {
      result = result.filter(p => p.interestFree);
    }
    if (audienceFilter) {
      const terms = audienceFilter === 'student'
        ? ['student', 'education', 'teen', 'youth']
        : ['salary', 'salaried', 'employee', 'payroll'];
      result = result.filter(p => {
        const haystack = `${p.title || ''} ${p.name || ''} ${p.description || ''}`.toLowerCase();
        return terms.some(term => haystack.includes(term));
      });
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
  }, [products, activeFilter, selectedInstitution, digitalOnly, interestFreeOnly, audienceFilter, searchQuery]);

  // Get institution data
  const { banks: institutionBanks, counts: productCounts } = useMemo(
    () => getBanksWithProducts(products),
    [products]
  );

  const handleInstitutionSelect = (bankId: string) => {
    setSelectedInstitution(prev => prev === bankId ? null : bankId);
  };

  return (
    <AppPageShell
      title="Find"
      subtitle="Discover financial products tailored for your goals"
      variant="hero"
      actions={
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/10 text-white placeholder:text-white/40 text-sm border-none focus:ring-2 focus:ring-white/20 outline-none"
          />
        </div>
      }
    >
      <div className="space-y-6">
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-1">
          {categories.map(f => (
            <button
              key={f.key}
              onClick={() => { setActiveFilter(f.key); setSelectedInstitution(null); }}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeFilter === f.key
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 shadow-sm border border-slate-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Featured Section */}
        {activeFilter === 'all' && !selectedInstitution && products.some(p => p.isFeatured) && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Featured for You
              </h2>
            </div>
            <div className="flex gap-4 overflow-x-auto hide-scrollbar -mx-6 px-6 pb-2">
              {products.filter(p => p.isFeatured).slice(0, 5).map(product => {
                const bank = getBankById(product.bankId || product.instituteId || product.providerId);
                const displayBank = product.provider ? {
                    color: product.provider.brandColor || bank?.color,
                    textColor: 'text-white',
                    logo: product.provider.shortCode || bank?.logo || product.bankLogo
                } : bank;

                return (
                  <div key={product.id} className="w-72 shrink-0">
                    <ProductCard
                      product={product}
                      bankColor={displayBank?.color}
                      bankTextColor={displayBank?.textColor}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Institution Strip */}
        <InstitutionStrip
          banks={institutionBanks}
          productCounts={productCounts}
          activeId={selectedInstitution || undefined}
          onSelect={handleInstitutionSelect}
        />

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDigitalOnly(value => !value)}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${digitalOnly ? 'bg-[#3EA63B] text-white' : 'bg-white text-slate-600 border border-slate-100'}`}
          >
            Digital only
          </button>
          <button
            type="button"
            onClick={() => setInterestFreeOnly(value => !value)}
            className={`rounded-xl px-3 py-2 text-xs font-bold transition ${interestFreeOnly ? 'bg-[#3EA63B] text-white' : 'bg-white text-slate-600 border border-slate-100'}`}
          >
            Interest-free
          </button>
          {[
            { key: 'student', label: 'Student' },
            { key: 'salaried', label: 'Salaried' },
          ].map(option => (
            <button
              key={option.key}
              type="button"
              onClick={() => setAudienceFilter(value => value === option.key ? '' : option.key)}
              className={`rounded-xl px-3 py-2 text-xs font-bold transition ${audienceFilter === option.key ? 'bg-[#0F172A] text-white' : 'bg-white text-slate-600 border border-slate-100'}`}
            >
              {option.label}
            </button>
          ))}
        </div>

        {selectedInstitution && (() => {
          const bank = getBankById(selectedInstitution);
          return bank ? (
            <div className="flex items-center gap-3 bg-white rounded-xl px-4 py-2 shadow-sm border border-slate-100 animate-slide-up">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${bank.color} ${bank.textColor} shadow-sm`}>
                {bank.logo}
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-800">{bank.name}</p>
                <Link href={`/catalogue/bank/${bank.id}`} className="text-[10px] font-bold text-[#3EA63B] hover:underline">
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
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
        </p>

        {/* Products List */}
        {filteredProducts.length === 0 ? (
          <div className="space-y-4">
            <EmptyState
              icon={Landmark}
              title="No products found"
              description="Try clearing filters or searching by provider, product type, or use case."
            />
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setActiveFilter('all');
                  setSelectedInstitution(null);
                  setDigitalOnly(false);
                  setInterestFreeOnly(false);
                  setAudienceFilter('');
                }}
                className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black text-white shadow-sm hover:bg-slate-800"
              >
                Clear filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-12">
            {filteredProducts.map((product: any) => {
              const bank = getBankById(product.bankId || product.instituteId || product.providerId);
              const displayBank = product.provider ? {
                  color: product.provider.brandColor || bank?.color,
                  textColor: 'text-white',
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
      </div>
    </AppPageShell>
  );
}
