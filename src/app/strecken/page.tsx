"use client";

import Link from "next/link";
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
  Clock,
} from "lucide-react";
import { parseGpx, type GpxTrack } from "@/lib/gpx";
import { getAktuellerPreis } from "@/lib/event-config";
import { RouteMap } from "@/components/map/route-map";
import { ElevationProfile } from "@/components/map/elevation-profile";
import { cn } from "@/lib/utils";
import { YearSwitcher } from "@/components/ui/year-switcher";

interface Strecke {
  id: string;
  name: string;
  difficulty: "leicht" | "mittel" | "schwer" | "extrem";
  description: string;
  icon: typeof Route;
  color: string;
  gpxFile: string;
  startgebuehr: string;
  startTime?: string;
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

const STRECKEN_2027: (Strecke & { startTime: string })[] = [
  {
    id: "kinderlauf",
    name: "Kinderlauf",
    startgebuehr: "10 €",
    startTime: "14:30",
    difficulty: "leicht",
    description:
      "Der Kinderlauf führt einmal um den unteren Fußballplatz und dann direkt zurück ins Ziel – perfekt für die Kleinsten und ein echtes Highlight für die ganze Familie!",
    icon: Baby,
    color: "#FF6B00",
    gpxFile: "/2027-kinderlauf.gpx",
  },
  {
    id: "kurz-knackig",
    name: "Kurz und knackig",
    startgebuehr: "15 €",
    startTime: "15:30",
    difficulty: "mittel",
    description:
      "Die Strecke führt über den Sportplatz auf einen asphaltierten Weg. Nach kurzer Steigung geht es auf der „Ebene“ weiter, ehe eine Schleife über einen Feld- und Wiesenweg schon auf die leicht abfallende Zielgerade führt. Zieleinlauf am Sportplatz.",
    icon: Zap,
    color: "#22C55E",
    gpxFile: "/2027-kurz-knackig.gpx",
  },
  {
    id: "koderrunde",
    name: "Koderrunde",
    startgebuehr: "15 €",
    startTime: "15:20",
    difficulty: "mittel",
    description:
      "Diese Runde ist prädestiniert für alle, die gerne in traumhafter Umgebung walken oder laufen. Die abwechslungsreiche Strecke führt über den Sportplatz, dann am Rande der Ortschaft entlang und hinein in unseren Wachtlerwald. Nach munterem Auf und Ab führt der Weg über die Ebene entlang zurück zum Sportheim und damit direkt ins Ziel.",
    icon: TreePine,
    color: "#EAB308",
    gpxFile: "/2027-koderrunde.gpx",
  },
  {
    id: "trailrun",
    name: "Trailrun",
    startgebuehr: "18 €",
    startTime: "15:10",
    difficulty: "schwer",
    description:
      "Dieser besondere Teil des Koderlaufs macht ihn einzigartig – die Wegführung geht in Teilen ähnlich wie die Koderrunde, allerdings mit größeren Offroad-Anteilen. Die Wachtlerspitze auf 587 m inmitten unseres wunderschönen Wachtlerwaldes bildet wortwörtlich den Höhepunkt des Trailruns. Es geht steil bergauf und bergab quer durch den Wald. Achtung! Der Streckenverlauf wurde etwas angepasst.",
    icon: Mountain,
    color: "#3B82F6",
    gpxFile: "/2027-trailrun.gpx",
  },
  {
    id: "spielerei",
    name: "Spielerei",
    startgebuehr: "22 €",
    startTime: "15:00",
    difficulty: "extrem",
    description:
      "Die Spielerei wartet auf die, die es wirklich wissen wollen. Unsere längste und forderndste Strecke führt hoch zur Wachtelerspitze, weiter über den Spielberg zum Gelben Berg und zurück zum Ziel – mit ordentlich Höhenmetern und echten Trail-Passagen. Das ist keine harmlose Spielerei, sondern deine Chance, dich richtig zu fordern und neue Grenzen zu erleben. Wer es ernst meint, ist hier genau richtig.",
    icon: Route,
    color: "#7C3AED",
    gpxFile: "/2027-spielerei.gpx",
  },
];

type HoverPoint = { lat: number; lon: number; ele: number; distance: number } | null;

function StreckenContent() {
  const searchParams = useSearchParams();
  const paramRoute = searchParams.get("route");
  const [yearTab, setYearTab] = useState<"2026" | "2027">("2027");

  const currentRoutes = yearTab === "2026" ? STRECKEN : STRECKEN_2027;
  const allowedIds = new Set(currentRoutes.map((s) => s.id));
  const initialRoute = paramRoute && allowedIds.has(paramRoute) ? paramRoute : currentRoutes[0].id;

  const [selected, setSelected] = useState<string>(initialRoute);
  const [gpxTracks, setGpxTracks] = useState<Record<string, GpxTrack>>({});
  const [hoverPoint, setHoverPoint] = useState<HoverPoint>(null);

  // Always guarantee a valid selected route for the current year (prevents crashes during HMR / tab switch)
  const safeSelected = currentRoutes.some((r) => r.id === selected)
    ? selected
    : currentRoutes[0].id;

  const activeStrecke = currentRoutes.find((s) => s.id === safeSelected)!;
  const gpxTrack = gpxTracks[safeSelected] || null;

  // Reset selection when switching year (only if current selection is invalid for the new year)
  useEffect(() => {
    const newRoutes = yearTab === "2026" ? STRECKEN : STRECKEN_2027;
    if (!newRoutes.some((r) => r.id === selected)) {
      setSelected(newRoutes[0].id);
      setHoverPoint(null);
    }
  }, [yearTab, selected]);

  // Preload GPX for all routes so cards show km/Hm without clicking
  useEffect(() => {
    let cancelled = false;
    const routes = yearTab === "2026" ? STRECKEN : STRECKEN_2027;

    setGpxTracks({});

    for (const strecke of routes) {
      fetch(strecke.gpxFile)
        .then((r) => r.text())
        .then((xml) => {
          if (cancelled) return;
          setGpxTracks((prev) => ({ ...prev, [strecke.id]: parseGpx(xml) }));
        })
        .catch(() => {});
    }

    return () => { cancelled = true; };
  }, [yearTab]);

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
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf {yearTab}
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Strecken
          </h1>
          <YearSwitcher value={yearTab} onChange={setYearTab} />
        </motion.div>

        {yearTab === "2026" ? (
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-muted-foreground sm:text-base">
            Vier Distanzen durch die Wälder rund um Obermögersheim – von kinderleicht bis
            Trailrun-Abenteuer. Start am Sportheim (Stand 2026).
          </p>
        ) : (
          <div className="mx-auto mt-8 max-w-2xl space-y-3 text-center text-sm text-muted-foreground sm:text-base">
            <p>
              Für den 2. Koderlauf im Rahmen unseres 50-jährigen SVO-Jubiläums haben wir wieder
              richtig tolle Strecken für euch vorbereitet!
            </p>
            <p>
              Neben den beliebten Routen vom letzten Jahr erwartet euch ein absolutes Trail-Highlight
              für alle Trailfreaks da draußen – ein echtes Abenteuer durch den Wald, das ihr nicht
              verpassen solltet.
            </p>
            <p>
              <strong className="font-semibold text-foreground">Wichtig für alle:</strong> Der Start-
              und Zielbereich wurde auf den oberen Fußballplatz verlegt. Außerdem haben wir manche
              Strecken leicht angepasst. Auf allen Routen gelten selbstverständlich die StVO und jeder
              ist für sich selbst verantwortlich. Wie jedes Jahr sorgen zahlreiche Streckenposten für
              eure Sicherheit, eine gute Verpflegung und einen reibungslosen Ablauf.
            </p>
          </div>
        )}

        {/* Route selector cards */}
        <div className="mobile-gpu-layer mt-6 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-5 sm:mt-8">
          {currentRoutes.map((strecke) => {
            const track = gpxTracks[strecke.id];
            return (
              <button
                key={strecke.id}
                id={strecke.id}
                onClick={() => { setSelected(strecke.id); setHoverPoint(null); }}
                /* Keine Scale-Transforms und keine Alpha-Gradients: beide triggern
                   auf Mali-GPUs (z. B. Huawei P30) Scroll-Ghosting in Chrome. */
                className={`group rounded-2xl border-2 p-3.5 text-left transition-colors sm:p-4 touch-manipulation ${
                  selected === strecke.id
                    ? "shadow-lg"
                    : "border-border hover:border-koder-orange/30"
                }`}
                style={{
                  borderColor: selected === strecke.id ? strecke.color : undefined,
                  backgroundColor: `${strecke.color}1F`,
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

                {/* Start time prominently per route (2027 only) */}
                {yearTab === "2027" && strecke.startTime && (
                  <div
                    className="mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                    style={{ backgroundColor: `${strecke.color}15`, color: strecke.color }}
                  >
                    <Clock size={13} />
                    Start {strecke.startTime}
                  </div>
                )}

                <div className="mt-2 flex flex-wrap items-baseline gap-2">
                  <span className="text-lg font-extrabold sm:text-xl" style={{ color: strecke.color }}>
                    {track ? `${track.distance.toFixed(1)} km` : "..."}
                  </span>
                  {track && (
                    <span className="text-[10px] text-muted-foreground sm:text-xs">
                      ↑ {track.elevationGain} Hm
                    </span>
                  )}
                  {/* 2026: event is over → hide price. 2027: show dynamic current price */}
                  {yearTab === "2027" && (
                    <span className="text-[10px] text-muted-foreground sm:text-xs">
                      Startgebühr {getAktuellerPreis(strecke.id)}
                    </span>
                  )}
                </div>
              </button>
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
          {yearTab === "2027" && activeStrecke.startTime && (
            <div
              className="mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold"
              style={{ backgroundColor: `${activeStrecke.color}15`, color: activeStrecke.color }}
            >
              <Clock size={15} />
              Start {activeStrecke.startTime} Uhr
            </div>
          )}
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
              <div className="relative h-[320px] overflow-hidden sm:h-[400px] lg:h-[500px] [&_.maplibregl-ctrl-attrib]:!hidden">
                {!gpxTrack ? (
                  <div className="flex h-[320px] sm:h-[400px] lg:h-[500px] items-center justify-center bg-muted">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
                  </div>
                ) : (
                  <RouteMap
                    points={gpxTrack.points}
                    highlightPoint={hoverPoint}
                    routeColor={activeStrecke.color}
                    className="rounded-none border-0"
                  />
                )}
              </div>

              {/* Elevation profile directly under map */}
              {gpxTrack && (
                <div className="border-t border-border px-3 py-2 sm:px-6 sm:py-3">
                  <ElevationProfile points={gpxTrack.points} onHover={handleProfileHover} color={activeStrecke.color} />
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

        {/* Anmelden button at the bottom, under the route */}
        <div className="mt-8 flex justify-center pb-12">
          <Link
            href="/anmeldung"
            className="rounded-2xl bg-koder-orange px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-sm transition-colors hover:bg-koder-orange/90"
          >
            Jetzt anmelden
          </Link>
        </div>
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
