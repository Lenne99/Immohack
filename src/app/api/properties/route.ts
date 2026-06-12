import { NextRequest, NextResponse } from "next/server";
import { getStore } from "@/lib/property-store";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const minScore = Number(searchParams.get("minScore") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 10000000);
  const minYield = Number(searchParams.get("minYield") ?? 0);
  const sortBy = searchParams.get("sortBy") ?? "score";
  const limit = Number(searchParams.get("limit") ?? 50);
  const onlyNew = searchParams.get("onlyNew") === "1";

  const { properties, crawledProperties } = getStore();

  const newIds = new Set(crawledProperties.map((p) => p.id));

  let filtered = properties.filter((p) => {
    if (city && p.city !== city) return false;
    if (p.analysis.dealScore < minScore) return false;
    if (p.price > maxPrice) return false;
    if (p.analysis.grossYield < minYield) return false;
    if (onlyNew && !newIds.has(p.id)) return false;
    return true;
  });

  switch (sortBy) {
    case "score": filtered.sort((a, b) => b.analysis.dealScore - a.analysis.dealScore); break;
    case "yield": filtered.sort((a, b) => b.analysis.grossYield - a.analysis.grossYield); break;
    case "price_asc": filtered.sort((a, b) => a.price - b.price); break;
    case "price_desc": filtered.sort((a, b) => b.price - a.price); break;
    case "newest": filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
  }

  return NextResponse.json(
    {
      total: filtered.length,
      properties: filtered.slice(0, limit),
    },
    { headers: { "Cache-Control": "no-store" } }
  );
}
