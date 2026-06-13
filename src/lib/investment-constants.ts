// Shared investment calculation constants used across all analysis components
// Centralised here to ensure consistency between StressTest, TaxAndExit, Calculator, etc.

export const EQUITY_RATIO = 0.2;          // 20% Eigenkapital
export const BASE_INTEREST_RATE = 3.5;    // 3,5% Zinssatz (Basisannahme)
export const REPAYMENT_RATE = 0.02;       // 2% Tilgung p.a.
export const MANAGEMENT_RATE = 0.08;      // 8% Hausverwaltung
export const MAINTENANCE_RATE = 0.01;     // 1% Instandhaltungsrücklage p.a. auf KP
export const VACANCY_RATE = 0.03;         // 3% Mietausfallwagnis
export const PURCHASE_COSTS_RATE = 0.12;  // 12% Kaufnebenkosten (GrESt 6% + Notar 1,5% + GB 0,5% + Makler 3,57%)
export const BUILDING_VALUE_RATIO = 0.8;  // 80% Gebäudeanteil (20% Grund u. Boden)

export function calcMonthlyLoanCost(price: number, interestPct = BASE_INTEREST_RATE): number {
  const loan = price * (1 - EQUITY_RATIO);
  return (loan * (interestPct / 100 + REPAYMENT_RATE)) / 12;
}

export function calcMonthlyCosts(price: number, monthlyRent: number, hausgeld: number): number {
  return (
    hausgeld +
    monthlyRent * MANAGEMENT_RATE +
    (price * MAINTENANCE_RATE) / 12 +
    monthlyRent * VACANCY_RATE
  );
}

export function calcCashflow(
  price: number,
  monthlyRent: number,
  hausgeld: number,
  vacancyPct: number,
  interestPct: number,
): number {
  const loan = price * (1 - EQUITY_RATIO);
  const effectiveRent = monthlyRent * (1 - vacancyPct / 100);
  const interest = (loan * interestPct) / 100 / 12;
  const repayment = (loan * REPAYMENT_RATE) / 12;
  const management = monthlyRent * MANAGEMENT_RATE;
  const maintenance = (price * MAINTENANCE_RATE) / 12;
  return Math.round(effectiveRent - hausgeld - management - maintenance - interest - repayment);
}

export function calcDSCR(price: number, monthlyRent: number, interestPct = BASE_INTEREST_RATE, vacancyPct = 3): number {
  const loan = price * (1 - EQUITY_RATIO);
  const monthlyDebtService = (loan * (interestPct / 100 + REPAYMENT_RATE)) / 12;
  const effectiveRent = monthlyRent * (1 - vacancyPct / 100);
  return effectiveRent / monthlyDebtService;
}
