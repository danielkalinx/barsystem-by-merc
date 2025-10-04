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

1. **Members** - Fraternity members with profile, rank (Bursche/Fuchs), rank colors, tab balance, payment history
2. **Drinks** - Drink catalog with name, price, category, availability status
3. **Sessions** - Bar sessions with bartenders, orders, revenue, statistics
4. **Orders** - Individual drink orders with session/member/bartender refs, items array, historical pricing
5. **Payments** - Payment/penalty history log with member ref, amount, type, admin notes

### Key Business Rules

**Session Management:**
- **Only ONE active session globally** (device-independent) - enforce at database level
- Bartenders must be selected BEFORE session activation (minimum 1)
- Orders can ONLY be placed during an active session
- Sessions are shared across ALL devices - new logins join existing active session
- Multi-device sync via **short polling (5-10s) or manual refresh** (no WebSockets for MVP)

**Member Ranks & Colors:**
- **Bursche**: `#A57D42, #E10909, #FFFFFF` (brown/gold, red, white)
- **Fuchs**: `#E10909, #FFFFFF, #E10909` (red, white, red)
- Colors displayed as visual flag/badge

**Authentication & Roles:**
- All pages require login (no public access)
- **Admin**: Full Payload access, manage members/sessions/payments
- **Bartender**: Session-based role, can place orders from any device during their session, can request to be added mid-session
- **Member**: View-only (own tab, price list, session info)

**Data Integrity:**
- Always maintain history/logs - NEVER delete orders, payments, or sessions
- Store drink price at time of order (historical pricing)
- Track who made changes (audit trail with admin references)

### PayloadCMS Configuration

**Main config**: `src/payload.config.ts`

Key settings:
- **Database**: MongoDB via `mongooseAdapter` (connection string from `DATABASE_URI` env var)
- **Editor**: Lexical rich text editor
- **Admin user collection**: Uses `Users` collection for authentication
- **Collections**: Import from `src/collections/` and add to `collections` array
- **Types**: Auto-generated at `src/payload-types.ts` (run `pnpm generate:types`)

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
1. Navigate to Price List (`/prices`)
2. Add drinks to cart
3. Select member to charge
4. Confirm → Creates order, updates member tab balance

### Payment Management (Admin)
- Record full/partial payments after semester
- Add penalties for unpaid/late tabs
- System maintains complete payment history log

## Frontend Implementation

**UI Framework**: ShadCN/UI components with Tailwind CSS

**Main Pages:**
- **`/prices`**: Price list with cart/ordering (bartenders only during active session, view-only otherwise)
- **`/session`**: Current session info + historical sessions archive
- **`/members`**: Member list with profiles, tab balances, payment management

**Data Sync**: Use short polling (5-10s intervals) or manual refresh buttons for cross-device updates (no WebSockets for MVP)

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
