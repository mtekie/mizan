import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const notificationSchema = z.object({
    type: z.string().optional(),
    title: z.string().min(1),
    titleAmh: z.string().optional(),
    subtitle: z.string().optional(),
    icon: z.string().optional(),
    isRead: z.boolean().optional(),
});

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(notifications);
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
        const result = notificationSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const notification = await prisma.notification.create({
            data: {
                ...result.data,
                userId: user.id,
                type: result.data.type || 'info',
            }
        });

        return NextResponse.json(notification, { status: 201 });
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
        const { id, isRead, all } = body;

        if (all) {
            await prisma.notification.updateMany({
                where: { userId: user.id },
                data: { isRead: true }
            });
            return NextResponse.json({ success: true });
        }

        if (!id) {
            return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 });
        }

        // We use updateMany to ensure userId match without needing a composite unique key
        const updateResult = await prisma.notification.updateMany({
            where: { id, userId: user.id },
            data: { isRead }
        });

        if (updateResult.count === 0) {
             return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
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
        const all = searchParams.get('all');

        if (all === 'true') {
            await prisma.notification.deleteMany({
                where: { userId: user.id }
            });
            return NextResponse.json({ success: true });
        }

        if (!id) {
            return NextResponse.json({ error: 'Missing notification ID' }, { status: 400 });
        }

        const deleteResult = await prisma.notification.deleteMany({
            where: { id, userId: user.id }
        });
        
        if (deleteResult.count === 0) {
            return NextResponse.json({ error: 'Notification not found or access denied' }, { status: 404 });
        }

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
