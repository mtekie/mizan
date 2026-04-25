# Mizan

Mizan is a financial operating system for Ethiopian users. The repository is a monorepo with a Next.js web app, an Expo mobile app, and shared packages for API access, validation, types, and UI tokens.

The product currently covers personal finance workflows and a financial product marketplace:

- Dashboard, accounts, transactions, budgets, bills, goals, assets, score, profile, settings, notifications, transfers, and wealth views.
- Marketplace catalogue for banks, MFIs, insurance, digital payment products, capital markets, community finance, tagging, matching, reviews, bookmarks, applications, and provider pages.
- Supabase authentication across web and mobile.
- Prisma-backed PostgreSQL data model.
- Expo mobile app with Android SMS-read groundwork and an iOS-planned architecture.

## Workspace

```text
apps/web        Next.js App Router application and API routes
apps/mobile     Expo Router mobile app for Android, iOS, and Expo web
packages/api-client
                Typed client used by the mobile app to call the web API
packages/shared Shared TypeScript types, validators, and i18n
packages/ui-tokens
                Shared color, spacing, radius, and typography tokens
docs            Architecture, audit, and delivery documentation
```

## Prerequisites

- Node.js 20+
- npm 10+
- Supabase project with Auth enabled
- PostgreSQL connection strings for Prisma
- Gemini API key if AI receipt, tips, or forecast endpoints are enabled
- Expo CLI through `npx expo`
- Android Studio for Android emulator/builds
- Xcode and Apple Developer access before iOS submission work

## Environment

Create these files from the examples:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/mobile/.env.example apps/mobile/.env
```

The web app needs Supabase, Prisma, and optional AI settings. The mobile app needs Supabase public keys and the web API base URL.

For local Android emulator calls to the Next.js API, use:

```text
EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
```

For iOS simulator calls, use:

```text
EXPO_PUBLIC_API_URL=http://localhost:3000
```

For physical devices, use the LAN URL of the development machine.

## Install

```bash
npm install
```

## Run

Web:

```bash
npm run dev --workspace apps/web
```

Mobile:

```bash
npm run dev --workspace apps/mobile
```

The mobile app includes a local Expo module under `apps/mobile/modules/mizan-sms`, so Expo Go is not enough for every Android feature. Use a development build for SMS/native-module testing:

```bash
npm run android --workspace apps/mobile
npm run ios --workspace apps/mobile
```

## Verify

Current verification commands:

```bash
npm run lint
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
```

As of the audit in [docs/AUDIT.md](docs/AUDIT.md), these commands do not yet pass. Treat that document as the current release-readiness baseline.

## Key Docs

- [docs/AUDIT.md](docs/AUDIT.md): current state, blockers, and risks.
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md): setup, run commands, environments, and platform notes.
- [docs/RELEASE_PLAN.md](docs/RELEASE_PLAN.md): draft plan for finishing web, Android, and iOS.
- [docs/architecture/find-tab-marketplace.md](docs/architecture/find-tab-marketplace.md): marketplace taxonomy and product model direction.
