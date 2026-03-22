"use client";

import { useState, useEffect } from "react";
import { Radar, ExternalLink, AlertTriangle, TrendingUp, Building, Shield, MapPin, GraduationCap, Hammer, Briefcase, ShoppingBag } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { IntelItem } from "@/lib/mockData";

interface IntelligenceFeedProps {
  data: IntelItem[];
  visible: boolean;
  loaded: boolean;
}

function getRelevanceColor(r: number): string {
  if (r >= 90) return "#00ff88";
  if (r >= 80) return "#00ccff";
  if (r >= 70) return "#ff8800";
  return "#666";
}

function getCategoryIcon(category: string) {
  const iconMap: Record<string, React.ComponentType<{ size: number }>> = {
    zoning: MapPin,
    infrastructure: Building,
    market: TrendingUp,
    schools: GraduationCap,
    permits: Hammer,
    employment: Briefcase,
    safety: Shield,
    amenities: ShoppingBag,
  };
  const Icon = iconMap[category] || AlertTriangle;
  return <Icon size={10} />;
}

function FeedItem({ item, index }: { item: IntelItem; index: number }) {
  const [show, setShow] = useState(false);
  const color = getRelevanceColor(item.relevance);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), index * 400);
    return () => clearTimeout(timer);
  }, [index]);

  if (!show) return null;

  return (
    <div className="intel-item">
      <div className="flex items-start gap-3">
        {/* Relevance indicator */}
        <div className="intel-relevance-indicator">
          <div className="intel-relevance-ring" style={{ borderColor: color }}>
            <span className="text-[8px] font-bold font-mono" style={{ color }}>{item.relevance}</span>
          </div>
          <div className="intel-relevance-pulse" style={{ background: color }} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-1.5 mb-1">
            <span className="text-zinc-600 mt-0.5">{getCategoryIcon(item.category)}</span>
            <p className="text-[13px] text-zinc-300 leading-snug">{item.text}</p>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="text-[9px] text-zinc-600 font-mono">{item.timestamp}</span>
            <span className="intel-source-link">
              {item.source} <ExternalLink size={8} />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export function IntelligenceFeed({ data, visible, loaded }: IntelligenceFeedProps) {
  const [feedItems, setFeedItems] = useState<IntelItem[]>([]);
  const [scanLine, setScanLine] = useState(0);

  useEffect(() => {
    if (loaded) {
      setFeedItems(data);
      // Animate scan line
      const interval = setInterval(() => {
        setScanLine((p) => (p + 1) % 100);
      }, 50);
      return () => clearInterval(interval);
    } else {
      setFeedItems([]);
    }
  }, [loaded, data]);

  return (
    <PanelCard
      title="AI INTELLIGENCE FEED"
      icon={<Radar size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <div className="flex items-center gap-2">
            <span className="intel-live-badge">
              <span className="intel-live-dot" />
              LIVE
            </span>
            <span className="text-[10px] text-zinc-600 font-mono">Exa</span>
          </div>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="intel-feed-container">
          {/* Scan line effect */}
          <div className="intel-scan-overlay" style={{ top: `${scanLine}%` }} />

          {feedItems.map((item, i) => (
            <FeedItem key={item.id} item={item} index={i} />
          ))}
          {loaded && (
            <div className="intel-scanning">
              <div className="intel-scanning-dots">
                <span className="intel-scanning-dot" />
                <span className="intel-scanning-dot" style={{ animationDelay: "0.3s" }} />
                <span className="intel-scanning-dot" style={{ animationDelay: "0.6s" }} />
              </div>
              Scanning for new intelligence...
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
}
