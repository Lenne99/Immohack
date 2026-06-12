import { NextResponse } from "next/server";
import { getCrawlMeta, resetNewCount } from "@/lib/property-store";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reset = searchParams.get("reset") === "1";

  const meta = getCrawlMeta();
  if (reset) resetNewCount();

  return NextResponse.json(meta, {
    headers: { "Cache-Control": "no-store" },
  });
}
