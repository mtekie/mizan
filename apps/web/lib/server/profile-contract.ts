import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { buildProfileScreenDataContract, type ProfileScreenApiResponse } from '@mizan/shared';

export async function getProfileScreenApiResponse(req?: Request): Promise<ProfileScreenApiResponse | null> {
  const userContext = await getOrCreateDbUser(req);
  const user = userContext?.dbUser;

  if (!user) {
    return null;
  }

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' },
  });

  return {
    user,
    accounts,
    profileScreen: buildProfileScreenDataContract({ user, accounts }),
  };
}
