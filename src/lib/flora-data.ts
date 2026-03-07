import { cache } from "react";
import type { Prisma } from "@/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export type FloraPreview = {
  id: string;
  slug: string;
  commonName: string;
  scientificName: string;
  shortDescription: string;
  longDescription: string;
  conservationStatus: string | null;
  bloomSeason: string | null;
  family: string | null;
  genus: string | null;
  species: string | null;
  visualTheme: string | null;
  regions: Array<{
    name: string;
    slug: string;
    lat: number;
    lng: number;
    summary: string;
    climateNotes: string | null;
  }>;
  primaryRegion: {
    name: string;
    slug: string;
    lat: number;
    lng: number;
    summary: string;
    climateNotes: string | null;
  } | null;
  biomes: Array<{
    name: string;
    slug: string;
    description: string;
    climateProfile: string | null;
    visualTheme: string | null;
  }>;
  facts: string[];
  culturalNotes: string[];
};

export type FloraDetail = FloraPreview & {
  relatedFlora: FloraPreview[];
};

type FloraResult = Awaited<ReturnType<typeof fetchFloraRecords>>[number];

async function fetchFloraRecords(where?: Prisma.FloraWhereInput) {
  return prisma.flora.findMany({
    where,
    include: {
      regionOccurrences: {
        include: {
          region: true,
        },
      },
      biomes: {
        include: {
          biome: true,
        },
      },
      facts: true,
      culturalNotes: true,
    },
    orderBy: {
      commonName: "asc",
    },
  });
}

function mapFloraRecord(record: FloraResult): FloraPreview {
  const regions = [...record.regionOccurrences]
    .map(({ region }) => ({
      name: region.name,
      slug: region.slug,
      lat: region.lat,
      lng: region.lng,
      summary: region.summary,
      climateNotes: region.climateNotes,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  const biomes = [...record.biomes]
    .map(({ biome }) => ({
      name: biome.name,
      slug: biome.slug,
      description: biome.description,
      climateProfile: biome.climateProfile,
      visualTheme: biome.visualTheme,
    }))
    .sort((left, right) => left.name.localeCompare(right.name));

  return {
    id: record.id,
    slug: record.slug,
    commonName: record.commonName,
    scientificName: record.scientificName,
    shortDescription: record.shortDescription,
    longDescription: record.longDescription,
    conservationStatus: record.conservationStatus,
    bloomSeason: record.bloomSeason,
    family: record.family,
    genus: record.genus,
    species: record.species,
    visualTheme: biomes[0]?.visualTheme ?? null,
    regions,
    primaryRegion: regions[0] ?? null,
    biomes,
    facts: record.facts.map(({ fact }) => fact),
    culturalNotes: record.culturalNotes.map(({ note }) => note),
  };
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
    include: {
      regionOccurrences: {
        include: {
          region: true,
        },
      },
      biomes: {
        include: {
          biome: true,
        },
      },
      facts: true,
      culturalNotes: true,
    },
  });

  if (!record) {
    return null;
  }

  const regionIds = record.regionOccurrences.map(({ regionId }) => regionId);
  const biomeIds = record.biomes.map(({ biomeId }) => biomeId);

  const relatedWhere = [
    regionIds.length > 0
      ? {
          regionOccurrences: {
            some: {
              regionId: {
                in: regionIds,
              },
            },
          },
        }
      : null,
    biomeIds.length > 0
      ? {
          biomes: {
            some: {
              biomeId: {
                in: biomeIds,
              },
            },
          },
        }
      : null,
    { featured: true },
  ].filter(Boolean) as Prisma.FloraWhereInput[];

  const relatedRecords = await fetchFloraRecords({
    slug: {
      not: slug,
    },
    OR: relatedWhere,
  });

  return {
    ...mapFloraRecord(record),
    relatedFlora: relatedRecords.slice(0, 3).map(mapFloraRecord),
  } satisfies FloraDetail;
});
