"use client";

import { useRef, useEffect, useCallback, useState, useMemo, useSyncExternalStore } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { Pause, Play, Plane, RotateCcw, X, Download, Maximize2 } from "lucide-react";
import type { GpxPoint } from "@/lib/gpx";
import {
  alongTrack,
  bearingDegrees,
  buildTrackIndex,
  lerpBearing,
  toGeoJson,
  type TrackIndex,
} from "@/lib/gpx";
import type { VerpflegungsStation } from "@/lib/verpflegung";
import { formatVerpflegungKm, getMapMarkersForStations } from "@/lib/verpflegung";

type FlightUi = "idle" | "running" | "paused" | "done";

interface RouteMapProps {
  points: GpxPoint[];
  highlightPoint?: { lat: number; lon: number; ele: number; distance: number } | null;
  routeColor?: string;
  className?: string;
  /** Verpflegungsstationen entlang der Strecke */
  stations?: VerpflegungsStation[];
  /** Kamerflug entlang der GPX (Spielerei / Trail). */
  flightEnabled?: boolean;
  gpxDownloadHref?: string;
  gpxDownloadName?: string;
}

const FLIGHT_PITCH = 60;
const STATION_HOLD_MS = 2200;
const INTRO_MS = 1200;
const LOOKAHEAD_KM_DESKTOP = 0.08;
const LOOKAHEAD_KM_MOBILE = 0.14;
const ZOOM_DESKTOP = 15.35;
const ZOOM_MOBILE = 13.65;

function isMobileViewport(): boolean {
  return typeof window !== "undefined" && window.matchMedia("(max-width: 640px)").matches;
}

function subscribeReducedMotion(onStoreChange: () => void) {
  const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  mq.addEventListener("change", onStoreChange);
  return () => mq.removeEventListener("change", onStoreChange);
}

function getReducedMotionSnapshot() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function createAidMarkerElement(label: string): HTMLDivElement {
  const el = document.createElement("div");
  const wide = label.length > 1;
  el.style.cssText = [
    "display:flex",
    "align-items:center",
    "justify-content:center",
    wide ? "min-width:34px;padding:0 6px" : "width:28px",
    "height:28px",
    "border-radius:9999px",
    "background:#0D9488",
    "color:#fff",
    "font:700 11px/1 system-ui,sans-serif",
    "border:2px solid #fff",
    "box-shadow:0 2px 8px rgba(0,0,0,0.35)",
    "cursor:pointer",
    "white-space:nowrap",
  ].join(";");
  el.textContent = label;
  el.setAttribute("aria-label", `Verpflegung ${label}`);
  return el;
}

const overlayBtn =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-widest shadow-sm touch-manipulation";
const overlayPrimary = `${overlayBtn} bg-koder-orange text-white hover:bg-koder-orange/90`;
const overlayGhost = `${overlayBtn} border border-white/35 bg-black/55 text-white hover:bg-black/70`;

export function RouteMap({
  points,
  highlightPoint,
  routeColor = "#FF6B00",
  className = "",
  stations = [],
  flightEnabled = false,
  gpxDownloadHref,
  gpxDownloadName,
}: RouteMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const markerRef = useRef<maplibregl.Marker | null>(null);
  const popupRef = useRef<maplibregl.Popup | null>(null);
  const stationMarkersRef = useRef<maplibregl.Marker[]>([]);
  const boundsRef = useRef<{
    minLon: number;
    maxLon: number;
    minLat: number;
    maxLat: number;
  } | null>(null);

  const trackIndex = useMemo(() => buildTrackIndex(points), [points]);
  const trackIndexRef = useRef<TrackIndex>(trackIndex);
  trackIndexRef.current = trackIndex;
  const stationsRef = useRef(stations);
  stationsRef.current = stations;

  const [mapReady, setMapReady] = useState(false);
  const [mapError, setMapError] = useState(false);
  const [flightUi, setFlightUi] = useState<FlightUi>("idle");
  const [stationChip, setStationChip] = useState<string | null>(null);
  const reducedMotion = useSyncExternalStore(
    subscribeReducedMotion,
    getReducedMotionSnapshot,
    () => false,
  );

  const rafRef = useRef<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const introTimerRef = useRef<number | null>(null);
  const distanceKmRef = useRef(0);
  const lastTsRef = useRef(0);
  const bearingRef = useRef(0);
  const nextStationIdxRef = useRef(0);
  const speedKmPerMsRef = useRef(0.0003);
  const pausedRef = useRef(false);
  const tickRef = useRef<(ts: number) => void>(() => {});

  const setMapInteraction = useCallback((enabled: boolean) => {
    const map = mapRef.current;
    if (!map) return;
    const toggle = enabled ? "enable" : "disable";
    map.dragPan[toggle]();
    map.scrollZoom[toggle]();
    map.boxZoom[toggle]();
    map.dragRotate[toggle]();
    map.keyboard[toggle]();
    map.doubleClickZoom[toggle]();
    map.touchZoomRotate[toggle]();
    map.touchPitch[toggle]();
  }, []);

  const closeStationPopups = useCallback(() => {
    for (const m of stationMarkersRef.current) {
      const popup = m.getPopup();
      if (popup?.isOpen()) m.togglePopup();
    }
  }, []);

  const openStationPopup = useCallback((station: VerpflegungsStation) => {
    closeStationPopups();
    for (const m of stationMarkersRef.current) {
      const ll = m.getLngLat();
      if (Math.abs(ll.lat - station.lat) < 1e-4 && Math.abs(ll.lng - station.lon) < 1e-4) {
        const popup = m.getPopup();
        if (popup && !popup.isOpen()) m.togglePopup();
        return;
      }
    }
  }, [closeStationPopups]);

  const applyCamera = useCallback((km: number, snapBearing: boolean, dtMs = 16) => {
    const map = mapRef.current;
    const index = trackIndexRef.current;
    if (!map || index.points.length === 0) return;

    const mobile = isMobileViewport();
    const lookahead = mobile ? LOOKAHEAD_KM_MOBILE : LOOKAHEAD_KM_DESKTOP;
    const pos = alongTrack(index, km);
    const look = alongTrack(index, Math.min(index.totalKm, km + lookahead));
    const same =
      Math.abs(pos.lat - look.lat) < 1e-8 && Math.abs(pos.lon - look.lon) < 1e-8;
    const target = same ? bearingRef.current : bearingDegrees(pos, look);
    const alpha = 1 - Math.exp(-(dtMs || 16) / 220);
    bearingRef.current = snapBearing ? target : lerpBearing(bearingRef.current, target, alpha);

    try {
      map.jumpTo({
        center: [pos.lon, pos.lat],
        bearing: bearingRef.current,
        pitch: FLIGHT_PITCH,
        zoom: mobile ? ZOOM_MOBILE : ZOOM_DESKTOP,
      });
    } catch {
      // WebGL/terrain hiccup – next frame retries
    }
  }, []);

  const clearFlightTimers = useCallback(() => {
    if (rafRef.current != null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (holdTimerRef.current != null) {
      window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (introTimerRef.current != null) {
      window.clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }
  }, []);

  const stopFlight = useCallback(
    (next: FlightUi) => {
      pausedRef.current = next === "paused" || next === "idle" || next === "done";
      clearFlightTimers();
      mapRef.current?.stop();
      setMapInteraction(true);
      closeStationPopups();
      if (next !== "paused") setStationChip(null);
      setFlightUi(next);
    },
    [clearFlightTimers, closeStationPopups, setMapInteraction],
  );

  useEffect(() => {
    tickRef.current = (ts: number) => {
      try {
      const map = mapRef.current;
      const index = trackIndexRef.current;
      if (!map || pausedRef.current || index.points.length === 0) return;

      if (lastTsRef.current === 0) lastTsRef.current = ts;
      const dt = Math.min(100, ts - lastTsRef.current);
      lastTsRef.current = ts;

      distanceKmRef.current += speedKmPerMsRef.current * dt;

      const list = stationsRef.current;
      const sIdx = nextStationIdxRef.current;
      if (sIdx < list.length && distanceKmRef.current >= list[sIdx].km) {
        const station = list[sIdx];
        nextStationIdxRef.current = sIdx + 1;
        distanceKmRef.current = station.km;
        applyCamera(station.km, true, dt);
        setStationChip(`${station.name} · ${station.hint} · ${formatVerpflegungKm(station.km)}`);
        openStationPopup(station);
        holdTimerRef.current = window.setTimeout(() => {
          holdTimerRef.current = null;
          setStationChip(null);
          closeStationPopups();
          lastTsRef.current = 0;
          if (!pausedRef.current) {
            rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
          }
        }, STATION_HOLD_MS);
        return;
      }

      if (distanceKmRef.current >= index.totalKm) {
        distanceKmRef.current = index.totalKm;
        applyCamera(index.totalKm, true, dt);
        stopFlight("done");
        return;
      }

      applyCamera(distanceKmRef.current, false, dt);
      rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
      } catch {
        if (!pausedRef.current) {
          rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
        }
      }
    };
  }, [applyCamera, closeStationPopups, openStationPopup, stopFlight]);

  const startLoop = useCallback(() => {
    lastTsRef.current = 0;
    pausedRef.current = false;
    rafRef.current = requestAnimationFrame((t) => tickRef.current(t));
  }, []);

  const startFlight = useCallback(() => {
    const map = mapRef.current;
    const index = trackIndexRef.current;
    if (!map || index.points.length === 0) return;

    clearFlightTimers();
    closeStationPopups();
    distanceKmRef.current = 0;
    nextStationIdxRef.current = 0;
    lastTsRef.current = 0;
    pausedRef.current = false;
    setStationChip(null);
    setFlightUi("running");

    const durationMs = Math.min(55_000, Math.max(24_000, index.totalKm * 1800));
    speedKmPerMsRef.current = index.totalKm / durationMs;

    const start = alongTrack(index, 0);
    const look = alongTrack(index, Math.min(index.totalKm, LOOKAHEAD_KM_DESKTOP * 2));
    bearingRef.current = bearingDegrees(start, look);

    setMapInteraction(false);
    map.stop();
    map.easeTo({
      center: [start.lon, start.lat],
      zoom: isMobileViewport() ? ZOOM_MOBILE : ZOOM_DESKTOP,
      pitch: FLIGHT_PITCH,
      bearing: bearingRef.current,
      duration: INTRO_MS,
      essential: true,
    });

    introTimerRef.current = window.setTimeout(() => {
      introTimerRef.current = null;
      startLoop();
    }, INTRO_MS + 40);
  }, [clearFlightTimers, closeStationPopups, setMapInteraction, startLoop]);

  const pauseFlight = useCallback(() => {
    pausedRef.current = true;
    clearFlightTimers();
    mapRef.current?.stop();
    setMapInteraction(true);
    setFlightUi("paused");
  }, [clearFlightTimers, setMapInteraction]);

  const resumeFlight = useCallback(() => {
    if (flightUi !== "paused") return;
    pausedRef.current = false;
    setMapInteraction(false);
    setFlightUi("running");
    closeStationPopups();
    setStationChip(null);
    startLoop();
  }, [closeStationPopups, flightUi, setMapInteraction, startLoop]);

  const cancelFlight = useCallback(() => {
    stopFlight("idle");
  }, [stopFlight]);

  const zoomToRoute = useCallback(() => {
    const map = mapRef.current;
    const b = boundsRef.current;
    if (!map || !b) return;
    map.stop();
    map.fitBounds(
      [
        [b.minLon - 0.005, b.minLat - 0.005],
        [b.maxLon + 0.005, b.maxLat + 0.005],
      ],
      { padding: 60, pitch: FLIGHT_PITCH, bearing: -20, duration: 0 },
    );
  }, []);

  useEffect(() => {
    const onVisibility = () => {
      if (
        document.hidden &&
        !pausedRef.current &&
        (rafRef.current != null || holdTimerRef.current != null || introTimerRef.current != null)
      ) {
        pauseFlight();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [pauseFlight]);

  useEffect(() => {
    if (!reducedMotion) return;
    if (flightUi === "running" || flightUi === "paused") {
      stopFlight("idle");
    }
  }, [reducedMotion, flightUi, stopFlight]);

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

    for (const s of stations) {
      if (s.lon < bounds.minLon) bounds.minLon = s.lon;
      if (s.lon > bounds.maxLon) bounds.maxLon = s.lon;
      if (s.lat < bounds.minLat) bounds.minLat = s.lat;
      if (s.lat > bounds.maxLat) bounds.maxLat = s.lat;
    }

    boundsRef.current = bounds;
    const centerLon = (bounds.minLon + bounds.maxLon) / 2;
    const centerLat = (bounds.minLat + bounds.maxLat) / 2;
    let cancelled = false;

    let map: maplibregl.Map;
    try {
      map = new maplibregl.Map({
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
    } catch {
      setMapError(true);
      return;
    }

    map.addControl(new maplibregl.AttributionControl({ compact: true, customAttribution: "© OSM | Esri" }), "bottom-right");

    map.addControl(new maplibregl.NavigationControl(), "top-right");
    map.addControl(new maplibregl.TerrainControl({ source: "terrain", exaggeration: 1.5 }), "top-right");

    map.on("load", () => {
      if (cancelled) return;
      const geojson = toGeoJson(points);

      map.addSource("route", { type: "geojson", data: geojson as GeoJSON.Feature });

      map.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": routeColor, "line-width": 8, "line-opacity": 0.3, "line-blur": 4 },
      });

      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: { "line-color": routeColor, "line-width": 4, "line-opacity": 0.9 },
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

      stationMarkersRef.current = getMapMarkersForStations(stations).map((station) => {
        const html = `<strong>${station.name}</strong><br/><span style="opacity:.85">${station.hint}</span><br/><span style="opacity:.85">bei ${station.kmLabel}</span>`;
        return new maplibregl.Marker({ element: createAidMarkerElement(station.label) })
          .setLngLat([station.lon, station.lat])
          .setPopup(new maplibregl.Popup({ offset: 22, className: "koder-popup" }).setHTML(html))
          .addTo(map);
      });

      map.fitBounds(
        [[bounds.minLon - 0.005, bounds.minLat - 0.005], [bounds.maxLon + 0.005, bounds.maxLat + 0.005]],
        {
          padding: 60,
          pitch: 60,
          bearing: -20,
          duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1000,
        }
      );
      if (!cancelled) setMapReady(true);
    });

    mapRef.current = map;

    return () => {
      cancelled = true;
      pausedRef.current = true;
      if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      if (holdTimerRef.current != null) window.clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
      if (introTimerRef.current != null) window.clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
      markerRef.current?.remove();
      popupRef.current?.remove();
      stationMarkersRef.current.forEach((m) => m.remove());
      stationMarkersRef.current = [];
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
      popupRef.current = null;
      setMapReady(false);
    };
  }, [points, stations]);

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
      el.style.background = routeColor;
      el.style.border = "3px solid #fff";
      el.style.boxShadow = `0 0 12px ${routeColor}99`;

      markerRef.current = new maplibregl.Marker({ element: el }).setLngLat([pt.lon, pt.lat]).addTo(map);
      popupRef.current = new maplibregl.Popup({ offset: 18, closeButton: false, closeOnClick: false, className: "koder-popup" })
        .setLngLat([pt.lon, pt.lat])
        .setHTML(`<div style="display:flex;align-items:baseline;gap:6px"><span style="font-size:14px;font-weight:800;color:${routeColor}">${Math.round(pt.ele)} m</span><span style="font-size:11px;color:rgba(255,255,255,0.7)">${pt.distance.toFixed(1)} km</span></div>`)
        .addTo(map);
    } else {
      markerRef.current.setLngLat([pt.lon, pt.lat]);
      popupRef.current?.setLngLat([pt.lon, pt.lat]).setHTML(`<div style="display:flex;align-items:baseline;gap:6px"><span style="font-size:14px;font-weight:800;color:${routeColor}">${Math.round(pt.ele)} m</span><span style="font-size:11px;color:rgba(255,255,255,0.7)">${pt.distance.toFixed(1)} km</span></div>`);
    }
  }, [routeColor]);

  useEffect(() => {
    updateHighlight(highlightPoint);
  }, [highlightPoint, updateHighlight]);

  const showFlightUi = flightEnabled && mapReady;
  const gpxName = gpxDownloadName ?? (gpxDownloadHref?.split("/").pop() || "strecke.gpx");

  return (
    <div className="relative h-full w-full overflow-hidden">
      <div
        ref={containerRef}
        className={`h-full w-full overflow-hidden rounded-3xl border border-border ${className}`}
      />
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted px-4 text-center text-sm text-muted-foreground">
          3D-Karte braucht WebGL – bitte einen aktuellen Browser verwenden.
        </div>
      )}

      {showFlightUi && (
        <div className="pointer-events-none absolute inset-0 z-10" data-flight-state={flightUi}>
          {(stationChip || flightUi === "done") && (
            <div className="absolute top-3 left-0 right-3 pr-12 sm:right-14">
              <div className="flex justify-center">
                <div
                  role="status"
                  aria-live="polite"
                  data-flight-chip=""
                  className="max-w-[min(100%,22rem)] rounded-full border border-white/25 bg-black/65 px-3 py-1.5 text-center text-xs font-semibold text-white shadow-sm"
                >
                  {flightUi === "done"
                    ? "Ziel erreicht – Flug beendet."
                    : stationChip}
                </div>
              </div>
            </div>
          )}

          <div className="pointer-events-auto absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2">
            {reducedMotion && flightUi === "idle" && (
              <button type="button" onClick={zoomToRoute} className={overlayPrimary}>
                <Maximize2 size={14} aria-hidden />
                Zur Strecke zoomen
              </button>
            )}

            {!reducedMotion && flightUi === "idle" && (
              <button type="button" onClick={startFlight} className={overlayPrimary}>
                <Plane size={14} aria-hidden />
                Flug starten
              </button>
            )}

            {flightUi === "running" && (
              <>
                <button type="button" onClick={pauseFlight} className={overlayPrimary}>
                  <Pause size={14} aria-hidden />
                  Pause
                </button>
                <button type="button" onClick={cancelFlight} className={overlayGhost}>
                  <X size={14} aria-hidden />
                  Abbrechen
                </button>
              </>
            )}

            {flightUi === "paused" && (
              <>
                <button type="button" onClick={resumeFlight} className={overlayPrimary}>
                  <Play size={14} aria-hidden />
                  Weiter
                </button>
                <button type="button" onClick={cancelFlight} className={overlayGhost}>
                  <X size={14} aria-hidden />
                  Abbrechen
                </button>
              </>
            )}

            {flightUi === "done" && (
              <>
                {!reducedMotion && (
                  <button type="button" onClick={startFlight} className={overlayPrimary}>
                    <RotateCcw size={14} aria-hidden />
                    Nochmal
                  </button>
                )}
                {gpxDownloadHref && (
                  <a href={gpxDownloadHref} download={gpxName} className={overlayGhost}>
                    <Download size={14} aria-hidden />
                    GPX laden
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
