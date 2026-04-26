# Mizan Beta Smoke Checklist

Last updated: 2026-04-26

Use this before demos and after Sprint 1 money-loop changes. Keep it short enough to actually run.

## Web

- [ ] Sign up or log in.
- [ ] If redirected to onboarding, complete identity or skip optional goal/account steps.
- [ ] Open Home and confirm no `NaN`, `undefined`, broken totals, or empty chart crashes.
- [ ] Open Money.
- [ ] Add a manual account with a balance.
- [ ] Edit that account.
- [ ] Add a manual expense transaction.
- [ ] Edit that transaction.
- [ ] Delete that transaction.
- [ ] Add a second account and create a transfer.
- [ ] Open Goals.
- [ ] Add a savings goal.
- [ ] Edit that goal.
- [ ] Delete that goal.
- [ ] Add a bill reminder and mark it paid.
- [ ] Open Money and confirm the paid bill created a linked negative transaction.
- [ ] Mark that bill unpaid and confirm the linked transaction is removed.
- [ ] Skip a bill for this month and confirm it leaves no ledger transaction.
- [ ] Open Find and confirm products or a useful empty state.
- [ ] Open Me and confirm account balances render safely.

## Mobile

- [ ] Launch the app and complete or skip onboarding.
- [ ] On onboarding account setup, tap "Skip SMS import" and confirm manual setup remains available.
- [ ] Open Home and confirm the header clears the notch/status area.
- [ ] Open Money and confirm the header clears the notch/status area.
- [ ] Add a manual account.
- [ ] Add a manual transaction.
- [ ] Open Goals and confirm empty goals/bills/budgets render without `NaN`.
- [ ] Add a manual goal.
- [ ] Add a bill, mark it paid, and confirm it appears as paid.
- [ ] Skip a bill for this month and confirm it appears skipped.
- [ ] Open Find and confirm products or a useful empty state.
- [ ] Open Me and confirm the profile area is readable.

## Stop-Ship Checks

- [ ] No `NaN`, `undefined`, or raw database IDs visible in primary money cards.
- [ ] Failed create/edit/delete actions show a user-friendly error.
- [ ] Refreshing Money and Goals keeps newly created records.
- [ ] Logging out and back in does not break protected writes for a new user.
