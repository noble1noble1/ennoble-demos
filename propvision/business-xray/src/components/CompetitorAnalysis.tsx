"use client";

import { Target, TrendingUp, TrendingDown } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { Competitor } from "@/lib/mockData";

interface CompetitorAnalysisProps {
  data: Competitor[];
  subjectScore: number;
  visible: boolean;
  loaded: boolean;
}

function getScoreColor(score: number): string {
  if (score >= 80) return "#00ff88";
  if (score >= 60) return "#ff8800";
  return "#ff4444";
}

export function CompetitorAnalysis({ data, subjectScore, visible, loaded }: CompetitorAnalysisProps) {
  return (
    <PanelCard
      title="COMPETITOR ANALYSIS"
      icon={<Target size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-[10px] text-zinc-500 font-mono">{data.length} found</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-2">
          {/* Subject row */}
          <div className="competitor-row" style={{ background: "rgba(0,255,136,0.02)", borderRadius: 6, padding: "8px 10px" }}>
            <div className="flex-1 min-w-0">
              <div className="text-[12px] text-accent font-medium">Your Site</div>
              <div className="text-[9px] text-zinc-600 font-mono">brightleaf-coffee.com</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-mono font-bold" style={{ color: getScoreColor(subjectScore) }}>
                {subjectScore}
              </div>
            </div>
          </div>

          {data.map((comp, i) => {
            const diff = comp.overallScore - subjectScore;
            return (
              <div
                key={comp.name}
                className="competitor-row"
                style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 80}ms forwards`, opacity: 0 }}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-zinc-300 font-medium">{comp.name}</div>
                  <div className="text-[9px] text-zinc-600 font-mono">{comp.url}</div>
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {comp.strengths.slice(0, 2).map((s) => (
                      <span key={s} className="tag tag-green text-[8px]">{s}</span>
                    ))}
                    {comp.weaknesses.slice(0, 1).map((w) => (
                      <span key={w} className="tag tag-red text-[8px]">{w}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-1">
                  <div className="text-lg font-mono font-bold" style={{ color: getScoreColor(comp.overallScore) }}>
                    {comp.overallScore}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] font-mono">
                    {diff > 0 ? (
                      <>
                        <TrendingUp size={9} className="text-red-400/70" />
                        <span className="text-red-400/70">+{diff}</span>
                      </>
                    ) : (
                      <>
                        <TrendingDown size={9} className="text-accent/70" />
                        <span className="text-accent/70">{diff}</span>
                      </>
                    )}
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
