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
    const chunkSize = 3;

    const interval = setInterval(() => {
      if (i < content.length) {
        const end = Math.min(i + chunkSize, content.length);
        setDisplayedText(content.slice(0, end));
        i = end;

        // Auto-scroll
        if (containerRef.current) {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 12);

    return () => clearInterval(interval);
  }, [loaded, content]);

  // Simple markdown-like rendering
  function renderText(text: string) {
    const lines = text.split("\n");
    return lines.map((line, idx) => {
      if (line.startsWith("## ")) {
        return (
          <h3 key={idx} className="text-accent font-bold text-sm mt-4 mb-2 font-mono">
            {line.replace("## ", "")}
          </h3>
        );
      }
      if (line.startsWith("| ")) {
        return (
          <div key={idx} className="text-[11px] text-zinc-400 font-mono whitespace-pre">
            {line}
          </div>
        );
      }
      if (line.startsWith("**") && line.endsWith("**")) {
        return (
          <p key={idx} className="text-xs text-white font-semibold mt-2">
            {line.replace(/\*\*/g, "")}
          </p>
        );
      }
      if (line.startsWith("- ")) {
        return (
          <div key={idx} className="text-xs text-zinc-400 pl-3 py-0.5">
            {line}
          </div>
        );
      }
      if (line.startsWith("*")) {
        return (
          <p key={idx} className="text-[10px] text-zinc-600 italic mt-2">
            {line.replace(/\*/g, "")}
          </p>
        );
      }
      if (line.trim() === "") {
        return <div key={idx} className="h-1" />;
      }
      // Handle inline bold
      const parts = line.split(/(\*\*[^*]+\*\*)/);
      return (
        <p key={idx} className="text-xs text-zinc-400 leading-relaxed">
          {parts.map((part, pi) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <span key={pi} className="text-white font-semibold">
                  {part.replace(/\*\*/g, "")}
                </span>
              );
            }
            return part;
          })}
        </p>
      );
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
