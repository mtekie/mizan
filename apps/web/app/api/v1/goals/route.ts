import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const goalSchema = z.object({
    name: z.string().min(1),
    emoji: z.string().optional(),
    target: z.number().positive(),
    deadline: z.string().or(z.date()).nullable().optional(),
    saved: z.number().min(0).optional(),
});

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const goals = await prisma.goal.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(goals);
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
        const result = goalSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const goal = await prisma.goal.create({
            data: {
                ...result.data,
                userId: user.id,
                deadline: result.data.deadline ? new Date(result.data.deadline) : null,
                target: result.data.target || 0,
            }
        });

        return NextResponse.json(goal, { status: 201 });
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
            return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 });
        }

        const result = goalSchema.safeParse(rest);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const goal = await prisma.goal.update({
            where: { id, userId: user.id },
            data: {
                ...result.data,
                deadline: result.data.deadline ? new Date(result.data.deadline) : result.data.deadline === null ? null : undefined,
            }
        });

        return NextResponse.json(goal);
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
            return NextResponse.json({ error: 'Missing goal ID' }, { status: 400 });
        }

        await prisma.goal.delete({
            where: { id, userId: user.id }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
