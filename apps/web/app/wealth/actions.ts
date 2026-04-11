'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function addAssetAction(data: {
    name: string;
    category: string;
    purchasePrice: number;
    purchasedAt: string;
    currentValue: number;
}) {
    try {
        const supabase = await createClient();
        const { data: { user }, error } = await supabase.auth.getUser();

        if (error || !user) throw new Error('Unauthorized');

        await prisma.asset.create({
            data: {
                userId: user.id,
                name: data.name,
                category: data.category,
                purchasePrice: data.purchasePrice,
                purchasedAt: new Date(data.purchasedAt),
                value: data.currentValue, // We use 'value' as the user's manual current value
            }
        });

        revalidatePath('/wealth');
        return { success: true };
    } catch (err: any) {
        return { error: err.message };
    }
}
