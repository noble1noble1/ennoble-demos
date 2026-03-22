"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { AIReadinessMetric } from "@/lib/mockData";

interface AIReadinessProps {
  data: AIReadinessMetric[];
  visible: boolean;
  loaded: boolean;
}

function SpiderChart({ factors, animated }: { factors: AIReadinessMetric[]; animated: boolean }) {
  const cx = 110;
  const cy = 110;
  const maxR = 75;
  const rings = [0.25, 0.5, 0.75, 1.0];
  const n = factors.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function getPoint(i: number, ratio: number): [number, number] {
    const angle = startAngle + i * angleStep;
    return [cx + Math.cos(angle) * maxR * ratio, cy + Math.sin(angle) * maxR * ratio];
  }

  function polygonPoints(ratio: number): string {
    return factors.map((_, i) => getPoint(i, ratio).join(",")).join(" ");
  }

  const dataPoints = factors.map((f, i) => getPoint(i, animated ? f.score / 100 : 0));
  const dataPolygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox="0 0 220 220" className="w-full max-w-[220px]">
      <defs>
        <linearGradient id="aiSpiderFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00ccff" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      {rings.map((r, i) => (
        <polygon key={i} points={polygonPoints(r)} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      ))}
      {/* Ring labels */}
      <text x={cx + 4} y={cy - maxR * 0.5 + 3} fill="#333" fontSize="7" fontFamily="monospace">50</text>
      <text x={cx + 4} y={cy - maxR + 3} fill="#333" fontSize="7" fontFamily="monospace">100</text>
      {factors.map((_, i) => {
        const [x, y] = getPoint(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />;
      })}
      <polygon
        points={dataPolygon}
        fill="url(#aiSpiderFill)"
        stroke="#00ff88"
        strokeWidth="1.5"
        style={{ filter: "drop-shadow(0 0 3px rgba(0,255,136,0.3))", transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s" }}
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill={factors[i].color} stroke="#000" strokeWidth="1"
          style={{ filter: `drop-shadow(0 0 3px ${factors[i].color})`, transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s" }}
        />
      ))}
      {/* Labels positioned outside with score */}
      {factors.map((f, i) => {
        const [x, y] = getPoint(i, 1.35);
        const labelParts = f.label.split(" ");
        const line1 = labelParts.slice(0, 2).join(" ");
        const isLeft = x < cx;
        const anchor = Math.abs(x - cx) < 10 ? "middle" : isLeft ? "end" : "start";
        return (
          <g key={i}>
            <text x={x} y={y - 4} textAnchor={anchor} dominantBaseline="middle" fill="#888" fontSize="8" fontFamily="monospace">
              {line1}
            </text>
            <text x={x} y={y + 6} textAnchor={anchor} dominantBaseline="middle" fill={f.color} fontSize="8" fontFamily="monospace" fontWeight="bold">
              {f.score}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export function AIReadiness({ data, visible, loaded }: AIReadinessProps) {
  const [animated, setAnimated] = useState(false);
  const avgScore = Math.round(data.reduce((s, m) => s + m.score, 0) / data.length);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setAnimated(true), 300);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [loaded]);

  const overallColor = avgScore >= 70 ? "#00ff88" : avgScore >= 50 ? "#ff8800" : "#ff4444";
  const overallLabel = avgScore >= 70 ? "AI READY" : avgScore >= 50 ? "NEEDS WORK" : "NOT READY";

  return (
    <PanelCard
      title="AI READINESS"
      icon={<Brain size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs font-mono font-bold" style={{ color: overallColor }}>
            {overallLabel}
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-3">
          <div className="flex justify-center">
            <SpiderChart factors={data} animated={animated} />
          </div>
          <div className="text-center">
            <div className="text-2xl font-mono font-bold" style={{ color: overallColor }}>{avgScore}</div>
            <div className="text-[9px] text-zinc-600 font-mono tracking-wider">AI READINESS SCORE</div>
          </div>
          <div className="space-y-1.5">
            {data.map((metric, i) => (
              <div
                key={metric.label}
                style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 50}ms forwards`, opacity: 0 }}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-[10px] text-zinc-400">{metric.label}</span>
                  <span className="text-[10px] font-mono font-bold" style={{ color: metric.color }}>{metric.score}</span>
                </div>
                <div className="metric-bar">
                  <div className="metric-bar-fill" style={{ width: animated ? `${metric.score}%` : "0%", background: metric.color, boxShadow: `0 0 4px ${metric.color}30` }} />
                </div>
                <div className="text-[9px] text-zinc-600 mt-0.5">{metric.detail}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
