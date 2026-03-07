# Living Flora Globe — Concrete Implementation Plan for Coding Agents

## 1. Product summary

**Project name:** Living Flora Globe

**Goal:** Build an interactive educational website whose homepage is a cinematic 3D Earth. Users can rotate the globe, discover flora associated with regions around the world, click into flora entries, and learn through beautiful, lively, and memorable interactions.

**Primary audience:**
- geography lovers
- nature lovers
- students and lifelong learners
- casual explorers who enjoy discovery-based interfaces

**Product promise:**  
A polished, immersive experience that makes global flora feel explorable, educational, and emotionally engaging.

---

## 2. Product vision

This should not feel like a dry database. It should feel like a cross between:
- an interactive atlas
- a digital museum exhibit
- a nature documentary interface
- a modern editorial website

Users should feel like they are **wandering the world through plants**.

### Core experience
- Open the site and immediately see a beautiful full-screen 3D globe
- Rotate, zoom, and hover over regions
- See flora hotspots or clustered indicators emerge naturally
- Click a flora marker or region
- Open a detail drawer or detail page
- Learn about the plant through a rewarding visual narrative

### Design principles
- cinematic, not cluttered
- educational, not textbook-like
- magical, but grounded
- modern, not gimmicky
- performant enough to feel effortless

---

## 3. Strategic product decisions

## 3.1 Chosen technical direction
Use **Option A: custom globe built with React Three Fiber**.

### Why
- maximum control over visuals and motion
- better long-term maintainability for a unique product
- easier to create a differentiated experience
- better support for custom shaders, transitions, camera choreography, and marker systems

### Consequence
The team should accept slightly higher implementation complexity early in exchange for a stronger long-term foundation.

## 3.2 Scope philosophy
Do **not** attempt to represent every plant species in the world in version 1.

Build a curated exploration product first:
- regions first
- featured flora first
- editorial quality over quantity
- high delight per interaction

### Recommended initial content scope
- 7 continents
- 20 to 40 featured subregions
- 100 to 300 flora entries eventually
- 20 to 30 flora entries for MVP
- 8 to 12 biomes

---

## 4. User experience definition

## 4.1 Homepage
The homepage is the main attraction.

### Must-have homepage qualities
- full-screen immersive canvas
- visible Earth immediately
- subtle motion even when idle
- strong sense of depth and atmosphere
- minimal but elegant UI chrome
- intuitive zoom and rotation
- clear entry into exploration

### Homepage layers
- starfield background
- Earth base texture
- atmosphere glow
- cloud layer
- optional night lights
- flora hotspot markers
- regional hover labels
- ambient particles
- UI overlay for search and filters
- side panel for detail previews

## 4.2 Interaction model
### Globe interactions
- drag to rotate
- scroll or pinch to zoom
- hover to highlight region or hotspot
- click region to focus it
- click flora marker to open preview
- click CTA to open detail page

### UI interactions
- search for flora, region, biome
- filter by continent, biome, season, conservation status
- browse without using the globe via standard list pages
- keyboard navigable drawer and controls

## 4.3 Detail experience
When a user selects a flora entry, they should see:
- common name
- scientific name
- region and biome
- hero image or illustration
- concise overview
- distinct traits
- ecological role
- cultural context
- fun facts
- conservation status
- related flora nearby

---

## 5. Functional requirements

## 5.1 Core functional requirements
1. Render a 3D Earth on the homepage
2. Allow smooth camera orbit and zoom
3. Display region-based or flora-based markers
4. Allow clicking a marker or region
5. Open a contextual panel with preview information
6. Navigate to dedicated flora detail pages
7. Support search and filters
8. Provide region and flora index pages
9. Work on desktop and mobile
10. Deploy cleanly on Vercel

## 5.2 Non-functional requirements
1. Good perceived performance
2. Progressive loading
3. Accessibility outside the 3D scene
4. Graceful no-WebGL fallback
5. Strong visual polish
6. Production-ready code organization
7. Easy future content expansion

---

## 6. Technical architecture

## 6.1 Frontend stack
- Next.js with App Router
- TypeScript
- Tailwind CSS
- React Three Fiber
- @react-three/drei
- Framer Motion
- Zustand

## 6.2 Backend and data
- Next.js route handlers for read APIs
- PostgreSQL
- Prisma ORM

## 6.3 Asset storage
Use one of:
- Vercel Blob
- Cloudinary
- S3-compatible storage

## 6.4 Deployment target
- Vercel for hosting and deployment
- GitHub integration for preview deployments
- environment variables managed in Vercel project settings

---

## 7. Recommended system design

## 7.1 Rendering split
### Server-rendered
- flora detail pages
- region detail pages
- biome pages
- SEO metadata
- index pages
- static educational content

### Client-rendered
- globe scene
- camera interactions
- marker interactions
- animated particles
- contextual drawers

## 7.2 State model
Use local and shared client state for:
- selected region
- selected flora
- hovered marker
- camera focus target
- active filters
- drawer state
- search query

Use Zustand for lightweight shared interaction state.

## 7.3 Data-fetching strategy
- server components fetch standard content
- globe client scene fetches lightweight interaction payloads
- detail routes fetch full content for pages
- use caching for stable content
- lazy-load large scene modules

---

## 8. Information architecture

## 8.1 Routes
```txt
/                         -> immersive globe homepage
/flora                    -> searchable flora index
/flora/[slug]             -> flora detail page
/regions                  -> region index
/regions/[slug]           -> region detail page
/biomes/[slug]            -> biome storytelling page
/explore                  -> thematic guided discovery page
/about                    -> mission and methodology
```

## 8.2 Homepage layout
### Header
- logo / project name
- search trigger
- filters trigger
- optional about link

### Main canvas
- 3D globe centered or slightly offset
- large breathable composition
- responsive framing

### Side drawer
- opens on selection
- flora preview or region preview
- quick facts
- CTA to detail page

---

## 9. Data model

Use a curated editorial content model rather than a purely scientific raw dataset.

## 9.1 Region
```ts
type Region = {
  id: string
  name: string
  slug: string
  type: 'continent' | 'country' | 'ecoregion' | 'biome'
  parentRegionId?: string | null
  lat: number
  lng: number
  summary: string
  climateNotes?: string | null
  heroImage?: string | null
}
```

## 9.2 Flora
```ts
type Flora = {
  id: string
  commonName: string
  scientificName: string
  slug: string
  shortDescription: string
  longDescription: string
  family?: string | null
  genus?: string | null
  species?: string | null
  conservationStatus?: string | null
  bloomSeason?: string | null
  featured: boolean
}
```

## 9.3 Biome
```ts
type Biome = {
  id: string
  name: string
  slug: string
  description: string
  climateProfile?: string | null
  visualTheme?: string | null
}
```

## 9.4 FloraRegionOccurrence
```ts
type FloraRegionOccurrence = {
  floraId: string
  regionId: string
  abundanceScore?: number | null
  isNative: boolean
  isEndemic: boolean
  notes?: string | null
}
```

## 9.5 MediaAsset
```ts
type MediaAsset = {
  id: string
  type: 'image' | 'illustration' | 'audio' | 'model'
  url: string
  alt: string
  credit?: string | null
  license?: string | null
}
```

## 9.6 Suggested Prisma entities
- Region
- Flora
- Biome
- MediaAsset
- FloraRegionOccurrence
- FloraBiome
- FloraFact
- FloraCulturalNote
- Tag

---

## 10. Globe engineering plan

## 10.1 Scene composition
Build the globe as a layered scene.

### Base layers
- Earth mesh
- atmosphere shell
- cloud sphere
- optional city lights
- background stars

### Interaction layers
- flora hotspot markers
- region anchors
- hover highlights
- label system

### Atmospherics
- subtle particles
- soft bloom if performance permits
- restrained post-processing
- no excessive visual noise

## 10.2 Earth implementation details
### Geometry
- sphere geometry with adequate but not excessive resolution
- separate atmosphere geometry scaled slightly larger

### Texturing
Use optimized texture assets for:
- color map
- roughness map
- normal map
- cloud alpha map
- optional emissive lights map

### Animation
- slow auto-rotation on idle
- pause or dampen on interaction
- cloud motion slightly offset from Earth rotation

## 10.3 Marker system
Avoid rendering lots of HTML overlay elements.

### Recommended approach
- use Three.js objects inside the canvas
- use instanced meshes for repeated markers
- cluster at lower zoom levels
- de-cluster into specific flora markers at higher zoom

### Marker states
- idle
- hovered
- selected
- filtered out
- clustered

## 10.4 Camera behavior
### Default state
- gentle auto-rotation
- broad framing of the globe
- ambient idle motion

### User-driven state
- drag orbit
- constrained polar angles
- constrained zoom ranges
- smooth damping

### Programmatic focus
On region or flora selection:
- rotate globe toward target lat/lng
- zoom in smoothly
- offset target slightly to leave room for the detail drawer

## 10.5 Region interaction strategy
For MVP, prefer **regional anchors and simplified hover targets** over full polygon picking.

### Why
- simpler and faster
- fewer geometry and interaction issues
- easier to polish

### Later enhancement
- GeoJSON region outlines projected to sphere
- true polygon hover and selection
- biome overlays

---

## 11. UX and visual design plan

## 11.1 Design direction
The visual language should feel:
- lush
- premium
- airy
- cinematic
- natural
- editorial

## 11.2 Color direction
Use a restrained palette:
- deep space navy / black
- natural greens
- muted earth tones
- soft cyan atmospheric glows
- warm neutrals for content surfaces

Avoid overly saturated arcade-style colors.

## 11.3 Typography
Use a pairing like:
- elegant serif or display serif for headings
- modern sans-serif for interface and body text

The typography should support a museum-editorial tone.

## 11.4 Motion design
Motion should feel organic:
- ease in and out
- subtle float effects
- gentle fade and scale
- minimal springiness
- refined transitions between states

## 11.5 Sound
Optional for later phases:
- ambient audio toggle
- natural soundscapes by biome
- always off by default or opt-in

---

## 12. Content design rules

## 12.1 Content philosophy
Every flora page should reward curiosity.

It should answer:
- what is it
- where does it grow
- what makes it unique
- why should the user care
- what role does it play in ecology or culture

## 12.2 Flora detail page structure
1. Hero section
2. Quick facts
3. Overview
4. Native range
5. Biome and climate
6. Distinctive traits
7. Cultural significance
8. Fun facts
9. Conservation notes
10. Related flora

## 12.3 Writing tone
- educational
- concise but vivid
- accessible to broad audiences
- not childish
- not academic-journal dry

---

## 13. Search and discovery plan

## 13.1 Search
Users should be able to search:
- flora common name
- scientific name
- region name
- biome name

## 13.2 Filters
MVP filters:
- continent
- biome
- bloom season
- endemic / native
- conservation status

## 13.3 Discovery modules
Homepage and detail pages can include:
- nearby flora
- same biome
- rare species
- endemic highlights
- featured region of the day

---

## 14. Accessibility requirements

The 3D experience cannot be the only way to use the site.

## 14.1 Minimum accessibility requirements
- keyboard-accessible navigation
- accessible drawer controls
- focus management for overlays
- descriptive alt text
- visible focus states
- reduced motion support
- semantic page structure
- non-3D list and detail browsing

## 14.2 Fallback experience
Provide meaningful alternatives:
- flora index page
- region pages
- biome pages
- static hero image fallback if WebGL fails

---

## 15. Performance requirements

## 15.1 Performance principles
The globe is the most expensive part of the site. Everything else should be designed to protect performance.

## 15.2 Required optimizations
- lazy-load globe modules
- dynamic import heavy 3D scene
- compress textures
- use modern image formats
- minimize draw calls
- use instancing where possible
- reduce particles on mobile
- avoid large startup datasets
- paginate or progressively load content

## 15.3 Mobile strategy
- lower texture quality
- lower particle density
- reduce shader complexity
- disable expensive postprocessing on low-power devices
- simplify label rendering

---

## 16. Vercel deployment plan

## 16.1 Repository workflow
- source in GitHub
- connect repo to Vercel
- enable preview deployments for pull requests
- production branch deploys automatically

## 16.2 Environment variables
Expected variables:
```env
DATABASE_URL=
BLOB_READ_WRITE_TOKEN=
NEXT_PUBLIC_SITE_URL=
```

Optional:
```env
SENTRY_DSN=
NEXT_PUBLIC_ANALYTICS_ID=
CLOUDINARY_URL=
```

## 16.3 Build requirements
- no manual build steps outside documented scripts
- `npm run build` must pass
- seed scripts must be optional and documented
- preview deploys must work without local-only dependencies

---

## 17. Folder structure

```txt
src/
  app/
    page.tsx
    flora/
      page.tsx
      [slug]/
        page.tsx
    regions/
      page.tsx
      [slug]/
        page.tsx
    biomes/
      [slug]/
        page.tsx
    about/
      page.tsx
    api/
      flora/
        route.ts
        [slug]/
          route.ts
      regions/
        route.ts
        [slug]/
          route.ts
      biomes/
        route.ts
        [slug]/
          route.ts

  components/
    globe/
      GlobeScene.tsx
      Earth.tsx
      Atmosphere.tsx
      Clouds.tsx
      Stars.tsx
      FloraMarkers.tsx
      RegionAnchors.tsx
      GlobeCameraController.tsx
      GlobeLabels.tsx
    flora/
      FloraPreviewCard.tsx
      FloraDetailPanel.tsx
      FloraFacts.tsx
    regions/
      RegionPreviewPanel.tsx
    ui/
      Drawer.tsx
      Button.tsx
      Card.tsx
      Chip.tsx
      SearchBox.tsx
      FilterBar.tsx
      CommandPalette.tsx

  lib/
    prisma.ts
    db.ts
    geo.ts
    textures.ts
    queries/
      flora.ts
      regions.ts
      biomes.ts
    utils/

  store/
    globe-store.ts

  content/
    flora/
    regions/
    biomes/

  styles/
    globals.css

prisma/
  schema.prisma
  seed.ts

public/
  textures/
  images/
  illustrations/
```

---

## 18. Concrete implementation phases

## Phase 0 — Discovery and setup
### Objective
Establish technical and visual foundations.

### Tasks
- define project name and brand direction
- decide texture asset sources and licensing
- choose first 20 to 30 flora entries
- select first 20 to 40 regions
- write data entry templates
- initialize repository
- define coding standards

### Deliverables
- repo initialized
- visual direction board
- content shortlist
- development conventions document

---

## Phase 1 — App foundation
### Objective
Create the production-ready application skeleton.

### Tasks
- scaffold Next.js app with App Router and TypeScript
- set up Tailwind
- set up ESLint and Prettier
- configure path aliases
- add Framer Motion
- add Zustand
- add Prisma
- configure environment handling
- set up base layout and metadata

### Deliverables
- working app shell
- linting and formatting
- ready-to-build foundation
- Vercel-compatible config

---

## Phase 2 — Data layer and content scaffolding
### Objective
Create a durable content model and sample dataset.

### Tasks
- write Prisma schema
- create migrations
- build seed script
- seed regions, biomes, flora, and relationships
- define route handlers for basic read APIs
- build initial server-side query helpers

### Deliverables
- functioning database schema
- seedable database
- sample content for exploration

---

## Phase 3 — Globe engine MVP
### Objective
Get the 3D homepage working with compelling basics.

### Tasks
- create canvas wrapper
- build Earth mesh
- add atmosphere shell
- add cloud layer
- add starfield
- add orbit controls
- set default camera framing
- implement idle auto-rotation
- expose selection callbacks

### Deliverables
- visually appealing globe scene
- responsive camera interactions
- reusable globe components

---

## Phase 4 — Marker and selection system
### Objective
Enable exploration through interaction.

### Tasks
- define hotspot payload format
- render region anchors
- render flora hotspots
- implement raycasting and pointer interactions
- add hover state
- add selected state
- connect scene selection to shared store
- focus camera on selection

### Deliverables
- clickable markers
- region and flora selection
- smooth focus transitions

---

## Phase 5 — Overlay UI and homepage exploration
### Objective
Turn the globe into a coherent exploration experience.

### Tasks
- build header overlay
- build search trigger
- build filter bar
- build detail drawer
- show flora preview on marker click
- show region preview and flora list on region click
- add loading states
- add empty states for filtered results

### Deliverables
- usable and polished homepage
- selection-to-info flow
- clear exploration loop

---

## Phase 6 — Flora detail pages
### Objective
Create richly designed educational pages.

### Tasks
- build `/flora/[slug]`
- generate metadata for sharing and SEO
- add hero section
- add facts panel
- add related flora
- add links back to region or biome
- ensure responsive layout

### Deliverables
- shareable detail pages
- rich educational content presentation

---

## Phase 7 — Region and biome pages
### Objective
Expand exploration beyond the homepage.

### Tasks
- build region index
- build region detail page
- build biome storytelling pages
- connect region pages to associated flora
- provide text-first browsing path

### Deliverables
- fallback browse experience
- better discoverability
- stronger educational architecture

---

## Phase 8 — Performance and quality hardening
### Objective
Make the product feel production-ready.

### Tasks
- profile homepage performance
- reduce bundle size
- compress textures
- simplify shaders where needed
- add reduced motion mode
- test on mobile devices
- test no-WebGL fallback
- improve keyboard handling
- fix layout shifts

### Deliverables
- stable and performant MVP
- improved accessibility
- better device coverage

---

## Phase 9 — Deployment and documentation
### Objective
Ship cleanly to Vercel and support future contributors.

### Tasks
- configure Vercel project
- verify preview deployments
- verify environment variable setup
- document local setup
- document seeding
- document build and deploy steps
- write contribution guide

### Deliverables
- deployed application
- reproducible setup
- onboarding documentation

---

## 19. Agent-by-agent execution plan

## Agent 1 — Technical lead / scaffolding agent
### Responsibilities
- initialize project
- configure tooling
- define architecture boundaries
- enforce coding conventions

### Outputs
- app scaffold
- linting
- formatting
- project scripts
- architecture notes

## Agent 2 — Data and CMS agent
### Responsibilities
- define Prisma schema
- implement migrations
- create seed content format
- build route handlers and query helpers

### Outputs
- schema.prisma
- seed.ts
- content import helpers
- read APIs

## Agent 3 — Globe rendering agent
### Responsibilities
- build R3F scene architecture
- implement Earth, clouds, atmosphere, stars
- manage camera and scene performance

### Outputs
- globe components
- texture loading strategy
- interaction-ready scene foundation

## Agent 4 — Interaction systems agent
### Responsibilities
- marker logic
- hover/select logic
- camera focusing
- shared interaction state

### Outputs
- marker system
- raycasting
- camera transitions
- globe store integration

## Agent 5 — UI systems agent
### Responsibilities
- build overlay interface
- create drawer, cards, search box, filter bar
- ensure responsive layout and accessibility

### Outputs
- UI component library
- homepage shell
- selection drawer

## Agent 6 — Content presentation agent
### Responsibilities
- flora detail pages
- region pages
- biome pages
- editorial section templates

### Outputs
- detail route templates
- page layouts
- reusable fact sections

## Agent 7 — Performance and QA agent
### Responsibilities
- optimize bundle and assets
- improve frame rate
- test fallbacks
- test interaction quality
- verify deployment readiness

### Outputs
- performance reports
- optimization changes
- QA checklist
- deployment verification notes

---

## 20. Suggested implementation tickets

## 20.1 Foundation tickets
- initialize Next.js App Router project
- add Tailwind and base theme
- configure linting, formatting, and path aliases
- install R3F, Drei, Framer Motion, Zustand, Prisma
- create app shell and global layout

## 20.2 Data tickets
- define Prisma models for region, flora, biome, media
- create first migration
- implement seed script with 20 flora and 20 regions
- create server query helpers
- add API route handlers

## 20.3 Globe tickets
- create `GlobeScene` component
- add Earth mesh and textures
- add atmosphere effect
- add cloud layer
- add star background
- add orbit controls with constraints
- add idle rotation

## 20.4 Interaction tickets
- create flora marker data format
- render region anchors
- implement hover interactions
- implement selected interactions
- connect marker clicks to drawer state
- animate camera focus to selected target

## 20.5 UI tickets
- create drawer component
- create preview card component
- build homepage header
- build filter bar
- build search modal or command palette
- build responsive layouts

## 20.6 Page tickets
- build flora index page
- build flora detail page
- build regions index page
- build region detail page
- build biome detail page

## 20.7 Quality tickets
- implement reduced motion support
- add no-WebGL fallback
- optimize textures
- run Lighthouse checks
- verify mobile responsiveness
- verify Vercel deployment

---

## 21. Definition of done for MVP

The MVP is complete when all of the following are true:

1. The homepage opens to a compelling full-screen globe
2. The globe rotates and zooms smoothly
3. Users can select at least 20 flora entries
4. Region interactions work
5. A detail drawer opens with relevant flora or region data
6. Flora detail pages exist and are linkable by URL
7. Search and basic filters work
8. The product is responsive on common desktop and mobile sizes
9. The site works on Vercel with documented setup
10. There is a usable non-3D browsing path
11. Accessibility basics are covered
12. Performance is acceptable on mainstream hardware

---

## 22. Risks and mitigations

## Risk 1 — 3D performance becomes poor
### Mitigation
- lazy-load scene
- reduce texture sizes
- use instancing
- simplify effects on mobile
- avoid excessive post-processing

## Risk 2 — Content pipeline becomes messy
### Mitigation
- define strict content schema early
- use seed templates
- separate structured data from rich text content

## Risk 3 — The globe is visually impressive but educationally shallow
### Mitigation
- invest in detail page storytelling
- define strong content rules
- ensure each flora page provides memorable takeaways

## Risk 4 — Region interaction becomes too technically heavy too early
### Mitigation
- use anchors and hotspots first
- postpone full polygon projection and picking

## Risk 5 — Over-scoping launch content
### Mitigation
- cap MVP at 20 to 30 flora entries
- prioritize polish over breadth

---

## 23. Recommended MVP content sample structure

For each initial flora entry, prepare:
- common name
- scientific name
- one-sentence summary
- long description
- one region
- one biome
- one hero image
- 2 to 5 key facts
- 1 to 2 cultural notes
- conservation status if applicable

Suggested early geographic spread:
- Amazon basin
- Mediterranean region
- Japan
- Madagascar
- Australian outback
- Alps
- Sahara margins
- Pacific Northwest
- Himalayas
- South African fynbos

This creates strong visual and ecological diversity.

---

## 24. Future roadmap after MVP

## Version 1.5
- richer region pages
- biome-driven exploration
- better related flora graph
- improved labeling and onboarding

## Version 2
- seasonal mode
- bloom animations
- saved collections
- quizzes and educational challenges
- classroom mode
- multilingual support

## Version 3
- dynamic environmental storytelling
- more advanced biome overlays
- guided global learning journeys
- optional audio landscapes and narration

---

## 25. Final build brief for coding agents

Build **Living Flora Globe** as a production-grade web application using **Next.js App Router, TypeScript, Tailwind, React Three Fiber, Drei, Framer Motion, Zustand, Prisma, PostgreSQL, and Vercel**.

The homepage must be a polished, immersive 3D Earth with region and flora interactions. Users should be able to rotate and zoom the globe, select flora markers, open informative preview drawers, and navigate to rich educational detail pages.

The product should prioritize:
- visual elegance
- discoverability
- educational value
- accessibility outside the 3D experience
- Vercel-ready deployment
- long-term extensibility

The team should ship a curated MVP first, with strong storytelling and excellent interaction quality, rather than trying to cover the entire world’s flora catalog immediately.
