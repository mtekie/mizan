import prisma from '@/lib/db';
import { CatalogueClient } from './CatalogueClient';
import { productCategories } from '@mizan/shared';

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
      interestMax: true,
      term: true,
      matchScore: true,
      isFeatured: true,
      isVerified: true,
      updatedAt: true,
      currency: true,
      digital: true,
      interestFree: true,
      genderBased: true,
      sourceName: true,
      sourceUrl: true,
      sourceType: true,
      lastReviewedAt: true,
      reviewedBy: true,
      dataConfidence: true,
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

  return <CatalogueClient products={products} categories={productCategories} />;
}
