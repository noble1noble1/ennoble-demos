"use client";

import { Gauge } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { PerformanceMetric } from "@/lib/mockData";

interface PerformanceProps {
  data: PerformanceMetric[];
  visible: boolean;
  loaded: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#00ff88";
  if (score >= 60) return "#ff8800";
  return "#ff4444";
}

export function PerformanceMetrics({ data, visible, loaded }: PerformanceProps) {
  const avgScore = Math.round(data.reduce((s, m) => s + m.score, 0) / data.length);

  return (
    <PanelCard
      title="PERFORMANCE"
      icon={<Gauge size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs font-mono font-bold" style={{ color: getScoreColor(avgScore) }}>
            {avgScore}/100
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-3">
          {data.map((metric, i) => {
            const color = getScoreColor(metric.score);
            return (
              <div
                key={metric.label}
                style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 70}ms forwards`, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-zinc-400">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-mono font-bold" style={{ color }}>
                      {metric.value}{metric.unit}
                    </span>
                    <span className="text-[9px] text-zinc-600 font-mono">{metric.benchmark}</span>
                  </div>
                </div>
                <div className="metric-bar">
                  <div
                    className="metric-bar-fill"
                    style={{
                      width: `${metric.score}%`,
                      background: color,
                      boxShadow: `0 0 6px ${color}30`,
                    }}
                  />
                </div>
              </div>
            );
          })}
          <div className="pt-2 border-t border-zinc-800/50">
            <div className="flex justify-between text-[10px]">
              <span className="text-zinc-600 font-mono">Core Web Vitals</span>
              <span className="font-mono" style={{ color: getScoreColor(avgScore) }}>
                {avgScore >= 80 ? "PASSING" : avgScore >= 60 ? "NEEDS IMPROVEMENT" : "FAILING"}
              </span>
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
}
