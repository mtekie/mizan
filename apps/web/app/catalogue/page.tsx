'use client';

import { useState, useEffect, useMemo } from 'react';
import { SimpleCatalogue } from '@/components/SimpleCatalogue';

const categories = [
  { key: 'All', label: 'All', icon: null, color: 'bg-[#3EA63B]', textColor: 'text-white' },
  { key: 'Banks', label: 'Banks', icon: null, color: 'bg-indigo-100', textColor: 'text-indigo-700' },
  { key: 'Insurance', label: 'Insurance', icon: null, color: 'bg-purple-100', textColor: 'text-purple-700' },
  { key: 'BNPL', label: 'BNPL', icon: null, color: 'bg-orange-100', textColor: 'text-orange-700' },
  { key: 'MFIs', label: 'MFIs', icon: null, color: 'bg-teal-100', textColor: 'text-teal-700' },
  { key: 'SACCOs', label: 'SACCOs', icon: null, color: 'bg-amber-100', textColor: 'text-amber-700' },
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

  return <SimpleCatalogue products={products} categories={categories} />;
}
