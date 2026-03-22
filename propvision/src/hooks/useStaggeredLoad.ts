"use client";

import { useState, useEffect, useCallback } from "react";

const SOURCE_NAMES = [
  "Connecting to MLS...",
  "Fetching public records...",
  "Running comp analysis...",
  "Fetching census data...",
  "Analyzing rental market...",
  "Checking tax assessments...",
  "Scanning zoning data...",
  "Pulling school ratings...",
  "Analyzing crime statistics...",
  "Fetching transit data...",
  "Running valuation model...",
  "Checking building permits...",
  "Analyzing market trends...",
  "Running AI analysis...",
];

export function useStaggeredLoad(panelCount: number, delayMs = 200) {
  const [visiblePanels, setVisiblePanels] = useState<boolean[]>(
    new Array(panelCount).fill(false)
  );
  const [loadedPanels, setLoadedPanels] = useState<boolean[]>(
    new Array(panelCount).fill(false)
  );
  const [sourceCount, setSourceCount] = useState(0);
  const [currentSourceName, setCurrentSourceName] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const triggerLoad = useCallback(() => {
    setIsSearching(true);
    setVisiblePanels(new Array(panelCount).fill(false));
    setLoadedPanels(new Array(panelCount).fill(false));
    setSourceCount(0);
    setCurrentSourceName(SOURCE_NAMES[0]);

    const staggerDelay = isMobile ? delayMs * 2.5 : delayMs;

    // Stagger panel visibility
    for (let i = 0; i < panelCount; i++) {
      setTimeout(() => {
        setVisiblePanels((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * staggerDelay);
    }

    // Stagger data loading (appears after panel is visible)
    for (let i = 0; i < panelCount; i++) {
      setTimeout(() => {
        setLoadedPanels((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setSourceCount((prev) => {
          const next = Math.min(prev + Math.ceil(Math.random() * 2 + 1), 14);
          if (next < SOURCE_NAMES.length) {
            setCurrentSourceName(SOURCE_NAMES[next]);
          }
          return next;
        });
      }, i * staggerDelay + 600 + Math.random() * 400);
    }

    // Final source count
    setTimeout(() => {
      setSourceCount(14);
      setCurrentSourceName("All sources analyzed");
    }, panelCount * staggerDelay + 1200);
  }, [panelCount, delayMs, isMobile]);

  return { visiblePanels, loadedPanels, sourceCount, currentSourceName, isSearching, triggerLoad };
}
