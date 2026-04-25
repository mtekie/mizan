# Launch Checklist

This checklist is for a fast web beta launch. Public App Store and Play Store launch require additional review, signing, screenshots, store metadata, and privacy disclosures.

## Tonight Scope

Confirmed launch scope:

- Web production beta.
- Fresh Supabase database with no real data.
- Android internal validation build.
- iOS internal/TestFlight preparation while App Store setup starts on the side.

Do not promise public mobile-store availability tonight.

## Hard Gates

Run from the repository root:

```bash
npm run lint
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
npm run build --workspace apps/web
npm run db:validate
```

Expected current state:

- All commands pass.
- `npm run lint` may still report one warning for the receipt preview `<img>`.

## Production Environment

Required for web:

- `DATABASE_URL`
- `DIRECT_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL`

Feature-specific:

- `GEMINI_API_KEY` for AI tips, forecasts, and receipt scanning.

Mobile:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_URL`
- `EXPO_PUBLIC_PROJECT_ID`

## Database

Before web beta:

1. Confirm the target Supabase project.
2. Confirm `DATABASE_URL` and `DIRECT_URL` point to the fresh database.
3. Run `npm run db:validate`.
4. Run `npm run db:push`.
5. Run `npm run db:seed:taxonomy`.
6. Run `npm run db:seed:providers`.
7. Create a test user through Supabase Auth or the app signup flow.
8. Promote one trusted test user to `ADMIN` if admin seeding/screens are needed.

Useful commands:

```bash
npm run db:generate
npm run db:validate
npm run db:push
npm run db:seed:taxonomy
npm run db:seed:providers
```

Because this launch targets a fresh database, direct `db:push` is acceptable. Move to reviewed migrations before protecting real production data.

## Web Deploy

Before deploying:

- Push the latest `main`.
- Set production env vars in the hosting provider.
- Run database schema command against the production database.
- Deploy web.
- Smoke test auth, onboarding, dashboard, ledger, profile, catalogue, and product details.

Minimum web beta smoke test:

- `/login`: email signup/login works.
- `/onboarding`: user can complete required steps.
- `/`: dashboard loads after onboarding.
- `/ledger`: account/transaction views load.
- `/catalogue`: products/providers load from seeded data.
- `/catalogue/[id]`: product detail loads.
- `/profile`: profile loads for authenticated user.
- `/settings`: settings load and save.

## Mobile Reality Check

Android:

- SMS permission requires a clear user-facing reason and Play Store data safety answers.
- Use internal testing until the permission story is reviewed.
- Build internal/dev client first because the app includes local native code.

iOS:

- iOS cannot use Android-style SMS inbox ingestion.
- Choose a v1 fallback before public launch: manual entry, statement upload, email import, or no auto-import.
- Start App Store Connect/TestFlight setup on the side.

Internal validation commands:

```bash
cd /Users/tykers/Downloads/mizan/apps/mobile
npx eas-cli@latest build -p android --profile development
npx eas-cli@latest build -p ios --profile development
```

For local native builds:

```bash
cd /Users/tykers/Downloads/mizan
npm run android --workspace apps/mobile
npm run ios --workspace apps/mobile
```

After installing a dev client, start Metro with:

```bash
cd /Users/tykers/Downloads/mizan
npm run dev --workspace apps/mobile
```

## Stop-Ship Items

- Unknown production database state.
- Missing Supabase env vars.
- Broken login/signup callback.
- Seed scripts fail against the fresh database.
- Public Android release with unreviewed SMS permission claim.
- Public iOS release with SMS-dependent core flow.
