"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Info, X } from "lucide-react";
import type { ResultRow } from "@/lib/data/results";
import { formatAkLabel, getAltersklasseMeta } from "@/lib/data/altersklassen";
import { cn } from "@/lib/utils";

function timeToSeconds(t: string): number {
  const parts = t.split(":").map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }
  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
}

function sortByZeit(rows: ResultRow[]): ResultRow[] {
  return [...rows].sort((a, b) => timeToSeconds(a.zeit) - timeToSeconds(b.zeit));
}

function ResultTable({
  rows,
  showPlatz = true,
  caption,
}: {
  rows: ResultRow[];
  showPlatz?: boolean;
  caption?: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border bg-card">
      {caption && (
        <p className="border-b border-border bg-muted/40 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {caption}
        </p>
      )}
      <table className="w-full min-w-[280px] text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            {showPlatz && (
              <th scope="col" className="w-14 px-3 py-2.5 font-semibold sm:px-4">
                Platz
              </th>
            )}
            <th scope="col" className="w-16 px-3 py-2.5 font-semibold sm:px-4">
              Nr.
            </th>
            <th scope="col" className="px-3 py-2.5 font-semibold sm:px-4">
              Name
            </th>
            <th scope="col" className="w-12 px-3 py-2.5 font-semibold sm:px-4">
              m/w
            </th>
            <th scope="col" className="w-24 px-3 py-2.5 font-semibold tabular-nums sm:px-4">
              Zeit
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={`${r.startnummer}-${r.zeit}-${i}`}
              className={cn(
                "border-b border-border/80 last:border-0",
                i % 2 === 1 && "bg-muted/15",
              )}
            >
              {showPlatz && (
                <td className="px-3 py-2.5 font-medium text-koder-orange sm:px-4">
                  {i + 1}
                </td>
              )}
              <td className="px-3 py-2.5 tabular-nums text-muted-foreground sm:px-4">
                {r.startnummer}
              </td>
              <td className="px-3 py-2.5 font-medium sm:px-4">
                {r.vorname} {r.nachname}
              </td>
              <td className="px-3 py-2.5 text-muted-foreground sm:px-4">
                {r.geschlecht}
              </td>
              <td className="px-3 py-2.5 font-mono tabular-nums sm:px-4">
                {r.zeit}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

type ApiResponse = {
  results: ResultRow[];
  demo: boolean;
  distanz: string;
};

/** Altersklassen-Bereich mit Tabs – nur eine Klasse sichtbar, weniger Scroll. */
function AltersklassenTabs({
  rows,
}: {
  rows: ResultRow[];
}) {
  const aksWithData = useMemo(() => {
    const s = new Set<number>();
    for (const r of rows) {
      if (
        r.altersklasse != null &&
        r.altersklasse >= 1 &&
        r.altersklasse <= 6
      ) {
        s.add(r.altersklasse);
      }
    }
    return [...s].sort((a, b) => a - b);
  }, [rows]);

  const [activeAk, setActiveAk] = useState<number | null>(null);

  useEffect(() => {
    if (aksWithData.length === 0) {
      setActiveAk(null);
      return;
    }
    setActiveAk((prev) =>
      prev != null && aksWithData.includes(prev) ? prev : aksWithData[0],
    );
  }, [aksWithData]);

  if (aksWithData.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border bg-muted/20 px-4 py-3 text-sm text-muted-foreground">
        Keine Altersklassen-Zuordnung in den Ergebnisdaten – sobald Jahrgang/Geschlecht
        gepflegt sind, erscheinen hier die Klassen als Registerkarten.
      </p>
    );
  }

  const meta = activeAk != null ? getAltersklasseMeta(activeAk) : undefined;
  const inAkM =
    activeAk != null
      ? sortByZeit(
          rows.filter(
            (r) => r.altersklasse === activeAk && r.geschlecht === "M",
          ),
        )
      : [];
  const inAkW =
    activeAk != null
      ? sortByZeit(
          rows.filter(
            (r) => r.altersklasse === activeAk && r.geschlecht === "W",
          ),
        )
      : [];

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-base font-bold tracking-tight sm:text-lg">
          Altersklassen
        </h4>
      </div>

      <div
        role="tablist"
        aria-label="Altersklasse wählen"
        className="-mx-1 flex gap-1 overflow-x-auto pb-1 pt-0.5 sm:flex-wrap sm:overflow-visible"
      >
        {aksWithData.map((ak) => {
          const selected = activeAk === ak;
          const m = getAltersklasseMeta(ak);
          return (
            <button
              key={ak}
              type="button"
              role="tab"
              id={`ak-tab-${ak}`}
              aria-selected={selected}
              aria-controls={`ak-panel-${ak}`}
              title={m ? `Jg. ${m.jahrgang}` : undefined}
              onClick={() => setActiveAk(ak)}
              className={cn(
                "shrink-0 rounded-lg px-3.5 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koder-orange focus-visible:ring-offset-2",
                selected
                  ? "bg-koder-orange text-white shadow-sm"
                  : "border border-border bg-muted/40 text-foreground hover:bg-muted/70",
              )}
            >
              AK&nbsp;{ak}
            </button>
          );
        })}
      </div>

      {activeAk != null && meta && (
        <div
          role="tabpanel"
          id={`ak-panel-${activeAk}`}
          aria-labelledby={`ak-tab-${activeAk}`}
          className="space-y-6 border-t border-border pt-5"
        >
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">Altersklasse {activeAk}</span>
            {" · "}
            Jg. {meta.jahrgang} · ca. {meta.alterSpan}
          </p>

          {inAkM.length > 0 && (
            <div>
              <h5 className="mb-2 text-sm font-medium text-muted-foreground">
                {formatAkLabel("M", meta)}
              </h5>
              <ResultTable rows={inAkM} />
            </div>
          )}
          {inAkW.length > 0 && (
            <div>
              <h5 className="mb-2 text-sm font-medium text-muted-foreground">
                {formatAkLabel("W", meta)}
              </h5>
              <ResultTable rows={inAkW} />
            </div>
          )}
          {inAkM.length === 0 && inAkW.length === 0 && (
            <p className="text-sm text-muted-foreground">
              In dieser Altersklasse keine Einträge.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export function ErgebnisseResultsPanel({
  streckeId,
  streckeLabel,
  isKinderlauf,
  onClose,
}: {
  streckeId: string;
  streckeLabel: string;
  isKinderlauf: boolean;
  onClose: () => void;
}) {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    fetch(`/api/ergebnisse?strecke=${encodeURIComponent(streckeId)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Ergebnisse konnten nicht geladen werden.");
        return res.json();
      })
      .then((json: ApiResponse) => {
        if (!cancelled) setData(json);
      })
      .catch(() => {
        if (!cancelled) setError("Laden fehlgeschlagen.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [streckeId]);

  useEffect(() => {
    if (!loading && panelRef.current) {
      panelRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [loading, streckeId]);

  const rows = data?.results ?? [];

  const maedchen = sortByZeit(rows.filter((r) => r.geschlecht === "W"));
  const jungen = sortByZeit(rows.filter((r) => r.geschlecht === "M"));

  const mainSortedM = sortByZeit(rows.filter((r) => r.geschlecht === "M"));
  const mainSortedW = sortByZeit(rows.filter((r) => r.geschlecht === "W"));
  const top3M = mainSortedM.slice(0, 3);
  const top3W = mainSortedW.slice(0, 3);

  return (
    <motion.div
      ref={panelRef}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 12 }}
      transition={{ duration: 0.22 }}
      className="overflow-hidden"
    >
      <div className="relative mt-6 rounded-2xl border-2 border-koder-orange/20 bg-card p-5 shadow-lg sm:p-8">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          aria-label="Ergebnisse schließen"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="pr-10">
          <h3 className="text-xl font-bold tracking-tight sm:text-2xl">
            Ergebnisse: {streckeLabel}
          </h3>
          {data?.demo && (
            <p className="mt-2 flex items-start gap-2 rounded-lg bg-koder-orange/10 px-3 py-2 text-xs text-muted-foreground sm:text-sm">
              <Info className="mt-0.5 h-4 w-4 shrink-0 text-koder-orange" />
              <span>
                <strong className="text-foreground">Demo-Vorschau</strong> – nach dem
                Lauf erscheinen hier die offiziellen Zeiten aus der Chipzeitmessung.
              </span>
            </p>
          )}
        </div>

        <AnimatePresence mode="wait">
          {loading && (
            <motion.div
              key="load"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2 py-16 text-muted-foreground"
            >
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Lade Ergebnisse…</span>
            </motion.div>
          )}

          {!loading && error && (
            <p className="py-12 text-center text-destructive">{error}</p>
          )}

          {!loading && !error && data && rows.length === 0 && (
            <p className="mt-8 py-8 text-center text-muted-foreground">
              Für diese Strecke liegen noch keine Ergebnisse vor.
            </p>
          )}

          {!loading && !error && data && rows.length > 0 && (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 space-y-10"
            >
              {isKinderlauf ? (
                <>
                  <section aria-labelledby="kinder-maedchen">
                    <h4
                      id="kinder-maedchen"
                      className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-koder-orange"
                    >
                      Mädchen
                    </h4>
                    <ResultTable rows={maedchen} />
                  </section>
                  <section aria-labelledby="kinder-jungen">
                    <h4
                      id="kinder-jungen"
                      className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-koder-orange"
                    >
                      Jungen
                    </h4>
                    <ResultTable rows={jungen} />
                  </section>
                </>
              ) : (
                <>
                  <section aria-labelledby="gw">
                    <h4
                      id="gw"
                      className="mb-4 text-base font-bold tracking-tight sm:text-lg"
                    >
                      Gesamtwertung (Plätze 1–3)
                    </h4>
                    <div className="grid gap-6 md:grid-cols-2">
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Männlich
                        </p>
                        <ResultTable rows={top3M} />
                      </div>
                      <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Weiblich
                        </p>
                        <ResultTable rows={top3W} />
                      </div>
                    </div>
                  </section>

                  <section aria-labelledby="ak-heading">
                    <h4 id="ak-heading" className="sr-only">
                      Altersklassen
                    </h4>
                    <AltersklassenTabs rows={rows} />
                  </section>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
