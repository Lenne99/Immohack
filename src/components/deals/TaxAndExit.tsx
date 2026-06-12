"use client";

import { useState } from "react";
import { cn, formatCurrency, formatPercent } from "@/lib/utils";
import type { Property } from "@/data/mock-properties";

interface Props {
  property: Property;
}

const TAX_RATES = [
  { label: "25% (Einsteiger)", rate: 25 },
  { label: "35% (Mittelstand)", rate: 35 },
  { label: "42% (Spitzenverdiener)", rate: 42 },
];

export function TaxAndExit({ property }: Props) {
  const [selectedTaxRate, setSelectedTaxRate] = useState(35);
  const [holdYears, setHoldYears] = useState(10);
  const [rentGrowth, setRentGrowth] = useState(2);
  const [priceGrowth, setpriceGrowth] = useState(2);

  const { price, monthlyRent, hausgeld, yearBuilt, analysis } = property;

  // AfA: 2% p.a. for post-1925, 2.5% for older
  const afaRate = yearBuilt < 1925 ? 2.5 : 2.0;
  // Building value = 80% of purchase price (20% land)
  const buildingValue = price * 0.8;
  const annualAfA = buildingValue * (afaRate / 100);

  const annualRent = monthlyRent * 12;
  const annualHausgeld = hausgeld * 12;
  const loanAmount = price * 0.8;
  const annualInterest = loanAmount * 0.035;
  const annualManagement = monthlyRent * 0.08 * 12;
  const annualMaintenance = price * 0.01;
  const annualVacancy = monthlyRent * 0.03 * 12;

  // Deductible costs
  const totalDeductible = annualHausgeld + annualInterest + annualManagement + annualMaintenance + annualVacancy + annualAfA;
  const taxableRentalIncome = annualRent - totalDeductible;
  const taxRate = selectedTaxRate / 100;

  // If negative: tax loss offsets other income → tax savings
  const monthlyTaxEffect = taxableRentalIncome < 0
    ? Math.abs(taxableRentalIncome) * taxRate / 12  // savings
    : -(taxableRentalIncome * taxRate / 12);        // additional tax

  const afterTaxMonthlyCashflow = analysis.cashflow + monthlyTaxEffect;

  // 10-year projection
  const annualRepayment = loanAmount * 0.02;
  const rows = Array.from({ length: holdYears }, (_, i) => {
    const year = i + 1;
    const rentFactor = Math.pow(1 + rentGrowth / 100, i);
    const yearlyRent = annualRent * rentFactor;
    const yearlyInterestDecline = annualInterest * Math.pow(0.98, i); // rough simplification
    const yearlyDeductible = annualHausgeld + yearlyInterestDecline + annualManagement * rentFactor + annualMaintenance + annualVacancy * rentFactor + annualAfA;
    const yearlyTaxableIncome = yearlyRent - yearlyDeductible;
    const yearlyTaxEffect = yearlyTaxableIncome < 0
      ? Math.abs(yearlyTaxableIncome) * taxRate
      : -(yearlyTaxableIncome * taxRate);
    const yearlyDebtService = yearlyInterestDecline + annualRepayment;
    const yearlyCashflow = yearlyRent - annualHausgeld - annualManagement * rentFactor - annualMaintenance - annualVacancy * rentFactor - yearlyDebtService;
    const yearlyAfterTaxCF = yearlyCashflow + yearlyTaxEffect;
    return { year, yearlyRent, yearlyCashflow, yearlyAfterTaxCF, yearlyTaxEffect };
  });

  const totalPreTaxCF = rows.reduce((s, r) => s + r.yearlyCashflow, 0);
  const totalAfterTaxCF = rows.reduce((s, r) => s + r.yearlyAfterTaxCF, 0);
  const totalTaxBenefit = rows.reduce((s, r) => s + r.yearlyTaxEffect, 0);

  // Exit scenario
  const exitPrice = price * Math.pow(1 + priceGrowth / 100, holdYears);
  const remainingDebt = loanAmount * Math.pow(1 - 0.02, holdYears);
  const equity = price * 0.2; // initial equity
  const exitProfit = exitPrice - remainingDebt - price; // simplified: selling price - remaining debt - initial price
  // After 10 years: no Spekulationssteuer on private RE
  const exitProfitAfterTax = holdYears >= 10 ? exitProfit : exitProfit * (1 - taxRate);
  const totalReturn = totalAfterTaxCF + exitProfitAfterTax;
  const roi = (totalReturn / (price * 0.2 + price * 0.12)) * 100; // on invested capital (EK + Nebenkosten)

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div>
          <label className="text-gray-500 text-xs block mb-1">Steuersatz</label>
          <select
            value={selectedTaxRate}
            onChange={(e) => setSelectedTaxRate(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {TAX_RATES.map((t) => (
              <option key={t.rate} value={t.rate}>{t.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-500 text-xs block mb-1">Haltedauer</label>
          <select
            value={holdYears}
            onChange={(e) => setHoldYears(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {[5, 10, 15, 20].map((y) => (
              <option key={y} value={y}>{y} Jahre</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-500 text-xs block mb-1">Mietsteigerung p.a.</label>
          <select
            value={rentGrowth}
            onChange={(e) => setRentGrowth(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {[0, 1, 2, 3].map((r) => (
              <option key={r} value={r}>{r}% p.a.</option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-gray-500 text-xs block mb-1">Wertsteigerung p.a.</label>
          <select
            value={priceGrowth}
            onChange={(e) => setpriceGrowth(Number(e.target.value))}
            className="w-full bg-gray-800 border border-gray-700 text-gray-200 text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {[0, 1, 2, 3, 4].map((r) => (
              <option key={r} value={r}>{r}% p.a.</option>
            ))}
          </select>
        </div>
      </div>

      {/* AfA + Tax */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h3 className="text-white font-semibold mb-3">AfA & Steuerlicher Vorteil</h3>
          <div className="bg-gray-800/50 rounded-lg overflow-hidden">
            {[
              ["Gebäudewert (80% des KP)", formatCurrency(buildingValue)],
              [`AfA-Rate (${afaRate}% – ${yearBuilt < 1925 ? "Altbau" : "Neubau/Bestand"})`, formatCurrency(annualAfA) + " /Jahr"],
              ["Zinsen (abzugsfähig)", formatCurrency(annualInterest) + " /Jahr"],
              ["Verwaltung & Instandhaltung", formatCurrency(annualManagement + annualMaintenance) + " /Jahr"],
              ["Hausgeld", formatCurrency(annualHausgeld) + " /Jahr"],
            ].map(([l, v]) => (
              <div key={l} className="flex justify-between px-4 py-2.5 border-b border-gray-700/30 text-sm">
                <span className="text-gray-400">{l}</span>
                <span className="text-gray-200 font-medium">{v}</span>
              </div>
            ))}
            <div className="flex justify-between px-4 py-2.5 text-sm border-b border-gray-700/30">
              <span className="text-gray-400">Steuerliches Ergebnis</span>
              <span className={cn("font-bold", taxableRentalIncome <= 0 ? "text-green-400" : "text-red-400")}>
                {taxableRentalIncome <= 0 ? "−" : "+"}{formatCurrency(Math.abs(taxableRentalIncome))} /Jahr
              </span>
            </div>
            <div className={cn("flex justify-between px-4 py-2.5 text-sm font-bold",
              taxableRentalIncome <= 0 ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
            )}>
              <span>{taxableRentalIncome <= 0 ? "Steuervorteil" : "Steuerlast"} bei {selectedTaxRate}%</span>
              <span>{taxableRentalIncome <= 0 ? "+" : "−"}{formatCurrency(Math.abs(taxableRentalIncome * taxRate / 12))} /Monat</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-3">Cashflow vor & nach Steuer</h3>
          <div className="space-y-3">
            {[
              { label: "Cashflow (vor Steuer)", value: analysis.cashflow, sub: "inkl. Tilgung" },
              { label: "Steuereffekt", value: Math.round(monthlyTaxEffect), sub: taxableRentalIncome < 0 ? "Steuerersparnis" : "Steuerlast" },
              { label: "Cashflow (nach Steuer)", value: Math.round(afterTaxMonthlyCashflow), sub: "effektiver monatlicher CF", highlight: true },
            ].map((item) => (
              <div
                key={item.label}
                className={cn(
                  "flex items-center justify-between rounded-xl px-4 py-3",
                  item.highlight
                    ? afterTaxMonthlyCashflow >= 0
                      ? "bg-green-500/10 border border-green-500/20"
                      : "bg-red-500/10 border border-red-500/20"
                    : "bg-gray-800/50"
                )}
              >
                <div>
                  <p className="text-white text-sm font-medium">{item.label}</p>
                  <p className="text-gray-500 text-xs">{item.sub}</p>
                </div>
                <p className={cn(
                  "text-xl font-bold tabular-nums",
                  item.value >= 0 ? "text-green-400" : "text-red-400"
                )}>
                  {item.value >= 0 ? "+" : ""}{formatCurrency(item.value)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Year-by-year table */}
      <div>
        <h3 className="text-white font-semibold mb-3">{holdYears}-Jahres-Projektion</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                {["Jahr", "Miete/Jahr", "CF vor Steuer", "Steuereffekt", "CF nach Steuer"].map((h) => (
                  <th key={h} className="text-gray-500 font-medium py-2 px-2 text-right first:text-left">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.year} className="border-b border-gray-800/30">
                  <td className="py-2 px-2 text-gray-400">{r.year}</td>
                  <td className="py-2 px-2 text-right text-gray-300 tabular-nums">{formatCurrency(r.yearlyRent)}</td>
                  <td className={cn("py-2 px-2 text-right font-medium tabular-nums", r.yearlyCashflow >= 0 ? "text-green-400" : "text-red-400")}>
                    {r.yearlyCashflow >= 0 ? "+" : ""}{formatCurrency(r.yearlyCashflow)}
                  </td>
                  <td className={cn("py-2 px-2 text-right tabular-nums", r.yearlyTaxEffect >= 0 ? "text-green-300" : "text-red-300")}>
                    {r.yearlyTaxEffect >= 0 ? "+" : ""}{formatCurrency(r.yearlyTaxEffect)}
                  </td>
                  <td className={cn("py-2 px-2 text-right font-bold tabular-nums", r.yearlyAfterTaxCF >= 0 ? "text-green-400" : "text-red-400")}>
                    {r.yearlyAfterTaxCF >= 0 ? "+" : ""}{formatCurrency(r.yearlyAfterTaxCF)}
                  </td>
                </tr>
              ))}
              <tr className="bg-gray-800/30 font-bold">
                <td className="py-2.5 px-2 text-white">Gesamt</td>
                <td className="py-2.5 px-2 text-right text-gray-300 tabular-nums">{formatCurrency(rows.reduce((s, r) => s + r.yearlyRent, 0))}</td>
                <td className={cn("py-2.5 px-2 text-right tabular-nums", totalPreTaxCF >= 0 ? "text-green-400" : "text-red-400")}>
                  {totalPreTaxCF >= 0 ? "+" : ""}{formatCurrency(totalPreTaxCF)}
                </td>
                <td className={cn("py-2.5 px-2 text-right tabular-nums", totalTaxBenefit >= 0 ? "text-green-300" : "text-red-300")}>
                  {totalTaxBenefit >= 0 ? "+" : ""}{formatCurrency(totalTaxBenefit)}
                </td>
                <td className={cn("py-2.5 px-2 text-right tabular-nums", totalAfterTaxCF >= 0 ? "text-green-400" : "text-red-400")}>
                  {totalAfterTaxCF >= 0 ? "+" : ""}{formatCurrency(totalAfterTaxCF)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Exit Summary */}
      <div>
        <h3 className="text-white font-semibold mb-3">
          Exit nach {holdYears} Jahren
          {holdYears >= 10 && <span className="text-green-400 text-xs ml-2 font-normal">✓ Steuerfrei (keine Spekulationssteuer)</span>}
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Erwarteter Verkaufspreis", value: formatCurrency(exitPrice), color: "text-white" },
            { label: "Restschuld", value: `− ${formatCurrency(Math.max(0, remainingDebt))}`, color: "text-red-400" },
            { label: "Cashflow gesamt", value: `+ ${formatCurrency(Math.max(0, totalAfterTaxCF))}`, color: "text-green-400" },
            { label: "Gesamtgewinn", value: formatCurrency(totalReturn), color: totalReturn > 0 ? "text-green-400" : "text-red-400" },
          ].map((item) => (
            <div key={item.label} className="bg-gray-800/50 rounded-xl p-3 text-center">
              <p className={cn("text-lg font-bold tabular-nums", item.color)}>{item.value}</p>
              <p className="text-gray-500 text-xs mt-1">{item.label}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 bg-blue-600/10 border border-blue-500/20 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-white font-semibold">Gesamt-ROI auf Eigenkapital</p>
            <p className="text-gray-400 text-sm mt-0.5">Bezogen auf EK + Kaufnebenkosten ({holdYears} Jahre, bei {selectedTaxRate}% Steuersatz)</p>
          </div>
          <p className={cn("text-3xl font-bold", roi > 0 ? "text-green-400" : "text-red-400")}>
            {roi > 0 ? "+" : ""}{roi.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  );
}
