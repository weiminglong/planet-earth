# Living Flora Globe Implementation Status and Roadmap

This document replaces the original greenfield plan with a status-aware implementation guide. It describes what is already built in the repository today and what remains as future scope.

## 1. Product summary

**Project name:** Living Flora Globe

**Goal:** present a curated botanical atlas where users can rotate a luminous Earth, discover flora through real regions, and continue into richer editorial detail pages.

## 2. What is implemented now

### 2.1 User-facing experience

- A cinematic homepage at `/` with a React Three Fiber globe
- Animated flora markers positioned from seeded region latitude and longitude
- A fallback card-based experience when WebGL is unavailable
- Search and filtering on the homepage by:
  - free-text query
  - continent
  - region
  - biome
  - flora type
  - bloom season
  - origin
  - conservation status
- A flora browsing page at `/flora`
- A region browsing page at `/regions`
- Flora detail pages at `/flora/[slug]`
- Region detail pages at `/regions/[slug]`

### 2.2 Data and APIs

- PostgreSQL + Prisma schema for flora, regions, biomes, facts, cultural notes, media assets, and tags
- Seed script with a starter collection of 19 flora records across 10 explorable regions, 5 continents, and 9 biomes
- Read-only API routes:
  - `GET /api/flora`
  - `GET /api/regions`

### 2.3 Technical implementation

- Next.js 16 App Router
- Dynamic client-only globe loading on the homepage
- Zustand state for selected and hovered flora markers
- Prisma 7 configured with the PostgreSQL driver adapter
- Tailwind CSS v4 for styling and layout
- Framer Motion for list and drawer animation

## 3. Current information architecture

```txt
/                  homepage with globe, filters, live flora list, and region links
/flora             searchable flora index
/flora/[slug]      flora detail page
/regions           searchable region index
/regions/[slug]    region detail page
/api/flora         flora JSON endpoint
/api/regions       region JSON endpoint
```

The following routes from the earlier concept are not implemented in this repository yet:

- `/biomes/[slug]`
- `/explore`
- `/about`

## 4. Current data model

### 4.1 Primary entities

- `Flora`
- `Region`
- `Biome`

### 4.2 Relationship tables

- `FloraRegionOccurrence`
- `FloraBiome`

### 4.3 Narrative support tables

- `FloraFact`
- `FloraCulturalNote`
- `MediaAsset`
- `Tag`

The current UI actively uses flora, regions, biomes, facts, and cultural notes. `MediaAsset` and `Tag` are present in the schema for future content expansion but are not yet surfaced in the frontend.

## 5. Delivery status by area

### 5.1 Completed

- Globe-based homepage exploration
- Marker selection and detail drawer
- Flora and region listing routes
- Flora and region detail routes
- Seeded editorial dataset
- API-level filtering for flora and regions
- No-WebGL fallback path

### 5.2 Partially implemented

- Accessibility: standard page content is accessible, but the 3D scene still needs a more deliberate keyboard and screen-reader story
- Content richness: there is narrative text, taxonomy, habitat, and related flora, but no media gallery yet
- Geographic coverage: the dataset is editorial and intentionally small

### 5.3 Not implemented yet

- Biome landing pages
- Guided exploration flows
- About or methodology pages
- Asset storage integration for managed media
- CMS or admin workflows
- Authentication or authoring tools

## 6. Recommended next milestones

### Milestone 1: content and taxonomy hardening

- Expand seed data or move to managed content entry
- Start using `MediaAsset` records in the UI
- Add image credits, licenses, and alt text to detail pages
- Normalize conservation and seasonality vocabularies

### Milestone 2: route expansion

- Add biome detail pages sourced from existing schema data
- Add an about or methodology page explaining curation and data sources
- Add guided thematic exploration beyond the raw flora and region indexes

### Milestone 3: experience quality

- Improve keyboard interaction and accessible equivalents for globe actions
- Add loading, error, and empty states tuned for production use
- Introduce analytics or interaction telemetry if product learning matters

### Milestone 4: operational maturity

- Add deployment notes for production PostgreSQL and environment management
- Add automated tests for filter behavior, route handlers, and critical page rendering
- Decide whether seeded content remains local-only or moves behind a content workflow

## 7. Engineering notes

- Prisma client output is generated into `src/generated/prisma/` and must be regenerated after clone
- The app expects `DATABASE_URL` at runtime
- The homepage scene is intentionally client-rendered and dynamically imported
- Region detail pages exclude parent continents; only explorable subregions are surfaced in the browse UI

## 8. Source of truth

When this document conflicts with the codebase, prefer the code. The main source files for current behavior are:

- [`src/app`](/Users/weiminglong/Documents/GitHub/planet-earth/src/app)
- [`src/components/home/homepage-shell.tsx`](/Users/weiminglong/Documents/GitHub/planet-earth/src/components/home/homepage-shell.tsx)
- [`src/components/globe/interactive-globe.tsx`](/Users/weiminglong/Documents/GitHub/planet-earth/src/components/globe/interactive-globe.tsx)
- [`src/lib/flora-data.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/lib/flora-data.ts)
- [`src/lib/region-data.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/src/lib/region-data.ts)
- [`prisma/schema.prisma`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/schema.prisma)
- [`prisma/seed.ts`](/Users/weiminglong/Documents/GitHub/planet-earth/prisma/seed.ts)
