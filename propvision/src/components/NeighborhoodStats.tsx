"use client";

import { useState, useEffect, memo } from "react";
import { MapPin, Users, Shield } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { NeighborhoodData } from "@/lib/mockData";

interface NeighborhoodStatsProps {
  data: NeighborhoodData;
  visible: boolean;
  loaded: boolean;
}

function CircleScore({ score, label, color, loaded }: { score: number; label: string; color: string; loaded: boolean }) {
  const radius = 36;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference - (score / 100) * circumference;
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setAnimated(true), 200);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [loaded]);

  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88">
        {/* Background track */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="6"
          className="score-circle-bg"
        />
        {/* Glow layer */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? targetOffset : circumference}
          transform="rotate(-90 44 44)"
          className="score-glow"
        />
        {/* Main arc */}
        <circle
          cx="44"
          cy="44"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={animated ? targetOffset : circumference}
          transform="rotate(-90 44 44)"
          className="score-circle"
        />
        {/* Score text */}
        <text
          x="44"
          y="42"
          textAnchor="middle"
          fill="white"
          fontSize="20"
          fontFamily="monospace"
          fontWeight="bold"
          className={animated ? "score-value" : ""}
          style={{ opacity: animated ? undefined : 0 }}
        >
          {score}
        </text>
        <text
          x="44"
          y="56"
          textAnchor="middle"
          fill="#555"
          fontSize="9"
          fontFamily="monospace"
          className={animated ? "score-value" : ""}
          style={{ opacity: animated ? undefined : 0 }}
        >
          /100
        </text>
      </svg>
      <div className="text-[10px] mt-1 font-mono tracking-wider" style={{ color }}>{label}</div>
    </div>
  );
}

function DemographicRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-zinc-800/50 transition-colors hover:bg-white/[0.01]">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs text-white font-mono">{value}</span>
    </div>
  );
}

export const NeighborhoodStats = memo(function NeighborhoodStats({ data, visible, loaded }: NeighborhoodStatsProps) {
  const safetyScore = 100 - data.crimeIndex;

  return (
    <PanelCard
      title="NEIGHBORHOOD"
      icon={<MapPin size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-[10px] text-zinc-500 font-mono">Midtown, Manhattan</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-around">
            <CircleScore score={data.walkScore} label="WALK" color="#00ff88" loaded={loaded} />
            <CircleScore score={data.transitScore} label="TRANSIT" color="#00ccff" loaded={loaded} />
            <CircleScore score={data.bikeScore} label="BIKE" color="#ff8800" loaded={loaded} />
          </div>

          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Users size={12} className="text-zinc-500" />
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider">DEMOGRAPHICS</span>
            </div>
            <DemographicRow label="Median Income" value={`$${data.medianIncome.toLocaleString()}`} />
            <DemographicRow label="Population" value={data.population.toLocaleString()} />
            <DemographicRow label="Median Age" value={String(data.medianAge)} />
            <DemographicRow label="School Rating" value={`${data.schoolRating}/10`} />
          </div>

          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield size={12} className="text-zinc-500" />
              <span className="text-[10px] text-zinc-400 font-mono tracking-wider">SAFETY</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: `${safetyScore}%`,
                    background: `linear-gradient(90deg, var(--accent), #00ccff)`,
                    boxShadow: "0 0 8px rgba(0,255,136,0.3)",
                  }}
                />
              </div>
              <span className="text-xs text-zinc-400 font-mono">{safetyScore}/100</span>
            </div>
            <div className="text-[10px] text-zinc-600 mt-1">Safety Index (higher is safer)</div>
          </div>
        </div>
      )}
    </PanelCard>
  );
});
