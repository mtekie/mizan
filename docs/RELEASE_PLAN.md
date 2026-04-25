# Draft Release Plan

This is a planning baseline, not the final delivery plan. It exists so the next planning session can start from facts instead of rediscovery.

## Goal

Finish Mizan across:

- Web
- Android
- iOS

The recommended release strategy is to stabilize one shared backend/API contract first, then bring web and mobile clients to parity where parity is realistic. Android can include SMS-specific features. iOS needs an alternate transaction-ingestion path.

## Phase 1: Stabilize The Foundation

Exit criteria:

- Web typecheck passes.
- Mobile typecheck passes.
- Lint passes or the lint policy is intentionally adjusted.
- Prisma schema, generated client, API routes, and shared types agree.
- Auth works from both web cookies and mobile Bearer tokens.
- Root and workspace Prisma commands are documented and consistent.

Primary tasks:

- Update Next.js dynamic route handler signatures for Next 15.
- Choose and implement the final `AccountLink` schema.
- Align review API names with schema fields.
- Fix provider stats assumptions.
- Fix duplicate keys in seed scripts.
- Update all protected API routes to use a shared auth helper that supports cookies and Bearer tokens.
- Tighten shared package types so mobile demo/fallback data cannot drift.

Status:

- Typecheck, lint, and shared auth-helper coverage are complete.
- Prisma command validation is complete.
- Remaining Phase 1 decision is whether tonight uses `db:push` against a disposable beta database or a reviewed migration flow.

## Phase 2: Web MVP Completion

Exit criteria:

- Auth, onboarding, dashboard, ledger, goals/dreams, profile, settings, score, and catalogue work end to end.
- Marketplace filters, provider pages, product detail, reviews, bookmarks, and applications work against real schema fields.
- Admin or scripts can seed taxonomy/providers/products repeatably.
- Empty, loading, error, unauthorized, and offline-ish states are handled.
- Production build passes.

Primary tasks:

- Decide MVP screen list.
- Remove or hide incomplete screens from navigation.
- Finish data loading and mutation flows.
- Add minimum API route tests or focused integration checks for high-risk endpoints.
- Audit responsive web layout.

## Phase 3: Android Completion

Exit criteria:

- Development build runs from Android Studio and EAS.
- Login/signup works.
- Mobile API calls authenticate successfully.
- Dashboard, ledger, catalogue, product detail, goals, profile, settings, score, and notifications work with the backend.
- SMS permission flow is clear and compliant.
- If SMS parsing ships, parser accuracy is tested against representative Ethiopian bank/wallet messages.
- Play Store privacy and permission disclosures are ready.

Primary tasks:

- Fix mobile type errors.
- Verify local Expo module build.
- Define SMS ingestion UX and fallback when permission is denied.
- Add Android-specific QA checklist.
- Prepare Play Store assets and data safety answers.

## Phase 4: iOS Completion

Exit criteria:

- iOS development build runs.
- Auth and core finance workflows work.
- iOS has a transaction-ingestion story that does not depend on SMS inbox access.
- Push notifications and deep links are tested.
- App Store privacy details and screenshots are ready.

Primary tasks:

- Decide iOS replacement for SMS ingestion.
- Verify iOS bundle identifier, signing, and EAS project settings.
- Test layouts against iPhone SE, standard iPhone, large iPhone, and iPad if tablet support stays enabled.
- Prepare App Store metadata.

## Phase 5: Launch Hardening

Exit criteria:

- CI runs lint, typecheck, and build.
- Seed/migration process is repeatable.
- Production environment variables are documented.
- Error logging and analytics are in place.
- Privacy policy and terms exist.
- Backup/rollback path is known.

## Decisions Needed

1. MVP scope: full current product surface or smaller first release?
2. Backend policy: mobile only through Next.js API, or mobile direct-to-Supabase for selected data?
3. iOS ingestion: manual entry, file upload, bank statement import, email import, or no ingestion for v1?
4. Marketplace data workflow: admin UI, scripts, spreadsheets, or hybrid?
5. Auth providers for launch: email/password only, Google, Apple, phone OTP, or a staged rollout?
