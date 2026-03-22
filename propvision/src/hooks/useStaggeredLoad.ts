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

const INIT_STAGES = [
  "Initializing neural search...",
  "Calibrating AI models...",
  "Establishing data connections...",
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
  const [isInitializing, setIsInitializing] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const triggerLoad = useCallback(() => {
    setIsSearching(true);
    setIsInitializing(true);
    setVisiblePanels(new Array(panelCount).fill(false));
    setLoadedPanels(new Array(panelCount).fill(false));
    setSourceCount(0);
    setCurrentSourceName(INIT_STAGES[0]);

    // Neural search initialization phase
    let initIdx = 0;
    const initInterval = setInterval(() => {
      initIdx++;
      if (initIdx < INIT_STAGES.length) {
        setCurrentSourceName(INIT_STAGES[initIdx]);
      } else {
        clearInterval(initInterval);
      }
    }, 600);

    const initTime = INIT_STAGES.length * 600;

    // After init, start source scanning
    setTimeout(() => {
      setIsInitializing(false);
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

      // Stagger data loading
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
    }, initTime);
  }, [panelCount, delayMs, isMobile]);

  const resetSearch = useCallback(() => {
    setIsSearching(false);
    setIsInitializing(false);
    setVisiblePanels(new Array(panelCount).fill(false));
    setLoadedPanels(new Array(panelCount).fill(false));
    setSourceCount(0);
    setCurrentSourceName("");
  }, [panelCount]);

  return { visiblePanels, loadedPanels, sourceCount, currentSourceName, isSearching, isInitializing, triggerLoad, resetSearch };
}
