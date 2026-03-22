"use client";

import { useState } from "react";
import { Target } from "lucide-react";
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
  const [selectedCompetitor, setSelectedCompetitor] = useState<string | null>(null);
  const maxScore = Math.max(subjectScore, ...data.map((c) => c.overallScore));

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
        <div className="space-y-3">
          {/* Visual bar chart */}
          <div className="comp-chart">
            {/* Subject bar */}
            <div className="comp-chart-row">
              <div className="comp-chart-label">
                <span className="text-[10px] font-mono font-bold text-accent truncate">Your Site</span>
              </div>
              <div className="comp-chart-bar-wrap">
                <div
                  className="comp-chart-bar comp-chart-bar-subject"
                  style={{ width: `${(subjectScore / maxScore) * 100}%` }}
                >
                  <span className="comp-chart-score">{subjectScore}</span>
                </div>
              </div>
            </div>
            {data.map((comp, i) => {
              const diff = comp.overallScore - subjectScore;
              const color = getScoreColor(comp.overallScore);
              const isSelected = selectedCompetitor === comp.name;
              return (
                <div
                  key={comp.name}
                  className={`comp-chart-row comp-chart-row-clickable ${isSelected ? "comp-chart-row-selected" : ""}`}
                  style={{ animation: `fadeSlideIn 0.4s ease-out ${(i + 1) * 80}ms forwards`, opacity: 0 }}
                  role="button"
                  tabIndex={0}
                  aria-label={`${comp.name}: score ${comp.overallScore}`}
                  onClick={() => setSelectedCompetitor(isSelected ? null : comp.name)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedCompetitor(isSelected ? null : comp.name); } }}
                >
                  <div className="comp-chart-label">
                    <span className="text-[10px] font-mono text-zinc-400 truncate">{comp.name}</span>
                  </div>
                  <div className="comp-chart-bar-wrap">
                    <div
                      className="comp-chart-bar"
                      style={{
                        width: `${(comp.overallScore / maxScore) * 100}%`,
                        background: `linear-gradient(90deg, ${color}30, ${color}15)`,
                        borderColor: `${color}40`,
                      }}
                    >
                      <span className="comp-chart-score" style={{ color }}>{comp.overallScore}</span>
                    </div>
                    <span className="comp-chart-diff" style={{ color: diff > 0 ? "#ff4444" : "#00ff88" }}>
                      {diff > 0 ? "+" : ""}{diff}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Details */}
          <div className="space-y-2 border-t border-zinc-800/50 pt-2">
            {data.map((comp, i) => (
              <div
                key={comp.name}
                className={`comp-detail-row ${selectedCompetitor === comp.name ? "comp-detail-row-selected" : ""}`}
                style={{ animation: `fadeSlideIn 0.4s ease-out ${(i + 1) * 80 + 200}ms forwards`, opacity: 0 }}
                role="button"
                tabIndex={0}
                aria-label={`Details for ${comp.name}`}
                onClick={() => setSelectedCompetitor(selectedCompetitor === comp.name ? null : comp.name)}
                onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setSelectedCompetitor(selectedCompetitor === comp.name ? null : comp.name); } }}
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-zinc-400 font-medium">{comp.name}</div>
                  <div className="text-[9px] text-zinc-600 font-mono">{comp.url}</div>
                </div>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {comp.strengths.slice(0, 2).map((s) => (
                    <span key={s} className="tag tag-green text-[8px]">{s}</span>
                  ))}
                  {comp.weaknesses.slice(0, 1).map((w) => (
                    <span key={w} className="tag tag-red text-[8px]">{w}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
