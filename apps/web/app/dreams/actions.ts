'use server';

import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createBill(data: { name: string, amount: number, category: string, dueDay: number }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  await prisma.bill.create({
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
  return { success: true };
}

export async function markBillPaid(billId: string, isPaid: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Unauthorized');

  const bill = await prisma.bill.findUnique({ where: { id: billId } });
  if (!bill || bill.userId !== user.id) {
    throw new Error('Unauthorized');
  }

  await prisma.bill.update({
    where: { id: billId },
    data: { isPaid }
  });

  revalidatePath('/dreams');
  return { success: true };
}

export async function deleteBill(billId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
