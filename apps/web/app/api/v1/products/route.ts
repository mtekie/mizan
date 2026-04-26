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
        const providerIds = searchParams.get('providerIds')?.split(',').filter(Boolean);
        const search = searchParams.get('search');
        const audience = searchParams.get('audience');
        const tags = searchParams.get('tags')?.split(',').filter(Boolean);
        const digitalOnly = searchParams.get('digital') === 'true';
        const interestFree = searchParams.get('interestFree') === 'true';
        const scored = searchParams.get('scored') === 'true';
        const mode = searchParams.get('mode') || 'list';
        const skip = Math.max(0, parseInt(searchParams.get('skip') || '0', 10) || 0);
        const take = Math.min(100, Math.max(1, parseInt(searchParams.get('take') || '50', 10) || 50));

        const where: any = { isActive: true };

        if (productClass && productClass !== 'All' && productClass !== 'all') {
            where.productClass = productClass;
        }
        if (productType && productType !== 'All') where.productType = productType;
        if (providerIds && providerIds.length > 0) {
            where.providerId = { in: providerIds };
        } else if (providerId) {
            where.providerId = providerId;
        }
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

        if (audience === 'student' || audience === 'salaried') {
            const terms = audience === 'student'
                ? ['student', 'education', 'teen', 'youth']
                : ['salary', 'salaried', 'employee', 'payroll'];
            const audienceOr = terms.flatMap((term) => [
                { name: { contains: term, mode: 'insensitive' } },
                { title: { contains: term, mode: 'insensitive' } },
                { description: { contains: term, mode: 'insensitive' } },
            ]);

            where.AND = [
                ...(where.AND || []),
                { OR: audienceOr }
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

        const productsQuery = mode === 'list'
            ? prisma.product.findMany({
                where,
                select: {
                    id: true,
                    slug: true,
                    name: true,
                    title: true,
                    bankName: true,
                    bankLogo: true,
                    productClass: true,
                    productType: true,
                    attributes: true,
                    minBalance: true,
                    maxAmount: true,
                    interestRate: true,
                    interestMax: true,
                    term: true,
                    matchScore: true,
                    isFeatured: true,
                    isVerified: true,
                    updatedAt: true,
                    currency: true,
                    digital: true,
                    interestFree: true,
                    genderBased: true,
                    sourceName: true,
                    sourceUrl: true,
                    sourceType: true,
                    lastReviewedAt: true,
                    reviewedBy: true,
                    dataConfidence: true,
                    features: true,
                    eligibility: true,
                    requirements: true,
                    description: true,
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true,
                            brandColor: true,
                            shortCode: true
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
        ;

        const [total, products] = await Promise.all([
            prisma.product.count({ where }),
            productsQuery
        ]);

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
