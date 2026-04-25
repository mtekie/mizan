import prisma from '@/lib/db';
import { ModerationClient } from './ModerationClient';

export default async function AdminModerationPage() {
  const [productReviews, providerReviews, accountLinks] = await Promise.all([
    prisma.productReview.findMany({
      include: {
        user: { select: { name: true, email: true } },
        product: { select: { name: true, title: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.providerReview.findMany({
      include: {
        user: { select: { name: true, email: true } },
        provider: { select: { name: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 100,
    }),
    prisma.accountLink.findMany({
      include: {
        user: { select: { name: true, email: true } },
      },
      orderBy: { updatedAt: 'desc' },
      take: 100,
    }),
  ]);

  return (
    <ModerationClient
      productReviews={productReviews}
      providerReviews={providerReviews}
      accountLinks={accountLinks}
    />
  );
}
