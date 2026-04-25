# Mizan Terminal Runbook

Use this from the repository root:

```bash
cd /Users/tykers/Downloads/mizan
```

## 1. Install Dependencies

Run this once after cloning the repo, after pulling dependency changes, or after `package-lock.json` changes:

```bash
npm install
```

## 2. Environment Files

Web environment:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Then edit `apps/web/.env.local` with your real values:

```text
DATABASE_URL=
DIRECT_URL=
GEMINI_API_KEY=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Mobile environment:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

Then edit `apps/mobile/.env`:

```text
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_PROJECT_ID=
```

For local mobile API calls:

```text
Android emulator: EXPO_PUBLIC_API_URL=http://10.0.2.2:3000
iOS simulator:   EXPO_PUBLIC_API_URL=http://localhost:3000
Physical phone:  EXPO_PUBLIC_API_URL=http://<your-computer-lan-ip>:3000
```

## 3. Run The Web App

From the repo root:

```bash
npm run dev --workspace apps/web
```

Open:

```text
http://localhost:3000
```

Keep this terminal open while using the web app or while the mobile app calls the local API.

## 4. Run The Mobile App

Open a second terminal:

```bash
cd /Users/tykers/Downloads/mizan
npm run dev --workspace apps/mobile
```

This starts Expo/Metro.

For Android emulator or device:

```bash
npm run android --workspace apps/mobile
```

For iOS simulator:

```bash
npm run ios --workspace apps/mobile
```

Important: the app has a local Expo native module for SMS work, so Expo Go is not enough for all features. Use a development build when testing Android SMS/native-module behavior.

## 5. Database Commands

Validate Prisma schema:

```bash
npm run db:validate
```

Generate Prisma client:

```bash
npm run db:generate
```

Push schema to a disposable beta database:

```bash
npm run db:push
```

For tonight's fresh database plan, run the database setup in this order:

```bash
npm run db:validate
npm run db:push
npm run db:seed:taxonomy
npm run db:seed:providers
```

Use migrations for protected production data:

```bash
npm run db:migrate:deploy
```

Seed taxonomy/providers after schema setup:

```bash
npm run db:seed:taxonomy
npm run db:seed:providers
```

## 6. Verification Before Launch Or Commit

Run these from the repo root:

```bash
npm run lint
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
npm run db:validate
npm run build --workspace apps/web
```

Current expected state:

- All commands pass.
- `npm run lint` may show one warning for `apps/web/components/ReceiptScanner.tsx` using `<img>`.

## 7. Common Terminal Sessions

For normal local development, use two terminals:

Terminal 1:

```bash
cd /Users/tykers/Downloads/mizan
npm run dev --workspace apps/web
```

Terminal 2:

```bash
cd /Users/tykers/Downloads/mizan
npm run dev --workspace apps/mobile
```

Then launch Android or iOS from the mobile terminal:

```bash
npm run android --workspace apps/mobile
```

or:

```bash
npm run ios --workspace apps/mobile
```

## 8. Git Status

Check local changes:

```bash
git status --short --branch
```

See recent commits:

```bash
git log --oneline -5
```
