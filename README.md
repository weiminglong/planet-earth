# Living Flora Globe

Living Flora Globe is a Next.js 16 application for exploring a curated flora collection through a cinematic 3D Earth. The current build combines a React Three Fiber globe on the homepage with searchable flora and region indexes, detail pages, and Prisma-backed read APIs.

## Current product surface

- Immersive homepage with a WebGL globe, animated markers, and a non-WebGL fallback
- Client-side filtering by search query, continent, region, biome, flora type, bloom season, origin, and conservation status
- Flora index at `/flora`
- Flora detail pages at `/flora/[slug]`
- Region index at `/regions`
- Region detail pages at `/regions/[slug]`
- JSON APIs at `/api/flora` and `/api/regions`

## Seeded dataset

The repo currently ships with a curated starter atlas:

- 19 flora entries
- 10 explorable regions
- 5 parent continents
- 9 biomes

The seed data lives in [`prisma/seed.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/seed.ts).

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- React Three Fiber, Drei, and Three.js
- Framer Motion
- Zustand
- PostgreSQL 16
- Prisma 7 with `@prisma/adapter-pg`

## Project structure

- [`src/app`](/Users/weiminglong/Documents/GitHub/planet-earth/src/app): App Router pages and API routes
- [`src/components`](/Users/weiminglong/Documents/GitHub/planet-earth/src/components): homepage, globe, flora, region, and site UI
- [`src/lib`](/Users/weiminglong/Documents/GitHub/planet-earth/src/lib): Prisma access, data mapping, filtering, theming, and globe helpers
- [`src/store`](/Users/weiminglong/Documents/GitHub/planet-earth/src/store): Zustand exploration state
- [`prisma/schema.prisma`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/schema.prisma): database schema
- [`prisma/seed.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/seed.ts): seed data loader

## Environment variables

The app expects these variables:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/living_flora_globe"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

`DATABASE_URL` is required at runtime because Prisma is instantiated with the PostgreSQL adapter in [`src/lib/prisma.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/lib/prisma.ts).

## Runtime baseline

- Node.js 24 LTS
- npm

The repo now pins Node via [`.nvmrc`](/Users/weiminglong/Documents/GitHub/planet-earth/.nvmrc) and `package.json` engines.
Node 25 is also accepted by the engine range, but Node 24 remains the default target for local development and CI stability.

## Local development

1. Install dependencies:

```bash
nvm use
npm install
```

2. Make sure PostgreSQL is running on port `5432`.

3. Create the database if it does not exist yet:

```bash
createdb living_flora_globe
```

4. Generate the Prisma client:

```bash
npx prisma generate
```

5. Apply migrations:

```bash
npx prisma migrate dev
```

6. Seed the starter atlas:

```bash
npm run db:seed
```

7. Start the app:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

If you want to run the smoke suite locally, install Chromium once:

```bash
npx playwright install chromium
```

## Available scripts

- `npm run dev`: start the Next.js development server
- `npm run build`: create a production build
- `npm start`: run the production server
- `npm run lint`: run ESLint
- `npm run typecheck`: run the TypeScript compiler in no-emit mode
- `npm run format`: format the repo with Prettier
- `npm run format:check`: verify formatting
- `npm run test`: run unit tests with Vitest
- `npm run test:smoke`: run the Playwright smoke suite
- `npm run test:ci`: run both unit and smoke tests
- `npm run db:seed`: seed the curated flora dataset

## Data model

The current schema centers on a small editorial atlas:

- `Region`: geographic nodes with parent-child hierarchy
- `Flora`: core plant records and taxonomy metadata
- `Biome`: habitat classification with visual themes
- `FloraRegionOccurrence`: flora-to-region links plus native/endemic flags
- `FloraBiome`: flora-to-biome links
- `FloraFact` and `FloraCulturalNote`: narrative content blocks
- `MediaAsset` and `Tag`: reserved for richer content expansion

See [`prisma/schema.prisma`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/schema.prisma) for the full schema.

## API routes

### `GET /api/flora`

Returns the flora collection after optional filtering. Supported query parameters:

- `q`
- `biome`
- `region`
- `continent`
- `status`
- `season`
- `origin`

The homepage applies an additional client-side `floraType` filter that is not currently exposed by this route.

Implementation: [`src/app/api/flora/route.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/app/api/flora/route.ts)

### `GET /api/regions`

Returns non-continent regions after optional filtering. Supported query parameters:

- `q`
- `continent`
- `biome`

Implementation: [`src/app/api/regions/route.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/app/api/regions/route.ts)

## Notes and gotchas

- `src/generated/prisma/` is gitignored. Regenerate it with `npx prisma generate` after cloning.
- Prisma 7 requires the PostgreSQL driver adapter when creating `PrismaClient`. This repo already wires that up in [`src/lib/prisma.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/lib/prisma.ts).
- [`prisma/seed.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/seed.ts) now loads `.env` explicitly so its database connection matches the rest of the repo tooling.
- The homepage globe is client-only and dynamically imported; server-rendered pages still work without WebGL.
- CI is defined in [`.github/workflows/ci.yml`](/Users/weiminglong/Documents/GitHub/planet-earth/.github/workflows/ci.yml) and runs formatting, lint, typecheck, unit tests, build, and Playwright smoke tests.

## Related docs

- Agent-oriented project guidance: [`AGENTS.md`](/Users/weiminglong/Documents/GitHub/planet-earth/AGENTS.md)
- Product status and roadmap: [`living-flora-globe-implementation-plan.md`](/Users/weiminglong/Documents/GitHub/planet-earth/living-flora-globe-implementation-plan.md)
