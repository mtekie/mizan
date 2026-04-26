-- Track a monthly skip without deleting the recurring bill reminder.
ALTER TABLE "Bill" ADD COLUMN "lastSkipped" TIMESTAMP(3);
