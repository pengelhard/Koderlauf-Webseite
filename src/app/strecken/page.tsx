"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
// Badge removed — difficulty labels removed per user request
import {
  Mountain,
  ArrowDownToLine,
  TrendingUp,
  TrendingDown,
  MapPin,
  TreePine,
  Zap,
  Baby,
  Route,
} from "lucide-react";
import { parseGpx, type GpxTrack } from "@/lib/gpx";
import { RouteMap } from "@/components/map/route-map";
import { ElevationProfile } from "@/components/map/elevation-profile";

interface Strecke {
  id: string;
  name: string;
  difficulty: "leicht" | "mittel" | "schwer" | "extrem";
  description: string;
  icon: typeof Route;
  color: string;
  gpxFile: string;
  startgebuehr: string;
}

const STRECKEN: Strecke[] = [
  {
    id: "kinderlauf",
    name: "Kinderlauf",
    startgebuehr: "10 €",
    difficulty: "leicht",
    description:
      "Vom Start am Sportheim geht\u2019s über den Sportplatz auf asphaltierten Weg bis zum Wendepunkt, Ziel ist wieder am Sportplatz.",
    icon: Baby,
    color: "#FF6B00",
    gpxFile: "/kinderlauf.gpx",
  },
  {
    id: "kurz-knackig",
    name: "Kurz und knackig",
    startgebuehr: "15 €",
    difficulty: "mittel",
    description:
      "Die Strecke führt über den Sportplatz auf einen asphaltierten Weg. Nach kurzer Steigung geht es auf der \u201eEbene\u201c weiter, ehe eine Schleife über einen Feld- und Wiesenweg schon auf die leicht abfallende Zielgerade führt. Zieleinlauf am Sportplatz.",
    icon: Zap,
    color: "#22C55E",
    gpxFile: "/kurz-knackig.gpx",
  },
  {
    id: "koderrunde",
    name: "Koderrunde",
    startgebuehr: "15 €",
    difficulty: "mittel",
    description:
      "Diese Runde ist prädestiniert für alle, die gerne in traumhafter Umgebung walken oder laufen. Die abwechslungsreiche Strecke führt über den Sportplatz, dann am Rande der Ortschaft entlang und hinein in unseren Wachtlerwald. Nach munterem Auf und Ab führt der Weg über die Ebene entlang zurück zum Sportheim und damit direkt ins Ziel.",
    icon: TreePine,
    color: "#EAB308",
    gpxFile: "/koderrunde.gpx",
  },
  {
    id: "trailrun",
    name: "Trailrun",
    startgebuehr: "15 €",
    difficulty: "schwer",
    description:
      "Dieser besondere Teil des Koderlaufs macht ihn einzigartig \u2013 die Wegführung geht in Teilen ähnlich wie die Koderrunde, allerdings mit größeren Offroad-Anteilen. Die Wachtlerspitze auf 587\u00a0m inmitten unseres wunderschönen Wachtlerwaldes bildet wortwörtlich den Höhepunkt des Trailruns. Es geht steil bergauf und bergab quer durch den Wald, weshalb hier ganz besonders auf passende Laufausstattung geachtet werden sollte.",
    icon: Mountain,
    color: "#3B82F6",
    gpxFile: "/trailrun.gpx",
  },
];

// Difficulty labels removed per user request

type HoverPoint = { lat: number; lon: number; ele: number; distance: number } | null;

function StreckenContent() {
  const searchParams = useSearchParams();
  const initialRoute = searchParams.get("route") || "trailrun";
  const [selected, setSelected] = useState<string>(initialRoute);
  const [gpxTracks, setGpxTracks] = useState<Record<string, GpxTrack>>({});
  const [loading, setLoading] = useState(false);
  const [hoverPoint, setHoverPoint] = useState<HoverPoint>(null);

  const activeStrecke = STRECKEN.find((s) => s.id === selected)!;
  const gpxTrack = gpxTracks[selected] || null;

  useEffect(() => {
    if (gpxTracks[selected]) return;

    let cancelled = false;
    requestAnimationFrame(() => { if (!cancelled) setLoading(true); });

    fetch(activeStrecke.gpxFile)
      .then((r) => r.text())
      .then((xml) => {
        if (cancelled) return;
        const track = parseGpx(xml);
        setGpxTracks((prev) => ({ ...prev, [selected]: track }));
        setLoading(false);
      })
      .catch(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
  }, [selected, activeStrecke.gpxFile, gpxTracks]);

  const handleProfileHover = useCallback((point: HoverPoint) => {
    setHoverPoint(point);
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf 2026
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Strecken
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Vier Distanzen durch die Wälder rund um Obermögersheim – von
            kinderleicht bis Trailrun-Abenteuer. Start am Sportheim.
          </p>
        </motion.div>

        {/* Route selector cards */}
        <div className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {STRECKEN.map((strecke) => {
            const track = gpxTracks[strecke.id];
            return (
              <motion.button
                key={strecke.id}
                id={strecke.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelected(strecke.id); setHoverPoint(null); }}
                className={`group rounded-2xl border-2 p-3 text-left transition-all sm:p-4 ${
                  selected === strecke.id
                    ? "shadow-lg"
                    : "border-border hover:border-koder-orange/30"
                }`}
                style={{
                  borderColor: selected === strecke.id ? strecke.color : undefined,
                  background: `linear-gradient(to bottom right, ${strecke.color}33, ${strecke.color}0D)`,
                }}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg sm:h-9 sm:w-9"
                    style={{ backgroundColor: `${strecke.color}15`, color: strecke.color }}
                  >
                    <strecke.icon size={16} />
                  </div>
                  <h3 className="truncate text-sm font-bold">{strecke.name}</h3>
                </div>
                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-extrabold sm:text-xl" style={{ color: strecke.color }}>
                    {track ? `${track.distance.toFixed(1)} km` : "..."}
                  </span>
                  {track && (
                    <span className="text-[10px] text-muted-foreground sm:text-xs">
                      ↑ {track.elevationGain} Hm
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground sm:text-xs">
                    Startgebühr {strecke.startgebuehr}
                  </span>
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Description between cards and map */}
        <motion.div
          key={`desc-${selected}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="mt-6 rounded-2xl border border-border bg-card px-4 py-3 sm:px-6 sm:py-4"
        >
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">{activeStrecke.description}</p>
        </motion.div>

        {/* Map + Profile + Stats */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4"
        >
          <Card className="overflow-hidden rounded-3xl border-border">
            <CardContent className="p-0">
              <div className="relative [&_.maplibregl-ctrl-attrib]:!hidden">
                {loading ? (
                  <div className="flex h-[500px] items-center justify-center bg-muted">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
                  </div>
                ) : gpxTrack ? (
                  <RouteMap
                    points={gpxTrack.points}
                    highlightPoint={hoverPoint}
                    routeColor={activeStrecke.color}
                    className="rounded-none border-0"
                  />
                ) : (
                  <div className="flex h-[500px] flex-col items-center justify-center bg-gradient-to-br from-forest-deep/20 to-forest-deep/5">
                    <MapPin size={48} className="text-koder-orange/40" />
                    <p className="mt-4 text-lg font-semibold text-muted-foreground">Laden...</p>
                  </div>
                )}
              </div>

              {/* Elevation profile directly under map */}
              {gpxTrack && (
                <div className="border-t border-border px-4 py-3 sm:px-6">
                  <ElevationProfile points={gpxTrack.points} onHover={handleProfileHover} />
                </div>
              )}

              {/* Stats below */}
              <div className="p-4 sm:p-6">

                {gpxTrack && (
                  <div className="mt-4 grid grid-cols-3 gap-2 sm:grid-cols-5 sm:gap-3">
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <Route size={16} className="mx-auto text-koder-orange" />
                      <p className="mt-1 text-lg font-extrabold sm:text-xl">{gpxTrack.distance.toFixed(1)}</p>
                      <p className="text-[10px] text-muted-foreground">km</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <TrendingUp size={16} className="mx-auto text-success" />
                      <p className="mt-1 text-lg font-extrabold sm:text-xl">{gpxTrack.elevationGain}</p>
                      <p className="text-[10px] text-muted-foreground">Hm ↑</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <TrendingDown size={16} className="mx-auto text-error" />
                      <p className="mt-1 text-lg font-extrabold sm:text-xl">{gpxTrack.elevationLoss}</p>
                      <p className="text-[10px] text-muted-foreground">Hm ↓</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <Mountain size={16} className="mx-auto text-forest-light" />
                      <p className="mt-1 text-lg font-extrabold sm:text-xl">{gpxTrack.maxEle}</p>
                      <p className="text-[10px] text-muted-foreground">Max (m)</p>
                    </div>
                    <div className="rounded-xl bg-muted p-3 text-center">
                      <ArrowDownToLine size={16} className="mx-auto text-sky-600 dark:text-sky-400" />
                      <p className="mt-1 text-lg font-extrabold sm:text-xl">{gpxTrack.minEle}</p>
                      <p className="text-[10px] text-muted-foreground">Min (m)</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function StreckenPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center pt-24"><div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" /></div>}>
      <StreckenContent />
    </Suspense>
  );
}
