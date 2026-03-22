"use client";

import { useState, useEffect } from "react";
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

function getCWVBadge(score: number): { label: string; color: string; bg: string; border: string } {
  if (score >= 80) return { label: "Good", color: "#00ff88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.2)" };
  if (score >= 60) return { label: "Needs Work", color: "#ff8800", bg: "rgba(255,136,0,0.08)", border: "rgba(255,136,0,0.2)" };
  return { label: "Poor", color: "#ff4444", bg: "rgba(255,68,68,0.08)", border: "rgba(255,68,68,0.2)" };
}

function SpeedGauge({ score, loaded }: { score: number; loaded: boolean }) {
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setAnimated(true), 300);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [loaded]);

  const color = getScoreColor(score);
  const radius = 52;
  const cx = 65;
  const cy = 65;
  const startAngle = -225;
  const endAngle = 45;
  const totalAngle = endAngle - startAngle;
  const scoreAngle = startAngle + (score / 100) * totalAngle;

  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const arcPath = (start: number, end: number, r: number) => {
    const x1 = cx + r * Math.cos(toRad(start));
    const y1 = cy + r * Math.sin(toRad(start));
    const x2 = cx + r * Math.cos(toRad(end));
    const y2 = cy + r * Math.sin(toRad(end));
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  const needleAngle = animated ? scoreAngle : startAngle;
  const needleX = cx + (radius - 8) * Math.cos(toRad(needleAngle));
  const needleY = cy + (radius - 8) * Math.sin(toRad(needleAngle));

  return (
    <div className="flex flex-col items-center mb-2">
      <svg width="130" height="90" viewBox="0 0 130 90">
        <path d={arcPath(startAngle, endAngle, radius)} fill="none" stroke="#1a1a1a" strokeWidth="8" strokeLinecap="round" />
        <path
          d={arcPath(startAngle, animated ? scoreAngle : startAngle, radius)}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          style={{
            transition: "d 1s cubic-bezier(0.16, 1, 0.3, 1)",
            filter: `drop-shadow(0 0 6px ${color}40)`,
          }}
        />
        <line
          x1={cx}
          y1={cy}
          x2={needleX}
          y2={needleY}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          style={{ transition: "all 1s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
        <circle cx={cx} cy={cy} r="3" fill="white" />
        <text x={cx} y={cy - 10} textAnchor="middle" fill="white" fontSize="22" fontFamily="monospace" fontWeight="bold">
          {animated ? score : 0}
        </text>
        <text x={cx} y={cy + 4} textAnchor="middle" fill="#666" fontSize="8" fontFamily="monospace">
          /100
        </text>
      </svg>
      <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color }}>
        {score >= 80 ? "FAST" : score >= 60 ? "MODERATE" : "SLOW"}
      </span>
    </div>
  );
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
          <SpeedGauge score={avgScore} loaded={loaded} />

          {data.map((metric, i) => {
            const color = getScoreColor(metric.score);
            const badge = getCWVBadge(metric.score);
            return (
              <div
                key={metric.label}
                style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 70}ms forwards`, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-zinc-400">{metric.label}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className="cwv-badge"
                      style={{ color: badge.color, background: badge.bg, borderColor: badge.border }}
                    >
                      {badge.label}
                    </span>
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
