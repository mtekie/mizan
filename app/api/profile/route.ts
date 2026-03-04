import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/db';

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // For development prototyping without robust auth, fall back to the first user if no session
        let userId = session?.user?.email
            ? (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id
            : null;

        if (!userId) {
            const firstUser = await prisma.user.findFirst();
            if (firstUser) userId = firstUser.id;
            else return NextResponse.json({ error: 'No users in database to update' }, { status: 400 });
        }

        const body = await req.json();
        const { gender, dateOfBirth, educationLevel, employmentStatus, monthlyIncomeRange, familyStatus } = body;

        // Check if user already completed profile
        const existingUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { isProfileComplete: true, mizanScore: true }
        });

        let newScore = existingUser?.mizanScore ?? 600;

        // Boost score by 50 points if this is their first time completing the profile
        if (!existingUser?.isProfileComplete) {
            newScore += 50;
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId as string },
            data: {
                gender,
                dateOfBirth: new Date(dateOfBirth),
                educationLevel,
                employmentStatus,
                monthlyIncomeRange,
                familyStatus,
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
