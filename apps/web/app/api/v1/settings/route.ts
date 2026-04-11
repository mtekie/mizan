import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const settingsSchema = z.object({
    currency: z.string().length(3).optional(),
    language: z.string().length(2).optional(),
    onboardingPhase: z.string().optional(),
    name: z.string().min(1).optional(),
    theme: z.enum(['light', 'dark']).optional(),
    notificationPreferences: z.record(z.string(), z.boolean()).optional(),
});

export async function GET() {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { 
                name: true, 
                email: true, 
                currency: true, 
                language: true, 
                onboardingPhase: true,
                theme: true,
                notificationPreferences: true,
                role: true
            }
        });

        return NextResponse.json(dbUser);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        
        // 1. Validate input
        const result = settingsSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        // 2. Only update allowed fields (already handled by Zod's safeParse data)
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: result.data
        });

        return NextResponse.json(updatedUser);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
