'use server';

import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getOrCreateDbUser } from '@/lib/supabase/auth-adapter';
import { syncPaidBillTransaction } from '@/lib/bills/paid-bill-transaction';

export async function createBill(data: { name: string, amount: number, category: string, dueDay: number }) {
  const userContext = await getOrCreateDbUser();
  const user = userContext?.dbUser;

  if (!user) throw new Error('Unauthorized');

  const bill = await prisma.bill.create({
    data: {
      userId: user.id,
      name: data.name,
      amount: data.amount,
      category: data.category,
      dueDay: data.dueDay,
      isPaid: false
    }
  });

  revalidatePath('/dreams');
  return bill;
}

export async function markBillPaid(billId: string, isPaid: boolean) {
  const userContext = await getOrCreateDbUser();
  const user = userContext?.dbUser;

  if (!user) throw new Error('Unauthorized');

  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill || bill.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  const paidAt = new Date();
  await prisma.$transaction(async (tx) => {
    await syncPaidBillTransaction(tx, bill, isPaid, paidAt);
    await tx.bill.update({
      where: { id: billId },
      data: { isPaid, lastPaid: isPaid ? paidAt : null, lastSkipped: isPaid ? null : bill.lastSkipped }
    });
  });

  revalidatePath('/dreams');
  revalidatePath('/ledger');
  return { success: true };
}

export async function skipBillThisMonth(billId: string) {
  const userContext = await getOrCreateDbUser();
  const user = userContext?.dbUser;

  if (!user) throw new Error('Unauthorized');

  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill || bill.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  const skippedAt = new Date();
  await prisma.$transaction(async (tx) => {
    await syncPaidBillTransaction(tx, bill, false, skippedAt);
    await tx.bill.update({
      where: { id: billId },
      data: { isPaid: false, lastPaid: null, lastSkipped: skippedAt }
    });
  });

  revalidatePath('/dreams');
  revalidatePath('/ledger');
  return { success: true };
}

export async function deleteBill(billId: string) {
  const userContext = await getOrCreateDbUser();
  const user = userContext?.dbUser;

  if (!user) throw new Error('Unauthorized');

  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill || bill.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.bill.delete({
    where: { id: billId }
  });

  revalidatePath('/dreams');
  return { success: true };
}
