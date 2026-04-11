import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import WealthClient from './WealthClient';

export default async function WealthPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const assets = await prisma.asset.findMany({
    where: { userId: user.id }
  });

  return <WealthClient initialAssets={assets} />;
}
