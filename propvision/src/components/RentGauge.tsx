"use client";

import { DollarSign } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { RentEstimate } from "@/lib/mockData";

interface RentGaugeProps {
  data: RentEstimate;
  visible: boolean;
  loaded: boolean;
}

export function RentGauge({ data, visible, loaded }: RentGaugeProps) {
  const { low, mid, high } = data;
  const min = low - 500;
  const max = high + 500;
  const range = max - min;

  // Arc calculations
  const startAngle = -225;
  const endAngle = 45;
  const totalArc = endAngle - startAngle; // 270 degrees
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

  return (
    <PanelCard
      title="RENT ESTIMATE"
      icon={<DollarSign size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs text-zinc-500 font-mono">Monthly</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={5} />
      ) : (
        <div className="flex flex-col items-center">
          <svg width="240" height="160" viewBox="0 0 240 160">
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
              opacity="0.4"
            />
            {/* Mid range (green) */}
            <path
              d={describeArc(lowAngle, highAngle)}
              fill="none"
              stroke="#00ff88"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* High range */}
            <path
              d={describeArc(highAngle, endAngle)}
              fill="none"
              stroke="#ff8800"
              strokeWidth="20"
              strokeLinecap="round"
              opacity="0.4"
            />

            {/* Needle */}
            <line
              x1={cx}
              y1={cy}
              x2={needleEnd.x}
              y2={needleEnd.y}
              stroke="#00ff88"
              strokeWidth="3"
              strokeLinecap="round"
              className="gauge-needle"
            />
            <circle cx={cx} cy={cy} r="6" fill="#00ff88" />
            <circle cx={cx} cy={cy} r="3" fill="#0a0a0a" />

            {/* Center value */}
            <text
              x={cx}
              y={cy + 35}
              textAnchor="middle"
              fill="#00ff88"
              fontSize="28"
              fontFamily="monospace"
              fontWeight="bold"
            >
              ${mid.toLocaleString()}
            </text>
            <text
              x={cx}
              y={cy + 50}
              textAnchor="middle"
              fill="#666"
              fontSize="10"
              fontFamily="monospace"
            >
              per month
            </text>
          </svg>

          <div className="flex justify-between w-full mt-2 px-4">
            <div className="text-center">
              <div className="text-xs text-zinc-500">LOW</div>
              <div className="text-sm font-mono text-red-400">${low.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-zinc-500">ESTIMATE</div>
              <div className="text-sm font-mono text-accent font-bold">${mid.toLocaleString()}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-zinc-500">HIGH</div>
              <div className="text-sm font-mono text-orange-400">${high.toLocaleString()}</div>
            </div>
          </div>

          <div className="mt-3 text-xs text-zinc-500 font-mono">
            Gross Yield: {((mid * 12 / 1275000) * 100).toFixed(2)}% | Cap Rate: {((mid * 12 * 0.65 / 1275000) * 100).toFixed(2)}%
          </div>
        </div>
      )}
    </PanelCard>
  );
}
