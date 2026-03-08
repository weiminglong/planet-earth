import { describe, expect, it } from "vitest";
import { buildFloraWhere } from "@/lib/flora-query-filters";

describe("buildFloraWhere", () => {
  it("returns undefined when no filters are active", () => {
    expect(buildFloraWhere()).toBeUndefined();
    expect(buildFloraWhere({ biome: "all", query: "   " })).toBeUndefined();
  });

  it("builds a Prisma AND clause for text and relational filters", () => {
    expect(
      buildFloraWhere({
        query: "maple",
        biome: "temperate-forest",
        region: "japan",
        continent: "asia",
        status: "Least Concern",
      }),
    ).toEqual({
      AND: [
        {
          OR: [
            {
              commonName: {
                contains: "maple",
                mode: "insensitive",
              },
            },
            {
              scientificName: {
                contains: "maple",
                mode: "insensitive",
              },
            },
            {
              regionOccurrences: {
                some: {
                  region: {
                    is: {
                      name: {
                        contains: "maple",
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
                        contains: "maple",
                        mode: "insensitive",
                      },
                    },
                  },
                },
              },
            },
          ],
        },
        {
          biomes: {
            some: {
              biome: {
                is: {
                  slug: "temperate-forest",
                },
              },
            },
          },
        },
        {
          regionOccurrences: {
            some: {
              region: {
                is: {
                  slug: "japan",
                },
              },
            },
          },
        },
        {
          regionOccurrences: {
            some: {
              region: {
                is: {
                  parentRegion: {
                    is: {
                      slug: "asia",
                    },
                  },
                },
              },
            },
          },
        },
        {
          conservationStatus: "Least Concern",
        },
      ],
    });
  });

  it("maps seasonality and origin filters to Prisma where clauses", () => {
    expect(
      buildFloraWhere({
        season: "Autumn",
        origin: "introduced",
      }),
    ).toEqual({
      AND: [
        {
          OR: [
            {
              bloomSeason: {
                contains: "autumn",
                mode: "insensitive",
              },
            },
            {
              bloomSeason: {
                contains: "fall",
                mode: "insensitive",
              },
            },
            {
              bloomSeason: {
                contains: "september",
                mode: "insensitive",
              },
            },
            {
              bloomSeason: {
                contains: "october",
                mode: "insensitive",
              },
            },
            {
              bloomSeason: {
                contains: "november",
                mode: "insensitive",
              },
            },
          ],
        },
        {
          regionOccurrences: {
            none: {
              isNative: true,
            },
          },
        },
      ],
    });
  });
});
