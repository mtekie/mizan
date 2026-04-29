import { redirect } from 'next/navigation';
import { getScoreScreenApiResponse } from '@/lib/server/score-contract';
import ScoreClient from './ScoreClient';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';

export default async function ScorePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const payload = await getScoreScreenApiResponse();
  if (!payload) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id },
    select: {
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

  return <ScoreClient scoreScreen={payload.scoreScreen} initialProfile={user || {}} />;
}
