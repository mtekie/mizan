import { NextResponse } from 'next/server';
import { getNotificationsScreenApiResponse } from '@/lib/server/notifications-contract';
import { NotificationsScreenApiResponseSchema } from '@mizan/shared';

export async function GET(req: Request) {
  try {
    const payload = await getNotificationsScreenApiResponse(req);
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const parsed = NotificationsScreenApiResponseSchema.safeParse(payload);
    if (!parsed.success) {
      console.error('Invalid notifications screen contract:', parsed.error.flatten());
      return NextResponse.json({ error: 'Invalid notifications contract' }, { status: 500 });
    }

    return NextResponse.json(payload);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
