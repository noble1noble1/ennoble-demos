"use client";

import { useState, useCallback } from "react";
import { Activity, Database, Wifi } from "lucide-react";
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

          <SearchBar onSearch={handleSearch} isSearching={isSearching && sourceCount < 14} />

          <div className="flex-shrink-0 flex items-center gap-4">
            {hasSearched && sourceCount > 0 && (
              <div className="source-counter">
                <div className="source-dot" />
                {sourceCount < 14
                  ? `Analyzing ${sourceCount} sources...`
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
            <div>
              <div className="empty-state-title">PROPVISION</div>
              <div className="logo-sub text-center mt-1">
                AI PROPERTY INVESTMENT COMMAND CENTER
              </div>
            </div>
            <p className="empty-state-sub">
              Enter any US property address to generate a comprehensive
              investment analysis. Powered by real-time data from 14+ sources
              including MLS, public records, and AI intelligence.
            </p>
            <SearchBar
              onSearch={handleSearch}
              isSearching={isSearching && sourceCount < 14}
            />
            <div className="flex gap-6 mt-4">
              <div className="status-indicator">
                <Activity size={12} className="text-accent" />
                Real-time Analysis
              </div>
              <div className="status-indicator">
                <Database size={12} className="text-accent" />
                14+ Data Sources
              </div>
              <div className="status-indicator">
                <Wifi size={12} className="text-accent" />
                AI Intelligence
              </div>
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
