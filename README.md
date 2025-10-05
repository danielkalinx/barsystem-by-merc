# Bar Management System - K.Ö.H.V. Mercuria

A web application for managing drink tabs at K.Ö.H.V. Mercuria, a Vienna-based student fraternity. The system tracks member orders during bar sessions, manages tabs, and facilitates semester-based payment collection.

## Tech Stack

- **Frontend**: Next.js 15 (App Router) + ShadCN/UI + Tailwind CSS
- **Backend/CMS**: PayloadCMS 3.0
- **Database**: MongoDB
- **Storage**: Vercel Blob Storage
- **Package Manager**: pnpm 9/10 (required)

## Features

### Core Functionality
- **Session Management**: Open/close bar sessions with assigned bartenders
- **Product Catalog**: Manage drinks, toast, zigarren, snus, and other products
- **Order Tracking**: Place orders during active sessions, track member tabs
- **Payment Management**: Record payments, add penalties, maintain full payment history
- **Multi-Device Support**: Shared sessions across all devices with polling-based sync
- **Role-Based Access**: Admin, Member, and temporary Bartender roles

### Key Pages
- **`/prices`**: Product catalog with cart/ordering (bartenders only during active sessions)
- **`/session`**: Current session info + historical sessions archive
- **`/members`**: Member list with profiles, tab balances, payment management

## Prerequisites

- Node.js 18.20.2+ or 20.9.0+
- pnpm 9 or 10
- MongoDB instance (local or cloud)
- Vercel Blob Storage token (for media uploads)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd barsystem-by-merc
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Configure the following in `.env`:
   ```env
   DATABASE_URI=mongodb://localhost:27017/bar-system
   PAYLOAD_SECRET=your-secret-key-here
   BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
   ```

4. **Generate TypeScript types**
   ```bash
   pnpm generate:types
   ```

5. **Start development server**
   ```bash
   pnpm dev
   ```

6. **Open the app**
   - Frontend: `http://localhost:3000`
   - Admin panel: `http://localhost:3000/admin`

## Development Commands

### Core Development
- `pnpm dev` - Start dev server
- `pnpm devsafe` - Start dev server (clean, removes `.next` cache)
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Lint code

### Testing
- `pnpm test` - Run all tests (integration + E2E)
- `pnpm run test:int` - Run integration tests (Vitest)
- `pnpm run test:e2e` - Run E2E tests (Playwright)

### Payload-Specific
- `pnpm generate:types` - Generate TypeScript types (`src/payload-types.ts`)
- `pnpm generate:importmap` - Generate import map
- `pnpm payload [command]` - Payload CLI commands

## Project Structure

```
src/
├── app/
│   ├── (frontend)/        # ShadCN/UI frontend application
│   │   ├── prices/        # Product catalog page
│   │   ├── session/       # Session management page
│   │   ├── members/       # Members list and detail pages
│   │   └── layout.tsx     # Frontend layout
│   └── (payload)/         # PayloadCMS admin and API
│       ├── admin/         # Admin panel routes
│       ├── api/           # REST API routes
│       └── layout.tsx     # Admin layout
├── collections/           # PayloadCMS collections
│   ├── Members.ts         # Auth + member data
│   ├── Ranks.ts           # Member ranks (Fuchs, Bursche, etc.)
│   ├── Products.ts        # Product catalog
│   ├── Sessions.ts        # Bar sessions
│   ├── Orders.ts          # Order records
│   └── Payments.ts        # Payment history
├── components/            # Shared React components
│   └── ui/               # ShadCN components
└── payload.config.ts      # Payload configuration
```

## Collections Overview

### Members (Authentication Collection)
- Email/password authentication
- Role: Admin or Member
- Rank reference (Fuchs, Bursche, Aktive, etc.)
- Tab balance and payment history

### Ranks
- Label, slug, and three color values (flag visualization)
- Pre-defined: Fuchs (#E10909, #FFFFFF, #E10909), Bursche (#A57D42, #E10909, #FFFFFF)

### Products
- Name, price, category, availability status
- Categories: Getränke, Toast, Zigarren, Snus

### Sessions
- Status: Active or Closed (only ONE active globally)
- Bartenders array (selected before activation)
- Orders, revenue, statistics

### Orders
- Session, member, bartender references
- Items array with historical pricing
- Status: Pending, Completed, Cancelled

### Payments
- Member reference
- Amount (positive for payment, negative for penalty)
- Type: Payment, Penalty, Adjustment

## Key Business Rules

### Session Constraints
- **Only ONE active session globally** (device-independent)
- Bartenders must be selected BEFORE session activation
- Orders can ONLY be placed during active sessions
- Sessions shared across ALL devices
- Multi-device sync via short polling (5-10s) or manual refresh

### Authentication & Roles
- All pages require login (no public access)
- **Admin**: Full Payload access, manage members/sessions/payments
- **Member**: View-only (own tab, price list, session info)
- **Bartender**: Temporary role via Sessions.bartenders, can place orders from any device

### Data Integrity
- Never delete orders, payments, or sessions (maintain history)
- Store product price at time of order (historical pricing)
- Track who made changes (audit trail)

## Key Workflows

### Opening a Session (Admin)
1. Check no session is currently active
2. Create new session
3. Select bartenders from members list (min 1, before activation)
4. Set estimated work times for each bartender
5. Activate session → Available on ALL devices

### Placing an Order (Bartender)
1. Navigate to Product Catalog (`/prices`)
2. Add products to cart
3. Select member to charge
4. Review total and confirm
5. Order created → Member tab updated

### Managing Payments (Admin)
1. Review member tab balances (typically after semester)
2. Record payments (full or partial)
3. Add penalties for unpaid/late tabs
4. System maintains complete payment history

## Testing

### Integration Tests (Vitest)
- Location: `tests/int/`
- Config: `vitest.config.mts`
- Pattern: `*.int.spec.ts`
- Uses React Testing Library + jsdom

### E2E Tests (Playwright)
- Location: `tests/e2e/`
- Config: `playwright.config.ts`
- Runs on Chromium, auto-starts dev server

## Deployment

### Environment Variables
Ensure all required variables are set in production:
- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Secret key for Payload
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

### Build Steps
1. `pnpm install --frozen-lockfile`
2. `pnpm generate:types`
3. `pnpm build`
4. `pnpm start`

## Documentation

- **PRD**: See `PRD.md` for complete feature specifications
- **Development Guide**: See `CLAUDE.md` for developer instructions
- **PayloadCMS Docs**: https://payloadcms.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## Support

For issues or questions:
- Create an issue in the repository
- Contact the development team
- See PayloadCMS Discord for framework-specific help

## License

[Add your license here]
