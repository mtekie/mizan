import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { computeMatchScore } from '@/lib/engine/matching';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                provider: true,
                tags: {
                    include: { tag: true }
                },
                reviews: {
                    include: { user: { select: { fullName: true, avatarUrl: true } } },
                    orderBy: { createdAt: 'desc' },
                    take: 5
                },
                _count: {
                    select: {
                        bookmarks: true,
                        applications: true,
                        reviews: true
                    }
                }
            }
        });

        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        let isBookmarked = false;
        let personalizedScore = product.matchScore || 50;

        try {
            const supabase = await createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();

            if (authUser) {
                const bookmark = await prisma.productBookmark.findUnique({
                    where: {
                        userId_productId: {
                            userId: authUser.id,
                            productId: id
                        }
                    }
                });
                isBookmarked = !!bookmark;

                const user = await prisma.user.findUnique({ where: { id: authUser.id } });
                if (user) {
                    personalizedScore = computeMatchScore(user, product as any);
                }
            }
        } catch (e) {
            // Guest or auth failure — continue without personalization
        }

        return NextResponse.json({
            ...product,
            isBookmarked,
            personalizedScore
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
