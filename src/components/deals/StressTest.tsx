"use client";

import { cn } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";

interface Props {
  property: Property;
}

const VACANCY_RATES = [0, 3, 6, 10, 15];
const INTEREST_RATES = [2.5, 3.0, 3.5, 4.0, 4.5, 5.5];
const EQUITY_RATIO = 0.2;

function calcCashflow(
  price: number,
  monthlyRent: number,
  hausgeld: number,
  vacancyPct: number,
  interestPct: number,
) {
  const loanAmount = price * (1 - EQUITY_RATIO);
  const effectiveRent = monthlyRent * (1 - vacancyPct / 100);
  const interest = (loanAmount * interestPct) / 100 / 12;
  const repayment = (loanAmount * 0.02) / 12;
  const management = monthlyRent * 0.05;
  const maintenance = (price * 0.01) / 12;
  return Math.round(effectiveRent - hausgeld - management - maintenance - interest - repayment);
}

export function StressTest({ property }: Props) {
  const { price, monthlyRent, hausgeld } = property;
  const baseVacancy = 3;
  const baseInterest = 3.5;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-white font-semibold mb-1">Stresstest – Cashflow-Sensitivität</h3>
        <p className="text-gray-500 text-sm mb-4">
          Monatlicher Cashflow (nach Zinsen, Tilgung, HG, Verwaltung, Instandhaltung) bei 20% Eigenkapital
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr>
                <th className="text-left text-gray-500 pb-3 pr-3 font-medium whitespace-nowrap">
                  Leerstand ↓ / Zinsen →
                </th>
                {INTEREST_RATES.map((r) => (
                  <th
                    key={r}
                    className={cn(
                      "pb-3 px-2 font-medium text-center whitespace-nowrap",
                      r === baseInterest ? "text-blue-400" : "text-gray-500"
                    )}
                  >
                    {r.toFixed(1)}%
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="space-y-1">
              {VACANCY_RATES.map((v) => (
                <tr key={v} className="border-t border-gray-800/50">
                  <td
                    className={cn(
                      "py-2.5 pr-3 font-medium whitespace-nowrap",
                      v === baseVacancy ? "text-blue-400" : "text-gray-400"
                    )}
                  >
                    {v}% Leerstand
                  </td>
                  {INTEREST_RATES.map((r) => {
                    const cf = calcCashflow(price, monthlyRent, hausgeld, v, r);
                    const isBase = v === baseVacancy && r === baseInterest;
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
                            "px-2 py-0.5 rounded font-medium tabular-nums",
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
        <p className="text-gray-600 text-xs mt-3">
          Blau umrandet = aktuelle Annahmen. Grün = positiver Cashflow. Gelb = leicht negativ. Rot = stark negativ.
        </p>
      </div>

      {/* Key risk thresholds */}
      <div>
        <h3 className="text-white font-semibold mb-3">Kritische Schwellenwerte</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(() => {
            // Find max vacancy at base interest where CF still >= 0
            let maxVacancy = 0;
            for (const v of VACANCY_RATES) {
              if (calcCashflow(price, monthlyRent, hausgeld, v, baseInterest) >= 0) maxVacancy = v;
            }
            // Find max interest at base vacancy where CF >= 0
            let maxInterest = 0;
            for (const r of INTEREST_RATES) {
              if (calcCashflow(price, monthlyRent, hausgeld, baseVacancy, r) >= 0) maxInterest = r;
            }
            // DSCR at base
            const loanAmount = price * (1 - EQUITY_RATIO);
            const monthlyDebtService =
              (loanAmount * baseInterest) / 100 / 12 + (loanAmount * 0.02) / 12;
            const effectiveRent = monthlyRent * (1 - baseVacancy / 100);
            const dscr = effectiveRent / monthlyDebtService;

            return [
              {
                label: "Max. Leerstand",
                value: `${maxVacancy}%`,
                sub: "bis Cashflow = 0",
                color: maxVacancy >= 6 ? "text-green-400" : maxVacancy >= 3 ? "text-amber-400" : "text-red-400",
              },
              {
                label: "Max. Zinssatz",
                value: `${maxInterest.toFixed(1)}%`,
                sub: "bis Cashflow = 0",
                color: maxInterest >= 5 ? "text-green-400" : maxInterest >= 4 ? "text-amber-400" : "text-red-400",
              },
              {
                label: "DSCR",
                value: dscr.toFixed(2),
                sub: "Schuldendienstdeckung (≥ 1,2 = solide)",
                color: dscr >= 1.2 ? "text-green-400" : dscr >= 1.0 ? "text-amber-400" : "text-red-400",
              },
            ];
          })().map((item) => (
            <div key={item.label} className="bg-gray-800/50 rounded-xl p-4 text-center">
              <p className={cn("text-2xl font-bold", item.color)}>{item.value}</p>
              <p className="text-white text-xs font-medium mt-1">{item.label}</p>
              <p className="text-gray-500 text-xs mt-0.5">{item.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
