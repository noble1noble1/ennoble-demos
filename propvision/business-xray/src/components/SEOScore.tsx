"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { SEOMetric } from "@/lib/mockData";

interface SEOScoreProps {
  data: SEOMetric[];
  visible: boolean;
  loaded: boolean;
}

function ScoreRing({ score, loaded }: { score: number; loaded: boolean }) {
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setAnimated(true), 300);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [loaded]);

  const color = score >= 80 ? "#00ff88" : score >= 60 ? "#ff8800" : "#ff4444";

  return (
    <div className="score-ring-container">
      <svg width="96" height="96" viewBox="0 0 96 96">
        <circle cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="6" opacity="0.12" />
        <circle
          cx="48" cy="48" r={radius} fill="none" stroke={color} strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? targetOffset : circumference}
          transform="rotate(-90 48 48)"
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s", filter: `drop-shadow(0 0 4px ${color}40)` }}
        />
        <text x="48" y="46" textAnchor="middle" fill="white" fontSize="22" fontFamily="monospace" fontWeight="bold"
          className={animated ? "score-value-text" : ""} style={{ opacity: animated ? undefined : 0 }}
        >{score}</text>
        <text x="48" y="60" textAnchor="middle" fill="#555" fontSize="9" fontFamily="monospace"
          className={animated ? "score-value-text" : ""} style={{ opacity: animated ? undefined : 0 }}
        >/100</text>
      </svg>
      <div className="text-[10px] font-mono tracking-wider" style={{ color }}>
        {score >= 80 ? "GOOD" : score >= 60 ? "NEEDS WORK" : "CRITICAL"}
      </div>
    </div>
  );
}

const statusColor = { good: "#00ff88", warning: "#ff8800", critical: "#ff4444" };

export function SEOScore({ data, visible, loaded }: SEOScoreProps) {
  const avgScore = Math.round(data.reduce((s, m) => s + m.score, 0) / data.length);

  return (
    <PanelCard
      title="SEO HEALTH"
      icon={<Search size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={loaded ? <span className="tag tag-green">{avgScore}/100</span> : null}
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-3">
          <div className="flex justify-center">
            <ScoreRing score={avgScore} loaded={loaded} />
          </div>
          <div className="space-y-1.5">
            {data.map((metric, i) => (
              <div
                key={metric.label}
                className="flex items-center gap-2"
                style={{ animation: `fadeSlideIn 0.3s ease-out ${i * 50}ms forwards`, opacity: 0 }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                  style={{ background: statusColor[metric.status], boxShadow: `0 0 4px ${statusColor[metric.status]}40` }}
                />
                <span className="text-[11px] text-zinc-400 flex-1">{metric.label}</span>
                <div className="w-16 metric-bar">
                  <div className="metric-bar-fill" style={{ width: `${metric.score}%`, background: statusColor[metric.status] }} />
                </div>
                <span className="text-[10px] font-mono w-8 text-right" style={{ color: statusColor[metric.status] }}>
                  {metric.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
