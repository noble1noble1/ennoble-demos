"use client";

import { Building2, Bed, Bath, Maximize, Calendar, TrendingUp, Home, Ruler } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { AnimatedNumber } from "./ui/AnimatedNumber";
import { PropertyData } from "@/lib/mockData";

interface PropertyDetailsProps {
  data: PropertyData;
  visible: boolean;
  loaded: boolean;
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="stat-item">
      <div className="stat-icon">{icon}</div>
      <div>
        <div className="stat-label">{label}</div>
        <div className="stat-value">{value}</div>
      </div>
    </div>
  );
}

export function PropertyDetails({ data, visible, loaded }: PropertyDetailsProps) {
  const appreciation = ((data.estimatedValue - data.lastSoldPrice) / data.lastSoldPrice) * 100;
  const pricePerSqft = Math.round(data.estimatedValue / data.sqft);

  return (
    <PanelCard
      title="PROPERTY DETAILS"
      icon={<Building2 size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="tag tag-green">LIVE</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={7} />
      ) : (
        <div className="space-y-3">
          <div>
            <div className="text-base font-semibold text-white leading-tight">{data.address}</div>
            <div className="text-sm text-zinc-500 mt-0.5">
              {data.city}, {data.state} {data.zip}
            </div>
          </div>

          <div className="flex items-baseline gap-3">
            <div className="text-2xl font-bold text-accent font-mono">
              $<AnimatedNumber value={data.estimatedValue} duration={1200} />
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp size={12} className="text-accent" />
              <span className="text-xs text-accent font-mono font-semibold">
                +<AnimatedNumber value={appreciation} decimals={1} duration={1200} />%
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-zinc-600 font-mono">Est. Market Value</span>
            <span className="text-[10px] text-zinc-600 font-mono">&bull; $<AnimatedNumber value={pricePerSqft} />/sqft</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <StatItem icon={<Bed size={14} />} label="Bedrooms" value={String(data.beds)} />
            <StatItem icon={<Bath size={14} />} label="Bathrooms" value={String(data.baths)} />
            <StatItem icon={<Maximize size={14} />} label="Sq Ft" value={data.sqft.toLocaleString()} />
            <StatItem icon={<Calendar size={14} />} label="Year Built" value={String(data.yearBuilt)} />
            <StatItem icon={<Home size={14} />} label="Type" value={data.propertyType} />
            <StatItem icon={<Ruler size={14} />} label="Lot Size" value={data.lotSize > 0 ? `${data.lotSize.toLocaleString()} sqft` : "N/A"} />
          </div>

          <div className="border-t border-zinc-800/50 pt-2.5 mt-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600">Last Sold: {data.lastSold}</span>
              <span className="text-zinc-400 font-mono">${data.lastSoldPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
}
