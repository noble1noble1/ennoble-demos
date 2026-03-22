"use client";

import { LayoutGrid, Bed, Bath, Maximize, Calendar, Clock, TrendingUp, TrendingDown } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { ComparableProperty, mockProperty } from "@/lib/mockData";

interface ComparablesProps {
  data: ComparableProperty[];
  visible: boolean;
  loaded: boolean;
}

function getDomColor(dom: number): string {
  if (dom <= 14) return "#00ff88";
  if (dom <= 30) return "#00ccff";
  if (dom <= 45) return "#ff8800";
  return "#ff4444";
}

function getDomLabel(dom: number): string {
  if (dom <= 14) return "Hot";
  if (dom <= 30) return "Active";
  if (dom <= 45) return "Moderate";
  return "Slow";
}

function CompCard({ comp, index }: { comp: ComparableProperty; index: number }) {
  const pricePerSqft = Math.round(comp.price / comp.sqft);
  const subjectPpsf = Math.round(mockProperty.estimatedValue / mockProperty.sqft);
  const ppsfDiff = pricePerSqft - subjectPpsf;
  const priceDiff = comp.price - mockProperty.estimatedValue;
  const priceDiffPct = ((priceDiff / mockProperty.estimatedValue) * 100).toFixed(1);

  return (
    <div className="comp-card" style={{ animationDelay: `${index * 100}ms` }}>
      {/* Gradient header with property visualization */}
      <div className="comp-image">
        <div className="comp-image-gradient" />
        <div className="comp-image-placeholder">
          <LayoutGrid size={16} className="text-zinc-600" />
        </div>
        <div className="comp-distance">{comp.distance}</div>
        {comp.daysOnMarket !== undefined && (
          <div className="comp-dom-badge" style={{ color: getDomColor(comp.daysOnMarket) }}>
            <Clock size={8} />
            {comp.daysOnMarket}d · {getDomLabel(comp.daysOnMarket)}
          </div>
        )}
      </div>

      <div className="p-3 space-y-2">
        <div className="text-[12px] font-medium text-zinc-300 truncate">{comp.address}</div>

        {/* Price row */}
        <div className="flex items-baseline justify-between">
          <div className="text-lg font-bold font-mono text-accent leading-none">
            ${comp.price.toLocaleString()}
          </div>
          <div className="flex items-center gap-0.5 text-[10px] font-mono">
            {priceDiff >= 0 ? (
              <TrendingUp size={10} className="text-red-400/70" />
            ) : (
              <TrendingDown size={10} className="text-accent/70" />
            )}
            <span className={priceDiff >= 0 ? "text-red-400/70" : "text-accent/70"}>
              {priceDiff >= 0 ? "+" : ""}{priceDiffPct}%
            </span>
          </div>
        </div>

        {/* Price per sqft bar */}
        <div className="comp-ppsf-row">
          <span className="text-[10px] font-mono text-zinc-500">${pricePerSqft}/sqft</span>
          <div className="comp-ppsf-bar">
            <div
              className="comp-ppsf-fill"
              style={{
                width: `${Math.min((pricePerSqft / (subjectPpsf * 1.5)) * 100, 100)}%`,
                background: ppsfDiff >= 0 ? "rgba(255,68,68,0.4)" : "rgba(0,255,136,0.4)",
              }}
            />
          </div>
          <span className={`text-[9px] font-mono ${ppsfDiff >= 0 ? "text-red-400/60" : "text-accent/60"}`}>
            {ppsfDiff >= 0 ? "+" : ""}{ppsfDiff}
          </span>
        </div>

        {/* Details row */}
        <div className="flex gap-2 text-[11px] text-zinc-500">
          <span className="flex items-center gap-1">
            <Bed size={10} className="text-zinc-600" /> {comp.beds}bd
          </span>
          <span className="flex items-center gap-1">
            <Bath size={10} className="text-zinc-600" /> {comp.baths}ba
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={10} className="text-zinc-600" /> {comp.sqft.toLocaleString()}
          </span>
        </div>

        {/* Sold date */}
        {comp.soldDate && (
          <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-1 border-t border-zinc-800/50">
            <span className="flex items-center gap-1">
              <Calendar size={9} />
              Sold {comp.soldDate}
            </span>
            {comp.condition && (
              <span className="comp-condition" data-condition={comp.condition.toLowerCase()}>
                {comp.condition}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export function Comparables({ data, visible, loaded }: ComparablesProps) {
  const avgPrice = Math.round(data.reduce((s, c) => s + c.price, 0) / data.length);
  const avgPpsf = Math.round(data.reduce((s, c) => s + c.price / c.sqft, 0) / data.length);
  const avgDom = Math.round(
    data.filter((c) => c.daysOnMarket !== undefined).reduce((s, c) => s + (c.daysOnMarket ?? 0), 0) /
    data.filter((c) => c.daysOnMarket !== undefined).length
  );

  return (
    <PanelCard
      title="COMPARABLE PROPERTIES"
      icon={<LayoutGrid size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-zinc-500 font-mono">{data.length} found</span>
            <span className="text-[10px] text-zinc-600">·</span>
            <span className="text-[10px] text-zinc-500 font-mono">${avgPpsf}/sqft avg</span>
            <span className="text-[10px] text-zinc-600">·</span>
            <span className="text-[10px] font-mono" style={{ color: getDomColor(avgDom) }}>{avgDom}d avg DOM</span>
          </div>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((comp, i) => (
            <CompCard key={i} comp={comp} index={i} />
          ))}
        </div>
      )}
    </PanelCard>
  );
}
