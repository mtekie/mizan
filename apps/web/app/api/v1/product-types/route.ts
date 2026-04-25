import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const productClass = searchParams.get('class');

        const where: any = { isActive: true };
        if (productClass) where.productClass = productClass;

        const types = await prisma.productTypeDefinition.findMany({
            where,
            orderBy: { sortOrder: 'asc' }
        });

        return NextResponse.json(types);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
