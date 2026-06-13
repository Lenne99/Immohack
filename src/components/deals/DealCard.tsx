import Link from "next/link";
import { MapPin, TrendingUp, Banknote, Building } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-green-400 bg-green-400/10 border-green-400/30" :
    score >= 80 ? "text-blue-400 bg-blue-400/10 border-blue-400/30" :
    "text-amber-400 bg-amber-400/10 border-amber-400/30";
  return (
    <span className={cn("text-xl font-bold tabular-nums px-2.5 py-1 rounded-lg border", color)}>
      {score}
    </span>
  );
}

export function DealCard({ property }: { property: Property }) {
  const { analysis } = property;
  const cf = analysis.cashflow;
  const hasImage = property.images && property.images.length > 0;

  return (
    <Link href={`/deals/${property.id}`} className="block group">
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:-translate-y-0.5 transition-all hover:shadow-xl hover:shadow-black/40">
        {/* Image or gradient header */}
        <div className="relative h-36 overflow-hidden">
          {hasImage ? (
            <img
              src={property.images[0]}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-850 to-gray-900 flex items-center justify-center">
              <Building className="w-10 h-10 text-gray-700" />
            </div>
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          {/* Score badge pinned over image */}
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <ScoreBadge score={analysis.dealScore} />
          </div>
          {/* Portal badge */}
          <span className="absolute top-2 right-2 text-gray-400 text-[10px] bg-gray-900/80 backdrop-blur px-2 py-0.5 rounded-md">
            {property.portal}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title + location */}
          <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span>{property.city} · {property.area} m² · {property.rooms} Zi. · Bj. {property.yearBuilt}</span>
          </div>

          {/* Key metrics */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800/60 rounded-lg p-2 text-center">
              <p className="text-gray-500 text-[10px] mb-0.5">Preis</p>
              <p className="text-white font-bold text-xs tabular-nums">{formatCurrency(property.price)}</p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-2 text-center">
              <p className="text-gray-500 text-[10px] mb-0.5 flex items-center justify-center gap-0.5">
                <TrendingUp className="w-2.5 h-2.5" /> Rendite
              </p>
              <p className={cn("font-bold text-xs tabular-nums",
                analysis.grossYield >= 7 ? "text-green-400" :
                analysis.grossYield >= 5 ? "text-blue-400" : "text-gray-300"
              )}>
                {formatPercent(analysis.grossYield)}
              </p>
            </div>
            <div className="bg-gray-800/60 rounded-lg p-2 text-center">
              <p className="text-gray-500 text-[10px] mb-0.5 flex items-center justify-center gap-0.5">
                <Banknote className="w-2.5 h-2.5" /> CF/Mo
              </p>
              <p className={cn("font-bold text-xs tabular-nums", cf >= 0 ? "text-green-400" : "text-red-400")}>
                {cf >= 0 ? "+" : ""}{formatCurrency(cf)}
              </p>
            </div>
          </div>

          {/* Highlight */}
          <div className="mt-3 pt-3 border-t border-gray-800/60">
            <p className="text-[11px] text-gray-500 line-clamp-1">✦ {property.highlight}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
