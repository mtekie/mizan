import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const linkSchema = z.object({
    providerId: z.string().optional(),
    productId: z.string().optional(),
    accountNumber: z.string().optional(),
    level: z.enum(['SELF_DECLARED', 'ACCOUNT_LINKED', 'PHOTO_VERIFIED']).default('SELF_DECLARED')
});

export async function POST(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = linkSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const existing = await prisma.accountLink.findFirst({
            where: {
                userId: user.id,
                providerId: result.data.providerId,
                productId: result.data.productId
            }
        });

        const link = existing
            ? await prisma.accountLink.update({
                where: { id: existing.id },
                data: {
                    accountNumber: result.data.accountNumber,
                    level: result.data.level,
                    verifiedAt: result.data.level === 'SELF_DECLARED' ? null : new Date(),
                    verifiedBy: result.data.level === 'SELF_DECLARED' ? null : 'SYSTEM'
                }
            })
            : await prisma.accountLink.create({
                data: {
                    userId: user.id,
                    providerId: result.data.providerId,
                    productId: result.data.productId,
                    accountNumber: result.data.accountNumber,
                    level: result.data.level,
                    verifiedAt: result.data.level === 'SELF_DECLARED' ? null : new Date(),
                    verifiedBy: result.data.level === 'SELF_DECLARED' ? null : 'SYSTEM'
                }
            });

        return NextResponse.json(link);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const links = await prisma.accountLink.findMany({
            where: { userId: user.id },
            orderBy: { updatedAt: 'desc' }
        });

        return NextResponse.json(links);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
