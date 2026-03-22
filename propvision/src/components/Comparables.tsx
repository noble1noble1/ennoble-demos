"use client";

import { LayoutGrid, Bed, Bath, Maximize } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { ComparableProperty } from "@/lib/mockData";

interface ComparablesProps {
  data: ComparableProperty[];
  visible: boolean;
  loaded: boolean;
}

function CompCard({ comp }: { comp: ComparableProperty }) {
  return (
    <div className="comp-card">
      <div className="comp-image">
        <div className="comp-image-placeholder">
          <LayoutGrid size={20} className="text-zinc-600" />
        </div>
        <div className="comp-distance">{comp.distance}</div>
      </div>
      <div className="p-3">
        <div className="text-sm font-semibold text-white truncate">{comp.address}</div>
        <div className="text-lg font-bold font-mono text-accent mt-1">
          ${comp.price.toLocaleString()}
        </div>
        <div className="flex gap-3 mt-2 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Bed size={12} /> {comp.beds}bd
          </span>
          <span className="flex items-center gap-1">
            <Bath size={12} /> {comp.baths}ba
          </span>
          <span className="flex items-center gap-1">
            <Maximize size={12} /> {comp.sqft.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
}

export function Comparables({ data, visible, loaded }: ComparablesProps) {
  return (
    <PanelCard
      title="COMPARABLE PROPERTIES"
      icon={<LayoutGrid size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs text-zinc-500 font-mono">{data.length} found</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
          {data.map((comp, i) => (
            <CompCard key={i} comp={comp} />
          ))}
        </div>
      )}
    </PanelCard>
  );
}
