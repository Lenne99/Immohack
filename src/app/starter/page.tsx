import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES, GROWTH_MARKETS } from "@/data/mock-properties";
import { DealCard } from "@/components/deals/DealCard";
import { formatCurrency, formatPercent, cn } from "@/lib/utils";
import { TrendingUp, Rocket, MapPin, Euro, Target, ArrowUpRight, Star } from "lucide-react";
import Link from "next/link";

export default function StarterPage() {
  // Deals unter 150k, nach Score sortiert
  const starterDeals = [...MOCK_PROPERTIES]
    .filter((p) => p.price <= 150000)
    .sort((a, b) => b.analysis.dealScore - a.analysis.dealScore);

  // Deals 150k–300k als "nächste Stufe"
  const nextLevelDeals = [...MOCK_PROPERTIES]
    .filter((p) => p.price > 150000 && p.price <= 300000)
    .sort((a, b) => b.analysis.dealScore - a.analysis.dealScore)
    .slice(0, 4);

  const avgStarterYield = starterDeals.reduce((s, p) => s + p.analysis.grossYield, 0) / starterDeals.length;
  const positiveCashflowCount = starterDeals.filter((p) => p.analysis.cashflow > 0).length;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Einstieg für Kleinanleger" />
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full space-y-8">

        {/* Hero */}
        <div className="bg-gradient-to-r from-blue-600/20 via-blue-600/10 to-transparent border border-blue-600/30 rounded-2xl p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-600/30 rounded-xl flex items-center justify-center flex-shrink-0">
              <Rocket className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-white mb-1">Einstieg leicht gemacht</h1>
              <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
                Große Deals haben alle — wir zeigen dir, wo du mit kleinem Kapital wirklich einsteigen kannst.
                Alle Objekte unter 150.000 € mit positivem Cashflow-Potenzial, in aufstrebenden Märkten.
              </p>
              <div className="flex flex-wrap gap-4 mt-4">
                <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-xl font-bold text-green-400">{starterDeals.length}</p>
                  <p className="text-gray-500 text-xs">Deals ≤ 150k</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-xl font-bold text-blue-400">{formatPercent(avgStarterYield)}</p>
                  <p className="text-gray-500 text-xs">Ø Rendite</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-xl font-bold text-amber-400">{positiveCashflowCount}/{starterDeals.length}</p>
                  <p className="text-gray-500 text-xs">Positiver Cashflow</p>
                </div>
                <div className="bg-gray-900/80 border border-gray-700 rounded-lg px-4 py-2 text-center">
                  <p className="text-xl font-bold text-purple-400">{formatCurrency(Math.min(...starterDeals.map(p => p.price)))}</p>
                  <p className="text-gray-500 text-xs">Günstigstes Objekt</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wachstumsmärkte */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h2 className="text-white font-bold text-lg">Wachstumsmärkte</h2>
              <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-2 py-0.5 rounded-full">KI-Analyse</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {GROWTH_MARKETS.map((market) => (
              <div key={market.city} className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-green-500/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-white font-semibold">{market.city}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className={cn(
                      "w-2 h-2 rounded-full animate-pulse",
                      market.score >= 90 ? "bg-green-400" : market.score >= 80 ? "bg-blue-400" : "bg-amber-400"
                    )} />
                    <span className={cn(
                      "text-xs font-medium",
                      market.score >= 90 ? "text-green-400" : market.score >= 80 ? "text-blue-400" : "text-amber-400"
                    )}>{market.trend}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center">
                    <p className="text-lg font-bold text-white">{market.score}</p>
                    <p className="text-gray-600 text-xs">Markt-Score</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-green-400">+{market.growth}%</p>
                    <p className="text-gray-600 text-xs">Bev.wachstum</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-bold text-blue-400">{formatPercent(market.avgYield)}</p>
                    <p className="text-gray-600 text-xs">Ø Rendite</p>
                  </div>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{market.reason}</p>
                <Link href={`/deals?city=${encodeURIComponent(market.city)}`}
                  className="mt-3 flex items-center gap-1 text-blue-400 text-xs hover:text-blue-300 transition-colors">
                  Deals in {market.city} <ArrowUpRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Beste Einstiegs-Deals ≤150k */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Euro className="w-5 h-5 text-amber-400" />
            <h2 className="text-white font-bold text-lg">Beste Deals unter 150.000 €</h2>
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs px-2 py-0.5 rounded-full">
              {starterDeals.length} Objekte
            </span>
          </div>
          {starterDeals.length === 0 ? (
            <p className="text-gray-500 text-center py-10">Keine Deals in diesem Preissegment gefunden.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {starterDeals.map((property) => (
                <DealCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>

        {/* Nächste Stufe 150–300k */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-purple-400" />
            <h2 className="text-white font-bold text-lg">Nächste Stufe: 150.000 – 300.000 €</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {nextLevelDeals.map((property) => (
              <DealCard key={property.id} property={property} />
            ))}
          </div>
        </div>

        {/* Einstiegs-Guide */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-white font-bold mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-400" />
            Einstiegsstrategie für Kleinanleger
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "01",
                title: "Klein anfangen, Cash-Flow zuerst",
                desc: "Starte mit einem Objekt unter 80k. Wichtiger als Wertsteigerung ist positiver Cashflow von Monat 1. Auch 50–100 €/Monat bauen Vermögen auf.",
                color: "text-green-400",
                bg: "bg-green-500/10 border-green-500/20",
              },
              {
                step: "02",
                title: "Wachstumsmärkte bevorzugen",
                desc: "Leipzig, Dresden, Potsdam, Erfurt bieten noch günstige Preise bei stark wachsender Nachfrage. Heute günstig kaufen, in 5 Jahren profitieren.",
                color: "text-blue-400",
                bg: "bg-blue-500/10 border-blue-500/20",
              },
              {
                step: "03",
                title: "Eigenkapital aufbauen & reinvestieren",
                desc: "Mit dem ersten Objekt Eigenkapital durch Tilgung aufbauen. Nach 3–5 Jahren für zweites Objekt nutzen. So entsteht ein Portfolio.",
                color: "text-purple-400",
                bg: "bg-purple-500/10 border-purple-500/20",
              },
            ].map((item) => (
              <div key={item.step} className={cn("border rounded-xl p-4", item.bg)}>
                <p className={cn("text-3xl font-black mb-2 opacity-40", item.color)}>{item.step}</p>
                <h4 className="text-white font-semibold text-sm mb-2">{item.title}</h4>
                <p className="text-gray-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
