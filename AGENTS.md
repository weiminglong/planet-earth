# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Living Flora Globe is a Next.js (App Router) application featuring a 3D interactive Earth globe for exploring global flora. The full implementation plan is in `living-flora-globe-implementation-plan.md`.

### Tech stack

- **Framework:** Next.js 16 (App Router, TypeScript, Tailwind CSS v4)
- **3D:** React Three Fiber + @react-three/drei + Three.js
- **Animation:** Framer Motion
- **State:** Zustand
- **Database:** PostgreSQL 16 + Prisma 7 ORM
- **Package manager:** npm

### Services

| Service | How to start | Default port |
|---|---|---|
| Next.js dev server | `npm run dev` | 3000 |
| PostgreSQL | `sudo pg_ctlcluster 16 main start` | 5432 |

### Key commands

See `package.json` scripts for standard commands:
- `npm run dev` — start dev server
- `npm run build` — production build
- `npm run lint` — ESLint
- `npm start` — production server

### Database

- PostgreSQL must be running before the dev server can use Prisma queries.
- DB name: `living_flora_globe`, user: `ubuntu`, password: `password`.
- Connection string is in `.env` (`DATABASE_URL`).
- After schema changes: `npx prisma migrate dev` then `npx prisma generate`.
- Prisma 7 uses driver adapters — see `src/lib/prisma.ts` for the `PrismaPg` adapter pattern.
- Generated Prisma client lives in `src/generated/prisma/` (gitignored; regenerated via `npx prisma generate`).

### Gotchas

- Prisma 7.x requires an explicit driver adapter argument when constructing `PrismaClient`. Import from `@/generated/prisma/client` (not `@/generated/prisma`).
- The `src/generated/prisma/` directory is gitignored and must be regenerated after cloning (`npx prisma generate`).
- Three.js related packages may produce npm audit warnings (moderate/high); these are upstream and do not affect the application.
