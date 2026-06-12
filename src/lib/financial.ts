export interface CashflowParams {
  purchasePrice: number;
  equity: number;
  monthlyRent: number;
  monthlyHausgeld: number;
  managementCostPercent: number;
  vacancyRatePercent: number;
  maintenanceReservePercent: number;
  interestRate: number;
  repaymentRate: number;
}

export interface CashflowResult {
  monthlyGrossRent: number;
  monthlyEffectiveRent: number;
  monthlyFinancingCost: number;
  monthlyManagementCost: number;
  monthlyMaintenanceReserve: number;
  monthlyHausgeld: number;
  monthlyCashflow: number;
  annualCashflow: number;
}

export interface YieldResult {
  grossYield: number;
  netYield: number;
  cashOnCash: number;
  irr: number;
  roi: number;
}

export interface PurchaseCosts {
  propertyTransferTax: number;
  notaryFees: number;
  landRegistryFees: number;
  brokerFee: number;
  totalCosts: number;
  totalInvestment: number;
}

export interface FinancingResult {
  loanAmount: number;
  monthlyRate: number;
  monthlyInterest: number;
  monthlyRepayment: number;
  annualCost: number;
}

export function calculatePurchaseCosts(price: number, state = "Berlin"): PurchaseCosts {
  const transferTaxRates: Record<string, number> = {
    Bayern: 0.035,
    Sachsen: 0.035,
    Hamburg: 0.045,
    Brandenburg: 0.065,
    "Nordrhein-Westfalen": 0.065,
    Berlin: 0.06,
    default: 0.06,
  };
  const taxRate = transferTaxRates[state] ?? transferTaxRates.default;

  const propertyTransferTax = price * taxRate;
  const notaryFees = price * 0.015;
  const landRegistryFees = price * 0.005;
  const brokerFee = price * 0.0357;
  const totalCosts = propertyTransferTax + notaryFees + landRegistryFees + brokerFee;

  return {
    propertyTransferTax,
    notaryFees,
    landRegistryFees,
    brokerFee,
    totalCosts,
    totalInvestment: price + totalCosts,
  };
}

export function calculateFinancing(
  price: number,
  equity: number,
  annualInterestRate: number,
  repaymentRatePercent: number
): FinancingResult {
  const loanAmount = price - equity;
  const monthlyInterestRate = annualInterestRate / 100 / 12;
  const monthlyRepaymentRate = repaymentRatePercent / 100 / 12;
  const monthlyRate = loanAmount * (monthlyInterestRate + monthlyRepaymentRate);
  const monthlyInterest = loanAmount * monthlyInterestRate;
  const monthlyRepayment = loanAmount * monthlyRepaymentRate;

  return {
    loanAmount,
    monthlyRate,
    monthlyInterest,
    monthlyRepayment,
    annualCost: monthlyRate * 12,
  };
}

export function calculateCashflow(params: CashflowParams): CashflowResult {
  const {
    purchasePrice,
    equity,
    monthlyRent,
    monthlyHausgeld,
    managementCostPercent,
    vacancyRatePercent,
    maintenanceReservePercent,
    interestRate,
    repaymentRate,
  } = params;

  const financing = calculateFinancing(purchasePrice, equity, interestRate, repaymentRate);
  const monthlyEffectiveRent = monthlyRent * (1 - vacancyRatePercent / 100);
  const monthlyManagementCost = monthlyEffectiveRent * (managementCostPercent / 100);
  const monthlyMaintenanceReserve = (purchasePrice * (maintenanceReservePercent / 100)) / 12;

  const monthlyExpenses =
    financing.monthlyRate +
    monthlyHausgeld +
    monthlyManagementCost +
    monthlyMaintenanceReserve;

  const monthlyCashflow = monthlyEffectiveRent - monthlyExpenses;

  return {
    monthlyGrossRent: monthlyRent,
    monthlyEffectiveRent,
    monthlyFinancingCost: financing.monthlyRate,
    monthlyManagementCost,
    monthlyMaintenanceReserve,
    monthlyHausgeld,
    monthlyCashflow,
    annualCashflow: monthlyCashflow * 12,
  };
}

export function calculateYields(
  purchasePrice: number,
  equity: number,
  annualRent: number,
  annualCosts: number,
  annualCashflow: number,
  purchaseCostsTotal: number
): YieldResult {
  const totalInvestment = purchasePrice + purchaseCostsTotal;
  const grossYield = (annualRent / totalInvestment) * 100;
  const netYield = ((annualRent - annualCosts) / totalInvestment) * 100;
  const cashOnCash = equity > 0 ? (annualCashflow / equity) * 100 : 0;

  // Simplified IRR approximation (5-year holding period, 2% annual appreciation)
  const assumedAppreciation = 0.02;
  const futureValue = totalInvestment * Math.pow(1 + assumedAppreciation, 5);
  const gain = futureValue - totalInvestment + annualCashflow * 5;
  const irr = (Math.pow(1 + gain / totalInvestment, 1 / 5) - 1) * 100;

  const roi = ((annualCashflow * 5 + (futureValue - totalInvestment)) / equity) * 100;

  return {
    grossYield,
    netYield,
    cashOnCash,
    irr,
    roi,
  };
}

export function calculateMarketDeviation(
  pricePerSqm: number,
  avgMarketPricePerSqm: number
): number {
  return ((pricePerSqm - avgMarketPricePerSqm) / avgMarketPricePerSqm) * 100;
}
