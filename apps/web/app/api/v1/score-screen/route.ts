import { NextResponse } from 'next/server';
import { getScoreScreenApiResponse } from '@/lib/server/score-contract';
import { ScoreScreenApiResponseSchema } from '@mizan/shared';

export async function GET(req: Request) {
  try {
    const payload = await getScoreScreenApiResponse(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = ScoreScreenApiResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error('Invalid score screen contract:', parsed.error.flatten());
      return NextResponse.json({ error: 'Invalid score contract' }, { status: 500 });
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
