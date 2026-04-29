# Mizan Cross-Platform UI Standards

Mizan has two front ends: native mobile and mobile web. They should feel like one product language implemented twice, not two apps that happen to share data.

## Principle

Use design parity, not forced pixel parity. Native and web must share colors, type scale, spacing, card styles, button styles, navigation structure, data formatting, empty/loading/error states, and product vocabulary. They do not need identical browser chrome, safe area behavior, shadow rendering, or exact pixel positions.

## Sources Of Truth

- Visual tokens: `packages/ui-tokens/index.ts`
- Visual asset registry: `packages/shared/assets/index.ts`
- Navigation contract: `packages/shared/constants/navigation.ts`
- Screen section order: `packages/shared/constants/section-blueprints.ts`
- Screen data contracts: `packages/shared/contracts/index.ts`
- Demo parity data: `packages/shared/fixtures/demo.ts`
- Web demo routes: `/?demo=1`, `/ledger?demo=1`, `/catalogue?demo=1`, `/dreams?demo=1`, `/profile?demo=1`
- Architecture decision: `docs/ADR_CROSS_PLATFORM_PARITY_ARCHITECTURE.md`

## Release Blockers

- Native and web show different Mizan Score values for the same user.
- Native and web show different profile completion, balances, product counts, goals, or connected accounts in parity mode.
- Native and web choose different colors/icons/initials for the same provider, account type, or product category.
- A production screen exposes raw developer errors such as missing property names.
- A tab loses `demo=1` or `parity=1` while QA is comparing screens.
- Content is hidden behind the bottom navigation or unsafe area.

## Screen Order

Home:
Header, profile progress, alert/nudge if applicable, Mizan Score, quick actions, Mizan Insight, recent transactions, balance/account summary.

Money:
Header, currency toggle, summary metrics, account actions, account cards, recent activity, spending chart.

Find:
Header, search, primary category chips, quick filter chips, product count, featured products if applicable, product list.

Goals:
Header, current budget summary, budget categories, add category/templates, savings goals, insight, quick stats.

Me:
Header, profile card, verified identity, Mizan Score, connected accounts, settings/security links.

## Data Formatting

- Money uses thousands separators and up to two decimals: `46,440.5 ETB`, `+35,000 ETB`, `-678 ETB`.
- Percentages must name what they measure: `86% Complete`, `89% Match`, `0% Used`.
- Mizan Score uses one consumer scale everywhere: `0-100`, with `Low`, `Fair`, `Good`, and `Excellent`.
- Dates are human-readable: `Updated today`, `Reviewed Apr 24, 2026`, `3 days left`.

## State Standards

Every screen must define loading, empty, success, error, offline, permission denied, and partial-data states.

Production error copy:

```text
We couldn't load this right now.
Please try again.
```

Developer diagnostics belong in logs, not in user-facing UI.

## QA Checklist

- Same screen title, active tab, content order, card hierarchy, primary action, icon meaning, and empty/loading/error state.
- Same user name, score, balance, product count, connected accounts, budget values, and dates.
- Same search, filters, sorting, navigation destination, edit/delete behavior, and retry behavior.
- Tap targets are at least 44 x 44, text is readable, color is not the only indicator, and buttons are clearly labeled.
