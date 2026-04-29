import { NextResponse } from 'next/server';
import { getProductDetailApiResponse } from '@/lib/server/catalogue-contract';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const userContext = await getOrCreateDbUser(req);
        
        const payload = await getProductDetailApiResponse(resolvedParams.id, userContext?.dbUser?.id);
        
        if (!payload) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(payload);
    } catch (error: any) {
        console.error('Failed to get product screen:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
