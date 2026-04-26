# Mizan Living Roadmap

Last updated: 2026-04-26

This is the working roadmap for Mizan. It is meant to be updated often: add items, remove items, split items, mark things as wrong, and keep the product honest.

## Current Product Thesis

Mizan is Ethiopia's financial intelligence layer.

It helps people understand their money, build a useful financial profile, discover suitable Ethiopian financial products, and eventually carry portable proof of financial trust.

Mizan is not a bank. For now, Mizan is not a regulated financial adviser. Recommendations are educational, contextual, and transparent.

## First Users

Primary early users:

- Addis salaried Android users.
- Students and young first-time financial users.

Secondary early users to keep in view:

- Young professionals with telebirr/CBE activity.
- People trying to build savings discipline.
- People comparing banks, MFIs, wallets, loans, savings, insurance, and investment products.
- Diaspora users later, especially for remittance, savings, home/property, and investment discovery.

## Core Promise

Mizan should do both:

- Help me track and understand my own money.
- Help me find the right financial products for me.

The product must work beautifully with manual entry. SMS import is a power feature, not a requirement for the app to be useful.

## Product Principles

- Mobile first, especially Android.
- Web can have unique power-user and admin features.
- Do not collect data unless Mizan actually needs it.
- Explain why data is requested.
- Give users visible value immediately after they answer profile questions.
- Never show broken financial values such as `NaN`, `undefined`, or impossible percentages.
- Prefer clear educational language over hype.
- Make trust visible: source, confidence, last updated, verified status.
- Let users correct Mizan. Corrections are product intelligence.
- Keep score logic transparent enough that users and institutions can inspect it.
- Make every recommendation explainable.
- Design for Ethiopian realities: cash, mobile money, fragmented bank apps, USSD, SMS, unreliable product data, Amharic-first mental models, regional access, MFIs, equb, idir, diaspora, and fast-changing regulation.

## North Star Metrics

Track these from the start:

- New signups.
- Activated users who add at least one account, transaction, goal, or profile answer.
- Users with 7-day and 30-day retention.
- Manual transactions created.
- SMS/imported transactions reviewed and accepted.
- Product searches.
- Product detail views.
- Product saves/bookmarks.
- Product applications or lead intents.
- Completed profiles.
- Mizan Score views.
- Score factor clicks.
- Account verification attempts.
- Verified profile/share-card creations.
- Financial institution partnership conversations.
- Financial institution signed pilots.
- Product data coverage by provider and category.
- Product freshness: percent checked within last 30/60/90 days.
- Error rate and slow endpoint rate.
- Support tickets or user complaints by category.

## Score Direction

The long-term ambition is for Mizan Score to become an open, inspectable standard for financial readiness and trust in Ethiopia.

Important distinction:

- Near term: Mizan Score is an educational readiness score.
- Medium term: Mizan Score becomes a transparent user-controlled profile signal.
- Long term: Mizan Score could become an open standard used by institutions, but only with careful governance, fairness, privacy, dispute rights, and regulatory alignment.

Possible open-score principles:

- Publish the scoring dimensions before publishing exact weights.
- Keep sensitive attributes out of direct scoring unless legally and ethically justified.
- Explain every factor in plain language.
- Let users simulate how actions affect the score.
- Let users dispute incorrect data.
- Version scoring models.
- Keep an audit trail of score changes.
- Do not punish users for missing data too aggressively.
- Separate "verified facts" from "behavioral estimates."
- Build a public methodology page before asking institutions to trust it.

Potential score dimensions:

- Identity confidence.
- Profile completeness.
- Income stability.
- Savings consistency.
- Budget discipline.
- Bill payment consistency.
- Emergency fund progress.
- Account verification level.
- Debt burden, if known.
- Transaction regularity.
- Product eligibility readiness.
- Financial learning progress.
- Data freshness.

## Verification Brainstorm

Verification can become one of Mizan's viral trust surfaces if users can share a clean card: "Verified by Mizan" for net worth, property, savings goal progress, business cashflow, or account ownership.

Verification must be tiered and explicit. Avoid one generic "verified" badge.

### Identity Verification

Possible levels:

- Self-declared name and phone/email.
- Phone/email confirmed.
- Fayda number entered by user.
- Fayda/eKYC verified through official or partner integration, if available.
- Photo ID uploaded and manually reviewed.
- Selfie plus ID match, if necessary.
- Kebele ID/passport/driver license supported where appropriate.

Data minimization:

- Do not store raw ID images forever unless needed.
- Store verification status, method, timestamp, reviewer/system, and minimal evidence metadata.
- Give users a deletion path where legally possible.

### Account Verification

Possible levels:

- Self-declared account or wallet.
- Account number format verified.
- Small statement/photo evidence uploaded.
- SMS evidence observed from same provider/account.
- Bank book or contract photo reviewed.
- Institution-confirmed account through partnership/API.

Account badges:

- Self-declared.
- Evidence provided.
- Mizan reviewed.
- Institution verified.

### Net Worth Verification

Possible components:

- Verified cash/wallet balances.
- Verified bank balances.
- Verified savings goals.
- Verified investments.
- Verified property.
- Verified vehicle.
- Verified business inventory/equipment.
- User-declared assets clearly separated from verified assets.

Important:

- A shareable net worth card must show "verified portion" versus "self-declared portion."
- Add date and freshness: "Verified as of Apr 26, 2026."
- Allow private, link-only, and public sharing.
- Let users hide exact amounts and show ranges.

### Property Verification

Possible levels:

- Self-declared property.
- Document uploaded.
- Utility/tax/payment evidence uploaded.
- Manual review.
- Government/registry/partner confirmation if available in the future.

Share ideas:

- "Verified property owner."
- "Verified rental payment history."
- "Verified construction savings goal."
- "Verified homebuyer readiness."

### Student / Young User Verification

Possible levels:

- Student self-declared.
- Student ID uploaded.
- University email/phone evidence.
- Tuition payment/bill evidence.

Potential benefits:

- Student savings products.
- Youth accounts.
- Education loans.
- Scholarships/financial literacy programs.

### Business / SME Verification

Possible levels:

- Self-declared business.
- Business license/TIN uploaded.
- Merchant wallet/account evidence.
- Sales/cashflow imported or manually logged.
- Supplier/customer payments observed.

Potential cards:

- Verified monthly cashflow range.
- Verified merchant activity.
- Verified business owner.
- Loan readiness profile.

## 10-Day Plan

Goal: make Mizan feel trustworthy enough for friendly internal users.

### Product Decisions

- Confirm first beta persona: Addis salaried Android user.
- Confirm second beta persona: student/young first-time financial user.
- Write one-sentence promise for each persona.
- Decide whether "Mizan Score" is shown during beta or framed as "Mizan Readiness."
- Decide the minimum manual-entry flow for a user with no SMS import.
- Decide which mobile screens are beta-critical: Home, Money, Find, Goals, Me.
- Decide which web screens are beta-critical: Home, Money, Find, Goals, Me, Admin.
- Decide which unfinished screens should be hidden from navigation.
- Decide whether wealth/capital markets are visible, hidden, or educational-only in beta.
- Decide whether public product applications/leads are enabled or only bookmarks/interested states.
- Decide beta language: English first with Amharic labels where high-value, or bilingual from the start.

### Trust And Bug Fixes

- Fix every `NaN` display.
- Add safe numeric formatting everywhere money appears.
- Add empty state CTAs for missing budgets, products, transactions, accounts, and goals.
- Fix Find mobile empty state if products exist on desktop.
- Fix duplicate connected accounts display.
- Rename raw account labels like `810` and `251994` where possible.
- Give unknown accounts clear labels such as "CBE account ending 810."
- Hide raw transaction reference strings from primary transaction cards.
- Add transaction detail view or expandable metadata for raw references.
- Ensure negative and positive transaction colors are consistent.
- Ensure every form submit has loading, success, and error states.
- Ensure failed mutations show user-friendly errors.
- Ensure account creation does not create duplicate accounts accidentally.
- Ensure goal creation works for newly authenticated users.
- Ensure a Prisma user exists before protected writes.
- Fix mobile notch/header overlap.
- Fix any mobile bottom nav overlap with scrolling content.
- Fix profile/account list overflow on mobile.
- Confirm logout works on web and mobile.
- Confirm onboarding redirect logic does not trap users.

### Manual Entry MVP

- Add manual transaction entry from Money.
- Add transaction fields: amount, direction, account, category, date, note.
- Add account creation from Money.
- Add account fields: name, provider, type, balance, optional account suffix.
- Add bill creation from Goals.
- Add savings goal creation from Goals.
- Add monthly budget setup from Goals.
- Add edit/delete for manual transactions.
- Add edit/delete for accounts.
- Add edit/delete for goals.
- Add "mark bill paid" action.
- Add "skip SMS import" path during onboarding.
- Add "I will enter manually" copy in onboarding.

### SMS Import Groundwork

- Keep SMS import optional.
- Add clear permission rationale for Android.
- Add local parser test fixtures for common telebirr/CBE/Dashen-style messages.
- Add parser confidence display in admin/dev tooling.
- Add imported-message duplicate detection checks.
- Add user correction fields for imported category, amount, account, direction.
- Add "review before adding" flow if not already present.
- Do not publicly launch SMS permission until privacy copy is ready.

### Marketplace Data

- Confirm product list loads from real seeded data on web and mobile.
- Add product count by category in admin.
- Add provider count by type in admin.
- Mark unverified products visually.
- Add "last updated" to product detail.
- Add "data source" internal field for products.
- Add "source URL/document/spreadsheet row" internal metadata where possible.
- Add "report incorrect information" button or placeholder.
- Ensure product categories match the public Find filters.
- Ensure provider slugs and product slugs are stable.
- Remove or quarantine products with obviously broken rates.
- Handle suspicious rate ranges such as `1719%` as unverified or parsed range candidates.

### UX Consistency

- Standardize labels: Home, Money, Find, Goals, Me, Mizan Score, Settings.
- Use one shell pattern for mobile primary screens.
- Use one shell pattern for web primary screens.
- Align mobile and web page order within each section.
- Align bottom nav icons and labels.
- Make all primary cards use consistent radius, shadow, and spacing.
- Reduce overly large mobile cards where content is sparse.
- Make buttons stable width/height.
- Add disabled states that explain why disabled.
- Remove decorative UI that does not add meaning.
- Make product cards scannable: name, provider, type, match, key fact.

### Admin

- Confirm admin protection works.
- Confirm only admin/moderator can access admin routes.
- Confirm taxonomy create/edit/delete works.
- Confirm provider create/edit/delete works.
- Confirm product create/edit/delete works.
- Confirm users list loads.
- Confirm moderation tabs load with useful empty states.
- Add admin dashboard "data health" summary.
- Add quick links from admin overview to Products, Providers, Taxonomy, Users, Moderation.
- Add "last updated" or "pending review" counts.
- Add admin audit log design, even if not implemented yet.

### Engineering Hygiene

- Run lint.
- Run web typecheck.
- Run mobile typecheck.
- Run web build.
- Run Prisma validate.
- Add a smoke-test checklist for beta.
- Add `.env` sanity checklist.
- Confirm generated artifacts are not accidentally committed.
- Remove or ignore `.DS_Store` files.
- Add route inventory status: live, beta, hidden, admin, future.
- Add basic API route tests for goals, accounts, transactions, products.
- Add shared money formatter tests.
- Add matching engine tests for hard filters.

### Privacy And Legal Basics

- Draft privacy policy.
- Draft terms of use.
- Draft AI/recommendation disclaimer.
- Draft educational-only disclaimer.
- Draft data deletion wording.
- Draft SMS permission explanation.
- Draft product data accuracy disclaimer.
- Draft score disclaimer.
- Add consent copy for importing SMS.
- Add consent copy for photo/document upload, before building upload.
- Add "not financial advice" language in recommendations.

### Founder / Business

- Create a list of 20 friendly beta users.
- Create a list of 10 students to interview.
- Create a list of 10 salaried workers to interview.
- Create a list of 20 financial institution contacts.
- Create a list of 5 MFI contacts.
- Create a list of 5 bank product/marketing contacts.
- Create a list of 5 fintech/payment contacts.
- Prepare a 5-slide partnership teaser.
- Prepare a 1-page product data partnership pitch.
- Prepare a short demo script.
- Record a 2-minute demo video.
- Write down the top 10 user interview questions.

## 30-Day Plan

Goal: run a useful private beta with real users and real product data.

### Product Scope

- Lock private beta feature list.
- Hide non-beta features from primary navigation.
- Make mobile the primary beta experience.
- Keep web available for richer desktop/admin use.
- Make manual entry complete enough for daily use.
- Make SMS import useful for Android testers, but optional.
- Make Find useful even without a complete profile.
- Make profile nudges progressively improve Find and Score.
- Make Goals useful with budget, bills, and savings goals.
- Make Me useful with identity, accounts, score, privacy, and settings.

### Onboarding

- Create fast onboarding path under 2 minutes.
- Ask only minimum required fields at signup.
- Let user choose goal: Track spending, Save better, Find products, Build score.
- Let user choose manual entry or SMS import.
- Add first account during onboarding or skip.
- Add first goal during onboarding or skip.
- Ask income range only when needed for matching/score.
- Ask student/salaried status early for first personas.
- Add Amharic-friendly labels for key concepts.
- Add onboarding completion analytics.
- Add drop-off tracking by step.

### Money

- Finish account CRUD.
- Finish transaction CRUD.
- Finish category selection.
- Add recurring transaction/bill detection manually.
- Add monthly income/outflow summary.
- Add spending categories chart.
- Add transaction filtering by account/category/date.
- Add search transactions.
- Add transfer between own accounts.
- Add "exclude from spending" for transfers.
- Add transaction split later placeholder, but do not ship unless needed.
- Add account balance recalculation rules.
- Decide if account balances are user-entered, transaction-derived, or hybrid.
- Add reconciliation UX for mismatched balances.
- Add CSV export for transactions.

### Goals

- Fix budget model and UI.
- Add budget templates for student and salaried user.
- Add budget category CRUD.
- Add bill reminders CRUD.
- Add savings goal CRUD.
- Add "add contribution" action.
- Add forecast copy based on current saving rate.
- Add overdue bill handling.
- Add "mark paid" and "skip this month."
- Add empty state for no budget.
- Add empty state for no bills.
- Add empty state for no goals.
- Add notification generation for upcoming bills.

### Find / Marketplace

- Make catalogue initial load fast.
- Add list/detail API payload split.
- Add provider filter.
- Add category filter.
- Add institution filter.
- Add search by product/provider/type.
- Add "for students" saved filter.
- Add "for salaried users" saved filter.
- Add "interest-free" filter.
- Add "digital only" filter.
- Add "low minimum balance" filter.
- Add "requires collateral" display for loans.
- Add "documents required" display.
- Add "eligibility" display.
- Add "fees/rates may change" warning.
- Add verified/unverified marker.
- Add product bookmark/save.
- Add product comparison for 2-3 products.
- Add product detail "why this matches you."
- Add product detail "what you may need."
- Add "I am interested" lead event, even if not sent to provider yet.
- Add admin review queue for product corrections.

### Mizan Score

- Rename or frame beta score carefully if needed.
- Define score categories: Build, Fair, Good, Strong, Excellent.
- Define factor list.
- Show score factors on mobile.
- Show actions to improve score.
- Make score deterministic for v1.
- Add version number to score calculation.
- Add "what this score is not" copy.
- Add user-visible score history.
- Add score recalculation trigger after profile/account/goal changes.
- Add tests for score calculation.
- Draft public score methodology v0.

### Verification

- Define verification levels formally.
- Add database fields or model plan for verification claims.
- Add account verification UI design.
- Add identity verification UI design.
- Add shareable profile card design.
- Add "verified net worth" concept design.
- Add "verified property owner" concept design.
- Add "verified student" concept design.
- Add "verified business cashflow" concept design.
- Decide which verification claim ships first.
- Recommended first claim: "Verified Mizan Profile."
- Recommended second claim: "Verified Account Evidence."
- Recommended later claim: "Verified Net Worth Range."
- Avoid exact public wealth flex by default; prefer ranges and privacy controls.

### Admin / Data Operations

- Add data quality dashboard.
- Add product freshness dashboard.
- Add provider completeness score.
- Add product completeness score.
- Add filters for unverified/stale products.
- Add bulk product activation.
- Add product duplicate detection.
- Add provider duplicate detection.
- Add source tracking for products.
- Add last reviewed by admin.
- Add review notes.
- Add admin role management safeguards.
- Add moderation useful empty states.
- Add account link review workflow.
- Add audit log for admin actions.

### Mobile

- Test on small Android screen.
- Test on large Android screen.
- Test on low-end Android if possible.
- Test slow network behavior.
- Test offline-ish states.
- Test keyboard overlap on forms.
- Test app resume behavior.
- Test logout/login cycle.
- Test manual entry without network loss.
- Test SMS permission denied path.
- Test SMS permission accepted path.
- Test product catalogue speed.
- Test image/icon loading.
- Prepare Android internal build.

### Web

- Make desktop Money remain richer than mobile without contradicting mobile.
- Make admin reliable.
- Make web catalogue server-render initial data if possible.
- Add responsive pass for tablet sizes.
- Add useful `/settings`.
- Add useful `/profile`.
- Add account management on web.
- Add product comparison on web first if easier.
- Add share-card preview on web if useful.

### Infrastructure

- Choose production hosting path.
- Choose production Supabase project.
- Set production env vars.
- Move from disposable DB thinking to migration discipline.
- Add migration review process.
- Add seeded data process.
- Add backup policy.
- Add rollback notes.
- Add staging environment.
- Add error monitoring.
- Add analytics.
- Add uptime checks.
- Add slow API logging.
- Add API rate limiting plan.
- Add admin access monitoring.

### Security / Privacy

- Implement data export.
- Implement account deletion request or direct deletion.
- Implement privacy settings page.
- Implement consent records for SMS import.
- Implement consent records for uploads before upload launch.
- Add least-privilege admin roles: admin, moderator, data editor.
- Add server-side authorization checks everywhere.
- Add sensitive event audit logging.
- Review storage of account numbers.
- Mask account numbers by default.
- Avoid storing full IDs unless necessary.
- Review Ethiopia Personal Data Protection Proclamation implications.
- Prepare breach response checklist.

### Research

- Interview 10 salaried users.
- Interview 10 students.
- Watch 5 users manually enter a transaction.
- Watch 5 users use Find.
- Watch 5 users interpret Mizan Score.
- Ask users what "verified net worth" means to them.
- Ask users what they would share publicly.
- Ask users what would feel creepy.
- Ask users what financial institutions they trust.
- Ask users which languages they want.
- Ask users how they currently compare bank/MFI products.
- Ask users about SMS privacy comfort.

### Partnerships

- Create institution CRM.
- Track contact, org, role, status, next step.
- Prepare bank/MFI pitch deck.
- Prepare data-provider pitch.
- Prepare student/youth finance pitch.
- Prepare "verified lead" pitch.
- Talk to at least 5 institutions.
- Talk to at least 2 MFIs.
- Talk to at least 1 wallet/payment provider.
- Talk to at least 1 university/student org.
- Talk to at least 1 financial literacy organization.

## 90-Day Plan

Goal: turn beta learning into a credible Ethiopia-first financial intelligence platform.

### Product Strategy

- Decide whether Mizan is primarily consumer app, marketplace, score standard, or all three with staged sequencing.
- Choose one wedge to lead with publicly.
- Recommended wedge: mobile money intelligence plus personalized product discovery.
- Decide whether to launch public Android beta.
- Decide whether web beta is public or invite-only.
- Decide whether iOS is delayed, limited, or launched with manual entry only.
- Define premium/provider revenue hypotheses.
- Define user trust policy for sponsored products.
- Define ranking policy before accepting paid placement.
- Define "organic match" versus "sponsored" labels.

### Consumer Product

- Make Home a real command center.
- Add recent activity.
- Add next best action.
- Add bill reminders.
- Add budget status.
- Add product recommendation teaser.
- Add profile progress.
- Add score progress.
- Add clean notification center.
- Add useful settings.
- Add privacy center.
- Add export/share profile.
- Add recurring money review: weekly/monthly summary.
- Add "month in review" shareable card.
- Add "financial checkup" flow.

### Manual Entry Excellence

- Add fast amount keypad.
- Add recent categories.
- Add merchant/payee memory.
- Add duplicate detection for manual entries.
- Add templates for common expenses.
- Add recurring manual transactions.
- Add bulk edit for transactions on web.
- Add transaction import from CSV or spreadsheet.
- Add statement upload research/prototype.

### SMS Import Excellence

- Build parser evaluation dataset.
- Track accuracy by provider/message type.
- Add parser version changelog.
- Add safe rollback for parser changes.
- Add automatic category suggestions.
- Add user correction feedback loop.
- Add confidence threshold tuning.
- Add import review inbox.
- Add unsupported message collection with consent.
- Add privacy-preserving parser telemetry.

### iOS Strategy

- Decide iOS v1 ingestion path.
- Options: manual entry only, statement upload, email forwarding, screenshot OCR, CSV import, provider integration.
- Build iOS manual-first experience.
- Avoid promising SMS access on iOS.
- Test iOS auth and API flows.
- Test iOS safe area/layout.
- Prepare TestFlight only after the core app feels coherent.

### Marketplace

- Reach 80%+ useful coverage for priority banks.
- Reach useful MFI coverage in priority regions.
- Add insurance products if data quality is acceptable.
- Add capital markets education pages.
- Add treasury bill/government bond explainer.
- Add ESX watchlist only if data source is credible.
- Add provider profile pages with branch/network info.
- Add product freshness SLA.
- Add provider correction request workflow.
- Add product review/rating moderation.
- Add verified user review marker.
- Add product comparison tables.
- Add product "requirements checklist."
- Add "prepare application" flow.
- Add lead capture but hold outbound sending until partnership terms are clear.

### Verification And Viral Trust

- Ship first shareable Mizan profile card.
- Ship privacy controls for share cards.
- Ship "verified profile" badge.
- Ship "verified account evidence" badge if review process exists.
- Prototype "verified net worth range."
- Prototype "verified savings streak."
- Prototype "verified student profile."
- Prototype "verified income range" with careful caveats.
- Add QR/link share page for verification cards.
- Add expiration/freshness dates to verification pages.
- Add revoke share link feature.
- Add screenshot-resistant but share-friendly design.
- Add "what was verified" disclosure.
- Add "what was not verified" disclosure.

### Mizan Score Standard

- Publish methodology v0 internally.
- Publish methodology v0 externally if ready.
- Open-source scoring library or spec draft if stable enough.
- Separate score engine from app UI.
- Add test fixtures for score examples.
- Add fairness review checklist.
- Add "no hidden paid boost" principle.
- Add versioned score API.
- Add score factor explanations.
- Add score simulator.
- Start conversations with institutions about what score signals they understand.
- Avoid using Mizan Score for credit decisions until governance is mature.

### Admin / Internal Tools

- Build institution CRM into admin or connect external CRM.
- Build product data import workflow.
- Build spreadsheet import preview.
- Build product diff review.
- Build stale-data queue.
- Build user support lookup.
- Build user impersonation carefully, or avoid it.
- Build account verification review queue.
- Build document review queue only if upload ships.
- Build moderation queue.
- Build partnership lead dashboard.
- Build analytics dashboard.
- Build data coverage dashboard.
- Build issue tagging for user feedback.

### Compliance / Governance

- Review Ethiopian data protection obligations with counsel if possible.
- Review SMS permission compliance for Play Store.
- Review whether recommendations trigger financial advisory/licensing concerns.
- Review whether lead generation requires provider agreements.
- Review whether score claims create consumer protection obligations.
- Create data retention policy.
- Create admin access policy.
- Create incident response policy.
- Create product data correction policy.
- Create user dispute policy for score/verification.
- Create provider dispute policy for incorrect product info.
- Create AI use policy.

### Partnerships

- Secure 1-2 informal institution champions.
- Secure 1 signed data-sharing or pilot MOU if possible.
- Pitch MFIs on product visibility and qualified leads.
- Pitch banks on youth/student/salaried acquisition.
- Pitch wallets on money intelligence and transaction categorization.
- Pitch universities/student associations for beta distribution.
- Pitch financial literacy orgs for content partnership.
- Prepare provider dashboard demo.
- Prepare anonymized insights report demo.
- Prepare "verified lead" demo.

### Growth

- Launch invite system.
- Launch referral tracking.
- Launch student ambassador experiment.
- Launch financial checkup campaign.
- Launch "what is your Mizan Score?" educational campaign carefully.
- Launch product comparison articles.
- Launch short videos explaining Ethiopian financial products.
- Launch Amharic content snippets.
- Launch LinkedIn founder/product updates.
- Launch waitlist landing page if not already.
- Track signup source.
- Track activation by source.

### Quality

- Add end-to-end tests for critical flows.
- Add API integration tests.
- Add visual regression snapshots for mobile web.
- Add browser smoke tests.
- Add mobile QA checklist.
- Add release checklist.
- Add staging deployment checks.
- Add seed data validation.
- Add product data validation scripts.
- Add performance budgets.
- Make `/api/v1/products?take=20` fast enough for mobile.
- Make catalogue first load feel instant or show skeletons gracefully.

## 365-Day Plan

Goal: become a trusted Ethiopian financial intelligence and marketplace standard.

### Product Expansion

- Mature Android app.
- Mature mobile web.
- Mature web app.
- Decide iOS public release path.
- Add robust manual, SMS, CSV, statement, and partner ingestion options.
- Add household/family money mode if demanded.
- Add student mode.
- Add salaried mode.
- Add SME mode.
- Add diaspora mode.
- Add equb/idir/cooperative mode.
- Add credit readiness mode.
- Add investment readiness mode.
- Add insurance readiness mode.
- Add property/homebuyer readiness mode.

### Verification Platform

- Make verification claims a real product layer.
- Support identity confidence.
- Support account evidence.
- Support savings evidence.
- Support income/cashflow range evidence.
- Support net worth range evidence.
- Support property-owner evidence where feasible.
- Support business-owner evidence.
- Support student evidence.
- Support shareable verification pages.
- Support expiring share links.
- Support verifier notes.
- Support dispute/correction flows.
- Support institution verification partnerships.

### Mizan Score Open Standard

- Publish open scoring spec v1.
- Publish open-source reference implementation.
- Publish methodology docs.
- Publish changelog.
- Publish example personas.
- Publish fairness/privacy principles.
- Publish API docs if external partners use it.
- Create score governance board/advisory circle.
- Add model/version certification if needed.
- Build institution-facing score interpretation guide.
- Build consumer-facing score education guide.

### Marketplace / Provider Network

- Cover all major Ethiopian banks.
- Cover priority MFIs.
- Cover major wallets/payment products.
- Cover major insurers.
- Cover selected SACCO/cooperative products.
- Cover capital market products as data availability matures.
- Add provider self-service portal.
- Add provider-verified product data.
- Add provider analytics.
- Add lead management.
- Add sponsored placements with strict disclosure, if monetizing that way.
- Add organic ranking policy.
- Add institution API or upload templates.
- Add product freshness SLAs.
- Add trust score for product data.

### Revenue

- Test provider lead generation.
- Test sponsored product visibility with clear labels.
- Test provider SaaS dashboard.
- Test verified profile/report export.
- Test premium consumer insights.
- Test employer/student financial wellness partnerships.
- Test MFI/bank campaign tools.
- Test anonymized market insights, only if privacy-safe.
- Define revenue lines that do not corrupt user trust.
- Publish conflict-of-interest policy.

### Data And Intelligence

- Build normalized Ethiopian financial product database.
- Build transaction categorization model tuned to Ethiopia.
- Build SMS parser library with provider/message coverage.
- Build user correction learning system.
- Build recommendation engine v2.
- Build eligibility rules engine.
- Build regional access engine.
- Build affordability calculators.
- Build debt burden calculators.
- Build emergency fund simulator.
- Build savings forecast engine.
- Build product comparison engine.
- Build provider reliability/freshness metrics.

### Localization

- Ship strong Amharic support.
- Consider Afaan Oromo based on user demand.
- Consider Tigrinya based on user demand.
- Localize financial concepts, not just labels.
- Use ETB formatting consistently.
- Support Ethiopian calendar where valuable.
- Support local date display preferences.
- Support offline/low-bandwidth behavior.
- Support USSD/SMS-adjacent mental models.
- Build explainers for financial terms.

### Regulation And Trust

- Maintain privacy policy.
- Maintain terms.
- Maintain score methodology.
- Maintain product data correction policy.
- Maintain provider ranking policy.
- Maintain AI/recommendation disclosure.
- Maintain data retention policy.
- Maintain security policy.
- Conduct annual security review.
- Conduct privacy review.
- Conduct score fairness review.
- Conduct data quality audit.
- Create regulator-ready product brief.
- Build relationships with relevant regulators and ecosystem actors.

### Infrastructure

- Production-grade CI/CD.
- Staging and production environments.
- Database migration discipline.
- Backups and restores tested.
- Error monitoring.
- Product analytics.
- Audit logging.
- Rate limiting.
- Secrets management.
- Admin RBAC.
- Object storage security.
- Mobile release pipeline.
- App Store/Play Store release discipline.
- Incident response drills.
- Performance monitoring.
- Data warehouse or analytics store if needed.

### Team / Operating System

- Weekly product review.
- Weekly user feedback review.
- Weekly data quality review.
- Weekly growth review.
- Monthly roadmap prune.
- Monthly partnership pipeline review.
- Monthly security/privacy review.
- Quarterly strategy reset.
- Keep a public changelog.
- Keep an internal decision log.
- Keep product metrics dashboard.
- Keep institution CRM current.
- Keep user research repository.
- Keep bug triage board.

### Brand And Community

- Own the phrase "financial intelligence for Ethiopia."
- Build educational content around Ethiopian finance.
- Explain Mizan Score openly.
- Create student financial literacy content.
- Create salary management content.
- Create product comparison content.
- Create diaspora finance content later.
- Build trust through transparency, not hype.
- Show product data freshness.
- Show how recommendations work.
- Let users share wins without exposing sensitive numbers.

## Routine Update Cadence

Suggested routine:

- Daily during build sprints: move tasks into today/next/later.
- Weekly: mark completed, blocked, deleted, and newly discovered tasks.
- Monthly: remove things that no longer match strategy.
- Quarterly: rewrite the thesis if reality changed.

Suggested task labels:

- `now`
- `next`
- `later`
- `blocked`
- `research`
- `partner`
- `privacy`
- `infra`
- `mobile`
- `web`
- `admin`
- `score`
- `verification`
- `marketplace`

## Immediate Open Decisions

- Should beta show "Mizan Score" or "Mizan Readiness"?
- Which verification claim ships first?
- Do we launch product leads before signed institution partnerships?
- How much Amharic is needed for the first beta?
- Is Android SMS import internal-only for now?
- Which screens are hidden from beta navigation?
- What is the first public share card?
- What is the first financial institution pitch?
- What exact activation metric matters most: first transaction, first account, first goal, first product save, or completed profile?
