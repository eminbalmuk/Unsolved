"use client";

import { useSyncExternalStore } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { PainScoreBreakdown, Problem } from "@/lib/types";

const colors = ["var(--chart-1)", "var(--chart-2)", "var(--chart-3)"];
const subscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}

export function TrendChart({ problem }: { problem: Problem }) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-52 w-full rounded-md bg-muted/40" />;
  }

  return (
    <div className="h-52 w-full">
      <ResponsiveContainer minWidth={1}>
        <AreaChart data={problem.trend} margin={{ left: -24, right: 8 }}>
          <defs>
            <linearGradient id="scoreGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.45} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Area
            type="monotone"
            dataKey="score"
            stroke="var(--chart-1)"
            strokeWidth={2}
            fill="url(#scoreGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function BreakdownChart({
  breakdown,
}: {
  breakdown: PainScoreBreakdown;
}) {
  const mounted = useMounted();
  const data = [
    { name: "Frequency", value: breakdown.frequency },
    { name: "Emotion", value: breakdown.emotionalIntensity },
    { name: "WTP", value: breakdown.willingnessToPay },
  ];

  if (!mounted) {
    return <div className="h-64 w-full rounded-md bg-muted/40" />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer minWidth={1}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            innerRadius={58}
            outerRadius={90}
            paddingAngle={4}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ReportBarChart({
  data,
}: {
  data: { label: string; value: number }[];
}) {
  const mounted = useMounted();

  if (!mounted) {
    return <div className="h-64 w-full rounded-md bg-muted/40" />;
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer minWidth={1}>
        <BarChart data={data} margin={{ left: -18, right: 8 }}>
          <CartesianGrid stroke="var(--border)" strokeDasharray="4 4" />
          <XAxis dataKey="label" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip
            contentStyle={{
              background: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="var(--chart-2)" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
