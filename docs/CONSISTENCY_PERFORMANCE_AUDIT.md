# Layout Consistency, Feature Parity, And Performance Audit

Audit date: 2026-04-25  
Scope: Next.js web app, mobile web rendering, Expo mobile app, shared packages, and API surfaces.

## Executive Summary

Mizan currently has the right product areas, but the experience is not governed by one shared application shell or one shared feature contract. Desktop web, mobile web, and the Expo app often render the same product area through different components, labels, headers, card styles, and data-loading paths. This is why Home, Money, Find, Goals, Me, Settings, and Score feel like related screens rather than one consistent product.

Loading is slow for two main reasons:

1. Some important pages render an empty or partial client shell first, then fetch data after hydration.
2. The marketplace APIs return heavy records and nested relations, and local timing confirms they are slow enough to be user-visible.

There is also a backend consistency issue visible in the mobile screenshots: mobile-authenticated users can call protected APIs before a matching Prisma `User` row exists. Routes such as goals, accounts, transactions, budgets, bills, and assets assume that row exists, which can trigger foreign key errors such as `Goal_userId_fkey`.

The recommended direction is to stabilize one shared navigation model, one shared responsive shell, one shared API/user bootstrap pattern, and one feature parity matrix. Visual cleanup should happen after those foundations, otherwise page-by-page polishing will keep drifting.

## Evidence Reviewed

User screenshots showed:

- Mobile web page headers using different vertical heights, titles, and overlap patterns.
- Desktop web using a left sidebar and desktop-only page headers, while mobile web uses large gradient headers or plain white headers inconsistently.
- Money and Find pages with large highlighted top regions that do not match the rest of the app.
- Desktop web exposing richer Money, Find, Score, and Settings surfaces than the mobile app.
- Expo mobile goal save failure:
  `Invalid prisma.goal.create() invocation: Foreign key constraint violated on the constraint: Goal_userId_fkey`.

Code paths reviewed:

- Web shell: `apps/web/components/LayoutWrapper.tsx`
- Web desktop header: `apps/web/components/PageHeader.tsx`
- Web generic shell: `apps/web/components/SimplePageShell.tsx`
- Web bottom nav: `apps/web/components/BottomNav.tsx`
- Web sidebar: `apps/web/components/Sidebar.tsx`
- Web Home: `apps/web/components/SimpleDashboard.tsx`
- Web Money: `apps/web/app/ledger/LedgerClient.tsx`, `apps/web/components/SimpleLedger.tsx`
- Web Find: `apps/web/app/catalogue/page.tsx`, `apps/web/components/SimpleCatalogue.tsx`
- Web Goals: `apps/web/app/dreams/DreamsClient.tsx`
- Web Me: `apps/web/components/SimpleProfile.tsx`
- Web Score: `apps/web/app/score/ScoreClient.tsx`
- Web Settings: `apps/web/app/settings/page.tsx`
- Mobile tabs: `apps/mobile/app/(tabs)/_layout.tsx`
- Mobile Home/Money/Find/Goals/Me: `apps/mobile/app/(tabs)/*.tsx`
- Mobile Settings/Score/Notifications: `apps/mobile/app/settings.tsx`, `apps/mobile/app/score.tsx`, `apps/mobile/app/notifications.tsx`
- Shared tokens: `packages/ui-tokens/index.ts`
- API client: `packages/api-client/index.ts`
- Auth adapter: `apps/web/lib/supabase/auth-adapter.ts`
- Product API: `apps/web/app/api/v1/products/route.ts`
- Goal API: `apps/web/app/api/v1/goals/route.ts`
- Prisma schema: `apps/web/prisma/schema.prisma`

## Current Route And Label Drift

The same product areas are named differently across surfaces.

| Product area | Web route | Web label variants | Mobile app route | Mobile app label |
| --- | --- | --- | --- | --- |
| Home | `/` | Home, Overview | `(tabs)/index` | Home |
| Money | `/ledger` | Money, Transactions, Ledger | `(tabs)/ledger` | Money, Ledger in screen title |
| Find | `/catalogue` | Find, Explore, Marketplace | `(tabs)/catalogue` | Find tab, Marketplace screen title |
| Goals | `/dreams` | Goals, Plan, Dreams | `(tabs)/goals` | Goals |
| Me | `/profile` | Me, Profile | `(tabs)/profile` | Me tab, Profile screen title |
| Score | `/score` | Mizan Score | `score.tsx` | Mizan Score |
| Settings | `/settings` | Me Settings, Settings | `settings.tsx` | Settings |

### Recommendation

Adopt these user-facing names everywhere:

- Home
- Money
- Find
- Goals
- Me
- Mizan Score
- Settings
- Notifications

Keep route paths stable for now to avoid a large routing migration. Later, add aliases or redirects such as `/goals -> /dreams` if needed.

## Layout Consistency Findings

### Finding 1: Page shells are duplicated instead of shared

`SimplePageShell` provides a partial reusable shell, but several primary pages still build their own headers and content spacing.

Examples:

- `SimpleLedger` creates its own mobile gradient header and content overlap.
- `SimpleCatalogue` creates its own mobile gradient header with title `Explore`.
- `SimpleDashboard` creates a custom hero header instead of using a shared header/hero component.
- `SettingsPage` uses a sticky white mobile header, unlike most primary pages.
- Native screens use completely separate header styles.

Impact:

- Header height, top padding, safe-area treatment, negative margins, and action button placement vary by page.
- The same bottom navigation appears under pages with different vertical rhythm.
- Mobile web and native app cannot easily stay in sync.

Recommendation:

Create one web `AppPageShell` and one native `AppScreenShell` with matching props:

- `title`
- `subtitle`
- `variant`: `hero`, `plain`, `compact`
- `backHref` / `showBack`
- `primaryAction`
- `secondaryActions`
- `children`

The shells should own:

- Safe area padding.
- Header height.
- Desktop/mobile visibility.
- Content max width.
- Bottom nav offset.
- Page background.
- Standard spacing between sections.

### Finding 2: Desktop and mobile web often render different information

`LedgerClient` switches to `SimpleLedger` when `useIsMobile()` returns true. That means mobile web receives a simplified screen that omits desktop features such as accounts strip, monthly in/out, savings rate, transfer action, filters, monthly spending, and six-month trend.

Impact:

- Mobile web is not a responsive version of desktop web; it is a different product surface.
- Users cannot rely on the same Money functionality across devices.

Recommendation:

Do not make mobile web a feature-reduced branch by default. Use responsive layout changes, not separate feature trees, unless there is a deliberate product reason.

### Finding 3: Native app uses independent screen structures

Expo screens use native components and should not share JSX with web, but they should share:

- Navigation labels.
- Feature sections.
- Empty states.
- Data shapes.
- Token names.
- Core ordering of content.

Current examples:

- Mobile app `ledger.tsx` uses title `Ledger`, no balance summary, no accounts, and no spending summary.
- Mobile app `catalogue.tsx` uses title `Marketplace`, featured products, and a different product card structure from web Find.
- Mobile app `goals.tsx` only shows savings goals, while web Goals contains budget, bills, forecast, templates, expense logging, and goals.
- Mobile app `profile.tsx` only has a small profile/menu screen, while web Me has identity, connected accounts, score entry, and security overview.
- Mobile app `settings.tsx` only has three placeholder rows, while web Settings has account, currency, language, theme, notification preferences, security, data export, delete account, and sign out.

Recommendation:

Define feature parity as product sections, not identical component code. Native app can have native UI, but the visible features should match the same checklist.

## Feature Parity Matrix

Legend:

- Complete: visible and meaningfully functional.
- Partial: visible but simplified, mocked, missing actions, or missing data.
- Missing: not present.

| Feature | Desktop web | Mobile web | Mobile app | Notes |
| --- | --- | --- | --- | --- |
| Home balance/net worth | Complete | Complete | Partial | Native Home has different layout and copy. |
| Home profile status | Complete | Complete | Partial | Web and native components differ. |
| Home quick actions | Complete | Complete | Missing/partial | Native Home focuses on add account, not same quick actions. |
| Home insights | Complete | Complete | Partial | Native has spending/budget cards, different structure. |
| Money total balance | Complete | Partial | Missing/partial | Mobile web simplified; native Ledger lacks balance header. |
| Money accounts | Complete | Missing | Missing | Desktop web has account strip. |
| Money transactions | Complete | Complete | Complete | Different titles and card structures. |
| Money filters | Complete | Missing | Placeholder | Native filter button present but not wired equivalently. |
| Money add transaction | Complete | Missing | Complete | Mobile web SimpleLedger plus button has no flow. |
| Money transfer | Complete | Missing | Missing | Desktop only. |
| Money spending analytics | Complete | Missing | Missing | Desktop only. |
| Find search | Complete | Partial | Complete | Mobile web search is hidden behind icon; native has full search. |
| Find categories | Complete | Complete | Complete | Labels mostly align, but page title does not. |
| Find institutions | Complete | Complete | Missing | Native catalogue lacks institution strip. |
| Find product list | Complete | Complete | Complete | Cards differ and API pagination differs. |
| Find product detail | Complete | Complete | Complete | Needs QA for field parity. |
| Goals budget overview | Complete | Complete | Missing | Native Goals only savings goals. |
| Goals bill reminders | Complete | Complete | Missing | Web only. |
| Goals saving goals | Complete | Complete | Complete | Native simpler. |
| Goals add goal | Complete | Complete | Complete, but broken for some users | Backend FK issue. |
| Goals forecast | Complete | Complete | Missing | Web only. |
| Me identity card | Complete | Complete | Partial | Native simpler. |
| Me connected accounts | Complete | Partial | Missing | Native does not expose account list. |
| Me Mizan Score entry | Complete | Complete | Missing | Native has separate score screen but not entry parity. |
| Settings account | Complete | Complete | Partial | Native placeholder only. |
| Settings preferences | Complete | Complete | Missing | Currency/language/theme not equivalent in native. |
| Settings notifications | Complete | Complete | Partial/missing | Native placeholder only. |
| Settings security | Complete | Complete | Missing | Native placeholder only. |
| Settings data export/delete | Complete | Complete | Missing | Native missing. |
| Score meter | Complete | Complete | Partial | Native hardcodes 785 instead of API-backed score. |
| Score impact factors | Complete | Complete | Missing | Native missing. |
| Notifications list | Complete | Complete | Mocked | Native notifications are hardcoded. |

## Performance Findings

### Local timing measurements

Measured against `http://127.0.0.1:3000` on 2026-04-25:

| Route/API | Status | Time |
| --- | ---: | ---: |
| `/` | 200 | 257ms |
| `/ledger` | 200 | 60ms |
| `/catalogue` | 200 | 1141ms |
| `/dreams` | 200 | 106ms |
| `/profile` | 200 | 59ms |
| `/score` | 200 | 59ms |
| `/api/v1/products?take=100` | 200 | 3530ms |
| `/api/v1/products?take=20` | 200 | 1762ms |
| `/api/v1/providers` | 200 | 1131ms |
| `/api/v1/product-types` | 200 | 860ms |

These timings are local development measurements, not production metrics, but they are still useful because the marketplace APIs are much slower than the other app pages.

### Finding 1: Catalogue fetches after hydration

`apps/web/app/catalogue/page.tsx` is a client component that starts with no products, then runs:

```ts
fetch('/api/v1/products?take=100')
```

Impact:

- User waits for the JS bundle, hydration, and then a slow API call.
- The page is visually inconsistent because it renders loading/empty states rather than useful initial content.

Recommendation:

Make the web catalogue page a server component that fetches initial products before render. Keep search/filter interactivity in a child client component.

### Finding 2: Product API returns heavy records by default

`apps/web/app/api/v1/products/route.ts` includes:

- `provider: true`
- `tags: { include: { tag: true } }`
- Full product fields
- Optional scoring path

Impact:

- List views fetch more data than they need.
- `take=20` is still slow because each product carries nested data.
- Mobile app also depends on this endpoint, so web API latency affects native app loading.

Recommendation:

Add list/detail modes:

- Product list endpoint should use `select` for only card fields.
- Product detail endpoint can return full fields.
- Tags should be opt-in for filter/detail use.
- Institution counts should come from a lightweight grouped query or dedicated bootstrap endpoint.

### Finding 3: Marketplace bootstrap is split across multiple requests

Mobile Find currently fetches profile, featured products, and product list separately. Filter modal fetches providers and product types separately.

Impact:

- Native app waits on multiple HTTP round trips.
- Loading states and counts can get out of sync.

Recommendation:

Add `/api/v1/catalogue/bootstrap` returning:

- Initial products page.
- Category definitions.
- Institution summary/counts.
- Featured products.
- Profile completeness or personalization status when authenticated.

### Finding 4: Middleware touches too many routes

`apps/web/middleware.ts` runs `updateSession()` for most paths except static assets and image files. `updateSession()` calls `supabase.auth.getUser()`.

Impact:

- Public pages and public APIs can pay auth refresh overhead.
- Product/provider/taxonomy APIs are public but still pass through session middleware.

Recommendation:

Restrict middleware to page routes and protected route groups where cookie refresh is needed, or explicitly exclude public `/api/v1/products`, `/api/v1/providers`, `/api/v1/product-types`, `/api/v1/tags`, sitemap, robots, and other public endpoints.

### Finding 5: Client bundle is inflated by feature-specific dependencies

Build output shows:

- `/ledger` first load JS: 259 kB.
- `/wealth` first load JS: 258 kB.
- `/dreams` first load JS: 169 kB.
- `/score` first load JS: 164 kB.
- `/catalogue` first load JS: 115 kB.

Large contributors include `recharts`, `framer-motion`/`motion`, and large client components.

Recommendation:

- Dynamically load charts below the fold.
- Avoid importing chart libraries in the first render path for pages that can show summary cards first.
- Push client components lower in the tree.
- Convert static page sections to server components where possible.

## Backend Consistency Findings

### Finding: Protected APIs do not consistently create or validate the local user row

`apps/web/app/page.tsx` creates a Prisma user if missing. `apps/web/app/api/v1/profile/route.ts` creates one during profile update. But several API routes use `getAuthUser(req)` and then immediately write child rows with `userId: user.id`.

Examples:

- `apps/web/app/api/v1/goals/route.ts`
- `apps/web/app/api/v1/accounts/route.ts`
- `apps/web/app/api/v1/transactions/route.ts`
- `apps/web/app/api/v1/budgets/route.ts`
- `apps/web/app/api/v1/bills/route.ts`
- `apps/web/app/api/v1/assets/route.ts`

If the Supabase user exists but the Prisma `User` row does not, child writes can fail with FK violations.

Recommendation:

Add a shared helper:

```ts
getOrCreateDbUser(req: Request)
```

It should:

- Read the authenticated Supabase user.
- Return `null` if unauthenticated.
- Upsert or create the Prisma user with id/email.
- Return both auth user and db user if needed.

Use it on all protected API routes that read or write user-owned data.

## Target Architecture

### Shared navigation config

Create a shared config in `packages/shared`:

```ts
export const appSections = [
  { key: 'home', label: 'Home', webHref: '/', nativeRoute: 'index', icon: 'home' },
  { key: 'money', label: 'Money', webHref: '/ledger', nativeRoute: 'ledger', icon: 'receipt' },
  { key: 'find', label: 'Find', webHref: '/catalogue', nativeRoute: 'catalogue', icon: 'compass' },
  { key: 'goals', label: 'Goals', webHref: '/dreams', nativeRoute: 'goals', icon: 'target' },
  { key: 'me', label: 'Me', webHref: '/profile', nativeRoute: 'profile', icon: 'user' },
] as const;
```

Web and native can map icon keys to `lucide-react` and `lucide-react-native` respectively.

### Web shell contract

Create `AppPageShell`:

```ts
type AppPageShellProps = {
  title: string;
  subtitle?: string;
  variant?: 'hero' | 'plain' | 'compact';
  backHref?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};
```

Use it for:

- Money
- Find
- Goals
- Me
- Score
- Settings
- Notifications
- Transfer
- Wealth

### Native shell contract

Create `AppScreenShell`:

```ts
type AppScreenShellProps = {
  title: string;
  subtitle?: string;
  variant?: 'hero' | 'plain' | 'compact';
  showBack?: boolean;
  rightAction?: React.ReactNode;
  children: React.ReactNode;
};
```

Use it for:

- Dashboard
- Ledger/Money
- Catalogue/Find
- Goals
- Profile/Me
- Score
- Settings
- Notifications

### Shared data contracts

Expand shared types in `packages/shared/types/ui.ts` so web and mobile agree on:

- `MoneyOverview`
- `MoneyAccount`
- `MoneyTransaction`
- `CatalogueProductCard`
- `InstitutionSummary`
- `GoalOverview`
- `BudgetOverview`
- `BillReminder`
- `ProfileOverview`
- `ScoreOverview`
- `SettingsState`

This does not mean sharing UI code across web and native; it means sharing product data shape.

## Implementation Plan

### Phase 1: Stabilize API and user ownership

Exit criteria:

- Mobile goal creation no longer throws `Goal_userId_fkey`.
- User-owned APIs consistently work for web cookie sessions and mobile Bearer tokens.
- Existing web/mobile TypeScript still passes.

Tasks:

1. Add `getOrCreateDbUser(req)` in the Supabase auth adapter.
2. Update goals, accounts, transactions, budgets, bills, assets, dashboard, notifications, score, settings, profile-sensitive APIs to use it where appropriate.
3. Add defensive error responses for authenticated users without valid local records.
4. Retest mobile create-goal path.

### Phase 2: Shared navigation labels and route config

Exit criteria:

- Desktop sidebar, mobile web bottom nav, and native tabs use the same labels.
- `Plan`, `Dreams`, `Explore`, `Marketplace`, `Ledger`, and `Transactions` are removed from primary navigation labels unless intentionally used inside copy.

Tasks:

1. Add shared section config.
2. Update web `Sidebar` and `BottomNav`.
3. Update mobile `(tabs)/_layout.tsx` and screen titles.
4. Keep `/dreams` path but label it `Goals`.

### Phase 3: Shared shells

Exit criteria:

- Primary pages share the same header/content spacing model.
- Mobile web headers no longer jump between gradient, white sticky, and bespoke patterns without a reason.
- The top content region has consistent height and overlap behavior.

Tasks:

1. Build web `AppPageShell`.
2. Replace page-specific shells in Money, Find, Goals, Score, Me, Settings.
3. Build native `AppScreenShell`.
4. Replace native page-level custom headers.

### Phase 4: Feature parity

Exit criteria:

- Everything visible on desktop web has a mobile web and mobile app equivalent or an explicit documented exception.

Tasks by area:

Money:

- Mobile web and native show total balance, accounts, transactions, add transaction, transfer entry, filters, and spending summary.

Find:

- Mobile web and native show search, categories, institutions, product count, products, empty states, and product details.

Goals:

- Mobile web and native show budgets, bills, saving goals, add goal, and forecast/tips where available.

Me:

- Mobile web and native show identity, connected accounts, verification/profile status, Mizan Score entry, settings entry, and sign-out path.

Settings:

- Native app reaches parity with web Settings for account, currency, language, theme, notifications, security, data export, delete account, and sign out.

Score:

- Native app reads real score from API and shows impact factors/tips instead of hardcoded 785.

Notifications:

- Native app reads real API notifications instead of hardcoded examples.

### Phase 5: Marketplace performance

Exit criteria:

- Initial Find content appears without waiting for client-side product fetch on web.
- Product list API latency is materially lower.
- Mobile catalogue does not block on serial requests.

Tasks:

1. Convert web catalogue page to server-fetch initial products.
2. Add a lightweight product list selection.
3. Add or prepare `/api/v1/catalogue/bootstrap`.
4. Add pagination consistently.
5. Exclude public marketplace APIs from unnecessary middleware.
6. Re-measure `/catalogue`, `/api/v1/products?take=20`, and mobile catalogue first load.

### Phase 6: Bundle and rendering cleanup

Exit criteria:

- Heavy charts/motion are not on the first render path unless needed.
- First Load JS for Money/Wealth/Goals/Score is reduced where practical.

Tasks:

1. Dynamically import charts below the fold.
2. Remove unused imports.
3. Keep static sections as server components on web.
4. Replace feature-specific duplicate cards with shared card primitives.

### Phase 7: Verification

Exit criteria:

- Desktop web, mobile web, and native app pass a manual feature parity checklist.
- Core commands pass.
- Key timings are captured after changes.

Commands:

```bash
npm run lint
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
npm run build --workspace apps/web
```

Manual QA matrix:

- Desktop web: Home, Money, Find, Goals, Me, Score, Settings, Notifications.
- Mobile web viewport: same list.
- Expo app: same list.
- Mutations: add account, add transaction, add goal, settings update, profile update.
- Empty states: no accounts, no transactions, no goals, no products.
- Auth states: logged out, logged in with existing Prisma user, logged in without existing Prisma user.

## Priority Order

Recommended implementation order:

1. Fix user-row bootstrapping for protected APIs.
2. Standardize navigation labels and route config.
3. Build shared shells.
4. Bring Money, Find, Goals, Me to parity.
5. Optimize marketplace API and catalogue loading.
6. Bring Score, Settings, Notifications to parity.
7. Run full QA and update release docs.

This order prevents visual polish from sitting on top of broken data ownership or duplicated product definitions.

## Open Decisions

1. Should `/dreams` be kept as an internal route forever, or should `/goals` become the canonical route with `/dreams` redirecting?
2. Should mobile app use the Next.js API exclusively, or can selected read-only data come directly from Supabase?
3. Should marketplace list cards show match score for unauthenticated users, or only authenticated/personalized users?
4. Is data export/delete account required in native v1, or only web v1?
5. Should native app support the same desktop analytics views in compact form, or should analytics be a secondary detail screen?

