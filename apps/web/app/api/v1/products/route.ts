import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const category = searchParams.get('category');
        const search = searchParams.get('search');
        const type = searchParams.get('type');

        const where: any = {};
        
        if (category && category !== 'All') {
            where.category = category;
        }

        if (type && type !== 'All') {
            where.type = type;
        }

        if (search) {
            where.OR = [
                { name: { contains: search, mode: 'insensitive' } },
                { description: { contains: search, mode: 'insensitive' } },
                { bankName: { contains: search, mode: 'insensitive' } },
            ];
        }

        const products = await prisma.product.findMany({
            where,
            orderBy: { matchScore: 'desc' },
            take: 100 // Limit for performance
        });

        return NextResponse.json(products);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
