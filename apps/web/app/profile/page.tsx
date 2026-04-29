import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';
import { demoWebUser, isParityDemo } from '@/lib/parity-demo';
import { buildProfileScreenDataContract, demoAccounts } from '@mizan/shared';
import { getProfileScreenApiResponse } from '@/lib/server/profile-contract';

export default async function ProfilePage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  if (await isParityDemo(searchParams)) {
    const profileScreen = buildProfileScreenDataContract({ user: demoWebUser, accounts: demoAccounts });
    return <ProfileClient user={demoWebUser} accounts={demoAccounts} profileScreen={profileScreen} />;
  }

  const payload = await getProfileScreenApiResponse();
  if (!payload) {
    redirect('/login');
  }

  return <ProfileClient user={payload.user} accounts={payload.accounts} profileScreen={payload.profileScreen} />;
}
