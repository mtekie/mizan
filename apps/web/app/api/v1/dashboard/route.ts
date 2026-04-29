import { NextResponse } from 'next/server';
import { getHomeScreenApiResponse } from '@/lib/server/home-contract';
import { HomeScreenApiResponseSchema } from '@mizan/shared';

export async function GET(req: Request) {
    try {
        const payload = await getHomeScreenApiResponse(req);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const parsed = HomeScreenApiResponseSchema.safeParse(payload);
        if (!parsed.success) {
            console.error('Invalid dashboard API contract:', parsed.error.flatten());
            return NextResponse.json({ error: 'Invalid dashboard contract' }, { status: 500 });
        }

        return NextResponse.json(payload);

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
