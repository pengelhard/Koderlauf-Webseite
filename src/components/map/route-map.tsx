"use client";

import { useRef, useEffect } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GpxPoint } from "@/lib/gpx";
import { toGeoJson } from "@/lib/gpx";

interface RouteMapProps {
  points: GpxPoint[];
  className?: string;
}

export function RouteMap({ points, className = "" }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  useEffect(() => {
    if (!containerRef.current || points.length === 0) return;
    if (mapRef.current) return;

    const bounds = points.reduce(
      (b, p) => {
        if (p.lon < b.minLon) b.minLon = p.lon;
        if (p.lon > b.maxLon) b.maxLon = p.lon;
        if (p.lat < b.minLat) b.minLat = p.lat;
        if (p.lat > b.maxLat) b.maxLat = p.lat;
        return b;
      },
      { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity }
    );

    const centerLon = (bounds.minLon + bounds.maxLon) / 2;
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;

    const map = new maplibregl.Map({
      container: containerRef.current,
      style: {
        version: 8,
        sources: {
          satellite: {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
            ],
            tileSize: 256,
            attribution: "Esri, Maxar, Earthstar Geographics",
            maxzoom: 18,
          },
          terrain: {
            type: "raster-dem",
            tiles: [
              "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            encoding: "terrarium",
            maxzoom: 15,
          },
          labels: {
            type: "raster",
            tiles: [
              "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors",
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: "satellite-layer",
            type: "raster",
            source: "satellite",
            paint: { "raster-opacity": 1 },
          },
          {
            id: "labels-layer",
            type: "raster",
            source: "labels",
            paint: { "raster-opacity": 0.3 },
          },
        ],
        terrain: {
          source: "terrain",
          exaggeration: 1.5,
        },
        sky: {},
      },
      center: [centerLon, centerLat],
      zoom: 12.5,
      pitch: 60,
      bearing: -20,
      maxPitch: 85,
    });

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(
      new maplibregl.TerrainControl({ source: "terrain", exaggeration: 1.5 }),
      "top-right"
    );

    map.on("load", () => {
      const geojson = toGeoJson(points);

      map.addSource("route", {
        type: "geojson",
        data: geojson as GeoJSON.Feature,
      });

      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#FF6B00",
          "line-width": 8,
          "line-opacity": 0.3,
          "line-blur": 4,
        },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#FF6B00",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      const startPt = points[0];
      const endPt = points[points.length - 1];

      new maplibregl.Marker({ color: "#22C55E" })
        .setLngLat([startPt.lon, startPt.lat])
        .setPopup(new maplibregl.Popup().setHTML("<strong>Start</strong>"))
        .addTo(map);

      new maplibregl.Marker({ color: "#EF4444" })
        .setLngLat([endPt.lon, endPt.lat])
        .setPopup(new maplibregl.Popup().setHTML("<strong>Ziel</strong>"))
        .addTo(map);

      map.fitBounds(
        [
          [bounds.minLon - 0.005, bounds.minLat - 0.005],
          [bounds.maxLon + 0.005, bounds.maxLat + 0.005],
        ],
        { padding: 60, pitch: 60, bearing: -20, duration: 1000 }
      );
    });

    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [points]);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden rounded-3xl border border-border ${className}`}
      style={{ height: "500px" }}
    />
  );
}
