import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';

export async function GET(req: Request) {
    try {
        const authUser = await getAuthUser(req);
        let user: any = null;
        if (authUser) {
            user = await prisma.user.findUnique({ where: { id: authUser.id } });
        }

        const [products, providers, productTypes, featured] = await Promise.all([
            // Initial products (mode=list for speed)
            prisma.product.findMany({
                where: { isActive: true },
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
                    provider: {
                        select: {
                            id: true,
                            name: true,
                            logoUrl: true
                        }
                    }
                },
                take: 20,
                orderBy: [
                    { isFeatured: 'desc' },
                    { matchScore: 'desc' },
                ]
            }),
            // Providers with counts
            prisma.provider.findMany({
                where: { isActive: true },
                select: {
                    id: true,
                    name: true,
                    logoUrl: true,
                    _count: {
                        select: { products: { where: { isActive: true } } }
                    }
                },
                orderBy: { name: 'asc' }
            }),
            // Distinct product classes/types
            prisma.product.groupBy({
                by: ['productClass'],
                where: { isActive: true },
                _count: { _all: true }
            }),
            // Featured products specifically
            prisma.product.findMany({
                where: { isActive: true, isFeatured: true },
                take: 5,
                select: {
                    id: true,
                    name: true,
                    title: true,
                    bankName: true,
                    matchScore: true
                }
            })
        ]);

        return NextResponse.json({
            products,
            providers: providers.map(p => ({
                ...p,
                productCount: p._count.products
            })),
            categories: productTypes.map(c => ({
                id: c.productClass,
                label: c.productClass,
                count: c._count._all
            })),
            featured,
            profile: user ? {
                id: user.id,
                fullName: user.fullName,
                isComplete: !!(user.gender && user.employmentStatus && user.monthlyIncomeRange)
            } : null
        });
    } catch (e: any) {
        console.error('Catalogue Bootstrap API Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
