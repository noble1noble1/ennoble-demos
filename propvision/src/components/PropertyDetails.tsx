"use client";

import { Building2, Bed, Bath, Maximize, Calendar, DollarSign, TrendingUp, Home } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
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
  const formatPrice = (n: number) =>
    "$" + n.toLocaleString("en-US");

  return (
    <PanelCard
      title="PROPERTY DETAILS"
      icon={<Building2 size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs text-accent font-mono">LIVE</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-4">
          <div>
            <div className="text-lg font-semibold text-white">{data.address}</div>
            <div className="text-sm text-zinc-400">
              {data.city}, {data.state} {data.zip}
            </div>
          </div>

          <div className="text-2xl font-bold text-accent font-mono">
            {formatPrice(data.estimatedValue)}
          </div>
          <div className="text-xs text-zinc-500">Estimated Market Value</div>

          <div className="grid grid-cols-2 gap-3">
            <StatItem icon={<Bed size={14} />} label="Bedrooms" value={String(data.beds)} />
            <StatItem icon={<Bath size={14} />} label="Bathrooms" value={String(data.baths)} />
            <StatItem icon={<Maximize size={14} />} label="Sq Ft" value={data.sqft.toLocaleString()} />
            <StatItem icon={<Calendar size={14} />} label="Year Built" value={String(data.yearBuilt)} />
            <StatItem icon={<Home size={14} />} label="Type" value={data.propertyType} />
            <StatItem
              icon={<TrendingUp size={14} />}
              label="Appreciation"
              value={`+${(((data.estimatedValue - data.lastSoldPrice) / data.lastSoldPrice) * 100).toFixed(1)}%`}
            />
          </div>

          <div className="border-t border-zinc-800 pt-3 mt-3">
            <div className="flex justify-between text-xs text-zinc-500">
              <span>Last Sold: {data.lastSold}</span>
              <span>{formatPrice(data.lastSoldPrice)}</span>
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
}
