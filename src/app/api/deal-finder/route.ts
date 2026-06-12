import { NextRequest, NextResponse } from "next/server";
import { MOCK_PROPERTIES } from "@/data/mock-properties";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const {
    budget = 1000000,
    equity = 200000,
    targetYield = 4,
    minCashflow = -500,
    regions = [],
    riskProfile = "BALANCED",
    minDealScore = 70,
  } = body;

  const results = MOCK_PROPERTIES.filter((p) => {
    if (p.price > budget) return false;
    if (p.analysis.grossYield < targetYield) return false;
    if (p.analysis.cashflow < minCashflow) return false;
    if (p.analysis.dealScore < minDealScore) return false;
    if (regions.length > 0 && !regions.includes(p.city)) return false;
    if (riskProfile === "CONSERVATIVE" && p.analysis.renovationRisk > 40) return false;
    return true;
  }).sort((a, b) => b.analysis.dealScore - a.analysis.dealScore);

  return NextResponse.json({
    total: MOCK_PROPERTIES.length,
    matching: results.length,
    results,
  });
}
