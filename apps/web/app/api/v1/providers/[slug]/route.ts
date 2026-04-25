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
                products: {
                    where: { isActive: true },
                    orderBy: { isFeatured: 'desc' }
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
