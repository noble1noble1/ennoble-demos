"use client";

import { memo } from "react";
import { Columns2, TrendingUp, TrendingDown } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { AnimatedNumber } from "./ui/AnimatedNumber";
import { PropertyData, ComparableProperty } from "@/lib/mockData";

interface ComparePropertiesProps {
  subject: PropertyData;
  comp: ComparableProperty;
  visible: boolean;
  loaded: boolean;
}

function CompareRow({ label, subjectVal, compVal, format = "number", higherIsBetter = true }: {
  label: string;
  subjectVal: number;
  compVal: number;
  format?: "number" | "currency" | "sqft";
  higherIsBetter?: boolean;
}) {
  const diff = subjectVal - compVal;
  const isSubjectBetter = higherIsBetter ? diff >= 0 : diff <= 0;

  const formatVal = (v: number) => {
    if (format === "currency") return `$${v.toLocaleString()}`;
    if (format === "sqft") return `${v.toLocaleString()} sqft`;
    return v.toLocaleString();
  };

  return (
    <div className="compare-row">
      <div className={`compare-cell ${isSubjectBetter ? "compare-cell-winner" : ""}`}>
        <span className="text-[12px] font-mono font-bold text-white">{formatVal(subjectVal)}</span>
      </div>
      <div className="compare-label">
        <span className="text-[9px] text-zinc-500 font-mono tracking-wider">{label}</span>
      </div>
      <div className={`compare-cell ${!isSubjectBetter ? "compare-cell-winner" : ""}`}>
        <span className="text-[12px] font-mono font-bold text-white">{formatVal(compVal)}</span>
      </div>
    </div>
  );
}

export const CompareProperties = memo(function CompareProperties({ subject, comp, visible, loaded }: ComparePropertiesProps) {
  const subjectPpsf = Math.round(subject.estimatedValue / subject.sqft);
  const compPpsf = Math.round(comp.price / comp.sqft);
  const priceDiff = subject.estimatedValue - comp.price;
  const priceDiffPct = ((priceDiff / comp.price) * 100).toFixed(1);

  return (
    <PanelCard
      title="COMPARE PROPERTIES"
      icon={<Columns2 size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-[10px] text-zinc-500 font-mono">vs Top Comp</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="compare-container">
          {/* Headers */}
          <div className="compare-header-row">
            <div className="compare-header compare-header-subject">
              <div className="text-[10px] font-mono font-bold text-accent tracking-wider">SUBJECT</div>
              <div className="text-[9px] text-zinc-500 font-mono truncate">{subject.address}</div>
            </div>
            <div className="compare-vs">VS</div>
            <div className="compare-header">
              <div className="text-[10px] font-mono font-bold text-cyan-400 tracking-wider">TOP COMP</div>
              <div className="text-[9px] text-zinc-500 font-mono truncate">{comp.address}</div>
            </div>
          </div>

          {/* Price comparison with visual bar */}
          <div className="compare-price-section">
            <div className="compare-price-bar">
              <div className="compare-price-subject" style={{ width: `${(subject.estimatedValue / Math.max(subject.estimatedValue, comp.price)) * 100}%` }}>
                <span className="text-[11px] font-mono font-bold text-white">
                  $<AnimatedNumber value={subject.estimatedValue} duration={800} />
                </span>
              </div>
            </div>
            <div className="compare-price-bar compare-price-bar-comp">
              <div className="compare-price-comp" style={{ width: `${(comp.price / Math.max(subject.estimatedValue, comp.price)) * 100}%` }}>
                <span className="text-[11px] font-mono font-bold text-white">
                  $<AnimatedNumber value={comp.price} duration={800} />
                </span>
              </div>
            </div>
            <div className="compare-price-diff">
              {priceDiff >= 0 ? (
                <TrendingUp size={10} className="text-red-400/70" />
              ) : (
                <TrendingDown size={10} className="text-accent/70" />
              )}
              <span className={`text-[10px] font-mono ${priceDiff >= 0 ? "text-red-400/70" : "text-accent/70"}`}>
                {priceDiff >= 0 ? "+" : ""}{priceDiffPct}% ({priceDiff >= 0 ? "+" : ""}${Math.abs(priceDiff).toLocaleString()})
              </span>
            </div>
          </div>

          {/* Comparison rows */}
          <CompareRow label="PRICE/SQFT" subjectVal={subjectPpsf} compVal={compPpsf} format="currency" higherIsBetter={false} />
          <CompareRow label="BEDROOMS" subjectVal={subject.beds} compVal={comp.beds} />
          <CompareRow label="BATHROOMS" subjectVal={subject.baths} compVal={comp.baths} />
          <CompareRow label="SQ FT" subjectVal={subject.sqft} compVal={comp.sqft} format="sqft" />

          {comp.daysOnMarket !== undefined && (
            <div className="compare-footer">
              <span className="text-[9px] text-zinc-600 font-mono">
                Comp was on market {comp.daysOnMarket} days &bull; {comp.distance} away &bull; {comp.condition}
              </span>
            </div>
          )}
        </div>
      )}
    </PanelCard>
  );
});
