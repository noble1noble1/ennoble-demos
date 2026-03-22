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
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const triggerLoad = useCallback(() => {
    if (started.current) return;
    started.current = true;
    setIsScanning(true);
  }, []);

  const resetScan = useCallback(() => {
    started.current = false;
    setIsScanning(false);
    setScanProgress(0);
    setCurrentStage("");
    setVisiblePanels(Array(panelCount).fill(false));
    setLoadedPanels(Array(panelCount).fill(false));
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, [panelCount]);

  useEffect(() => {
    if (!isScanning) return;

    // Animate scan stages with variable timing for drama
    let stageIdx = 0;
    const stageTimings = scanStages.map((_, i) => {
      // Make early stages faster, pause on key moments
      if (i < 2) return 200; // DNS + connect: fast
      if (i === 6) return 500; // SSL check: dramatic pause
      if (i === 11) return 500; // AI readiness: dramatic pause
      if (i >= scanStages.length - 2) return 400; // Final stages: slightly slower
      return 300;
    });

    let elapsed = 0;
    const scheduleStage = () => {
      if (stageIdx >= scanStages.length) return;
      const delay = stageTimings[stageIdx];
      const t = setTimeout(() => {
        setCurrentStage(scanStages[stageIdx]);
        setScanProgress(((stageIdx + 1) / scanStages.length) * 100);
        stageIdx++;
        scheduleStage();
      }, delay);
      timers.current.push(t);
      elapsed += delay;
    };
    scheduleStage();

    // Calculate total scan time
    const totalScanTime = stageTimings.reduce((a, b) => a + b, 0) + 500;

    const showTimer = setTimeout(() => {
      setIsScanning(false);

      // Stagger panel visibility
      for (let i = 0; i < panelCount; i++) {
        const vt = setTimeout(() => {
          setVisiblePanels((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 200);
        timers.current.push(vt);

        const lt = setTimeout(() => {
          setLoadedPanels((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, i * 200 + 600);
        timers.current.push(lt);
      }
    }, totalScanTime);
    timers.current.push(showTimer);

    return () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
  }, [isScanning, panelCount]);

  return {
    visiblePanels,
    loadedPanels,
    scanProgress,
    currentStage,
    isScanning,
    triggerLoad,
    resetScan,
  };
}
