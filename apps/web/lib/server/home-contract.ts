import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { buildHomeScreenDataContract, type HomeScreenApiResponse } from '@mizan/shared';

export async function getHomeScreenApiResponse(req?: Request): Promise<HomeScreenApiResponse | null> {
  const userContext = await getOrCreateDbUser(req);
  const user = userContext?.dbUser;

  if (!user) {
    return null;
  }

  const now = new Date();
  const [accounts, transactions, budgets, goals] = await Promise.all([
    prisma.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    }),
    prisma.budget.findMany({
      where: { userId: user.id, month: now.getMonth() + 1, year: now.getFullYear() },
      include: { categories: true },
    }),
    prisma.goal.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
    }),
  ]);

  const userData = {
    name: user.name,
    username: user.username,
    email: user.email,
    score: user.mizanScore,
    mizanScore: user.mizanScore,
    onboardingPhase: user.onboardingPhase,
    isProfileComplete: user.isProfileComplete,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth,
    educationLevel: user.educationLevel,
    employmentStatus: user.employmentStatus,
    employmentSector: user.employmentSector,
    residencyStatus: user.residencyStatus,
    monthlyIncomeRange: user.monthlyIncomeRange,
    financialPriority: user.financialPriority,
    riskAppetite: user.riskAppetite,
    interestFree: user.interestFree,
    dependents: user.dependents,
    housingStatus: user.housingStatus,
    incomeStability: user.incomeStability,
    digitalAdoption: user.digitalAdoption,
    behavioralStyle: user.behavioralStyle,
  };

  return {
    user: userData,
    accounts,
    recentTransactions: transactions.slice(0, 5),
    budgets,
    home: buildHomeScreenDataContract({
      user: userData,
      accounts,
      transactions,
      budgets,
      goals,
    }),
  };
}
