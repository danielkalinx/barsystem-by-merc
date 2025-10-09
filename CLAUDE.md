# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Bar Management System for K.Ö.H.V. Mercuria** - A Vienna-based student fraternity drink tab management system built with PayloadCMS 3.0, Next.js 15, and MongoDB. The system manages bar sessions, member drink orders, tab tracking, and semester-based payment collection.

**See PRD.md for complete feature specifications and business logic.**

## Development Commands

### Core Development
- **Start dev server**: `pnpm dev`
- **Start dev (clean)**: `pnpm devsafe` - Removes `.next` cache before starting
- **Build for production**: `pnpm build`
- **Start production server**: `pnpm start`
- **Lint code**: `pnpm lint`

### Testing
- **Run all tests**: `pnpm test` (runs integration and E2E tests)
- **Run integration tests**: `pnpm run test:int` (Vitest tests in `tests/int/`)
- **Run E2E tests**: `pnpm run test:e2e` (Playwright tests in `tests/e2e/`)

### Payload-Specific
- **Generate TypeScript types**: `pnpm generate:types` - Creates `src/payload-types.ts`
- **Generate import map**: `pnpm generate:importmap`
- **Payload CLI**: `pnpm payload [command]`

## Architecture

### Next.js App Directory Structure

The app uses Next.js App Router with **route groups** to separate concerns:

- **`src/app/(frontend)/`** - ShadCN/UI-based frontend application
  - Main pages: `/prices`, `/session`, `/members`
  - Requires authentication for all routes
  - Uses ShadCN components and Tailwind CSS

- **`src/app/(payload)/`** - PayloadCMS admin and API routes
  - `admin/[[...segments]]/` - Catch-all admin panel routes
  - `api/[...slug]/` - Catch-all Payload REST API routes
  - `api/graphql/` - GraphQL API endpoint
  - `layout.tsx` - Admin layout wrapper

### Core Collections (PayloadCMS)

**Must be created in `src/collections/` and registered in `src/payload.config.ts`:**

1. **Members** - Authentication collection AND member data. Includes email/password, role (Admin/Member), rank reference, tab balance, payment history
2. **Ranks** - Rank definitions with label, slug, and three color values (flag). Separate collection for reusable rank data
3. **Products** - Product catalog (drinks, toast, zigarren, snus, etc.) with name, price, category, availability status
4. **Sessions** - Bar sessions with bartenders, orders, revenue, statistics
5. **Orders** - Individual product orders with session/member/bartender refs, items array, historical pricing
6. **Payments** - Payment/penalty history log with member ref, amount, type, admin notes

### Key Business Rules

**Session Management:**
- **Only ONE active session globally** (device-independent) - enforce at database level
- Bartenders must be selected BEFORE session activation (minimum 1)
- Orders can ONLY be placed during an active session
- Sessions are shared across ALL devices - new logins join existing active session
- Multi-device sync via **short polling (5-10s) or manual refresh** (no WebSockets for MVP)

**Member Ranks (stored in Ranks collection):**
- **Fuchs** (New member/pledge): `#E10909, #FFFFFF, #E10909` (red, white, red)
- **Bursche** (Full member): `#A57D42, #E10909, #FFFFFF` (brown/gold, red, white)
- **Aktive** (Active member): Colors to be defined in Ranks collection
- **Verkehrsaktive** (Semi-active member): Colors to be defined in Ranks collection
- **Alte Herren** (Alumni/old boys): Colors to be defined in Ranks collection
- **Externe** (External member/guest): Colors to be defined in Ranks collection
- Members reference a Rank, which contains the three color values forming a visual flag/badge

**Authentication & Roles:**
- All pages require login (no public access)
- **Members collection is the auth collection** - all members can log in with email/password
- **Admin role** (Members.role = 'admin'): Full Payload access, manage members/sessions/payments
- **Member role** (Members.role = 'member', default): View-only (own tab, price list, session info)
- **Bartender role** (temporary, via Sessions.bartenders): Can place orders from any device during their session, can request to be added mid-session

**Data Integrity:**
- Always maintain history/logs - NEVER delete orders, payments, or sessions
- Store drink price at time of order (historical pricing)
- Track who made changes (audit trail with admin references)

### PayloadCMS Configuration

**Main config**: `src/payload.config.ts`

Key settings:
- **Database**: MongoDB via `mongooseAdapter` (connection string from `DATABASE_URI` env var)
- **Editor**: Lexical rich text editor
- **Admin user collection**: Uses `Members` collection for authentication (set via `admin.user` config)
- **Collections**: Import from `src/collections/` and add to `collections` array
- **Types**: Auto-generated at `src/payload-types.ts` (run `pnpm generate:types`)
- **Localization**: German-only (`de`) - Admin UI displays in German
  - All collection and field labels are in German
  - Slugs and field names remain in English for code consistency
  - Collection labels: Mitglieder (Members - auth collection), Ränge (Ranks), Produkte (Products), Sitzungen (Sessions), Bestellungen (Orders), Zahlungen (Payments)
- **Storage**: Vercel Blob Storage for media uploads
  - Package: `@payloadcms/storage-vercel-blob`
  - Client uploads enabled to bypass Vercel's 4.5MB server upload limit
  - Configured for `media` collection

### Path Aliases

TypeScript path aliases (defined in `tsconfig.json`):
- `@/*` → `./src/*` - General source imports
- `@payload-config` → `./src/payload.config.ts` - Payload config import

### Testing Setup

**Integration Tests** (Vitest):
- Located in `tests/int/`
- Config: `vitest.config.mts`
- Uses jsdom environment, React Testing Library
- Pattern: `*.int.spec.ts`

**E2E Tests** (Playwright):
- Located in `tests/e2e/`
- Config: `playwright.config.ts`
- Runs on Chromium, auto-starts dev server at `http://localhost:3000`

### Environment Setup

Required environment variables:
- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Secret key for Payload
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token (automatically set by Vercel when Blob storage is added)

Copy `.env.example` to `.env` and configure values.

## Key Workflows (See PRD.md for Details)

### Opening a Session (Admin)
1. Check no session is active
2. Select bartenders from Members (min 1, BEFORE activation)
3. Set estimated work times
4. Activate → Available on ALL devices

### Multi-Device Session Joining
- New device logs in → Joins existing active session automatically
- Bartenders: Get ordering capabilities
- Non-bartenders: View-only + option to request bartender access
- Admin approves/denies requests in real-time

### Placing Orders (Bartender)
1. Navigate to Product Catalog (`/prices`)
2. Add products to cart
3. Select member to charge
4. Confirm → Creates order, updates member tab balance

### Payment Management (Admin)
- Record full/partial payments after semester
- Add penalties for unpaid/late tabs
- System maintains complete payment history log

## Frontend Implementation

**UI Framework**: ShadCN/UI components with Tailwind CSS

**Main Pages:**
- **`/prices`**: Product catalog (drinks, toast, zigarren, snus, etc.) with cart/ordering (bartenders only during active session, view-only otherwise)
- **`/session`**: Current session info + historical sessions archive
- **`/members`**: Member list with profiles, tab balances, payment management

**Data Sync**: Use short polling (5-10s intervals) or manual refresh buttons for cross-device updates (no WebSockets for MVP)

**Language**: All client-facing UI text must be in German. Text can be fun and playful. This includes buttons, labels, headings, placeholders, error messages, and any user-visible text in the frontend application (`src/app/(frontend)/`).

## Working with Collections

1. Create new collection in `src/collections/YourCollection.ts`
2. Export a `CollectionConfig` object
3. Import and add to `collections` array in `src/payload.config.ts`
4. Run `pnpm generate:types` to update TypeScript types
5. Restart dev server to see changes in admin panel

## Technical Requirements

- **Node version**: 18.20.2+ or 20.9.0+
- **Package manager**: pnpm 9 or 10 (required)
- **TypeScript**: Strict mode enabled
- **Module system**: ES modules
- **Build optimization**: Uses `--max-old-space-size=8000` for large builds
- Keep the design very minimal, almost no styling, And use ShaDcn components wherever possible.
- **IMPORTANT: Always use standard Tailwind classes instead of arbitrary values** (e.g., use `text-3xl` instead of `text-[30px]`, `max-w-sm` instead of `max-w-[360px]`). Only use arbitrary values when absolutely necessary for exact design requirements.
- Memorize to always use the Tailwind CSS variables from styles.css if possible. Check every time when creating Tailwind classes.
- **IMPORTANT: Do NOT override ShadCN component default styles with className props** (e.g., avoid `className="h-9 rounded-md"` on Input/Button components). Only add non-conflicting classes like layout/spacing utilities. Let the base component styles (defined in `src/components/ui/`) apply by default for consistency.
- dont start dev server unless asked
- there no tailwind config file because this project uses tailwind v4