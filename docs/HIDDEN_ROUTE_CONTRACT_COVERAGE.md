# Hidden Route Contract Coverage

Secondary and detail routes are product surfaces, not leftovers. This checklist tracks parity/contract coverage for routes that are not bottom tabs.

## Covered In This Pass

| Surface | Web route | Native route | Contract status |
| --- | --- | --- | --- |
| Mizan Score entry data via Home/Me | `/score` entry points | `/score` entry points | Home/Profile contracts now carry shared score value/label/status into entry cards. |
| Product discovery bootstrap | `/catalogue` | `/(tabs)/catalogue` | `FindScreenDataContract` covers categories, providers, featured products, product count, match labels, and states. |
| Goals read model | `/dreams` | `/(tabs)/goals` | `GoalsScreenDataContract` covers budget, goals, bills, quick stats, forecast copy, and states. |
| Me/Profile read model | `/profile` | `/(tabs)/profile` | `ProfileScreenDataContract` covers profile identity, connected accounts, and states. |

## Still To Contract

| Surface | Web route | Native route | Required contract |
| --- | --- | --- | --- |
| Notifications | `/notifications` | `/notifications` | `NotificationsScreenDataContract`: grouped notifications, unread/actionable counts, filters, empty/loading/error copy. |
| Mizan Score full screen | `/score` | `/score` | `ScoreScreenDataContract`: score value/label, factors, education copy, simulator actions, trust card facts, states. |
| Product detail | `/catalogue/[id]` | `/product/[id]` | `ProductDetailDataContract`: product facts, trust metadata, match explanation, provider summary, CTAs, states. |
| Bank/provider detail | `/catalogue/bank/[id]` | `/provider/[id]` | `ProviderDetailDataContract`: provider profile, product count, product list summary, ratings/trust metadata, states. |
| Settings | `/settings` | `/settings` | `SettingsScreenDataContract`: notification toggles, privacy/security links, language/theme values, states. |
| Transfer | `/transfer` | no dedicated native page yet | `TransferScreenDataContract`: eligible accounts, transfer limits/copy, states. |
| Wealth | `/wealth`, `/wealth/[symbol]` | no native route yet | Decide whether this is beta-critical before contract work. |
| Tips | `/tips` | no native route yet | Decide whether this becomes an AI/insights hub or remains web-only. |
| Share card | `/me/share/[slug]` | no native route yet | Public read-only trust-card contract if share links remain beta scope. |

## Non-Consumer / Operational Routes

Admin routes stay outside consumer parity contracts for now:

- `/admin`
- `/admin/users`
- `/admin/products`
- `/admin/providers`
- `/admin/taxonomy`
- `/admin/moderation`

They should get admin-specific data contracts later, but they should not block consumer parity.

## Recommended Order

1. Notifications: small, shared list/state model.
2. Mizan Score: high visibility and already linked from Home/Me.
3. Product detail and provider detail: highest value for Find completion.
4. Settings: mostly copy/state/toggle contract.
5. Transfer, Wealth, Tips, Share card: scope decision after core hidden routes are stable.
