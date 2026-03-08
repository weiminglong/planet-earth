import type { Prisma } from "@/generated/prisma/client";

export type FloraQueryFilters = {
  query?: string | null;
  biome?: string | null;
  region?: string | null;
  continent?: string | null;
  status?: string | null;
  season?: string | null;
  origin?: string | null;
};

function normalizeFilterValue(value?: string | null) {
  const normalized = value?.trim();

  if (!normalized || normalized === "all") {
    return null;
  }

  return normalized;
}

function buildSeasonWhere(
  season?: string | null,
): Prisma.FloraWhereInput | null {
  const normalizedSeason = normalizeFilterValue(season);

  if (!normalizedSeason) {
    return null;
  }

  if (normalizedSeason === "Year-round") {
    return {
      bloomSeason: {
        contains: "year-round",
        mode: "insensitive",
      },
    };
  }

  if (normalizedSeason === "Non-flowering") {
    return {
      bloomSeason: {
        contains: "non-flowering",
        mode: "insensitive",
      },
    };
  }

  const termsBySeason: Record<string, string[]> = {
    Spring: ["spring", "march", "april", "may"],
    Summer: ["summer", "june", "july", "august"],
    Autumn: ["autumn", "fall", "september", "october", "november"],
    Winter: ["winter", "december", "january", "february"],
  };

  const terms = termsBySeason[normalizedSeason];

  if (!terms) {
    return null;
  }

  return {
    OR: terms.map((term) => ({
      bloomSeason: {
        contains: term,
        mode: "insensitive",
      },
    })),
  };
}

export function buildFloraWhere(
  filters: FloraQueryFilters = {},
): Prisma.FloraWhereInput | undefined {
  const query = normalizeFilterValue(filters.query)?.toLowerCase();
  const biome = normalizeFilterValue(filters.biome);
  const region = normalizeFilterValue(filters.region);
  const continent = normalizeFilterValue(filters.continent);
  const status = normalizeFilterValue(filters.status);
  const origin = normalizeFilterValue(filters.origin);
  const seasonWhere = buildSeasonWhere(filters.season);
  const conditions: Prisma.FloraWhereInput[] = [];

  if (query) {
    conditions.push({
      OR: [
        {
          commonName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          scientificName: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          regionOccurrences: {
            some: {
              region: {
                is: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
        {
          biomes: {
            some: {
              biome: {
                is: {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              },
            },
          },
        },
      ],
    });
  }

  if (biome) {
    conditions.push({
      biomes: {
        some: {
          biome: {
            is: {
              slug: biome,
            },
          },
        },
      },
    });
  }

  if (region) {
    conditions.push({
      regionOccurrences: {
        some: {
          region: {
            is: {
              slug: region,
            },
          },
        },
      },
    });
  }

  if (continent) {
    conditions.push({
      regionOccurrences: {
        some: {
          region: {
            is: {
              parentRegion: {
                is: {
                  slug: continent,
                },
              },
            },
          },
        },
      },
    });
  }

  if (status) {
    conditions.push({
      conservationStatus: status,
    });
  }

  if (seasonWhere) {
    conditions.push(seasonWhere);
  }

  if (origin === "native") {
    conditions.push({
      regionOccurrences: {
        some: {
          isNative: true,
        },
      },
    });
  }

  if (origin === "endemic") {
    conditions.push({
      regionOccurrences: {
        some: {
          isEndemic: true,
        },
      },
    });
  }

  if (origin === "introduced") {
    conditions.push({
      regionOccurrences: {
        none: {
          isNative: true,
        },
      },
    });
  }

  if (!conditions.length) {
    return undefined;
  }

  return {
    AND: conditions,
  };
}
