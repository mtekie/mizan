import prisma from '@/lib/db';
import { TaxonomyClient } from './TaxonomyClient';

export default async function AdminTaxonomyPage() {
  const [productTypes, tags] = await Promise.all([
    prisma.productTypeDefinition.findMany({
      orderBy: [{ productClass: 'asc' }, { sortOrder: 'asc' }, { label: 'asc' }],
    }),
    prisma.tagDefinition.findMany({
      include: {
        _count: {
          select: { productTags: true },
        },
      },
      orderBy: [{ category: 'asc' }, { label: 'asc' }],
    }),
  ]);

  return <TaxonomyClient productTypes={productTypes} tags={tags} />;
}
