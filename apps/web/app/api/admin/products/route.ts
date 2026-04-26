import { NextResponse } from 'next/server';
import { z } from 'zod';
import { Prisma } from '@prisma/client';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

const productClasses = ['SAVINGS', 'CREDIT', 'INSURANCE', 'PAYMENT', 'CAPITAL_MARKET', 'COMMUNITY'] as const;

const productSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(120).regex(/^[a-z0-9-]+$/).optional().or(z.literal('')),
  providerId: z.string().optional().nullable().or(z.literal('')),
  productClass: z.enum(productClasses).optional().nullable().or(z.literal('')),
  productType: z.string().trim().max(100).optional().nullable().or(z.literal('')),
  name: z.string().trim().max(180).optional().nullable().or(z.literal('')),
  nameAmh: z.string().trim().max(180).optional().nullable().or(z.literal('')),
  title: z.string().trim().max(180).optional().nullable().or(z.literal('')),
  description: z.string().trim().max(2000).default(''),
  highlight: z.string().trim().max(180).optional().nullable().or(z.literal('')),
  category: z.string().trim().max(80).optional().nullable().or(z.literal('')),
  loanCategory: z.string().trim().max(120).optional().nullable().or(z.literal('')),
  matchScore: z.coerce.number().int().min(0).max(100).optional().nullable(),
  interestRate: z.coerce.number().optional().nullable(),
  interestMax: z.coerce.number().optional().nullable(),
  maxAmount: z.coerce.number().optional().nullable(),
  minBalance: z.coerce.number().optional().nullable(),
  term: z.string().trim().max(120).optional().nullable().or(z.literal('')),
  fees: z.string().trim().max(240).optional().nullable().or(z.literal('')),
  currency: z.string().trim().max(12).optional().nullable().or(z.literal('')),
  repaymentFrequency: z.string().trim().max(120).optional().nullable().or(z.literal('')),
  disbursementTime: z.string().trim().max(120).optional().nullable().or(z.literal('')),
  collateralRequirements: z.string().trim().max(500).optional().nullable().or(z.literal('')),
  prepaymentPenalties: z.string().trim().max(500).optional().nullable().or(z.literal('')),
  latePaymentPenalties: z.string().trim().max(500).optional().nullable().or(z.literal('')),
  insuranceRequirements: z.string().trim().max(500).optional().nullable().or(z.literal('')),
  sourceName: z.string().trim().max(240).optional().nullable().or(z.literal('')),
  sourceUrl: z.string().trim().url().optional().nullable().or(z.literal('')),
  sourceType: z.string().trim().max(80).optional().nullable().or(z.literal('')),
  lastReviewedAt: z.string().optional().nullable().or(z.literal('')),
  reviewedBy: z.string().trim().max(120).optional().nullable().or(z.literal('')),
  dataConfidence: z.coerce.number().int().min(0).max(100).optional().nullable(),
  features: z.array(z.string().trim().min(1)).default([]),
  eligibility: z.array(z.string().trim().min(1)).default([]),
  requirements: z.array(z.string().trim().min(1)).default([]),
  attributes: z.record(z.string(), z.unknown()).optional().nullable(),
  tagIds: z.array(z.string()).default([]),
  isActive: z.coerce.boolean().default(true),
  isFeatured: z.coerce.boolean().default(false),
  isVerified: z.coerce.boolean().default(true),
  digital: z.coerce.boolean().optional().nullable(),
  interestFree: z.coerce.boolean().optional().nullable(),
  genderBased: z.coerce.boolean().optional().nullable(),
});

async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) };
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { role: true },
  });

  if (dbUser?.role !== 'ADMIN') {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) };
  }

  return { user };
}

function optionalString(value: string | null | undefined) {
  return value && value.length > 0 ? value : null;
}

function productPayload(data: z.infer<typeof productSchema>) {
  return {
    slug: optionalString(data.slug),
    providerId: optionalString(data.providerId),
    productClass: optionalString(data.productClass),
    productType: optionalString(data.productType),
    name: optionalString(data.name),
    nameAmh: optionalString(data.nameAmh),
    title: optionalString(data.title),
    description: data.description || '',
    highlight: optionalString(data.highlight),
    category: optionalString(data.category),
    loanCategory: optionalString(data.loanCategory),
    matchScore: data.matchScore ?? null,
    interestRate: data.interestRate ?? null,
    interestMax: data.interestMax ?? null,
    maxAmount: data.maxAmount ?? null,
    minBalance: data.minBalance ?? null,
    term: optionalString(data.term),
    fees: optionalString(data.fees),
    currency: optionalString(data.currency) || 'ETB',
    repaymentFrequency: optionalString(data.repaymentFrequency),
    disbursementTime: optionalString(data.disbursementTime),
    collateralRequirements: optionalString(data.collateralRequirements),
    prepaymentPenalties: optionalString(data.prepaymentPenalties),
    latePaymentPenalties: optionalString(data.latePaymentPenalties),
    insuranceRequirements: optionalString(data.insuranceRequirements),
    sourceName: optionalString(data.sourceName),
    sourceUrl: optionalString(data.sourceUrl),
    sourceType: optionalString(data.sourceType),
    lastReviewedAt: data.lastReviewedAt ? new Date(data.lastReviewedAt) : null,
    reviewedBy: optionalString(data.reviewedBy),
    dataConfidence: data.dataConfidence ?? null,
    features: data.features,
    eligibility: data.eligibility,
    requirements: data.requirements,
    attributes: data.attributes ? data.attributes as Prisma.InputJsonValue : undefined,
    isActive: data.isActive,
    isFeatured: data.isFeatured,
    isVerified: data.isVerified,
    digital: data.digital ?? false,
    interestFree: data.interestFree ?? false,
    genderBased: data.genderBased ?? false,
  };
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const body = await req.json();
  const action = body.action === 'update' ? 'update' : 'create';
  const result = productSchema.safeParse(body.data);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
  }

  if (action === 'update' && !result.data.id) {
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
  }

  try {
    const data = productPayload(result.data);
    const tagIds = [...new Set(result.data.tagIds)];

    const product = await prisma.$transaction(async (tx) => {
      const saved = action === 'create'
        ? await tx.product.create({ data })
        : await tx.product.update({
            where: { id: result.data.id },
            data,
          });

      await tx.productTag.deleteMany({ where: { productId: saved.id } });

      if (tagIds.length > 0) {
        await tx.productTag.createMany({
          data: tagIds.map((tagId) => ({ productId: saved.id, tagId })),
          skipDuplicates: true,
        });
      }

      return tx.product.findUnique({
        where: { id: saved.id },
        include: { provider: true, tags: { include: { tag: true } } },
      });
    });

    return NextResponse.json(product, { status: action === 'create' ? 201 : 200 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug must be unique.' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Failed to save product' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing product ID' }, { status: 400 });
  }

  try {
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Product has linked activity and cannot be deleted.' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Failed to delete product' }, { status: 500 });
  }
}
