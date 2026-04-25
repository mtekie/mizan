'use client';

import { useEffect, useState } from 'react';
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
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/products?take=100')
      .then(res => res.json())
      .then(data => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return <SimpleCatalogue products={products} categories={categories} loading={loading} />;
}
