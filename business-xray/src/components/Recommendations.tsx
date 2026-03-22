"use client";

import { Lightbulb, ArrowUpRight, Zap, Clock, Wrench } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { Recommendation } from "@/lib/mockData";

interface RecommendationsProps {
  data: Recommendation[];
  visible: boolean;
  loaded: boolean;
}

const impactColors = {
  high: { color: "#00ff88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.2)", label: "HIGH" },
  medium: { color: "#00ccff", bg: "rgba(0,204,255,0.08)", border: "rgba(0,204,255,0.2)", label: "MED" },
  low: { color: "#888", bg: "rgba(136,136,136,0.08)", border: "rgba(136,136,136,0.2)", label: "LOW" },
};

const effortIcons = {
  easy: { icon: Zap, label: "Quick Win" },
  moderate: { icon: Clock, label: "Moderate" },
  hard: { icon: Wrench, label: "Complex" },
};

export function Recommendations({ data, visible, loaded }: RecommendationsProps) {
  const highImpact = data.filter((r) => r.impact === "high").length;

  return (
    <PanelCard
      title="AI RECOMMENDATIONS"
      icon={<Lightbulb size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-[10px] font-mono" style={{ color: "#00ff88" }}>
            {highImpact} high impact
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-2">
          {data.map((rec, i) => {
            const impact = impactColors[rec.impact];
            const effort = effortIcons[rec.effort];
            const EffortIcon = effort.icon;
            return (
              <div
                key={rec.id}
                className="rec-item"
                style={{
                  animation: `fadeSlideIn 0.4s ease-out ${i * 60}ms forwards`,
                  opacity: 0,
                  borderLeft: `2px solid ${impact.color}`,
                }}
              >
                <div className="flex items-start gap-2">
                  <ArrowUpRight size={12} style={{ color: impact.color, marginTop: 2, flexShrink: 0 }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-zinc-300 font-medium leading-tight">{rec.title}</div>
                    <div className="text-[10px] text-zinc-600 mt-1 leading-snug">{rec.description}</div>
                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className="rec-badge"
                        style={{ color: impact.color, background: impact.bg, borderColor: impact.border }}
                      >
                        {impact.label} IMPACT
                      </span>
                      <span className="rec-effort">
                        <EffortIcon size={8} />
                        {effort.label}
                      </span>
                      <span className="text-[8px] text-zinc-600 font-mono ml-auto">{rec.category}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PanelCard>
  );
}
