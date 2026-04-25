# Admin & Marketplace Test Plan

Use this checklist to verify the database matching foundation and the admin tools added from `docs/dbrev.md` and `docs/AdminPlan.md`.

## Current Implementation Status

### Completed

- Admin route protection via `app/admin/layout.tsx`, using Supabase auth plus Prisma `User.role === ADMIN`.
- Database fields from `docs/dbrev.md`:
  - `User.employmentSector`
  - `User.residencyStatus`
  - `Provider.branchNetwork`
  - `Account.isCompulsory`
- Prisma migration is recorded as applied. `prisma migrate status` reports the database schema is up to date.
- Product attribute TypeScript types exist at `apps/web/lib/marketplace/product-attributes.ts`.
- Marketplace matching now uses hard filters for gender, residency, and sector tags when scored recommendations are requested.
- Admin Taxonomy CRUD:
  - `/admin/taxonomy`
  - `/api/admin/taxonomy`
- Admin Providers CRUD:
  - `/admin/providers`
  - `/api/admin/providers`
- Admin Products CRUD:
  - `/admin/products`
  - `/api/admin/products`
- Admin Users:
  - `/admin/users`
  - `/api/admin/users`
- Admin Moderation:
  - `/admin/moderation`
  - `/api/admin/moderation`

### Remaining Enhancements

These are not blockers for the original core admin workflow, but they are worth tracking.

- Products are edited inline on `/admin/products`; there is no separate `/admin/products/[id]` route yet.
- Providers are edited inline on `/admin/providers`; there is no separate `/admin/providers/[id]` route yet.
- Product bulk actions are not implemented yet.
- Provider reviews can be deleted, but not approved, because the current `ProviderReview` schema has no approval/status field.
- Matching has Tier 1 hard filters, but full region-aware MFI filtering from `Provider.branchNetwork` is not yet implemented.
- Tier 2 scoring does not yet deeply compare `Product.attributes` against income and score thresholds.
- Admin navigation is currently header links, not a full persistent sidebar.

## Automated Verification

Run these from the repo root:

```bash
npm run db:validate
npm exec --workspace apps/web prisma -- migrate status --schema prisma/schema.prisma
npm run lint --workspace apps/web
npm run build --workspace apps/web
```

Expected results:

- Prisma schema validates.
- Migration status says the database schema is up to date.
- Lint exits with no errors. The existing `ReceiptScanner.tsx` image warning may appear.
- Build completes successfully.

## Start The App

```bash
npm run dev --workspace apps/web
```

Open the URL printed by Next.js, usually:

- `http://localhost:3000`
- or `http://localhost:3001` if port `3000` is already busy

## Admin Access Test

1. Log in as a normal user.
2. Open `/admin`.
3. Confirm you are redirected away from admin.
4. Set your Prisma user role to `ADMIN`.
5. Log in again.
6. Open `/admin`.
7. Confirm the admin dashboard loads and shows links for Products, Users, Moderation, Providers, and Taxonomy.

## Taxonomy Test

Open `/admin/taxonomy`.

1. Create a product type:
   - Label: `Test Feature Loan`
   - Slug: `test_feature_loan`
   - Class: `CREDIT`
2. Confirm it appears in the Product Types list.
3. Edit the label and save.
4. Create a tag:
   - Label: `Test Agriculture`
   - Slug: `test_agriculture`
   - Category: `SECTOR`
   - Profile Field: `employmentSector`
   - Profile Value: `AGRICULTURE`
5. Confirm it appears in the Tags list.
6. Delete the test product type and tag after testing if no products reference them.

## Provider Test

Open `/admin/providers`.

1. Create a provider:
   - Name: `Test Provider`
   - Slug: `test-provider`
   - Type: `MFI`
   - Branches: `3`
   - Branch Network JSON:

```json
{
  "Addis_Ababa": 1,
  "Oromia": 2
}
```

2. Save and confirm it appears in the provider list.
3. Edit brand color or verification status and save.
4. Confirm changes persist after refreshing.
5. Delete the provider after testing, unless a product references it.

## Product Test

Open `/admin/products`.

1. Create a product:
   - Display Name: `Test Admin Loan`
   - Provider: `Test Provider`
   - Class: `CREDIT`
   - Type: `test_feature_loan`
   - Description: `Temporary admin test product.`
   - Interest: `12`
   - Max Amount: `50000`
   - Features:

```text
Fast approval
Flexible repayment
```

   - Attributes JSON:

```json
{
  "interestComputation": "declining",
  "insurancePremiumRate": "1%"
}
```

   - Select the test tag created earlier.
2. Save and confirm the product appears in the product list.
3. Toggle Featured, Verified, Active, Digital, and Interest-Free, then save.
4. Refresh and confirm values persist.
5. Open the public catalogue and search for the product.
6. Delete the product after testing.

## Users Test

Open `/admin/users`.

1. Search for a known user.
2. Change role from `USER` to `MODERATOR`, then save.
3. Refresh and confirm it persisted.
4. Change the role back.
5. Update `employmentSector` to `AGRICULTURE`.
6. Update `residencyStatus` to `DIASPORA`.
7. Save and confirm persistence.

Avoid demoting your only admin user unless another admin account exists.

## Moderation Test

Open `/admin/moderation`.

### Product Reviews

1. Find a product review.
2. Click Verify.
3. Confirm the review displays as verified.
4. Click Unverify and confirm it resets.
5. Delete only disposable test reviews.

### Provider Reviews

1. Find a provider review.
2. Delete only disposable test reviews.

### Account Links

1. Find an account link.
2. Click Verify.
3. Confirm the level updates to `PHOTO_VERIFIED`.
4. Click Reset.
5. Confirm the level returns to `SELF_DECLARED`.

## Matching Test

This verifies the hard-filter matching path.

1. Ensure a product has a tag where:
   - `profileField = employmentSector`
   - `profileValue = AGRICULTURE`
2. Set a user profile to:
   - `employmentSector = AGRICULTURE`
3. Request scored products from the API:

```bash
curl "http://localhost:3000/api/v1/products?scored=true"
```

4. Confirm matching products remain visible.
5. Change the user sector to a non-matching value.
6. Repeat the request and confirm hard-filtered products are excluded.

Authentication may be required depending on how you call the API. Testing this through the logged-in browser is usually easier.

## Database Spot Checks

Use Prisma Studio if desired:

```bash
npm exec --workspace apps/web prisma -- studio --schema prisma/schema.prisma
```

Check these tables:

- `User`
- `Provider`
- `Product`
- `ProductTypeDefinition`
- `TagDefinition`
- `ProductTag`
- `ProductReview`
- `ProviderReview`
- `AccountLink`

## Cleanup Checklist

After manual testing, remove disposable data:

- Test product
- Test provider
- Test product type
- Test tag
- Test reviews or account links created only for QA

Then rerun:

```bash
npm run lint --workspace apps/web
npm run build --workspace apps/web
git status --short --branch
```
