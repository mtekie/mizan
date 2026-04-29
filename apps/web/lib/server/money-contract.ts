import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { buildMoneyScreenDataContract, type MoneyScreenApiResponse } from '@mizan/shared';

export async function getMoneyScreenApiResponse(req?: Request): Promise<MoneyScreenApiResponse | null> {
  const userContext = await getOrCreateDbUser(req);
  const user = userContext?.dbUser;

  if (!user) {
    return null;
  }

  const [accounts, transactions] = await Promise.all([
    prisma.account.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.transaction.findMany({
      where: { userId: user.id },
      orderBy: { date: 'desc' },
    }),
  ]);

  return {
    accounts,
    transactions,
    money: buildMoneyScreenDataContract({
      accounts,
      transactions,
      recentTransactionLimit: 50,
    }),
  };
}
