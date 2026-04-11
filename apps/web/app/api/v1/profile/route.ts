import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { z } from 'zod';

const ProfileSchema = z.object({
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    educationLevel: z.string().optional(),
    employmentStatus: z.string().optional(),
    monthlyIncomeRange: z.string().optional(),
    familyStatus: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = user.id;

        const body = await req.json();
        const parseResult = ProfileSchema.safeParse(body);

        if (!parseResult.success) {
            return NextResponse.json({ error: 'Invalid input data', details: parseResult.error.flatten() }, { status: 400 });
        }

        const data = parseResult.data;

        // Check if user already completed profile
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { isProfileComplete: true, mizanScore: true }
        });

        // Upsert user if they don't exist in Prisma yet (in case the Supabase webhook failed or wasn't set up yet)
        if (!existingUser) {
             await prisma.user.create({
                 data: {
                     id: userId,
                     email: user.email,
                     isProfileComplete: false,
                     mizanScore: 600,
                 }
             });
        }

        let newScore = existingUser?.mizanScore ?? 600;

        // Boost score by 50 points if this is their first time completing the profile
        if (existingUser && !existingUser.isProfileComplete) {
            newScore += 50;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                isProfileComplete: true,
                mizanScore: newScore
            }
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
