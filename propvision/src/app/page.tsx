"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Activity,
  Database,
  Wifi,
  TrendingUp,
  Brain,
  Shield,
  BarChart3,
  Zap,
  Globe,
} from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { PropertyDetails } from "@/components/PropertyDetails";
import { MapView } from "@/components/MapView";
import { RentGauge } from "@/components/RentGauge";
import { MarketTrends } from "@/components/MarketTrends";
import { Comparables } from "@/components/Comparables";
import { NeighborhoodStats } from "@/components/NeighborhoodStats";
import { IntelligenceFeed } from "@/components/IntelligenceFeed";
import { InvestmentBrief } from "@/components/InvestmentBrief";
import { useStaggeredLoad } from "@/hooks/useStaggeredLoad";
import {
  mockProperty,
  mockComparables,
  mockRentEstimate,
  mockMarketData,
  mockNeighborhood,
  mockIntelItems,
  mockInvestmentBrief,
} from "@/lib/mockData";

export default function Home() {
  const [hasSearched, setHasSearched] = useState(false);
  const { visiblePanels, loadedPanels, sourceCount, isSearching, triggerLoad } =
    useStaggeredLoad(8);

  const handleSearch = useCallback(
    (_address: string) => {
      setHasSearched(true);
      triggerLoad();
    },
    [triggerLoad]
  );

  // Keyboard shortcut: Cmd+K to focus search
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        const input = document.querySelector<HTMLInputElement>(".search-input");
        input?.focus();
      }
      if (e.key === "Escape") {
        const input = document.querySelector<HTMLInputElement>(".search-input");
        input?.blur();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Grid background */}
      <div className="grid-lines" />

      {/* Header */}
      <header className="app-header relative z-10">
        <div className="max-w-[1600px] mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div className="flex-shrink-0">
            <div className="logo">PROPVISION</div>
            <div className="logo-sub">AI INVESTMENT COMMAND CENTER</div>
          </div>

          {hasSearched && (
            <SearchBar onSearch={handleSearch} isSearching={isSearching && sourceCount < 14} />
          )}

          <div className="flex-shrink-0 flex items-center gap-4">
            {hasSearched && sourceCount > 0 && (
              <div className="source-counter">
                <div className="source-dot" />
                {sourceCount < 14
                  ? `Analyzing ${sourceCount}/14 sources...`
                  : "14 sources analyzed"}
              </div>
            )}
            <div className="hidden md:flex items-center gap-3">
              <div className="status-indicator">
                <div className="status-dot" />
                API
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
      <main className="flex-1 relative z-10">
        {!hasSearched ? (
          <div className="empty-state">
            {/* Radar animation */}
            <div className="radar-container">
              <div className="radar-ring" />
              <div className="radar-ring" />
              <div className="radar-ring" />
            </div>

            <div>
              <div className="empty-state-title">PROPVISION</div>
              <div className="logo-sub text-center mt-1">
                AI PROPERTY INVESTMENT COMMAND CENTER
              </div>
            </div>

            <p className="empty-state-sub">
              Enter any US property address to generate a comprehensive
              AI-powered investment analysis. Real-time data from 14+ sources
              including MLS, public records, and neural search intelligence.
            </p>

            <SearchBar
              onSearch={handleSearch}
              isSearching={isSearching && sourceCount < 14}
            />

            <div className="feature-grid">
              <div className="feature-card">
                <TrendingUp size={20} className="feature-card-icon" />
                <span className="feature-card-label">Market Trends</span>
              </div>
              <div className="feature-card">
                <Brain size={20} className="feature-card-icon" />
                <span className="feature-card-label">AI Analysis</span>
              </div>
              <div className="feature-card">
                <Shield size={20} className="feature-card-icon" />
                <span className="feature-card-label">Risk Scoring</span>
              </div>
              <div className="feature-card">
                <BarChart3 size={20} className="feature-card-icon" />
                <span className="feature-card-label">Cash Flow</span>
              </div>
              <div className="feature-card">
                <Zap size={20} className="feature-card-icon" />
                <span className="feature-card-label">14+ Sources</span>
              </div>
              <div className="feature-card">
                <Globe size={20} className="feature-card-icon" />
                <span className="feature-card-label">Live Intel</span>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-2">
              <span className="kbd">⌘K</span>
              <span className="text-xs text-zinc-600 font-mono">to search</span>
            </div>
          </div>
        ) : (
          <div className="dashboard-grid">
            <PropertyDetails
              data={mockProperty}
              visible={visiblePanels[0]}
              loaded={loadedPanels[0]}
            />
            <MapView
              property={mockProperty}
              comparables={mockComparables}
              visible={visiblePanels[1]}
              loaded={loadedPanels[1]}
            />
            <RentGauge
              data={mockRentEstimate}
              visible={visiblePanels[2]}
              loaded={loadedPanels[2]}
            />
            <MarketTrends
              data={mockMarketData}
              visible={visiblePanels[3]}
              loaded={loadedPanels[3]}
            />
            <Comparables
              data={mockComparables}
              visible={visiblePanels[4]}
              loaded={loadedPanels[4]}
            />
            <NeighborhoodStats
              data={mockNeighborhood}
              visible={visiblePanels[5]}
              loaded={loadedPanels[5]}
            />
            <IntelligenceFeed
              data={mockIntelItems}
              visible={visiblePanels[6]}
              loaded={loadedPanels[6]}
            />
            <InvestmentBrief
              content={mockInvestmentBrief}
              visible={visiblePanels[7]}
              loaded={loadedPanels[7]}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer relative z-10">
        Powered by <span>Exa Neural Search</span> &bull;{" "}
        <span>Claude AI</span> &bull; <span>RentCast</span>
      </footer>
    </div>
  );
}
