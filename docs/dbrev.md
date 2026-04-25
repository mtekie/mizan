# Database Gap Analysis & Architecture Plan

I have reviewed your existing Prisma database schema (`apps/web/prisma/schema.prisma`) and compared it against the full dataset (Commercial Banks + MFI Products, Outreach, and Trends).

**Overall Assessment:** Your current schema is extremely well-designed. The use of `productClass`, `attributes Json?`, and the `TagDefinition` system provides a flexible, future-proof foundation that is actually superior to a rigid relational model for this type of financial marketplace.

However, based on the deeply specific data in the Excel files, there are a few **critical disparities** where the database needs minor enhancements to fully support the marketplace matching engine.

---

## 1. Disparity: Demographic & Sector Targeting
**The Data:** We discovered products specifically targeting the Diaspora (e.g., "Diaspora Housing Loan") and specific economic sectors (e.g., "Agricultural Machinery", "SME Loans", "Post-Harvest").
**The Database:** The `User` model has `employmentStatus` (e.g., Employed, Self-Employed) but lacks the specific *sector* and *residency* status.

**Recommended Enhancements (User Model):**
```prisma
model User {
  // ... existing fields ...
  
  // Add these for Tier 1 Hard Filtering
  employmentSector String? // e.g., 'AGRICULTURE', 'TECHNOLOGY', 'RETAIL'
  residencyStatus  String  @default("RESIDENT") // 'RESIDENT', 'DIASPORA', 'EXPAT'
  
  // ... existing fields ...
}
```

---

## 2. Disparity: Geographical MFI Matching
**The Data:** The MFI "Head Office Information" dataset maps branches by region (e.g., ACSI: Amhara 471, Addis Ababa 1). Since MFIs are highly regional, we cannot match a user in Oromia to an MFI that only operates in Tigray.
**The Database:** The `Provider` model currently has `branches Int?` (a flat total) and `region String?` (usually just the HQ).

**Recommended Enhancements (Provider Model):**
```prisma
model Provider {
  // ... existing fields ...
  
  // Upgrade from flat Int to structured JSON for regional matching
  branchNetwork    Json?   // e.g., { "Addis_Ababa": 150, "Oromia": 11 }
  
  // ... existing fields ...
}
```

---

## 3. Disparity: Compulsory vs. Voluntary Savings
**The Data:** The MFI "Saving Trend" sheet and "Products & Services" sheet highlight that MFI savings are strictly bifurcated into Compulsory and Voluntary. Compulsory savings are used as a proxy for collateral.
**The Database:** The `Account` model has `type String` (e.g., 'Savings', 'Wallet').

**Recommended Enhancements (Account Model):**
```prisma
model Account {
  // ... existing fields ...
  
  // Add boolean flag to differentiate MFI compulsory savings structure
  isCompulsory     Boolean  @default(false) 
  
  // ... existing fields ...
}
```

---

## 4. Disparity: Leveraging the `attributes Json?` Field
**The Data:** The "Products and Services" sheet introduced MFI-specific quirks like `interestComputation` ("Declining") and `insurancePremiumRate` (1-1.4%).
**The Database:** Your `Product` schema already has `attributes Json?`.

**Recommendation (No Schema Change Needed):**
You do not need to add columns for these! We just need to define TypeScript interfaces in the codebase for these JSON structures to ingest the MFI data perfectly:
```typescript
interface CreditAttributes {
  interestComputation?: 'declining' | 'flat';
  insurancePremiumRate?: string;
  collateralRequirements?: string;
  minAge?: number;
  maxAge?: number;
}
```

## 5. Summary of the Matching Engine Strategy
With these small additions, your current DB can easily handle the Two-Tier matching:
1. **Tier 1 (Hard Filtering):** Use your existing `ProductTag` system mapped to User fields (`gender`, `residencyStatus`, `employmentSector`).
2. **Tier 2 (Scoring):** Filter the `attributes Json?` against the user's `monthlyIncomeRange` and `mizanScore`.

> [!IMPORTANT]
> **Action Required**
> Do you approve these specific schema additions (`employmentSector`, `residencyStatus`, `branchNetwork Json`, and `isCompulsory`)? If so, I will run the Prisma schema updates and generate the migrations.
