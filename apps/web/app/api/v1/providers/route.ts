import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const type = searchParams.get('type');
        const tier = searchParams.get('tier');
        const esx = searchParams.get('esx') === 'true';
        const search = searchParams.get('search');

        const where: any = { isActive: true };

        if (type) where.type = type;
        if (tier) where.tier = tier;
        if (esx) where.esxListed = true;
        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { shortCode: { contains: search, mode: 'insensitive' } }
            ];
        }

        const providers = await prisma.provider.findMany({
            where,
            include: {
                _count: {
                    select: { products: true }
                }
            },
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(providers);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
