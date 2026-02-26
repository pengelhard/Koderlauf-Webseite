"use client";

import { useRef, useEffect, useCallback } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { GpxPoint } from "@/lib/gpx";
import { toGeoJson } from "@/lib/gpx";

interface RouteMapProps {
  points: GpxPoint[];
  highlightPoint?: { lat: number; lon: number; ele: number; distance: number } | null;
  className?: string;
}

export function RouteMap({ points, highlightPoint, className = "" }: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);

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
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "\u00a9 OpenStreetMap contributors",
            maxzoom: 19,
          },
        },
        layers: [
          { id: "satellite-layer", type: "raster", source: "satellite", paint: { "raster-opacity": 1 } },
          { id: "labels-layer", type: "raster", source: "labels", paint: { "raster-opacity": 0.3 } },
        ],
        terrain: { source: "terrain", exaggeration: 1.5 },
        sky: {},
      },
      center: [centerLon, centerLat],
      zoom: 12.5,
      pitch: 60,
      bearing: -20,
      maxPitch: 85,
      attributionControl: false,
    });

    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: "© OSM | Esri" }), "bottom-right");

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.TerrainControl({ source: "terrain", exaggeration: 1.5 }), "top-right");

    map.on("load", () => {
      const geojson = toGeoJson(points);

      map.addSource("route", { type: "geojson", data: geojson as GeoJSON.Feature });

      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#FF6B00", "line-width": 8, "line-opacity": 0.3, "line-blur": 4 },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": "#FF6B00", "line-width": 4, "line-opacity": 0.9 },
      });

      const startPt = points[0];
      const endPt = points[points.length - 1];

      new maplibregl.Marker({ color: "#22C55E" })
        .setLngLat([startPt.lon, startPt.lat])
        .setPopup(new maplibregl.Popup({ offset: 25, className: "koder-popup" }).setHTML("<strong>Start</strong>"))
        .addTo(map);

      new maplibregl.Marker({ color: "#EF4444" })
        .setLngLat([endPt.lon, endPt.lat])
        .setPopup(new maplibregl.Popup({ offset: 25, className: "koder-popup" }).setHTML("<strong>Ziel</strong>"))
        .addTo(map);

      map.fitBounds(
        [[bounds.minLon - 0.005, bounds.minLat - 0.005], [bounds.maxLon + 0.005, bounds.maxLat + 0.005]],
        { padding: 60, pitch: 60, bearing: -20, duration: 1000 }
      );
    });

    mapRef.current = map;

    return () => {
      markerRef.current?.remove();
      popupRef.current?.remove();
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      popupRef.current = null;
    };
  }, [points]);

  function popupHTML(pt: { ele: number; distance: number }) {
    return `<div style="display:flex;align-items:baseline;gap:6px"><span style="font-size:14px;font-weight:800;color:#FF6B00">${Math.round(pt.ele)} m</span><span style="font-size:11px;color:rgba(255,255,255,0.7)">${pt.distance.toFixed(1)} km</span></div>`;
  }

  const updateHighlight = useCallback((pt: { lat: number; lon: number; ele: number; distance: number } | null | undefined) => {
    const map = mapRef.current;
    if (!map) return;

    if (!pt) {
      markerRef.current?.remove();
      markerRef.current = null;
      popupRef.current?.remove();
      popupRef.current = null;
      return;
    }

    if (!markerRef.current) {
      const el = document.createElement("div");
      el.style.width = "18px";
      el.style.height = "18px";
      el.style.borderRadius = "50%";
      el.style.background = "#FF6B00";
      el.style.border = "3px solid #fff";
      el.style.boxShadow = "0 0 12px rgba(255,107,0,0.6)";

      markerRef.current = new maplibregl.Marker({ element: el }).setLngLat([pt.lon, pt.lat]).addTo(map);
      popupRef.current = new maplibregl.Popup({ offset: 18, closeButton: false, closeOnClick: false, className: "koder-popup" })
        .setLngLat([pt.lon, pt.lat])
        .setHTML(popupHTML(pt))
        .addTo(map);
    } else {
      markerRef.current.setLngLat([pt.lon, pt.lat]);
      popupRef.current?.setLngLat([pt.lon, pt.lat]).setHTML(popupHTML(pt));
    }
  }, []);

  useEffect(() => {
    updateHighlight(highlightPoint);
  }, [highlightPoint, updateHighlight]);

  return (
    <div
      ref={containerRef}
      className={`w-full overflow-hidden rounded-3xl border border-border ${className}`}
      style={{ height: "500px" }}
    />
  );
}
