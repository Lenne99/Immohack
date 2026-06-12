import Link from "next/link";
import { MapPin, Home, Calendar, Zap, TrendingUp, TrendingDown } from "lucide-react";
import { cn, formatCurrency, formatPercent, getPriceAssessmentColor, getPriceAssessmentLabel } from "@/lib/utils";
import { DealScoreBadge } from "./DealScore";
import type { Property } from "@/data/mock-properties";

interface DealCardProps {
  property: Property;
}

export function DealCard({ property }: DealCardProps) {
  const { analysis } = property;
  const cashflowPositive = analysis.cashflow >= 0;

  return (
    <Link href={`/deals/${property.id}`}>
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-gray-700 hover:shadow-xl hover:shadow-black/30 transition-all group cursor-pointer">
        {/* Image Placeholder */}
        <div className="h-40 bg-gradient-to-br from-gray-800 to-gray-900 relative flex items-center justify-center">
          <Home className="w-12 h-12 text-gray-700" />
          <div className="absolute top-3 left-3">
            <DealScoreBadge score={analysis.dealScore} />
          </div>
          <div className="absolute top-3 right-3">
            <span className="bg-gray-950/80 backdrop-blur text-gray-300 text-xs px-2 py-1 rounded-md">
              {property.portal}
            </span>
          </div>
          <div className="absolute bottom-3 left-3">
            <span
              className={cn(
                "text-xs font-medium px-2 py-1 rounded-md",
                getPriceAssessmentColor(analysis.priceAssessment),
                "bg-gray-950/80 backdrop-blur"
              )}
            >
              {getPriceAssessmentLabel(analysis.priceAssessment)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="text-white font-medium text-sm line-clamp-2 mb-2 group-hover:text-blue-400 transition-colors">
            {property.title}
          </h3>

          <div className="flex items-center gap-1.5 text-gray-500 text-xs mb-3">
            <MapPin className="w-3 h-3" />
            <span>{property.address}, {property.city}</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
            <span className="flex items-center gap-1">
              <Home className="w-3 h-3" />
              {property.rooms} Zi.
            </span>
            <span>{property.area} m²</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {property.yearBuilt}
            </span>
            <span className="ml-auto font-medium text-gray-400">{property.energyClass}</span>
          </div>

          {/* Price */}
          <div className="flex items-end justify-between mb-3">
            <div>
              <p className="text-xl font-bold text-white">{formatCurrency(property.price)}</p>
              <p className="text-gray-500 text-xs">{formatCurrency(property.pricePerSqm)}/m²</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-blue-400">{formatPercent(analysis.grossYield)}</p>
              <p className="text-gray-500 text-xs">Brutto-Rendite</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-800">
            <div className="text-center">
              <p className={cn("text-sm font-semibold flex items-center justify-center gap-0.5", cashflowPositive ? "text-green-400" : "text-red-400")}>
                {cashflowPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {formatCurrency(analysis.cashflow)}
              </p>
              <p className="text-gray-600 text-xs mt-0.5">Cashflow/Mo</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-300">{formatPercent(analysis.netYield)}</p>
              <p className="text-gray-600 text-xs mt-0.5">Netto</p>
            </div>
            <div className="text-center">
              <p className="text-sm font-semibold text-gray-300">
                <Zap className="w-3 h-3 inline mr-0.5 text-amber-400" />
                {analysis.locationScore}
              </p>
              <p className="text-gray-600 text-xs mt-0.5">Lage-Score</p>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
