import Link from "next/link";
import { MapPin, TrendingUp, Banknote } from "lucide-react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 90 ? "text-green-400 bg-green-400/10 border-green-400/30" :
    score >= 80 ? "text-blue-400 bg-blue-400/10 border-blue-400/30" :
    "text-amber-400 bg-amber-400/10 border-amber-400/30";
  return (
    <span className={cn("text-2xl font-bold tabular-nums px-3 py-1 rounded-lg border", color)}>
      {score}
    </span>
  );
}

export function DealCard({ property }: { property: Property }) {
  const { analysis } = property;
  const cf = analysis.cashflow;

  return (
    <Link href={`/deals/${property.id}`} className="block group">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 hover:-translate-y-0.5 transition-all hover:shadow-xl hover:shadow-black/40">
        {/* Top row: score + portal */}
        <div className="flex items-start justify-between mb-4">
          <ScoreBadge score={analysis.dealScore} />
          <span className="text-gray-600 text-xs bg-gray-800 px-2 py-1 rounded-md">{property.portal}</span>
        </div>

        {/* Title + location */}
        <h3 className="text-white font-semibold text-sm leading-snug mb-1 line-clamp-2 group-hover:text-blue-400 transition-colors">
          {property.title}
        </h3>
        <div className="flex items-center gap-1 text-gray-500 text-xs mb-5">
          <MapPin className="w-3 h-3 flex-shrink-0" />
          <span>{property.city} · {property.area} m² · {property.rooms} Zi.</span>
        </div>

        {/* Key metrics */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <p className="text-gray-500 text-xs mb-0.5">Preis</p>
            <p className="text-white font-bold text-sm tabular-nums">{formatCurrency(property.price)}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0.5 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> Rendite
            </p>
            <p className={cn("font-bold text-sm tabular-nums",
              analysis.grossYield >= 7 ? "text-green-400" :
              analysis.grossYield >= 5 ? "text-blue-400" : "text-gray-300"
            )}>
              {formatPercent(analysis.grossYield)}
            </p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-0.5 flex items-center gap-1">
              <Banknote className="w-3 h-3" /> CF/Mo
            </p>
            <p className={cn("font-bold text-sm tabular-nums", cf >= 0 ? "text-green-400" : "text-red-400")}>
              {cf >= 0 ? "+" : ""}{formatCurrency(cf)}
            </p>
          </div>
        </div>

        {/* Bottom highlight */}
        <div className="mt-4 pt-4 border-t border-gray-800/80">
          <p className="text-xs text-gray-500 line-clamp-1">✦ {property.highlight}</p>
        </div>
      </div>
    </Link>
  );
}
