'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function signOut() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    revalidatePath('/');
    redirect('/login');
}

export async function deleteAccount() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return { error: 'Unauthorized' };
    }

    try {
        // 1. Delete user from database (cascades to accounts, transactions, goals, etc.)
        await prisma.user.delete({
            where: { id: user.id },
        });

        // 2. Sign out the user
        await supabase.auth.signOut();

        // Note: Full account deletion from Supabase Auth requires a Service Role client,
        // which isn't currently configured in the environment. We'll sign out and redirect.
        
        revalidatePath('/');
        return { success: true };
    } catch (e: any) {
        console.error('Delete account error:', e);
        return { error: e.message };
    }
}

export async function exportData() {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        throw new Error('Unauthorized');
    }

    try {
        const fullData = await prisma.user.findUnique({
            where: { id: user.id },
            include: {
                mizanAccounts: true,
                transactions: true,
                goals: true,
                budgets: {
                    include: { categories: true }
                },
                bills: true,
                assets: true
            }
        });

        if (!fullData) return { error: 'No data found' };

        // Simple CSV generation for transactions as an example
        const headers = 'Date,Title,Amount,Category,Account,Source\n';
        const rows = fullData.transactions.map(t => 
            `${t.date.toISOString()},"${t.title.replace(/"/g, '""')}",${t.amount},"${t.category || ''}","${t.accountId || ''}","${t.source || ''}"`
        ).join('\n');

        const csv = headers + rows;
        
        // Return as a base64 encoded string for the client to download
        return { 
            success: true, 
            filename: `mizan_export_${new Date().toISOString().split('T')[0]}.csv`,
            content: Buffer.from(csv).toString('base64') 
        };
    } catch (e: any) {
        return { error: e.message };
    }
}
