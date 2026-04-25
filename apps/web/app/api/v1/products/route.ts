import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { computeMatchScore, isProductEligibleForUser } from '@/lib/engine/matching';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productClass = searchParams.get('class');
        const productType = searchParams.get('type');
        const providerId = searchParams.get('providerId');
        const search = searchParams.get('search');
        const tags = searchParams.get('tags')?.split(',').filter(Boolean);
        const digitalOnly = searchParams.get('digital') === 'true';
        const interestFree = searchParams.get('interestFree') === 'true';
        const scored = searchParams.get('scored') === 'true';
        const mode = searchParams.get('mode') || 'detail';
        const skip = parseInt(searchParams.get('skip') || '0');
        const take = parseInt(searchParams.get('take') || '50');

        const where: any = { isActive: true };

        if (productClass && productClass !== 'All' && productClass !== 'all') {
            where.productClass = productClass;
        }
        if (productType && productType !== 'All') where.productType = productType;
        if (providerId) where.providerId = providerId;
        if (digitalOnly) where.digital = true;
        if (interestFree) where.interestFree = true;

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { bankName: { contains: search, mode: 'insensitive' } },
                { title: { contains: search, mode: 'insensitive' } },
            ];
        }

        if (tags && tags.length > 0) {
            where.tags = {
                some: {
                    tag: {
                        slug: { in: tags }
                    }
                }
            };
        }

        // Get user for scoring if requested — wrap in try/catch so it never blocks
        let user: any = null;
        if (scored) {
            try {
                const authUser = await getAuthUser(req);
                if (authUser) {
                    user = await prisma.user.findUnique({ where: { id: authUser.id } });
                }
            } catch (e) {
                // Guest or auth failure — continue without personalization
            }
        }

        const total = await prisma.product.count({ where });

        const products = await (mode === 'list' 
            ? prisma.product.findMany({
                where,
                select: {
                    id: true,
                    name: true,
                    title: true,
                    bankName: true,
                    productClass: true,
                    productType: true,
                    minBalance: true,
                    maxAmount: true,
                    interestRate: true,
                    term: true,
                    matchScore: true,
                    isFeatured: true,
                    features: true,
                    eligibility: true,
                    requirements: true,
                    description: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true
                        }
                    }
                },
                skip,
                take,
                orderBy: [
                    { isFeatured: 'desc' },
                    { matchScore: 'desc' },
                ]
            })
            : prisma.product.findMany({
                where,
                include: {
                    provider: true,
                    tags: {
                        include: { tag: true }
                    }
                },
                skip,
                take,
                orderBy: [
                    { isFeatured: 'desc' },
                    { matchScore: 'desc' },
                ]
            })
        );

        // Enrich with match scores
        const eligibleProducts = user
            ? products.filter(p => isProductEligibleForUser(user, p as any))
            : products;

        let results = eligibleProducts.map(p => {
            const score = user ? computeMatchScore(user, p as any) : (p.matchScore || 50);
            return { ...p, personalizedScore: score };
        });

        // Sort by score if user is present
        if (scored && user) {
            results.sort((a, b) => b.personalizedScore - a.personalizedScore);
        }

        return NextResponse.json({
            data: results,
            total,
            skip,
            take,
            hasMore: skip + take < total
        });
    } catch (e: any) {
        console.error('Products API Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
