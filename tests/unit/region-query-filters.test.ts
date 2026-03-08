import { describe, expect, it } from "vitest";
import { buildRegionWhere } from "@/lib/region-query-filters";

describe("buildRegionWhere", () => {
  it("always excludes continents and empty flora regions", () => {
    expect(buildRegionWhere()).toEqual({
      AND: [
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
      ],
    });
  });

  it("adds continent, biome, and text search filters", () => {
    expect(
      buildRegionWhere({
        query: "forest",
        continent: "asia",
        biome: "Temperate Forest",
      }),
    ).toEqual({
      AND: [
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
        {
          OR: [
            {
              name: {
                contains: "forest",
                mode: "insensitive",
              },
            },
            {
              summary: {
                contains: "forest",
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
                                contains: "forest",
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
        },
        {
          parentRegion: {
            is: {
              slug: "asia",
            },
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
                          OR: [
                            {
                              name: "Temperate Forest",
                            },
                            {
                              slug: "Temperate Forest",
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
        },
      ],
    });
  });
});
