import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "EUR"): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number, decimals = 1): string {
  return new Intl.NumberFormat("de-DE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
}

export function formatPercent(num: number, decimals = 1): string {
  return `${formatNumber(num, decimals)} %`;
}

export function getDealScoreColor(score: number): string {
  if (score >= 80) return "text-green-400";
  if (score >= 70) return "text-amber-400";
  return "text-red-400";
}

export function getDealScoreBg(score: number): string {
  if (score >= 80) return "bg-green-400/10 border-green-400/30 text-green-400";
  if (score >= 70) return "bg-amber-400/10 border-amber-400/30 text-amber-400";
  return "bg-red-400/10 border-red-400/30 text-red-400";
}

export function getDealScoreLabel(score: number): string {
  if (score >= 90) return "Außergewöhnlich";
  if (score >= 80) return "Sehr attraktiv";
  if (score >= 70) return "Interessant";
  return "Nicht empfohlen";
}

export function getPriceAssessmentColor(assessment: string): string {
  switch (assessment) {
    case "STRONGLY_UNDERVALUED": return "text-green-400";
    case "UNDERVALUED": return "text-emerald-400";
    case "FAIR": return "text-blue-400";
    case "OVERVALUED": return "text-amber-400";
    case "STRONGLY_OVERVALUED": return "text-red-400";
    default: return "text-gray-400";
  }
}

export function getPriceAssessmentLabel(assessment: string): string {
  switch (assessment) {
    case "STRONGLY_UNDERVALUED": return "Stark unterbewertet";
    case "UNDERVALUED": return "Unterbewertet";
    case "FAIR": return "Fair bewertet";
    case "OVERVALUED": return "Überbewertet";
    case "STRONGLY_OVERVALUED": return "Stark überbewertet";
    default: return "Unbekannt";
  }
}
