import { cache } from "react";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type RegionFloraCard = {
  slug: string;
  commonName: string;
  scientificName: string;
  shortDescription: string;
  conservationStatus: string | null;
  bloomSeason: string | null;
  featured: boolean;
  visualTheme: string | null;
  biomes: Array<{
    name: string;
    slug: string;
  }>;
  isNative: boolean;
  isEndemic: boolean;
};

export type RegionPreview = {
  id: string;
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
  floraCount: number;
  endemicFloraCount: number;
  biomeNames: string[];
  featuredFlora: RegionFloraCard[];
};

export type RegionDetail = RegionPreview & {
  flora: RegionFloraCard[];
};

const regionInclude = {
  parentRegion: true,
  floraOccurrences: {
    include: {
      flora: {
        include: {
          biomes: {
            include: {
              biome: true,
            },
          },
        },
      },
    },
  },
} satisfies Prisma.RegionInclude;

type RegionRecord = Prisma.RegionGetPayload<{
  include: typeof regionInclude;
}>;

function dedupeBySlug<T extends { slug: string }>(items: T[]) {
  return items.filter(
    (item, index) => items.findIndex((candidate) => candidate.slug === item.slug) === index,
  );
}

function mapRegionFloraCard(
  occurrence: RegionRecord["floraOccurrences"][number],
): RegionFloraCard {
  return {
    slug: occurrence.flora.slug,
    commonName: occurrence.flora.commonName,
    scientificName: occurrence.flora.scientificName,
    shortDescription: occurrence.flora.shortDescription,
    conservationStatus: occurrence.flora.conservationStatus,
    bloomSeason: occurrence.flora.bloomSeason,
    featured: occurrence.flora.featured,
    visualTheme: occurrence.flora.biomes[0]?.biome.visualTheme ?? null,
    biomes: dedupeBySlug(
      occurrence.flora.biomes.map(({ biome }) => ({
        name: biome.name,
        slug: biome.slug,
      })),
    ),
    isNative: occurrence.isNative,
    isEndemic: occurrence.isEndemic,
  };
}

function mapRegionRecord(record: RegionRecord): RegionPreview {
  const flora = record.floraOccurrences.map(mapRegionFloraCard);
  const biomeNames = [
    ...new Set(flora.flatMap((item) => item.biomes.map((biome) => biome.name))),
  ].sort((left, right) => left.localeCompare(right));

  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    type: record.type,
    lat: record.lat,
    lng: record.lng,
    summary: record.summary,
    climateNotes: record.climateNotes,
    parentRegion: record.parentRegion
      ? {
          name: record.parentRegion.name,
          slug: record.parentRegion.slug,
        }
      : null,
    floraCount: flora.length,
    endemicFloraCount: flora.filter((item) => item.isEndemic).length,
    biomeNames,
    featuredFlora: flora
      .filter((item) => item.featured)
      .sort((left, right) => left.commonName.localeCompare(right.commonName))
      .slice(0, 3),
  };
}

async function fetchRegionRecords(where?: Prisma.RegionWhereInput) {
  return prisma.region.findMany({
    where,
    include: regionInclude,
    orderBy: {
      name: "asc",
    },
  });
}

export const getAllRegions = cache(async () => {
  const records = await fetchRegionRecords({
    type: {
      not: "continent",
    },
  });

  return records
    .map(mapRegionRecord)
    .filter((region) => region.floraCount > 0);
});

export const getHomepageRegions = cache(async () => {
  const regions = await getAllRegions();

  return [...regions]
    .sort(
      (left, right) =>
        right.featuredFlora.length - left.featuredFlora.length ||
        right.floraCount - left.floraCount ||
        left.name.localeCompare(right.name),
    )
    .slice(0, 4);
});

export const getRegionBySlug = cache(async (slug: string) => {
  const record = await prisma.region.findUnique({
    where: { slug },
    include: regionInclude,
  });

  if (!record || record.type === "continent") {
    return null;
  }

  const flora = record.floraOccurrences
    .map(mapRegionFloraCard)
    .sort((left, right) => {
      if (left.featured !== right.featured) {
        return left.featured ? -1 : 1;
      }

      return left.commonName.localeCompare(right.commonName);
    });

  return {
    ...mapRegionRecord(record),
    flora,
  } satisfies RegionDetail;
});
