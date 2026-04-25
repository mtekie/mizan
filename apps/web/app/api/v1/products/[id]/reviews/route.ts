import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const reviewSchema = z.object({
    rating: z.number().min(1).max(5),
    body: z.string().optional(),
    comment: z.string().optional()
});

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const reviews = await prisma.productReview.findMany({
            where: { productId: id },
            include: { user: { select: { name: true, image: true } } },
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(reviews);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const user = await getAuthUser(req);

        if (!user) {
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
                body: result.data.body ?? result.data.comment
            },
            create: {
                userId: user.id,
                productId: id,
                rating: result.data.rating,
                body: result.data.body ?? result.data.comment
            }
        });

        return NextResponse.json(review);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
