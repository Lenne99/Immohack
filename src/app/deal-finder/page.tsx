"use client";

import { useState } from "react";
import { Header } from "@/components/layout/Header";
import { DealCard } from "@/components/deals/DealCard";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { formatCurrency } from "@/lib/utils";
import { Zap, Search, SlidersHorizontal } from "lucide-react";

const CITIES = [...new Set(MOCK_PROPERTIES.map((p) => p.city))].sort();

interface SearchCriteria {
  budget: number;
  equity: number;
  targetYield: number;
  minCashflow: number;
  regions: string[];
  riskProfile: "CONSERVATIVE" | "BALANCED" | "AGGRESSIVE";
  minDealScore: number;
}

export default function DealFinderPage() {
  const [criteria, setCriteria] = useState<SearchCriteria>({
    budget: 600000,
    equity: 120000,
    targetYield: 4.0,
    minCashflow: -500,
    regions: [],
    riskProfile: "BALANCED",
    minDealScore: 70,
  });
  const [results, setResults] = useState<typeof MOCK_PROPERTIES | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      const filtered = MOCK_PROPERTIES.filter((p) => {
        if (p.price > criteria.budget) return false;
        if (p.analysis.grossYield < criteria.targetYield) return false;
        if (p.analysis.cashflow < criteria.minCashflow) return false;
        if (p.analysis.dealScore < criteria.minDealScore) return false;
        if (criteria.regions.length > 0 && !criteria.regions.includes(p.city)) return false;
        if (criteria.riskProfile === "CONSERVATIVE" && p.analysis.renovationRisk > 40) return false;
        if (criteria.riskProfile === "AGGRESSIVE" && p.analysis.dealScore < 60) return false;
        return true;
      }).sort((a, b) => b.analysis.dealScore - a.analysis.dealScore);
      setResults(filtered);
      setIsSearching(false);
    }, 800);
  };

  const toggleRegion = (city: string) => {
    setCriteria((prev) => ({
      ...prev,
      regions: prev.regions.includes(city)
        ? prev.regions.filter((r) => r !== city)
        : [...prev.regions, city],
    }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Deal Finder" />
      <div className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center">
              <Zap className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">KI Deal Finder</h1>
              <p className="text-gray-500 text-sm">Definiere deine Kriterien – wir finden die passenden Immobilien</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Criteria Form */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-5 space-y-5 sticky top-6">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-blue-400" />
                Investment-Kriterien
              </h3>

              <div>
                <label className="text-gray-400 text-xs font-medium block mb-1">
                  Budget: {formatCurrency(criteria.budget)}
                </label>
                <input type="range" min={100000} max={2000000} step={50000} value={criteria.budget}
                  onChange={(e) => setCriteria((p) => ({ ...p, budget: +e.target.value }))}
                  className="w-full accent-blue-500" />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium block mb-1">
                  Eigenkapital: {formatCurrency(criteria.equity)}
                </label>
                <input type="range" min={20000} max={500000} step={10000} value={criteria.equity}
                  onChange={(e) => setCriteria((p) => ({ ...p, equity: +e.target.value }))}
                  className="w-full accent-blue-500" />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium block mb-1">
                  Zielrendite (min.): {criteria.targetYield} %
                </label>
                <input type="range" min={0} max={12} step={0.5} value={criteria.targetYield}
                  onChange={(e) => setCriteria((p) => ({ ...p, targetYield: +e.target.value }))}
                  className="w-full accent-blue-500" />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium block mb-1">
                  Min. Cashflow: {formatCurrency(criteria.minCashflow)}/Mo
                </label>
                <input type="range" min={-2000} max={1000} step={100} value={criteria.minCashflow}
                  onChange={(e) => setCriteria((p) => ({ ...p, minCashflow: +e.target.value }))}
                  className="w-full accent-blue-500" />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium block mb-1">
                  Min. Deal Score: {criteria.minDealScore}
                </label>
                <input type="range" min={0} max={90} step={5} value={criteria.minDealScore}
                  onChange={(e) => setCriteria((p) => ({ ...p, minDealScore: +e.target.value }))}
                  className="w-full accent-blue-500" />
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium block mb-2">Risikoprofil</label>
                <div className="grid grid-cols-3 gap-1">
                  {(["CONSERVATIVE", "BALANCED", "AGGRESSIVE"] as const).map((profile) => (
                    <button
                      key={profile}
                      onClick={() => setCriteria((p) => ({ ...p, riskProfile: profile }))}
                      className={`py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        criteria.riskProfile === profile
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      {profile === "CONSERVATIVE" ? "Konservativ" : profile === "BALANCED" ? "Ausgewogen" : "Aggressiv"}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs font-medium block mb-2">Regionen (optional)</label>
                <div className="flex flex-wrap gap-1.5">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => toggleRegion(city)}
                      className={`px-2.5 py-1 rounded-full text-xs transition-colors ${
                        criteria.regions.includes(city)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:text-white"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {isSearching ? (
                  <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Suche läuft...</>
                ) : (
                  <><Search className="w-4 h-4" /> Jetzt suchen</>
                )}
              </button>
            </div>
          </div>

          {/* Results */}
          <div className="lg:col-span-2">
            {results === null ? (
              <div className="h-full flex items-center justify-center text-center py-20">
                <div>
                  <div className="w-16 h-16 bg-blue-600/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-white font-semibold text-lg mb-2">Bereit zum Suchen</h3>
                  <p className="text-gray-500 text-sm max-w-sm">
                    Stelle deine Investitionskriterien ein und starte die KI-gestützte Suche in {MOCK_PROPERTIES.length} analysierten Immobilien.
                  </p>
                </div>
              </div>
            ) : (
              <div>
                <div className="bg-blue-600/10 border border-blue-600/20 rounded-xl p-4 mb-5">
                  <p className="text-white font-semibold">
                    Von {MOCK_PROPERTIES.length} analysierten Immobilien erfüllen{" "}
                    <span className="text-blue-400">{results.length}</span> deine Kriterien
                  </p>
                  <p className="text-gray-400 text-sm mt-1">Sortiert nach Deal Score</p>
                </div>
                {results.length === 0 ? (
                  <div className="text-center py-16 text-gray-500">
                    <p>Keine passenden Immobilien gefunden.</p>
                    <p className="text-sm mt-1">Passe deine Kriterien an.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {results.map((property) => (
                      <DealCard key={property.id} property={property} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
