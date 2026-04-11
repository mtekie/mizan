import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const unregisterSchema = z.object({
  token: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await getAuthUser(req);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = unregisterSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    // Fetch the current user to get their preferences
    const dbUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { notificationPreferences: true }
    });

    const prefs = (dbUser?.notificationPreferences as Record<string, any>) || {};
    
    // Remove the specific push token
    let tokens = (prefs.expoPushTokens as string[]) || [];
    tokens = tokens.filter(t => t !== parsed.data.token);

    // Update user preferences
    await prisma.user.update({
      where: { id: user.id },
      data: {
        notificationPreferences: {
          ...prefs,
          expoPushTokens: tokens
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
