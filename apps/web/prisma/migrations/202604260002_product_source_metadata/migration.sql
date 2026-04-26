ALTER TABLE "Product"
  ADD COLUMN "sourceName" TEXT,
  ADD COLUMN "sourceUrl" TEXT,
  ADD COLUMN "sourceType" TEXT,
  ADD COLUMN "lastReviewedAt" TIMESTAMP(3),
  ADD COLUMN "reviewedBy" TEXT,
  ADD COLUMN "dataConfidence" INTEGER;

CREATE INDEX "Product_isVerified_idx" ON "Product"("isVerified");
CREATE INDEX "Product_lastReviewedAt_idx" ON "Product"("lastReviewedAt");
