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
          {data.map((social, i) => (
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
              <div className="text-right">
                <div className="text-[11px] font-mono font-bold" style={{ color: statusColors[social.status] }}>
                  {social.engagement}
                </div>
                <div className="text-[8px] text-zinc-600 font-mono">ENG RATE</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PanelCard>
  );
}
