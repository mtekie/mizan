import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    comment: z.string().optional()
});

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const reviews = await prisma.productReview.findMany({
            where: { productId: id },
            include: { user: { select: { fullName: true, avatarUrl: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(reviews);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

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

        const body = await req.json();
        const result = reviewSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const review = await prisma.productReview.upsert({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: id
                }
            },
            update: {
                rating: result.data.rating,
                comment: result.data.comment
            },
            create: {
                userId: user.id,
                productId: id,
                rating: result.data.rating,
                comment: result.data.comment
            }
        });

        return NextResponse.json(review);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
