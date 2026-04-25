# Project Audit

Audit date: 2026-04-25

This audit reflects the current workspace, including uncommitted changes already present before this documentation pass. It does not assume those changes are ready to ship.

## Executive Summary

Mizan is now a real monorepo rather than the AI Studio starter described by the old README. The core direction is clear: Next.js provides the web product and API, Expo provides mobile clients, Prisma models the data, Supabase handles auth, and shared packages connect the apps.

The project is not release-ready yet. The main blockers are production environment setup, database deployment decision, Android SMS compliance, iOS transaction-ingestion strategy, store metadata, and final end-to-end product QA. Android has the most native-specific work because of SMS permissions and the local Expo module. iOS is structurally possible but needs a feature decision around SMS-dependent flows, since iOS does not allow the same SMS inbox access model.

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
npm run build --workspace apps/web
npm run db:validate
```

### Lint

`npm run lint` passes with one warning in `apps/web`.

Primary categories:

- Remaining warning: `apps/web/components/ReceiptScanner.tsx` uses `<img>` for a preview image. This is acceptable for now unless production image optimization becomes a priority for that preview.

### Web TypeScript

`npm exec --workspace apps/web tsc -- --noEmit` passes.

Primary categories:

- Next.js 15 dynamic route handler context types were updated.
- `AccountLink` API was aligned to the checked-in Prisma schema.
- Product review routes were aligned to `User.name`, `User.image`, and `ProductReview.body`, while keeping `comment` as client-compatible input.
- Provider stats no longer reference nonexistent provider application counts.
- Duplicate object literal keys in `apps/web/scripts/seed_providers.ts` were removed.

### Mobile TypeScript

`npm exec --workspace apps/mobile tsc -- --noEmit` passes.

Primary categories:

- Ledger fallback transactions now satisfy shared `Transaction` fields.
- Ledger category icon lookup handles nullable categories.
- Ledger route now defines `router`.

## Release Blockers

1. Production environment variables must be set in the hosting provider.
2. Production database deployment must be chosen: `db:push` for a disposable beta database, reviewed migrations for durable production data.
3. Android SMS functionality requires product, privacy, and store compliance decisions before release.
4. iOS needs a substitute for Android-only SMS inbox functionality.
5. App Store and Play Store metadata, privacy disclosures, screenshots, and permission explanations are not documented yet.

## High-Risk Areas

### Auth Boundary

Protected `/api/v1` routes now use `getAuthUser(req)`, which supports both web cookie sessions and mobile `Authorization: Bearer <token>` sessions. Public product/provider/taxonomy routes remain callable without authentication, while optional personalization also uses the shared helper when a session is present.

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

### Production Database

Root Prisma commands now point at `apps/web/prisma/schema.prisma`, and `npm run db:validate` passes. There is a migrations directory placeholder, but no reviewed production migrations yet. For a tonight web beta, only run `npm run db:push` if the target Supabase database is disposable or explicitly approved for direct schema sync.

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
