import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import ScoreClient from './ScoreClient';

export default async function ScorePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
      mizanScore: true,
      gender: true,
      monthlyIncomeRange: true,
      educationLevel: true,
      employmentStatus: true,
      employmentSector: true,
      residencyStatus: true,
      financialPriority: true,
      riskAppetite: true,
      interestFree: true,
      dependents: true,
      housingStatus: true,
      incomeStability: true,
      digitalAdoption: true,
      behavioralStyle: true,
    }
  });

  if (!user) {
    redirect('/login');
  }

  return <ScoreClient initialScore={user.mizanScore} initialProfile={user} />;
}
