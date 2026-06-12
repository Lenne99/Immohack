"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";

interface CityStatItem {
  city: string;
  count: number;
  avgPrice: number;
  avgPricePerSqm: number;
  avgYield: number;
  avgScore: number;
}

export function MarketCharts({ cityStats }: { cityStats: CityStatItem[] }) {
  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ value: number; name: string }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
          {payload.map((p, i) => (
            <p key={i} className="text-white text-sm">{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Ø Preis pro m² nach Stadt</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={cityStats.slice(0, 8)} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="city" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} unit="€" />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgPricePerSqm" name="€/m²" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Ø Deal Score nach Stadt</h3>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={cityStats} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="city" tick={{ fill: "#6b7280", fontSize: 10 }} />
            <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="avgScore" name="Score" fill="#f59e0b" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
