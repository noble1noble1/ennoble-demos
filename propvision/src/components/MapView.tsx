"use client";

import { useEffect, useRef, useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { PropertyData, ComparableProperty } from "@/lib/mockData";

interface MapViewProps {
  property: PropertyData;
  comparables: ComparableProperty[];
  visible: boolean;
  loaded: boolean;
}

function StaticMapPlaceholder({ property, comparables }: { property: PropertyData; comparables: ComparableProperty[] }) {
  const [lat, lng] = [property.coordinates[1], property.coordinates[0]];

  return (
    <div className="map-placeholder">
      {/* Grid overlay */}
      <div className="map-grid" />

      {/* Radial gradient glow */}
      <div className="map-glow" />

      {/* Coordinate lines */}
      <div className="map-crosshair-h" />
      <div className="map-crosshair-v" />

      {/* Range rings */}
      <div className="map-range-ring ring-1" />
      <div className="map-range-ring ring-2" />
      <div className="map-range-ring ring-3" />

      {/* Distance labels */}
      <div className="map-distance-label" style={{ top: "50%", left: "calc(50% + 50px)" }}>0.1mi</div>
      <div className="map-distance-label" style={{ top: "50%", left: "calc(50% + 90px)" }}>0.3mi</div>
      <div className="map-distance-label" style={{ top: "50%", left: "calc(50% + 130px)" }}>0.5mi</div>

      {/* Comparable dots */}
      {comparables.map((comp, i) => {
        const dx = (comp.coordinates[0] - lng) * 8000;
        const dy = (lat - comp.coordinates[1]) * 8000;
        return (
          <div
            key={i}
            className="map-comp-dot"
            style={{
              left: `calc(50% + ${dx}px)`,
              top: `calc(50% + ${dy}px)`,
              animationDelay: `${i * 200}ms`,
            }}
          />
        );
      })}

      {/* Center marker */}
      <div className="map-center-marker">
        <div className="map-center-pulse" />
        <div className="map-center-dot" />
      </div>

      {/* Coordinate label */}
      <div className="map-coord-label top-left">
        <span>{(lat + 0.003).toFixed(4)}°N</span>
      </div>
      <div className="map-coord-label bottom-right">
        <span>{(lng - 0.003).toFixed(4)}°W</span>
      </div>
      <div className="map-coord-label center-label">
        <Navigation size={10} className="inline mr-1" />
        {lat.toFixed(4)}°N, {Math.abs(lng).toFixed(4)}°W
      </div>
    </div>
  );
}

export function MapView({ property, comparables, visible, loaded }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [mapFailed, setMapFailed] = useState(false);

  useEffect(() => {
    if (!loaded || !mapContainer.current || mapRef.current || mapFailed) return;

    let map: mapboxgl.Map | null = null;

    async function initMap() {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");

      mapboxgl.accessToken =
        "pk.eyJ1Ijoibm9ibGUxIiwiYSI6ImNsdWNhdGVkMSJ9.placeholder";

      try {
        map = new mapboxgl.Map({
          container: mapContainer.current!,
          style: "mapbox://styles/mapbox/dark-v11",
          center: property.coordinates,
          zoom: 15,
        });

        map.on("error", () => {
          setMapFailed(true);
          try { map?.remove(); } catch { /* map cleanup can fail with invalid token */ }
          mapRef.current = null;
        });

        mapRef.current = map;

        const mainEl = document.createElement("div");
        mainEl.className = "main-marker";
        new mapboxgl.Marker({ element: mainEl })
          .setLngLat(property.coordinates)
          .addTo(map);

        comparables.forEach((comp) => {
          const compEl = document.createElement("div");
          compEl.className = "comp-marker";
          new mapboxgl.Marker({ element: compEl })
            .setLngLat(comp.coordinates)
            .addTo(map!);
        });
      } catch {
        setMapFailed(true);
      }
    }

    initMap();

    return () => {
      if (map) {
        try { map.remove(); } catch { /* map cleanup can fail with invalid token */ }
        mapRef.current = null;
      }
    };
  }, [loaded, property.coordinates, comparables, mapFailed]);

  return (
    <PanelCard
      title="LOCATION MAP"
      icon={<MapPin size={16} />}
      visible={visible}
      loaded={loaded}
      className="map-panel"
      headerRight={
        loaded ? (
          <span className="text-xs text-zinc-500 font-mono">
            {property.coordinates[1].toFixed(4)}, {property.coordinates[0].toFixed(4)}
          </span>
        ) : null
      }
    >
      {!loaded ? (
        <div className="h-[280px] flex items-center justify-center">
          <ShimmerLoader lines={1} className="w-full h-full" />
        </div>
      ) : mapFailed ? (
        <StaticMapPlaceholder property={property} comparables={comparables} />
      ) : (
        <div className="relative">
          <div ref={mapContainer} className="map-container" />
          <div className="map-overlay">
            <div className="map-overlay-dot main" /> Subject Property
            <div className="map-overlay-dot comp ml-4" /> Comparables ({comparables.length})
          </div>
        </div>
      )}
    </PanelCard>
  );
}
