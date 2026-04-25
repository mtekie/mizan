# Project Audit

Audit date: 2026-04-25

This audit reflects the current workspace, including uncommitted changes already present before this documentation pass. It does not assume those changes are ready to ship.

## Executive Summary

Mizan is now a real monorepo rather than the AI Studio starter described by the old README. The core direction is clear: Next.js provides the web product and API, Expo provides mobile clients, Prisma models the data, Supabase handles auth, and shared packages connect the apps.

The project is not release-ready yet. The main blockers are TypeScript errors, lint failures, Prisma schema/API drift, mobile auth mismatch across most API routes, and incomplete platform documentation. Android has the most native-specific work because of SMS permissions and the local Expo module. iOS is structurally possible but needs a feature decision around SMS-dependent flows, since iOS does not allow the same SMS inbox access model.

## Current Architecture

### Web App

- Location: `apps/web`
- Framework: Next.js App Router
- Main screens: dashboard, ledger, catalogue, product detail, bank/provider detail, dreams/goals, profile, score, settings, notifications, transfer, wealth, admin, login, onboarding.
- API namespace: `apps/web/app/api/v1`
- Data access: Prisma client from `apps/web/lib/db.ts`
- Auth: Supabase SSR/browser clients in `apps/web/lib/supabase`
- AI: Gemini endpoints for receipt scan, tips, and budget forecast.

### Mobile App

- Location: `apps/mobile`
- Framework: Expo SDK 54 with Expo Router
- Main route groups: auth, onboarding, tabs, product detail, filter modal, settings, score, notifications.
- API access: `packages/api-client` through `apps/mobile/lib/api.ts`
- Auth: Supabase client in `apps/mobile/lib/auth.ts`
- Native code: local Expo module at `apps/mobile/modules/mizan-sms`
- Android: declares `android.permission.READ_SMS`
- iOS: bundle identifier is configured, but iOS-specific feature behavior needs review.

### Shared Packages

- `packages/api-client`: browser/fetch API wrapper used by mobile.
- `packages/shared`: shared types, validators, and i18n exports.
- `packages/ui-tokens`: shared design tokens.

### Data Model

The Prisma schema in `apps/web/prisma/schema.prisma` covers:

- Users, accounts, transactions, assets, goals, budgets, budget categories, bills, notifications.
- Marketplace products, providers, product type definitions, tag definitions, product tags.
- Product and provider reviews.
- Product bookmarks, applications, and account links.

The marketplace data model is moving from legacy product fields toward normalized provider/product/taxonomy records. Both old and new fields currently coexist.

## Verification Results

Commands run from `/Users/tykers/Downloads/mizan`:

```bash
npm run lint
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
```

### Lint

`npm run lint` fails in `apps/web`.

Primary categories:

- React 19 lint rule `react-hooks/set-state-in-effect` in catalogue, ledger, wealth, charts, mode provider, onboarding prompt, and currency provider.
- `react/no-unescaped-entities` in not-found, dashboard, and onboarding copy.
- `react-hooks/purity` in `apps/web/app/page.tsx` due to `Date.now()` during render.
- Warnings for `img` usage and an unused eslint-disable.

### Web TypeScript

`npm exec --workspace apps/web tsc -- --noEmit` fails.

Primary categories:

- Next.js 15 dynamic route handler context types are stale. Several route handlers type `params` as a plain object, but generated Next types expect promise-based params.
- `AccountLink` API does not match the Prisma schema. It references `userId_providerId_accountType`, `accountType`, `verificationTier`, `isVerified`, and an included `provider` relation that do not exist in the current schema.
- Product review routes reference `User.fullName` and `ProductReview.comment`, but the schema uses `User.name` and `ProductReview.body`.
- Provider stats route references provider application counts and relation shapes that do not exist in the schema.
- `apps/web/scripts/seed_providers.ts` contains duplicate object literal keys.

### Mobile TypeScript

`npm exec --workspace apps/mobile tsc -- --noEmit` fails.

Primary categories:

- Seed/demo transaction objects in `apps/mobile/app/(tabs)/ledger.tsx` are missing required shared `Transaction` fields: `userId` and `source`.
- Ledger category indexing allows `null` or `undefined`.
- Ledger route references `router` without defining it.

## Release Blockers

1. Web and mobile typechecks must pass.
2. Lint must pass or rules must be intentionally tuned.
3. Prisma schema and API route contracts must be aligned.
4. Mobile API authentication must be normalized. The mobile client sends a Bearer token, but many API routes use `createClient()` and cookie-based `supabase.auth.getUser()` instead of the existing `getAuthUser(req)` adapter.
5. Local Prisma config is inconsistent. Root `prisma.config.ts` points at `prisma/schema.prisma`, while the schema lives at `apps/web/prisma/schema.prisma`.
6. No migrations directory exists under `apps/web/prisma`; production database changes need a migration policy.
7. Android SMS functionality requires product, privacy, and store compliance decisions before release.
8. iOS needs a substitute for Android-only SMS inbox functionality.
9. App Store and Play Store metadata, privacy disclosures, screenshots, and permission explanations are not documented yet.

## High-Risk Areas

### Auth Boundary

Web SSR auth is cookie-based. Mobile auth is Bearer-token-based. Some routes already use `getAuthUser(req)`, but most protected routes do not. This likely causes authenticated mobile calls to fail with `401` even when Supabase has a valid mobile session.

### Schema Drift

The account-linking and review APIs appear to have been written against a planned schema rather than the checked-in schema. This must be settled before building product flows on top of those endpoints.

### Marketplace Migration

`Product` still carries many legacy fields while normalized fields and taxonomy models are being introduced. This is manageable, but the migration path needs clear rules:

- Which fields are canonical for new UI?
- Which fields are legacy compatibility only?
- When do scripts backfill provider IDs, product classes, product types, and tags?

### Native Module Scope

The mobile app has a local Expo module. That means full native testing needs development builds, not only Expo Go. Android Studio work is expected. iOS builds will need Xcode and EAS setup.

### Generated Artifacts

The workspace currently contains generated directories and files such as `.expo`, `.next`, and mobile native module build outputs. These should stay out of commits unless intentionally needed.

## Documentation Gaps Closed In This Pass

- Replaced generated placeholder README with project-specific setup and architecture overview.
- Added mobile environment example.
- Added development setup and platform notes.
- Added this audit baseline.
- Added a draft release plan for web, Android, and iOS.

## Open Questions For You

1. Should mobile use the Next.js API as the only backend, or should some mobile calls go directly to Supabase?
2. For iOS, what should replace Android SMS ingestion: manual import, bank statement upload, email parsing, notification capture where allowed, or a simpler first release without automated transaction import?
3. Is the first public release Ethiopia-only and ETB-only, or should multi-currency remain a launch requirement?
4. Should marketplace data be seeded manually by admin tools first, or imported from spreadsheets/scripts as the main workflow?
5. Do you want to ship a smaller MVP first, or finish the full current surface area before launch?
