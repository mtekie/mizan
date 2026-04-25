import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { getAuthUser } from '@/lib/supabase/auth-adapter';
import { z } from 'zod';

const transferSchema = z.object({
    fromAccountId: z.string().min(1),
    toAccountId: z.string().min(1),
    amount: z.number().positive(),
    note: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const user = await getAuthUser(req);

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const result = transferSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json({ error: 'Invalid input', details: result.error.format() }, { status: 400 });
        }

        const { fromAccountId, toAccountId, amount, note } = result.data;

        if (fromAccountId === toAccountId) {
            return NextResponse.json({ error: 'Cannot transfer to the same account' }, { status: 400 });
        }

        // Run as a transaction to ensure atomicity
        const transferResult = await prisma.$transaction(async (tx) => {
            // 1. Check and fetch both accounts
            const fromAccount = await tx.account.findUnique({
                where: { id: fromAccountId, userId: user.id }
            });
            const toAccount = await tx.account.findUnique({
                where: { id: toAccountId, userId: user.id }
            });

            if (!fromAccount || !toAccount) {
                throw new Error('One or both accounts not found or access denied');
            }

            // 2. Debit from account
            await tx.account.update({
                where: { id: fromAccountId },
                data: { balance: { decrement: amount } }
            });

            // 3. Credit to account
            await tx.account.update({
                where: { id: toAccountId },
                data: { balance: { increment: amount } }
            });

            // 4. Create transaction record for DEBIT
            const debitTx = await tx.transaction.create({
                data: {
                    userId: user.id,
                    accountId: fromAccountId,
                    title: `Transfer to ${toAccount.name}${note ? `: ${note}` : ''}`,
                    amount: -amount,
                    source: fromAccount.name,
                    category: 'Transfer',
                }
            });

            // 5. Create transaction record for CREDIT
            const creditTx = await tx.transaction.create({
                data: {
                    userId: user.id,
                    accountId: toAccountId,
                    title: `Transfer from ${fromAccount.name}${note ? `: ${note}` : ''}`,
                    amount: amount,
                    source: toAccount.name,
                    category: 'Transfer',
                }
            });

            return { debitTx, creditTx };
        });

        return NextResponse.json({ 
            success: true, 
            debitId: transferResult.debitTx.id, 
            creditId: transferResult.creditTx.id 
        });
    } catch (e: any) {
        console.error('Transfer error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
