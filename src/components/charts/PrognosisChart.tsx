"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface PrognosisChartProps {
  prognosis: {
    pessimistic: { year1: number; year5: number; year10: number };
    realistic: { year1: number; year5: number; year10: number };
    optimistic: { year1: number; year5: number; year10: number };
  };
}

export function PrognosisChart({ prognosis }: PrognosisChartProps) {
  const data = [
    { year: "Heute", pessimistic: 0, realistic: 0, optimistic: 0 },
    { year: "1 Jahr", pessimistic: prognosis.pessimistic.year1, realistic: prognosis.realistic.year1, optimistic: prognosis.optimistic.year1 },
    { year: "5 Jahre", pessimistic: prognosis.pessimistic.year5, realistic: prognosis.realistic.year5, optimistic: prognosis.optimistic.year5 },
    { year: "10 Jahre", pessimistic: prognosis.pessimistic.year10, realistic: prognosis.realistic.year10, optimistic: prognosis.optimistic.year10 },
  ];

  return (
    <div>
      <h3 className="text-white font-semibold mb-4">Wertentwicklung – Szenarien</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis dataKey="year" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6b7280", fontSize: 12 }} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151", borderRadius: "8px" }}
            labelStyle={{ color: "#f9fafb" }}
            formatter={(value) => [`${Number(value) > 0 ? "+" : ""}${Number(value).toFixed(1)} %`, ""]}
          />
          <Legend
            wrapperStyle={{ paddingTop: "16px" }}
            formatter={(value) => <span style={{ color: "#9ca3af", fontSize: "12px" }}>{value}</span>}
          />
          <Line type="monotone" dataKey="optimistic" name="Optimistisch" stroke="#4ade80" strokeWidth={2} dot={{ r: 4, fill: "#4ade80" }} />
          <Line type="monotone" dataKey="realistic" name="Realistisch" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4, fill: "#3b82f6" }} />
          <Line type="monotone" dataKey="pessimistic" name="Pessimistisch" stroke="#f87171" strokeWidth={2} dot={{ r: 4, fill: "#f87171" }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
