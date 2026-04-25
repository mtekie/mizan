'use client';

import { SimpleProfile } from '@/components/SimpleProfile';

export default function ProfileClient({ user, accounts }: { user: any, accounts: any[] }) {
    return <SimpleProfile user={user} accounts={accounts} />;
}
