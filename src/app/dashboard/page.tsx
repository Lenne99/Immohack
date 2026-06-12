"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { useSettings } from "@/lib/settings-context";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import type { Property } from "@/data/mock-properties";
import { DealCard } from "@/components/deals/DealCard";
import { CrawlStatus } from "@/components/dashboard/CrawlStatus";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { SlidersHorizontal, Settings, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { settings, activeRegionFilter, regionLabel } = useSettings();
  const [sortBy, setSortBy] = useState<"score" | "yield" | "cashflow" | "price" | "newest">("score");
  const [allProperties, setAllProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [newIds, setNewIds] = useState<Set<string>>(new Set());

  const fetchProperties = useCallback(async () => {
    try {
      const res = await fetch("/api/properties?limit=100&sortBy=newest", { cache: "no-store" });
      const data = await res.json();
      if (data.properties?.length) {
        setAllProperties(data.properties);
        const crawledIds = new Set<string>(
          data.properties.filter((p: Property) => p.id.startsWith("crawled-")).map((p: Property) => p.id)
        );
        setNewIds(crawledIds);
      }
    } catch {}
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const deals = useMemo(() => {
    let list = allProperties.filter((p) => {
      if (p.analysis.dealScore < settings.minDealScore) return false;
      if (p.price > settings.budget) return false;
      if (p.analysis.grossYield < settings.zielrendite) return false;
      if (activeRegionFilter.length > 0 && !activeRegionFilter.includes(p.city)) return false;
      return true;
    });

    if (sortBy === "score") list.sort((a, b) => b.analysis.dealScore - a.analysis.dealScore);
    else if (sortBy === "yield") list.sort((a, b) => b.analysis.grossYield - a.analysis.grossYield);
    else if (sortBy === "cashflow") list.sort((a, b) => b.analysis.cashflow - a.analysis.cashflow);
    else if (sortBy === "price") list.sort((a, b) => a.price - b.price);
    else if (sortBy === "newest") list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [allProperties, settings.minDealScore, settings.budget, settings.zielrendite, activeRegionFilter, sortBy]);

  const avgYield = deals.length
    ? deals.reduce((s, p) => s + p.analysis.grossYield, 0) / deals.length
    : 0;
  const bestScore = deals.length ? Math.max(...deals.map((p) => p.analysis.dealScore)) : 0;

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Profile bar */}
      <div className="border-b border-gray-800 bg-gray-950 px-8 py-4 flex items-center gap-6 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-sm font-bold">
            {settings.name.charAt(0)}
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">{settings.name}</p>
            <p className="text-gray-500 text-xs">{settings.plan}</p>
          </div>
        </div>

        <div className="h-6 w-px bg-gray-800" />

        <Chip label="Region" value={regionLabel} />
        <Chip label="Budget" value={`≤ ${formatCurrency(settings.budget)}`} />
        <Chip label="Ziel-Rendite" value={`≥ ${formatPercent(settings.zielrendite)}`} />
        <Chip label="Min. Score" value={settings.minDealScore.toString()} />

        <Link
          href="/settings"
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
        >
          <Settings className="w-3.5 h-3.5" /> Profil bearbeiten
        </Link>
      </div>

      {/* Crawl status bar */}
      <div className="border-b border-gray-800/60 bg-gray-950/80 px-8 py-2.5">
        <CrawlStatus onNewDeals={fetchProperties} />
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Result summary */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-white text-xl font-bold">
              {deals.length === 0
                ? "Keine passenden Deals"
                : `${deals.length} Deal${deals.length !== 1 ? "s" : ""} für dich`}
            </h1>
            {deals.length > 0 && (
              <p className="text-gray-500 text-sm mt-0.5">
                Ø {formatPercent(avgYield)} Rendite · Bester Score: {bestScore}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-gray-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-gray-900 border border-gray-800 text-gray-300 text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              <option value="score">Bester Score zuerst</option>
              <option value="newest">Neueste zuerst</option>
              <option value="yield">Höchste Rendite</option>
              <option value="cashflow">Bester Cashflow</option>
              <option value="price">Günstigster Preis</option>
            </select>
          </div>
        </div>

        {/* Empty state */}
        {deals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-16 h-16 bg-gray-900 rounded-2xl flex items-center justify-center mb-4 border border-gray-800">
              <SlidersHorizontal className="w-7 h-7 text-gray-600" />
            </div>
            <p className="text-gray-400 text-lg font-medium mb-2">Keine Deals gefunden</p>
            <p className="text-gray-600 text-sm max-w-sm mb-6">
              Deine aktuellen Kriterien sind sehr streng. Passe Budget, Ziel-Rendite oder Region an.
            </p>
            <Link
              href="/settings"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-xl transition-colors"
            >
              <Settings className="w-4 h-4" /> Kriterien anpassen
            </Link>
          </div>
        )}

        {/* Deal grid */}
        {deals.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {deals.map((p) => (
              <div key={p.id} className="relative">
                {newIds.has(p.id) && (
                  <span className="absolute -top-2 -right-2 z-10 bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    NEU
                  </span>
                )}
                <DealCard property={p} />
              </div>
            ))}
          </div>
        )}

        {/* Alle Deals link */}
        {deals.length > 0 && (
          <div className="pt-2 text-center">
            <Link
              href="/deals"
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors"
            >
              Alle Deals ohne Filter anzeigen <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

function Chip({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-gray-600 text-xs">{label}:</span>
      <span className="text-gray-300 text-xs font-medium bg-gray-800 px-2 py-0.5 rounded-md">{value}</span>
    </div>
  );
}
