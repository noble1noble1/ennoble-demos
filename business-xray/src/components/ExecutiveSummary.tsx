"use client";

import { useState, useEffect, useRef } from "react";
import { FileText, Sparkles } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { ScanResult } from "@/lib/mockData";

interface ExecutiveSummaryProps {
  data: ScanResult;
  visible: boolean;
  loaded: boolean;
}

function generateSummary(data: ScanResult): string {
  const seoAvg = Math.round(data.seoMetrics.reduce((s, m) => s + m.score, 0) / data.seoMetrics.length);
  const perfAvg = Math.round(data.performance.reduce((s, m) => s + m.score, 0) / data.performance.length);
  const aiAvg = Math.round(data.aiReadiness.reduce((s, m) => s + m.score, 0) / data.aiReadiness.length);
  const activeSocial = data.socialPresence.filter((s) => s.status === "active").length;
  const quickWins = data.recommendations.filter((r) => r.impact === "high" && r.effort === "easy").length;
  const topCompetitor = data.competitors.reduce((best, c) => c.overallScore > best.overallScore ? c : best, data.competitors[0]);

  return `## Business Health Overview

**${data.businessName}** (${data.industry}) scores **${data.overallScore}/100** overall. The site runs on **${data.techStack[0]?.name}** with **${data.techStack.length} technologies** detected.

## Key Findings

- **SEO Health: ${seoAvg}/100** — ${seoAvg >= 80 ? "Strong foundation with well-optimized pages" : seoAvg >= 60 ? "Solid base but several optimization opportunities remain" : "Significant gaps that are limiting organic visibility"}
- **Performance: ${perfAvg}/100** — ${perfAvg >= 80 ? "Fast, well-optimized site experience" : perfAvg >= 60 ? "Acceptable speed but Core Web Vitals need attention" : "Slow load times impacting user experience and rankings"}
- **AI Readiness: ${aiAvg}/100** — ${aiAvg >= 70 ? "Well-positioned for AI-powered search visibility" : aiAvg >= 50 ? "Moderate AI visibility — structured data and content gaps" : "Low AI citability — missing critical schema and content signals"}
- **Social Presence:** ${activeSocial}/${data.socialPresence.length} platforms active

## Competitive Position

Your site trails **${topCompetitor.name}** (${topCompetitor.overallScore}/100) by ${topCompetitor.overallScore - data.overallScore} points. Key competitor advantages: ${topCompetitor.strengths.join(", ")}.

## Priority Actions

${data.recommendations.filter((r) => r.impact === "high").slice(0, 3).map((r, i) => `${i + 1}. **${r.title}** — ${r.description.split(".")[0]}.`).join("\n")}

${quickWins > 0 ? `\n**${quickWins} Quick Win${quickWins > 1 ? "s" : ""} identified** — high-impact changes requiring minimal effort.` : ""}

*Analysis powered by Claude AI — ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}*`;
}

export function ExecutiveSummary({ data, visible, loaded }: ExecutiveSummaryProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const content = generateSummary(data);

  useEffect(() => {
    if (!loaded) {
      setDisplayedText("");
      setIsTyping(false);
      return;
    }

    setIsTyping(true);
    let i = 0;
    const chunkSize = 6;

    const interval = setInterval(() => {
      if (i < content.length) {
        const end = Math.min(i + chunkSize, content.length);
        setDisplayedText(content.slice(0, end));
        i = end;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 8);

    return () => clearInterval(interval);
  }, [loaded, content]);

  function renderText(text: string) {
    const lines = text.split("\n");
    return lines.map((line, i) => {
      if (line.startsWith("## ")) {
        return (
          <h3 key={i} className="exec-heading">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <div key={i} className="exec-list-item">
            <span className="exec-bullet" />
            {renderInline(line.slice(2))}
          </div>
        );
      }
      if (line.match(/^\d+\. /)) {
        return (
          <div key={i} className="exec-list-item exec-numbered">
            {renderInline(line)}
          </div>
        );
      }
      if (line.startsWith("*") && !line.startsWith("**")) {
        return (
          <p key={i} className="exec-footnote">
            {line.replace(/\*/g, "")}
          </p>
        );
      }
      if (line.trim() === "") {
        return <div key={i} className="h-2" />;
      }
      return (
        <p key={i} className="exec-text">
          {renderInline(line)}
        </p>
      );
    });
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

  return (
    <PanelCard
      title="EXECUTIVE SUMMARY"
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
              </span>
            )}
            <span className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
              <Sparkles size={9} />
              Claude AI
            </span>
          </div>
        ) : null
      }
    >
      {!loaded ? (
        <ShimmerLoader lines={8} />
      ) : (
        <div ref={containerRef} className="exec-container">
          {renderText(displayedText)}
          {isTyping && <span className="typing-cursor" />}
        </div>
      )}
    </PanelCard>
  );
}
