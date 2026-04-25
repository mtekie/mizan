import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/admin/auth';

const moderationSchema = z.discriminatedUnion('kind', [
  z.object({
    kind: z.literal('productReview'),
    action: z.enum(['verify', 'unverify', 'delete']),
    id: z.string(),
  }),
  z.object({
    kind: z.literal('providerReview'),
    action: z.literal('delete'),
    id: z.string(),
  }),
  z.object({
    kind: z.literal('accountLink'),
    action: z.enum(['verify', 'reset']),
    id: z.string(),
  }),
]);

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const body = await req.json();
  const result = moderationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
  }

  try {
    const { kind, action, id } = result.data;

    if (kind === 'productReview') {
      if (action === 'delete') {
        await prisma.productReview.delete({ where: { id } });
        return NextResponse.json({ success: true });
      }

      const review = await prisma.productReview.update({
        where: { id },
        data: { isVerified: action === 'verify' },
      });
      return NextResponse.json(review);
    }

    if (kind === 'providerReview') {
      await prisma.providerReview.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    const link = await prisma.accountLink.update({
      where: { id },
      data: action === 'verify'
        ? { level: 'PHOTO_VERIFIED', verifiedAt: new Date(), verifiedBy: admin.dbUser.id }
        : { level: 'SELF_DECLARED', verifiedAt: null, verifiedBy: null },
    });

    return NextResponse.json(link);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Moderation action failed' }, { status: 500 });
  }
}
