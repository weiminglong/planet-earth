import { NextRequest, NextResponse } from "next/server";
import { getFilteredRegions } from "@/lib/region-data";

export async function GET(request: NextRequest) {
  const regions = await getFilteredRegions({
    query: request.nextUrl.searchParams.get("q"),
    continent: request.nextUrl.searchParams.get("continent"),
    biome: request.nextUrl.searchParams.get("biome"),
  });

  return NextResponse.json(regions);
}
