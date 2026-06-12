import Link from "next/link";
import { MapPin, Home } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import { DealScoreBadge } from "./DealScore";
import type { Property } from "@/data/mock-properties";

export function DealCard({ property }: { property: Property }) {
  const { analysis } = property;
  const cashflowPositive = analysis.cashflow >= 0;
  const isTop = analysis.dealScore >= 91;
  const isHot = analysis.dealScore >= 85;

  return (
    <Link href={`/deals/${property.id}`}>
      <div className={cn(
        "bg-gray-900 border rounded-xl overflow-hidden transition-all group cursor-pointer hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5",
        isTop ? "border-green-500/40 hover:border-green-400/70" :
        isHot ? "border-blue-500/30 hover:border-blue-400/60" :
        "border-gray-800 hover:border-gray-700"
      )}>
        {/* Image area */}
        <div className="h-36 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center overflow-hidden">
          <Home className="w-10 h-10 text-gray-700" />

          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <DealScoreBadge score={analysis.dealScore} />
            {isTop && <span className="text-sm">🔥</span>}
          </div>

          <div className="absolute top-3 right-3">
            <span className="bg-gray-950/80 text-gray-400 text-xs px-2 py-0.5 rounded-md">
              {property.portal}
            </span>
          </div>

          {/* Highlight-Banner */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-gray-950 to-transparent px-3 pt-4 pb-2">
            <p className={cn(
              "text-xs font-bold leading-snug",
              isTop ? "text-green-400" : isHot ? "text-blue-400" : "text-amber-400"
            )}>
              ✦ {property.highlight}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm line-clamp-1 mb-1.5 group-hover:text-blue-400 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{property.city} · {property.area} m² · {property.rooms} Zi. · BJ {property.yearBuilt}</span>
          </div>

          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xl font-bold text-white tabular-nums">{formatCurrency(property.price)}</p>
              <p className="text-gray-500 text-xs">{formatCurrency(property.pricePerSqm)}/m²</p>
            </div>
            <div className="text-right">
              <p className={cn(
                "text-lg font-bold tabular-nums",
                analysis.grossYield >= 7 ? "text-green-400" :
                analysis.grossYield >= 5 ? "text-blue-400" : "text-gray-300"
              )}>
                {formatPercent(analysis.grossYield)}
              </p>
              <p className="text-gray-500 text-xs">Bruttorendite</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-1.5 pt-3 border-t border-gray-800">
            <div className="text-center bg-gray-800/50 rounded-lg py-2">
              <p className={cn("text-sm font-bold tabular-nums", cashflowPositive ? "text-green-400" : "text-red-400")}>
                {formatCurrency(analysis.cashflow)}
              </p>
              <p className="text-gray-600 text-xs mt-0.5">CF/Mo</p>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg py-2">
              <p className="text-sm font-bold text-gray-200 tabular-nums">{formatPercent(analysis.netYield)}</p>
              <p className="text-gray-600 text-xs mt-0.5">Netto</p>
            </div>
            <div className="text-center bg-gray-800/50 rounded-lg py-2">
              <p className={cn("text-sm font-bold tabular-nums", analysis.locationScore >= 75 ? "text-amber-400" : "text-gray-400")}>
                {analysis.locationScore}
              </p>
              <p className="text-gray-600 text-xs mt-0.5">Lage</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
