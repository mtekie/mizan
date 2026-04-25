-- Marketplace matching fields from docs/dbrev.md.
ALTER TABLE "User"
  ADD COLUMN "employmentSector" TEXT,
  ADD COLUMN "residencyStatus" TEXT NOT NULL DEFAULT 'RESIDENT';

ALTER TABLE "Account"
  ADD COLUMN "isCompulsory" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "Provider"
  ADD COLUMN "branchNetwork" JSONB;

CREATE INDEX "User_employmentSector_idx" ON "User"("employmentSector");
CREATE INDEX "User_residencyStatus_idx" ON "User"("residencyStatus");
