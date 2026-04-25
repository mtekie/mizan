import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { computeMatchScore } from '@/lib/engine/matching';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                provider: true,
                tags: {
                    include: { tag: true }
                },
                reviews: {
                    include: { user: { select: { name: true, image: true } } },
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
            const authUser = await getAuthUser(req);

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
