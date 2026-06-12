import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { formatCurrency, formatPercent, getDealScoreBg, getPriceAssessmentColor, getPriceAssessmentLabel, cn } from "@/lib/utils";
import { DealScore, DealScoreBadge } from "@/components/deals/DealScore";
import { PropertyDetailTabs } from "@/components/deals/PropertyDetailTabs";
import { MapPin, Home, Calendar, Zap, Heart, Share2, TrendingUp, TrendingDown, Building, AlertTriangle, CheckCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = MOCK_PROPERTIES.find((p) => p.id === id);
  if (!property) notFound();

  const { analysis } = property;

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={property.city} />
      <div className="p-6 max-w-7xl mx-auto w-full space-y-6">
        {/* Hero Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="h-56 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-950 flex items-center justify-center relative">
            <Building className="w-20 h-20 text-gray-700" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <DealScoreBadge score={analysis.dealScore} />
              <span className="bg-gray-800/80 backdrop-blur text-gray-300 text-xs px-2 py-1 rounded-md">{property.portal}</span>
            </div>
            <div className="absolute top-4 right-4 flex gap-2">
              <button className="bg-gray-800/80 backdrop-blur p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="bg-gray-800/80 backdrop-blur p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-white mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-400 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span>{property.address}, {property.zipCode} {property.city}</span>
                </div>
                <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                  <span className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg">
                    <Home className="w-4 h-4" />{property.rooms} Zimmer
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg">
                    {property.area} m² Wohnfläche
                  </span>
                  {property.landArea && (
                    <span className="bg-gray-800 px-3 py-1.5 rounded-lg">{property.landArea} m² Grundstück</span>
                  )}
                  <span className="flex items-center gap-1.5 bg-gray-800 px-3 py-1.5 rounded-lg">
                    <Calendar className="w-4 h-4" />Baujahr {property.yearBuilt}
                  </span>
                  <span className="bg-gray-800 px-3 py-1.5 rounded-lg">Energie: {property.energyClass}</span>
                  <span className="bg-gray-800 px-3 py-1.5 rounded-lg">{property.heatingType}</span>
                </div>
              </div>
              <div className="lg:text-right">
                <p className="text-3xl font-bold text-white">{formatCurrency(property.price)}</p>
                <p className="text-gray-400 text-sm">{formatCurrency(property.pricePerSqm)}/m²</p>
                <p className={cn("text-sm font-medium mt-1", getPriceAssessmentColor(analysis.priceAssessment))}>
                  {getPriceAssessmentLabel(analysis.priceAssessment)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { label: "Deal Score", value: analysis.dealScore.toString(), sub: "von 100", color: getDealScoreBg(analysis.dealScore).split(" ")[2] },
            { label: "Bruttorendite", value: formatPercent(analysis.grossYield), sub: "p.a.", color: "text-blue-400" },
            { label: "Nettorendite", value: formatPercent(analysis.netYield), sub: "p.a.", color: "text-blue-400" },
            { label: "Cashflow", value: formatCurrency(analysis.cashflow), sub: "pro Monat", color: analysis.cashflow >= 0 ? "text-green-400" : "text-red-400" },
            { label: "Cash-on-Cash", value: formatPercent(analysis.cashOnCash), sub: "Return", color: "text-purple-400" },
            { label: "Lage-Score", value: analysis.locationScore.toString(), sub: "von 100", color: "text-amber-400" },
          ].map((metric) => (
            <div key={metric.label} className="bg-gray-900 border border-gray-800 rounded-xl p-4 text-center">
              <p className={cn("text-xl font-bold", metric.color)}>{metric.value}</p>
              <p className="text-white text-xs font-medium mt-0.5">{metric.label}</p>
              <p className="text-gray-600 text-xs">{metric.sub}</p>
            </div>
          ))}
        </div>

        {/* Detail Tabs */}
        <PropertyDetailTabs property={property} />
      </div>
    </div>
  );
}
