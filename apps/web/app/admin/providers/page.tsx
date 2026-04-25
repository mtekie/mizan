import prisma from '@/lib/db';
import { ProvidersClient } from './ProvidersClient';

export default async function AdminProvidersPage() {
  const providers = await prisma.provider.findMany({
    include: {
      _count: {
        select: {
          products: true,
          reviews: true,
        },
      },
    },
    orderBy: [{ type: 'asc' }, { name: 'asc' }],
  });

  return <ProvidersClient providers={providers} />;
}
