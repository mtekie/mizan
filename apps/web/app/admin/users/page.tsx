import prisma from '@/lib/db';
import { UsersClient } from './UsersClient';

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: {
          mizanAccounts: true,
          productApplications: true,
          productReviews: true,
          accountLinks: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 250,
  });

  return <UsersClient users={users} />;
}
