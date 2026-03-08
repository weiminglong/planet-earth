export type FloraFilters = {
  query?: string | null;
  biome?: string | null;
  region?: string | null;
  continent?: string | null;
  floraType?: string | null;
  status?: string | null;
  season?: string | null;
  origin?: string | null;
};

type FloraFilterable = {
  commonName: string;
  scientificName: string;
  conservationStatus: string | null;
  bloomSeason: string | null;
  bloomWindows: string[];
  floraType: string;
  regions: Array<{
    name: string;
    slug: string;
  }>;
  biomes: Array<{
    name: string;
    slug: string;
  }>;
  continents: Array<{
    name: string;
    slug: string;
  }>;
  hasNativeOccurrence: boolean;
  hasEndemicOccurrence: boolean;
};

function matchesText(value: string, query: string) {
  return value.toLowerCase().includes(query);
}

export function filterFloraCollection<T extends FloraFilterable>(
  collection: T[],
  filters: FloraFilters,
) {
  const normalizedQuery = filters.query?.trim().toLowerCase() ?? "";
  const season = filters.season?.trim() ?? "";
  const origin = filters.origin?.trim() ?? "";

  return collection.filter((item) => {
    const matchesQuery =
      normalizedQuery.length === 0 ||
      matchesText(item.commonName, normalizedQuery) ||
      matchesText(item.scientificName, normalizedQuery) ||
      item.regions.some((region) =>
        matchesText(region.name, normalizedQuery),
      ) ||
      item.biomes.some((biome) => matchesText(biome.name, normalizedQuery));

    const matchesBiome =
      !filters.biome ||
      filters.biome === "all" ||
      item.biomes.some((biome) => biome.slug === filters.biome);

    const matchesRegion =
      !filters.region ||
      filters.region === "all" ||
      item.regions.some((region) => region.slug === filters.region);

    const matchesContinent =
      !filters.continent ||
      filters.continent === "all" ||
      item.continents.some((continent) => continent.slug === filters.continent);

    const matchesFloraType =
      !filters.floraType ||
      filters.floraType === "all" ||
      item.floraType === filters.floraType;

    const matchesStatus =
      !filters.status ||
      filters.status === "all" ||
      item.conservationStatus === filters.status;

    const matchesSeason =
      !season ||
      season === "all" ||
      item.bloomWindows.includes(season) ||
      (season === "Year-round" && item.bloomSeason === "Year-round") ||
      (season === "Non-flowering" && item.bloomSeason === "Non-flowering fern");

    const matchesOrigin =
      !origin ||
      origin === "all" ||
      (origin === "endemic" && item.hasEndemicOccurrence) ||
      (origin === "native" && item.hasNativeOccurrence) ||
      (origin === "introduced" && !item.hasNativeOccurrence);

    return (
      matchesQuery &&
      matchesBiome &&
      matchesRegion &&
      matchesContinent &&
      matchesFloraType &&
      matchesStatus &&
      matchesSeason &&
      matchesOrigin
    );
  });
}
