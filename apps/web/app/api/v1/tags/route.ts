import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');

        const where: any = {};
        if (category) where.category = category;

        const tags = await prisma.tagDefinition.findMany({
            where,
            orderBy: { slug: 'asc' }
        });

        return NextResponse.json(tags);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
