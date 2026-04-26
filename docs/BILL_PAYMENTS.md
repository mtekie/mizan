# Bill Payments

Last updated: 2026-04-26

Bills live in Goals and can optionally write to Money when the user marks a bill as paid.

## Ledger Link

- `Bill` has many linked `Transaction` records.
- `Transaction.billId` points back to the bill that created it.
- Marking a bill paid creates one negative transaction for the current month.
- The generated transaction uses:
  - `title`: `Paid {bill.name}`
  - `amount`: negative bill amount
  - `source`: `Bill Reminder`
  - `category`: bill category
- Re-marking the same bill paid in the same month does not create duplicates.
- Marking a bill unpaid removes the current-month linked bill payment transaction.

## Skip This Month

- Skipping a bill sets `Bill.lastSkipped` for the current month.
- Skipped bills stay as recurring reminders, but they are excluded from current due totals.
- Skipping does not create a ledger transaction.
- If a previously paid bill is skipped for the month, the current-month linked payment transaction is removed.
- Paying a skipped bill clears the skipped state and creates the linked payment transaction.

## Upcoming Bill Notification Design

- Generate upcoming bill notifications from unpaid, unskipped bills only.
- Suggested reminder windows: due today, due tomorrow, and overdue.
- Notification payload should avoid sensitive account details and include only bill name, due timing, and amount.
- Notification records should be idempotent per bill, month, and reminder window.
- Paid or skipped bills should suppress new reminders for the current month.
