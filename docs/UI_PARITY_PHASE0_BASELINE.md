# UI Parity Phase 0 Baseline

Date: 2026-04-27

Branch: `codex-ui-parity-foundation`

## Scope

This baseline covers the five primary Mizan tabs across browser web and Expo native:

- Home
- Money
- Find
- Goals
- Me

## Baseline Evidence

The initial mismatch was reported with these screenshot files:

- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 21.57.49.png`: Home comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 21.58.10.png`: Money overview comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 21.58.51.png`: Money analytics comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 21.59.12.png`: Find comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 22.40.54.png`: Goals budget comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 22.41.10.png`: Goals bills comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 22.41.19.png`: Goals savings comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 22.41.55.png`: Me profile comparison.
- `/Users/tykers/Screenshots/Screenshot 2026-04-26 at 22.43.20.png`: Me settings/security comparison.

## Phase 0 Findings

- Web and native use different shell implementations and different screen composition.
- Shared navigation exists in `packages/shared/constants/navigation.ts`, but there is no shared product-surface contract for section order, header variant, or actions.
- Native screens still define local demo/mock data, so guest mode can diverge from web and from other native screens.
- Money, Goals, and Me have the clearest section-order drift.
- Find mostly shares the product catalogue concept, but search, filter layout, featured sections, and provider filters still differ.

## Ownership Plan

- Architecture and shared contracts: Lead developer.
- Home parity: Junior developer A after shell contract is ready.
- Money parity: Junior developer A.
- Find parity: Junior developer A.
- Goals parity: Junior developer B.
- Me parity: Junior developer B.
- Screenshot QA and acceptance review: Product reviewer or lead developer.

## Phase 0 Acceptance

- [x] Baseline screenshots identified.
- [x] Primary tabs listed.
- [x] Initial owners assigned.
- [x] Next phase identified: shared app surface contract and shared demo fixtures.

## Next Step

Proceed to Phase 1:

1. Add shared app-surface contract.
2. Add shared demo fixtures.
3. Export both from `@mizan/shared`.
4. Replace local native mock arrays with shared fixtures.
