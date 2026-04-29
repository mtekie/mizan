import { NextResponse } from 'next/server';
import { getProviderDetailApiResponse } from '@/lib/server/catalogue-contract';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const payload = await getProviderDetailApiResponse(resolvedParams.id);
        
        if (!payload) {
            return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
        }

        return NextResponse.json(payload);
    } catch (error: any) {
        console.error('Failed to get provider screen:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
