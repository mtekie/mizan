import prisma from '@/lib/db';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { buildNotificationsScreenDataContract, type NotificationsScreenApiResponse } from '@mizan/shared';

export async function getNotificationsScreenApiResponse(req?: Request): Promise<NotificationsScreenApiResponse | null> {
  const userContext = await getOrCreateDbUser(req);
  const user = userContext?.dbUser;

  if (!user) {
    return null;
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  });

  return {
    notifications,
    notificationsScreen: buildNotificationsScreenDataContract({ notifications }),
  };
}
