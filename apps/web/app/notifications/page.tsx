import { redirect } from 'next/navigation';
import NotificationsClient from './NotificationsClient';
import { getNotificationsScreenApiResponse } from '@/lib/server/notifications-contract';

export default async function NotificationsPage() {
  const payload = await getNotificationsScreenApiResponse();
  if (!payload) {
    redirect('/login');
  }

  return <NotificationsClient notificationsScreen={payload.notificationsScreen} />;
}
