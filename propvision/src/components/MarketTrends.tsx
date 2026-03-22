"use client";

import { useState, useEffect, useMemo, memo } from "react";
import { TrendingUp } from "lucide-react";
import {
  AreaChart,
  Area,
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

type Period = "1Y" | "3Y" | "5Y" | "10Y";

const periodQuarters: Record<Period, number> = {
  "1Y": 4,
  "3Y": 12,
  "5Y": 20,
  "10Y": 40,
};

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; dataKey: string; color: string }>; label?: string }) {
  if (!active || !payload) return null;
  return (
    <div className="bg-[#0d0d0d] border border-zinc-700/50 rounded-lg px-4 py-3 text-xs font-mono shadow-xl shadow-black/50 backdrop-blur-sm">
      <div className="text-zinc-400 mb-2 text-[10px] uppercase tracking-wider">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-2 py-0.5">
          <div className="w-2 h-2 rounded-full" style={{ background: p.color, boxShadow: `0 0 6px ${p.color}` }} />
          <span style={{ color: p.color }} className="font-semibold">
            {p.dataKey === "value" ? "Value" : "Rent"}: $
            {p.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

export const MarketTrends = memo(function MarketTrends({ data, visible, loaded }: MarketTrendsProps) {
  const [animate, setAnimate] = useState(false);
  const [period, setPeriod] = useState<Period>("5Y");

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setAnimate(true), 100);
      return () => clearTimeout(t);
    }
    setAnimate(false);
  }, [loaded]);

  const filteredData = useMemo(() => {
    const count = periodQuarters[period];
    return data.slice(-count);
  }, [data, period]);

  // Calculate appreciation for selected period
  const firstValue = filteredData[0]?.value ?? 0;
  const lastValue = filteredData[filteredData.length - 1]?.value ?? 0;
  const appreciation = firstValue > 0 ? (((lastValue - firstValue) / firstValue) * 100).toFixed(1) : "0";

  const periods: Period[] = ["1Y", "3Y", "5Y", "10Y"];

  return (
    <PanelCard
      title="MARKET TRENDS"
      icon={<TrendingUp size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <div className="flex items-center gap-3">
            <span className="tag tag-green">+{appreciation}%</span>
          </div>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className={`market-trends-chart ${animate ? "chart-animated" : "chart-initial"}`}>
          {/* Period Selector */}
          <div className="flex items-center justify-center gap-1 mb-3">
            {periods.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className="period-tab"
                style={{
                  color: period === p ? "var(--accent)" : "#555",
                  background: period === p ? "rgba(0,255,136,0.08)" : "transparent",
                  borderColor: period === p ? "rgba(0,255,136,0.2)" : "transparent",
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <div className="h-[240px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                <defs>
                  <linearGradient id="valueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ff88" stopOpacity={0.3} />
                    <stop offset="50%" stopColor="#00ff88" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="#00ff88" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="rentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00ccff" stopOpacity={0.2} />
                    <stop offset="50%" stopColor="#00ccff" stopOpacity={0.05} />
                    <stop offset="100%" stopColor="#00ccff" stopOpacity={0} />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="2" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis
                  dataKey="year"
                  tick={{ fill: "#555", fontSize: 10 }}
                  tickLine={false}
                  axisLine={{ stroke: "rgba(255,255,255,0.06)" }}
                  interval={Math.max(0, Math.floor(filteredData.length / 6) - 1)}
                />
                <YAxis
                  yAxisId="value"
                  tick={{ fill: "#555", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000000).toFixed(1)}M`}
                  width={55}
                />
                <YAxis
                  yAxisId="rent"
                  orientation="right"
                  tick={{ fill: "#555", fontSize: 10 }}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v: number) => `$${(v / 1000).toFixed(1)}k`}
                  width={45}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(255,255,255,0.06)", strokeWidth: 1 }} />
                <Area
                  yAxisId="value"
                  type="monotone"
                  dataKey="value"
                  stroke="#00ff88"
                  strokeWidth={2.5}
                  fill="url(#valueGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#00ff88", stroke: "#000", strokeWidth: 2, filter: "url(#glow)" }}
                  isAnimationActive={animate}
                  animationDuration={1500}
                  animationEasing="ease-out"
                />
                <Area
                  yAxisId="rent"
                  type="monotone"
                  dataKey="rent"
                  stroke="#00ccff"
                  strokeWidth={2}
                  fill="url(#rentGradient)"
                  dot={false}
                  strokeDasharray="6 3"
                  activeDot={{ r: 5, fill: "#00ccff", stroke: "#000", strokeWidth: 2, filter: "url(#glow)" }}
                  isAnimationActive={animate}
                  animationDuration={1800}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <div className="w-4 h-[3px] rounded-full bg-[#00ff88]" style={{ boxShadow: "0 0 6px rgba(0,255,136,0.5)" }} />
              <span className="text-zinc-500">Property Value</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-[3px] rounded-full bg-[#00ccff] opacity-80" style={{ backgroundImage: "repeating-linear-gradient(90deg, #00ccff 0px, #00ccff 4px, transparent 4px, transparent 7px)" }} />
              <span className="text-zinc-500">Rental Rate</span>
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
});
