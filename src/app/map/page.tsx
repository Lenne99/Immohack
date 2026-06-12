import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { DealScoreBadge } from "@/components/deals/DealScore";
import { MapPin } from "lucide-react";
import Link from "next/link";

export default function MapPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Kartenansicht" />
      <div className="flex-1 p-6">
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden" style={{ height: "70vh" }}>
          {/* Map placeholder - in production: Mapbox/Leaflet */}
          <div className="relative h-full bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-700 mx-auto mb-4" />
              <h3 className="text-gray-500 font-medium">Interaktive Karte</h3>
              <p className="text-gray-600 text-sm mt-1">Mapbox-Integration für Produktion</p>
              <p className="text-gray-700 text-xs mt-1">{MOCK_PROPERTIES.length} Immobilien mit Koordinaten</p>
            </div>
            {/* Sample pins */}
            {MOCK_PROPERTIES.slice(0, 8).map((p, i) => (
              <div
                key={p.id}
                className="absolute"
                style={{
                  left: `${15 + i * 10}%`,
                  top: `${20 + (i % 3) * 25}%`,
                }}
              >
                <Link href={`/deals/${p.id}`}>
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold cursor-pointer hover:scale-110 transition-transform shadow-lg ${
                    p.analysis.dealScore >= 80 ? "bg-green-500/90 border-green-400 text-white" :
                    p.analysis.dealScore >= 70 ? "bg-amber-500/90 border-amber-400 text-white" :
                    "bg-red-500/90 border-red-400 text-white"
                  }`}>
                    {p.analysis.dealScore}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Property List below map */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {MOCK_PROPERTIES.slice(0, 10).map((p) => (
            <Link key={p.id} href={`/deals/${p.id}`}>
              <div className="bg-gray-900 border border-gray-800 rounded-lg p-3 hover:border-gray-700 transition-colors">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-500 text-xs truncate">{p.city}</span>
                  <DealScoreBadge score={p.analysis.dealScore} />
                </div>
                <p className="text-white text-xs font-medium line-clamp-1">{p.title}</p>
                <p className="text-gray-400 text-xs mt-1">{formatCurrency(p.price)}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
