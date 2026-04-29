import { NextResponse } from 'next/server';
import { getFindScreenApiResponse } from '@/lib/server/find-contract';
import { FindScreenApiResponseSchema } from '@mizan/shared';

export async function GET(req: Request) {
    try {
        const payload = await getFindScreenApiResponse(req, 50);
        const parsed = FindScreenApiResponseSchema.safeParse(payload);
        if (!parsed.success) {
            console.error('Invalid catalogue bootstrap contract:', parsed.error.flatten());
            return NextResponse.json({ error: 'Invalid catalogue contract' }, { status: 500 });
        }

        return NextResponse.json(payload);
    } catch (e: any) {
        console.error('Catalogue Bootstrap API Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
