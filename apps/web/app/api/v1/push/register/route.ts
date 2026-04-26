import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const registerSchema = z.object({
  token: z.string().min(1),
  device: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const userContext = await getOrCreateDbUser(req);
    const user = userContext?.dbUser;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 });
    }

    // Fetch the current user to get their preferences
    const prefs = (user.notificationPreferences as any) || {};
    
    // Maintain a unique list of push tokens (in case of multiple devices)
    const expoPushTokens = new Set<string>(prefs.expoPushTokens || []);
    expoPushTokens.add(parsed.data.token);

    // Update user preferences
    await prisma.user.update({
      where: { id: user.id },
      data: {
        notificationPreferences: {
          ...prefs,
          expoPushTokens: Array.from(expoPushTokens)
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
