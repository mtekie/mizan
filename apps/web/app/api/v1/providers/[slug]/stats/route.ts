import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;

        const provider = await prisma.provider.findUnique({
            where: { slug },
            include: {
                _count: {
                    select: {
                        products: true,
                        reviews: true,
                        applications: true,
                    }
                },
                products: {
                    select: {
                        productClass: true,
                    }
                }
            }
        });

        if (!provider) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        // Aggregate product classes
        const classes = provider.products.reduce((acc, p) => {
            acc[p.productClass] = (acc[p.productClass] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);

        return NextResponse.json({
            providerId: provider.id,
            name: provider.name,
            counts: provider._count,
            distribution: classes
        });
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
