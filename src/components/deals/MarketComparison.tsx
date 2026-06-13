"use client";

import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";
import { MOCK_PROPERTIES } from "@/data/mock-properties";
import { calcDSCR, EQUITY_RATIO, PURCHASE_COSTS_RATE } from "@/lib/investment-constants";

interface Props {
  property: Property;
}

// City average price/sqm benchmarks (realistic 2024 German data)
const CITY_BENCHMARKS: Record<string, { avgPricePerSqm: number; avgGrossYield: number; avgRentPerSqm: number; kaufpreisfaktor: number }> = {
  Leipzig:   { avgPricePerSqm: 2300, avgGrossYield: 5.8, avgRentPerSqm: 11.1, kaufpreisfaktor: 21.3 },
  Dresden:   { avgPricePerSqm: 2700, avgGrossYield: 5.2, avgRentPerSqm: 11.7, kaufpreisfaktor: 22.8 },
  Erfurt:    { avgPricePerSqm: 2100, avgGrossYield: 5.5, avgRentPerSqm: 9.6,  kaufpreisfaktor: 21.7 },
  Halle:     { avgPricePerSqm: 1600, avgGrossYield: 6.2, avgRentPerSqm: 8.3,  kaufpreisfaktor: 19.3 },
  Rostock:   { avgPricePerSqm: 2800, avgGrossYield: 5.0, avgRentPerSqm: 11.7, kaufpreisfaktor: 23.8 },
  Cottbus:   { avgPricePerSqm: 1400, avgGrossYield: 7.0, avgRentPerSqm: 8.2,  kaufpreisfaktor: 17.1 },
  Chemnitz:  { avgPricePerSqm: 1300, avgGrossYield: 7.5, avgRentPerSqm: 8.1,  kaufpreisfaktor: 16.0 },
  Magdeburg: { avgPricePerSqm: 1800, avgGrossYield: 6.5, avgRentPerSqm: 9.8,  kaufpreisfaktor: 18.5 },
  Potsdam:   { avgPricePerSqm: 4200, avgGrossYield: 4.2, avgRentPerSqm: 14.7, kaufpreisfaktor: 28.6 },
  Gera:      { avgPricePerSqm: 1100, avgGrossYield: 8.5, avgRentPerSqm: 7.8,  kaufpreisfaktor: 14.1 },
  Hannover:  { avgPricePerSqm: 3100, avgGrossYield: 4.8, avgRentPerSqm: 12.4, kaufpreisfaktor: 24.8 },
  Nürnberg:  { avgPricePerSqm: 3700, avgGrossYield: 4.5, avgRentPerSqm: 13.9, kaufpreisfaktor: 26.4 },
  Berlin:    { avgPricePerSqm: 5200, avgGrossYield: 3.2, avgRentPerSqm: 13.9, kaufpreisfaktor: 37.4 },
  Zwickau:   { avgPricePerSqm: 1100, avgGrossYield: 7.8, avgRentPerSqm: 7.1,  kaufpreisfaktor: 15.3 },
};

export function MarketComparison({ property }: Props) {
  const { price, pricePerSqm, area, monthlyRent, city, analysis } = property;
  const benchmark = CITY_BENCHMARKS[city] ?? {
    avgPricePerSqm: pricePerSqm,
    avgGrossYield: analysis.grossYield,
    avgRentPerSqm: (monthlyRent / area),
    kaufpreisfaktor: price / (monthlyRent * 12),
  };

  const rentPerSqm = monthlyRent / area;
  const kaufpreisfaktor = price / (monthlyRent * 12);
  const priceDeviation = ((pricePerSqm - benchmark.avgPricePerSqm) / benchmark.avgPricePerSqm) * 100;
  const yieldDeviation = analysis.grossYield - benchmark.avgGrossYield;
  const rentDeviation = ((rentPerSqm - benchmark.avgRentPerSqm) / benchmark.avgRentPerSqm) * 100;

  // ETF comparison
  const investedCapital = price * EQUITY_RATIO + price * PURCHASE_COSTS_RATE;
  const etfReturn7pct = investedCapital * Math.pow(1.07, 10) - investedCapital;
  const etfReturn5pct = investedCapital * Math.pow(1.05, 10) - investedCapital;

  // Similar properties in same city
  const similarProperties = MOCK_PROPERTIES
    .filter((p) => p.city === city && p.id !== property.id)
    .sort((a, b) => b.analysis.dealScore - a.analysis.dealScore)
    .slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Vs City Average */}
      <div>
        <h3 className="text-white font-semibold mb-3">Vergleich mit {city}-Durchschnitt</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Preis/m²",
              thisValue: formatCurrency(pricePerSqm),
              avgValue: formatCurrency(benchmark.avgPricePerSqm),
              deviation: priceDeviation,
              betterIfNegative: true,
            },
            {
              label: "Bruttorendite",
              thisValue: formatPercent(analysis.grossYield),
              avgValue: formatPercent(benchmark.avgGrossYield),
              deviation: yieldDeviation,
              betterIfNegative: false,
              isPercent: true,
            },
            {
              label: "Kaufpreisfaktor",
              thisValue: `${kaufpreisfaktor.toFixed(1)}x`,
              avgValue: `${benchmark.kaufpreisfaktor.toFixed(1)}x`,
              deviation: ((kaufpreisfaktor - benchmark.kaufpreisfaktor) / benchmark.kaufpreisfaktor) * 100,
              betterIfNegative: true,
            },
          ].map((item) => {
            const isBetter = item.betterIfNegative ? item.deviation < 0 : item.deviation > 0;
            const color = isBetter ? "text-green-400" : item.deviation === 0 ? "text-gray-400" : "text-amber-400";
            return (
              <div key={item.label} className="bg-gray-800/50 rounded-xl p-4">
                <p className="text-gray-500 text-xs mb-3">{item.label}</p>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-white text-lg font-bold">{item.thisValue}</p>
                    <p className="text-gray-500 text-xs">Diese Immobilie</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-400 text-sm font-medium">{item.avgValue}</p>
                    <p className="text-gray-600 text-xs">Ø {city}</p>
                  </div>
                </div>
                <div className={cn("text-xs font-medium px-2 py-1 rounded-md inline-block", isBetter ? "bg-green-500/10 text-green-400" : "bg-amber-500/10 text-amber-400")}>
                  {item.deviation > 0 ? "+" : ""}{item.isPercent ? `${item.deviation.toFixed(2)} PP` : `${item.deviation.toFixed(1)}%`} vs. Markt
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key ratios */}
      <div>
        <h3 className="text-white font-semibold mb-3">Kennzahlen im Kontext</h3>
        <div className="space-y-3">
          {[
            {
              label: "Kaufpreisfaktor",
              value: kaufpreisfaktor.toFixed(1) + "x",
              description: kaufpreisfaktor <= 20 ? "Sehr günstig – unter 20x ist Investoren-Standard" :
                           kaufpreisfaktor <= 25 ? "Günstig – gutes Verhältnis Preis/Miete" :
                           kaufpreisfaktor <= 30 ? "Mittel – marktüblich in wachsenden Städten" :
                           "Teuer – über 30x ist schwer zu rechtfertigen",
              good: kaufpreisfaktor <= 25,
            },
            {
              label: "Mietrendite (Netto/m²)",
              value: `${rentPerSqm.toFixed(2)} €/m²`,
              description: rentPerSqm >= benchmark.avgRentPerSqm
                ? `${((rentPerSqm / benchmark.avgRentPerSqm - 1) * 100).toFixed(1)}% über Marktmiete – Mieterhöhungspotenzial gering`
                : `${((benchmark.avgRentPerSqm / rentPerSqm - 1) * 100).toFixed(1)}% unter Marktmiete – Mieterhöhungspotenzial vorhanden`,
              good: rentPerSqm < benchmark.avgRentPerSqm,
            },
            {
              label: "DSCR (Schuldendienstdeckung)",
              value: calcDSCR(price, monthlyRent).toFixed(2),
              description: calcDSCR(price, monthlyRent) >= 1.2
                ? "Solide – Banken fordern typisch ≥ 1,2"
                : calcDSCR(price, monthlyRent) >= 1.0
                ? "Grenzwertig – knapp ausreichend für Finanzierung"
                : "Kritisch – Kreditwürdigkeit gefährdet",
              good: calcDSCR(price, monthlyRent) >= 1.2,
            },
          ].map((item) => (
            <div key={item.label} className={cn("flex items-center gap-4 p-3 rounded-xl border",
              item.good ? "bg-green-500/5 border-green-500/20" : "bg-amber-500/5 border-amber-500/20"
            )}>
              <div className={cn("w-2 h-2 rounded-full flex-shrink-0", item.good ? "bg-green-400" : "bg-amber-400")} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-white font-semibold text-sm">{item.label}</span>
                  <span className={cn("text-base font-bold", item.good ? "text-green-400" : "text-amber-400")}>{item.value}</span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ETF Comparison */}
      <div>
        <h3 className="text-white font-semibold mb-3">Opportunitätskosten – vs. ETF-Investment</h3>
        <p className="text-gray-500 text-xs mb-3">
          Eigenkapitaleinsatz: {formatCurrency(investedCapital)} (20% EK + 12% Nebenkosten) über 10 Jahre
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "ETF 5% p.a. (konservativ)",
              value: formatCurrency(etfReturn5pct),
              sub: "Nettogewinn nach 10 Jahren",
              color: "text-gray-400",
            },
            {
              label: "ETF 7% p.a. (historisch)",
              value: formatCurrency(etfReturn7pct),
              sub: "MSCI World Ø-Rendite",
              color: "text-blue-400",
            },
            {
              label: "Diese Immobilie",
              value: formatCurrency(Math.round((analysis.cashflow * 12 * 10) + (price * 0.25))),
              sub: "CF + 25% Wertsteigerung (10J)",
              color: "text-green-400",
            },
          ].map((item) => (
            <div key={item.label} className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className={cn("text-xl font-bold", item.color)}>{item.value}</p>
              <p className="text-white text-xs font-medium mt-1">{item.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
        <p className="text-gray-600 text-xs mt-2">
          * ETF-Vergleich ohne Hebeleffekt. Immobilien hebeln Eigenkapital durch Fremdfinanzierung – Vorteil bei Wertsteigerung, Nachteil bei Wertverfall.
        </p>
      </div>

      {/* Similar properties */}
      {similarProperties.length > 0 && (
        <div>
          <h3 className="text-white font-semibold mb-3">Ähnliche Deals in {city}</h3>
          <div className="space-y-2">
            {similarProperties.map((p) => (
              <a key={p.id} href={`/deals/${p.id}`} className="flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 rounded-xl px-4 py-3 transition-colors group">
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium line-clamp-1 group-hover:text-blue-400 transition-colors">{p.title}</p>
                  <p className="text-gray-500 text-xs">{p.area} m² · Bj. {p.yearBuilt} · {formatCurrency(p.pricePerSqm)}/m²</p>
                </div>
                <div className="flex items-center gap-4 flex-shrink-0 ml-4">
                  <div className="text-right hidden sm:block">
                    <p className="text-green-400 text-sm font-bold">{formatPercent(p.analysis.grossYield)}</p>
                    <p className="text-gray-600 text-xs">Rendite</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm font-bold">{p.analysis.dealScore}</p>
                    <p className="text-gray-600 text-xs">Score</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
