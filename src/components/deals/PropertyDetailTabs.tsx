"use client";

import { useState } from "react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";
import { PrognosisChart } from "@/components/charts/PrognosisChart";
import { PropertyCalculator } from "@/components/deals/PropertyCalculator";
import { PropertyInspector } from "@/components/deals/PropertyInspector";
import { CheckCircle, AlertTriangle, TrendingUp, MapPin, FileText, BarChart3 } from "lucide-react";

const TABS = [
  { id: "overview", label: "Übersicht" },
  { id: "inspector", label: "🔍 Objektanalyse" },
  { id: "calculator", label: "🧮 Kalkulator" },
  { id: "finance", label: "Finanzanalyse" },
  { id: "location", label: "Lageanalyse" },
  { id: "prognosis", label: "Prognose" },
  { id: "report", label: "KI-Bericht" },
];

export function PropertyDetailTabs({ property }: { property: Property }) {
  const [activeTab, setActiveTab] = useState("overview");
  const [inspectorSubTab, setInspectorSubTab] = useState<"sanierung" | "mietpotenzial" | "weg">("sanierung");
  const { analysis } = property;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex border-b border-gray-800 overflow-x-auto">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "px-5 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2",
              activeTab === tab.id
                ? "text-blue-400 border-blue-500 bg-blue-500/5"
                : "text-gray-400 border-transparent hover:text-white hover:border-gray-700"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">
        {activeTab === "inspector" && (
          <PropertyInspector
            property={property}
            activeSubTab={inspectorSubTab}
            onSubTabChange={setInspectorSubTab}
          />
        )}

        {activeTab === "calculator" && (
          <PropertyCalculator property={property} />
        )}

        {activeTab === "overview" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-white font-semibold mb-3">Beschreibung</h3>
              <p className="text-gray-400 leading-relaxed">{property.description}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Objektdaten</h3>
                <div className="space-y-2">
                  {[
                    ["Typ", property.type === "APARTMENT" ? "Wohnung" : property.type === "HOUSE" ? "Haus" : "Gewerbe"],
                    ["Wohnfläche", `${property.area} m²`],
                    ["Grundstück", property.landArea ? `${property.landArea} m²` : "–"],
                    ["Zimmer", property.rooms.toString()],
                    ["Baujahr", property.yearBuilt.toString()],
                    ["Energieklasse", property.energyClass],
                    ["Heizung", property.heatingType],
                    ["Kaltmiete", `${formatCurrency(property.monthlyRent)}/Monat`],
                    ["Hausgeld", `${formatCurrency(property.hausgeld)}/Monat`],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gray-800/50">
                      <span className="text-gray-500 text-sm">{label}</span>
                      <span className="text-white text-sm font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Score-Aufschlüsselung</h3>
                <div className="space-y-3">
                  {[
                    { label: "Rendite (30%)", value: analysis.yieldScore, color: "bg-blue-500" },
                    { label: "Bewertung (25%)", value: analysis.valueScore, color: "bg-purple-500" },
                    { label: "Risiko (20%)", value: analysis.riskScore, color: "bg-green-500" },
                    { label: "Lage (15%)", value: analysis.locationScore, color: "bg-amber-500" },
                    { label: "Vermietbarkeit (10%)", value: analysis.rentabilityScore, color: "bg-pink-500" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-400 text-xs">{item.label}</span>
                        <span className="text-white text-xs font-medium">{item.value}/100</span>
                      </div>
                      <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                        <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.value}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "finance" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Kaufkosten</h3>
                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  {[
                    ["Kaufpreis", formatCurrency(property.price)],
                    ["Grunderwerbsteuer (6%)", formatCurrency(property.price * 0.06)],
                    ["Notarkosten (1,5%)", formatCurrency(property.price * 0.015)],
                    ["Grundbuchkosten (0,5%)", formatCurrency(property.price * 0.005)],
                    ["Makler (3,57%)", formatCurrency(property.price * 0.0357)],
                    ["Gesamte Kaufnebenkosten", formatCurrency(analysis.purchaseCostsTotal)],
                  ].map(([label, value], i) => (
                    <div key={label} className={cn("flex justify-between px-4 py-2.5 text-sm", i === 5 ? "bg-gray-700/50 font-semibold text-white border-t border-gray-700" : "text-gray-400 border-b border-gray-700/50")}>
                      <span>{label}</span>
                      <span className={i === 5 ? "text-white" : "text-gray-300"}>{value}</span>
                    </div>
                  ))}
                  <div className="flex justify-between px-4 py-2.5 bg-blue-600/20 text-sm font-bold text-blue-400">
                    <span>Gesamtinvestition</span>
                    <span>{formatCurrency(property.price + analysis.purchaseCostsTotal)}</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Cashflow-Rechnung (bei 20% EK, 3,8% Zinsen)</h3>
                <div className="bg-gray-800/50 rounded-lg overflow-hidden">
                  {[
                    ["Kaltmiete", `+ ${formatCurrency(property.monthlyRent)}`],
                    ["Mietausfall (3%)", `- ${formatCurrency(property.monthlyRent * 0.03)}`],
                    ["Effektive Miete", `= ${formatCurrency(property.monthlyRent * 0.97)}`],
                    ["Finanzierungsrate", `- ${formatCurrency(Math.round(property.price * 0.8 * 0.0058))}`],
                    ["Hausgeld", `- ${formatCurrency(property.hausgeld)}`],
                    ["Verwaltung (5%)", `- ${formatCurrency(property.monthlyRent * 0.05)}`],
                    ["Rücklagen (1%)", `- ${formatCurrency(Math.round(property.price * 0.01 / 12))}`],
                  ].map(([label, value], i) => (
                    <div key={label} className={cn("flex justify-between px-4 py-2.5 text-sm", i === 2 ? "bg-gray-700/30 border-y border-gray-700/50" : "border-b border-gray-700/30 text-gray-400")}>
                      <span>{label}</span>
                      <span className="text-gray-300 font-medium">{value}</span>
                    </div>
                  ))}
                  <div className={cn("flex justify-between px-4 py-2.5 font-bold text-sm", analysis.cashflow >= 0 ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400")}>
                    <span>Monatlicher Cashflow</span>
                    <span>{formatCurrency(analysis.cashflow)}</span>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-3">Renditekennzahlen</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {[
                  { label: "Bruttorendite", value: formatPercent(analysis.grossYield), color: "text-blue-400" },
                  { label: "Nettorendite", value: formatPercent(analysis.netYield), color: "text-blue-400" },
                  { label: "Cash-on-Cash", value: formatPercent(analysis.cashOnCash), color: "text-purple-400" },
                  { label: "IRR (5J)", value: formatPercent(analysis.irr), color: "text-amber-400" },
                  { label: "ROI (5J)", value: formatPercent(analysis.roi), color: "text-green-400" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-800/50 rounded-lg p-4 text-center">
                    <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
                    <p className="text-gray-400 text-xs mt-1">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "location" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-white font-semibold mb-3">Mikrolage – Infrastruktur</h3>
                <div className="space-y-3">
                  {[
                    { label: "Schulen (1km)", value: analysis.infrastructure.schools, unit: "Einrichtungen" },
                    { label: "Ärzte (1km)", value: analysis.infrastructure.doctors, unit: "Praxen" },
                    { label: "Supermärkte (1km)", value: analysis.infrastructure.supermarkets, unit: "Märkte" },
                    { label: "Nächster Bahnhof", value: analysis.infrastructure.trainStation, unit: "km" },
                    { label: "Nächste Autobahn", value: analysis.infrastructure.highway, unit: "km" },
                    { label: "Parks (1km)", value: analysis.infrastructure.parks, unit: "Parks" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                      <span className="text-gray-400 text-sm">{item.label}</span>
                      <span className="text-white text-sm font-medium">{item.value} {item.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-3">Makrolage – Stadtdaten</h3>
                <div className="space-y-3">
                  {[
                    { label: "Bevölkerungswachstum", value: formatPercent(analysis.macroData.populationGrowth), positive: analysis.macroData.populationGrowth > 0 },
                    { label: "Ø Haushaltseinkommen", value: formatCurrency(analysis.macroData.avgIncome), positive: true },
                    { label: "Arbeitslosenquote", value: formatPercent(analysis.macroData.unemploymentRate), positive: analysis.macroData.unemploymentRate < 5 },
                    { label: "Leerstandsquote", value: formatPercent(analysis.macroData.vacancyRate), positive: analysis.macroData.vacancyRate < 3 },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between bg-gray-800/50 rounded-lg px-4 py-3">
                      <span className="text-gray-400 text-sm">{item.label}</span>
                      <span className={cn("text-sm font-medium", item.positive ? "text-green-400" : "text-amber-400")}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 bg-gray-800/50 rounded-lg p-4 text-center">
                  <p className="text-4xl font-bold text-amber-400">{analysis.locationScore}</p>
                  <p className="text-gray-400 text-sm mt-1">Gesamt-Lage-Score</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "prognosis" && (
          <div className="space-y-6">
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
              <p className="text-amber-400 text-sm font-medium">Hinweis</p>
              <p className="text-gray-400 text-sm mt-1">Die folgenden Prognosen sind Wahrscheinlichkeitsszenarien, keine Garantien.</p>
            </div>
            <PrognosisChart prognosis={property.analysis.prognosis} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { key: "pessimistic" as const, label: "Pessimistisch", color: "text-red-400", bg: "bg-red-500/10 border-red-500/20" },
                { key: "realistic" as const, label: "Realistisch", color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/20" },
                { key: "optimistic" as const, label: "Optimistisch", color: "text-green-400", bg: "bg-green-500/10 border-green-500/20" },
              ].map((scenario) => (
                <div key={scenario.key} className={cn("border rounded-xl p-4", scenario.bg)}>
                  <h4 className={cn("font-semibold text-sm mb-3", scenario.color)}>{scenario.label}</h4>
                  <div className="space-y-2">
                    {[
                      { label: "1 Jahr", value: analysis.prognosis[scenario.key].year1 },
                      { label: "5 Jahre", value: analysis.prognosis[scenario.key].year5 },
                      { label: "10 Jahre", value: analysis.prognosis[scenario.key].year10 },
                    ].map((item) => (
                      <div key={item.label} className="flex justify-between">
                        <span className="text-gray-500 text-sm">{item.label}</span>
                        <span className={cn("text-sm font-medium", scenario.color)}>{item.value > 0 ? "+" : ""}{formatPercent(item.value)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "report" && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h3 className="text-white font-semibold">KI-Investmentanalyse</h3>
                <p className="text-gray-500 text-xs">Generiert von Claude AI · Nur Analyse, keine Anlageberatung</p>
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-xl p-5 border border-gray-700/50">
              <p className="text-gray-300 leading-relaxed">{analysis.aiReport}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <h4 className="text-green-400 font-semibold text-sm">Chancen</h4>
                </div>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {analysis.marketDeviation < -5 && <li>• Preislich {Math.abs(analysis.marketDeviation).toFixed(1)}% unter Marktniveau</li>}
                  {analysis.cashflow > 0 && <li>• Positiver Cashflow von {formatCurrency(analysis.cashflow)}/Monat</li>}
                  {analysis.grossYield > 5 && <li>• Überdurchschnittliche Bruttorendite von {formatPercent(analysis.grossYield)}</li>}
                  {analysis.locationScore > 70 && <li>• Gute bis sehr gute Lage (Score: {analysis.locationScore})</li>}
                  {analysis.renovationRisk < 30 && <li>• Geringes Sanierungsrisiko</li>}
                </ul>
              </div>
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                  <h4 className="text-red-400 font-semibold text-sm">Risiken</h4>
                </div>
                <ul className="space-y-2 text-gray-400 text-sm">
                  {analysis.cashflow < 0 && <li>• Negativer Cashflow von {formatCurrency(analysis.cashflow)}/Monat</li>}
                  {analysis.renovationRisk > 50 && <li>• Erhöhtes Sanierungsrisiko (Score: {analysis.renovationRisk})</li>}
                  {analysis.marketDeviation > 5 && <li>• Preis {analysis.marketDeviation.toFixed(1)}% über Marktniveau</li>}
                  {analysis.macroData.vacancyRate > 5 && <li>• Hohe Leerstandsquote in der Region</li>}
                  {analysis.macroData.unemploymentRate > 7 && <li>• Überdurchschnittliche Arbeitslosenquote</li>}
                </ul>
              </div>
            </div>
            <div className={cn("border rounded-xl p-5 flex items-center gap-4",
              analysis.dealScore >= 80 ? "bg-green-500/10 border-green-500/20" :
              analysis.dealScore >= 70 ? "bg-blue-500/10 border-blue-500/20" :
              "bg-gray-800/50 border-gray-700/50"
            )}>
              <div className="text-4xl font-bold" style={{ color: analysis.dealScore >= 80 ? "#4ade80" : analysis.dealScore >= 70 ? "#60a5fa" : "#9ca3af" }}>
                {analysis.dealScore}
              </div>
              <div>
                <p className="text-white font-semibold">Empfehlung: {analysis.recommendation}</p>
                <p className="text-gray-400 text-sm mt-0.5">Deal Score von 100 möglichen Punkten</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
