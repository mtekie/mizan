# Launch Checklist

This checklist is for a fast web beta launch. Public App Store and Play Store launch require additional review, signing, screenshots, store metadata, and privacy disclosures.

## Tonight Scope

Recommended launch scope:

- Web production beta.
- Android internal build only, if a development/preview build is needed for testing.
- iOS internal/TestFlight preparation only, not public App Store release.

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
2. Confirm whether the target database is empty or already has production data.
3. For a beta database with no valuable data, `npm run db:push` is acceptable.
4. For a production database with valuable data, create and review Prisma migrations before deploy.
5. Seed taxonomy/providers only after the schema is in place.

Useful commands:

```bash
npm run db:generate
npm run db:validate
npm run db:push
npm run db:seed:taxonomy
npm run db:seed:providers
```

## Web Deploy

Before deploying:

- Push the latest `main`.
- Set production env vars in the hosting provider.
- Run database schema command against the production database.
- Deploy web.
- Smoke test auth, onboarding, dashboard, ledger, profile, catalogue, and product details.

## Mobile Reality Check

Android:

- SMS permission requires a clear user-facing reason and Play Store data safety answers.
- Use internal testing until the permission story is reviewed.

iOS:

- iOS cannot use Android-style SMS inbox ingestion.
- Choose a v1 fallback before public launch: manual entry, statement upload, email import, or no auto-import.

## Stop-Ship Items

- Unknown production database state.
- Missing Supabase env vars.
- Broken login/signup callback.
- No migration/seed decision.
- Public Android release with unreviewed SMS permission claim.
- Public iOS release with SMS-dependent core flow.
