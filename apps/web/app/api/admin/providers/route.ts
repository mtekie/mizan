import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

const providerTypes = ['BANK', 'MFI', 'INSURANCE', 'WALLET', 'SACCO', 'BROKER', 'BNPL_MERCHANT', 'GOVERNMENT'] as const;

const providerSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9-]+$/),
  name: z.string().trim().min(2).max(180),
  nameAmh: z.string().trim().max(180).optional().or(z.literal('')),
  shortCode: z.string().trim().max(24).optional().or(z.literal('')),
  type: z.enum(providerTypes),
  tier: z.string().trim().max(40).optional().or(z.literal('')),
  logoUrl: z.string().trim().max(500).optional().or(z.literal('')),
  iconUrl: z.string().trim().max(500).optional().or(z.literal('')),
  brandColor: z.string().trim().max(32).optional().or(z.literal('')),
  brandColorBg: z.string().trim().max(32).optional().or(z.literal('')),
  description: z.string().trim().max(1000).optional().or(z.literal('')),
  founded: z.coerce.number().int().positive().optional().nullable(),
  headquarters: z.string().trim().max(120).optional().or(z.literal('')),
  region: z.string().trim().max(120).optional().or(z.literal('')),
  website: z.string().trim().max(500).optional().or(z.literal('')),
  appStoreUrl: z.string().trim().max(500).optional().or(z.literal('')),
  playStoreUrl: z.string().trim().max(500).optional().or(z.literal('')),
  branches: z.coerce.number().int().nonnegative().optional().nullable(),
  branchNetwork: z.record(z.string(), z.union([z.number(), z.string()])).optional().nullable(),
  isDigital: z.coerce.boolean().default(false),
  esxListed: z.coerce.boolean().default(false),
  esxSymbol: z.string().trim().max(24).optional().or(z.literal('')),
  isVerified: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
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

function optionalString(value: string | undefined | null) {
  return value && value.length > 0 ? value : null;
}

function providerPayload(data: z.infer<typeof providerSchema>) {
  return {
    slug: data.slug,
    name: data.name,
    nameAmh: optionalString(data.nameAmh),
    shortCode: optionalString(data.shortCode),
    type: data.type,
    tier: optionalString(data.tier),
    logoUrl: optionalString(data.logoUrl),
    iconUrl: optionalString(data.iconUrl),
    brandColor: optionalString(data.brandColor),
    brandColorBg: optionalString(data.brandColorBg),
    description: optionalString(data.description),
    founded: data.founded || null,
    headquarters: optionalString(data.headquarters),
    region: optionalString(data.region),
    website: optionalString(data.website),
    appStoreUrl: optionalString(data.appStoreUrl),
    playStoreUrl: optionalString(data.playStoreUrl),
    branches: data.branches ?? null,
    branchNetwork: data.branchNetwork ?? undefined,
    isDigital: data.isDigital,
    esxListed: data.esxListed,
    esxSymbol: optionalString(data.esxSymbol),
    isVerified: data.isVerified,
    isActive: data.isActive,
  };
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const body = await req.json();
  const action = body.action === 'update' ? 'update' : 'create';
  const result = providerSchema.safeParse(body.data);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
  }

  if (action === 'update' && !result.data.id) {
    return NextResponse.json({ error: 'Missing provider ID' }, { status: 400 });
  }

  try {
    const data = providerPayload(result.data);
    const provider = action === 'create'
      ? await prisma.provider.create({ data })
      : await prisma.provider.update({
          where: { id: result.data.id },
          data,
        });

    return NextResponse.json(provider, { status: action === 'create' ? 201 : 200 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug must be unique.' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Failed to save provider' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing provider ID' }, { status: 400 });
  }

  try {
    await prisma.provider.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'Provider has linked products or reviews.' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Failed to delete provider' }, { status: 500 });
  }
}
