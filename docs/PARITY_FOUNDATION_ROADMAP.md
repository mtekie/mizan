# Parity Foundation Roadmap

This is the implementation plan for `docs/ADR_CROSS_PLATFORM_PARITY_ARCHITECTURE.md`.

## Current Decision

Do not rebuild from scratch yet. Stabilize the shared contract layer, then migrate screens one by one. Reconsider Tamagui, gluestack-ui, or a full Expo universal rebuild only after the contract layer proves whether the current architecture can stay disciplined.

## Foundation Rules

- `packages/shared` owns product facts: contracts, view-models, schemas, fixtures, formatting, and asset registry metadata.
- `packages/ui-tokens` owns visual tokens.
- `apps/web` and `apps/mobile` render platform UI, but should not recalculate product facts independently.
- Every cross-platform screen must have one exported screen data contract.
- Every provider/account/product visual should resolve through the asset registry.

## Started

- `packages/shared/assets/index.ts`
  Shared registry for provider, account type, and product category visual metadata.

- `packages/shared/contracts/index.ts`
  Shared `MoneyScreenDataContract`, typed Money view-model schemas, `MoneyScreenApiResponseSchema`, and `buildMoneyScreenDataContract`.

- `apps/web/app/api/v1/ledger/route.ts`
  Shared Money API endpoint for authenticated native/web clients. It returns raw accounts, raw transactions, and the computed Money screen contract.

- `packages/shared/view-models/index.ts`
  Account view-models now resolve color, text color, icon key, and type label through the asset registry.

- `apps/mobile/app/(tabs)/ledger.tsx`
  Money tab now consumes `buildMoneyScreenDataContract` and fetches authenticated Money data through `/api/v1/ledger`.

- `apps/web/app/ledger/LedgerClient.tsx`
  Money tab now consumes `buildMoneyScreenDataContract` and uses server-provided monthly trend data instead of hardcoded trend values.

- `apps/web/lib/server/money-contract.ts`
  Web Money SSR and `/api/v1/ledger` now share the same authenticated Money contract loader.

- `apps/web/app/ledger/LedgerClient.tsx` and `apps/mobile/app/(tabs)/ledger.tsx`
  Account tiles now render icons from shared account registry keys instead of local account-type guesses.

- `MoneyScreenDataContract.states`
  Web and native Money now consume shared empty, loading, and error state copy for account and transaction sections.

- `HomeScreenDataContract`
  Shared Home profile, score, money summary, budget summary, recent transactions, spending, top goal, insights, quick actions, cash-flow points, and empty state copy.

- `apps/web/lib/server/home-contract.ts`
  Web Home SSR and `/api/v1/dashboard` now share the same authenticated Home contract loader.

- `apps/web/app/DashboardClient.tsx` and `apps/mobile/app/(tabs)/index.tsx`
  Home now consumes the shared Home contract for score, quick actions, insight copy, recent activity, and summary values.

- `apps/web/app/page.tsx` and `apps/web/app/DashboardClient.tsx`
  Web Home no longer passes legacy `summary`, `transactions`, or `featuredProducts` adapter props; the client reads directly from `HomeScreenDataContract`.

- `apps/mobile/app/(tabs)/index.tsx`
  Native Home now uses `HomeScreenDataContract.states` for initial loading and retryable first-load error states.

- `FindScreenDataContract`
  Shared Find categories, provider visuals/counts, featured products, product count, match labels, and empty/loading/error copy.

- `apps/web/lib/server/find-contract.ts`
  Web Find SSR and `/api/v1/catalogue/bootstrap` now share the same catalogue bootstrap contract loader.

- `apps/web/app/catalogue/*` and `apps/mobile/app/(tabs)/catalogue.tsx`
  Find now consumes shared bootstrap metadata/state copy while preserving native pagination and web filtering.

- `GoalsScreenDataContract`
  Shared Goals budget overview, goals, quick stats, bills, forecast text, and empty/loading/error copy.

- `apps/web/lib/server/goals-contract.ts` and `apps/web/app/api/v1/goals-screen/route.ts`
  Web Goals SSR and native Goals now have a shared read-only screen contract while keeping existing mutation APIs.

- `ProfileScreenDataContract`
  Shared Me/Profile identity, connected account view models, and profile/account state copy.

- `apps/web/lib/server/profile-contract.ts` and `apps/web/app/api/v1/profile-screen/route.ts`
  Web Me SSR and native Me now have a shared read-only screen contract while keeping existing profile update APIs.

## Next Migration Order

1. Money
   - Expand shared API response schemas beyond Money into Home, Find, Goals, and Me.

2. Home
   - Add Home API contract tests once the test harness exists.

3. Find
   - Move native category pill rendering to `FindScreenDataContract.categories`.
   - Gradually route product card display fields through `FindProductVM`.

4. Goals
   - Replace remaining local web/native recomputation with `GoalsScreenDataContract` fields after mutation flows update state through the contract.
   - Add Goals API contract tests once the test harness exists.

5. Me
   - Route native/web account icons through shared registry keys in Me account rows.
   - Add Profile API contract tests once the test harness exists.

6. Hidden / secondary routes
   - Track full route coverage in `docs/HIDDEN_ROUTE_CONTRACT_COVERAGE.md`.
   - Add `NotificationsScreenDataContract`.
   - Add `ScoreScreenDataContract`.
   - Add product detail and provider detail contracts for Find completion.

## Enforcement To Add

- Static check for hardcoded colors outside token/asset files.
- Static check for direct money/percent formatting outside `packages/shared`.
- Screenshot parity checklist using fixed fixtures.
- API contract tests using shared schemas.

## When To Consider A UI Library

Evaluate Tamagui or gluestack-ui only if:

- shared components become difficult to maintain;
- platform-specific files multiply too much;
- design tokens cannot be enforced cleanly;
- app surfaces need more shared rendering than contracts can provide.

Do not adopt a new UI library only to fix current screenshots. Data and contract drift must be solved first.
