import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES, GROWTH_MARKETS } from "@/data/mock-properties";
import { formatCurrency, formatPercent, getDealScoreBg, cn } from "@/lib/utils";
import { DealScoreBadge } from "@/components/deals/DealScore";
import { DashboardCharts } from "@/components/charts/DashboardCharts";
import { TrendingUp, Building2, Zap, Target, ArrowUpRight, ArrowDownRight, Rocket, MapPin } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const sorted = [...MOCK_PROPERTIES].sort((a, b) => b.analysis.dealScore - a.analysis.dealScore);
  const topDeals = sorted.slice(0, 5);
  const avgScore = Math.round(MOCK_PROPERTIES.reduce((s, p) => s + p.analysis.dealScore, 0) / MOCK_PROPERTIES.length);
  const topOpportunities = MOCK_PROPERTIES.filter((p) => p.analysis.dealScore >= 80).length;
  const avgYield = MOCK_PROPERTIES.reduce((s, p) => s + p.analysis.grossYield, 0) / MOCK_PROPERTIES.length;

  const scoreDistribution = [
    { label: "90-100", count: MOCK_PROPERTIES.filter((p) => p.analysis.dealScore >= 90).length, color: "bg-green-500" },
    { label: "80-89", count: MOCK_PROPERTIES.filter((p) => p.analysis.dealScore >= 80 && p.analysis.dealScore < 90).length, color: "bg-emerald-500" },
    { label: "70-79", count: MOCK_PROPERTIES.filter((p) => p.analysis.dealScore >= 70 && p.analysis.dealScore < 80).length, color: "bg-amber-500" },
    { label: "60-69", count: MOCK_PROPERTIES.filter((p) => p.analysis.dealScore >= 60 && p.analysis.dealScore < 70).length, color: "bg-orange-500" },
    { label: "<60", count: MOCK_PROPERTIES.filter((p) => p.analysis.dealScore < 60).length, color: "bg-red-500" },
  ];

  const kpis = [
    {
      title: "Analysierte Immobilien",
      value: "5.247",
      change: "+23 heute",
      positive: true,
      icon: Building2,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Top Chancen (Score ≥80)",
      value: topOpportunities.toString(),
      change: "+3 neu",
      positive: true,
      icon: Target,
      color: "text-green-400",
      bg: "bg-green-400/10",
    },
    {
      title: "Durchschnittlicher Score",
      value: avgScore.toString(),
      change: "+2.1 vs. letzte Woche",
      positive: true,
      icon: Zap,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
    {
      title: "Ø Bruttorendite",
      value: formatPercent(avgYield),
      change: "-0.2% vs. letzten Monat",
      positive: false,
      icon: TrendingUp,
      color: "text-purple-400",
      bg: "bg-purple-400/10",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Dashboard" />
      <div className="flex-1 p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.title} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-gray-400 text-sm">{kpi.title}</p>
                  <div className={`w-10 h-10 ${kpi.bg} rounded-lg flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${kpi.color}`} />
                  </div>
                </div>
                <p className="text-2xl font-bold text-white mb-1">{kpi.value}</p>
                <p className={`text-xs flex items-center gap-1 ${kpi.positive ? "text-green-400" : "text-red-400"}`}>
                  {kpi.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                  {kpi.change}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Deals Table */}
          <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="text-white font-semibold">Top Deals heute</h3>
              <Link href="/deals" className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1">
                Alle anzeigen <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
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
          </div>

          {/* Score Distribution */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-semibold mb-4">Deal Score Verteilung</h3>
            <div className="space-y-3">
              {scoreDistribution.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-400 text-sm">Score {item.label}</span>
                    <span className="text-white text-sm font-medium">{item.count}</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all`}
                      style={{ width: `${(item.count / MOCK_PROPERTIES.length) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-800">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 text-center">
                  <p className="text-green-400 text-xl font-bold">{topOpportunities}</p>
                  <p className="text-gray-500 text-xs mt-1">Top Chancen</p>
                </div>
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-center">
                  <p className="text-blue-400 text-xl font-bold">{avgScore}</p>
                  <p className="text-gray-500 text-xs mt-1">Ø Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <DashboardCharts properties={MOCK_PROPERTIES} />

        {/* Einstieg & Wachstumsmärkte */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Beste Starter-Deals */}
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
              {[...MOCK_PROPERTIES].filter(p => p.price <= 150000).sort((a,b) => b.analysis.dealScore - a.analysis.dealScore).slice(0,4).map((p) => (
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

          {/* Wachstumsmärkte */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                <h3 className="text-white font-semibold">Wachstumsmärkte</h3>
              </div>
              <Link href="/market" className="text-blue-400 text-sm hover:text-blue-300 transition-colors flex items-center gap-1">
                Alle <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="divide-y divide-gray-800/50">
              {GROWTH_MARKETS.slice(0,4).map((m) => (
                <div key={m.city} className="flex items-center gap-3 px-5 py-3">
                  <MapPin className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium">{m.city}</p>
                    <p className="text-gray-500 text-xs line-clamp-1">{m.reason}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={cn("text-sm font-bold", m.score >= 90 ? "text-green-400" : m.score >= 80 ? "text-blue-400" : "text-amber-400")}>{m.score}</p>
                    <p className="text-gray-600 text-xs">Score</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-green-400 text-xs font-medium">+{m.growth}%</p>
                    <p className="text-gray-600 text-xs">Wachstum</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Zuletzt analysiert</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {MOCK_PROPERTIES.slice(0, 4).map((property) => (
              <Link key={property.id} href={`/deals/${property.id}`}>
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-3 hover:border-gray-600 transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-500 text-xs">{property.portal}</span>
                    <DealScoreBadge score={property.analysis.dealScore} />
                  </div>
                  <p className="text-white text-sm font-medium line-clamp-1 mb-1">{property.city}</p>
                  <p className="text-gray-400 text-xs">{formatCurrency(property.price)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
