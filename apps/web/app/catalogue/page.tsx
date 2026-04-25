'use client';

import { useState, useEffect, useMemo } from 'react';
import { SimpleCatalogue } from '@/components/SimpleCatalogue';

const categories = [
  { key: 'all', label: 'All', icon: '✨' },
  { key: 'SAVINGS', label: 'Savings', icon: '💰' },
  { key: 'CREDIT', label: 'Loans', icon: '🏦' },
  { key: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { key: 'PAYMENT', label: 'Payments', icon: '📱' },
  { key: 'COMMUNITY', label: 'Community', icon: '🤝' },
] as const;

export default function Catalogue() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [productType, setProductType] = useState<string>('All');
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (activeFilter !== 'all') params.append('class', activeFilter);
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
