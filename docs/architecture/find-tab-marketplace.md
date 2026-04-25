# Find Tab: Comprehensive Financial Product Marketplace

## The Vision

Transform the Find tab into **Ethiopia's most complete financial product directory** — covering every product type, every provider, with reviews, account linking, and personalized matching.

---

## Decisions (From Your Feedback)

| Question | Decision |
|---|---|
| Data quality (bad rates) | Flag as `unverified`, never block. 1719% is likely a range "17-19%" |
| Account linking | Tiered: Self-declared → Account number → Photo verification (bank book/contract snap) |
| Match scoring | Profile-based (completeness, income/expense, debts). Nudge to fill profile. Iterate later |
| Marketplace listings | **Deferred** — no real estate/vehicles for now |
| Review moderation | Not needed now. Simple star ratings + text |
| Capital markets | Yes, separate category. Could be its own tool/section |
| Product taxonomy | Must be **flexible/editable** — admin-manageable, not hardcoded enums |

---

## Product Taxonomy (Comprehensive & Extensible)

> [!IMPORTANT]
> `productType` values are **not a fixed enum** — they're strings stored in DB with a `ProductTypeDefinition` reference table that admins can extend. The classes below are the 6 top-level buckets.

### Full Product Map

```
CLASS: SAVINGS & DEPOSITS
├── regular_savings          # Standard passbook savings
├── demand_deposit           # Checking/current account
├── time_deposit             # Fixed-term deposit
├── fixed_deposit            # Certificate of deposit
├── youth_savings            # Under-18 accounts
├── teen_savings             # 14-17 self-operated
├── womens_savings           # Gender-focused products
├── diaspora_savings         # FCY-source deposits
├── forex_account            # Foreign currency account
├── provident_fund           # Employer-sponsored
├── mortgage_savings         # Pre-qualification savings
├── holiday_savings          # Purpose-specific
├── sme_savings              # Small business accounts
├── premium_savings          # High-balance tier
├── escrow_deposit           # Tripartite agreement
├── compulsory_savings       # MFI mandatory savings
├── voluntary_savings        # MFI optional savings
├── salary_account           # Payroll-linked
└── [admin_can_add_more]

CLASS: CREDIT & LENDING
├── personal_loan            # Consumer/household
├── business_loan            # Working capital, SME
├── housing_loan             # Mortgage / home purchase
├── vehicle_loan             # Auto financing
├── agriculture_loan         # Farming, livestock
├── micro_loan               # MFI small loans
├── group_loan               # Joint liability
├── merchandise_loan         # Against goods/docs
├── overdraft                # Revolving credit line
├── emergency_loan           # Quick-access personal
├── consumer_durables_loan   # Furniture, appliances
├── education_loan           # School/university fees
├── diaspora_loan            # FCY-backed lending
├── investment_loan          # Project financing
├── warehouse_receipt        # ECX commodity-backed
├── lease_financing          # Equipment leasing
├── trade_finance            # LC, guarantee, export credit
└── [admin_can_add_more]

CLASS: INSURANCE
├── motor_comprehensive      # Full vehicle coverage
├── motor_third_party        # Mandatory liability
├── life_term                # Pure protection
├── life_endowment           # Savings + protection
├── life_whole               # Lifetime coverage
├── health_group             # Corporate medical
├── health_individual        # Personal medical
├── property_fire            # Fire & allied perils
├── property_burglary        # Theft coverage
├── marine_cargo             # Import/export goods
├── travel                   # International travel
├── engineering_car          # Construction all risk
├── engineering_ear          # Erection all risk
├── machinery_breakdown      # Equipment failure
├── workmen_compensation     # Employee injury
├── professional_indemnity   # Liability for professionals
├── general_liability        # Public liability
├── agricultural_crop        # Crop/weather insurance
├── livestock                # Animal insurance
├── microinsurance           # Low-premium basic cover
├── bond_insurance           # Performance/bid bonds
├── group_credit_life        # Loan protection
└── [admin_can_add_more]

CLASS: PAYMENT & DIGITAL
├── mobile_wallet            # Telebirr, CBEBirr, M-Birr
├── p2p_transfer             # Person-to-person
├── bill_payment             # Utilities, school, gov
├── merchant_qr              # QR scan & pay
├── agent_banking            # Cash-in/cash-out agents
├── ussd_banking             # Feature phone access
├── internet_banking         # Web portal
├── mobile_banking_app       # Bank's own app
├── international_remittance # Inbound/outbound
├── bnpl                     # Buy now pay later
├── pos_terminal             # Card acceptance
└── [admin_can_add_more]

CLASS: CAPITAL MARKETS & INVESTMENT
├── esx_stock                # Equity shares on ESX
├── government_bond          # Sovereign bonds
├── treasury_bill            # T-bills (28/91/182/364 day)
├── corporate_bond           # Company debt
├── sukuk_bond               # Sharia-compliant bond
├── municipal_bond           # City/region bonds
├── mutual_fund              # Pooled investment
├── etf                      # Exchange-traded fund
├── reit                     # Real estate investment trust
├── pension_fund             # Retirement savings
├── crowd_investment         # ESX alternative market
└── [admin_can_add_more]

CLASS: COMMUNITY & COOPERATIVE
├── equb_weekly              # Rotating savings (weekly)
├── equb_monthly             # Rotating savings (monthly)
├── equb_daily               # Daily contribution
├── idir                     # Mutual aid / funeral fund
├── sacco_savings            # Cooperative savings
├── sacco_loan               # Cooperative credit
├── sacco_share              # Membership shares
└── [admin_can_add_more]
```

---

## Proposed Schema Changes

### New Prisma Models (Summary)

| Model | Purpose |
|---|---|
| `Provider` | Institution/company (bank, insurer, MFI, etc.) with branding |
| `Product` (redesigned) | Financial product with `productClass` + flexible `productType` string + JSON `attributes` |
| `ProductTypeDefinition` | Admin-editable registry of product types with labels, icons, class mapping |
| `ProductReview` | User star rating + text for products |
| `ProviderReview` | User rating for institutions |
| `ProductBookmark` | User saved/favorited products |
| `ProductApplication` | Tiered: INTERESTED → APPLIED → SELF_DECLARED → VERIFIED → ACTIVE |
| `AccountLink` | Tiered verification: self-declared, account-number, photo-verified |
| `ProductTag` | Structured tags on products for filtering + profile matching |
| `TagDefinition` | Admin-editable tag registry with categories and profile-mapping rules |

### Key Design: Product Tags (For Matching & Filtering)

> [!IMPORTANT]
> Tags are the **bridge between products and user profiles**. Each tag belongs to a category and maps to specific user profile fields. This is how we answer: "Show me products that fit *me*."

#### Tag Taxonomy

```
CATEGORY: AUDIENCE (→ matches user demographics)
├── women_only              # Gender-focused product
├── youth                   # Under 18
├── teen                    # 14-17
├── senior                  # Retirement-age
├── diaspora                # Ethiopian abroad / FCY source
├── expat                   # Foreign nationals in ET
├── first_time_saver        # New to banking
├── low_income              # Below threshold
├── salaried                # Regular employment
├── self_employed           # Own business
├── group_based             # Requires group membership
└── ngo_staff               # NGO/intl org employees

CATEGORY: SECTOR (→ matches user employment/business)
├── agriculture             # Farming, livestock, agri-business
├── manufacturing           # Factory, production
├── trade                   # Import/export, wholesale, retail
├── construction            # Building, real estate dev
├── transport               # Logistics, vehicles
├── hospitality             # Hotels, restaurants, tourism
├── technology              # IT, software, digital
├── education               # Schools, universities
├── health                  # Hospitals, clinics, pharma
├── creative                # Arts, media, entertainment
└── general                 # No sector restriction

CATEGORY: FEATURE (→ matches user preferences)
├── interest_free           # Sharia-compliant / 0% interest
├── digital_only            # No branch visit needed
├── mobile_accessible       # Has USSD or mobile app
├── no_collateral           # Unsecured
├── flexible_repayment      # Choose your schedule
├── instant_disbursement    # Same-day/next-day funds
├── compound_interest       # Interest on interest
├── profit_sharing          # Cooperative dividend
├── loyalty_reward          # Points/benefits for usage
├── zero_minimum            # No minimum balance
├── salary_advance          # Against upcoming salary
└── auto_debit              # Automatic payment/saving

CATEGORY: COMPLIANCE
├── sharia_compliant        # Islamic finance principles
├── nbe_regulated           # Under NBE supervision
├── deposit_insured         # Government deposit guarantee
├── mandatory               # Required by law (e.g., 3rd party motor)
└── tax_advantaged           # Tax benefits

CATEGORY: ACCESS_REQUIREMENT (→ matches user situation)
├── requires_account        # Must have existing account
├── requires_membership     # SACCO/cooperative member
├── requires_guarantor      # Need a co-signer
├── requires_collateral     # Asset pledge required
├── requires_business_license # Formal business only
├── requires_kebele_id      # Kebele-issued ID
├── requires_tin            # Tax identification number
├── min_credit_score        # Minimum score threshold
└── min_savings_history     # Must save for X months first

CATEGORY: COLLATERAL_TYPE (→ for credit products)
├── property                # Real estate / buildings
├── vehicle                 # Cars, trucks
├── equipment               # Machinery, tools
├── inventory               # Stock/merchandise
├── salary_assignment       # Paycheck guarantee
├── group_guarantee         # Group liability
├── gold                    # Precious metals
├── savings_pledge          # Against own savings
└── none_required           # Unsecured
```

#### Schema: Tag Models

```prisma
model TagDefinition {
  id            String   @id @default(cuid())
  slug          String   @unique       // 'interest_free', 'agriculture'
  label         String                  // 'Interest-Free'
  labelAmh      String?                 // 'ወለድ-አልባ'
  category      String                  // 'FEATURE', 'AUDIENCE', 'SECTOR', etc.
  icon          String?                 // Emoji or icon name
  description   String?
  
  // Profile mapping: which user field does this tag match against?
  profileField  String?                 // 'interestFree', 'gender', 'employmentStatus'
  profileValue  String?                 // 'true', 'FEMALE', 'SELF_EMPLOYED'
  
  productTags   ProductTag[]
  createdAt     DateTime @default(now())
}

model ProductTag {
  id           String   @id @default(cuid())
  productId    String
  tagId        String
  
  product      Product        @relation(fields: [productId], references: [id], onDelete: Cascade)
  tag          TagDefinition  @relation(fields: [tagId], references: [id], onDelete: Cascade)
  
  @@unique([productId, tagId])
}
```

#### How Tags Drive Matching

```
User Profile                    Tag (on product)              Match?
─────────────                   ──────────────                ──────
gender: 'FEMALE'            ←→  women_only                   ✅ Boost
interestFree: true          ←→  interest_free                ✅ Boost
employmentStatus: 'FARMER'  ←→  agriculture                  ✅ Boost
digitalAdoption: 'MOBILE'   ←→  digital_only                 ✅ Boost
monthlyIncome: 'LOW'        ←→  low_income                   ✅ Boost
housingStatus: 'RENT'       ←→  housing_loan                 ✅ Relevant
riskAppetite: 'SAFE'        ←→  deposit_insured              ✅ Boost

// Negative signals (filter OUT):
gender: 'MALE'              ←→  women_only                   ❌ Hide/lower
hasBusinessLicense: false   ←→  requires_business_license    ⚠️ Flag requirement
```

#### Example: Tagged Product

```json
{
  "name": "Enat Women's Business Loan",
  "productClass": "CREDIT",
  "productType": "business_loan",
  "tags": [
    "women_only",        // AUDIENCE → gender: FEMALE
    "interest_free",     // FEATURE → interestFree: true
    "agriculture",       // SECTOR
    "no_collateral",     // FEATURE
    "requires_kebele_id" // ACCESS_REQUIREMENT
  ]
}
```

### Key Design: Tiered Account Linking

```
Level 1: SELF_DECLARED     → "I have this product" (user taps a button)
Level 2: ACCOUNT_LINKED    → User provides account number (validated format)
Level 3: PHOTO_VERIFIED    → User uploads photo of bank book / loan contract
                             (manual or AI verification later)
```

### Key Design: Match Score (Tag-Aware, Profile-Based)

```typescript
function computeMatchScore(user: User, product: Product, tags: TagDefinition[]): number {
  let score = 50; // Base

  // 1. Profile completeness bonus (0-15 pts)
  score += getProfileCompleteness(user) * 15;

  // 2. Tag-based matching (0-30 pts) — THE BIG ONE
  for (const tag of tags) {
    if (!tag.profileField) continue; // Tag doesn't map to profile
    const userValue = user[tag.profileField];
    
    if (tag.category === 'AUDIENCE') {
      // Audience tags: boost if match, penalize if exclusive mismatch
      if (matchesProfile(userValue, tag.profileValue)) score += 6;
      else if (isExclusiveTag(tag)) score -= 15; // e.g., women_only for male user
    }
    
    if (tag.category === 'FEATURE') {
      // Feature preference match
      if (matchesProfile(userValue, tag.profileValue)) score += 4;
    }
    
    if (tag.category === 'SECTOR') {
      // Sector alignment with employment
      if (matchesProfile(userValue, tag.profileValue)) score += 5;
    }
    
    if (tag.category === 'ACCESS_REQUIREMENT') {
      // User CAN'T access → penalize
      if (!meetsRequirement(user, tag)) score -= 10;
    }
  }

  // 3. Income-to-product fit (0-10 pts)
  if (user.monthlyIncomeRange && product.attributes) {
    score += incomeToProductFit(user, product) * 10;
  }

  // 4. Risk appetite alignment (0-5 pts)
  score += riskAlignment(user.riskAppetite, product.productClass) * 5;

  return Math.max(0, Math.min(100, Math.round(score)));
}
```

When we can't score properly → show "Complete your profile for a personalized match" nudge.

> [!TIP]
> The beauty of tags: when a user fills in `employmentStatus: 'FARMER'`, *every* product tagged `agriculture` automatically rises in their feed — no custom scoring code needed per product.

---

## Sprint Breakdown

### Sprint 1: Foundation (Schema + Data Migration)
> **Goal**: New DB schema live, all existing data migrated, nothing broken

| # | Story | Points | Details |
|---|---|---|---|
| 1.1 | Create `Provider` model + migration | 3 | New Prisma model, run migration |
| 1.2 | Create `ProductTypeDefinition` model | 2 | Admin-editable type registry with class, label, icon, description |
| 1.3 | Redesign `Product` model | 5 | New fields: `productClass`, `productType`, `providerId`, JSON `attributes`. Keep old fields during transition |
| 1.4 | Create interaction models | 3 | `ProductReview`, `ProductBookmark`, `ProductApplication`, `AccountLink` |
| 1.5 | Seed providers from `banks.ts` | 3 | Script: import 70+ institutions into `Provider` table with proper types, branding |
| 1.6 | Migrate bank products (235) | 5 | Script: map flat fields → new schema + JSON attributes, link to providers |
| 1.7 | Migrate MFI products (82) | 3 | Script: clean up data quality issues (flag unverified rates), link to providers |
| 1.8 | Migrate directory products (20) | 2 | Script: insurance, wallet, SACCO, BNPL from `directory.ts` |
| 1.9 | Seed `ProductTypeDefinition` | 2 | Populate the full taxonomy from the map above |
| 1.10 | Data quality audit report | 2 | Script: generate report of missing/suspicious data, flag `isVerified: false` |
| 1.11 | Create `TagDefinition` + `ProductTag` models | 2 | Prisma models + seed all ~70 tag definitions from taxonomy |
| 1.12 | Auto-tag existing products | 3 | Script: scan product fields (name, description, features, eligibility) and auto-assign tags. E.g., "interest-free" in name → `interest_free` tag; "women" → `women_only`; MFI agriculture loan → `agriculture` + `micro_loan` |
| | **Sprint Total** | **35** | |

---

### Sprint 2: API Layer
> **Goal**: Full REST API for products, providers, reviews, bookmarks

| # | Story | Points | Details |
|---|---|---|---|
| 2.1 | `GET /api/v1/providers` | 3 | List/search/filter providers by type, with product counts |
| 2.2 | `GET /api/v1/providers/[slug]` | 2 | Provider detail + their products + avg rating |
| 2.3 | Redesign `GET /api/v1/products` | 5 | Full filtering: class, type, provider, digital, interest-free, search. Pagination. Include provider branding in response |
| 2.4 | `GET /api/v1/products/[id]` | 3 | Full detail with attributes, provider, reviews summary, user bookmark state |
| 2.5 | `POST/DELETE /api/v1/products/[id]/bookmark` | 2 | Toggle bookmark for authenticated user |
| 2.6 | `POST/GET /api/v1/products/[id]/reviews` | 3 | Create review (1-5 stars + text), list reviews |
| 2.7 | `POST /api/v1/products/[id]/apply` | 2 | Track application interest (tiered status) |
| 2.8 | `POST /api/v1/account-links` | 3 | Create account link (self-declared, account number, or photo upload) |
| 2.9 | Match score endpoint | 3 | `GET /api/v1/products?scored=true` — returns products with personalized `matchScore` based on user profile + tag matching |
| 2.10 | `GET /api/v1/product-types` | 2 | List all available product type definitions (for filter UI) |
| 2.11 | `GET /api/v1/tags` + tag filtering | 3 | List tags by category. Products API accepts `tags=interest_free,agriculture` filter param |
| | **Sprint Total** | **31** | |

---

### Sprint 3: Web Catalogue Rebuild
> **Goal**: Web Find page uses new API, rich filtering, provider pages

| # | Story | Points | Details |
|---|---|---|---|
| 3.1 | `<ProviderAvatar>` component | 2 | Renders logo if available, falls back to initials + brandColor. Used everywhere |
| 3.2 | Product card redesign | 3 | New card component showing: provider avatar, product name, class badge, quick stats, match score, bookmark button |
| 3.3 | Catalogue page with 6-class tabs | 5 | Tabs: All, Savings, Credit, Insurance, Payment, Capital Markets, Community. Each tab shows sub-type filters |
| 3.4 | Advanced filter sidebar/sheet | 3 | Filter by: provider type, product type, tags (interest-free, women-only, no-collateral, sector), min/max rate, provider |
| 3.5 | Product detail page rebuild | 5 | Use new schema. Show typed attributes, provider card, tag badges, reviews section, bookmark, "I'm interested" CTA, account link |
| 3.6 | Provider profile page | 3 | `/catalogue/provider/[slug]` — provider info, branding, all their products, reviews, branch count |
| 3.7 | Review submission UI | 2 | Star rating + text input on product detail page |
| 3.8 | Bookmark / saved products page | 2 | User's bookmarked products list |
| 3.9 | Delete `products.ts` (235KB static) | 1 | Remove hardcoded data, everything from API/DB now |
| 3.10 | "Complete Profile" nudge cards | 2 | When match score is low, show targeted nudge: "Tell us your income range for better matches" |
| | **Sprint Total** | **28** | |

---

### Sprint 4: Mobile Catalogue
> **Goal**: Mobile Find tab uses real API, matches web functionality

| # | Story | Points | Details |
|---|---|---|---|
| 4.1 | Mobile product types & interfaces | 2 | Shared types from `@mizan/shared` for new schema |
| 4.2 | API client updates | 2 | Add providers, bookmarks, reviews, account-links to `MizanAPI` client |
| 4.3 | Mobile catalogue screen rebuild | 5 | Replace 3 hardcoded products with real API. Class tabs, search, filter chips |
| 4.4 | Mobile product detail screen | 5 | New screen: provider header, typed attributes, reviews, bookmark, apply CTA |
| 4.5 | Mobile provider profile screen | 3 | Provider detail with product list |
| 4.6 | Mobile bookmark toggle | 2 | Heart icon on cards, saved products in profile |
| 4.7 | Mobile review submission | 2 | Simple star + text modal |
| 4.8 | Mobile account linking flow | 3 | 3-tier: checkbox → account number → camera for bank book photo |
| 4.9 | Match score display + nudges | 2 | Score badge on cards, "improve your match" prompts |
| 4.10 | Guest mode for catalogue | 2 | Browse products without login, prompt to sign up for bookmarks/reviews |
| | **Sprint Total** | **28** | |

---

### Sprint 5: Capital Markets & Polish
> **Goal**: Capital markets section, data completeness, UX polish

| # | Story | Points | Details |
|---|---|---|---|
| 5.1 | Capital Markets data sourcing | 5 | Seed ESX-listed companies, T-bill rates, bond data. Could be separate admin tool |
| 5.2 | Capital Markets browse UI | 5 | Separate section/tool: ESX stocks with prices, bonds, T-bills. Different card layout |
| 5.3 | Product comparison tool | 3 | Compare 2-3 products side by side (same class) |
| 5.4 | "What's missing" admin dashboard | 3 | Shows: providers without products, products without rates, unverified flags |
| 5.5 | Product type admin management | 3 | Admin UI to add/edit product type definitions |
| 5.6 | Provider branding upload | 2 | Admin can upload logo SVG/PNG for providers |
| 5.7 | Search improvements | 3 | Full-text search across product names, descriptions, provider names. Amharic support |
| 5.8 | Performance & caching | 2 | Cache product lists, provider data. Paginate large result sets |
| 5.9 | Data completeness tracking | 2 | Per-product completeness % (has rate? has description? has eligibility?) |
| | **Sprint Total** | **28** | |

---

## Summary

| Sprint | Theme | Stories | Points |
|---|---|---|---|
| **Sprint 1** | Foundation (Schema + Migration + Tags) | 12 | 35 |
| **Sprint 2** | API Layer (+ Tag Filtering) | 11 | 31 |
| **Sprint 3** | Web Catalogue Rebuild | 10 | 28 |
| **Sprint 4** | Mobile Catalogue | 10 | 28 |
| **Sprint 5** | Capital Markets & Polish | 9 | 28 |
| **Total** | | **52 stories** | **150 pts** |

> [!TIP]
> Sprints 1-2 are backend-focused (no UI changes visible to users). Sprint 3-4 can run in parallel if you have capacity. Sprint 5 is enhancement/polish that can be further broken down.

---

## Key Files Affected

### New Files
- `apps/web/prisma/schema.prisma` — Updated with 6 new models
- `apps/web/scripts/seed_providers.ts` — Provider import script
- `apps/web/scripts/migrate_products.ts` — Product migration script
- `apps/web/app/api/v1/providers/` — Provider API routes
- `apps/web/app/api/v1/products/[id]/reviews/` — Review API
- `apps/web/app/api/v1/products/[id]/bookmark/` — Bookmark API
- `apps/web/app/api/v1/account-links/` — Account linking API
- `apps/web/components/ProviderAvatar.tsx` — Brand-aware avatar
- `apps/mobile/app/product/[id].tsx` — Mobile product detail

### Modified Files
- `packages/shared/types/index.ts` — New Provider, Product types
- `packages/shared/types/ui.ts` — Updated MizanProduct
- `packages/api-client/index.ts` — New endpoints
- `apps/web/app/catalogue/page.tsx` — Rebuilt with new API
- `apps/web/app/catalogue/[id]/page.tsx` — Rebuilt with new schema
- `apps/mobile/app/(tabs)/catalogue.tsx` — Rebuilt with real API

## Final Implementation Summary

The Mizan Marketplace is now a fully data-driven, scalable infrastructure for financial product discovery in Ethiopia.

### 1. Database Layer (Prisma)
- **Providers**: 70+ banks, insurers, and MFIs with normalized branding.
- **Taxonomy**: 80+ product types across 6 classes (Savings, Credit, Insurance, Payment, Capital Markets, Community).
- **Tags**: 70+ tags driving the matching engine (e.g., `interest_free`, `women_only`, `agriculture`).

### 2. Matching Engine (v1.5)
- **Profile-Aware**: Scores (0-100) are computed based on user profile completeness and tag alignment.
- **Sector Boosts**: Employment as a `FARMER` gives a +15 boost to `agriculture` products.
- **Exclusionary Logic**: `women_only` products are heavily penalized for male users (-40) to ensure high-relevance feeds.

### 3. API Surface (v1.0)
- `GET /api/v1/products`: Discovery with advanced filtering (class, type, tags, provider, search).
- `GET /api/v1/products/[id]`: Rich details including structured attributes.
- `GET /api/v1/providers`: Institutional list with product counts.
- `GET /api/v1/admin/marketplace/stats`: Provider leaderboard and engagement analytics.
- `POST /api/v1/products/[id]/track`: View/Click interaction tracking.

### 4. Mobile UX (Find Tab)
- **Marketplace Home**: Horizontal categories, featured horizontal scroll, and vertical product lists.
- **Profile Bridge**: Contextual nudges to complete profile fields for better matching.
- **Product Detail**: Premium view with Bookmark, Share, and Apply actions.
- **Filter System**: Advanced modal for deep searching by provider and product features.

---
*Documented on: 2026-04-24*
