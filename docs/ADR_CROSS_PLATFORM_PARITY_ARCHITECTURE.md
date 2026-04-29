# ADR: Cross-Platform Parity Architecture

Date: 2026-04-28

Status: Accepted for implementation

## Context

Mizan has a Next.js web app and an Expo React Native app. The product needs to support mobile web, Android, and iOS without letting each platform invent its own data, visuals, assets, or screen hierarchy.

Recent comparison screenshots showed three classes of drift:

- Data drift: score, profile progress, product counts, balances, budgets, and goals differed by platform.
- Visual drift: cards, headers, account colors, filters, and list layouts followed similar ideas but different rules.
- State drift: native could show guest/onboarding/modals while web showed authenticated dashboard data.

The goal is design parity, not exact pixel parity. The same user should see the same facts, vocabulary, actions, and product hierarchy on every platform.

## Options Considered

### Option 1: Keep Current Apps And Add Shared Contracts

Keep `apps/web` as Next.js and `apps/mobile` as Expo. Move shared logic into `packages/shared`: screen contracts, API schemas, view-models, formatting, score rules, product vocabulary, and fixture data.

Pros:

- Lowest rewrite risk.
- Preserves existing web backend, Prisma, auth, admin, and Expo app work.
- Works for future iOS because Expo already targets iOS and Android.
- Lets each platform use native rendering while sharing product facts.

Cons:

- Still requires two UI implementations.
- Needs enforcement through tests and review.

Decision: use this as the base architecture.

### Option 2: Add A Shared UI Layer

Create shared component contracts and/or components for headers, cards, buttons, chips, list items, metric cards, empty states, and error states. Platform files such as `Card.web.tsx` and `Card.native.tsx` may be used where necessary.

Pros:

- Stronger visual enforcement.
- Keeps platform-specific rendering where useful.
- Gradual migration is possible.

Cons:

- Requires careful component boundaries.
- Too much abstraction can slow down feature work.

Decision: use after the shared contracts are stable.

### Option 3: Adopt Tamagui

Use Tamagui as a universal React Native/web design system.

Pros:

- Strong universal UI story.
- Good theming and compiler support.
- Designed for React Native plus web.

Cons:

- Meaningful migration cost.
- Would touch many screens.
- Introduces a new styling model.

Decision: evaluate later, do not start here.

### Option 4: Adopt gluestack-ui or NativeWind

Use a universal component/styling system built around React Native, web, and Tailwind-like styling.

Pros:

- Broad component coverage.
- Good web/native portability.
- Could accelerate a UI reset.

Cons:

- Could become a second design system unless carefully governed.
- Still does not solve data contracts by itself.

Decision: evaluate later if our own shared UI layer becomes too expensive.

### Option 5: Use React Native Web For One App Surface

Render native-style screens on web through React Native for Web.

Pros:

- Very strong parity for phone-style app screens.
- Natural path to iOS/Android.

Cons:

- Web/admin features may lose Next.js ergonomics.
- Not all CSS/web behaviors map directly to React Native styles.

Decision: possible long-term direction for app surfaces only, not for the whole product right now.

### Option 6: Full Rebuild As One Expo Universal App

Restart the product as one Expo app for Android, iOS, and web.

Pros:

- Maximum shared UI code.
- Clean mental model.

Cons:

- Highest risk.
- Would require rebuilding or relocating server routes, admin workflows, auth, and data integration.

Decision: reject for now.

### Option 7: Documentation And QA Only

Write standards and compare screenshots without code enforcement.

Pros:

- Fast.
- Improves communication.

Cons:

- Drift will return.
- Does not prevent hardcoded values, duplicate assets, or divergent API assumptions.

Decision: use as support, not as the architecture.

## Decision

Mizan will use a shared-contract architecture:

```text
apps/web        Next.js UI, SSR, admin, API routes
apps/mobile     Expo native app for Android and iOS
packages/shared Product contracts, schemas, fixtures, view-models, formatting, assets registry
packages/ui-tokens Design tokens consumed by both platforms
future packages/ui Shared component layer after contracts stabilize
```

Rules:

- Screens consume shared view-models instead of recalculating product facts in components.
- Assets come from the shared asset registry, not ad hoc color/icon choices in screens.
- API responses used by both apps must have shared schemas/contracts.
- Money/date/percent/score formatting comes from shared helpers.
- Raw developer errors must not reach production UI.
- Demo/parity fixtures are test baselines, not the final product path.
- Normal routes should use authenticated live data and the same contracts.

## Implementation Phases

### Phase 1: Foundation

- Add shared asset registry.
- Add shared screen data contracts for Home, Money, Find, Goals, and Me.
- Wire Money account visuals through the registry.
- Document the migration path.

### Phase 2: Money Pilot

- Make web Money and native Money consume the same `MoneyScreenContract`.
- Ensure balances, monthly in/out, savings rate, accounts, transactions, and spending categories match for the same authenticated user.
- Add empty/error/loading state parity.

### Phase 3: Remaining Tabs

Migrate Home, Find, Goals, and Me to the same pattern.

### Phase 4: UI Package

Introduce `packages/ui` only after the contracts settle.

### Phase 5: iOS Hardening

Validate iOS-specific safe areas, permissions, authentication, and native assets without changing product contracts.
