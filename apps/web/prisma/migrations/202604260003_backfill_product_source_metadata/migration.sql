UPDATE "Product"
SET
  "sourceName" = COALESCE("sourceName", 'bankProductData.csv initial import'),
  "sourceType" = COALESCE("sourceType", 'spreadsheet'),
  "lastReviewedAt" = COALESCE("lastReviewedAt", "updatedAt"),
  "reviewedBy" = COALESCE("reviewedBy", 'Mizan data import'),
  "dataConfidence" = COALESCE("dataConfidence", CASE WHEN "isVerified" THEN 70 ELSE 40 END)
WHERE
  "sourceName" IS NULL
  AND "sourceUrl" IS NULL
  AND "sourceType" IS NULL
  AND "lastReviewedAt" IS NULL
  AND "reviewedBy" IS NULL
  AND "dataConfidence" IS NULL;
