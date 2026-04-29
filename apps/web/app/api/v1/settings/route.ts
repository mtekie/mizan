import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';
import { SettingsUpdateSchema, buildSettingsScreenDataContract } from '@mizan/shared';

export async function GET(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { 
                id: true,
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

        if (!dbUser) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const contract = buildSettingsScreenDataContract(dbUser);
        return NextResponse.json(contract);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        
        // 1. Validate input
        const result = SettingsUpdateSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        // 2. Only update allowed fields (already handled by Zod's safeParse data)
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: result.data,
            select: {
                id: true,
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

        const contract = buildSettingsScreenDataContract(updatedUser);
        return NextResponse.json(contract);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
