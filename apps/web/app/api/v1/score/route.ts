import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { NextResponse } from 'next/server';
import { calculateMizanScore } from '@/lib/engine/mizan-score';

export async function GET(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const score = await calculateMizanScore(user.id);

        return NextResponse.json({ score });
    } catch (error) {
        console.error('Score API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
