"use client";

import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Baby,
  Zap,
  TreePine,
  Mountain,
  Award,
  Medal,
  Gift,
  ChevronRight,
  Trophy,
  Users,
  Footprints,
  Route,
  Beer,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErgebnisseResultsPanel } from "@/components/ergebnisse/results-panel";
import { cn } from "@/lib/utils";
import { YearSwitcher } from "@/components/ui/year-switcher";
import { EVENT } from "@/lib/event-config";
import { getAltersklassenDlv, type AltersklasseMeta } from "@/lib/data/altersklassen";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";

const AK_GRUPPEN: {
  id: AltersklasseMeta["gruppe"];
  label: string;
}[] = [
  { id: "kinder", label: "Kinder" },
  { id: "jugend", label: "Jugend" },
  { id: "junioren", label: "Junioren" },
  { id: "erwachsene", label: "Erwachsene" },
  { id: "senioren", label: "Senioren" },
];

const STRECKEN_ICONS: Record<string, typeof Baby> = {
  kinderlauf: Baby,
  "kurz-knackig": Zap,
  koderrunde: TreePine,
  "koderrunde-walking": Footprints,
  trailrun: Mountain,
  spielerei: Route,
};

/** Farben analog zu Strecken-Seite */
const STRECKEN = [
  {
    id: "kinderlauf",
    name: "Kinderlauf",
    distance: "800 m",
    Icon: Baby,
    color: "from-koder-orange/20 to-koder-orange/5",
    ring: "ring-koder-orange/30",
    borderColor: "#FF6B00",
    iconColor: "text-koder-orange",
  },
  {
    id: "kurz",
    name: "Kurz und knackig",
    distance: "4 km",
    Icon: Zap,
    color: "from-emerald-500/15 to-emerald-500/5",
    ring: "ring-emerald-500/25",
    borderColor: "#22C55E",
    iconColor: "text-emerald-600 dark:text-emerald-400",
  },
  {
    id: "koderrunde",
    name: "Koderrunde",
    distance: "8,5 km",
    Icon: TreePine,
    color: "from-amber-500/15 to-amber-500/5",
    ring: "ring-amber-500/25",
    borderColor: "#EAB308",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    id: "trailrun",
    name: "Trailrun",
    distance: "11,25 km",
    Icon: Mountain,
    color: "from-sky-500/15 to-sky-500/5",
    ring: "ring-sky-500/25",
    borderColor: "#3B82F6",
    iconColor: "text-sky-600 dark:text-sky-400",
  },
] as const;

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};



export default function ErgebnissePage() {
  const [selectedStrecke, setSelectedStrecke] = useState<string | null>("kinderlauf");
  const [yearTab, setYearTab] = useState<"2026" | "2027">("2026");
  const panelContainerRef = useRef<HTMLDivElement>(null);
  const skipInitialScroll = useRef(true);
  const altersklassen2027 = getAltersklassenDlv(EVENT.jahr);

  useEffect(() => {
    if (skipInitialScroll.current) {
      skipInitialScroll.current = false;
      return;
    }
    if (selectedStrecke && panelContainerRef.current) {
      requestAnimationFrame(() => {
        panelContainerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
          inline: "nearest",
        });
      });
    }
  }, [selectedStrecke]);

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
            Koderlauf {yearTab}
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Ergebnisse &amp; Ehrungen
          </h1>

          <YearSwitcher
            value={yearTab}
            onChange={(year) => {
              setYearTab(year);
              setSelectedStrecke(year === "2026" ? "kinderlauf" : null);
            }}
          />
        </motion.header>



        {yearTab === "2026" ? (
          <>
            {/* Strecken-Kacheln + Ergebnis-Panel (2026) */}
            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-8"
              aria-label="Strecke wählen"
            >
          <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
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
                    style={active ? { borderColor: s.borderColor } : undefined}
                    className={cn(
                      "group relative flex h-full w-full flex-col rounded-xl border-2 bg-gradient-to-br p-3 text-left shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 sm:rounded-2xl sm:p-5",
                      s.color,
                      !active && "border-border ring-1",
                      !active && s.ring,
                      !active && "focus-visible:ring-koder-orange",
                    )}
                  >
                    <div
                      className={cn(
                        "mb-2 flex h-8 w-8 items-center justify-center rounded-lg bg-background/80 shadow-inner sm:mb-3 sm:h-11 sm:w-11 sm:rounded-xl",
                        s.iconColor,
                      )}
                    >
                      <s.Icon className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={2} />
                    </div>
                    <p className="text-xs font-semibold leading-snug sm:text-base">{s.name}</p>
                    <p className="mt-0.5 text-[10px] text-muted-foreground sm:mt-1 sm:text-sm">{s.distance}</p>
                    <span className="mt-2 inline-flex items-center gap-0.5 text-[10px] font-semibold uppercase tracking-wider text-koder-orange opacity-90 group-hover:opacity-100 sm:mt-4 sm:gap-1 sm:text-xs">
                      Ergebnisse
                      <ChevronRight className="h-3 w-3 transition group-hover:translate-x-0.5 sm:h-3.5 sm:w-3.5" />
                    </span>
                  </button>
                </motion.div>
              );
            })}
          </div>

          <div ref={panelContainerRef} className="scroll-mt-32">
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
          </div>
        </motion.section>
          </>
        ) : (
          <>
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.4 }}
              className="mt-8 rounded-3xl border border-border bg-card p-6 text-center sm:p-8"
            >
              <p className="text-lg text-muted-foreground">
                Für den <strong className="font-semibold text-foreground">Koderlauf 2027</strong> liegen
                noch keine Ergebnisse vor.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                Hier schon die Übersicht: Strecken, Altersklassen und Ehrungsregeln.
              </p>
            </motion.div>

            {/* Strecken-Übersicht 2027 */}
            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.08 }}
              className="mt-12"
              aria-labelledby="strecken-2027-heading"
            >
              <div className="mb-6 border-b border-border pb-4">
                <h2
                  id="strecken-2027-heading"
                  className="text-xl font-bold tracking-tight sm:text-2xl"
                >
                  Strecken {EVENT.jahr}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ergebnisse erscheinen hier nach dem Event – getrennt je Strecke und Wertung.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-3">
                {EVENT.strecken.map((s) => {
                  const Icon = STRECKEN_ICONS[s.id] ?? Trophy;
                  return (
                    <div
                      key={s.id}
                      className="rounded-2xl border border-border bg-card p-4"
                    >
                      <div
                        className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{ backgroundColor: `${s.farbe}22`, color: s.farbe }}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <p className="font-semibold leading-snug">{s.name}</p>
                      {s.badge && (
                        <p className="mt-0.5 text-xs font-medium text-koder-orange">{s.badge}</p>
                      )}
                      <p className="mt-1 text-sm text-muted-foreground">
                        {s.distanz} · Start {s.startzeit} Uhr
                      </p>
                    </div>
                  );
                })}
              </div>
            </motion.section>

            {/* Altersklassen-Übersicht 2027 */}
            <motion.section
              {...fadeUp}
              transition={{ duration: 0.45, delay: 0.1 }}
              className="mt-16"
              aria-labelledby="altersklassen-heading"
            >
              <div className="mb-6 border-b border-border pb-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-koder-orange/15 text-koder-orange">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <h2
                      id="altersklassen-heading"
                      className="text-xl font-bold tracking-tight sm:text-2xl"
                    >
                      Altersklassen {EVENT.jahr}
                    </h2>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      Nach DLV/DLO in 5-Jahres-Schritten · maßgeblich ist das Geburtsjahr
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-6 rounded-2xl border border-koder-orange/25 bg-koder-orange/5 p-4 sm:p-5">
                <p className="font-semibold">Kinderlauf</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Eigene Wertung für Kinder bis maximal <strong className="text-foreground">8 Jahre</strong> –
                  getrennt von den DLV-Altersklassen der anderen Strecken.
                </p>
              </div>

              <div className="space-y-8">
                {AK_GRUPPEN.map((gruppe) => {
                  const items = altersklassen2027.filter((a) => a.gruppe === gruppe.id);
                  if (items.length === 0) return null;
                  return (
                    <div key={gruppe.id}>
                      <h3 className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-koder-orange">
                        {gruppe.label}
                      </h3>
                      <div className="overflow-hidden rounded-2xl border border-border">
                        <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 bg-muted/40 px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground sm:grid-cols-[1.2fr_1fr_1.2fr] sm:px-4">
                          <span>Klasse</span>
                          <span className="text-right sm:text-left">Alter</span>
                          <span className="text-right sm:text-left">Jahrgang {EVENT.jahr}</span>
                        </div>
                        <ul className="divide-y divide-border">
                          {items.map((ak) => (
                            <li
                              key={ak.name}
                              className="grid grid-cols-[1fr_auto_auto] items-center gap-x-3 px-3 py-2.5 text-sm sm:grid-cols-[1.2fr_1fr_1.2fr] sm:px-4"
                            >
                              <span className="font-semibold">{ak.name}</span>
                              <span className="text-right tabular-nums text-muted-foreground sm:text-left">
                                {ak.alterSpan} J.
                              </span>
                              <span className="text-right tabular-nums text-muted-foreground sm:text-left">
                                {ak.jahrgang}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                M/W = männlich / weiblich getrennt. Die drei Schnellsten je Altersklasse erhalten eine
                Urkunde; bei der Siegerehrung werden die Top&nbsp;3 Männer und Frauen je Strecke geehrt.
              </p>
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
                          Alle weiteren Strecken
                        </CardTitle>
                        <p className="text-sm text-muted-foreground">
                          4&nbsp;km · 8,5&nbsp;km (Lauf &amp; Walking) · 10,5&nbsp;km · 25&nbsp;km
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-0">
                    <div className="flex gap-3 rounded-xl border border-border bg-muted/30 p-4">
                      <Trophy className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
                      <div>
                        <p className="font-semibold">Ehrung pro Strecke</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          Bei der Siegerehrung werden die{" "}
                          <strong className="text-foreground">drei schnellsten Männer</strong> und
                          die{" "}
                          <strong className="text-foreground">drei schnellsten Frauen</strong>{" "}
                          je Lauf ausgezeichnet (Platz&nbsp;1–3). Koderrunde Lauf und Walking zählen
                          als eigene Wertungen. Eine separate Altersklassen-Ehrung gibt es nicht –
                          die{" "}
                          <strong className="text-foreground">drei Schnellsten je Altersklasse</strong>{" "}
                          erhalten aber eine <strong className="text-foreground">Urkunde</strong>.
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-3 rounded-xl border border-koder-orange/30 bg-koder-orange/5 p-4">
                      <Beer className="mt-0.5 h-5 w-5 shrink-0 text-koder-orange" />
                      <div>
                        <p className="font-semibold">{VEREINS_WERTUNG.titel}</p>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                          {VEREINS_WERTUNG.kurz} {VEREINS_WERTUNG.ausrichterCanonical} ist als
                          Ausrichter nicht in der Wertung. Stand und Details: Seite Teilnehmer.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.section>
          </>
        )}
      </div>
    </div>
  );
}
