"use client";

import { cn } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";
import { calcCashflow, calcDSCR, BASE_INTEREST_RATE } from "@/lib/investment-constants";

interface Props {
  property: Property;
}

const VACANCY_RATES = [0, 3, 6, 10, 15];
const INTEREST_RATES = [2.5, 3.0, 3.5, 4.0, 4.5, 5.5];
const BASE_VACANCY = 3;

export function StressTest({ property }: Props) {
  const { price, monthlyRent, hausgeld } = property;

  const dscr = calcDSCR(price, monthlyRent, BASE_INTEREST_RATE, BASE_VACANCY);

  // Find thresholds
  let maxVacancy = 0;
  for (const v of VACANCY_RATES) {
    if (calcCashflow(price, monthlyRent, hausgeld, v, BASE_INTEREST_RATE) >= 0) maxVacancy = v;
  }
  let maxInterest = 0;
  for (const r of INTEREST_RATES) {
    if (calcCashflow(price, monthlyRent, hausgeld, BASE_VACANCY, r) >= 0) maxInterest = r;
  }

  return (
    <div className="space-y-6">
      {/* Matrix */}
      <div>
        <h3 className="text-white font-semibold mb-1">Cashflow-Sensitivitätsmatrix</h3>
        <p className="text-gray-500 text-sm mb-4">
          Monatlicher Cashflow bei 20% EK — nach Zinsen, Tilgung, Hausgeld, Verwaltung (8%) und Instandhaltung (1%)
        </p>
        <div className="overflow-x-auto -mx-3 sm:mx-0">
          <div className="inline-block min-w-full px-3 sm:px-0">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="text-left text-gray-500 pb-3 pr-4 font-medium whitespace-nowrap">
                    Leerstand ↓ / Zinsen →
                  </th>
                  {INTEREST_RATES.map((r) => (
                    <th
                      key={r}
                      className={cn(
                        "pb-3 px-2 font-medium text-center whitespace-nowrap",
                        r === BASE_INTEREST_RATE ? "text-blue-400" : "text-gray-500"
                      )}
                    >
                      {r.toFixed(1)}%
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {VACANCY_RATES.map((v) => (
                  <tr key={v} className="border-t border-gray-800/50">
                    <td
                      className={cn(
                        "py-2.5 pr-4 font-medium whitespace-nowrap",
                        v === BASE_VACANCY ? "text-blue-400" : "text-gray-400"
                      )}
                    >
                      {v}% Leerstand
                    </td>
                    {INTEREST_RATES.map((r) => {
                      const cf = calcCashflow(price, monthlyRent, hausgeld, v, r);
                      const isBase = v === BASE_VACANCY && r === BASE_INTEREST_RATE;
                      const color =
                        cf >= 100
                          ? "text-green-400 bg-green-500/10"
                          : cf >= 0
                          ? "text-green-300 bg-green-500/5"
                          : cf >= -100
                          ? "text-amber-400 bg-amber-500/10"
                          : "text-red-400 bg-red-500/10";
                      return (
                        <td key={r} className="py-2.5 px-2 text-center">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded font-mono font-medium",
                              color,
                              isBase && "ring-1 ring-blue-500"
                            )}
                          >
                            {cf >= 0 ? "+" : ""}{cf} €
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="text-gray-600 text-xs mt-3">
          Blau umrandet = aktuelle Basisannahme (3% Leerstand, 3,5% Zinsen). Grün = positiver CF. Gelb = leicht negativ. Rot = kritisch negativ.
        </p>
      </div>

      {/* Risk thresholds */}
      <div>
        <h3 className="text-white font-semibold mb-3">Belastbarkeitsgrenzen</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            {
              label: "Max. Leerstand",
              value: `${maxVacancy}%`,
              sub: "Cashflow bricht erst hier ein",
              color: maxVacancy >= 6 ? "text-green-400" : maxVacancy >= 3 ? "text-amber-400" : "text-red-400",
              bg: maxVacancy >= 6 ? "border-green-500/20 bg-green-500/5" : maxVacancy >= 3 ? "border-amber-500/20 bg-amber-500/5" : "border-red-500/20 bg-red-500/5",
            },
            {
              label: "Max. Zinssatz",
              value: `${maxInterest.toFixed(1)}%`,
              sub: "Cashflow bricht erst hier ein",
              color: maxInterest >= 5 ? "text-green-400" : maxInterest >= 4 ? "text-amber-400" : "text-red-400",
              bg: maxInterest >= 5 ? "border-green-500/20 bg-green-500/5" : maxInterest >= 4 ? "border-amber-500/20 bg-amber-500/5" : "border-red-500/20 bg-red-500/5",
            },
            {
              label: "DSCR",
              value: dscr.toFixed(2),
              sub: dscr >= 1.2 ? "Solide — Bankstandard erfüllt (≥ 1,2)" : dscr >= 1.0 ? "Grenzwertig — knapp ausreichend" : "Kritisch — Finanzierung gefährdet",
              color: dscr >= 1.2 ? "text-green-400" : dscr >= 1.0 ? "text-amber-400" : "text-red-400",
              bg: dscr >= 1.2 ? "border-green-500/20 bg-green-500/5" : dscr >= 1.0 ? "border-amber-500/20 bg-amber-500/5" : "border-red-500/20 bg-red-500/5",
            },
          ].map((item) => (
            <div key={item.label} className={cn("rounded-xl p-4 text-center border", item.bg)}>
              <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
              <p className="text-white text-xs font-medium mt-1.5">{item.label}</p>
              <p className="text-gray-500 text-xs mt-1 leading-snug">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
