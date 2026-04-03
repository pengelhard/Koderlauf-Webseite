"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useLayoutEffect, useMemo, useCallback } from "react";
import { Users, TrendingUp, RefreshCw } from "lucide-react";
import { STRECKEN_COLORS } from "@/lib/strecken-config";

interface StreckenStat {
  total: number;
  m: number;
  w: number;
}

interface AnmeldungenStats {
  total: number;
  gender: { m: number; w: number };
  strecken: Record<string, StreckenStat>;
  lastUpdated: string;
}

const STRECKEN_ORDER = ["Kinderlauf", "Kurz und knackig", "Koderrunde", "Trailrun"];
const POLL_MS = 60_000;
const LS_KEY = "koderlauf-anmeldungen-stats-v2";

const EMPTY_STATS: AnmeldungenStats = {
  total: 0,
  gender: { m: 0, w: 0 },
  strecken: Object.fromEntries(STRECKEN_ORDER.map((s) => [s, { total: 0, m: 0, w: 0 }])),
  lastUpdated: "",
};

function readCache(): AnmeldungenStats | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { stats?: AnmeldungenStats };
    if (!parsed.stats || typeof parsed.stats.total !== "number") return null;
    return parsed.stats;
  } catch {
    return null;
  }
}

function writeCache(stats: AnmeldungenStats) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify({ stats, cachedAt: Date.now() }));
  } catch {
    /* quota / private mode */
  }
}

export default function AnmeldungenPage() {
  const [stats, setStats] = useState<AnmeldungenStats>(EMPTY_STATS);
  const [initialLoad, setInitialLoad] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchData = useCallback(async (opts?: { background?: boolean }) => {
    const bg = opts?.background ?? false;
    if (bg) setRefreshing(true);

    setFetchError(null);
    try {
      const res = await fetch("/api/anmeldungen", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Laden fehlgeschlagen");
      }
      if (typeof json.total === "number") {
        setStats(json as AnmeldungenStats);
        writeCache(json as AnmeldungenStats);
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Netzwerkfehler";
      setFetchError(msg);
    } finally {
      setInitialLoad(false);
      setRefreshing(false);
    }
  }, []);

  useLayoutEffect(() => {
    const cached = readCache();
    if (cached && cached.total > 0) {
      setStats(cached);
      setInitialLoad(false);
    }
  }, []);

  useEffect(() => {
    const cached = readCache();
    void fetchData({ background: !!(cached && cached.total > 0) });

    const id = setInterval(() => {
      if (document.visibilityState === "visible") {
        void fetchData({ background: true });
      }
    }, POLL_MS);

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        void fetchData({ background: true });
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchData]);

  const maxStrecke = useMemo(() => {
    return Math.max(...Object.values(stats.strecken).map((s) => s.total), 1);
  }, [stats.strecken]);

  if (initialLoad && stats.total === 0) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-24">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">Koderlauf 2026</p>
              <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Anmeldungen</h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {refreshing && (
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Aktualisiere…
                </span>
              )}
              <button
                type="button"
                onClick={() => void fetchData({ background: true })}
                disabled={refreshing}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium transition-colors hover:bg-muted disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                Neu laden
              </button>
            </div>
          </div>
          {stats.lastUpdated && (
            <p className="mt-2 text-xs text-muted-foreground">
              Stand:{" "}
              {new Date(stats.lastUpdated).toLocaleString("de-DE", {
                dateStyle: "short",
                timeStyle: "short",
              })}
            </p>
          )}
          {fetchError && (
            <p className="mt-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {fetchError}
              {stats.total > 0 && " — es werden die zuletzt geladenen Daten angezeigt."}
            </p>
          )}
        </motion.div>

        {/* Big total number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-koder-orange/10 to-forest-deep/5 p-6 text-center sm:p-8"
        >
          <Users className="mx-auto h-8 w-8 text-koder-orange" />
          <p className="mt-3 text-6xl font-black tabular-nums text-koder-orange sm:text-7xl">{stats.total}</p>
          <p className="mt-1 text-lg font-medium text-muted-foreground">Anmeldungen gesamt</p>
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

        {/* Strecken bars */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8"
        >
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
            <TrendingUp size={14} /> Anmeldungen pro Strecke
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Automatische Aktualisierung ca. alle Minute bei offener Seite; nach Tab-Wechsel wird sofort neu geladen.
          </p>
          <div className="mt-4 space-y-3">
            {STRECKEN_ORDER.map((name) => {
              const s = stats.strecken[name] || { total: 0, m: 0, w: 0 };
              const pct = (s.total / maxStrecke) * 100;
              const color = STRECKEN_COLORS[name] || "#FF6B00";
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

        {/* Gender split visual */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-6"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">Geschlechterverteilung</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex h-8 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.total > 0 ? (stats.gender.m / stats.total) * 100 : 50}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex items-center justify-center bg-blue-500 text-xs font-bold text-white"
                >
                  {stats.total > 0 ? Math.round((stats.gender.m / stats.total) * 100) : 0}%
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.total > 0 ? (stats.gender.w / stats.total) * 100 : 50}%` }}
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
      </div>
    </div>
  );
}
