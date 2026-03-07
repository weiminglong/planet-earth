import { NextRequest, NextResponse } from "next/server";
import { getAllRegions } from "@/lib/region-data";

export async function GET(request: NextRequest) {
  const regions = await getAllRegions();
  const search = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  const continent = request.nextUrl.searchParams.get("continent");
  const biome = request.nextUrl.searchParams.get("biome");

  const filtered = regions.filter((region) => {
    const matchesSearch =
      search.length === 0 ||
      region.name.toLowerCase().includes(search) ||
      region.summary.toLowerCase().includes(search) ||
      region.biomeNames.some((biomeName) => biomeName.toLowerCase().includes(search));

    const matchesContinent =
      !continent || continent === "all" || region.parentRegion?.slug === continent;

    const matchesBiome =
      !biome || biome === "all" || region.biomeNames.includes(biome);

    return matchesSearch && matchesContinent && matchesBiome;
  });

  return NextResponse.json(filtered);
}
