"use client";

import { useState, useEffect, useCallback } from "react";

export function useStaggeredLoad(panelCount: number, delayMs = 200) {
  const [visiblePanels, setVisiblePanels] = useState<boolean[]>(
    new Array(panelCount).fill(false)
  );
  const [loadedPanels, setLoadedPanels] = useState<boolean[]>(
    new Array(panelCount).fill(false)
  );
  const [sourceCount, setSourceCount] = useState(0);
  const [isSearching, setIsSearching] = useState(false);

  const triggerLoad = useCallback(() => {
    setIsSearching(true);
    setVisiblePanels(new Array(panelCount).fill(false));
    setLoadedPanels(new Array(panelCount).fill(false));
    setSourceCount(0);

    // Stagger panel visibility
    for (let i = 0; i < panelCount; i++) {
      setTimeout(() => {
        setVisiblePanels((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, i * delayMs);
    }

    // Stagger data loading (appears after panel is visible)
    for (let i = 0; i < panelCount; i++) {
      setTimeout(() => {
        setLoadedPanels((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
        setSourceCount((prev) => Math.min(prev + Math.ceil(Math.random() * 2 + 1), 14));
      }, i * delayMs + 600 + Math.random() * 400);
    }

    // Final source count
    setTimeout(() => {
      setSourceCount(14);
    }, panelCount * delayMs + 1200);
  }, [panelCount, delayMs]);

  return { visiblePanels, loadedPanels, sourceCount, isSearching, triggerLoad };
}
