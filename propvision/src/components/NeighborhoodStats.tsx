"use client";

import { MapPin, Users, Shield } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { NeighborhoodData } from "@/lib/mockData";

interface NeighborhoodStatsProps {
  data: NeighborhoodData;
  visible: boolean;
  loaded: boolean;
}

function CircleScore({ score, label, color }: { score: number; label: string; color: string }) {
  const circumference = 2 * Math.PI * 36;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="6"
        />
        <circle
          cx="44"
          cy="44"
          r="36"
          fill="none"
          stroke={color}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 44 44)"
          className="score-circle"
        />
        <text
          x="44"
          y="42"
          textAnchor="middle"
          fill="white"
          fontSize="20"
          fontFamily="monospace"
          fontWeight="bold"
        >
          {score}
        </text>
        <text
          x="44"
          y="56"
          textAnchor="middle"
          fill="#666"
          fontSize="9"
          fontFamily="monospace"
        >
          /100
        </text>
      </svg>
      <div className="text-xs text-zinc-400 mt-1 font-mono">{label}</div>
    </div>
  );
}

function DemographicRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-zinc-800/50">
      <span className="text-xs text-zinc-500">{label}</span>
      <span className="text-xs text-white font-mono">{value}</span>
    </div>
  );
}

export function NeighborhoodStats({ data, visible, loaded }: NeighborhoodStatsProps) {
  return (
    <PanelCard
      title="NEIGHBORHOOD STATS"
      icon={<MapPin size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs text-zinc-500 font-mono">Midtown, Manhattan</span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="space-y-4">
          <div className="flex justify-around">
            <CircleScore score={data.walkScore} label="WALK" color="#00ff88" />
            <CircleScore score={data.transitScore} label="TRANSIT" color="#00aaff" />
            <CircleScore score={data.bikeScore} label="BIKE" color="#ff8800" />
          </div>

          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Users size={12} className="text-zinc-500" />
              <span className="text-xs text-zinc-400 font-mono">DEMOGRAPHICS</span>
            </div>
            <DemographicRow label="Median Income" value={`$${data.medianIncome.toLocaleString()}`} />
            <DemographicRow label="Population" value={data.population.toLocaleString()} />
            <DemographicRow label="Median Age" value={String(data.medianAge)} />
            <DemographicRow label="School Rating" value={`${data.schoolRating}/10`} />
          </div>

          <div className="border-t border-zinc-800 pt-3">
            <div className="flex items-center gap-1.5 mb-2">
              <Shield size={12} className="text-zinc-500" />
              <span className="text-xs text-zinc-400 font-mono">SAFETY</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${100 - data.crimeIndex}%` }}
                />
              </div>
              <span className="text-xs text-zinc-400 font-mono">{100 - data.crimeIndex}/100</span>
            </div>
            <div className="text-[10px] text-zinc-600 mt-1">Safety Index (higher is safer)</div>
          </div>
        </div>
      )}
    </PanelCard>
  );
}
