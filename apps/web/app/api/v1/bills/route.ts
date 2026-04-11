import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const billSchema = z.object({
    name: z.string().min(1),
    amount: z.number().min(0),
    dueDay: z.number().min(1).max(31),
    category: z.string(),
    isPaid: z.boolean().optional(),
});

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bills = await prisma.bill.findMany({
            where: { userId: user.id },
            orderBy: { dueDay: 'asc' }
        });

        return NextResponse.json(bills);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = billSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        if (!result.data.name || result.data.amount === undefined || !result.data.dueDay) {
            return NextResponse.json({ error: 'Name, amount, and dueDay are required' }, { status: 400 });
        }

        const bill = await prisma.bill.create({
            data: {
                ...result.data,
                userId: user.id,
                amount: result.data.amount,
                dueDay: result.data.dueDay,
            }
        });

        return NextResponse.json(bill, { status: 201 });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { id, ...rest } = body;

        if (!id) {
            return NextResponse.json({ error: 'Missing bill ID' }, { status: 400 });
        }

        const result = billSchema.safeParse(rest);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const bill = await prisma.bill.update({
            where: { id, userId: user.id },
            data: result.data
        });

        return NextResponse.json(bill);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'Missing bill ID' }, { status: 400 });
        }

        await prisma.bill.delete({
            where: { id, userId: user.id }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
