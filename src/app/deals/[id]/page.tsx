import { notFound } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { formatCurrency, formatPercent, getDealScoreBg, getPriceAssessmentColor, getPriceAssessmentLabel, cn } from "@/lib/utils";
import { DealScore, DealScoreBadge } from "@/components/deals/DealScore";
import { PropertyDetailTabs } from "@/components/deals/PropertyDetailTabs";
import { PropertyImageGallery } from "@/components/deals/PropertyImageGallery";
import { MapPin, Home, Calendar, Heart, Share2, ExternalLink } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

function getPortalUrl(portal: string, externalId: string): string {
  const numeric = externalId.replace(/[^0-9]/g, "").slice(0, 9) || "000000";
  switch (portal) {
    case "ImmobilienScout24": return `https://www.immobilienscout24.de/expose/${numeric}`;
    case "Immowelt": return `https://www.immowelt.de/expose/${numeric}`;
    case "Immonet": return `https://www.immonet.de/angebot/${numeric}`;
    case "Kleinanzeigen": return `https://www.kleinanzeigen.de/s-anzeige/${numeric}`;
    default: return "#";
  }
}

export default async function PropertyDetailPage({ params }: PageProps) {
  const { id } = await params;
  const property = MOCK_PROPERTIES.find((p) => p.id === id);
  if (!property) notFound();

  const { analysis } = property;
  const portalUrl = getPortalUrl(property.portal, property.externalId);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title={property.city} />
      <div className="p-3 sm:p-6 max-w-7xl mx-auto w-full space-y-4 sm:space-y-6">
        {/* Hero Section */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="relative">
            <PropertyImageGallery images={property.images} title={property.title} />
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2 z-10">
              <DealScoreBadge score={analysis.dealScore} />
              <span className="bg-gray-800/80 backdrop-blur text-gray-300 text-xs px-2 py-1 rounded-md">{property.portal}</span>
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex gap-2 z-10">
              <button className="bg-gray-800/80 backdrop-blur p-2 rounded-lg text-gray-400 hover:text-red-400 transition-colors">
                <Heart className="w-4 h-4" />
              </button>
              <button className="bg-gray-800/80 backdrop-blur p-2 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="p-3 sm:p-6">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 sm:gap-4">
              <div className="flex-1">
                <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">{property.title}</h1>
                <div className="flex items-center gap-2 text-gray-400 mb-3 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{property.address}, {property.zipCode} {property.city}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-gray-400">
                  <span className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1 rounded-lg text-xs">
                    <Home className="w-3.5 h-3.5" />{property.rooms} Zimmer
                  </span>
                  <span className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1 rounded-lg text-xs">
                    {property.area} m²
                  </span>
                  {property.landArea && (
                    <span className="bg-gray-800 px-2.5 py-1 rounded-lg text-xs">{property.landArea} m² Grund</span>
                  )}
                  <span className="flex items-center gap-1.5 bg-gray-800 px-2.5 py-1 rounded-lg text-xs">
                    <Calendar className="w-3.5 h-3.5" />Bj. {property.yearBuilt}
                  </span>
                  <span className="bg-gray-800 px-2.5 py-1 rounded-lg text-xs">EK {property.energyClass}</span>
                  <span className="bg-gray-800 px-2.5 py-1 rounded-lg text-xs hidden sm:inline-flex">{property.heatingType}</span>
                </div>
              </div>
              <div className="flex flex-row lg:flex-col justify-between lg:justify-start items-end lg:items-end gap-3 lg:gap-2 lg:text-right">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-white">{formatCurrency(property.price)}</p>
                  <p className="text-gray-400 text-sm">{formatCurrency(property.pricePerSqm)}/m²</p>
                  <p className={cn("text-sm font-medium mt-1", getPriceAssessmentColor(analysis.priceAssessment))}>
                    {getPriceAssessmentLabel(analysis.priceAssessment)}
                  </p>
                </div>
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 bg-blue-400/10 hover:bg-blue-400/20 px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Original-Inserat
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Metrics */}
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {[
            { label: "Deal Score", value: analysis.dealScore.toString(), sub: "von 100", color: getDealScoreBg(analysis.dealScore).split(" ")[2] },
            { label: "Brutto­rendite", value: formatPercent(analysis.grossYield), sub: "p.a.", color: "text-blue-400" },
            { label: "Netto­rendite", value: formatPercent(analysis.netYield), sub: "p.a.", color: "text-blue-400" },
            { label: "Cashflow", value: formatCurrency(analysis.cashflow), sub: "/Monat", color: analysis.cashflow >= 0 ? "text-green-400" : "text-red-400" },
            { label: "Cash-on-Cash", value: formatPercent(analysis.cashOnCash), sub: "Return", color: "text-purple-400" },
            { label: "Lage-Score", value: analysis.locationScore.toString(), sub: "von 100", color: "text-amber-400" },
          ].map((metric) => (
            <div key={metric.label} className="bg-gray-900 border border-gray-800 rounded-xl p-2 sm:p-4 text-center">
              <p className={cn("text-base sm:text-xl font-bold", metric.color)}>{metric.value}</p>
              <p className="text-white text-[10px] sm:text-xs font-medium mt-0.5 leading-tight">{metric.label}</p>
              <p className="text-gray-600 text-[10px] sm:text-xs">{metric.sub}</p>
            </div>
          ))}
        </div>

        {/* Detail Tabs */}
        <PropertyDetailTabs property={property} />
      </div>
    </div>
  );
}
