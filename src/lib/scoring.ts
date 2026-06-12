export interface ScoringParams {
  grossYield: number;
  netYield: number;
  cashflow: number;
  locationScore: number;
  marketDeviation: number; // negative = underpriced (better)
  renovationRisk: number; // 0-100, lower is better
  rentabilityScore: number; // 0-100
  pricePerSqm: number;
  avgCityPricePerSqm: number;
}

export interface ScoringResult {
  dealScore: number;
  yieldScore: number;
  locationScore: number;
  valueScore: number;
  riskScore: number;
  rentabilityScore: number;
  breakdown: Record<string, number>;
}

export function calculateDealScore(params: ScoringParams): ScoringResult {
  // Yield Score (30% weight)
  let yieldScore = 0;
  if (params.grossYield >= 8) yieldScore = 100;
  else if (params.grossYield >= 6) yieldScore = 75 + (params.grossYield - 6) * 12.5;
  else if (params.grossYield >= 4) yieldScore = 40 + (params.grossYield - 4) * 17.5;
  else if (params.grossYield >= 2) yieldScore = (params.grossYield - 2) * 20;
  else yieldScore = 0;

  if (params.cashflow > 0) yieldScore = Math.min(100, yieldScore + 10);
  else if (params.cashflow < -200) yieldScore = Math.max(0, yieldScore - 20);

  // Value Score (25% weight) — market deviation
  let valueScore = 50; // fair = 50
  if (params.marketDeviation <= -20) valueScore = 100;
  else if (params.marketDeviation <= -10) valueScore = 80 + ((-params.marketDeviation - 10) * 2);
  else if (params.marketDeviation <= 0) valueScore = 60 + (-params.marketDeviation * 2);
  else if (params.marketDeviation <= 10) valueScore = 60 - params.marketDeviation * 2;
  else if (params.marketDeviation <= 20) valueScore = 40 - (params.marketDeviation - 10) * 2;
  else valueScore = Math.max(0, 20 - (params.marketDeviation - 20));

  // Risk Score (20% weight) — lower renovation risk = better
  const riskScore = Math.max(0, 100 - params.renovationRisk);

  // Location Score (15% weight)
  const locationScoreNormalized = Math.min(100, Math.max(0, params.locationScore));

  // Rentability Score (10% weight)
  const rentabilityNormalized = Math.min(100, Math.max(0, params.rentabilityScore));

  const dealScore = Math.round(
    yieldScore * 0.3 +
    valueScore * 0.25 +
    riskScore * 0.2 +
    locationScoreNormalized * 0.15 +
    rentabilityNormalized * 0.1
  );

  return {
    dealScore: Math.min(100, Math.max(0, dealScore)),
    yieldScore: Math.round(yieldScore),
    locationScore: Math.round(locationScoreNormalized),
    valueScore: Math.round(valueScore),
    riskScore: Math.round(riskScore),
    rentabilityScore: Math.round(rentabilityNormalized),
    breakdown: {
      "Rendite (30%)": Math.round(yieldScore * 0.3),
      "Bewertung (25%)": Math.round(valueScore * 0.25),
      "Risiko (20%)": Math.round(riskScore * 0.2),
      "Lage (15%)": Math.round(locationScoreNormalized * 0.15),
      "Vermietbarkeit (10%)": Math.round(rentabilityNormalized * 0.1),
    },
  };
}

export function getPriceAssessment(marketDeviation: number): string {
  if (marketDeviation <= -15) return "STRONGLY_UNDERVALUED";
  if (marketDeviation <= -5) return "UNDERVALUED";
  if (marketDeviation <= 5) return "FAIR";
  if (marketDeviation <= 15) return "OVERVALUED";
  return "STRONGLY_OVERVALUED";
}
