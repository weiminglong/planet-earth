import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const flora = await prisma.flora.findMany({
    include: {
      regionOccurrences: {
        include: { region: true },
      },
    },
    orderBy: { commonName: "asc" },
  });
  return NextResponse.json(flora);
}
