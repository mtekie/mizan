# Backend Foundation Roadmap

Last updated: 2026-05-02

This document marks the handoff from visual parity work to functional backend work. The parity pass made the core surfaces feel like the same product across web and mobile. The next phase should make those surfaces dependable, persistent, authenticated, testable, and useful with real user data.

## Current Direction

Shift the main workstream from pixel tuning to foundations:

1. Keep the parity baseline stable.
2. Make every primary feature use shared backend contracts.
3. Harden auth, persistence, and mutation flows.
4. Add tests around the contracts and high-risk API routes.
5. Return to visual parity only when a real flow exposes a usability problem.

## Remaining Parity Work

Parity is no longer the main blocker, but these items remain worth tracking:

- Capture fresh web and native screenshots for Home, Money, Find, Goals, Me, Settings, Score, and Notifications.
- Finish visual tuning for Goals spacing, card density, chip wrapping, and scroll positions.
- Tune Me/Profile spacing, avatar sizing, score treatment, and Settings & Support density.
- Tune Settings section density and control layout across web and native.
- Confirm mobile web, desktop web, and Expo render the same product sections in the same order.
- Add a screenshot checklist using `?demo=1` fixtures before future UI-heavy work.

## Backend Foundation Priorities

### 1. Auth and User Bootstrap

- Make the Next.js API the canonical backend surface for web and mobile unless a route is explicitly documented otherwise.
- Standardize protected route auth through one helper that supports web cookies and mobile Bearer tokens.
- Ensure every authenticated Supabase user has a matching Prisma `User` row before write flows run.
- Add tests for user bootstrap around goals, accounts, transactions, budgets, bills, assets, profile, and settings.
- Decide launch auth providers: email/password, Google, Apple, phone OTP, or staged rollout.

### 2. Shared API Contracts

- Add API contract tests for Home, Money, Find, Goals, Me/Profile, Settings, Score, and Notifications.
- Replace remaining local recomputation in clients with shared screen contracts and view models.
- Keep formatting, percentages, status labels, empty states, and error copy in `packages/shared`.
- Add product detail and provider detail contracts for Find completion.
- Add `ScoreScreenDataContract` and `NotificationsScreenDataContract`.

### 3. Money and Transactions

- Make account creation, editing, and deletion reliable across web and mobile.
- Make transaction creation, categorization, editing, deletion, and receipt attachment reliable.
- Decide the transaction ingestion path per platform:
  - Android SMS import and parser accuracy.
  - iOS manual entry, file upload, statement import, email import, or deferred ingestion.
  - Web CSV/manual import.
- Add duplicate detection, confidence scoring, and reconciliation for imported transactions.
- Add tests for ledger totals, cash-flow summaries, monthly trend data, and linked bill transactions.

### 4. Goals, Budgets, and Bills

- Keep Goals as the planning home for budgets, bills, and savings goals.
- Restore deeper management affordances through a focused detail/edit flow rather than always-visible edit/delete buttons on cards.
- Make budget templates, category creation, monthly rollover, and category updates reliable across web and mobile.
- Make bill creation, skip-this-month, mark-paid, mark-unpaid, and ledger-link behavior test-covered.
- Add savings goal creation, contribution, progress, deadline, and completion states across web and mobile.
- Add notification hooks for upcoming bills and goal progress.

### 5. Find and Marketplace

- Finish provider and product detail contract coverage.
- Make bookmarks, reviews, applications, and compare flows persist against real schema fields.
- Keep product source/freshness metadata visible and admin-editable.
- Finish taxonomy, tags, provider, and product admin CRUD from `docs/AdminPlan.md`.
- Add repeatable import/seed tooling for marketplace data from scripts or spreadsheets.
- Add matching tests for eligibility, sector/demographic tags, geography, product class, and ranking.

### 6. Profile, Settings, and Trust

- Persist profile fields from both web and mobile through shared API routes.
- Keep profile completeness and nudges driven by shared logic.
- Finish settings persistence for currency, language, theme, notifications, security, privacy, and data export.
- Define account deletion and data export behavior before launch.
- Add audit-friendly logging for high-risk account and data changes.

### 7. Score and Verification

- Add API tests for the Mizan Score engine and profile completion logic.
- Build the verification prototype: self-declared, linked account, document/photo, or other proof levels.
- Store verification status and evidence metadata without overexposing sensitive documents.
- Make Score explainability consistent across web and mobile.
- Define which score signals are MVP, beta-only, or future.

### 8. Notifications

- Add a notifications contract and API route.
- Support bill reminders, budget alerts, goal progress, product updates, and onboarding nudges.
- Decide push notification strategy for Android and iOS.
- Respect notification preferences from Settings.

### 9. Observability, Tests, and Release Readiness

- Add focused integration checks for high-risk routes.
- Add CI coverage for lint, typecheck, build, Prisma validation, and contract tests.
- Add error logging and analytics events for onboarding, Money, Goals, Find, and Settings.
- Document environment variables and deployment runbooks.
- Move from `db:push` on disposable environments to reviewed migrations before real production data.
- Prepare privacy policy, terms, Play Store disclosures, App Store privacy details, and backup/rollback notes.

## Feature Backlog To Preserve

These planned features should remain visible while backend work proceeds:

- Manual accounts and transactions.
- Android SMS transaction import.
- iOS transaction ingestion alternative.
- Receipt scanning.
- Budgets and budget templates.
- Bill reminders with paid/unpaid/skipped states.
- Savings goals and contributions.
- Mizan Score and explainability.
- Profile completeness nudges.
- Find marketplace, provider directory, product detail, matching, bookmarks, reviews, applications, and compare.
- Admin taxonomy/provider/product CRUD.
- Marketplace import and data-quality tooling.
- Notifications and preferences.
- Data export and account deletion.
- Verification levels and trust signals.

## Recommended Next Sprint

Start with backend flows that unlock real usage:

1. Auth/user bootstrap tests and fixes.
2. Goals mutation contract hardening.
3. Money transaction/account persistence hardening.
4. Find product/provider detail contracts.
5. Settings persistence and notifications contract.

This keeps the product moving from "looks aligned" to "works reliably."
