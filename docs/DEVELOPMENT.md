# Development Guide

## Install

From the repository root:

```bash
npm install
```

This installs the web app, mobile app, and shared package workspaces.

## Environment Files

Web:

```bash
cp apps/web/.env.example apps/web/.env.local
```

Mobile:

```bash
cp apps/mobile/.env.example apps/mobile/.env
```

### Web Variables

Required:

- `DATABASE_URL`: pooled Supabase PostgreSQL connection for app queries.
- `DIRECT_URL`: direct Supabase PostgreSQL connection for migrations and admin scripts.
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key.
- `NEXT_PUBLIC_APP_URL`: public web app URL.

Optional or feature-specific:

- `GEMINI_API_KEY`: required for AI tip, receipt scan, and forecast features.

OAuth provider setup:

- Configure Google and Apple sign-in in Supabase Dashboard > Authentication > Providers. The current implementation uses Supabase Auth directly.

### Mobile Variables

Required:

- `EXPO_PUBLIC_SUPABASE_URL`
- `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- `EXPO_PUBLIC_API_URL`

Feature-specific:

- `EXPO_PUBLIC_PROJECT_ID`: used by push notification token registration.

## Running Web

```bash
npm run dev --workspace apps/web
```

Default URL:

```text
http://localhost:3000
```

## Running Mobile

Start Metro:

```bash
npm run dev --workspace apps/mobile
```

Use Expo Go only for screens and features that do not require local native code. The repository includes a local Expo module at `apps/mobile/modules/mizan-sms`, so Android SMS functionality requires a development build:

```bash
npm run android --workspace apps/mobile
```

iOS development build:

```bash
npm run ios --workspace apps/mobile
```

## API URLs By Platform

When the web API runs on local port 3000:

| Target | `EXPO_PUBLIC_API_URL` |
|---|---|
| Android emulator | `http://10.0.2.2:3000` |
| iOS simulator | `http://localhost:3000` |
| Physical device | `http://<dev-machine-lan-ip>:3000` |

## Database And Prisma

Schema:

```text
apps/web/prisma/schema.prisma
```

Generate Prisma client:

```bash
npm exec --workspace apps/web prisma -- generate
```

Current caution: root `prisma.config.ts` points to `prisma/schema.prisma`, but the checked-in schema lives at `apps/web/prisma/schema.prisma`. Fix the config before relying on root-level Prisma commands.

## Verification

Run the main checks:

```bash
npm run lint
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
```

Current audit status: these checks fail. See [AUDIT.md](AUDIT.md) for the known blocker list.

## Build Notes

Web production build:

```bash
npm run build --workspace apps/web
```

Mobile EAS build profiles are in `apps/mobile/eas.json`:

- `development`: internal development client.
- `preview`: internal distribution.
- `production`: production build with auto-increment enabled.

## Generated Files

Do not commit generated output unless there is a deliberate reason. Common generated paths include:

- `.expo`
- `.next`
- `apps/web/.next`
- `apps/mobile/.expo`
- `apps/mobile/modules/**/build`
- `tsconfig.tsbuildinfo`
