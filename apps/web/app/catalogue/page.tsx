import prisma from '@/lib/db';
import { CatalogueClient } from './CatalogueClient';

const categories = [
  { key: 'all', label: 'All', icon: '✨' },
  { key: 'SAVINGS', label: 'Savings', icon: '💰' },
  { key: 'CREDIT', label: 'Loans', icon: '🏦' },
  { key: 'INSURANCE', label: 'Insurance', icon: '🛡️' },
  { key: 'PAYMENT', label: 'Payments', icon: '📱' },
  { key: 'COMMUNITY', label: 'Community', icon: '🤝' },
] as const;

export default async function Catalogue() {
  const products = await prisma.product.findMany({
    where: { isActive: true },
    select: {
      id: true,
      name: true,
      title: true,
      bankName: true,
      productClass: true,
      productType: true,
      minBalance: true,
      maxAmount: true,
      interestRate: true,
      term: true,
      matchScore: true,
      isFeatured: true,
      features: true,
      eligibility: true,
      requirements: true,
      description: true,
      provider: {
        select: {
          id: true,
          name: true,
          logoUrl: true
        }
      }
    },
    take: 50,
    orderBy: [
      { isFeatured: 'desc' },
      { matchScore: 'desc' },
    ]
  });

  return <CatalogueClient products={products} categories={categories} />;
}
