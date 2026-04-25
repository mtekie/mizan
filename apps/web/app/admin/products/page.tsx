import prisma from '@/lib/db';
import { ProductsClient } from './ProductsClient';

export default async function AdminProductsPage() {
  const [products, providers, productTypes, tags] = await Promise.all([
    prisma.product.findMany({
      include: {
        provider: {
          select: {
            id: true,
            slug: true,
            name: true,
            shortCode: true,
          },
        },
        tags: {
          include: {
            tag: true,
          },
        },
      },
      orderBy: [{ isFeatured: 'desc' }, { updatedAt: 'desc' }],
      take: 250,
    }),
    prisma.provider.findMany({
      where: { isActive: true },
      select: {
        id: true,
        slug: true,
        name: true,
        shortCode: true,
      },
      orderBy: { name: 'asc' },
    }),
    prisma.productTypeDefinition.findMany({
      where: { isActive: true },
      select: {
        slug: true,
        label: true,
        productClass: true,
      },
      orderBy: [{ productClass: 'asc' }, { sortOrder: 'asc' }, { label: 'asc' }],
    }),
    prisma.tagDefinition.findMany({
      select: {
        id: true,
        slug: true,
        label: true,
        category: true,
      },
      orderBy: [{ category: 'asc' }, { label: 'asc' }],
    }),
  ]);

  return (
    <ProductsClient
      products={products}
      providers={providers}
      productTypes={productTypes}
      tags={tags}
    />
  );
}
