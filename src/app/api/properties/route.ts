import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROPERTIES } from "@/data/mock-properties";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get("city");
  const minScore = Number(searchParams.get("minScore") ?? 0);
  const maxPrice = Number(searchParams.get("maxPrice") ?? 10000000);
  const minYield = Number(searchParams.get("minYield") ?? 0);
  const sortBy = searchParams.get("sortBy") ?? "score";
  const limit = Number(searchParams.get("limit") ?? 50);

  let properties = MOCK_PROPERTIES.filter((p) => {
    if (city && p.city !== city) return false;
    if (p.analysis.dealScore < minScore) return false;
    if (p.price > maxPrice) return false;
    if (p.analysis.grossYield < minYield) return false;
    return true;
  });

  switch (sortBy) {
    case "score": properties.sort((a, b) => b.analysis.dealScore - a.analysis.dealScore); break;
    case "yield": properties.sort((a, b) => b.analysis.grossYield - a.analysis.grossYield); break;
    case "price_asc": properties.sort((a, b) => a.price - b.price); break;
    case "price_desc": properties.sort((a, b) => b.price - a.price); break;
  }

  return NextResponse.json({
    total: properties.length,
    properties: properties.slice(0, limit),
  });
}
