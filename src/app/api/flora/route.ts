import { NextRequest, NextResponse } from "next/server";
import { getAllFlora } from "@/lib/flora-data";
import { filterFloraCollection } from "@/lib/flora-filters";

export async function GET(request: NextRequest) {
  const flora = await getAllFlora();
  const searchParams = request.nextUrl.searchParams;

  const filtered = filterFloraCollection(flora, {
    query: searchParams.get("q"),
    biome: searchParams.get("biome"),
    region: searchParams.get("region"),
    continent: searchParams.get("continent"),
    status: searchParams.get("status"),
    season: searchParams.get("season"),
    origin: searchParams.get("origin"),
  });

  return NextResponse.json(filtered);
}
