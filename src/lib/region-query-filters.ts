import type { Prisma } from "@/generated/prisma/client";

export type RegionQueryFilters = {
  query?: string | null;
  continent?: string | null;
  biome?: string | null;
};

function normalizeFilterValue(value?: string | null) {
  const normalized = value?.trim();

  if (!normalized || normalized === "all") {
    return null;
  }

  return normalized;
}

export function buildRegionWhere(
  filters: RegionQueryFilters = {},
): Prisma.RegionWhereInput {
  const query = normalizeFilterValue(filters.query)?.toLowerCase();
  const continent = normalizeFilterValue(filters.continent);
  const biome = normalizeFilterValue(filters.biome);
  const conditions: Prisma.RegionWhereInput[] = [
    {
      type: {
        not: "continent",
      },
    },
    {
      floraOccurrences: {
        some: {},
      },
    },
  ];

  if (query) {
    conditions.push({
      OR: [
        {
          name: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          summary: {
            contains: query,
            mode: "insensitive",
          },
        },
        {
          floraOccurrences: {
            some: {
              flora: {
                is: {
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
              },
            },
          },
        },
      ],
    });
  }

  if (continent) {
    conditions.push({
      parentRegion: {
        is: {
          slug: continent,
        },
      },
    });
  }

  if (biome) {
    conditions.push({
      floraOccurrences: {
        some: {
          flora: {
            is: {
              biomes: {
                some: {
                  biome: {
                    is: {
                      OR: [
                        {
                          name: biome,
                        },
                        {
                          slug: biome,
                        },
                      ],
                    },
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  return {
    AND: conditions,
  };
}
