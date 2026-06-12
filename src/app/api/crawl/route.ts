import { NextResponse } from "next/server";
import { addCrawledProperties, getCrawlMeta } from "@/lib/property-store";
import { generateBatch } from "@/lib/property-generator";

// Secret to protect the endpoint from unauthorized triggers
const CRON_SECRET = process.env.CRON_SECRET ?? "immohack-cron-2024";

export async function POST(request: Request) {
  // Validate secret
  const auth = request.headers.get("authorization");
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const portals = ["ImmobilienScout24", "Immowelt", "Immonet", "Kleinanzeigen"];
  const startTime = Date.now();

  // Simulate crawling: generate 3-8 new candidate properties
  const candidateCount = Math.floor(Math.random() * 6) + 3;
  const candidates = generateBatch(candidateCount);

  // Filter: only quality deals survive (score ≥ 75)
  const qualityDeals = candidates.filter((p) => p.analysis.dealScore >= 75);
  const added = addCrawledProperties(qualityDeals);

  const meta = getCrawlMeta();
  const duration = Date.now() - startTime;

  return NextResponse.json({
    success: true,
    duration_ms: duration,
    portals_checked: portals.length,
    candidates_found: candidateCount,
    quality_deals: qualityDeals.length,
    new_added: added,
    total_in_store: meta.totalCrawled,
    crawled_at: meta.lastCrawledAt,
  });
}

// Allow GET for manual testing in browser
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (secret !== (process.env.CRON_SECRET ?? "immohack-cron-2024")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const candidates = generateBatch(5);
  const qualityDeals = candidates.filter((p) => p.analysis.dealScore >= 75);
  const added = addCrawledProperties(qualityDeals);
  const meta = getCrawlMeta();

  return NextResponse.json({
    success: true,
    new_added: added,
    total_crawled: meta.totalCrawled,
    crawled_at: meta.lastCrawledAt,
  });
}
