"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Mountain,
  Timer,
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
}

const STRECKEN: Strecke[] = [
  {
    id: "kinderlauf",
    name: "Kinderlauf",
    difficulty: "leicht",
    description:
      "Vom Start am Sportheim geht\u2019s über den Sportplatz auf asphaltierten Weg bis zum Wendepunkt, Ziel ist wieder am Sportplatz.",
    icon: Baby,
    color: "#22C55E",
    gpxFile: "/kinderlauf.gpx",
  },
  {
    id: "kurz-knackig",
    name: "Kurz und knackig",
    difficulty: "mittel",
    description:
      "Die Strecke führt über den Sportplatz auf einen asphaltierten Weg. Nach kurzer Steigung geht es auf der \u201eEbene\u201c weiter, ehe eine Schleife über einen Feld- und Wiesenweg schon auf die leicht abfallende Zielgerade führt. Zieleinlauf am Sportplatz.",
    icon: Zap,
    color: "#FF9F1C",
    gpxFile: "/kurz-knackig.gpx",
  },
  {
    id: "koderrunde",
    name: "Koderrunde",
    difficulty: "mittel",
    description:
      "Diese Runde ist prädestiniert für alle, die gerne in traumhafter Umgebung walken oder laufen. Die abwechslungsreiche Strecke führt über den Sportplatz, dann am Rande der Ortschaft entlang und hinein in unseren Wachtlerwald. Nach munterem Auf und Ab führt der Weg über die Ebene entlang zurück zum Sportheim und damit direkt ins Ziel.",
    icon: TreePine,
    color: "#FF6B00",
    gpxFile: "/koderrunde.gpx",
  },
  {
    id: "trailrun",
    name: "Trailrun",
    difficulty: "schwer",
    description:
      "Dieser besondere Teil des Koderlaufs macht ihn einzigartig \u2013 die Wegführung geht in Teilen ähnlich wie die Koderrunde, allerdings mit größeren Offroad-Anteilen. Die Wachtlerspitze auf 587\u00a0m inmitten unseres wunderschönen Wachtlerwaldes bildet wortwörtlich den Höhepunkt des Trailruns. Es geht steil bergauf und bergab quer durch den Wald, weshalb hier ganz besonders auf passende Laufausstattung geachtet werden sollte.",
    icon: Mountain,
    color: "#EF4444",
    gpxFile: "/trailrun.gpx",
  },
];

const DIFFICULTY_COLORS = {
  leicht: "bg-green-500/10 text-green-500 border-green-500/20",
  mittel: "bg-koder-orange/10 text-koder-orange border-koder-orange/20",
  schwer: "bg-red-500/10 text-red-500 border-red-500/20",
  extrem: "bg-purple-500/10 text-purple-500 border-purple-500/20",
};

type HoverPoint = { lat: number; lon: number; ele: number; distance: number } | null;

export default function StreckenPage() {
  const [selected, setSelected] = useState<string>("trailrun");
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
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STRECKEN.map((strecke) => {
            const track = gpxTracks[strecke.id];
            return (
              <motion.button
                key={strecke.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => { setSelected(strecke.id); setHoverPoint(null); }}
                className={`group rounded-3xl border-2 p-5 text-left transition-all ${
                  selected === strecke.id
                    ? "border-koder-orange bg-koder-orange/10 shadow-lg shadow-koder-orange/10"
                    : "border-border hover:border-koder-orange/30"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${strecke.color}15`, color: strecke.color }}
                  >
                    <strecke.icon size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{strecke.name}</h3>
                    <p className="text-xs text-muted-foreground">
                      {track ? `${track.distance.toFixed(1)} km · ${track.elevationGain} Hm` : "Laden..."}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  className={`mt-3 text-xs uppercase tracking-wider ${DIFFICULTY_COLORS[strecke.difficulty]}`}
                >
                  {strecke.difficulty}
                </Badge>
              </motion.button>
            );
          })}
        </div>

        {/* Active route detail */}
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <Card className="overflow-hidden rounded-3xl border-border">
            <CardContent className="p-0">
              <div className="relative">
                {loading ? (
                  <div className="flex h-[500px] items-center justify-center bg-muted">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
                  </div>
                ) : gpxTrack ? (
                  <RouteMap
                    points={gpxTrack.points}
                    highlightPoint={hoverPoint}
                    className="rounded-none border-0"
                  />
                ) : (
                  <div className="flex h-[500px] flex-col items-center justify-center bg-gradient-to-br from-forest-deep/20 to-forest-deep/5">
                    <MapPin size={48} className="text-koder-orange/40" />
                    <p className="mt-4 text-lg font-semibold text-muted-foreground">Laden...</p>
                  </div>
                )}

                <div className="absolute top-4 left-4 z-10">
                  <div className="glass rounded-2xl px-5 py-3">
                    <h2 className="text-lg font-bold text-white">{activeStrecke.name}</h2>
                    <div className="mt-1 flex gap-4 text-sm text-white/70">
                      <span className="flex items-center gap-1">
                        <Route size={14} />
                        {gpxTrack ? `${gpxTrack.distance.toFixed(1)} km` : "..."}
                      </span>
                      <span className="flex items-center gap-1">
                        <TrendingUp size={14} />
                        {gpxTrack ? `${gpxTrack.elevationGain} Hm` : "..."}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <p className="text-muted-foreground">{activeStrecke.description}</p>

                {gpxTrack && (
                  <>
                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-5">
                      <div className="rounded-2xl bg-muted p-4 text-center">
                        <Route size={18} className="mx-auto text-koder-orange" />
                        <p className="mt-2 text-2xl font-extrabold">{gpxTrack.distance.toFixed(1)}</p>
                        <p className="text-xs text-muted-foreground">Kilometer</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-4 text-center">
                        <TrendingUp size={18} className="mx-auto text-success" />
                        <p className="mt-2 text-2xl font-extrabold">{gpxTrack.elevationGain}</p>
                        <p className="text-xs text-muted-foreground">Hm Aufstieg</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-4 text-center">
                        <TrendingDown size={18} className="mx-auto text-error" />
                        <p className="mt-2 text-2xl font-extrabold">{gpxTrack.elevationLoss}</p>
                        <p className="text-xs text-muted-foreground">Hm Abstieg</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-4 text-center">
                        <Mountain size={18} className="mx-auto text-forest-light" />
                        <p className="mt-2 text-2xl font-extrabold">{gpxTrack.maxEle}</p>
                        <p className="text-xs text-muted-foreground">Höchster Punkt (m)</p>
                      </div>
                      <div className="rounded-2xl bg-muted p-4 text-center">
                        <Timer size={18} className="mx-auto text-koder-orange-bright" />
                        <p className="mt-2 text-2xl font-extrabold">{gpxTrack.minEle}</p>
                        <p className="text-xs text-muted-foreground">Tiefster Punkt (m)</p>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
                        Höhenprofil
                        <span className="text-[10px] font-normal normal-case tracking-normal text-muted-foreground">
                          – mit der Maus über das Profil fahren
                        </span>
                      </h3>
                      <ElevationProfile
                        points={gpxTrack.points}
                        onHover={handleProfileHover}
                      />
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
