'use client';

import { useState } from 'react';
import { Search, Sparkles, ArrowRight, Building2, Shield, Smartphone, ShoppingBag, Users, Landmark, Home, Car, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';
import { SimpleCatalogue } from '@/components/SimpleCatalogue';
import { useEffect } from 'react';

const categories = [
  { key: 'All', label: 'All', icon: Sparkles, color: 'bg-[#3EA63B]', textColor: 'text-white' },
  { key: 'Banks', label: 'Banks', icon: Landmark, color: 'bg-indigo-100', textColor: 'text-indigo-700' },
  { key: 'Insurance', label: 'Insurance', icon: Shield, color: 'bg-purple-100', textColor: 'text-purple-700' },
  { key: 'BNPL', label: 'BNPL', icon: ShoppingBag, color: 'bg-orange-100', textColor: 'text-orange-700' },
  { key: 'MFIs', label: 'MFIs', icon: Building2, color: 'bg-teal-100', textColor: 'text-teal-700' },
  { key: 'SACCOs', label: 'SACCOs', icon: Users, color: 'bg-amber-100', textColor: 'text-amber-700' },
] as const;

export default function Catalogue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [productType, setProductType] = useState<string>('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeFilter !== 'All') params.append('category', activeFilter);
    if (productType !== 'All') params.append('type', productType);
    if (searchQuery) params.append('search', searchQuery);

    fetch(`/api/v1/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [activeFilter, productType, searchQuery]);

  // Get top featured products from the fetched list
  const featuredProducts = products
    .filter(p => (p.matchScore && p.matchScore > 85))
    .slice(0, 6);

  // Unique institutions from fetched products
  const institutions = [...new Set(products.map(p => p.bankId || p.instituteId))].filter(Boolean);
  const uiMode = useStore(s => s.uiMode);

  if (uiMode === 'simple') {
    return <SimpleCatalogue products={featuredProducts} categories={categories} />;
  }

  return (
    <div className="flex flex-col min-h-full bg-slate-50 md:bg-transparent">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-100 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">Financial Directory</h1>
              <p className="text-sm text-slate-500">{products.length} products found</p>
            </div>
          </div>
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search banks, insurance, loans, savings..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#3EA63B]/30 focus:border-[#3EA63B]"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-6 pb-24 md:pb-6 max-w-7xl mx-auto w-full">
        {/* Category Cards Grid */}
        <section className="mb-8">
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map(cat => {
              const Icon = cat.icon;
              const isActive = activeFilter === cat.key;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveFilter(cat.key)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all text-center ${isActive
                    ? 'bg-[#3EA63B] text-white border-[#3EA63B] shadow-lg shadow-[#3EA63B]/20'
                    : 'bg-white border-slate-100 text-slate-700 hover:border-[#3EA63B]/30 hover:shadow-sm'
                    }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-white/20' : cat.color
                    }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-white' : cat.textColor}`} />
                  </div>
                  <span className="text-xs font-bold">{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Product Type Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm inline-flex">
            {['All', 'Savings', 'Loan'].map(pt => (
              <button
                key={pt}
                onClick={() => setProductType(pt)}
                className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${productType === pt
                  ? 'bg-[#0F172A] text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                  }`}
              >
                {pt === 'All' ? 'All Types' : pt}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-8">
            {/* Featured Strip (only show on 'All') */}
            {activeFilter === 'All' && !searchQuery && (
              <section className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> Top Picks for You
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {featuredProducts.map(product => (
                    <Link href={`/catalogue/${product.id}`} key={product.id} className="group">
                      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition-all h-full flex flex-col">
                        <div className="flex items-start gap-3 mb-3">
                          <div className={`w-10 h-10 rounded-xl ${product.bankIconBg || 'bg-slate-100'} flex items-center justify-center font-bold text-xs text-slate-600 shrink-0`}>
                            {product.bankLogo || 'FI'}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#3EA63B] transition-colors truncate">
                              {product.title || product.name}
                            </h3>
                            <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">{product.bankName}</p>
                          </div>
                          {product.matchScore && (
                            <span className="text-[10px] font-black text-[#3EA63B] bg-[#3EA63B]/10 px-2 py-1 rounded-full shrink-0">
                              {product.matchScore}%
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2 mb-3 flex-1">{product.description}</p>
                        <div className="flex gap-2 flex-wrap">
                          {(product.details || []).slice(0, 2).map((d: { label: string; value: string; positive?: boolean }, i: number) => (
                            <span key={i} className={`text-[10px] font-semibold px-2 py-1 rounded-md ${d.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-600'}`}>
                              {d.label}: {d.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* All Products List */}
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-black text-slate-900">
                  {productType !== 'All' ? `${productType}s in ` : ''}{activeFilter === 'All' ? 'All Products' : activeFilter}
                  <span className="text-sm font-normal text-slate-400 ml-2">({products.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {loading ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                     <div className="w-10 h-10 border-4 border-[#3EA63B]/20 border-t-[#3EA63B] rounded-full animate-spin"></div>
                     <p className="font-bold">Fetching latest products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 text-slate-400">
                     <Landmark className="w-12 h-12" />
                     <p className="font-bold">No products found for this filter.</p>
                  </div>
                ) : products.map(product => (
                  <Link href={`/catalogue/${product.id}`} key={product.id} className="group">
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 hover:shadow-md transition-all flex items-start gap-4 h-full">
                      <div className={`w-12 h-12 rounded-xl ${product.bankIconBg || 'bg-slate-100'} flex items-center justify-center font-bold text-sm text-slate-600 shrink-0`}>
                        {product.bankLogo || 'FI'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-sm text-slate-900 group-hover:text-[#3EA63B] transition-colors leading-tight mb-1">
                          {product.title || product.name}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-2">{product.bankName}</p>
                        <div className="flex gap-2 flex-wrap">
                          {(product.details || []).slice(0, 2).map((d: { label: string; value: string; positive?: boolean }, i: number) => (
                            <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded ${d.positive ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-50 text-slate-500'}`}>
                              {d.value}
                            </span>
                          ))}
                          {product.category && product.category !== 'Banks' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">{product.category}</span>
                          )}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 mt-1 group-hover:text-[#3EA63B] transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
              {products.length > 30 && (
                <p className="text-center text-sm text-slate-400 mt-4 font-semibold">
                  Showing top 30 of {products.length} products
                </p>
              )}
            </section>
          </div>

          {/* Sidebar — Institutions */}
          <aside className="lg:col-span-4">
            <div className="sticky top-28">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider mb-4">Institutions ({institutions.length})</h3>
              <div className="space-y-2 max-h-[calc(100vh-200px)] overflow-y-auto hide-scrollbar">
                {institutions.slice(0, 20).map(bankId => {
                  if (!bankId) return null;
                  const bankProds = products.filter(p => (p.bankId === bankId || p.instituteId === bankId));
                  const rep = bankProds[0];
                  return (
                    <Link href={`/catalogue/bank/${bankId}`} key={bankId} className="block group">
                      <div className="bg-white rounded-xl border border-slate-100 p-3 flex items-center gap-3 hover:shadow-sm transition-all">
                        <div className={`w-10 h-10 rounded-lg ${rep?.bankIconBg || 'bg-slate-200'} flex items-center justify-center font-bold text-xs shrink-0`}>
                          {rep?.bankLogo || 'FI'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-slate-900 truncate group-hover:text-[#3EA63B] transition-colors">
                            {rep?.bankName || bankId}
                          </h4>
                          <p className="text-[10px] text-slate-400 font-semibold">
                            {bankProds.length} product{bankProds.length > 1 ? 's' : ''}
                          </p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Quick Links */}
              <div className="mt-6 space-y-2">
                <Link href="/wealth" className="flex items-center gap-3 p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl border border-purple-100 hover:shadow-sm transition-all group">
                  <Home className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <span className="text-sm font-bold text-purple-900">Real Estate</span>
                    <p className="text-[10px] text-purple-400 font-semibold">8 listings in Addis</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link href="/wealth" className="flex items-center gap-3 p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-100 hover:shadow-sm transition-all group">
                  <Car className="w-5 h-5 text-amber-600" />
                  <div className="flex-1">
                    <span className="text-sm font-bold text-amber-900">Vehicles</span>
                    <p className="text-[10px] text-amber-400 font-semibold">6 cars listed</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
