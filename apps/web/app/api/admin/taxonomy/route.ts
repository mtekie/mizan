import { NextResponse } from 'next/server';
import { z } from 'zod';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

const productClassValues = ['SAVINGS', 'CREDIT', 'INSURANCE', 'PAYMENT', 'CAPITAL_MARKET', 'COMMUNITY'] as const;
const tagCategoryValues = ['AUDIENCE', 'SECTOR', 'FEATURE', 'COMPLIANCE', 'ACCESS_REQUIREMENT', 'COLLATERAL_TYPE'] as const;

const productTypeSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9_/-]+$/),
  label: z.string().trim().min(2).max(120),
  labelAmh: z.string().trim().max(120).optional().or(z.literal('')),
  productClass: z.enum(productClassValues),
  icon: z.string().trim().max(32).optional().or(z.literal('')),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  sortOrder: z.coerce.number().int().default(0),
  isActive: z.coerce.boolean().default(true),
});

const tagSchema = z.object({
  id: z.string().optional(),
  slug: z.string().trim().min(2).max(80).regex(/^[a-z0-9_/-]+$/),
  label: z.string().trim().min(2).max(120),
  labelAmh: z.string().trim().max(120).optional().or(z.literal('')),
  category: z.enum(tagCategoryValues),
  icon: z.string().trim().max(32).optional().or(z.literal('')),
  description: z.string().trim().max(500).optional().or(z.literal('')),
  profileField: z.string().trim().max(80).optional().or(z.literal('')),
  profileValue: z.string().trim().max(120).optional().or(z.literal('')),
});

const mutationSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('productType'), action: z.enum(['create', 'update']), data: productTypeSchema }),
  z.object({ kind: z.literal('tag'), action: z.enum(['create', 'update']), data: tagSchema }),
]);

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

function optionalString(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const body = await req.json();
  const result = mutationSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
  }

  const { kind, action, data } = result.data;

  try {
    if (kind === 'productType') {
      if (action === 'update' && !data.id) {
        return NextResponse.json({ error: 'Missing product type ID' }, { status: 400 });
      }

      const payload = {
        slug: data.slug,
        label: data.label,
        labelAmh: optionalString(data.labelAmh),
        productClass: data.productClass,
        icon: optionalString(data.icon),
        description: optionalString(data.description),
        sortOrder: data.sortOrder,
        isActive: data.isActive,
      };

      const productType = action === 'create'
        ? await prisma.productTypeDefinition.create({ data: payload })
        : await prisma.productTypeDefinition.update({
            where: { id: data.id },
            data: payload,
          });

      return NextResponse.json(productType, { status: action === 'create' ? 201 : 200 });
    }

    if (action === 'update' && !data.id) {
      return NextResponse.json({ error: 'Missing tag ID' }, { status: 400 });
    }

    const payload = {
      slug: data.slug,
      label: data.label,
      labelAmh: optionalString(data.labelAmh),
      category: data.category,
      icon: optionalString(data.icon),
      description: optionalString(data.description),
      profileField: optionalString(data.profileField),
      profileValue: optionalString(data.profileValue),
    };

    const tag = action === 'create'
      ? await prisma.tagDefinition.create({ data: payload })
      : await prisma.tagDefinition.update({
          where: { id: data.id },
          data: payload,
        });

    return NextResponse.json(tag, { status: action === 'create' ? 201 : 200 });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug must be unique.' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Failed to save taxonomy item' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const { searchParams } = new URL(req.url);
  const kind = searchParams.get('kind');
  const id = searchParams.get('id');

  if (!id || (kind !== 'productType' && kind !== 'tag')) {
    return NextResponse.json({ error: 'Missing taxonomy item' }, { status: 400 });
  }

  try {
    if (kind === 'productType') {
      await prisma.productTypeDefinition.delete({ where: { id } });
    } else {
      await prisma.tagDefinition.delete({ where: { id } });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (error.code === 'P2003') {
      return NextResponse.json({ error: 'This item is still in use and cannot be deleted.' }, { status: 409 });
    }

    return NextResponse.json({ error: error.message || 'Failed to delete taxonomy item' }, { status: 500 });
  }
}
