"use client";

import { TrendingUp } from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { MarketDataPoint } from "@/lib/mockData";

interface MarketTrendsProps {
  data: MarketDataPoint[];
  visible: boolean;
  loaded: boolean;
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#1a1a1a] border border-zinc-700 rounded px-3 py-2 text-xs font-mono">
      <div className="text-zinc-400 mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} style={{ color: p.color }}>
          {p.dataKey === "value" ? "Value" : "Rent"}: $
          {p.value.toLocaleString()}
        </div>
      ))}
    </div>
  );
}

export function MarketTrends({ data, visible, loaded }: MarketTrendsProps) {
  return (
    <PanelCard
      title="MARKET TRENDS"
      icon={<TrendingUp size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs text-zinc-500 font-mono">5Y</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="h-[260px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1a1a1a" />
              <XAxis
                dataKey="year"
                tick={{ fill: "#666", fontSize: 10 }}
                tickLine={false}
                axisLine={{ stroke: "#222" }}
                interval={3}
              />
              <YAxis
                yAxisId="value"
                tick={{ fill: "#666", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`}
                width={55}
              />
              <YAxis
                yAxisId="rent"
                orientation="right"
                tick={{ fill: "#666", fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                width={45}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                yAxisId="value"
                type="monotone"
                dataKey="value"
                stroke="#00ff88"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: "#00ff88" }}
              />
              <Line
                yAxisId="rent"
                type="monotone"
                dataKey="rent"
                stroke="#00aaff"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 4"
                activeDot={{ r: 4, fill: "#00aaff" }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-1 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-accent" />
              <span className="text-zinc-500">Property Value</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 bg-[#00aaff]" style={{ borderTop: "1px dashed" }} />
              <span className="text-zinc-500">Rental Rate</span>
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
}
