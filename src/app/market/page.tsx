import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { MarketCharts } from "@/components/charts/MarketCharts";
import { TrendingUp, TrendingDown, Building2, BarChart3 } from "lucide-react";

export default function MarketPage() {
  const cityStats = Object.entries(
    MOCK_PROPERTIES.reduce((acc, p) => {
      if (!acc[p.city]) {
        acc[p.city] = {
          city: p.city,
          count: 0,
          totalPrice: 0,
          totalPricePerSqm: 0,
          totalYield: 0,
          totalScore: 0,
          properties: [],
        };
      }
      acc[p.city].count++;
      acc[p.city].totalPrice += p.price;
      acc[p.city].totalPricePerSqm += p.pricePerSqm;
      acc[p.city].totalYield += p.analysis.grossYield;
      acc[p.city].totalScore += p.analysis.dealScore;
      acc[p.city].properties.push(p);
      return acc;
    }, {} as Record<string, { city: string; count: number; totalPrice: number; totalPricePerSqm: number; totalYield: number; totalScore: number; properties: typeof MOCK_PROPERTIES }>)
  ).map(([, v]) => ({
    city: v.city,
    count: v.count,
    avgPrice: Math.round(v.totalPrice / v.count),
    avgPricePerSqm: Math.round(v.totalPricePerSqm / v.count),
    avgYield: Math.round((v.totalYield / v.count) * 10) / 10,
    avgScore: Math.round(v.totalScore / v.count),
    topDeal: v.properties.sort((a, b) => b.analysis.dealScore - a.analysis.dealScore)[0],
  })).sort((a, b) => b.avgScore - a.avgScore);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Marktübersicht" />
      <div className="flex-1 p-6 space-y-6 max-w-7xl mx-auto w-full">
        {/* Summary KPIs */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Analysierte Immobilien", value: MOCK_PROPERTIES.length.toString(), icon: Building2, color: "text-blue-400", bg: "bg-blue-400/10" },
            { label: "Städte abgedeckt", value: cityStats.length.toString(), icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/10" },
            { label: "Ø Bruttorendite", value: formatPercent(MOCK_PROPERTIES.reduce((s, p) => s + p.analysis.grossYield, 0) / MOCK_PROPERTIES.length), icon: TrendingUp, color: "text-green-400", bg: "bg-green-400/10" },
            { label: "Ø Preis/m²", value: formatCurrency(Math.round(MOCK_PROPERTIES.reduce((s, p) => s + p.pricePerSqm, 0) / MOCK_PROPERTIES.length)), icon: TrendingDown, color: "text-amber-400", bg: "bg-amber-400/10" },
          ].map((kpi) => {
            const Icon = kpi.icon;
            return (
              <div key={kpi.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
                <div className={`w-8 h-8 ${kpi.bg} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className={`w-4 h-4 ${kpi.color}`} />
                </div>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                <p className="text-gray-500 text-xs mt-1">{kpi.label}</p>
              </div>
            );
          })}
        </div>

        {/* Charts */}
        <MarketCharts cityStats={cityStats} />

        {/* City Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-800">
            <h3 className="text-white font-semibold">Städtevergleich</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left text-xs text-gray-500 font-medium px-5 py-3">Stadt</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Objekte</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Ø Preis</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Ø €/m²</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Ø Rendite</th>
                  <th className="text-right text-xs text-gray-500 font-medium px-4 py-3">Ø Score</th>
                </tr>
              </thead>
              <tbody>
                {cityStats.map((stat) => (
                  <tr key={stat.city} className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors">
                    <td className="px-5 py-3 text-white font-medium text-sm">{stat.city}</td>
                    <td className="px-4 py-3 text-right text-gray-400 text-sm">{stat.count}</td>
                    <td className="px-4 py-3 text-right text-gray-300 text-sm">{formatCurrency(stat.avgPrice)}</td>
                    <td className="px-4 py-3 text-right text-gray-300 text-sm">{formatCurrency(stat.avgPricePerSqm)}</td>
                    <td className="px-4 py-3 text-right text-blue-400 text-sm font-medium">{formatPercent(stat.avgYield)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`text-sm font-bold ${stat.avgScore >= 80 ? "text-green-400" : stat.avgScore >= 70 ? "text-amber-400" : "text-red-400"}`}>
                        {stat.avgScore}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
