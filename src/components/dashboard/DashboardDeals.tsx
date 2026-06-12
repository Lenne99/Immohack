"use client";

import { useSettings } from "@/lib/settings-context";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { DealScoreBadge } from "@/components/deals/DealScore";
import Link from "next/link";
import { ArrowUpRight, Rocket } from "lucide-react";
import { RegionBanner } from "./RegionBanner";

export function DashboardDeals() {
  const { activeRegionFilter, settings } = useSettings();

  const filtered =
    activeRegionFilter.length > 0
      ? MOCK_PROPERTIES.filter((p) => activeRegionFilter.includes(p.city))
      : MOCK_PROPERTIES;

  const sorted = [...filtered].sort((a, b) => b.analysis.dealScore - a.analysis.dealScore);
  const topDeals = sorted.slice(0, 5);

  const starterDeals = [...filtered]
    .filter((p) => p.price <= 150000)
    .sort((a, b) => b.analysis.dealScore - a.analysis.dealScore)
    .slice(0, 4);

  return (
    <div className="space-y-4">
      <RegionBanner />

      {filtered.length === 0 && (
        <div className="bg-amber-600/10 border border-amber-600/20 rounded-xl px-4 py-3 text-sm text-amber-400">
          Keine Immobilien für die gewählte Region gefunden. Bitte{" "}
          <Link href="/settings" className="underline hover:text-amber-300">
            Region anpassen
          </Link>
          .
        </div>
      )}

      {/* Top Deals Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-800">
          <h3 className="text-white font-semibold">Top Deals heute</h3>
          <Link href="/deals" className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1">
            Alle anzeigen <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
        {topDeals.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Immobilie</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Preis</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Rendite</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Cashflow</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Score</th>
                </tr>
              </thead>
              <tbody>
                {topDeals.map((property) => (
                  <tr key={property.id} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <Link href={`/deals/${property.id}`}>
                        <p className="text-white text-sm font-medium hover:text-blue-400 transition-colors line-clamp-1">{property.title}</p>
                        <p className="text-gray-500 text-xs">{property.city} · {property.area} m² · {property.rooms} Zi.</p>
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-white text-sm font-medium">{formatCurrency(property.price)}</p>
                      <p className="text-gray-500 text-xs">{formatCurrency(property.pricePerSqm)}/m²</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className="text-blue-400 text-sm font-medium">{formatPercent(property.analysis.grossYield)}</p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <p className={`text-sm font-medium ${property.analysis.cashflow >= 0 ? "text-green-400" : "text-red-400"}`}>
                        {formatCurrency(property.analysis.cashflow)}/Mo
                      </p>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DealScoreBadge score={property.analysis.dealScore} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 text-sm px-5 py-4">Keine Deals für diese Region gefunden.</p>
        )}
      </div>

      {/* Starter Deals */}
      {starterDeals.length > 0 && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-800">
            <div className="flex items-center gap-2">
              <Rocket className="w-4 h-4 text-green-400" />
              <h3 className="text-white font-semibold">Top Einstiegs-Deals ≤ 150k</h3>
            </div>
            <Link href="/starter" className="text-green-400 text-sm hover:text-green-300 transition-colors flex items-center gap-1">
              Alle <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="divide-y divide-gray-800/50">
            {starterDeals.map((p) => (
              <Link key={p.id} href={`/deals/${p.id}`}>
                <div className="flex items-center gap-3 px-5 py-3 hover:bg-gray-800/30 transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium line-clamp-1 hover:text-green-400 transition-colors">{p.title}</p>
                    <p className="text-gray-500 text-xs">{p.city} · {formatCurrency(p.price)}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-green-400 text-sm font-semibold">{formatPercent(p.analysis.grossYield)}</p>
                    <p className="text-gray-600 text-xs">Rendite</p>
                  </div>
                  <DealScoreBadge score={p.analysis.dealScore} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
