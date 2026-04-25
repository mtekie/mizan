# Mizan Route Inventory

Planning checkpoint for the web app route map and feature-functionality pass.

## Primary App Tabs

These are the bottom-nav destinations on mobile and the core user flows on desktop.

| Product area | Current route | Notes |
| --- | --- | --- |
| Home | `/` | Dashboard, profile status, recent transactions, budgets, quick actions, featured products. |
| Money | `/ledger` | Accounts and transactions. Mobile currently swaps to `SimpleLedger`; desktop uses `LedgerClient`. |
| Find | `/catalogue` | Marketplace entry point. Should show products by default and support filters/search/institutions. |
| Goals | `/dreams` | Budgets, goals, and bill reminders are grouped here. Needs naming review because "Dreams" and "Goals" are mixed. |
| Me | `/profile` | Identity hub and connected accounts. Should become the canonical place to review profile completeness. |

## Secondary Routes

These should remain reachable from primary flows, but do not need bottom-nav placement.

| Product area | Current route | Suggested entry point |
| --- | --- | --- |
| Settings | `/settings` | From Me. Preferences, security, notification settings, data export, account deletion. |
| Mizan Score | `/score` | From Home quick action, Profile/Me, and product matching explanations. |
| Transfer | `/transfer` | From Home quick action and Money. |
| Notifications | `/notifications` | From Home header and settings preferences. |
| Tips | `/tips` | From insights cards or future AI hub. |
| Wealth | `/wealth`, `/wealth/[symbol]` | From Money or future investing/wealth section. |

## Admin Routes

Admin routes are operational tools and should stay outside the consumer app shell.

| Area | Current route |
| --- | --- |
| Admin overview | `/admin` |
| Users | `/admin/users` |
| Products | `/admin/products` |
| Providers | `/admin/providers` |
| Taxonomy | `/admin/taxonomy` |
| Moderation | `/admin/moderation` |

## Merge Candidates

| Current surface | Issue | Direction |
| --- | --- | --- |
| `/onboarding` | Main onboarding collects identity, goals, and accounts, but profile details are collected elsewhere. | Keep as first-run setup, save step-by-step, and avoid marking full profile complete until required fields are present. |
| `/score?action=complete-profile` | Uses onboarding profile/persona steps inside a modal, separate from `/onboarding`. | Convert into a reusable profile completion flow used by Score and Me. |
| `SmartProfilePrompt` | Progressive prompt updates the same profile fields but appears independently. | Keep as a lightweight nudge that writes to the same canonical profile fields and respects completed fields. |
| `/profile` edit link to `/onboarding` | Editing an existing profile restarts onboarding. | Route to a profile editor or profile completion flow instead. |
| `/dreams` naming | The route name and product label differ from bottom-nav "Goals". | Decide whether to rename route later or keep route stable and standardize user-facing labels to Goals. |

## Responsive Shell Rules

- Desktop: sidebar plus desktop page header/breadcrumbs.
- Mobile: bottom navigation plus one mobile page header per page.
- Shared `PageHeader` is desktop-only. Pages that need mobile chrome should render their own `md:hidden` header or use a shared mobile shell.
- Avoid rendering both desktop and mobile headers at the same viewport width.

## Next Feature Pass

1. Verify every primary tab loads with real authenticated data, useful empty states, and working primary actions.
2. Verify every secondary route is reachable from at least one intentional entry point.
3. Define one canonical profile field map and completeness score.
4. Make onboarding/profile updates idempotent so repeated edits update existing accounts/goals instead of duplicating them.
5. Decide which hidden routes should be surfaced, merged, or retired.
