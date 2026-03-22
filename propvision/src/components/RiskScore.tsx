"use client";

import { useState, useEffect } from "react";
import { ShieldAlert } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";

interface RiskScoreProps {
  visible: boolean;
  loaded: boolean;
}

interface RiskFactor {
  label: string;
  score: number;
  color: string;
}

const riskFactors: RiskFactor[] = [
  { label: "Market", score: 82, color: "#00ff88" },
  { label: "Location", score: 91, color: "#00ff88" },
  { label: "Condition", score: 75, color: "#00ccff" },
  { label: "Financial", score: 68, color: "#ff8800" },
  { label: "Regulatory", score: 72, color: "#00ccff" },
];

function getOverallRisk(factors: RiskFactor[]): { score: number; label: string; color: string } {
  const avg = factors.reduce((s, f) => s + f.score, 0) / factors.length;
  if (avg >= 80) return { score: avg, label: "LOW RISK", color: "#00ff88" };
  if (avg >= 65) return { score: avg, label: "LOW-MODERATE", color: "#00ccff" };
  if (avg >= 50) return { score: avg, label: "MODERATE", color: "#ff8800" };
  return { score: avg, label: "HIGH RISK", color: "#ff4444" };
}

function SpiderChart({ factors, animated }: { factors: RiskFactor[]; animated: boolean }) {
  const cx = 120;
  const cy = 120;
  const maxR = 90;
  const rings = [0.25, 0.5, 0.75, 1.0];
  const n = factors.length;
  const angleStep = (2 * Math.PI) / n;
  const startAngle = -Math.PI / 2;

  function getPoint(i: number, ratio: number): [number, number] {
    const angle = startAngle + i * angleStep;
    return [
      cx + Math.cos(angle) * maxR * ratio,
      cy + Math.sin(angle) * maxR * ratio,
    ];
  }

  function polygonPoints(ratio: number): string {
    return factors.map((_, i) => getPoint(i, ratio).join(",")).join(" ");
  }

  const dataPoints = factors.map((f, i) => getPoint(i, animated ? f.score / 100 : 0));
  const dataPolygon = dataPoints.map((p) => p.join(",")).join(" ");

  return (
    <svg viewBox="0 0 240 240" className="spider-chart">
      <defs>
        <radialGradient id="spiderGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.08" />
          <stop offset="100%" stopColor="#00ff88" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="spiderFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00ff88" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00ccff" stopOpacity="0.05" />
        </linearGradient>
      </defs>

      {/* Background glow */}
      <circle cx={cx} cy={cy} r={maxR} fill="url(#spiderGlow)" />

      {/* Ring grid */}
      {rings.map((r, i) => (
        <polygon
          key={i}
          points={polygonPoints(r)}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="1"
        />
      ))}

      {/* Axis lines */}
      {factors.map((_, i) => {
        const [x, y] = getPoint(i, 1);
        return (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={x}
            y2={y}
            stroke="rgba(255,255,255,0.06)"
            strokeWidth="1"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={dataPolygon}
        fill="url(#spiderFill)"
        stroke="#00ff88"
        strokeWidth="2"
        className="spider-data"
        style={{
          filter: "drop-shadow(0 0 4px rgba(0,255,136,0.3))",
          transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
        }}
      />

      {/* Data points */}
      {dataPoints.map((p, i) => (
        <circle
          key={i}
          cx={p[0]}
          cy={p[1]}
          r="4"
          fill={factors[i].color}
          stroke="#000"
          strokeWidth="1.5"
          className="spider-dot"
          style={{
            filter: `drop-shadow(0 0 4px ${factors[i].color})`,
            transition: "all 1.2s cubic-bezier(0.4, 0, 0.2, 1) 0.3s",
          }}
        />
      ))}

      {/* Labels - pushed further out on small viewboxes and responsive font */}
      {factors.map((f, i) => {
        const [x, y] = getPoint(i, 1.28);
        // Adjust text anchor based on position to avoid overlap
        const angle = startAngle + i * angleStep;
        const cos = Math.cos(angle);
        const anchor = cos < -0.3 ? "end" : cos > 0.3 ? "start" : "middle";
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor={anchor}
            dominantBaseline="middle"
            fill="#888"
            fontSize="9"
            fontFamily="monospace"
            className="spider-label"
          >
            {f.label}
          </text>
        );
      })}

      {/* Score labels on points */}
      {factors.map((f, i) => {
        const [x, y] = getPoint(i, animated ? f.score / 100 : 0);
        return (
          <text
            key={`score-${i}`}
            x={x}
            y={y - 12}
            textAnchor="middle"
            fill={f.color}
            fontSize="9"
            fontFamily="monospace"
            fontWeight="bold"
            style={{
              opacity: animated ? 1 : 0,
              transition: "opacity 0.5s ease 1.5s",
            }}
          >
            {f.score}
          </text>
        );
      })}
    </svg>
  );
}

export function RiskScore({ visible, loaded }: RiskScoreProps) {
  const [animated, setAnimated] = useState(false);
  const overall = getOverallRisk(riskFactors);

  useEffect(() => {
    if (loaded) {
      const t = setTimeout(() => setAnimated(true), 300);
      return () => clearTimeout(t);
    }
    setAnimated(false);
  }, [loaded]);

  return (
    <PanelCard
      title="RISK ASSESSMENT"
      icon={<ShieldAlert size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className="text-xs font-mono font-bold" style={{ color: overall.color }}>
            {overall.label}
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={6} />
      ) : (
        <div className="risk-container">
          {/* Overall score */}
          <div className="risk-overall">
            <div className="risk-score-ring" style={{ borderColor: overall.color }}>
              <span className="risk-score-number" style={{ color: overall.color }}>
                {animated ? Math.round(overall.score) : 0}
              </span>
              <span className="risk-score-max">/100</span>
            </div>
            <span className="risk-score-label" style={{ color: overall.color }}>
              Safety Score
            </span>
          </div>

          {/* Spider chart */}
          <SpiderChart factors={riskFactors} animated={animated} />

          {/* Factor breakdown */}
          <div className="risk-factors">
            {riskFactors.map((f) => (
              <div key={f.label} className="risk-factor-row">
                <span className="risk-factor-label">{f.label}</span>
                <div className="risk-factor-bar">
                  <div
                    className="risk-factor-fill"
                    style={{
                      width: animated ? `${f.score}%` : "0%",
                      background: f.color,
                      boxShadow: `0 0 6px ${f.color}40`,
                      transition: "width 1s cubic-bezier(0.4, 0, 0.2, 1) 0.5s",
                    }}
                  />
                </div>
                <span className="risk-factor-score" style={{ color: f.color }}>
                  {f.score}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
