import { NextResponse } from 'next/server';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import prisma from '@/lib/db';
import { z } from 'zod';
import { isCoreProfileComplete } from '@/lib/profile/completeness';

const ProfileSchema = z.object({
    name: z.string().optional(),
    username: z.string().optional(),
    gender: z.string().optional(),
    dateOfBirth: z.string().optional(),
    educationLevel: z.string().optional(),
    employmentStatus: z.string().optional(),
    employmentSector: z.string().optional(),
    residencyStatus: z.enum(['RESIDENT', 'DIASPORA', 'EXPAT']).optional(),
    monthlyIncomeRange: z.string().optional(),
    familyStatus: z.string().optional(),
    financialPriority: z.string().optional(),
    riskAppetite: z.string().optional(),
    interestFree: z.boolean().optional(),
    dependents: z.coerce.number().int().min(0).optional(),
    housingStatus: z.string().optional(),
    incomeStability: z.string().optional(),
    digitalAdoption: z.string().optional(),
    behavioralStyle: z.string().optional(),
});

export async function GET(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const dbUser = await prisma.user.findUnique({
            where: { id: user.id }
        });

        return NextResponse.json(dbUser);
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

async function updateProfile(req: Request) {
    try {
        const userContext = await getOrCreateDbUser(req);
        const user = userContext?.dbUser;

        if (!user) {
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

        const nextProfileComplete = isCoreProfileComplete({
            ...(existingUser || {}),
            ...data,
        });

        // Boost score by 50 points if this update completes the core profile for the first time.
        if (existingUser && !existingUser.isProfileComplete && nextProfileComplete) {
            newScore += 50;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...data,
                dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
                isProfileComplete: nextProfileComplete,
                mizanScore: newScore
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Profile Update Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    return updateProfile(req);
}

export async function PATCH(req: Request) {
    return updateProfile(req);
}
