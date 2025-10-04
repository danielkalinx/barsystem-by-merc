# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **PayloadCMS 3.0** project built with **Next.js 15** and **React 19**, using MongoDB for the database. It serves as a bar management system template with both a CMS admin panel and a frontend application.

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

- **`src/app/(frontend)/`** - Public-facing frontend routes
  - `page.tsx` - Homepage
  - `layout.tsx` - Frontend layout wrapper
  - `styles.css` - Frontend styles

- **`src/app/(payload)/`** - PayloadCMS admin and API routes
  - `admin/[[...segments]]/` - Catch-all admin panel routes
  - `api/[...slug]/` - Catch-all Payload REST API routes
  - `api/graphql/` - GraphQL API endpoint
  - `api/graphql-playground/` - GraphQL playground (dev)
  - `layout.tsx` - Admin layout wrapper
  - `custom.scss` - Admin panel custom styles

- **`src/app/my-route/`** - Example custom API route

### PayloadCMS Configuration

**Main config**: `src/payload.config.ts`

Key settings:
- **Database**: MongoDB via `mongooseAdapter` (connection string from `DATABASE_URI` env var)
- **Editor**: Lexical rich text editor
- **Admin user collection**: Uses `Users` collection for authentication
- **Collections**: Defined in `src/collections/`
  - `Users.ts` - Auth-enabled admin users
  - `Media.ts` - File uploads with alt text field
- **Types**: Auto-generated at `src/payload-types.ts` (run `pnpm generate:types`)
- **Sharp**: Image processing configured globally
- **Import map**: Generated at `src/app/(payload)/admin/importMap.js`

### Path Aliases

TypeScript path aliases (defined in `tsconfig.json`):
- `@/*` → `./src/*` - General source imports
- `@payload-config` → `./src/payload.config.ts` - Payload config import

### Testing Setup

**Integration Tests** (Vitest):
- Located in `tests/int/`
- Config: `vitest.config.mts`
- Uses jsdom environment
- Setup file: `vitest.setup.ts`
- Supports React Testing Library
- Pattern: `*.int.spec.ts`

**E2E Tests** (Playwright):
- Located in `tests/e2e/`
- Config: `playwright.config.ts`
- Runs on Chromium by default
- Auto-starts dev server at `http://localhost:3000`
- Generates HTML reports

### Environment Setup

Required environment variables:
- `DATABASE_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Secret key for Payload
- `MONGODB_URI` - (Legacy, same as DATABASE_URI)

Copy `.env.example` to `.env` and configure values.

### Docker Development (Optional)

To use Docker for MongoDB:
1. Set `MONGODB_URI=mongodb://127.0.0.1/<dbname>` in `.env`
2. Update `<dbname>` in `docker-compose.yml` to match
3. Run `docker-compose up` (add `-d` for background)

## Key Technical Details

- **Node version**: 18.20.2+ or 20.9.0+
- **Package manager**: pnpm 9 or 10 (required)
- **TypeScript**: Strict mode enabled
- **Module system**: ES modules (`.mjs`, `.mts` file extensions supported)
- **Webpack config**: Custom extension alias in `next.config.mjs` for `.ts`/`.tsx` resolution
- **Build optimization**: Uses `--max-old-space-size=8000` for large builds

## Working with Collections

1. Create new collection in `src/collections/YourCollection.ts`
2. Export a `CollectionConfig` object
3. Import and add to `collections` array in `src/payload.config.ts`
4. Run `pnpm generate:types` to update TypeScript types
5. Restart dev server to see changes in admin panel

## Common Patterns

- **Adding API routes**: Create in `src/app/` (can use route groups)
- **Custom admin fields**: Define in collection `fields` array
- **Access control**: Configure in collection `access` property
- **File uploads**: Set `upload: true` in collection config
- **Rich text**: Lexical editor is default, configured globally
