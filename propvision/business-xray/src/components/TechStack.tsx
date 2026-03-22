"use client";

import { Code2 } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { TechStackItem } from "@/lib/mockData";

interface TechStackProps {
  data: TechStackItem[];
  visible: boolean;
  loaded: boolean;
}

const categoryLabels: Record<string, string> = {
  framework: "Framework",
  hosting: "Hosting",
  analytics: "Analytics",
  cms: "CMS",
  ecommerce: "E-Commerce",
  cdn: "CDN",
  security: "Security",
  other: "Other",
};

export function TechStack({ data, visible, loaded }: TechStackProps) {
  return (
    <PanelCard
      title="TECH STACK"
      icon={<Code2 size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-[10px] text-zinc-500 font-mono">{data.length} detected</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-2">
          {data.map((item, i) => (
            <div
              key={item.name}
              className="tech-item"
              style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 60}ms forwards`, opacity: 0 }}
            >
              <div
                className="tech-icon"
                style={{ background: `${item.color}18`, border: `1px solid ${item.color}30` }}
              >
                <span
                  className="text-xs font-bold font-mono"
                  style={{ color: item.color }}
                >
                  {item.icon}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] text-zinc-300 font-medium">{item.name}</div>
                <div className="text-[9px] text-zinc-600 font-mono uppercase tracking-wider">
                  {categoryLabels[item.category]}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-mono font-bold" style={{ color: item.confidence >= 90 ? "#00ff88" : item.confidence >= 75 ? "#00ccff" : "#ff8800" }}>
                  {item.confidence}%
                </div>
                <div className="text-[8px] text-zinc-600 font-mono">CONF</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}
