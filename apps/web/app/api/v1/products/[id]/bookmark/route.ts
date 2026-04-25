import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bookmark = await prisma.productBookmark.upsert({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: id
                }
            },
            update: {},
            create: {
                userId: user.id,
                productId: id
            }
        });

        return NextResponse.json(bookmark);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.productBookmark.delete({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: id
                }
            }
        });

        return NextResponse.json({ success: true });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
