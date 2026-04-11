import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user: authUser } } = await supabase.auth.getUser();

  if (!authUser) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: authUser.id }
  });

  if (!user) {
    redirect('/login');
  }

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'asc' }
  });

  return <ProfileClient user={user} accounts={accounts} />;
}
