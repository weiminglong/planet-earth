import { cache } from "react";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type RegionReference = {
  name: string;
  slug: string;
  type: string;
  lat: number;
  lng: number;
  summary: string;
  climateNotes: string | null;
  parentRegion: {
    name: string;
    slug: string;
  } | null;
};

export type BiomeReference = {
  name: string;
  slug: string;
  description: string;
  climateProfile: string | null;
  visualTheme: string | null;
};

export type FloraPreview = {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  shortDescription: string;
  longDescription: string;
  conservationStatus: string | null;
  bloomSeason: string | null;
  bloomWindows: string[];
  family: string | null;
  genus: string | null;
  species: string | null;
  featured: boolean;
  visualTheme: string | null;
  regions: RegionReference[];
  primaryRegion: RegionReference | null;
  continents: Array<{
    name: string;
    slug: string;
  }>;
  primaryContinent: {
    name: string;
    slug: string;
  } | null;
  biomes: BiomeReference[];
  facts: string[];
  culturalNotes: string[];
  hasNativeOccurrence: boolean;
  hasEndemicOccurrence: boolean;
};

export type RelatedFlora = FloraPreview & {
  reasons: string[];
  score: number;
};

export type FloraDetail = FloraPreview & {
  relatedFlora: RelatedFlora[];
};

const floraInclude = {
  regionOccurrences: {
    include: {
      region: {
        include: {
          parentRegion: true,
        },
      },
    },
  },
  biomes: {
    include: {
      biome: true,
    },
  },
  facts: true,
  culturalNotes: true,
} satisfies Prisma.FloraInclude;

type FloraResult = Prisma.FloraGetPayload<{
  include: typeof floraInclude;
}>;

async function fetchFloraRecords(where?: Prisma.FloraWhereInput) {
  return prisma.flora.findMany({
    where,
    include: floraInclude,
    orderBy: {
      commonName: "asc",
    },
  });
}

function dedupeBySlug<T extends { slug: string }>(items: T[]) {
  return items.filter(
    (item, index) => items.findIndex((candidate) => candidate.slug === item.slug) === index,
  );
}

function buildBloomWindows(input?: string | null) {
  if (!input) {
    return [];
  }

  const normalized = input.toLowerCase();

  if (normalized.includes("year-round")) {
    return ["Year-round"];
  }

  if (normalized.includes("non-flowering")) {
    return ["Non-flowering"];
  }

  const windows = new Set<string>();

  if (
    normalized.includes("march") ||
    normalized.includes("april") ||
    normalized.includes("may") ||
    normalized.includes("spring")
  ) {
    windows.add("Spring");
  }

  if (
    normalized.includes("june") ||
    normalized.includes("july") ||
    normalized.includes("august") ||
    normalized.includes("summer")
  ) {
    windows.add("Summer");
  }

  if (
    normalized.includes("september") ||
    normalized.includes("october") ||
    normalized.includes("november") ||
    normalized.includes("autumn") ||
    normalized.includes("fall")
  ) {
    windows.add("Autumn");
  }

  if (
    normalized.includes("december") ||
    normalized.includes("january") ||
    normalized.includes("february") ||
    normalized.includes("winter")
  ) {
    windows.add("Winter");
  }

  return [...windows];
}

function mapFloraRecord(record: FloraResult): FloraPreview {
  const regions = record.regionOccurrences.map(({ region }) => ({
    name: region.name,
    slug: region.slug,
    type: region.type,
    lat: region.lat,
    lng: region.lng,
    summary: region.summary,
    climateNotes: region.climateNotes,
    parentRegion: region.parentRegion
      ? {
          name: region.parentRegion.name,
          slug: region.parentRegion.slug,
        }
      : null,
  }));

  const biomes = dedupeBySlug(
    record.biomes.map(({ biome }) => ({
      name: biome.name,
      slug: biome.slug,
      description: biome.description,
      climateProfile: biome.climateProfile,
      visualTheme: biome.visualTheme,
    })),
  );

  const continents = dedupeBySlug(
    regions
      .map((region) => region.parentRegion)
      .filter((region): region is NonNullable<typeof region> => Boolean(region)),
  );

  return {
    id: record.id,
    slug: record.slug,
    commonName: record.commonName,
    scientificName: record.scientificName,
    shortDescription: record.shortDescription,
    longDescription: record.longDescription,
    conservationStatus: record.conservationStatus,
    bloomSeason: record.bloomSeason,
    bloomWindows: buildBloomWindows(record.bloomSeason),
    family: record.family,
    genus: record.genus,
    species: record.species,
    featured: record.featured,
    visualTheme: biomes[0]?.visualTheme ?? null,
    regions,
    primaryRegion: regions[0] ?? null,
    continents,
    primaryContinent: continents[0] ?? null,
    biomes,
    facts: record.facts.map(({ fact }) => fact),
    culturalNotes: record.culturalNotes.map(({ note }) => note),
    hasNativeOccurrence: record.regionOccurrences.some(({ isNative }) => isNative),
    hasEndemicOccurrence: record.regionOccurrences.some(({ isEndemic }) => isEndemic),
  };
}

function buildRelatedFlora(source: FloraPreview, candidates: FloraPreview[]) {
  return candidates
    .map((candidate) => {
      const reasons = new Set<string>();
      let score = 0;

      if (candidate.primaryRegion?.slug === source.primaryRegion?.slug) {
        reasons.add(`Shared region: ${candidate.primaryRegion?.name ?? "Shared habitat"}`);
        score += 6;
      }

      if (
        candidate.primaryContinent?.slug &&
        candidate.primaryContinent.slug === source.primaryContinent?.slug
      ) {
        reasons.add(
          `Same continent: ${candidate.primaryContinent?.name ?? "Shared continent"}`,
        );
        score += 3;
      }

      const sharedBiomes = candidate.biomes.filter((biome) =>
        source.biomes.some((sourceBiome) => sourceBiome.slug === biome.slug),
      );

      if (sharedBiomes.length > 0) {
        reasons.add(`Shared biome: ${sharedBiomes[0].name}`);
        score += 3 + Math.max(0, sharedBiomes.length - 1);
      }

      if (candidate.family && candidate.family === source.family) {
        reasons.add(`Same family: ${candidate.family}`);
        score += 2;
      }

      if (candidate.genus && candidate.genus === source.genus) {
        reasons.add(`Same genus: ${candidate.genus}`);
        score += 2;
      }

      if (
        candidate.conservationStatus &&
        candidate.conservationStatus === source.conservationStatus
      ) {
        reasons.add(`Shared status: ${candidate.conservationStatus}`);
        score += 1;
      }

      const sharedBloomWindow = candidate.bloomWindows.find((window) =>
        source.bloomWindows.includes(window),
      );

      if (sharedBloomWindow) {
        reasons.add(`Shared bloom window: ${sharedBloomWindow}`);
        score += 1;
      }

      if (candidate.hasEndemicOccurrence && source.hasEndemicOccurrence) {
        reasons.add("Both highlight endemic flora");
        score += 1;
      }

      if (candidate.featured) {
        score += 0.5;
      }

      return {
        ...candidate,
        reasons: [...reasons],
        score,
      } satisfies RelatedFlora;
    })
    .filter((candidate) => candidate.score > 0)
    .sort(
      (left, right) =>
        right.score - left.score || left.commonName.localeCompare(right.commonName),
    )
    .slice(0, 6);
}

export const getHomepageFlora = cache(async () => {
  const records = await fetchFloraRecords({ featured: true });
  return records.map(mapFloraRecord);
});

export const getAllFlora = cache(async () => {
  const records = await fetchFloraRecords();
  return records.map(mapFloraRecord);
});

export const getFloraBySlug = cache(async (slug: string) => {
  const record = await prisma.flora.findUnique({
    where: { slug },
    include: floraInclude,
  });

  if (!record) {
    return null;
  }

  const current = mapFloraRecord(record);
  const allFlora = await getAllFlora();
  const relatedFlora = buildRelatedFlora(
    current,
    allFlora.filter((candidate) => candidate.slug !== slug),
  );

  return {
    ...current,
    relatedFlora,
  } satisfies FloraDetail;
});
