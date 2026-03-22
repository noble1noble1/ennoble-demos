"use client";

import { useState, useEffect, useRef } from "react";
import { DollarSign, ChevronDown, ChevronUp } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";

interface CashFlowProps {
  visible: boolean;
  loaded: boolean;
  propertyValue: number;
  monthlyRent: number;
}

function AnimatedNumber({ value, prefix = "", suffix = "", decimals = 0 }: { value: number; prefix?: string; suffix?: string; decimals?: number }) {
  const [display, setDisplay] = useState(0);
  const prevValueRef = useRef(0);

  useEffect(() => {
    const start = prevValueRef.current;
    const end = value;
    const duration = 500;
    const startTime = Date.now();

    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        prevValueRef.current = end;
      }
    }

    requestAnimationFrame(tick);
  }, [value]);

  return (
    <span className="font-mono">
      {prefix}{display < 0 ? "-" : ""}{prefix === "$" ? "" : ""}{Math.abs(display).toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}{suffix}
    </span>
  );
}

function EditableInput({ value, onChange, label, prefix = "$" }: {
  value: number;
  onChange: (v: number) => void;
  label: string;
  prefix?: string;
}) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(String(value));

  useEffect(() => { if (!editing) setText(String(value)); }, [value, editing]);

  return (
    <div className="cashflow-input-row">
      <span className="cashflow-label">{label}</span>
      {editing ? (
        <input
          type="number"
          className="cashflow-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            setEditing(false);
            const n = parseFloat(text);
            if (!isNaN(n) && n >= 0) onChange(n);
          }}
          onKeyDown={(e) => { if (e.key === "Enter") (e.target as HTMLInputElement).blur(); }}
          autoFocus
          aria-label={`Edit ${label}`}
        />
      ) : (
        <button className="cashflow-value-btn" onClick={() => setEditing(true)} aria-label={`Edit ${label}: ${prefix}${value.toLocaleString()}`}>
          {prefix}{value.toLocaleString()}
        </button>
      )}
    </div>
  );
}

function DonutChart({ income, expenses, mortgage }: { income: number; expenses: number; mortgage: number }) {
  const total = expenses + mortgage;
  const remaining = Math.max(income - total, 0);
  const segments = [
    { value: expenses, color: "#ff8800", label: "Expenses" },
    { value: mortgage, color: "#ff4444", label: "Mortgage" },
    { value: remaining, color: "#00ff88", label: "Cash Flow" },
  ];

  const radius = 40;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const segmentTotal = segments.reduce((s, seg) => s + seg.value, 0);
  let offset = 0;

  return (
    <div className="cashflow-donut-wrap">
      <svg width="110" height="110" viewBox="0 0 110 110">
        {/* Background track */}
        <circle cx="55" cy="55" r={radius} fill="none" stroke="#1a1a1a" strokeWidth={strokeWidth} />
        {segments.map((seg, i) => {
          const segLen = segmentTotal > 0 ? (seg.value / segmentTotal) * circumference : 0;
          const dashArray = `${segLen} ${circumference - segLen}`;
          const dashOffset = -offset;
          offset += segLen;
          if (seg.value === 0) return null;
          return (
            <circle
              key={i}
              cx="55"
              cy="55"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth={strokeWidth}
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              strokeLinecap="butt"
              transform="rotate(-90 55 55)"
              className="cashflow-donut-segment"
              style={{
                filter: `drop-shadow(0 0 4px ${seg.color}40)`,
                transition: "stroke-dasharray 0.6s cubic-bezier(0.4, 0, 0.2, 1), stroke-dashoffset 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            />
          );
        })}
        {/* Center text */}
        <text x="55" y="52" textAnchor="middle" fill="white" fontSize="14" fontFamily="monospace" fontWeight="bold">
          {segmentTotal > 0 ? Math.round((remaining / segmentTotal) * 100) : 0}%
        </text>
        <text x="55" y="65" textAnchor="middle" fill="#666" fontSize="8" fontFamily="monospace">
          MARGIN
        </text>
      </svg>
      <div className="cashflow-donut-legend">
        {segments.map((seg) => (
          <div key={seg.label} className="cashflow-legend-item">
            <div className="cashflow-legend-dot" style={{ background: seg.color }} />
            <span className="text-[9px] text-zinc-500 font-mono">{seg.label}</span>
            <span className="text-[9px] font-mono ml-auto" style={{ color: seg.color }}>
              ${seg.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function CashFlowCalculator({ visible, loaded, propertyValue, monthlyRent }: CashFlowProps) {
  const [rent, setRent] = useState(monthlyRent);
  const [vacancy, setVacancy] = useState(5);
  const [propertyTax, setPropertyTax] = useState(Math.round(propertyValue * 0.0144 / 12));
  const [insurance, setInsurance] = useState(Math.round(propertyValue * 0.003 / 12));
  const [maintenance, setMaintenance] = useState(Math.round(rent * 0.08));
  const [management, setManagement] = useState(Math.round(rent * 0.10));
  const [mortgagePayment, setMortgagePayment] = useState(Math.round(propertyValue * 0.8 * 0.065 / 12 * 1.15));
  const [showExpenses, setShowExpenses] = useState(false);

  const effectiveRent = rent * (1 - vacancy / 100);
  const totalExpenses = propertyTax + insurance + maintenance + management;
  const noi = effectiveRent - totalExpenses;
  const cashFlow = noi - mortgagePayment;
  const annualNoi = noi * 12;
  const capRate = (annualNoi / propertyValue) * 100;
  const dscr = mortgagePayment > 0 ? noi / mortgagePayment : 0;
  const cashOnCash = propertyValue > 0 ? ((cashFlow * 12) / (propertyValue * 0.2)) * 100 : 0;

  return (
    <PanelCard
      title="CASH FLOW CALCULATOR"
      icon={<DollarSign size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <span className={`text-xs font-mono font-bold ${cashFlow >= 0 ? "text-accent" : "text-red-400"}`}>
            {cashFlow >= 0 ? "+" : ""}${Math.round(cashFlow).toLocaleString()}/mo
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={8} />
      ) : (
        <div className="cashflow-container">
          {/* Donut Chart */}
          <DonutChart
            income={Math.round(effectiveRent)}
            expenses={totalExpenses}
            mortgage={mortgagePayment}
          />

          {/* Income Section */}
          <div className="cashflow-section">
            <div className="cashflow-section-header">
              <span className="cashflow-section-title">INCOME</span>
              <span className="cashflow-section-total text-accent">
                <AnimatedNumber value={effectiveRent} prefix="$" />/mo
              </span>
            </div>
            <EditableInput label="Monthly Rent" value={rent} onChange={setRent} />
            <EditableInput label="Vacancy Rate" value={vacancy} onChange={setVacancy} prefix="" />
          </div>

          {/* Expenses Section */}
          <div className="cashflow-section">
            <button
              className="cashflow-section-header clickable"
              onClick={() => setShowExpenses(!showExpenses)}
              aria-expanded={showExpenses}
              aria-label="Toggle expense details"
            >
              <span className="cashflow-section-title">
                EXPENSES
                {showExpenses ? <ChevronUp size={12} className="inline ml-1" /> : <ChevronDown size={12} className="inline ml-1" />}
              </span>
              <span className="cashflow-section-total text-red-400">
                -<AnimatedNumber value={totalExpenses} prefix="$" />/mo
              </span>
            </button>
            {showExpenses && (
              <div className="cashflow-expenses-detail">
                <EditableInput label="Property Tax" value={propertyTax} onChange={setPropertyTax} />
                <EditableInput label="Insurance" value={insurance} onChange={setInsurance} />
                <EditableInput label="Maintenance" value={maintenance} onChange={setMaintenance} />
                <EditableInput label="Management" value={management} onChange={setManagement} />
              </div>
            )}
          </div>

          {/* Mortgage */}
          <div className="cashflow-section">
            <div className="cashflow-section-header">
              <span className="cashflow-section-title">DEBT SERVICE</span>
              <span className="cashflow-section-total text-red-400">
                -<AnimatedNumber value={mortgagePayment} prefix="$" />/mo
              </span>
            </div>
            <EditableInput label="Mortgage Payment" value={mortgagePayment} onChange={setMortgagePayment} />
          </div>

          {/* Summary Bar */}
          <div className="cashflow-summary">
            <div className="cashflow-bar">
              <div
                className="cashflow-bar-income"
                style={{ width: `${(effectiveRent / (effectiveRent + 1)) * 100}%` }}
              />
              <div
                className="cashflow-bar-expense"
                style={{ width: `${((totalExpenses + mortgagePayment) / (effectiveRent + 1)) * 100}%` }}
              />
            </div>
          </div>

          {/* Key Metrics */}
          <div className="cashflow-metrics">
            <div className="cashflow-metric" title="Net Operating Income: Annual rental income minus operating expenses (before mortgage)">
              <span className="cashflow-metric-label">NOI <span className="metric-hint">?</span></span>
              <span className={`cashflow-metric-value ${annualNoi >= 0 ? "positive" : "negative"}`}>
                <AnimatedNumber value={annualNoi} prefix="$" />/yr
              </span>
            </div>
            <div className="cashflow-metric" title="Capitalization Rate: NOI divided by property value. Higher = better return. 4-10% is typical for residential.">
              <span className="cashflow-metric-label">Cap Rate <span className="metric-hint">?</span></span>
              <span className="cashflow-metric-value">
                <AnimatedNumber value={capRate} decimals={2} suffix="%" />
              </span>
            </div>
            <div className="cashflow-metric" title="Debt Service Coverage Ratio: NOI divided by mortgage payment. Above 1.25x is considered healthy by lenders.">
              <span className="cashflow-metric-label">DSCR <span className="metric-hint">?</span></span>
              <span className={`cashflow-metric-value ${dscr >= 1.25 ? "positive" : dscr >= 1.0 ? "" : "negative"}`}>
                <AnimatedNumber value={dscr} decimals={2} suffix="x" />
              </span>
            </div>
            <div className="cashflow-metric" title="Cash-on-Cash Return: Annual cash flow divided by total cash invested (down payment). Measures actual return on your out-of-pocket investment.">
              <span className="cashflow-metric-label">CoC Return <span className="metric-hint">?</span></span>
              <span className={`cashflow-metric-value ${cashOnCash >= 0 ? "positive" : "negative"}`}>
                <AnimatedNumber value={cashOnCash} decimals={1} suffix="%" />
              </span>
            </div>
          </div>
        </div>
      )}
    </PanelCard>
  );
}
