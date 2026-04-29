import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { buildGoalsScreenDataContract, type GoalsScreenApiResponse } from '@mizan/shared';

export async function getGoalsScreenApiResponse(req?: Request): Promise<GoalsScreenApiResponse | null> {
  const userContext = await getOrCreateDbUser(req);
  const user = userContext?.dbUser;

  if (!user) {
    return null;
  }

  const [budgets, goals, bills] = await Promise.all([
    prisma.budget.findMany({
      where: { userId: user.id },
      include: { categories: true },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.bill.findMany({
      where: { userId: user.id },
      orderBy: { dueDay: 'asc' },
    }),
  ]);

  return {
    budgets,
    goals,
    bills,
    goalsScreen: buildGoalsScreenDataContract({ budgets, goals, bills }),
  };
}
