import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
    try {
        // Calculate leaderboard based on reviews and applications
        const [providers, productCounts, staleProducts, productSources] = await Promise.all([
            prisma.provider.findMany({
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
            }),
            prisma.product.groupBy({
                by: ['isActive', 'isVerified'],
                _count: { _all: true },
            }),
            prisma.product.count({
                where: {
                    updatedAt: {
                        lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
            prisma.product.findMany({
                select: {
                    attributes: true,
                    sourceName: true,
                    sourceUrl: true,
                },
            }),
        ]);

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

        const totalProducts = productCounts.reduce((sum, row) => sum + row._count._all, 0);
        const activeProducts = productCounts
            .filter((row) => row.isActive)
            .reduce((sum, row) => sum + row._count._all, 0);
        const unverifiedProducts = productCounts
            .filter((row) => !row.isVerified)
            .reduce((sum, row) => sum + row._count._all, 0);
        const missingSourceProducts = productSources.filter((product) => {
            const attributes = product.attributes as { source?: string; sourceSheet?: string; sourceUrl?: string } | null;
            return !product.sourceName && !product.sourceUrl && !attributes?.source && !attributes?.sourceSheet && !attributes?.sourceUrl;
        }).length;

        return NextResponse.json({
            stats: {
                totalProducts,
                activeProducts,
                totalProviders: providers.length,
                unverifiedProducts,
                staleProducts,
                missingSourceProducts,
            },
            leaderboard: leaderboard.slice(0, 10),
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
