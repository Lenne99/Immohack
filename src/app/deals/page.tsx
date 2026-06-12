"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/Header";
import { DealCard } from "@/components/deals/DealCard";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { SlidersHorizontal, ArrowUpDown } from "lucide-react";

const CITIES = [...new Set(MOCK_PROPERTIES.map((p) => p.city))].sort();

export default function DealsPage() {
  const [minScore, setMinScore] = useState(80);
  const [maxPrice, setMaxPrice] = useState(2000000);
  const [minYield, setMinYield] = useState(4.5);
  const [selectedCity, setSelectedCity] = useState("alle");
  const [sortBy, setSortBy] = useState("score");
  const [showFilters, setShowFilters] = useState(true);

  const filtered = useMemo(() => {
    let result = MOCK_PROPERTIES.filter((p) => {
      if (p.analysis.dealScore < minScore) return false;
      if (p.price > maxPrice) return false;
      if (p.analysis.grossYield < minYield) return false;
      if (selectedCity !== "alle" && p.city !== selectedCity) return false;
      return true;
    });

    switch (sortBy) {
      case "score": result.sort((a, b) => b.analysis.dealScore - a.analysis.dealScore); break;
      case "yield": result.sort((a, b) => b.analysis.grossYield - a.analysis.grossYield); break;
      case "price_asc": result.sort((a, b) => a.price - b.price); break;
      case "price_desc": result.sort((a, b) => b.price - a.price); break;
      case "cashflow": result.sort((a, b) => b.analysis.cashflow - a.analysis.cashflow); break;
    }
    return result;
  }, [minScore, maxPrice, minYield, selectedCity, sortBy]);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Deal Liste" />
      <div className="flex flex-1">
        {/* Filter Sidebar */}
        {showFilters && (
          <aside className="w-64 flex-shrink-0 border-r border-gray-800 p-5 space-y-6">
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Filter</h3>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-2">Min. Deal Score: {minScore}</label>
              <input
                type="range"
                min={0}
                max={90}
                step={5}
                value={minScore}
                onChange={(e) => setMinScore(+e.target.value)}
                className="w-full accent-blue-500"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>0</span><span>90</span>
              </div>
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-2">Max. Preis: {(maxPrice / 1000).toFixed(0)}k €</label>
              <input
                type="range"
                min={100000}
                max={2000000}
                step={50000}
                value={maxPrice}
                onChange={(e) => setMaxPrice(+e.target.value)}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-2">Min. Rendite: {minYield} %</label>
              <input
                type="range"
                min={0}
                max={10}
                step={0.5}
                value={minYield}
                onChange={(e) => setMinYield(+e.target.value)}
                className="w-full accent-blue-500"
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs font-medium block mb-2">Stadt</label>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="alle">Alle Städte</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => { setMinScore(80); setMaxPrice(2000000); setMinYield(4.5); setSelectedCity("alle"); }}
              className="w-full text-gray-400 text-sm hover:text-white transition-colors underline"
            >
              Filter zurücksetzen
            </button>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 p-6">
          {/* Quality banner */}
          <div className="flex items-center gap-2 bg-blue-600/10 border border-blue-600/20 rounded-xl px-4 py-2.5 mb-4 text-sm">
            <span className="text-blue-400 font-semibold">Nur Top-Deals</span>
            <span className="text-gray-500">·</span>
            <span className="text-gray-400">Standardfilter: Score ≥ 80 · Rendite ≥ 4,5 %</span>
            <button onClick={() => { setMinScore(0); setMaxPrice(2000000); setMinYield(0); setSelectedCity("alle"); }} className="ml-auto text-xs text-gray-500 hover:text-white underline transition-colors">Alle anzeigen</button>
          </div>
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:text-white hover:border-gray-600 transition-colors"
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filter
            </button>
            <p className="text-gray-400 text-sm">
              <span className="text-white font-semibold">{filtered.length}</span> Immobilien gefunden
            </p>
            <div className="ml-auto flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-gray-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
              >
                <option value="score">Nach Deal Score</option>
                <option value="yield">Nach Rendite</option>
                <option value="price_asc">Preis aufsteigend</option>
                <option value="price_desc">Preis absteigend</option>
                <option value="cashflow">Nach Cashflow</option>
              </select>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">Keine Immobilien gefunden</p>
              <p className="text-sm mt-2">Bitte Filter anpassen</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((property) => (
                <DealCard key={property.id} property={property} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
