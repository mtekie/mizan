# Web And Native UI Parity Repair Plan

Last updated: 2026-04-26

## Purpose

The screenshots from 2026-04-26 show the browser app and Expo native app presenting the same Mizan tabs as noticeably different products. This document explains why that happened, defines the target architecture, and gives junior developers concrete implementation instructions.

The goal is not pixel-perfect equality between web and native. The goal is product parity: the same tab should communicate the same purpose, show the same core sections in the same order, expose the same primary actions, and use the same design rules.

## Executive Analysis

The mismatch is systemic, not a one-screen styling bug.

Mizan currently has shared navigation labels and shared design tokens, but the primary screens are still implemented as separate product surfaces:

- Web uses `apps/web/components/AppPageShell.tsx`.
- Native uses `apps/mobile/components/ui/AppScreenShell.tsx`.
- Web Money, Find, Goals, and Me render richer feature sets than native in some places.
- Native uses its own screen layouts, local mock data, local section ordering, and hardcoded summaries in several places.
- Some screens use `hero` headers on web but plain headers on native, or plain native headers where web uses a large green header.
- Some web pages contain nested layout wrappers inside `AppPageShell`, creating inconsistent margins and content offsets.
- Guest/demo data is duplicated inside native screens instead of coming from a shared fixture contract.

This creates the user-facing effect seen in the screenshots: two interfaces that look related, but not like the same app.

## Relevant Existing Files

Shared foundations:

- `packages/ui-tokens/index.ts`: colors, spacing, radii, typography.
- `packages/shared/constants/navigation.ts`: canonical tab labels, web routes, native routes, nav icons.
- `packages/shared/formatters.ts`: money and percentage formatting.
- `packages/shared/logic/profile.ts`: profile completeness logic.
- `packages/shared/engine/score.ts`: Mizan Score logic.

Web surfaces:

- `apps/web/components/AppPageShell.tsx`
- `apps/web/components/BottomNav.tsx`
- `apps/web/app/DashboardClient.tsx`
- `apps/web/app/ledger/LedgerClient.tsx`
- `apps/web/app/catalogue/CatalogueClient.tsx`
- `apps/web/app/dreams/DreamsClient.tsx`
- `apps/web/app/profile/ProfileClient.tsx`

Native surfaces:

- `apps/mobile/components/ui/AppScreenShell.tsx`
- `apps/mobile/components/ui/BottomTabBar.tsx`
- `apps/mobile/app/(tabs)/index.tsx`
- `apps/mobile/app/(tabs)/ledger.tsx`
- `apps/mobile/app/(tabs)/catalogue.tsx`
- `apps/mobile/app/(tabs)/goals.tsx`
- `apps/mobile/app/(tabs)/profile.tsx`

Existing analysis to read first:

- `docs/CONSISTENCY_PERFORMANCE_AUDIT.md`
- `docs/ROUTE_INVENTORY.md`

## Target Architecture

### Layer 1: Shared Product Contract

Create a shared contract that defines each user-facing tab independently from React or React Native components.

Recommended new file:

- `packages/shared/constants/app-surfaces.ts`

The file should define:

```ts
export type SurfaceSectionKey =
  | 'profile_status'
  | 'quick_actions'
  | 'recent_transactions'
  | 'money_summary'
  | 'accounts'
  | 'spending_summary'
  | 'product_search'
  | 'product_categories'
  | 'institutions'
  | 'product_list'
  | 'budget_overview'
  | 'bill_reminders'
  | 'savings_goals'
  | 'profile_identity'
  | 'mizan_score'
  | 'security_privacy';

export const appSurfaceContracts = {
  home: {
    title: 'Home',
    headerVariant: 'hero',
    sections: ['profile_status', 'quick_actions', 'recent_transactions'],
  },
  money: {
    title: 'Money',
    headerVariant: 'hero',
    sections: ['money_summary', 'accounts', 'spending_summary', 'recent_transactions'],
    primaryActions: ['add_account', 'add_transaction', 'transfer'],
  },
  find: {
    title: 'Find',
    headerVariant: 'hero',
    sections: ['product_search', 'product_categories', 'institutions', 'product_list'],
  },
  goals: {
    title: 'Goals',
    headerVariant: 'plain',
    sections: ['budget_overview', 'bill_reminders', 'savings_goals'],
    primaryActions: ['log_expense', 'add_goal'],
  },
  me: {
    title: 'Me',
    headerVariant: 'hero',
    sections: ['profile_identity', 'mizan_score', 'accounts', 'security_privacy'],
    primaryActions: ['settings'],
  },
} as const;
```

This contract is the source of truth for labels, section order, header variant, and primary actions. Web and native components should import from it.

### Layer 2: Shared View Models

Do not try to share JSX between Next.js and Expo. Share data shapes and calculations instead.

Recommended new files:

- `packages/shared/view-models/money.ts`
- `packages/shared/view-models/goals.ts`
- `packages/shared/view-models/profile.ts`
- `packages/shared/view-models/catalogue.ts`

Each view model should normalize raw API data into display-ready data.

Example responsibilities:

- Convert null balances to `0`.
- Calculate total balance, monthly in, monthly out, savings rate.
- Group transactions by date.
- Calculate budget progress and remaining budget.
- Normalize product card titles, provider names, rates, verification labels, and match score.
- Normalize profile display name, email, score label, and account count.

This prevents web and native from inventing different calculations.

### Layer 3: Platform Shells With Matching Props

Keep separate shells, but make their props and behavior equivalent.

Web:

- `apps/web/components/AppPageShell.tsx`

Native:

- `apps/mobile/components/ui/AppScreenShell.tsx`

Both shells should support:

- `title`
- `subtitle`
- `variant: 'hero' | 'plain' | 'compact'`
- `showBack`
- `primaryAction`
- `secondaryActions`
- `children`
- `scrollable`

Shells own:

- safe-area padding
- header height
- title size
- action alignment
- page background
- bottom-nav spacing
- content max width
- standard section gap

Feature screens should not create their own top-level safe-area/header behavior.

### Layer 4: Platform Components

Components can remain platform-specific, but names and responsibilities should match.

Recommended structure:

```text
apps/web/components/surfaces/
  MoneySummary.tsx
  AccountStrip.tsx
  SpendingSummary.tsx
  TransactionList.tsx
  ProductFilters.tsx
  ProductList.tsx
  BudgetOverview.tsx
  BillReminderList.tsx
  SavingsGoalList.tsx
  ProfileIdentityCard.tsx
  SecurityPrivacyCard.tsx

apps/mobile/components/surfaces/
  MoneySummary.tsx
  AccountStrip.tsx
  SpendingSummary.tsx
  TransactionList.tsx
  ProductFilters.tsx
  ProductList.tsx
  BudgetOverview.tsx
  BillReminderList.tsx
  SavingsGoalList.tsx
  ProfileIdentityCard.tsx
  SecurityPrivacyCard.tsx
```

The implementations can differ for platform ergonomics, but each pair must accept the same normalized view model where possible.

## Design Rules

Use these rules for every primary tab.

1. Use canonical labels from `packages/shared/constants/navigation.ts`.
2. Do not rename user-facing tabs. Use Home, Money, Find, Goals, Me.
3. Use the same shell variant per tab from `appSurfaceContracts`.
4. Do not build custom headers inside feature screens.
5. Do not use separate mock data in individual screens. Put guest fixtures in shared fixtures.
6. Keep card radius consistent. Current token target is `MizanRadii.md` or `MizanRadii.lg`; avoid oversized `24px` cards unless already required by the shell.
7. Use the same empty-state text for the same missing data condition.
8. Keep action semantics identical. If web has Add Account on Money, native Money must also have Add Account.
9. Web may use wider layouts on desktop, but mobile web and native should preserve the same section order.
10. Native may use native controls, but it should not omit the feature unless there is a written product decision.

## Phase Plan

### Phase 0: Baseline And Ownership

Estimate: 0.5 day

Instructions:

1. Create a branch named `codex/ui-parity-foundation` or equivalent.
2. Capture current screenshots for Home, Money, Find, Goals, and Me on:
   - browser mobile width
   - browser desktop width
   - Expo Android emulator
3. Save screenshots outside the repo or in a clearly ignored folder.
4. Assign one developer as parity owner for each tab.

Deliverable:

- A short issue or checklist with baseline screenshot links and assigned owners.

Acceptance criteria:

- Every primary tab has before screenshots.
- Every primary tab has a named owner.

### Phase 1: Shared Contracts And Fixtures

Estimate: 1-2 days

Files to create:

- `packages/shared/constants/app-surfaces.ts`
- `packages/shared/fixtures/demo.ts`
- optional `packages/shared/view-models/*`

Instructions:

1. Add `appSurfaceContracts` with title, header variant, section order, and actions.
2. Export it from `packages/shared/index.ts`.
3. Move repeated guest/demo data from native screens into `packages/shared/fixtures/demo.ts`.
4. Do not change UI yet except imports needed to compile.
5. Add simple TypeScript types for screen keys, actions, and section keys.

Acceptance criteria:

- Web and native can import the same app surface contract.
- Native screens no longer define large local mock arrays for Money, Goals, Find, or Me.
- TypeScript compiles for shared package consumers.

### Phase 2: Shell Alignment

Estimate: 1-2 days

Files:

- `apps/web/components/AppPageShell.tsx`
- `apps/mobile/components/ui/AppScreenShell.tsx`
- affected screen imports

Instructions:

1. Match prop names between web and native shells.
2. Add `compact` variant to native shell.
3. Standardize hero header height and background behavior.
4. Standardize plain header behavior.
5. Remove nested `<main>` wrappers inside pages that already use `AppPageShell`.
6. Ensure bottom nav does not overlap content.
7. Ensure page content starts consistently below the header.

Acceptance criteria:

- Header height and action alignment are consistent across primary tabs.
- No screen has a second custom top-level header inside the shell.
- Mobile web and native use the same tab title and similar vertical rhythm.

### Phase 3: Money Parity

Estimate: 1.5-2 days

Files:

- `apps/web/app/ledger/LedgerClient.tsx`
- `apps/mobile/app/(tabs)/ledger.tsx`
- shared money view model if created

Target section order:

1. Money summary
2. Accounts
3. Spending summary
4. Recent transactions

Required actions:

- Add Account
- Add Transaction
- Transfer
- Filter

Instructions:

1. Use one shared money summary calculation.
2. Replace hardcoded native spending summary values with derived values or explicit empty state.
3. Make account cards/pills communicate the same fields: name, type/source, balance.
4. Ensure transaction rows show title, category/source, date, and signed amount consistently.
5. If native cannot support a web-only detail interaction yet, show the action disabled or hidden only with a comment and issue link.

Acceptance criteria:

- Browser mobile and native Money have the same section order.
- Both show balance, accounts, spending summary, and recent transactions.
- Both expose add account and add transaction.
- No hardcoded transaction summary numbers remain inside the screen component.

### Phase 4: Find Parity

Estimate: 1.5-2 days

Files:

- `apps/web/app/catalogue/CatalogueClient.tsx`
- `apps/mobile/app/(tabs)/catalogue.tsx`
- product card components on both platforms

Target section order:

1. Search
2. Product categories
3. Institution filters
4. Secondary filters
5. Product count
6. Product list

Instructions:

1. Use title `Find` everywhere.
2. Keep search visible on mobile web and native.
3. Align category labels from `productCategories`.
4. Align institution/provider filter behavior.
5. Product cards must show product name, provider, product class/type, match score, verification state, and key rate/fee if available.
6. Avoid separate featured-first native behavior unless web also uses it in the same section order.

Acceptance criteria:

- Same filters are available on mobile web and native.
- Same product count logic is visible.
- Product card information hierarchy matches.

### Phase 5: Goals Parity

Estimate: 2-3 days

Files:

- `apps/web/app/dreams/DreamsClient.tsx`
- `apps/mobile/app/(tabs)/goals.tsx`
- bill and goal form components

Target section order:

1. Monthly budget overview
2. Bill reminders
3. Budget forecast or insight
4. Savings goals
5. Quick stats

Required actions:

- Log expense
- Add goal
- Add bill
- Add contribution

Instructions:

1. Keep user-facing label `Goals` even though web route is `/dreams`.
2. Align budget overview fields: spent, total budget, remaining, progress.
3. Align bill reminders: paid, skipped, due, amount.
4. Align savings goal card fields: name, saved, target, progress, contribution action.
5. Handle empty budgets, bills, and goals without `NaN`.
6. Do not duplicate bill status logic; move repeated logic to shared helpers if needed.

Acceptance criteria:

- Browser and native Goals communicate the same product concept: budgets, bills, and savings goals.
- Empty state is useful when no budget, bills, or goals exist.
- Add goal works for authenticated users and guest users.

### Phase 6: Me Parity

Estimate: 1.5-2 days

Files:

- `apps/web/app/profile/ProfileClient.tsx`
- `apps/mobile/app/(tabs)/profile.tsx`
- settings links and score entry points

Target section order:

1. Profile identity
2. Verification/profile completeness
3. Mizan Score
4. Connected accounts
5. Security and privacy
6. Settings/support/legal links

Required actions:

- Edit profile or complete profile
- Settings
- Add account
- Open Mizan Score
- Sign out

Instructions:

1. Use the same display name fallback.
2. Use the same score label logic.
3. Show account balances in native if data includes balances.
4. Put Settings in the header action on both platforms.
5. Keep support/legal links, but do not let them replace the main identity/account/score sections.

Acceptance criteria:

- Native Me is not just a menu screen.
- Web and native both show identity, score, accounts, and security/privacy.
- Settings remains reachable from Me.

### Phase 7: Home Parity

Estimate: 1.5-2 days

Files:

- `apps/web/app/DashboardClient.tsx`
- `apps/mobile/app/(tabs)/index.tsx`

Target section order:

1. Profile status
2. Automation or account connection prompt
3. Mizan Score
4. Quick actions
5. Insight/nudge
6. Recent transactions

Instructions:

1. Align title to `Home` or a deliberate dashboard phrase from the contract.
2. Do not use `Overview` on one platform and `This Month` on the other unless the contract says so.
3. Align quick action labels and destinations.
4. Use the same profile completeness calculation.
5. Use the same recent transaction row fields as Money.

Acceptance criteria:

- Home feels like the same dashboard on both platforms.
- Profile progress and Mizan Score match the same user data.
- Quick actions are consistent.

### Phase 8: Visual QA And Regression Checklist

Estimate: 1 day

Instructions:

1. Run both apps locally.
2. Capture screenshots for all five tabs on browser mobile, browser desktop, and native emulator.
3. Compare against the acceptance checklist below.
4. Fix visible overlaps, missing sections, wrong labels, and data mismatches before merging.

Verification commands:

```bash
npm exec --workspace apps/web tsc -- --noEmit
npm exec --workspace apps/mobile tsc -- --noEmit
npm run lint
npm run build --workspace apps/web
```

If a command fails because of unrelated existing work, document it in the PR and include the failure output.

## Junior Developer Instructions

Use this workflow for every task.

1. Read this document, `docs/CONSISTENCY_PERFORMANCE_AUDIT.md`, and `docs/ROUTE_INVENTORY.md`.
2. Pick one phase or one tab. Do not touch unrelated tabs.
3. Start by identifying the web file and native file for the same tab.
4. Compare the section order against this document.
5. Update shared constants or view models first if the same rule is needed on both platforms.
6. Update web and native surfaces second.
7. Keep edits small and reviewable.
8. Do not delete features from web just because native lacks them. Bring native up to parity unless the product owner says otherwise.
9. Do not add new colors, radii, or typography sizes unless there is no token for the need.
10. Before opening a PR, capture before/after screenshots and paste them into the PR.

## PR Template For This Work

Each PR should include:

```md
## Scope

- Tab or phase:
- Web files changed:
- Native files changed:
- Shared files changed:

## What Changed

- 

## Parity Checklist

- [ ] Same tab label on web and native
- [ ] Same header variant
- [ ] Same section order
- [ ] Same primary actions
- [ ] Same empty state behavior
- [ ] No local mock data added to screen files
- [ ] No custom top-level header added inside a shell

## Screenshots

- Web mobile:
- Web desktop:
- Native:

## Verification

- [ ] `npm exec --workspace apps/web tsc -- --noEmit`
- [ ] `npm exec --workspace apps/mobile tsc -- --noEmit`
- [ ] `npm run lint`
- [ ] `npm run build --workspace apps/web`
```

## Acceptance Checklist By Tab

### Home

- [ ] Same title strategy.
- [ ] Same profile completeness value.
- [ ] Same Mizan Score entry point.
- [ ] Same quick actions.
- [ ] Same recent transaction presentation.

### Money

- [ ] Same money summary fields.
- [ ] Same account display fields.
- [ ] Same add account/add transaction/transfer actions.
- [ ] Same recent activity row hierarchy.
- [ ] No hardcoded spending summary values.

### Find

- [ ] Same search visibility.
- [ ] Same category labels.
- [ ] Same institution/provider filters.
- [ ] Same secondary filters.
- [ ] Same product card information hierarchy.

### Goals

- [ ] Same budget overview fields.
- [ ] Same bill reminder states.
- [ ] Same savings goal card fields.
- [ ] Same add bill/add goal/add contribution actions.
- [ ] No `NaN` or broken empty states.

### Me

- [ ] Same profile identity content.
- [ ] Same profile completion or verification status.
- [ ] Same Mizan Score label/value logic.
- [ ] Same connected account fields.
- [ ] Same security/settings entry points.

## Effort Estimate

Minimum visual alignment:

- 3-5 developer days.
- Makes screenshots look more consistent.
- Does not fully prevent future drift.

Recommended product parity pass:

- 8-13 developer days.
- Establishes shared contracts, aligned shells, and five-tab parity.
- This is the recommended option.

Hardened release-quality pass:

- 12-18 developer days.
- Adds stronger QA, screenshot review, more refactoring into view models, and regression protection.

Suggested staffing:

- 1 lead developer for architecture and review.
- 2 junior developers for tab implementation.
- 1 QA/product reviewer for screenshot acceptance.

Suggested sequence:

1. Lead: Phase 1 and Phase 2.
2. Junior A: Money and Find.
3. Junior B: Goals and Me.
4. Lead or Junior A: Home.
5. QA/product reviewer: Phase 8.

## Risk Notes

- The biggest risk is doing one-off visual patches without creating the shared contract. That will make the current screenshots better but allow the next screen to drift again.
- The second biggest risk is removing web functionality to match native. Do not reduce the product. Bring native up to the intended feature contract.
- The third biggest risk is local mock data. If mock data remains in screen files, the apps will keep showing different states.
- Header overlap and bottom navigation overlap must be checked on real emulator dimensions, not only desktop browser responsive mode.

## Definition Of Done

This work is done when:

1. All five primary tabs use the canonical contract.
2. Web and native shells expose matching props and variants.
3. Each primary tab has the same section order on browser mobile and native.
4. Each primary tab has the same primary actions.
5. Shared calculations are no longer reimplemented differently per platform.
6. Before/after screenshots show a coherent product across web and native.
7. TypeScript, lint, and web build pass or have clearly documented unrelated failures.
