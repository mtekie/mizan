-- Link bill payments to ledger transactions.
ALTER TABLE "Transaction" ADD COLUMN "billId" TEXT;

ALTER TABLE "Transaction"
ADD CONSTRAINT "Transaction_billId_fkey"
FOREIGN KEY ("billId") REFERENCES "Bill"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "Transaction_billId_idx" ON "Transaction"("billId");
