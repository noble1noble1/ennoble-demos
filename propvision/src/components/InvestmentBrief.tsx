"use client";

import { useState, useEffect, useRef } from "react";
import { FileText } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";

interface InvestmentBriefProps {
  content: string;
  visible: boolean;
  loaded: boolean;
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
  const containerRef = useRef<HTMLDivElement>(null);

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
      if (i < content.length) {
        const end = Math.min(i + chunkSize, content.length);
        setDisplayedText(content.slice(0, end));
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
  }, [loaded, content]);

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
        <div ref={containerRef} className="brief-container">
          {renderText(displayedText)}
          {isTyping && <span className="typing-cursor" />}
        </div>
      )}
    </PanelCard>
  );
}
