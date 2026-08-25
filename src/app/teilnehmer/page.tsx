"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { Users, TrendingUp, RefreshCw, List, Beer } from "lucide-react";
import { STRECKEN_COLORS } from "@/lib/strecken-config";
import { STRECKEN_ORDER as STRECKEN_2026 } from "@/lib/data/anmeldungen-2026";
import { STRECKEN_ORDER_2027 } from "@/lib/anmeldungen/aggregate";
import type { AnmeldungParticipant, AnmeldungenStats } from "@/lib/anmeldungen/types";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";
import { cn } from "@/lib/utils";

type Jahr = "2027" | "2026";

const POLL_MS = 60_000;
const LS_KEY = "koderlauf-anmeldungen-stats-v3";

function emptyFor(jahr: Jahr): AnmeldungenStats {
  const order = jahr === "2027" ? STRECKEN_ORDER_2027 : STRECKEN_2026;
  return {
    total: 0,
    gender: { m: 0, w: 0 },
    strecken: Object.fromEntries(order.map((s) => [s, { total: 0, m: 0, w: 0 }])),
    lastUpdated: "",
    participants: [],
    source: jahr === "2027" ? "empty" : "frozen-2026",
  };
}

function readCache(jahr: Jahr): AnmeldungenStats | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${LS_KEY}-${jahr}`);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { stats?: AnmeldungenStats };
    if (!parsed.stats || typeof parsed.stats.total !== "number") return null;
    return parsed.stats;
  } catch {
    return null;
  }
}

function writeCache(jahr: Jahr, stats: AnmeldungenStats) {
  try {
    localStorage.setItem(`${LS_KEY}-${jahr}`, JSON.stringify({ stats, cachedAt: Date.now() }));
  } catch {
    /* ignore */
  }
}

function genderLabel(g: AnmeldungParticipant["geschlecht"]) {
  if (g === "m") return "M";
  if (g === "w") return "W";
  if (g === "d") return "D";
  return "–";
}

export default function AnmeldungenPage() {
  const [jahr, setJahr] = useState<Jahr>("2027");
  const [stats, setStats] = useState<AnmeldungenStats>(() => emptyFor("2027"));
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [streckeFilter, setStreckeFilter] = useState<string>("alle");
  const [suche, setSuche] = useState("");

  const streckenOrder = jahr === "2027" ? [...STRECKEN_ORDER_2027] : [...STRECKEN_2026];

  const fetchData = useCallback(
    async (opts?: { background?: boolean; jahr?: Jahr }) => {
      const y = opts?.jahr ?? jahr;
      const bg = opts?.background ?? false;
      if (bg) setRefreshing(true);
      setFetchError(null);
      try {
        const res = await fetch(`/api/anmeldungen?jahr=${y}`, { cache: "no-store" });
        const json = await res.json();
        if (!res.ok && typeof json.total !== "number") {
          throw new Error(json.error || "Laden fehlgeschlagen");
        }
        if (typeof json.total === "number") {
          const next = json as AnmeldungenStats;
          setStats(next);
          writeCache(y, next);
          if (json.error) setFetchError(String(json.error));
        }
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Netzwerkfehler";
        setFetchError(msg);
      } finally {
        setInitialLoad(false);
        setRefreshing(false);
      }
    },
    [jahr],
  );

  useLayoutEffect(() => {
    const cached = readCache(jahr);
    if (cached) {
      setStats(cached);
      setInitialLoad(false);
    } else {
      setStats(emptyFor(jahr));
      setInitialLoad(true);
    }
    setStreckeFilter("alle");
    setSuche("");
  }, [jahr]);

  useEffect(() => {
    const cached = readCache(jahr);
    void fetchData({ background: !!(cached && cached.total > 0), jahr });

    if (jahr !== "2027") return;

    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchData({ background: true, jahr: "2027" });
      }
    }, POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void fetchData({ background: true, jahr: "2027" });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [jahr, fetchData]);

  const displayStrecken = useMemo(() => {
    const keys = new Set([...streckenOrder, ...Object.keys(stats.strecken)]);
    return [...keys].filter((k) => stats.strecken[k] || streckenOrder.includes(k as never));
  }, [stats.strecken, streckenOrder]);

  const maxStrecke = useMemo(() => {
    return Math.max(...displayStrecken.map((n) => stats.strecken[n]?.total ?? 0), 1);
  }, [displayStrecken, stats.strecken]);

  const participants = useMemo(() => {
    const list = stats.participants ?? [];
    const q = suche.trim().toLowerCase();
    return list.filter((p) => {
      if (streckeFilter !== "alle" && p.strecke !== streckeFilter) return false;
      if (!q) return true;
      const hay = `${p.nachname} ${p.vorname} ${p.verein ?? ""} ${p.strecke}`.toLowerCase();
      return hay.includes(q);
    });
  }, [stats.participants, streckeFilter, suche]);

  if (initialLoad && stats.total === 0 && !fetchError) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
      </div>
    );
  }

  const isLive = jahr === "2027";
  const waitingForJson = isLive && stats.source === "empty" && !fetchError;

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf {jahr}
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Teilnehmer</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLive ? "Statistik & Teilnehmerliste" : "Finale Zahlen – Archiv"}
          </p>

          <div className="mt-5 inline-flex rounded-xl border border-border bg-card p-1">
            {(["2027", "2026"] as const).map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => setJahr(y)}
                className={cn(
                  "rounded-lg px-4 py-2 text-sm font-semibold transition-colors",
                  jahr === y
                    ? "bg-koder-orange text-white"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {y}
                {y === "2027" ? " · Live" : " · Archiv"}
              </button>
            ))}
          </div>

          {isLive && (
            <button
              type="button"
              onClick={() => void fetchData({ background: true })}
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
              Aktualisieren
            </button>
          )}

          {fetchError && (
            <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {fetchError}
              {stats.total > 0 && " — es werden die zuletzt geladenen Daten angezeigt."}
            </p>
          )}
          {waitingForJson && (
            <p className="mx-auto mt-4 max-w-2xl rounded-lg border border-koder-orange/30 bg-koder-orange/10 px-3 py-2 text-sm text-muted-foreground">
              Noch keine Live-Daten. Sobald die Teilnehmerliste von RaceSolution freigeschaltet
              ist, erscheinen Statistik und Namen automatisch.
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-koder-orange/10 to-forest-deep/5 p-6 text-center sm:p-8"
        >
          <Users className="mx-auto h-8 w-8 text-koder-orange" />
          <p className="mt-3 text-6xl font-black tabular-nums text-koder-orange sm:text-7xl">
            {stats.total}
          </p>
          <p className="mt-1 text-lg font-medium text-muted-foreground">Teilnehmer gesamt</p>
          <div className="mt-3 flex items-center justify-center gap-6 text-sm">
            <span>
              <span className="font-bold">{stats.gender.m}</span>{" "}
              <span className="text-muted-foreground">Männlich</span>
            </span>
            <span className="text-border">|</span>
            <span>
              <span className="font-bold">{stats.gender.w}</span>{" "}
              <span className="text-muted-foreground">Weiblich</span>
            </span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8"
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
            <TrendingUp size={14} /> Teilnehmer pro Strecke
          </h2>
          <div className="mt-4 space-y-3">
            {displayStrecken.map((name) => {
              const s = stats.strecken[name] || { total: 0, m: 0, w: 0 };
              const pct = (s.total / maxStrecke) * 100;
              const color = STRECKEN_COLORS[name] || STRECKEN_COLORS[name.replace(/ \(.*\)$/, "")] || "#FF6B00";
              return (
                <div
                  key={name}
                  className="rounded-2xl border border-border p-4"
                  style={{
                    background: `linear-gradient(to bottom right, ${color}33, ${color}0D)`,
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-semibold">{name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">♂ {s.m}</span>
                      <span className="text-muted-foreground">♀ {s.w}</span>
                      <span className="min-w-[3ch] text-right text-xl font-black" style={{ color }}>
                        {s.total}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 h-3 overflow-hidden rounded-full bg-muted">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {isLive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
              <Beer size={14} /> Vereinswertung – {VEREINS_WERTUNG.preis}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Der Verein mit den meisten Teilnehmern gewinnt {VEREINS_WERTUNG.preis}.{" "}
              {VEREINS_WERTUNG.ausrichterCanonical} ist als Ausrichter nicht in der Wertung.
            </p>

            <div className="mt-4 space-y-2">
              {(stats.vereine?.ranking.length ?? 0) === 0 ? (
                <div className="rounded-2xl border border-border bg-card px-4 py-6 text-center text-sm text-muted-foreground">
                  {waitingForJson
                    ? "Vereinswertung erscheint mit den Live-Daten."
                    : "Noch keine Vereinsangaben – bei der Anmeldung Verein eintragen!"}
                </div>
              ) : (
                stats.vereine!.ranking.slice(0, 15).map((v, i) => {
                  const max = stats.vereine!.ranking[0]?.total || 1;
                  const pct = (v.total / max) * 100;
                  return (
                    <div
                      key={v.name}
                      className="rounded-2xl border border-border bg-card px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0 flex items-center gap-3">
                          <span
                            className={cn(
                              "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
                              i === 0
                                ? "bg-koder-orange text-white"
                                : "bg-muted text-muted-foreground",
                            )}
                          >
                            {i + 1}
                          </span>
                          <span className="truncate font-semibold">{v.name}</span>
                        </div>
                        <span className="shrink-0 text-xl font-black tabular-nums text-koder-orange">
                          {v.total}
                        </span>
                      </div>
                      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-koder-orange"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {(stats.vereine?.ausrichter || (stats.vereine?.ohneAngabe ?? 0) > 0) && (
              <p className="mt-3 text-xs text-muted-foreground">
                {stats.vereine?.ausrichter && (
                  <>
                    Ausrichter {stats.vereine.ausrichter.name}: {stats.vereine.ausrichter.total}{" "}
                    Teilnehmer (außer Wertung).{" "}
                  </>
                )}
                {(stats.vereine?.ohneAngabe ?? 0) > 0 && (
                  <>Ohne Vereinsangabe: {stats.vereine!.ohneAngabe}</>
                )}
              </p>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
            Geschlechterverteilung
          </h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex h-8 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.total > 0 ? (stats.gender.m / stats.total) * 100 : 50}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex items-center justify-center bg-blue-500 text-xs font-bold text-white"
                >
                  {stats.total > 0 ? Math.round((stats.gender.m / stats.total) * 100) : 0}%
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stats.total > 0 ? (stats.gender.w / stats.total) * 100 : 50}%`,
                  }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center justify-center bg-pink-500 text-xs font-bold text-white"
                >
                  {stats.total > 0 ? Math.round((stats.gender.w / stats.total) * 100) : 0}%
                </motion.div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>♂ Männlich ({stats.gender.m})</span>
                <span>♀ Weiblich ({stats.gender.w})</span>
              </div>
            </div>
          </div>
        </motion.div>

        {isLive && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-8"
          >
            <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
              <List size={14} /> Teilnehmerliste
            </h2>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                value={suche}
                onChange={(e) => setSuche(e.target.value)}
                placeholder="Suche Name / Verein…"
                className="flex-1 rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-koder-orange"
              />
              <select
                value={streckeFilter}
                onChange={(e) => setStreckeFilter(e.target.value)}
                className="rounded-xl border border-border bg-card px-3 py-2 text-sm outline-none focus:border-koder-orange"
              >
                <option value="alle">Alle Strecken</option>
                {streckenOrder.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-border">
              <div className="max-h-[min(70vh,720px)] overflow-auto">
                <table className="w-full text-left text-sm">
                  <thead className="sticky top-0 bg-muted/95 backdrop-blur">
                    <tr className="border-b border-border text-xs uppercase tracking-wider text-muted-foreground">
                      <th className="px-3 py-2 font-semibold">Name</th>
                      <th className="px-3 py-2 font-semibold">Strecke</th>
                      <th className="px-3 py-2 font-semibold">M/W</th>
                      <th className="hidden px-3 py-2 font-semibold sm:table-cell">Verein</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {participants.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-3 py-8 text-center text-muted-foreground">
                          {waitingForJson
                            ? "Teilnehmer erscheinen, sobald die JSON-Liste angebunden ist."
                            : "Keine Einträge für diese Filter."}
                        </td>
                      </tr>
                    ) : (
                      participants.map((p, i) => (
                        <tr key={`${p.nachname}-${p.vorname}-${p.strecke}-${i}`} className="bg-card">
                          <td className="px-3 py-2 font-medium">
                            {p.nachname}
                            {p.nachname && p.vorname ? ", " : ""}
                            {p.vorname}
                          </td>
                          <td className="px-3 py-2 text-muted-foreground">{p.strecke}</td>
                          <td className="px-3 py-2 tabular-nums">{genderLabel(p.geschlecht)}</td>
                          <td className="hidden px-3 py-2 text-muted-foreground sm:table-cell">
                            {p.verein || "–"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              {(stats.participants?.length ?? 0) > 0 && (
                <p className="border-t border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                  {participants.length} von {stats.participants?.length} angezeigt
                  {stats.lastUpdated
                    ? ` · Stand ${new Date(stats.lastUpdated).toLocaleString("de-DE")}`
                    : ""}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
