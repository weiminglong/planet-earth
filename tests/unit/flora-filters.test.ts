import { describe, expect, it } from "vitest";
import { filterFloraCollection } from "@/lib/flora-filters";

const flora = [
  {
    commonName: "Cherry Blossom",
    scientificName: "Prunus serrulata",
    conservationStatus: "Least Concern",
    bloomSeason: "Spring",
    bloomWindows: ["Spring"],
    floraType: "Tree",
    regions: [{ name: "Japan", slug: "japan" }],
    biomes: [{ name: "Temperate Forest", slug: "temperate-forest" }],
    continents: [{ name: "Asia", slug: "asia" }],
    hasNativeOccurrence: true,
    hasEndemicOccurrence: false,
  },
  {
    commonName: "Welwitschia",
    scientificName: "Welwitschia mirabilis",
    conservationStatus: "Near Threatened",
    bloomSeason: "Year-round",
    bloomWindows: ["Year-round"],
    floraType: "Succulent",
    regions: [{ name: "Namib Desert", slug: "namib-desert" }],
    biomes: [{ name: "Desert Steppe", slug: "desert-steppe" }],
    continents: [{ name: "Africa", slug: "africa" }],
    hasNativeOccurrence: false,
    hasEndemicOccurrence: true,
  },
];

describe("filterFloraCollection", () => {
  it("matches text against flora, region, and biome fields", () => {
    expect(filterFloraCollection(flora, { query: "japan" })).toHaveLength(1);
    expect(filterFloraCollection(flora, { query: "desert" })).toHaveLength(1);
    expect(filterFloraCollection(flora, { query: "prunus" })).toHaveLength(1);
  });

  it("supports origin filters", () => {
    expect(filterFloraCollection(flora, { origin: "native" })).toHaveLength(1);
    expect(filterFloraCollection(flora, { origin: "endemic" })).toHaveLength(1);
    expect(filterFloraCollection(flora, { origin: "introduced" })).toHaveLength(
      1,
    );
  });

  it("supports bloom and taxonomy filters together", () => {
    const result = filterFloraCollection(flora, {
      season: "Spring",
      floraType: "Tree",
      continent: "asia",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.commonName).toBe("Cherry Blossom");
  });
});
