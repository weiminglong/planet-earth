import { NextRequest, NextResponse } from "next/server";
import { getFilteredFlora } from "@/lib/flora-data";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const flora = await getFilteredFlora({
    query: searchParams.get("q"),
    biome: searchParams.get("biome"),
    region: searchParams.get("region"),
    continent: searchParams.get("continent"),
    status: searchParams.get("status"),
    season: searchParams.get("season"),
    origin: searchParams.get("origin"),
  });

  return NextResponse.json(flora);
}
