"use client";

import { Users } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { SocialPresence as SocialData } from "@/lib/mockData";

interface SocialPresenceProps {
  data: SocialData[];
  visible: boolean;
  loaded: boolean;
}

const statusColors = {
  active: "#00ff88",
  moderate: "#ff8800",
  inactive: "#ff4444",
};

const platformIcons: Record<string, string> = {
  Instagram: "IG",
  Facebook: "FB",
  "X (Twitter)": "X",
  TikTok: "TT",
  LinkedIn: "LI",
  YouTube: "YT",
};

// Generate mock sparkline data per platform
function getSparklineData(engagement: string, status: string): number[] {
  const base = parseFloat(engagement);
  const trend = status === "active" ? 0.15 : status === "moderate" ? -0.05 : -0.2;
  const points: number[] = [];
  for (let i = 0; i < 12; i++) {
    const noise = (Math.sin(i * 2.1 + base * 10) * 0.3 + Math.cos(i * 1.3) * 0.2);
    points.push(Math.max(0.1, base + trend * (i / 12) + noise));
  }
  return points;
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const w = 64;
  const h = 20;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return `${x},${y}`;
  });
  const pathD = `M ${points.join(" L ")}`;

  // Area fill
  const areaD = `${pathD} L ${w},${h} L 0,${h} Z`;

  return (
    <svg width={w} height={h} className="sparkline-svg">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaD} fill={`url(#sg-${color.replace("#", "")})`} />
      <path d={pathD} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SocialPresencePanel({ data, visible, loaded }: SocialPresenceProps) {
  const activeCount = data.filter((s) => s.status === "active").length;

  return (
    <PanelCard
      title="SOCIAL PRESENCE"
      icon={<Users size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-[10px] text-zinc-500 font-mono">{activeCount}/{data.length} active</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-2">
          {data.map((social, i) => {
            const sparkData = getSparklineData(social.engagement, social.status);
            return (
              <div
                key={social.platform}
                className="tech-item"
                style={{ animation: `fadeSlideIn 0.4s ease-out ${i * 60}ms forwards`, opacity: 0 }}
              >
                <div
                  className="tech-icon"
                  style={{
                    background: `${statusColors[social.status]}12`,
                    border: `1px solid ${statusColors[social.status]}25`,
                  }}
                >
                  <span className="text-[9px] font-bold font-mono" style={{ color: statusColors[social.status] }}>
                    {platformIcons[social.platform] || "?"}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] text-zinc-300 font-medium">{social.platform}</div>
                  <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-mono">
                    <span>{social.followers} followers</span>
                    <span>&bull;</span>
                    <span>{social.lastPost}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkline data={sparkData} color={statusColors[social.status]} />
                  <div className="text-right">
                    <div className="text-[11px] font-mono font-bold" style={{ color: statusColors[social.status] }}>
                      {social.engagement}
                    </div>
                    <div className="text-[8px] text-zinc-600 font-mono">ENG RATE</div>
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
