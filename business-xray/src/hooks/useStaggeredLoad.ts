"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { scanStages } from "@/lib/mockData";

export function useStaggeredLoad(panelCount: number) {
  const [visiblePanels, setVisiblePanels] = useState<boolean[]>(
    Array(panelCount).fill(false)
  );
  const [loadedPanels, setLoadedPanels] = useState<boolean[]>(
    Array(panelCount).fill(false)
  );
  const [scanProgress, setScanProgress] = useState(0);
  const [currentStage, setCurrentStage] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const started = useRef(false);

  const triggerLoad = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setIsScanning(true);
  }, []);

  useEffect(() => {
    if (!isScanning) return;

    // Animate scan stages
    let stageIdx = 0;
    const stageInterval = setInterval(() => {
      if (stageIdx < scanStages.length) {
        setCurrentStage(scanStages[stageIdx]);
        setScanProgress(((stageIdx + 1) / scanStages.length) * 100);
        stageIdx++;
      } else {
        clearInterval(stageInterval);
      }
    }, 300);

    // After scanning, show panels
    const totalScanTime = scanStages.length * 300 + 500;

    const showTimer = setTimeout(() => {
      setIsScanning(false);

      // Stagger panel visibility
      for (let i = 0; i < panelCount; i++) {
        setTimeout(() => {
          setVisiblePanels((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 200);

        setTimeout(() => {
          setLoadedPanels((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 200 + 600);
      }
    }, totalScanTime);

    return () => {
      clearInterval(stageInterval);
      clearTimeout(showTimer);
    };
  }, [isScanning, panelCount]);

  return {
    visiblePanels,
    loadedPanels,
    scanProgress,
    currentStage,
    isScanning,
    triggerLoad,
  };
}
