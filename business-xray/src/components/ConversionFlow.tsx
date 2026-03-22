"use client";

import { MousePointerClick, Check, X, AlertTriangle } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { ConversionCheck } from "@/lib/mockData";

interface ConversionFlowProps {
  data: ConversionCheck[];
  visible: boolean;
  loaded: boolean;
}

const statusConfig = {
  found: { color: "#00ff88", bg: "rgba(0,255,136,0.08)", icon: Check, label: "FOUND" },
  missing: { color: "#ff4444", bg: "rgba(255,68,68,0.08)", icon: X, label: "MISSING" },
  partial: { color: "#ff8800", bg: "rgba(255,136,0,0.08)", icon: AlertTriangle, label: "PARTIAL" },
};

export function ConversionFlow({ data, visible, loaded }: ConversionFlowProps) {
  const foundCount = data.filter((c) => c.status === "found").length;
  const totalCount = data.length;
  const score = Math.round((foundCount + data.filter(c => c.status === "partial").length * 0.5) / totalCount * 100);

  return (
    <PanelCard
      title="CONVERSION FLOW"
      icon={<MousePointerClick size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs font-mono font-bold" style={{ color: score >= 70 ? "#00ff88" : score >= 50 ? "#ff8800" : "#ff4444" }}>
            {score}%
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-2">
          {/* Score summary bar */}
          <div className="conv-score-bar">
            <div className="conv-score-fill" style={{ width: `${score}%` }} />
          </div>
          <div className="flex justify-between text-[9px] font-mono text-zinc-600 mb-2">
            <span>{foundCount}/{totalCount} checks passed</span>
            <span style={{ color: score >= 70 ? "#00ff88" : score >= 50 ? "#ff8800" : "#ff4444" }}>
              {score >= 70 ? "HEALTHY" : score >= 50 ? "NEEDS WORK" : "WEAK"}
            </span>
          </div>

          {data.map((check, i) => {
            const config = statusConfig[check.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={check.label}
                className="conv-check"
                style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 60}ms forwards`, opacity: 0 }}
              >
                <div
                  className="conv-check-icon"
                  style={{ background: config.bg, color: config.color }}
                >
                  <StatusIcon size={10} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] text-zinc-300 font-medium">{check.label}</span>
                    <span className="text-[8px] font-mono font-bold" style={{ color: config.color }}>
                      {config.label}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-600 mt-0.5">{check.detail}</div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PanelCard>
  );
}
