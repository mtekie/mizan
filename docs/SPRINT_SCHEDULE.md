# Mizan Sprint Schedule

Last updated: 2026-04-26

This document turns the living roadmap into execution. Keep `docs/ROADMAP.md` broad and imaginative. Keep this file practical, dated, and easy to update every week.

## Operating Rhythm

Default sprint length: 1 week.

Reason: Mizan is still early enough that two-week plans will become stale. Weekly sprints let us ship, test, and pivot without pretending we know too much.

Weekly rhythm:

- Sunday night or Monday morning: sprint planning.
- Midweek: check blockers and cut scope.
- Friday/Saturday: demo, QA, notes, update roadmap.
- Every 4 sprints: strategy review and roadmap prune.

Each sprint should have:

- One primary outcome.
- Two or three secondary outcomes.
- A very small number of must-ship tasks.
- A visible demo target.
- A "do not touch unless needed" list.

## Sprint Lanes

Use these lanes when creating tasks:

- `Trust`: bugs, correctness, privacy, security, broken states.
- `Money`: accounts, transactions, budgets, bills, goals.
- `Find`: marketplace, products, providers, matching.
- `Score`: Mizan Score, profile, explanations, readiness.
- `Verification`: identity, account links, net worth/property/share cards.
- `Mobile`: Expo app, Android, mobile UX, SMS import.
- `Web`: web app, desktop UX, responsive behavior.
- `Admin`: data tools, moderation, users, product operations.
- `Infra`: DB, API, CI, observability, performance.
- `Growth`: beta users, partnerships, content, demos.
- `Research`: user interviews, institution discovery, regulatory learning.

## Priority Rules

When everything feels important, use this order:

1. Fix trust-breaking bugs.
2. Finish one user loop end to end.
3. Improve activation.
4. Improve data quality.
5. Improve speed.
6. Add new features.

Do not start a new surface if an existing beta-critical loop is broken.

Beta-critical loops:

- Sign up or log in.
- Add an account manually.
- Add a transaction manually.
- See a useful Money summary.
- Add a goal or budget.
- Browse Find and open product details.
- Improve profile and see why it matters.
- View Me/profile safely.

## Status Labels

Use these labels in this file:

- `[ ]` Not started.
- `[~]` In progress.
- `[x]` Done.
- `[!]` Blocked.
- `[-]` Cut or deferred.

Optional suffixes:

- `(P0)` Stop-ship.
- `(P1)` Important for beta.
- `(P2)` Useful soon.
- `(P3)` Later.

## Sprint 0: Planning And Triage

Target dates: 2026-04-26 to 2026-04-27

Primary outcome: turn broad product direction into an executable beta plan.

Demo target: docs exist, first sprint is clear, beta-critical bugs are known.

Tasks:

- [x] Create living roadmap.
- [x] Create sprint schedule.
- [ ] Review all current beta-critical screens on mobile.
- [ ] Review all current beta-critical screens on web.
- [ ] Make a bug list from screenshots.
- [ ] Confirm hidden/deferred routes for beta.
- [ ] Confirm whether beta score is named `Mizan Score` or `Mizan Readiness`.
- [ ] Confirm first public share-card concept.
- [ ] Confirm first verification claim to prototype.
- [ ] Confirm first 20 beta users.
- [ ] Confirm first 20 institution contacts.

Do not touch unless needed:

- Capital markets implementation.
- Provider self-service portal.
- Complex AI features.
- Paid ranking.
- Public Android release.
- iOS release.

## Sprint 1: Trust Fixes And Manual Money Foundation

Target dates: 2026-04-28 to 2026-05-04

Primary outcome: a user can manually create the basics without seeing broken finance UI.

Demo target: new user can sign up, skip SMS, add account, add transaction, see Money screen, add a simple goal.

Must ship:

- [x] Fix all visible `NaN` displays. (P0)
- [x] Add safe money formatter and use on beta-critical screens. (P0)
- [x] Ensure Prisma `User` row exists before protected writes. (P0)
- [x] Fix goal creation for newly authenticated users. (P0)
- [x] Add or repair manual account creation. (P1)
- [x] Add or repair manual transaction creation. (P1)
- [x] Add or repair manual goal creation. (P1)
- [x] Add empty states with useful CTAs for accounts, transactions, goals, budgets, products. (P1)
- [x] Hide raw transaction references from list cards. (P1)
- [x] Fix mobile header/notch overlap on primary tabs. (P1)

Secondary:

- [x] Add edit/delete transaction.
- [x] Add edit/delete account.
- [x] Add edit/delete goal.
- [x] Add "skip SMS import" onboarding path.
- [x] Add basic beta smoke checklist.

Verification:

- [x] Run lint.
- [x] Run web typecheck.
- [x] Run mobile typecheck.
- [x] Run web build.
- [ ] Manually test mobile Home, Money, Find, Goals, Me.
- [ ] Manually test web Home, Money, Find, Goals, Me.

Cut if time gets tight:

- Transaction search.
- Transaction split.
- Advanced charts.
- Full budget templates.

## Sprint 2: Find Must Be Useful

Target dates: 2026-05-05 to 2026-05-11

Primary outcome: Find works on mobile and web with real seeded data and trustworthy product cards.

Demo target: user can browse products, filter, open detail, understand why a product may fit, and save interest/bookmark.

Must ship:

- [x] Fix mobile Find empty state when products exist. (P0)
- [x] Align web/mobile Find categories. (P1)
- [x] Add product list/detail API shape or reduce list payload. (P1)
- [x] Improve product list loading speed. (P1)
- [x] Add product card key facts: provider, type, match, verified, one financial fact. (P1)
- [x] Add product detail source/freshness/unverified indicators. (P1)
- [x] Add product bookmark/save. (P1)
- [x] Add "why this matches you" explanation. (P1)
- [x] Add "requirements you may need" section. (P1)
- [x] Add "report incorrect information" placeholder or flow. (P2)

Secondary:

- [x] Add student filter.
- [x] Add salaried user filter.
- [x] Add interest-free filter.
- [x] Add digital-only filter.
- [x] Add provider profile link from product.
- [x] Add no-results suggestions.

Admin support:

- [x] Add product freshness field display in admin.
- [x] Add unverified/stale product filter in admin.
- [x] Add provider/product counts to admin overview.
- [x] Add source metadata field if not present.

Verification:

- [x] Measure `/api/v1/products?take=20`.
- [x] Measure `/catalogue` load.
- [x] Smoke test product detail.
- [ ] Test Find on mobile viewport.

Cut if time gets tight:

- Full compare flow.
- Full lead flow.
- Provider dashboard.

## Sprint 3: Goals, Budgets, And Bills Loop

Target dates: 2026-05-12 to 2026-05-18

Primary outcome: Goals becomes a practical planning surface, not just a display page.

Demo target: user can create a monthly budget, add bills, add savings goal, mark bill paid, see progress.

Must ship:

- [x] Fix monthly budget calculation. (P0)
- [x] Add budget setup flow. (P1)
- [x] Add budget category CRUD. (P1)
- [x] Add bill creation. (P1)
- [x] Add mark bill paid. (P1)
- [x] Add savings goal contribution action. (P1)
- [x] Add budget and bill empty states. (P1)
- [x] Add overdue and upcoming bill states. (P1)
- [x] Align mobile and web Goals sections. (P1)

Secondary:

- [x] Add student budget template.
- [x] Add salaried budget template.
- [x] Add budget forecast copy.
- [x] Add "skip this bill this month."
- [x] Add notification generation design for upcoming bills.

Verification:

- [ ] Test no budget state.
- [ ] Test active budget state.
- [ ] Test overdue bill state.
- [ ] Test paid bill state.
- [ ] Test savings progress.

Cut if time gets tight:

- AI forecast.
- Advanced templates.
- Recurring transaction auto-detection.

## Sprint 4: Profile, Score, And Nudges

Target dates: 2026-05-19 to 2026-05-25

Primary outcome: profile answers visibly improve recommendations and score explanations.

Demo target: user answers one smart nudge, sees profile progress improve, sees Find/Score explanation change.

Must ship:

- [ ] Decide beta naming: `Mizan Score` vs `Mizan Readiness`. (P0)
- [ ] Define score factor list. (P1)
- [ ] Show score factors on mobile. (P1)
- [ ] Show actions to improve score. (P1)
- [ ] Add score method/version label internally. (P1)
- [ ] Make nudges one-question-at-a-time. (P1)
- [ ] Add "why we ask" copy for sensitive fields. (P1)
- [ ] Add profile completeness consistency across web/mobile. (P1)
- [ ] Add "what this score is not" copy. (P1)

Secondary:

- [ ] Add score history.
- [ ] Add score simulator stub.
- [ ] Add methodology draft page.
- [ ] Add Amharic labels for key profile questions.

Verification:

- [ ] Test profile question save.
- [ ] Test score recalculation.
- [ ] Test Find match explanation before/after profile answer.
- [ ] Test privacy copy.

Cut if time gets tight:

- Public open-source score repo.
- Full score simulator.
- Institution-facing score docs.

## Sprint 5: Verification Prototype

Target dates: 2026-05-26 to 2026-06-01

Primary outcome: Mizan has a concrete first verification/share-card prototype.

Demo target: user can create a private share preview for a verified profile or verified account evidence concept.

Must ship:

- [ ] Choose first verification claim. (P0)
- [ ] Recommended: `Verified Mizan Profile`. (P1)
- [ ] Define verification levels in schema/design. (P1)
- [ ] Add account verification UI concept. (P1)
- [ ] Add share-card visual prototype. (P1)
- [ ] Add privacy controls: private, link-only, public. (P1)
- [ ] Add freshness date to share card. (P1)
- [ ] Add "verified facts" vs "self-declared facts." (P1)
- [ ] Add revoke/share disabled state if backend not ready. (P1)

Secondary:

- [ ] Prototype verified net worth range.
- [ ] Prototype verified property owner card.
- [ ] Prototype verified student card.
- [ ] Prototype verified business cashflow card.
- [ ] Draft verification policy.

Verification:

- [ ] User review with 3 people: what feels valuable?
- [ ] User review with 3 people: what feels unsafe/too revealing?
- [ ] Test share-card mobile layout.

Cut if time gets tight:

- Document upload.
- Selfie matching.
- Institution verification integration.

## Sprint 6: Private Beta Hardening

Target dates: 2026-06-02 to 2026-06-08

Primary outcome: prepare a controlled private beta.

Demo target: 20 friendly users can onboard and use Money/Find/Goals without hand-holding.

Must ship:

- [ ] Create private beta checklist. (P0)
- [ ] Create feedback collection form. (P1)
- [ ] Add in-app feedback link. (P1)
- [ ] Add basic analytics events. (P1)
- [ ] Add error monitoring. (P1)
- [ ] Add privacy policy draft to app. (P1)
- [ ] Add terms draft to app. (P1)
- [ ] Add educational-only disclaimer. (P1)
- [ ] Add SMS consent copy. (P1)
- [ ] Add product data accuracy disclaimer. (P1)

Secondary:

- [ ] Add invite/waitlist flow.
- [ ] Add support email/WhatsApp link.
- [ ] Add beta onboarding email/message.
- [ ] Add first user interview schedule.
- [ ] Add first institution demo deck.

Verification:

- [ ] Run full smoke test.
- [ ] Run seed validation.
- [ ] Run admin QA.
- [ ] Run Android internal build if ready.

Cut if time gets tight:

- Referral system.
- Full push notification system.
- Advanced analytics dashboard.

## Sprint 7: Beta Learning Sprint

Target dates: 2026-06-09 to 2026-06-15

Primary outcome: learn from real usage instead of adding major features.

Demo target: beta findings report with ranked fixes.

Must ship:

- [ ] Onboard first 10 beta users.
- [ ] Watch at least 3 users use onboarding.
- [ ] Watch at least 3 users add money data manually.
- [ ] Watch at least 3 users browse Find.
- [ ] Interview at least 5 users.
- [ ] Collect top 20 confusion points.
- [ ] Collect top 20 bugs.
- [ ] Rank bugs by trust impact.
- [ ] Rank requested features by activation impact.
- [ ] Update roadmap.
- [ ] Update sprint schedule.

Secondary:

- [ ] Talk to 3 institution contacts.
- [ ] Update partnership pitch based on product state.
- [ ] Collect product data correction examples.

Verification:

- [ ] Compare analytics to observed behavior.
- [ ] Confirm activation metric is measurable.
- [ ] Confirm retention baseline if enough time has passed.

Cut if time gets tight:

- Any new major feature work.

## Sprint 8: Beta Fixes And Public Positioning

Target dates: 2026-06-16 to 2026-06-22

Primary outcome: fix the biggest beta issues and sharpen positioning.

Demo target: improved beta build plus clear public-facing product story.

Must ship:

- [ ] Fix top 5 trust bugs from beta.
- [ ] Fix top 5 activation blockers from beta.
- [ ] Improve onboarding copy based on user language.
- [ ] Improve Money quick entry.
- [ ] Improve Find no-results and product cards.
- [ ] Improve Score/Profile explanations.
- [ ] Update demo script.
- [ ] Update pitch deck.
- [ ] Update landing/waitlist copy if applicable.

Secondary:

- [ ] Add 10 more beta users.
- [ ] Add first public changelog.
- [ ] Add first educational content piece.

Verification:

- [ ] Re-run users through fixed flows.
- [ ] Re-run full QA.

Cut if time gets tight:

- Big visual redesign.
- New marketplace categories.

## Sprint 9: Product Data Quality System

Target dates: 2026-06-23 to 2026-06-29

Primary outcome: Mizan has a repeatable way to keep Ethiopian financial product data trustworthy.

Demo target: admin can see stale/unverified products, edit source/freshness fields, and move a product from unverified to reviewed.

Must ship:

- [ ] Define product data quality statuses. (P1)
- [ ] Add or expose `source`, `sourceType`, `lastReviewedAt`, `reviewedBy`, and `dataConfidence` fields or equivalent. (P1)
- [ ] Add stale product filter in admin. (P1)
- [ ] Add unverified product filter in admin. (P1)
- [ ] Add product review notes in admin. (P1)
- [ ] Add source link/document reference field. (P1)
- [ ] Add product completeness score. (P1)
- [ ] Add provider completeness score. (P1)
- [ ] Add data coverage dashboard by category/provider. (P1)
- [ ] Add user-facing "last checked" display on product detail. (P1)

Secondary:

- [ ] Add bulk mark reviewed.
- [ ] Add duplicate product detection.
- [ ] Add suspicious rate detector.
- [ ] Add spreadsheet import preview design.
- [ ] Create product data QA checklist.

Growth/research:

- [ ] Identify top 10 providers to clean first.
- [ ] Identify top 50 products for beta quality.
- [ ] Assign source documents/spreadsheets for each priority product.

Verification:

- [ ] Test admin data-quality workflow.
- [ ] Test product detail freshness display.
- [ ] Test product list performance after adding metadata.

## Sprint 10: Analytics And Activation

Target dates: 2026-06-30 to 2026-07-06

Primary outcome: Mizan can measure whether users activate and where they get stuck.

Demo target: basic analytics dashboard or event log showing onboarding, manual entry, Find, Score, and goal events.

Must ship:

- [ ] Define activation event. (P0)
- [ ] Recommended activation: user adds account plus either transaction, goal, or product save.
- [ ] Add event tracking for signup/login. (P1)
- [ ] Add event tracking for onboarding step completion. (P1)
- [ ] Add event tracking for account creation. (P1)
- [ ] Add event tracking for transaction creation. (P1)
- [ ] Add event tracking for goal creation. (P1)
- [ ] Add event tracking for product detail view. (P1)
- [ ] Add event tracking for product save/interested. (P1)
- [ ] Add event tracking for profile nudge answer. (P1)
- [ ] Add error event tracking for failed form submits. (P1)

Secondary:

- [ ] Add weekly metrics query/script.
- [ ] Add simple admin analytics panel.
- [ ] Add source tracking for beta invites.
- [ ] Add feedback reason tags.
- [ ] Add funnel report: signup -> onboarding -> first value.

Growth/research:

- [ ] Review activation of first beta users.
- [ ] Interview users who did not activate.
- [ ] Pick one activation bottleneck to fix next.

Verification:

- [ ] Confirm events do not leak sensitive transaction details.
- [ ] Confirm analytics works in production/staging environment.

## Sprint 11: Money Intelligence V1

Target dates: 2026-07-07 to 2026-07-13

Primary outcome: Money becomes more than a ledger; it explains what happened this month.

Demo target: user sees income, outflow, category summary, largest changes, and simple monthly insight.

Must ship:

- [ ] Add monthly income summary. (P1)
- [ ] Add monthly outflow summary. (P1)
- [ ] Add savings rate calculation with safe fallback. (P1)
- [ ] Add category spending breakdown. (P1)
- [ ] Add transfer exclusion from spending totals. (P1)
- [ ] Add "largest expenses this month." (P1)
- [ ] Add "unusual spending" deterministic rule. (P2)
- [ ] Add "month so far" insight. (P2)
- [ ] Add web and mobile parity for core summary. (P1)
- [ ] Add loading skeletons for Money. (P2)

Secondary:

- [ ] Add account balance reconciliation warning.
- [ ] Add category rename/mapping.
- [ ] Add monthly comparison to previous month.
- [ ] Add export current month CSV.

Verification:

- [ ] Test empty account state.
- [ ] Test only income transactions.
- [ ] Test only expense transactions.
- [ ] Test transfer-heavy account.
- [ ] Test manual transaction edits update summaries.

## Sprint 12: SMS Import Internal Beta

Target dates: 2026-07-14 to 2026-07-20

Primary outcome: Android SMS import can be tested internally without risking user trust.

Demo target: internal tester grants permission, imports messages, reviews extracted transactions, corrects mistakes, and accepts them.

Must ship:

- [ ] Confirm Android native module build path. (P0)
- [ ] Add SMS permission education screen. (P1)
- [ ] Add permission denied path. (P1)
- [ ] Add import preview inbox. (P1)
- [ ] Add confidence score display in review flow. (P1)
- [ ] Add duplicate detection in review flow. (P1)
- [ ] Add correction UI for amount, direction, account, category, date. (P1)
- [ ] Add accept transaction action. (P1)
- [ ] Add reject/ignore message action. (P1)
- [ ] Add parser test fixture set. (P1)

Secondary:

- [ ] Add sender allowlist.
- [ ] Add unsupported message reporting with consent.
- [ ] Add parser performance stats.
- [ ] Add parser version in imported records.

Verification:

- [ ] Test with fake sample messages.
- [ ] Test with real internal export if available.
- [ ] Test permission denied.
- [ ] Test duplicate import.
- [ ] Test correction feedback loop.

Cut if time gets tight:

- Public Play Store SMS release.
- Any external SMS claim.

## Sprint 13: Strategy Review 1 And Scope Reset

Target dates: 2026-07-21 to 2026-07-27

Primary outcome: review the first 12 sprints, prune roadmap, and choose the next 90-day emphasis.

Demo target: written strategy memo with keep/cut/pivot decisions.

Must ship:

- [ ] Review beta usage metrics. (P1)
- [ ] Review user interview notes. (P1)
- [ ] Review top bugs. (P1)
- [ ] Review product data quality progress. (P1)
- [ ] Review institution conversations. (P1)
- [ ] Decide public beta timing. (P0)
- [ ] Decide Android SMS public stance. (P0)
- [ ] Decide iOS v1 path. (P0)
- [ ] Decide Mizan Score naming and public framing. (P0)
- [ ] Decide first verification/share-card path. (P0)
- [ ] Update `ROADMAP.md`. (P1)
- [ ] Update this sprint schedule. (P1)

Secondary:

- [ ] Archive abandoned ideas.
- [ ] Add new tasks discovered from beta.
- [ ] Re-rank next 8 sprints.

## Sprint 14: Public Beta Preparation

Target dates: 2026-07-28 to 2026-08-03

Primary outcome: Mizan is ready for a wider but still controlled beta.

Demo target: invite link/waitlist, polished onboarding, privacy pages, and deployable beta build.

Must ship:

- [ ] Add waitlist or invite flow. (P1)
- [ ] Add beta access gating if needed. (P1)
- [ ] Add public privacy policy page. (P1)
- [ ] Add public terms page. (P1)
- [ ] Add public methodology/disclaimer page for score. (P1)
- [ ] Add user support contact. (P1)
- [ ] Add in-app feedback. (P1)
- [ ] Add release notes/changelog. (P2)
- [ ] Add production/staging environment checklist. (P1)
- [ ] Add backup/restore check. (P1)

Secondary:

- [ ] Create public demo video.
- [ ] Create landing page update.
- [ ] Create beta onboarding message.
- [ ] Create first educational article.

Verification:

- [ ] Full smoke test.
- [ ] Admin smoke test.
- [ ] Mobile smoke test.
- [ ] Product data QA sample.
- [ ] Privacy/legal copy review.

## Sprint 15: Android Beta Build And Store Readiness

Target dates: 2026-08-04 to 2026-08-10

Primary outcome: Android has a credible internal/beta build path.

Demo target: Android build installed by testers, core flows work, store risk list is clear.

Must ship:

- [ ] Confirm EAS/Android build config. (P1)
- [ ] Build Android internal test artifact. (P1)
- [ ] Test signup/login on Android. (P1)
- [ ] Test manual account creation on Android. (P1)
- [ ] Test manual transaction creation on Android. (P1)
- [ ] Test Find on Android. (P1)
- [ ] Test Goals on Android. (P1)
- [ ] Test Me/Profile on Android. (P1)
- [ ] Test SMS import only if internal scope allows. (P1)
- [ ] Draft Play Store data safety answers. (P1)
- [ ] Draft SMS permission justification. (P1)

Secondary:

- [ ] Prepare Android screenshots.
- [ ] Prepare app icon/splash QA.
- [ ] Prepare release notes.

Cut if time gets tight:

- Public Play Store submission.
- SMS-enabled public build.

## Sprint 16: iOS Manual-First Prototype

Target dates: 2026-08-11 to 2026-08-17

Primary outcome: iOS has a realistic path that does not depend on SMS.

Demo target: iOS dev build or simulator flow where manual entry, Find, Goals, and Me work.

Must ship:

- [ ] Confirm iOS bundle/app config. (P1)
- [ ] Run iOS dev build or simulator. (P1)
- [ ] Test auth. (P1)
- [ ] Test manual account creation. (P1)
- [ ] Test manual transaction creation. (P1)
- [ ] Test Find. (P1)
- [ ] Test Goals. (P1)
- [ ] Test profile/settings. (P1)
- [ ] Identify iOS-specific layout issues. (P1)
- [ ] Decide iOS v1 ingestion: manual, CSV, statement upload, email, screenshot OCR, or delayed. (P0)

Secondary:

- [ ] Prototype statement upload flow if selected.
- [ ] Prototype screenshot OCR flow if selected.
- [ ] Draft App Store privacy notes.

## Sprint 17: Verification Share Card V1

Target dates: 2026-08-18 to 2026-08-24

Primary outcome: verification becomes a visible product hook.

Demo target: user can generate a private preview/share page with clear verified and self-declared sections.

Must ship:

- [ ] Build share-card data model or temporary representation. (P1)
- [ ] Build private share preview page. (P1)
- [ ] Add visibility controls. (P1)
- [ ] Add freshness date. (P1)
- [ ] Add verified vs self-declared sections. (P1)
- [ ] Add revoke/disable share link. (P1)
- [ ] Add "what this means" explanation. (P1)
- [ ] Add "what this does not mean" explanation. (P1)
- [ ] Add share-card event tracking. (P2)
- [ ] Add feedback prompt after preview. (P2)

Secondary:

- [ ] Add net worth range prototype.
- [ ] Add student profile card prototype.
- [ ] Add account evidence card prototype.

Verification:

- [ ] User test with 5 people.
- [ ] Ask what they would share.
- [ ] Ask what they would hide.
- [ ] Ask who they would send it to.

## Sprint 18: Partnership Demo Package

Target dates: 2026-08-25 to 2026-08-31

Primary outcome: Mizan is demoable to financial institutions with a clear value proposition.

Demo target: institution pitch deck, product demo, data-quality story, and lead/insight mockups.

Must ship:

- [ ] Create 8-10 slide institution pitch deck. (P1)
- [ ] Create product data partnership one-pager. (P1)
- [ ] Create provider analytics mockup. (P2)
- [ ] Create qualified lead mockup. (P2)
- [ ] Create user trust/ranking policy draft. (P1)
- [ ] Create conflict-of-interest draft. (P1)
- [ ] Create demo account with clean sample data. (P1)
- [ ] Create demo script. (P1)
- [ ] Create list of 30 target contacts. (P1)
- [ ] Send first 10 partnership outreach messages. (P1)

Secondary:

- [ ] Record 3-minute institution demo.
- [ ] Create student/youth finance pitch variant.
- [ ] Create MFI pitch variant.

## Sprint 19: Public Beta Cohort 1

Target dates: 2026-09-01 to 2026-09-07

Primary outcome: launch to a controlled public-ish cohort and learn fast.

Demo target: 50-100 invited users can onboard and use the core app.

Must ship:

- [ ] Invite first larger cohort. (P1)
- [ ] Monitor signups daily. (P1)
- [ ] Monitor activation daily. (P1)
- [ ] Monitor errors daily. (P1)
- [ ] Monitor product no-results daily. (P1)
- [ ] Monitor manual transaction creation. (P1)
- [ ] Monitor product saves. (P1)
- [ ] Monitor profile completion. (P1)
- [ ] Collect user feedback. (P1)
- [ ] Fix P0 bugs immediately. (P0)

Secondary:

- [ ] Add beta community channel if useful.
- [ ] Send weekly beta digest.
- [ ] Ask 10 users for short calls.

Cut if time gets tight:

- New features.

## Sprint 20: Cohort 1 Fixes

Target dates: 2026-09-08 to 2026-09-14

Primary outcome: fix the top issues from the first larger cohort.

Demo target: activation and trust are visibly better than Sprint 19.

Must ship:

- [ ] Fix top 5 P0/P1 bugs. (P0)
- [ ] Fix top onboarding confusion. (P1)
- [ ] Fix top manual entry confusion. (P1)
- [ ] Fix top Find confusion. (P1)
- [ ] Fix top Score/Profile confusion. (P1)
- [ ] Improve empty/loading/error states discovered in beta. (P1)
- [ ] Update help/FAQ copy. (P2)
- [ ] Update product positioning copy. (P2)
- [ ] Update roadmap based on learning. (P1)
- [ ] Decide Cohort 2 target. (P1)

Secondary:

- [ ] Improve speed of most-used slow route.
- [ ] Add small delight/polish where users noticed roughness.

## Sprint 21: Product Matching V2

Target dates: 2026-09-15 to 2026-09-21

Primary outcome: product recommendations feel explainable and locally relevant.

Demo target: student and salaried users see meaningfully different product recommendations with clear reasons.

Must ship:

- [ ] Improve matching factor definitions. (P1)
- [ ] Add student matching rules. (P1)
- [ ] Add salaried matching rules. (P1)
- [ ] Add interest-free preference boost. (P1)
- [ ] Add income-range-aware requirement warnings. (P1)
- [ ] Add region-aware provider/MFI concept if data exists. (P2)
- [ ] Add "missing profile info limits this match" explanation. (P1)
- [ ] Add tests for matching rules. (P1)
- [ ] Add admin tag quality checks. (P2)
- [ ] Add match explanation QA examples. (P1)

Secondary:

- [ ] Add "not eligible yet" display.
- [ ] Add "prepare to qualify" checklist.
- [ ] Add comparison based on matched products.

## Sprint 22: Score Methodology V0

Target dates: 2026-09-22 to 2026-09-28

Primary outcome: Mizan Score has enough transparency to be trusted internally and discussed externally.

Demo target: methodology page, versioned factors, test examples, and user-facing explanations.

Must ship:

- [ ] Write score methodology v0. (P1)
- [ ] Define score factor weights internally. (P1)
- [ ] Define score factor ranges. (P1)
- [ ] Define score category labels. (P1)
- [ ] Add score version to calculations. (P1)
- [ ] Add score examples for 5 personas. (P1)
- [ ] Add score calculation tests. (P1)
- [ ] Add "improve score" actions. (P1)
- [ ] Add fairness/privacy review checklist. (P1)
- [ ] Decide if methodology is public now or later. (P0)

Secondary:

- [ ] Extract scoring engine toward shared package.
- [ ] Draft open-source repo structure.
- [ ] Draft institution interpretation guide.

## Sprint 23: Data Import Alternatives

Target dates: 2026-09-29 to 2026-10-05

Primary outcome: Mizan has ingestion paths beyond Android SMS.

Demo target: user can import or prepare data through at least one non-SMS method.

Must ship:

- [ ] Choose first non-SMS import path. (P0)
- [ ] Recommended first: CSV/spreadsheet import on web.
- [ ] Build CSV import parser for transactions. (P1)
- [ ] Build import preview. (P1)
- [ ] Build field mapping. (P1)
- [ ] Build duplicate detection. (P1)
- [ ] Build accept/reject imported rows. (P1)
- [ ] Add import batch history. (P1)
- [ ] Add import privacy copy. (P1)
- [ ] Add import tests. (P1)

Secondary:

- [ ] Prototype statement upload.
- [ ] Prototype screenshot OCR.
- [ ] Prototype email forwarding research.

## Sprint 24: Localization V1

Target dates: 2026-10-06 to 2026-10-12

Primary outcome: Mizan starts becoming Ethiopian in language, not just market.

Demo target: key mobile flows have Amharic-friendly labels or bilingual support where it matters most.

Must ship:

- [ ] Inventory all user-facing strings in beta-critical flows. (P1)
- [ ] Prioritize Amharic translations for onboarding. (P1)
- [ ] Prioritize Amharic translations for Money basics. (P1)
- [ ] Prioritize Amharic translations for Find categories. (P1)
- [ ] Prioritize Amharic translations for Score/Profile explanations. (P1)
- [ ] Add language preference behavior. (P1)
- [ ] Test Ethiopic font rendering. (P1)
- [ ] Test text fit on mobile. (P1)
- [ ] Avoid awkward literal translations of finance terms. (P1)
- [ ] Add glossary file for key terms. (P2)

Secondary:

- [ ] Explore Afaan Oromo demand.
- [ ] Explore Ethiopian calendar date display.
- [ ] Add bilingual product type labels in admin.

## Sprint 25: Security And Privacy Hardening

Target dates: 2026-10-13 to 2026-10-19

Primary outcome: Mizan handles sensitive financial data with stronger controls.

Demo target: privacy center, data export/delete path, admin audit basics, and masked sensitive data.

Must ship:

- [ ] Add data export flow. (P1)
- [ ] Add account deletion request or delete flow. (P1)
- [ ] Mask account numbers consistently. (P1)
- [ ] Review all admin routes for authorization. (P1)
- [ ] Add admin audit log for sensitive actions. (P1)
- [ ] Add consent record for SMS/import. (P1)
- [ ] Add consent record for share cards. (P1)
- [ ] Add data retention draft. (P1)
- [ ] Add incident response draft. (P1)
- [ ] Add security checklist before wider launch. (P1)

Secondary:

- [ ] Review encryption strategy.
- [ ] Review object storage security before document upload.
- [ ] Add session management settings.

## Sprint 26: Half-Year Strategy Review

Target dates: 2026-10-20 to 2026-10-26

Primary outcome: decide what Mizan is for the next six months based on real evidence.

Demo target: half-year review document, revised roadmap, revised sprint schedule, and go/no-go decisions.

Must ship:

- [ ] Review signups. (P1)
- [ ] Review activation. (P1)
- [ ] Review retention. (P1)
- [ ] Review manual entry usage. (P1)
- [ ] Review SMS/import usage. (P1)
- [ ] Review Find usage. (P1)
- [ ] Review Score/Profile usage. (P1)
- [ ] Review share-card/verification interest. (P1)
- [ ] Review institution pipeline. (P1)
- [ ] Review product data coverage. (P1)
- [ ] Decide next primary wedge. (P0)
- [ ] Decide revenue experiment. (P0)
- [ ] Decide public Android/iOS roadmap. (P0)
- [ ] Decide Score open-source timing. (P0)
- [ ] Decide verification investment level. (P0)
- [ ] Rewrite Months 7-12 based on reality. (P1)

## Months 7-12: Lighter Rolling Waves

These are intentionally less detailed. Rewrite them after Sprint 26.

### Month 7: Public Beta Expansion

Target dates: 2026-10-27 to 2026-11-23

Primary outcome: expand carefully while keeping trust high.

Likely work:

- [ ] Grow beta from first cohort to broader invite base.
- [ ] Tighten onboarding based on retention data.
- [ ] Improve activation loop.
- [ ] Improve product matching based on usage.
- [ ] Expand priority product/provider data coverage.
- [ ] Improve analytics dashboard.
- [ ] Continue institution outreach.
- [ ] Decide whether to submit Android public/internal track.
- [ ] Continue iOS manual-first validation.
- [ ] Publish or refine Mizan Score methodology v0.

Decision gates:

- [ ] Are users retaining?
- [ ] Is Money or Find the stronger wedge?
- [ ] Are institutions responding to leads, data, score, or verification?

### Month 8: Institution Pilot And Provider Tools

Target dates: 2026-11-24 to 2026-12-21

Primary outcome: secure or run the first meaningful institution pilot.

Likely work:

- [ ] Build lightweight provider-facing report.
- [ ] Build pilot dashboard or manual reporting flow.
- [ ] Track interested leads by product/provider.
- [ ] Add provider correction workflow.
- [ ] Add sponsored/organic labeling policy before any paid placement.
- [ ] Improve provider profile pages.
- [ ] Expand product data freshness operations.
- [ ] Formalize institution CRM.
- [ ] Draft pilot agreement/MOU template.
- [ ] Run at least one institution demo using real Mizan flows.

Decision gates:

- [ ] Which institution segment is most promising: bank, MFI, wallet, insurer, university, NGO?
- [ ] Is revenue likely from leads, data tools, verification, or wellness programs?

### Month 9: Verification Productization

Target dates: 2026-12-22 to 2027-01-18

Primary outcome: decide if verification becomes a core product pillar.

Likely work:

- [ ] Ship share-card V2.
- [ ] Add verified profile flow.
- [ ] Add account evidence flow if privacy model is ready.
- [ ] Add net worth range prototype if user demand is real.
- [ ] Add student verification if student wedge is strong.
- [ ] Add business verification if SME demand appears.
- [ ] Add share analytics.
- [ ] Add expiration/revoke controls.
- [ ] Add dispute/correction flow.
- [ ] Draft verification governance policy.

Decision gates:

- [ ] Are users sharing verification cards?
- [ ] Do institutions understand or value them?
- [ ] Does verification increase activation or retention?

### Month 10: Score Standard And Open-Source Preparation

Target dates: 2027-01-19 to 2027-02-15

Primary outcome: prepare Mizan Score to become credible beyond the app.

Likely work:

- [ ] Extract score engine into a clean package.
- [ ] Add complete test fixtures.
- [ ] Publish or prepare public methodology.
- [ ] Draft open-source license decision.
- [ ] Draft governance model.
- [ ] Draft fairness/privacy review.
- [ ] Draft partner API/readiness report concept.
- [ ] Add score simulation.
- [ ] Add score history.
- [ ] Add user dispute/correction flow for score factors.

Decision gates:

- [ ] Is the score mature enough to open-source?
- [ ] What should remain app-specific versus standard?
- [ ] Are institutions interested in score interpretation?

### Month 11: Platform Hardening

Target dates: 2027-02-16 to 2027-03-15

Primary outcome: make Mizan stable enough for a larger public push.

Likely work:

- [ ] Production CI/CD hardening.
- [ ] Staging and production parity.
- [ ] Backup/restore drills.
- [ ] Performance budgets.
- [ ] Slow route cleanup.
- [ ] Admin RBAC hardening.
- [ ] Audit log completeness.
- [ ] Privacy center improvements.
- [ ] App release process.
- [ ] Data quality operations process.
- [ ] Support process.
- [ ] Incident response drill.

Decision gates:

- [ ] Are we ready for larger public launch?
- [ ] What are the top operational risks?
- [ ] What needs legal/security review before scale?

### Month 12: Annual Launch/Reset

Target dates: 2027-03-16 to 2027-04-26

Primary outcome: either launch a stronger public version or reset strategy with evidence.

Likely work:

- [ ] Annual metrics review.
- [ ] User cohort analysis.
- [ ] Partnership pipeline review.
- [ ] Revenue experiment review.
- [ ] Product wedge decision.
- [ ] Public launch plan or focused pivot plan.
- [ ] Brand/content push.
- [ ] Product roadmap rewrite.
- [ ] Hiring/team needs assessment.
- [ ] Funding/partnership narrative update.
- [ ] Regulatory/compliance review.
- [ ] Year-two strategy doc.

Decision gates:

- [ ] Is Mizan primarily Money, Find, Score, Verification, or a combined OS?
- [ ] What is the business model?
- [ ] What is the strongest trust moat?
- [ ] What must be killed?
- [ ] What deserves a full year of focus?

## Monthly Milestones

### By Day 10

- [ ] Living roadmap exists.
- [ ] Sprint schedule exists.
- [ ] Trust-breaking UI bugs identified.
- [ ] First manual-entry loop in progress or working.
- [ ] Beta personas confirmed.
- [ ] Hidden/deferred routes identified.

### By Day 30

- [ ] Manual entry works well.
- [ ] SMS import is optional and clearly explained.
- [ ] Money screen is useful.
- [ ] Find screen is useful.
- [ ] Goals screen is useful.
- [ ] Profile/Score has clear educational framing.
- [ ] Admin can maintain products/providers/taxonomy.
- [ ] Private beta list is ready.
- [ ] Basic privacy/terms/disclaimers exist.

### By Day 60

- [ ] Private beta users are active.
- [ ] Product data quality workflow exists.
- [ ] Verification prototype exists.
- [ ] Analytics/error monitoring exists.
- [ ] Institution demo is credible.
- [ ] First partnership conversations are underway.

### By Day 90

- [ ] Beta learning report exists.
- [ ] Public beta decision made.
- [ ] Android release path decided.
- [ ] iOS strategy decided.
- [ ] Mizan Score methodology v0 drafted.
- [ ] Verification policy v0 drafted.
- [ ] Product data coverage targets defined.
- [ ] Partnership pipeline has clear next steps.

### By Day 120

- [ ] Public beta preparation is complete or consciously deferred.
- [ ] Android internal/beta build path is proven.
- [ ] iOS manual-first path is proven or delayed with reasons.
- [ ] Product data quality system is operational.
- [ ] Basic analytics/activation reporting is operational.
- [ ] Money intelligence V1 is useful.
- [ ] Institution pitch package exists.
- [ ] At least 10 institution outreach attempts have been made.

### By Day 180

- [ ] First-half strategy review is complete.
- [ ] Beta cohort results are understood.
- [ ] Activation and retention baselines exist.
- [ ] Mizan Score methodology v0 exists.
- [ ] Verification/share-card V1 exists or has been cut.
- [ ] Non-SMS import path exists or has been cut.
- [ ] Localization V1 exists or has been cut.
- [ ] Privacy/security hardening has started.
- [ ] Months 7-12 have been rewritten based on evidence.

### By Day 270

- [ ] Public beta expansion decision is made.
- [ ] At least one serious institution pilot conversation exists.
- [ ] Provider/product data operations are repeatable.
- [ ] Verification has either become a pillar or been demoted.
- [ ] Score open-source path is either active or deferred.
- [ ] Revenue hypothesis has narrowed.
- [ ] Android/iOS public strategy is updated.

### By Day 365

- [ ] Annual strategy review is complete.
- [ ] Year-two thesis is written.
- [ ] Core product wedge is chosen.
- [ ] Business model direction is chosen.
- [ ] Trust/compliance posture is reviewed.
- [ ] Product roadmap is rewritten.
- [ ] Sprint schedule is rebuilt for the next year.

## Backlog Parking Lot

Use this for valuable ideas that should not distract current sprints.

- [ ] Public open-source Mizan Score repository.
- [ ] Provider self-service portal.
- [ ] Paid sponsored product ranking.
- [ ] Capital markets trading integrations.
- [ ] Full iOS public launch.
- [ ] Fayda official integration.
- [ ] Bank API integrations.
- [ ] Net worth verification with institution confirmation.
- [ ] Property registry integration.
- [ ] Full multilingual launch.
- [ ] AI financial coach.
- [ ] Equb/idir group management.
- [ ] SME cashflow underwriting dashboard.
- [ ] Diaspora investment mode.
- [ ] Employer financial wellness product.

## Weekly Review Template

Copy this section at the bottom each week.

### Week Of YYYY-MM-DD

Sprint:

Primary outcome:

Shipped:

- [ ]

Not shipped:

- [ ]

Bugs found:

- [ ]

User feedback:

- [ ]

Metrics:

- Signups:
- Activated users:
- Manual transactions:
- Product views:
- Product saves:
- Profile completions:
- Verification/share attempts:
- Institution conversations:

Decisions made:

- [ ]

Next sprint changes:

- [ ]
