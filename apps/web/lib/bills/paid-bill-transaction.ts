import { Prisma, type Bill, type Transaction } from '@prisma/client';

const BILL_PAYMENT_SOURCE = 'Bill Reminder';

function monthWindow(date: Date) {
  return {
    start: new Date(date.getFullYear(), date.getMonth(), 1),
    end: new Date(date.getFullYear(), date.getMonth() + 1, 1),
  };
}

export async function syncPaidBillTransaction(
  tx: Prisma.TransactionClient,
  bill: Bill,
  isPaid: boolean,
  paidAt = new Date(),
): Promise<Transaction | null> {
  const referenceDate = isPaid ? paidAt : bill.lastPaid ?? paidAt;
  const { start, end } = monthWindow(referenceDate);

  if (!isPaid) {
    await tx.transaction.deleteMany({
      where: {
        userId: bill.userId,
        billId: bill.id,
        source: BILL_PAYMENT_SOURCE,
        date: { gte: start, lt: end },
      },
    });
    return null;
  }

  const existing = await tx.transaction.findFirst({
    where: {
      userId: bill.userId,
      billId: bill.id,
      source: BILL_PAYMENT_SOURCE,
      date: { gte: start, lt: end },
    },
    orderBy: { date: 'desc' },
  });

  if (existing) return existing;

  return tx.transaction.create({
    data: {
      userId: bill.userId,
      billId: bill.id,
      title: `Paid ${bill.name}`,
      amount: -Math.abs(bill.amount),
      source: BILL_PAYMENT_SOURCE,
      category: bill.category || 'Bills',
      date: paidAt,
    },
  });
}
