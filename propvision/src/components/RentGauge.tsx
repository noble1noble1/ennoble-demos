"use client";

import { memo } from "react";
import { DollarSign } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { RentEstimate, mockProperty } from "@/lib/mockData";

interface RentGaugeProps {
  data: RentEstimate;
  visible: boolean;
  loaded: boolean;
}

export const RentGauge = memo(function RentGauge({ data, visible, loaded }: RentGaugeProps) {
  const { low, mid, high } = data;
  const min = low - 500;
  const max = high + 500;
  const range = max - min;

  const startAngle = -225;
  const endAngle = 45;
  const totalArc = endAngle - startAngle;
  const needleAngle = startAngle + ((mid - min) / range) * totalArc;

  const cx = 120;
  const cy = 120;
  const r = 90;

  function polarToCartesian(angle: number) {
    const rad = (angle * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  }

  function describeArc(start: number, end: number) {
    const s = polarToCartesian(start);
    const e = polarToCartesian(end);
    const largeArc = end - start > 180 ? 1 : 0;
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`;
  }

  const lowAngle = startAngle + ((low - min) / range) * totalArc;
  const highAngle = startAngle + ((high - min) / range) * totalArc;
  const needleEnd = polarToCartesian(needleAngle);

  const grossYield = ((mid * 12) / mockProperty.estimatedValue) * 100;
  const capRate = ((mid * 12 * 0.65) / mockProperty.estimatedValue) * 100;
  const annualIncome = mid * 12;

  return (
    <PanelCard
      title="RENT ESTIMATE"
      icon={<DollarSign size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="tag tag-green">Monthly</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={5} />
      ) : (
        <div className="flex flex-col items-center">
          <svg width="240" height="160" viewBox="0 0 240 160">
            {/* Glow filter */}
            <defs>
              <filter id="glow-gauge">
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Background arc */}
            <path
              d={describeArc(startAngle, endAngle)}
              fill="none"
              stroke="#1a1a1a"
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Low range */}
            <path
              d={describeArc(startAngle, lowAngle)}
              fill="none"
              stroke="#ff4444"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.35"
            />
            {/* Mid range (green) */}
            <path
              d={describeArc(lowAngle, highAngle)}
              fill="none"
              stroke="#00ff88"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.5"
              filter="url(#glow-gauge)"
            />
            {/* High range */}
            <path
              d={describeArc(highAngle, endAngle)}
              fill="none"
              stroke="#ff8800"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.35"
            />

            {/* Needle */}
            <line
              x1={cx}
              y1={cy}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke="#00ff88"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="gauge-needle"
              filter="url(#glow-gauge)"
            />
            <circle cx={cx} cy={cy} r="6" fill="#00ff88" filter="url(#glow-gauge)" />
            <circle cx={cx} cy={cy} r="3" fill="#0a0a0a" />

            {/* Center value */}
            <text
              x={cx}
              y={cy + 35}
              textAnchor="middle"
              fill="#00ff88"
              fontSize="26"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ${mid.toLocaleString()}
            </text>
            <text
              x={cx}
              y={cy + 50}
              textAnchor="middle"
              fill="#555"
              fontSize="9"
              fontFamily="monospace"
            >
              per month
            </text>
          </svg>

          <div className="flex justify-between w-full mt-1 px-4">
            <div className="text-center">
              <div className="text-[10px] text-zinc-600 font-mono">LOW</div>
              <div className="text-sm font-mono text-red-400 font-semibold">${low.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-zinc-600 font-mono">ESTIMATE</div>
              <div className="text-sm font-mono text-accent font-bold">${mid.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-[10px] text-zinc-600 font-mono">HIGH</div>
              <div className="text-sm font-mono text-orange-400 font-semibold">${high.toLocaleString()}</div>
            </div>
          </div>

          <div className="w-full mt-3 pt-3 border-t border-zinc-800/50 space-y-1.5">
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600 font-mono">Annual Income</span>
              <span className="text-white font-mono">${annualIncome.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600 font-mono">Gross Yield</span>
              <span className="text-accent font-mono font-semibold">{grossYield.toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-zinc-600 font-mono">Cap Rate</span>
              <span className="text-accent font-mono font-semibold">{capRate.toFixed(2)}%</span>
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
});
