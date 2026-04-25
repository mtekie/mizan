import { NextResponse } from 'next/server';
import { Role } from '@prisma/client';
import { z } from 'zod';
import prisma from '@/lib/db';
import { requireAdmin } from '@/lib/admin/auth';

const userUpdateSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(Role),
  mizanScore: z.coerce.number().int().min(300).max(900),
  onboardingPhase: z.string().trim().max(40),
  isProfileComplete: z.coerce.boolean(),
  employmentSector: z.string().trim().max(80).optional().or(z.literal('')),
  residencyStatus: z.enum(['RESIDENT', 'DIASPORA', 'EXPAT']),
});

function optionalString(value: string | undefined) {
  return value && value.length > 0 ? value : null;
}

export async function POST(req: Request) {
  const admin = await requireAdmin();
  if ('error' in admin) return admin.error;

  const body = await req.json();
  const result = userUpdateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid input', details: result.error.flatten() }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: result.data.id },
      data: {
        role: result.data.role,
        mizanScore: result.data.mizanScore,
        onboardingPhase: result.data.onboardingPhase,
        isProfileComplete: result.data.isProfileComplete,
        employmentSector: optionalString(result.data.employmentSector),
        residencyStatus: result.data.residencyStatus,
      },
    });

    return NextResponse.json(user);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}
