# Build Mizan Admin Interface

This plan outlines the architecture and implementation steps to build out the `app/admin` interface for Mizan. Currently, the admin dashboard at `app/admin/page.tsx` is scaffolded with a static UI but lacks the database integration needed to administer the platform's customizable taxonomy and data. 

Our goal is to build out fully functional CRUD operations for the core customizable layers: **Taxonomy** (Product Types, Tags), **Providers** (Institutions), and **Products**.

## User Review Required

> [!WARNING]
> **Authentication Setup**
> The web application uses Supabase. We need to ensure that the admin routes (`/admin/*`) are protected by a middleware or layout that verifies the user has the `ADMIN` role from the Prisma `User` table, not just a Supabase auth token. Is the Role field currently syncing correctly with Supabase claims, or should we query the database in the layout?

> [!IMPORTANT]
> **Form Components**
> Mizan seems to use a combination of Radix/Shadcn UI conventions (clsx, tailwind-merge, lucide-react). We will build the admin forms using `react-hook-form` and `zod` (both are in `package.json`). Should we generate raw Tailwind forms or are there existing Shadcn UI components in `apps/web/components/ui` that we should strictly adhere to?

## Proposed Changes

### 1. Security & Layout

- **`app/admin/layout.tsx`**: Add a server-side check. If the authenticated user does not have `Role.ADMIN`, redirect them to `/` or a `403 Unauthorized` page. 
- Create a global Sidebar/Navigation component to replace the static tab-based layout in `page.tsx`. This allows deep-linking into specific admin sections (e.g., `/admin/products`, `/admin/taxonomy`).

### 2. Taxonomy & Tag Management (The Customizable Core)

This is the non-hardcoded feature engine that powers Mizan's matchmaking.

#### [NEW] `app/admin/taxonomy/page.tsx`
- **Product Types**: UI to define new `ProductTypeDefinition` rows (e.g., `personal_loan`, `motor_comprehensive`). Admins can map these to broad `productClass` categories.
- **Tags**: UI for `TagDefinition`. Admins can create tags (e.g., `interest_free`) and set the `profileField` and `profileValue` so the AI/matching engine knows how to match a product to a user.

#### [NEW] `app/api/admin/taxonomy/route.ts`
- API routes to handle POST/PUT/DELETE for Product Types and Tags.

### 3. Provider Management (Institutions)

#### [NEW] `app/admin/providers/page.tsx`
- Data table listing all rows in the `Provider` model.
- Modal or separate page (`/admin/providers/[id]`) to edit Provider details: `slug`, `type` (BANK, MFI, etc.), branding (`logoUrl`, `brandColor`), and ESX listings.

#### [NEW] `app/api/admin/providers/route.ts`
- API routes to fetch, create, and update Providers.

### 4. Product Catalog Management

Because product attributes vary wildly between a Loan and Insurance, the admin interface must support dynamic JSON forms.

#### [NEW] `app/admin/products/page.tsx`
- Searchable, filterable data table for `Product`.
- Bulk actions to toggle `isActive`, `isFeatured`, or `isVerified`.

#### [NEW] `app/admin/products/[id]/page.tsx`
- Complex form for editing a single product.
- **Base Fields**: Name, Provider mapping, Product Type.
- **Dynamic Attributes**: A JSON editor or dynamic form fields bound to `Product.attributes` to store specific data (like `interestRate`, `maxAmount` for loans, or `coverageLimit` for insurance).
- **Tag Assignment**: A multi-select UI to bind `TagDefinition` rows to this product via `ProductTag`.

#### [NEW] `app/api/admin/products/route.ts`
- Handlers for the complex product updates.

### 5. Content, Users, and Moderation

- **Users**: `/admin/users` to view users, change roles, and handle verification (`AccountLink`).
- **Reviews**: `/admin/moderation` to approve or delete `ProductReview` and `ProviderReview` entries.

## Verification Plan

### Automated Tests
- Build verification: Run `npm run build` in `apps/web` to ensure no TypeScript or Next.js routing errors occur.

### Manual Verification
1. Log in with an Admin account.
2. Navigate to `/admin/taxonomy`.
3. Create a new Product Type ("New Feature Loan") and a new Tag.
4. Navigate to `/admin/providers`, create a test provider.
5. Navigate to `/admin/products`, create a product linking the new Provider, Product Type, and Tag.
6. Verify all data saves to the PostgreSQL database via Prisma Studio.
