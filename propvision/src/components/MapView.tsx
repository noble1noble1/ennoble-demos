"use client";

import { useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import { PanelCard } from "./ui/PanelCard";
import { ShimmerLoader } from "./ui/ShimmerLoader";
import { PropertyData, ComparableProperty } from "@/lib/mockData";

interface MapViewProps {
  property: PropertyData;
  comparables: ComparableProperty[];
  visible: boolean;
  loaded: boolean;
}

export function MapView({ property, comparables, visible, loaded }: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!loaded || !mapContainer.current || mapRef.current) return;

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

        mapRef.current = map;

        // Main property marker
        const mainEl = document.createElement("div");
        mainEl.className = "main-marker";
        new mapboxgl.Marker({ element: mainEl })
          .setLngLat(property.coordinates)
          .addTo(map);

        // Comparable markers
        comparables.forEach((comp) => {
          const compEl = document.createElement("div");
          compEl.className = "comp-marker";
          new mapboxgl.Marker({ element: compEl })
            .setLngLat(comp.coordinates)
            .addTo(map!);
        });
      } catch {
        // Token is placeholder — map container renders but tiles won't load
        // Show a fallback dark container
      }
    }

    initMap();

    return () => {
      if (map) {
        map.remove();
        mapRef.current = null;
      }
    };
  }, [loaded, property.coordinates, comparables]);

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
