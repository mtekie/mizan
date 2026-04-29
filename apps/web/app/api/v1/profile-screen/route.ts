import { NextResponse } from 'next/server';
import { getProfileScreenApiResponse } from '@/lib/server/profile-contract';
import { ProfileScreenApiResponseSchema } from '@mizan/shared';

export async function GET(req: Request) {
  try {
    const payload = await getProfileScreenApiResponse(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = ProfileScreenApiResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error('Invalid profile screen contract:', parsed.error.flatten());
      return NextResponse.json({ error: 'Invalid profile contract' }, { status: 500 });
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
