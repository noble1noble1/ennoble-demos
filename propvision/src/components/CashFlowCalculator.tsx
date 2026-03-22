"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    let start = 0;
    const end = value;
    const duration = 800;
    const startTime = Date.now();

    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * eased;
      setDisplay(current);
      if (progress < 1) requestAnimationFrame(tick);
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
            <div className="cashflow-metric">
              <span className="cashflow-metric-label">NOI</span>
              <span className={`cashflow-metric-value ${annualNoi >= 0 ? "positive" : "negative"}`}>
                <AnimatedNumber value={annualNoi} prefix="$" />/yr
              </span>
            </div>
            <div className="cashflow-metric">
              <span className="cashflow-metric-label">Cap Rate</span>
              <span className="cashflow-metric-value">
                <AnimatedNumber value={capRate} decimals={2} suffix="%" />
              </span>
            </div>
            <div className="cashflow-metric">
              <span className="cashflow-metric-label">DSCR</span>
              <span className={`cashflow-metric-value ${dscr >= 1.25 ? "positive" : dscr >= 1.0 ? "" : "negative"}`}>
                <AnimatedNumber value={dscr} decimals={2} suffix="x" />
              </span>
            </div>
            <div className="cashflow-metric">
              <span className="cashflow-metric-label">CoC Return</span>
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
