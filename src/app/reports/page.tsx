import { Header } from "@/components/layout/Header";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { formatCurrency, formatPercent, getDealScoreBg, cn } from "@/lib/utils";
import { FileText, Download, TrendingUp, Building2 } from "lucide-react";
import Link from "next/link";

export default function ReportsPage() {
  const topDeals = [...MOCK_PROPERTIES]
    .sort((a, b) => b.analysis.dealScore - a.analysis.dealScore)
    .slice(0, 10);

  return (
    <div className="flex flex-col min-h-screen">
      <Header title="Reports" />
      <div className="flex-1 p-6 max-w-5xl mx-auto w-full space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Investment Reports</h1>
              <p className="text-gray-500 text-sm">Generierte Analysen und PDF-Exporte</p>
            </div>
          </div>
        </div>

        {/* Report Templates */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { title: "Top 10 Deals Report", desc: "Die besten 10 Immobilien nach Deal Score", icon: TrendingUp, color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
            { title: "Marktbericht", desc: "Marktübersicht aller analysierten Städte", icon: Building2, color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
            { title: "Portfolio-Analyse", desc: "Analyse deiner Favoriten & Watchlist", icon: FileText, color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
          ].map((template) => {
            const Icon = template.icon;
            return (
              <div key={template.title} className={cn("border rounded-xl p-5 cursor-pointer hover:opacity-80 transition-opacity", template.bg)}>
                <Icon className={cn("w-8 h-8 mb-3", template.color)} />
                <h3 className="text-white font-semibold text-sm mb-1">{template.title}</h3>
                <p className="text-gray-500 text-xs mb-4">{template.desc}</p>
                <button className={cn("flex items-center gap-2 text-xs font-medium", template.color)}>
                  <Download className="w-3 h-3" /> PDF generieren
                </button>
              </div>
            );
          })}
        </div>

        {/* Individual Reports */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="p-5 border-b border-gray-800 flex items-center justify-between">
            <h3 className="text-white font-semibold">Einzelberichte</h3>
            <span className="text-gray-500 text-sm">{topDeals.length} Berichte</span>
          </div>
          <div className="divide-y divide-gray-800/50">
            {topDeals.map((property) => (
              <div key={property.id} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-800/20 transition-colors">
                <div className="flex-1 min-w-0">
                  <Link href={`/deals/${property.id}`} className="text-white text-sm font-medium hover:text-blue-400 transition-colors line-clamp-1">
                    {property.title}
                  </Link>
                  <p className="text-gray-500 text-xs mt-0.5">{property.city} · {formatCurrency(property.price)} · {formatPercent(property.analysis.grossYield)} Rendite</p>
                </div>
                <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full border", getDealScoreBg(property.analysis.dealScore))}>
                  {property.analysis.dealScore}
                </span>
                <button className="flex items-center gap-1.5 text-gray-400 hover:text-white text-xs transition-colors">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
