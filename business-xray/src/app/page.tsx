"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  Code2,
  Search,
  Gauge,
  Users,
  Target,
  Brain,
  Sparkles,
  Globe,
  Loader2,
  Lightbulb,
  MousePointerClick,
  ArrowLeft,
  FileDown,
} from "lucide-react";
import { TechStack } from "@/components/TechStack";
import { SEOScore } from "@/components/SEOScore";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { SocialPresencePanel } from "@/components/SocialPresence";
import { CompetitorAnalysis } from "@/components/CompetitorAnalysis";
import { AIReadiness } from "@/components/AIReadiness";
import { Recommendations } from "@/components/Recommendations";
import { ConversionFlow } from "@/components/ConversionFlow";
import { ExecutiveSummary } from "@/components/ExecutiveSummary";
import { useStaggeredLoad } from "@/hooks/useStaggeredLoad";
import { mockScanResult } from "@/lib/mockData";

function AnimatedScore({ value, duration = 1200 }: { value: number; duration?: number }) {
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const startTime = Date.now();

    function tick() {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }

    requestAnimationFrame(tick);
  }, [value, duration]);

  return <>{display}</>;
}

export default function Home() {
  const [hasScanned, setHasScanned] = useState(false);
  const [url, setUrl] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const {
    visiblePanels,
    loadedPanels,
    scanProgress,
    currentStage,
    isScanning,
    triggerLoad,
    resetScan,
  } = useStaggeredLoad(9);

  const analysisTimestamp = new Date().toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const handleScan = useCallback(
    (inputUrl: string) => {
      if (!inputUrl.trim()) return;
      setUrl(inputUrl.trim());
      setHasScanned(true);
      triggerLoad();
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [triggerLoad]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      handleScan(url);
    },
    [url, handleScan]
  );

  const handleDemo = useCallback(() => {
    const demoUrl = "brightleaf-coffee.com";
    setUrl(demoUrl);
    handleScan(demoUrl);
  }, [handleScan]);

  const handleNewScan = useCallback(() => {
    setHasScanned(false);
    setUrl("");
    resetScan();
  }, [resetScan]);

  // Keyboard shortcut
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(".scan-input");
        input?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const allLoaded = loadedPanels.every(Boolean);

  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="grid-lines" />

      {/* Header */}
      <header className="app-header relative z-10" role="banner">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <div className="logo">BUSINESS<span style={{ opacity: 0.5 }}>X</span>RAY</div>
            <div className="logo-sub">AI BUSINESS INTELLIGENCE SCANNER</div>
          </div>

          {hasScanned && !isScanning && (
            <form onSubmit={handleSubmit} className="flex-1 max-w-md hidden md:block">
              <div className={`scan-bar ${isFocused ? "scan-bar-focused" : ""}`}>
                <Search size={16} className="text-zinc-500 mr-2 flex-shrink-0" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder="Scan another site..."
                  className="scan-input"
                  style={{ fontSize: 12, padding: "6px 0" }}
                />
              </div>
            </form>
          )}

          <div className="flex-shrink-0 flex items-center gap-3">
            {hasScanned && allLoaded && (
              <div className="header-actions">
                <button
                  className="action-btn action-btn-secondary"
                  onClick={handleNewScan}
                  aria-label="New scan"
                  title="Scan a different site"
                >
                  <ArrowLeft size={14} />
                  <span className="hidden sm:inline">New Scan</span>
                </button>
                <button
                  className="action-btn"
                  onClick={() => {}}
                  aria-label="Download full report"
                  title="Download Full Report"
                >
                  <FileDown size={14} />
                  <span className="hidden sm:inline">Full Report</span>
                </button>
              </div>
            )}
            <div className="hidden md:flex items-center gap-3">
              <div className="status-indicator">
                <div className="status-dot" />
                SCANNER
              </div>
              <div className="status-indicator">
                <div className="status-dot" />
                LIVE
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10" role="main">
        {!hasScanned ? (
          <div className="empty-state">
            <div className="data-particles">
              <span className="data-particle">SEO Score: 82</span>
              <span className="data-particle">React 18.2</span>
              <span className="data-particle">PageSpeed: 94</span>
              <span className="data-particle">SSL: Valid</span>
              <span className="data-particle">Schema: Missing</span>
              <span className="data-particle">Followers: 12.4K</span>
              <span className="data-particle">LCP: 1.8s</span>
              <span className="data-particle">AI Ready: 72%</span>
            </div>

            <div className="scan-line" />

            <div className="radar-container">
              <div className="radar-ring" />
              <div className="radar-ring" />
              <div className="radar-ring" />
              <div className="radar-ring" />
              <div className="radar-sweep" />
            </div>

            <div className="fade-up">
              <div className="empty-state-title">BUSINESS<span style={{ opacity: 0.4 }}>X</span>RAY</div>
              <div className="logo-sub text-center mt-1">
                AI BUSINESS INTELLIGENCE SCANNER
              </div>
            </div>

            <p className="empty-state-sub fade-up">
              Enter any business website URL to instantly scan and analyze
              tech stack, SEO health, performance metrics, social presence,
              competitor landscape, and AI readiness.
            </p>

            <div className="fade-up" style={{ width: "100%", display: "flex", justifyContent: "center" }}>
              <form onSubmit={handleSubmit} className="scan-bar-wrapper">
                <div className={`scan-bar ${isFocused ? "scan-bar-focused" : ""}`}>
                  <div className="flex-shrink-0 mr-2.5">
                    <Globe size={20} className="text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    placeholder="Enter any business website URL..."
                    className="scan-input"
                    autoFocus
                  />
                  <button
                    type="submit"
                    disabled={!url.trim()}
                    className="scan-button"
                  >
                    SCAN
                  </button>
                </div>
                <button type="button" onClick={handleDemo} className="demo-button">
                  Try demo: brightleaf-coffee.com
                </button>
              </form>
            </div>

            <div className="stats-ticker fade-up">
              <div className="ticker-item">
                <span className="ticker-value">8</span>
                <span className="ticker-label">Dimensions</span>
              </div>
              <div className="ticker-divider" />
              <div className="ticker-item">
                <span className="ticker-value cyan">60+</span>
                <span className="ticker-label">Checks</span>
              </div>
              <div className="ticker-divider" />
              <div className="ticker-item">
                <span className="ticker-value">&lt;5s</span>
                <span className="ticker-label">Scan Time</span>
              </div>
              <div className="ticker-divider" />
              <div className="ticker-item">
                <span className="ticker-value cyan">AI</span>
                <span className="ticker-label">Powered</span>
              </div>
            </div>

            <div className="feature-grid fade-up">
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <Code2 size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">Tech Stack</span>
                <span className="feature-card-desc">Detect frameworks and tools</span>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <Search size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">SEO Score</span>
                <span className="feature-card-desc">Full SEO health check</span>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <Gauge size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">Performance</span>
                <span className="feature-card-desc">Core Web Vitals analysis</span>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <Users size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">Social</span>
                <span className="feature-card-desc">Social presence audit</span>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <Target size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">Competitors</span>
                <span className="feature-card-desc">Competitive landscape</span>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <Brain size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">AI Readiness</span>
                <span className="feature-card-desc">AI visibility scoring</span>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <Lightbulb size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">Recommendations</span>
                <span className="feature-card-desc">AI action items</span>
              </div>
              <div className="feature-card">
                <div className="feature-card-icon-wrap">
                  <MousePointerClick size={18} className="feature-card-icon" />
                </div>
                <span className="feature-card-label">Conversions</span>
                <span className="feature-card-desc">CTA & capture audit</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2 fade-up">
              <span className="kbd">⌘K</span>
              <span className="text-xs text-zinc-600 font-mono">to scan</span>
            </div>
          </div>
        ) : isScanning ? (
          <div className="scanning-overlay">
            <div className="scan-target">
              <div className="scan-ring" />
              <div className="scan-ring" />
              <div className="scan-ring" />
              <div className="scan-crosshair" />
            </div>
            <div className="scan-url-display">{url}</div>
            <div className="scan-progress-bar">
              <div className="scan-progress-fill" style={{ width: `${scanProgress}%` }} />
            </div>
            <div className="scan-progress-pct">{Math.round(scanProgress)}%</div>
            <div className="scan-status">
              <Loader2 size={12} className="inline animate-spin mr-2 text-accent" />
              {currentStage}
            </div>
            {/* Stage log */}
            <div className="scan-stage-log">
              {scanProgress > 20 && <div className="scan-stage-done">Resolving DNS... <span className="text-accent">done</span></div>}
              {scanProgress > 35 && <div className="scan-stage-done">Checking SSL certificate... <span className="text-accent">valid</span></div>}
              {scanProgress > 50 && <div className="scan-stage-done">Analyzing HTML structure... <span className="text-accent">parsed</span></div>}
              {scanProgress > 65 && <div className="scan-stage-done">Detecting tech stack... <span className="text-accent">{mockScanResult.techStack.length} found</span></div>}
              {scanProgress > 80 && <div className="scan-stage-done">Computing scores... <span className="text-accent">ready</span></div>}
            </div>
          </div>
        ) : (
          <>
            {/* Meta bar */}
            {allLoaded && (
              <div className="flex items-center gap-4 px-4 py-2.5 max-w-[1600px] mx-auto flex-wrap">
                <div className="ai-badge">
                  <Sparkles size={12} />
                  AI-Powered Scan
                </div>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {mockScanResult.businessName} &bull; {mockScanResult.industry}
                </span>
                <span className="text-[10px] text-zinc-600 font-mono ml-auto">
                  Scanned {analysisTimestamp}
                </span>
              </div>
            )}

            {/* Overall Score Hero */}
            <div className="overall-score-hero">
              <div className="overall-score-ring-wrap">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={mockScanResult.overallScore >= 80 ? "#00ff88" : mockScanResult.overallScore >= 60 ? "#ff8800" : "#ff4444"}
                    strokeWidth="7" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - mockScanResult.overallScore / 100)}`}
                    transform="rotate(-90 60 60)"
                    className="overall-score-arc"
                  />
                  <text x="60" y="56" textAnchor="middle" fill="white" fontSize="32" fontFamily="monospace" fontWeight="bold">
                    <AnimatedScore value={mockScanResult.overallScore} />
                  </text>
                  <text x="60" y="72" textAnchor="middle" fill="#666" fontSize="10" fontFamily="monospace">/100</text>
                </svg>
              </div>
              <div className="overall-score-details">
                <div className="overall-score-label">OVERALL SCORE</div>
                <div className="overall-score-name">{mockScanResult.businessName}</div>
                <div className="overall-score-breakdown">
                  {[
                    { label: "SEO", score: Math.round(mockScanResult.seoMetrics.reduce((s, m) => s + m.score, 0) / mockScanResult.seoMetrics.length) },
                    { label: "Performance", score: Math.round(mockScanResult.performance.reduce((s, m) => s + m.score, 0) / mockScanResult.performance.length) },
                    { label: "AI Ready", score: Math.round(mockScanResult.aiReadiness.reduce((s, m) => s + m.score, 0) / mockScanResult.aiReadiness.length) },
                  ].map((item) => (
                    <div key={item.label} className="overall-score-item">
                      <span className="overall-score-item-label">{item.label}</span>
                      <div className="overall-score-item-bar">
                        <div
                          className="overall-score-item-fill"
                          style={{
                            width: `${item.score}%`,
                            background: item.score >= 80 ? "#00ff88" : item.score >= 60 ? "#ff8800" : "#ff4444",
                          }}
                        />
                      </div>
                      <span className="overall-score-item-value" style={{ color: item.score >= 80 ? "#00ff88" : item.score >= 60 ? "#ff8800" : "#ff4444" }}>
                        {item.score}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="dashboard-grid" role="region" aria-label="Business scan results">
              <TechStack
                data={mockScanResult.techStack}
                visible={visiblePanels[0]}
                loaded={loadedPanels[0]}
              />
              <SEOScore
                data={mockScanResult.seoMetrics}
                visible={visiblePanels[1]}
                loaded={loadedPanels[1]}
              />
              <PerformanceMetrics
                data={mockScanResult.performance}
                visible={visiblePanels[2]}
                loaded={loadedPanels[2]}
              />
              <SocialPresencePanel
                data={mockScanResult.socialPresence}
                visible={visiblePanels[3]}
                loaded={loadedPanels[3]}
              />
              <CompetitorAnalysis
                data={mockScanResult.competitors}
                subjectScore={mockScanResult.overallScore}
                visible={visiblePanels[4]}
                loaded={loadedPanels[4]}
              />
              <AIReadiness
                data={mockScanResult.aiReadiness}
                visible={visiblePanels[5]}
                loaded={loadedPanels[5]}
              />
              <Recommendations
                data={mockScanResult.recommendations}
                visible={visiblePanels[6]}
                loaded={loadedPanels[6]}
              />
              <ConversionFlow
                data={mockScanResult.conversionChecks}
                visible={visiblePanels[7]}
                loaded={loadedPanels[7]}
              />
              <ExecutiveSummary
                data={mockScanResult}
                visible={visiblePanels[8]}
                loaded={loadedPanels[8]}
              />
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer relative z-10" role="contentinfo">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="footer-logo">BUSINESSXRAY</span>
            <span className="footer-tagline">AI Business Intelligence</span>
          </div>
          <div className="footer-powered">
            <span className="footer-label">POWERED BY</span>
            <div className="footer-sources">
              <span className="footer-source">Claude AI</span>
              <span className="footer-dot" />
              <span className="footer-source">Lighthouse</span>
              <span className="footer-dot" />
              <span className="footer-source">Wappalyzer</span>
            </div>
          </div>
          <div className="footer-meta">
            <span style={{ letterSpacing: "0.06em" }}>v2.0.0</span>
            <span style={{ color: "#333" }}>|</span>
            <div className="footer-status">
              <span className="footer-status-dot" />
              All Systems Operational
            </div>
          </div>
        </div>
        <div className="footer-gradient" />
      </footer>
    </div>
  );
}
