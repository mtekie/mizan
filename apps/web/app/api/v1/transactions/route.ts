import { NextResponse } from 'next/server';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import prisma from '@/lib/db';
import { z } from 'zod';

const transactionSchema = z.object({
    title: z.string().min(1),
    titleAmh: z.string().optional(),
    amount: z.number(),
    source: z.string(),
    category: z.string().optional(),
    accountId: z.string().optional(), // Nullable in schema? No, but let's check
    date: z.string().or(z.date()).optional(),
});

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const transactions = await prisma.transaction.findMany({
            where: { userId: user.id },
            orderBy: { date: 'desc' }
        });

        return NextResponse.json(transactions);
    } catch (error: any) {
        console.error('Failed to fetch transactions:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = transactionSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const transaction = await prisma.transaction.create({
            data: {
                ...result.data,
                userId: user.id,
                date: result.data.date ? new Date(result.data.date) : new Date(),
            }
        });

        return NextResponse.json(transaction);
    } catch (error: any) {
        console.error('Failed to create transaction:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, ...rest } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
        }

        const result = transactionSchema.safeParse(rest);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const transaction = await prisma.transaction.update({
            where: { id, userId: user.id },
            data: {
                ...result.data,
                date: result.data.date ? new Date(result.data.date) : undefined,
            }
        });

        return NextResponse.json(transaction);
    } catch (error: any) {
        console.error('Failed to update transaction:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            // Support for bulk delete if no ID provided (might be needed for reset button elsewhere)
            // But standard approach is delete one by one or explicitly list IDs.
            return NextResponse.json({ error: 'Missing transaction ID' }, { status: 400 });
        }

        await prisma.transaction.delete({
            where: { id, userId: user.id }
        });

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('Failed to delete transaction:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
