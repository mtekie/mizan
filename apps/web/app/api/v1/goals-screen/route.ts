import { NextResponse } from 'next/server';
import { getGoalsScreenApiResponse } from '@/lib/server/goals-contract';
import { GoalsScreenApiResponseSchema } from '@mizan/shared';

export async function GET(req: Request) {
  try {
    const payload = await getGoalsScreenApiResponse(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = GoalsScreenApiResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error('Invalid goals screen contract:', parsed.error.flatten());
      return NextResponse.json({ error: 'Invalid goals contract' }, { status: 500 });
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
