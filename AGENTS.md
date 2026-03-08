# AGENTS.md

## Project overview

Living Flora Globe is a Next.js 16 App Router project for exploring a curated global flora collection through a 3D interactive Earth. The current build includes the homepage globe, flora and region indexes, flora and region detail pages, and read-only JSON APIs backed by PostgreSQL and Prisma.

The broader product roadmap lives in [`living-flora-globe-implementation-plan.md`](/Users/weiminglong/Documents/GitHub/planet-earth/living-flora-globe-implementation-plan.md).

## Tech stack

- Framework: Next.js 16, React 19, TypeScript
- Styling: Tailwind CSS v4
- 3D: React Three Fiber, Drei, Three.js
- Motion: Framer Motion
- State: Zustand
- Testing: Vitest and Playwright
- Database: PostgreSQL 16
- ORM: Prisma 7 with `@prisma/adapter-pg`
- Package manager: npm

## Current routes

- `/`: immersive globe homepage
- `/flora`: flora index
- `/flora/[slug]`: flora detail page
- `/regions`: region index
- `/regions/[slug]`: region detail page
- `/api/flora`: filtered flora JSON endpoint
- `/api/regions`: filtered region JSON endpoint

Routes that appear in the long-term roadmap but do not exist yet should be treated as future scope, not current behavior.

## Core commands

- `npm install`
- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run format`
- `npm run format:check`
- `npm run test`
- `npm run test:smoke`
- `npm run test:ci`
- `npm start`
- `npm run db:seed`
- `npx prisma generate`
- `npx prisma migrate dev`

## Environment and database

- Required env vars are defined in `.env`.
- The checked-in local development defaults are:
  - `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/living_flora_globe"`
  - `NEXT_PUBLIC_SITE_URL="http://localhost:3000"`
- The default Node runtime is 24.x; Node 25 is also allowed by `package.json` engines. See [`.nvmrc`](/Users/weiminglong/Documents/GitHub/planet-earth/.nvmrc).
- PostgreSQL must be running before Prisma-backed pages or API routes are loaded.
- If the database does not exist yet, create it before running migrations or seeds.

## Schema and generated client

- Schema: [`prisma/schema.prisma`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/schema.prisma)
- Seed data: [`prisma/seed.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/seed.ts)
- Prisma client output: `src/generated/prisma/`

Important:

- `src/generated/prisma/` is gitignored and must be regenerated after cloning.
- Import Prisma types and client code from `@/generated/prisma/client`.
- Prisma 7 in this repo requires an explicit `PrismaPg` adapter when constructing `PrismaClient`; see [`src/lib/prisma.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/lib/prisma.ts).
- [`prisma/seed.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/seed.ts) loads `.env` explicitly and should use the same `DATABASE_URL` as the app.

## Current content footprint

The starter atlas seeded by the repo currently contains:

- 19 flora entries
- 10 explorable regions
- 5 continents
- 9 biomes

Use those counts when describing the present state of the project unless the seed data changes.

## Working guidance

- Prefer updating docs and code to match the implemented app, not the aspirational roadmap.
- When documenting filters or APIs, use the actual parameters supported in [`src/lib/flora-filters.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/lib/flora-filters.ts), [`src/app/api/flora/route.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/app/api/flora/route.ts), and [`src/app/api/regions/route.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/app/api/regions/route.ts).
- Unit tests live under [`tests/unit`](/Users/weiminglong/Documents/GitHub/planet-earth/tests/unit) and smoke tests live under [`tests/smoke`](/Users/weiminglong/Documents/GitHub/planet-earth/tests/smoke).
- CI lives at [`.github/workflows/ci.yml`](/Users/weiminglong/Documents/GitHub/planet-earth/.github/workflows/ci.yml).
- The homepage globe is client-rendered and has a no-WebGL fallback. Do not document WebGL as a hard requirement for basic browsing.
- The app currently uses seeded editorial data. Media storage and richer CMS-style content are future work.
