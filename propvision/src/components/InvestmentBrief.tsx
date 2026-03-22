"use client";

import { useState, useEffect, useRef } from "react";
import { FileText } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";

type Scenario = "conservative" | "base" | "optimistic";

interface InvestmentBriefProps {
  content: string;
  visible: boolean;
  loaded: boolean;
}

const scenarioOverrides: Record<Scenario, { summary: string; table: string; recommendation: string }> = {
  conservative: {
    summary: `## Executive Summary

The subject property at 350 Fifth Avenue presents a **moderate** investment opportunity with downside protections. Under conservative assumptions — slower appreciation, higher vacancy, and rising operating costs — the property still maintains positive long-term value through location fundamentals and tax benefits.`,
    table: `| Metric | Value |
|--------|-------|
| 5-Year Appreciation | 8.5% |
| Annual Rental Income | $48,600/yr |
| Vacancy Assumption | 8% |
| Annual Expense Growth | 4.5% |
| Total 5-Year ROI | 22.4% |
| IRR (after tax) | 4.8% |`,
    recommendation: `## Recommendation

**HOLD / CAUTIOUS BUY.** Under conservative modeling, the property generates modest returns but benefits from location stability and tax shelter via depreciation. Entry is justified only with reduced leverage (50% LTV max) and a 7+ year hold horizon. Monitor interest rate trajectory — refinancing at lower rates would significantly improve cash flow metrics.`,
  },
  base: {
    summary: `## Executive Summary

The subject property at 350 Fifth Avenue, New York, NY 10118 represents a compelling investment opportunity in Manhattan's Midtown corridor. The 3-bedroom, 2-bathroom condominium spanning 1,850 sqft is currently valued at $1,275,000, reflecting a 10.9% appreciation since its last sale in June 2021 at $1,150,000.`,
    table: `| Scenario | 5-Year Appreciation | Annual Rental Income | Total ROI |
|----------|-------------------|---------------------|-----------|
| Conservative | 12.5% | $54,000/yr | 33.7% |
| Base Case | 18.2% | $57,600/yr | 40.8% |
| Optimistic | 24.8% | $62,400/yr | 49.3% |`,
    recommendation: `## Recommendation

**BUY — Strong conviction.** The property offers an attractive entry point in a market with multiple positive catalysts. The combination of infrastructure investment (Penn Station, Hudson Yards), employment growth, and constrained supply supports continued appreciation. Tax benefits via depreciation provide meaningful shelter. Recommended hold period: 5-7 years for optimal returns.`,
  },
  optimistic: {
    summary: `## Executive Summary

The subject property at 350 Fifth Avenue is positioned for **exceptional** returns driven by a confluence of infrastructure catalysts, supply constraints, and accelerating demand. Under optimistic assumptions — which remain within historical precedent for Midtown Manhattan — the property delivers outsized total returns.`,
    table: `| Metric | Value |
|--------|-------|
| 5-Year Appreciation | 28.5% |
| Annual Rental Income | $64,800/yr |
| Vacancy Assumption | 2% |
| Annual Rent Growth | 5.5% |
| Total 5-Year ROI | 56.2% |
| IRR (after tax) | 11.4% |`,
    recommendation: `## Recommendation

**STRONG BUY — High conviction.** Multiple catalysts align: Penn Station renovation ($3.2B) and Hudson Yards Phase 2 create a generational infrastructure upgrade cycle. Tech employer expansion drives rental demand above baseline projections. Supply pipeline is fully absorbed. Target 80% LTV to maximize leveraged returns — DSCR improves to 1.2x+ under these rent assumptions. Recommended hold: 5 years with potential early exit at 3 years if appreciation targets hit.`,
  },
};

function getScenarioContent(baseContent: string, scenario: Scenario): string {
  const override = scenarioOverrides[scenario];
  let content = baseContent;

  // Replace executive summary
  const summaryMatch = content.match(/## Executive Summary[\s\S]*?(?=## Market Analysis)/);
  if (summaryMatch) {
    content = content.replace(summaryMatch[0], override.summary + "\n\n");
  }

  // Replace ROI table
  const tableMatch = content.match(/## ROI Projection[\s\S]*?(?=## Recommendation)/);
  if (tableMatch) {
    content = content.replace(tableMatch[0], `## ROI Projection\n\n${override.table}\n\n`);
  }

  // Replace recommendation
  const recMatch = content.match(/## Recommendation[\s\S]*?(?=\n\*Analysis)/);
  if (recMatch) {
    content = content.replace(recMatch[0], override.recommendation + "\n\n");
  }

  return content;
}

function parseTable(lines: string[]): { headers: string[]; rows: string[][] } {
  const headers = lines[0].split("|").map((h) => h.trim()).filter(Boolean);
  const rows = lines.slice(2).map((line) =>
    line.split("|").map((c) => c.trim()).filter(Boolean)
  );
  return { headers, rows };
}

export function InvestmentBrief({ content, visible, loaded }: InvestmentBriefProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [scenario, setScenario] = useState<Scenario>("base");
  const containerRef = useRef<HTMLDivElement>(null);

  const activeContent = getScenarioContent(content, scenario);

  useEffect(() => {
    if (!loaded) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    let i = 0;
    const chunkSize = 4;

    const interval = setInterval(() => {
      if (i < activeContent.length) {
        const end = Math.min(i + chunkSize, activeContent.length);
        setDisplayedText(activeContent.slice(0, end));
        i = end;

        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 10);

    return () => clearInterval(interval);
  }, [loaded, activeContent]);

  function renderText(text: string) {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];
    let i = 0;

    while (i < lines.length) {
      const line = lines[i];

      // Detect table blocks
      if (line.startsWith("| ") && i + 2 < lines.length && lines[i + 1]?.startsWith("|--")) {
        const tableLines: string[] = [];
        while (i < lines.length && lines[i].startsWith("|")) {
          tableLines.push(lines[i]);
          i++;
        }
        const { headers, rows } = parseTable(tableLines);
        elements.push(
          <div key={`table-${i}`} className="brief-table-wrap">
            <table className="brief-table">
              <thead>
                <tr>
                  {headers.map((h, hi) => (
                    <th key={hi}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, ri) => (
                  <tr key={ri}>
                    {row.map((cell, ci) => (
                      <td key={ci} className={ci > 0 ? "font-mono" : ""}>
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        continue;
      }

      if (line.startsWith("## ")) {
        elements.push(
          <h3 key={i} className="brief-heading">
            {line.replace("## ", "")}
          </h3>
        );
      } else if (line.startsWith("**") && line.endsWith("**")) {
        elements.push(
          <p key={i} className="brief-bold">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      } else if (line.startsWith("- ")) {
        elements.push(
          <div key={i} className="brief-list-item">
            <span className="brief-bullet" />
            {renderInline(line.slice(2))}
          </div>
        );
      } else if (line.startsWith("*") && !line.startsWith("**")) {
        elements.push(
          <p key={i} className="brief-footnote">
            {line.replace(/\*/g, "")}
          </p>
        );
      } else if (line.trim() === "") {
        elements.push(<div key={i} className="h-2" />);
      } else {
        elements.push(
          <p key={i} className="brief-text">
            {renderInline(line)}
          </p>
        );
      }
      i++;
    }
    return elements;
  }

  function renderInline(text: string) {
    const parts = text.split(/(\*\*[^*]+\*\*)/);
    return parts.map((part, pi) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <span key={pi} className="text-white font-semibold">
            {part.replace(/\*\*/g, "")}
          </span>
        );
      }
      return part;
    });
  }

  const scenarios: { key: Scenario; label: string; color: string }[] = [
    { key: "conservative", label: "Conservative", color: "var(--warning)" },
    { key: "base", label: "Base", color: "var(--accent)" },
    { key: "optimistic", label: "Optimistic", color: "var(--cyan)" },
  ];

  return (
    <PanelCard
      title="AI INVESTMENT BRIEF"
      icon={<FileText size={16} />}
      visible={visible}
      loaded={loaded}
      headerRight={
        loaded ? (
          <div className="flex items-center gap-2">
            {isTyping && (
              <span className="flex items-center gap-1 text-[10px] text-accent font-mono">
                <span className="typing-dot" />
                <span className="typing-dot" style={{ animationDelay: "0.2s" }} />
                <span className="typing-dot" style={{ animationDelay: "0.4s" }} />
                Generating
              </span>
            )}
            <span className="text-[10px] text-zinc-500 font-mono">Claude AI</span>
          </div>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={8} />
      ) : (
        <div>
          {/* Scenario Toggle */}
          <div className="scenario-toggle" role="tablist" aria-label="Investment scenario">
            {scenarios.map((s) => (
              <button
                key={s.key}
                role="tab"
                aria-selected={scenario === s.key}
                className={`scenario-btn ${scenario === s.key ? "scenario-btn-active" : ""}`}
                style={scenario === s.key ? { color: s.color, borderColor: s.color } : {}}
                onClick={() => setScenario(s.key)}
              >
                {s.label}
              </button>
            ))}
          </div>

          <div ref={containerRef} className="brief-container">
            {renderText(displayedText)}
            {isTyping && <span className="typing-cursor" />}
          </div>
        </div>
      )}
    </PanelCard>
  );
}
