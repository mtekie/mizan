# Mizan Handoff

Last updated: 2026-05-02

This handoff summarizes the current implementation state and the move from parity work into backend foundation work.

## Current State

- Sprint 1 manual money foundations are implemented across web and mobile.
- Sprint 2 Find/product catalogue improvements are implemented with source metadata and admin data-quality support.
- Sprint 3 Goals, budgets, bills, and savings loop is implemented across web and mobile.
- Sprint 4 Mizan Score, shared profile logic, and single-question nudges are implemented.
- The local dev server runs on `http://localhost:3001`.

## Important Docs

- `docs/ROADMAP.md`: product roadmap and longer-term strategy.
- `docs/SPRINT_SCHEDULE.md`: sprint-by-sprint plan and current completion state.
- `docs/BETA_SMOKE_CHECKLIST.md`: short beta smoke checklist.
- `docs/BILL_PAYMENTS.md`: bill payment, ledger-link, skip-this-month, and notification design behavior.
- `docs/WEB_NATIVE_UI_PARITY_PLAN.md`: parity strategy and section-order checklist.
- `docs/ANTIGRAVITY_HANDOFF.md`: parity foundation and follow-up audit notes.
- `docs/BACKEND_FOUNDATION_ROADMAP.md`: next workstream for auth, persistence, API contracts, tests, and product functionality.

## Database Migrations Applied

These migrations have been applied to the configured Supabase database:

- `202604260002_product_source_metadata`
- `202604260003_backfill_product_source_metadata`
- `202604260004_link_bill_transactions`
- `202604260005_bill_skip_month`

After schema changes, Prisma Client was regenerated with:

```bash
npm exec --workspace apps/web prisma -- generate --schema prisma/schema.prisma
```

## Verification

Last verification pass:

```bash
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
npm run lint
npm run build --workspace apps/web
```

Local smoke checks returned 200/data for:

- `/dreams`
- `/catalogue`
- `/api/v1/products?take=3`

Known lint warning:

- `apps/web/components/ReceiptScanner.tsx` uses a raw `<img>` and triggers the existing Next.js image warning.

## Key Behavior Notes

- Protected write APIs now use `getOrCreateDbUser` so Supabase-authenticated users get matching Prisma user rows.
- Product catalogue list APIs default to a lightweight paginated response and include source/freshness metadata.
- Product data source metadata is visible to users on product detail and filterable in admin.
- Budget templates can create/update the current month budget.
- Budget categories can be created, edited, and deleted.
- Marking a bill paid creates one linked negative ledger transaction for the current month.
- Marking a bill unpaid removes the current-month linked bill transaction.
- Skipping a bill this month suppresses it from due totals and does not create a ledger transaction.
- Mizan Score is calculated using a shared engine in `packages/shared/engine/score.ts`.
- Profile completeness percentage is standardized across web and mobile using `packages/shared/logic/profile.ts`.
- Profile enrichment nudges follow a "one-question-at-a-time" pattern with Amharic labels and "why we ask" explanations.

## Known Caveats

- Some beta verification checklist items remain manual because they require an authenticated browser/mobile session.
- Mobile viewport browser verification for Find still needs a proper visual pass.
- Parity is now a baseline to preserve rather than the primary workstream. Remaining parity work should be targeted visual QA, not broad rewrites.
- Editor swap-file noise should not be recreated or treated as product code.
- The GitHub repository being private does not affect local development, but deployment or GitHub App access may need permission checks.

## Recommended Next Work

1. Use `docs/BACKEND_FOUNDATION_ROADMAP.md` as the next sprint anchor.
2. Stabilize auth/user bootstrap across web cookies and mobile Bearer tokens.
3. Add API contract tests for Home, Money, Find, Goals, Me/Profile, Settings, Score, and Notifications.
4. Harden real Money and Goals mutation flows before returning to visual polish.
5. Begin the verification prototype once core persistence is dependable.
