import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        // Calculate leaderboard based on reviews and applications
        const providers = await prisma.provider.findMany({
            where: { isActive: true },
            include: {
                _count: {
                    select: {
                        products: true,
                        reviews: true,
                    }
                },
                reviews: {
                    select: { rating: true }
                }
            }
        });

        const leaderboard = providers.map(p => {
            const avgRating = p.reviews.length > 0 
                ? p.reviews.reduce((acc, r) => acc + r.rating, 0) / p.reviews.length 
                : 0;
            
            return {
                id: p.id,
                name: p.name,
                slug: p.slug,
                logoUrl: p.logoUrl,
                brandColor: p.brandColor,
                productCount: p._count.products,
                reviewCount: p._count.reviews,
                avgRating: Math.round(avgRating * 10) / 10,
                score: (avgRating * 20) + (p._count.products * 2) // Simple popularity score
            };
        }).sort((a, b) => b.score - a.score);

        return NextResponse.json(leaderboard.slice(0, 10));
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
