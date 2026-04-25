-- Track private SMS imports without storing raw message bodies.
CREATE TABLE "ImportBatch" (
  "id" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "sourcePath" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'DRY_RUN',
  "totalMessages" INTEGER NOT NULL DEFAULT 0,
  "importableMessages" INTEGER NOT NULL DEFAULT 0,
  "importedMessages" INTEGER NOT NULL DEFAULT 0,
  "skippedMessages" INTEGER NOT NULL DEFAULT 0,
  "minConfidence" INTEGER NOT NULL DEFAULT 75,
  "senderAllowlist" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),

  CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ImportedMessage" (
  "id" TEXT NOT NULL,
  "batchId" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "transactionId" TEXT,
  "fingerprint" TEXT NOT NULL,
  "sender" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3),
  "parserVersion" TEXT NOT NULL,
  "confidence" INTEGER NOT NULL,
  "status" TEXT NOT NULL,
  "reason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "ImportedMessage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "ImportedMessage_transactionId_key" ON "ImportedMessage"("transactionId");
CREATE UNIQUE INDEX "ImportedMessage_fingerprint_key" ON "ImportedMessage"("fingerprint");
CREATE INDEX "ImportBatch_userId_createdAt_idx" ON "ImportBatch"("userId", "createdAt");
CREATE INDEX "ImportedMessage_userId_sender_idx" ON "ImportedMessage"("userId", "sender");
CREATE INDEX "ImportedMessage_batchId_idx" ON "ImportedMessage"("batchId");

ALTER TABLE "ImportBatch" ADD CONSTRAINT "ImportBatch_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ImportedMessage" ADD CONSTRAINT "ImportedMessage_batchId_fkey"
  FOREIGN KEY ("batchId") REFERENCES "ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ImportedMessage" ADD CONSTRAINT "ImportedMessage_transactionId_fkey"
  FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE SET NULL ON UPDATE CASCADE;
