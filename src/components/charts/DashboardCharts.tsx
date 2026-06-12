"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import type { Property } from "@/data/mock-properties";

interface DashboardChartsProps {
  properties: Property[];
}

const cityColors: Record<string, string> = {
  Berlin: "#3b82f6",
  München: "#8b5cf6",
  Hamburg: "#06b6d4",
  Frankfurt: "#f59e0b",
  Leipzig: "#22c55e",
  Köln: "#f97316",
  Stuttgart: "#ec4899",
  Düsseldorf: "#a78bfa",
  Magdeburg: "#34d399",
  Halle: "#fb923c",
  Erfurt: "#60a5fa",
  Dresden: "#4ade80",
  Hannover: "#fbbf24",
  Augsburg: "#c084fc",
  Regensburg: "#f472b6",
  Chemnitz: "#94a3b8",
  Nürnberg: "#67e8f9",
};

export function DashboardCharts({ properties }: DashboardChartsProps) {
  // Rendite nach Stadt
  const cityData = Object.entries(
    properties.reduce((acc, p) => {
      if (!acc[p.city]) acc[p.city] = { city: p.city, count: 0, avgYield: 0, avgScore: 0 };
      acc[p.city].count++;
      acc[p.city].avgYield += p.analysis.grossYield;
      acc[p.city].avgScore += p.analysis.dealScore;
      return acc;
    }, {} as Record<string, { city: string; count: number; avgYield: number; avgScore: number }>)
  )
    .map(([, v]) => ({
      city: v.city,
      avgYield: Math.round((v.avgYield / v.count) * 10) / 10,
      avgScore: Math.round(v.avgScore / v.count),
      count: v.count,
    }))
    .sort((a, b) => b.avgYield - a.avgYield)
    .slice(0, 8);

  // Cashflow-Verteilung
  const cashflowData = [
    { range: ">500€", count: properties.filter((p) => p.analysis.cashflow > 500).length },
    { range: "200-500€", count: properties.filter((p) => p.analysis.cashflow >= 200 && p.analysis.cashflow <= 500).length },
    { range: "0-200€", count: properties.filter((p) => p.analysis.cashflow >= 0 && p.analysis.cashflow < 200).length },
    { range: "-200-0€", count: properties.filter((p) => p.analysis.cashflow >= -200 && p.analysis.cashflow < 0).length },
    { range: "<-200€", count: properties.filter((p) => p.analysis.cashflow < -200).length },
  ];

  const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{value: number; name: string}>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          <p className="text-gray-400 text-xs mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} className="text-white text-sm font-medium">
              {p.name}: {p.value}{p.name.includes("Rendite") ? "%" : ""}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Rendite nach Stadt */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Ø Rendite nach Stadt</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={cityData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="city" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} unit="%" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgYield" name="Ø Rendite" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Cashflow-Verteilung */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Cashflow-Verteilung</h3>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={cashflowData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="range" tick={{ fill: "#6b7280", fontSize: 11 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 11 }} />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              name="Anzahl"
              radius={[4, 4, 0, 0]}
              fill="#22c55e"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
