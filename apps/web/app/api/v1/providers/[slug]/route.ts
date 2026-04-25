import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        const { slug: identifier } = await params;

        const provider = await prisma.provider.findFirst({
            where: {
                OR: [
                    { id: identifier },
                    { slug: identifier }
                ]
            },
            include: {
                products: {
                    where: { isActive: true },
                    orderBy: { isFeatured: 'desc' }
                },
                _count: {
                    select: { products: true }
                }
            }
        });

        if (!provider) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        return NextResponse.json(provider);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
