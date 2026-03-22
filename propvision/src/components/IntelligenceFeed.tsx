"use client";

import { useState, useEffect } from "react";
import { Search, ExternalLink } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { IntelItem } from "@/lib/mockData";

interface IntelligenceFeedProps {
  data: IntelItem[];
  visible: boolean;
  loaded: boolean;
}

function FeedItem({ item, index }: { item: IntelItem; index: number }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), index * 500);
    return () => clearTimeout(timer);
  }, [index]);

  if (!show) return null;

  return (
    <div className="intel-item">
      <div className="flex items-start gap-2">
        <div className="intel-relevance" title={`Relevance: ${item.relevance}%`}>
          <div
            className="intel-relevance-fill"
            style={{ height: `${item.relevance}%` }}
          />
          <span className="intel-relevance-text">{item.relevance}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-zinc-300 leading-snug">{item.text}</p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="text-[10px] text-zinc-600 font-mono">{item.timestamp}</span>
            <span className="flex items-center gap-1 text-[10px] text-accent/70 hover:text-accent cursor-pointer">
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

  useEffect(() => {
    if (loaded) {
      setFeedItems(data);
    } else {
      setFeedItems([]);
    }
  }, [loaded, data]);

  return (
    <PanelCard
      title="AI INTELLIGENCE FEED"
      icon={<Search size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-[10px] text-zinc-500 font-mono">
            Powered by Exa
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="intel-feed-container">
          {feedItems.map((item, i) => (
            <FeedItem key={item.id} item={item} index={i} />
          ))}
          {loaded && (
            <div className="intel-scanning">
              <div className="intel-scanning-dot" />
              Scanning for new intelligence...
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
}
