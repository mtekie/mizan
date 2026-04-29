import { NextResponse } from 'next/server';
import { getMoneyScreenApiResponse } from '@/lib/server/money-contract';
import { MoneyScreenApiResponseSchema } from '@mizan/shared';

export async function GET(req: Request) {
  try {
    const payload = await getMoneyScreenApiResponse(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = MoneyScreenApiResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error('Invalid ledger API contract:', parsed.error.flatten());
      return NextResponse.json({ error: 'Invalid ledger contract' }, { status: 500 });
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    console.error('Failed to fetch ledger contract:', error);
    return NextResponse.json({ error: 'We could not load your money data right now.' }, { status: 500 });
  }
}
