"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  Zap,
  TreePine,
  Mountain,
  Award,
  Medal,
  Gift,
  Users,
  ChevronRight,
  ExternalLink,
  Radio,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErgebnisseResultsPanel } from "@/components/ergebnisse/results-panel";
import { cn } from "@/lib/utils";

const STRECKEN = [
  {
    id: "kinderlauf",
    name: "Kinderlauf",
    distance: "800 m",
    Icon: Baby,
    color: "from-koder-orange/20 to-koder-orange/5",
    ring: "ring-koder-orange/30",
    iconColor: "text-koder-orange",
  },
  {
    id: "kurz",
    name: "Kurz und knackig",
    distance: "4 km",
    Icon: Zap,
    color: "from-emerald-500/15 to-emerald-500/5",
    ring: "ring-emerald-500/25",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "koderrunde",
    name: "Koderrunde",
    distance: "8,5 km",
    Icon: TreePine,
    color: "from-amber-500/15 to-amber-500/5",
    ring: "ring-amber-500/25",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "trailrun",
    name: "Trailrun",
    distance: "11,25 km",
    Icon: Mountain,
    color: "from-sky-500/15 to-sky-500/5",
    ring: "ring-sky-500/25",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

/** Live-Ergebnisse (RaceSolution) – 1. Obermögersheimer Koderlauf */
const RACESOLUTION_LIVE_URL =
  "https://www.racesolution.de/ergebnisse.html?event=id-1obermoegersheimer-koderlauf";

export default function ErgebnissePage() {
  const [selectedStrecke, setSelectedStrecke] = useState<string | null>(null);

  return (
    <div className="relative min-h-screen overflow-hidden pt-24 pb-20">
      {/* dezentes Raster + Verlauf */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(180deg,transparent_0%,var(--background)_420px)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] dark:opacity-20"
        style={{
          backgroundImage: `linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px),
            linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)`,
          backgroundSize: "48px 48px",
        }}
        aria-hidden
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Hero – ganz oben */}
        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center sm:mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-koder-orange">
            Koderlauf 2026
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Ergebnisse &amp; Ehrungen
          </h1>
        </motion.header>

        {/* Live-Ergebnisse RaceSolution */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.45, delay: 0 }}
          className="mb-12 flex justify-center sm:mb-16"
          aria-label="Live-Ergebnisse bei RaceSolution"
        >
          <a
            href={RACESOLUTION_LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Live-Ergebnisse bei RaceSolution öffnen (öffnet neues Fenster)"
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-2xl border-2 border-koder-orange bg-koder-orange px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white shadow-sm transition hover:bg-koder-orange-bright"
          >
            <Radio className="h-4 w-4 shrink-0" aria-hidden />
            Live verfolgen
            <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
          </a>
        </motion.section>

        {/* Strecken-Kacheln + Ergebnis-Panel */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.45, delay: 0.08 }}
          className="mt-16"
          aria-label="Strecke wählen"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STRECKEN.map((s, i) => {
              const active = selectedStrecke === s.id;
              return (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.05 * i }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedStrecke((prev) => (prev === s.id ? null : s.id))
                    }
                    aria-pressed={active}
                    className={cn(
                      "group relative flex h-full w-full flex-col rounded-2xl border bg-gradient-to-br p-5 text-left shadow-sm ring-1 transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koder-orange focus-visible:ring-offset-2",
                      s.color,
                      s.ring,
                      active && "ring-2 ring-koder-orange ring-offset-2",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-background/80 shadow-inner",
                        s.iconColor,
                      )}
                    >
                      <s.Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <p className="font-semibold leading-snug">{s.name}</p>
                    <p className="mt-1 text-sm text-muted-foreground">{s.distance}</p>
                    <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-koder-orange opacity-90 group-hover:opacity-100">
                      Ergebnisse
                      <ChevronRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <AnimatePresence mode="wait">
            {selectedStrecke && (
              <ErgebnisseResultsPanel
                key={selectedStrecke}
                streckeId={selectedStrecke}
                streckeLabel={
                  STRECKEN.find((x) => x.id === selectedStrecke)?.name ?? ""
                }
                isKinderlauf={selectedStrecke === "kinderlauf"}
                onClose={() => setSelectedStrecke(null)}
              />
            )}
          </AnimatePresence>
        </motion.section>

        {/* Ehrungsregeln */}
        <motion.section
          {...fadeUp}
          transition={{ duration: 0.45, delay: 0.12 }}
          className="mt-20"
          aria-labelledby="ehrungen-heading"
        >
          <div className="mb-8 border-b border-border pb-4">
            <h2
              id="ehrungen-heading"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              Wertung &amp; Ehrungen
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Kurz erklärt – wer wird wie ausgezeichnet?
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Kinderlauf */}
            <Card className="overflow-hidden border-2 border-koder-orange/25 bg-gradient-to-b from-koder-orange/[0.06] to-card shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-koder-orange/15 text-koder-orange">
                    <Baby className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">Kinderlauf</CardTitle>
                    <p className="text-sm text-muted-foreground">800&nbsp;m</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-0">
                <div className="rounded-xl border border-border/80 bg-card/80 p-4">
                  <div className="flex items-start gap-3">
                    <Gift className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
                    <div>
                      <p className="font-semibold">Alle Teilnehmenden</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Jede Teilnehmerin und jeder Teilnehmer am Kinderlauf erhält
                        eine <strong className="text-foreground">Urkunde</strong> und
                        einen <strong className="text-foreground">kleinen Preis</strong>.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-xl border border-border/80 bg-card/80 p-4">
                  <div className="flex items-start gap-3">
                    <Medal className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
                    <div>
                      <p className="font-semibold">Platzierungspreise</p>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                        Die <strong className="text-foreground">drei schnellsten
                        Mädchen</strong> und die{" "}
                        <strong className="text-foreground">drei schnellsten Jungen</strong>{" "}
                        werden gesondert geehrt und erhalten einen Platzierungspreis.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Kurz, Koderrunde, Trailrun */}
            <Card className="border shadow-md">
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
                    <Award className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">
                      Kurz und knackig, Koderrunde &amp; Trailrun
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      4&nbsp;km · 8,5&nbsp;km · 11,25&nbsp;km
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 pt-0">
                <div className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
                  <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
                  <div>
                    <p className="font-semibold">Gesamtwertung</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      Platzierungen <strong className="text-foreground">1. bis 3.</strong>{" "}
                      für <strong className="text-foreground">männlich</strong> und{" "}
                      <strong className="text-foreground">weiblich</strong> – jeweils
                      getrennt ausgewiesen.
                    </p>
                  </div>
                </div>
                <div className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
                  <Users className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
                  <div>
                    <p className="font-semibold">Altersklassenwertung</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      In jeder Altersklasse wird der{" "}
                      <strong className="text-foreground">1. Platz männlich</strong> und
                      der <strong className="text-foreground">1. Platz weiblich</strong>{" "}
                      gewertet und geehrt.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
