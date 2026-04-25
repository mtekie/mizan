import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const linkSchema = z.object({
    providerId: z.string(),
    accountType: z.string(),
    accountNumber: z.string().optional(),
    verificationTier: z.enum(['SELF_DECLARED', 'DOCUMENT_VERIFIED', 'INSTITUTION_VERIFIED']).default('SELF_DECLARED')
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = linkSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const link = await prisma.accountLink.upsert({
            where: {
                userId_providerId_accountType: {
                    userId: user.id,
                    providerId: result.data.providerId,
                    accountType: result.data.accountType
                }
            },
            update: {
                accountNumber: result.data.accountNumber,
                verificationTier: result.data.verificationTier,
                isVerified: result.data.verificationTier !== 'SELF_DECLARED'
            },
            create: {
                userId: user.id,
                ...result.data,
                isVerified: result.data.verificationTier !== 'SELF_DECLARED'
            }
        });

        return NextResponse.json(link);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function GET(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const links = await prisma.accountLink.findMany({
            where: { userId: user.id },
            include: { provider: true }
        });

        return NextResponse.json(links);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
