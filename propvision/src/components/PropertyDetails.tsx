"use client";

import { memo } from "react";
import { Building2, Bed, Bath, Maximize, Calendar, TrendingUp, Home, Ruler, Car, DollarSign, Camera, MapPin } from "lucide-react";
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

function getValueIndicator(estimatedValue: number, lastSoldPrice: number) {
  const appreciation = ((estimatedValue - lastSoldPrice) / lastSoldPrice) * 100;
  if (appreciation >= 15) return { label: "STRONG VALUE", color: "#00ff88", bg: "rgba(0,255,136,0.08)", border: "rgba(0,255,136,0.2)" };
  if (appreciation >= 8) return { label: "GOOD VALUE", color: "#00ccff", bg: "rgba(0,204,255,0.08)", border: "rgba(0,204,255,0.2)" };
  if (appreciation >= 0) return { label: "FAIR VALUE", color: "#ff8800", bg: "rgba(255,136,0,0.08)", border: "rgba(255,136,0,0.2)" };
  return { label: "BELOW PURCHASE", color: "#ff4444", bg: "rgba(255,68,68,0.08)", border: "rgba(255,68,68,0.2)" };
}

export const PropertyDetails = memo(function PropertyDetails({ data, visible, loaded }: PropertyDetailsProps) {
  const appreciation = ((data.estimatedValue - data.lastSoldPrice) / data.lastSoldPrice) * 100;
  const pricePerSqft = Math.round(data.estimatedValue / data.sqft);
  const indicator = getValueIndicator(data.estimatedValue, data.lastSoldPrice);

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
          {/* Property Image Placeholder */}
          <div className="property-image-hero">
            <div className="property-image-gradient" />
            <div className="property-image-content">
              <Building2 size={28} className="text-zinc-600" />
              <span className="flex items-center gap-1 text-[9px] text-zinc-600 font-mono mt-1">
                <Camera size={9} /> Street View
              </span>
            </div>
            <div className="property-image-overlay">
              <div className="flex items-center gap-1.5">
                <MapPin size={10} className="text-accent" />
                <span className="text-[10px] text-white font-mono">{data.address}</span>
              </div>
              <span className="text-[9px] text-zinc-400 font-mono">
                {data.city}, {data.state} {data.zip}
              </span>
            </div>
          </div>

          {/* Value Indicator Badge */}
          <div
            className="value-indicator"
            style={{ background: indicator.bg, borderColor: indicator.border }}
          >
            <div className="flex items-center gap-2">
              <div className="value-indicator-dot" style={{ background: indicator.color, boxShadow: `0 0 6px ${indicator.color}` }} />
              <span className="text-[9px] font-mono font-bold tracking-wider" style={{ color: indicator.color }}>
                {indicator.label}
              </span>
            </div>
            <span className="text-[9px] font-mono" style={{ color: indicator.color, opacity: 0.7 }}>
              +{appreciation.toFixed(1)}% since purchase
            </span>
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
            <StatItem icon={<Car size={14} />} label="Parking" value={data.parking} />
            <StatItem icon={<DollarSign size={14} />} label="HOA/Mo" value={`$${data.hoaFee.toLocaleString()}`} />
          </div>

          {/* Amenities */}
          <div className="border-t border-zinc-800/50 pt-2.5 mt-1">
            <div className="text-[9px] text-zinc-500 font-mono tracking-wider mb-1.5">BUILDING AMENITIES</div>
            <div className="flex flex-wrap gap-1">
              {data.amenities.map((a) => (
                <span key={a} className="tag tag-green text-[8px]">{a}</span>
              ))}
            </div>
          </div>

          {/* Tax History */}
          <div className="border-t border-zinc-800/50 pt-2.5 mt-1">
            <div className="text-[9px] text-zinc-500 font-mono tracking-wider mb-1.5">TAX HISTORY</div>
            <div className="space-y-0.5">
              {data.taxHistory.slice(0, 4).map((t) => (
                <div key={t.year} className="flex justify-between text-[10px]">
                  <span className="text-zinc-600 font-mono">{t.year}</span>
                  <span className="text-zinc-400 font-mono">${t.tax.toLocaleString()}</span>
                  <span className={`font-mono ${t.change >= 0 ? "text-red-400/60" : "text-accent/60"}`}>
                    {t.change >= 0 ? "+" : ""}{t.change}%
                  </span>
                </div>
              ))}
            </div>
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
});
