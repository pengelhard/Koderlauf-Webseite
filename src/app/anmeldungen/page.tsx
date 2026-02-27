"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import { Users, TrendingUp } from "lucide-react";
import { STRECKEN_COLORS } from "@/lib/strecken-config";

interface Teilnehmer {
  geschlecht: string;
  altersklasse: string;
  strecke: string;
}

const STRECKEN_ORDER = ["Kinderlauf", "Kurz und knackig", "Koderrunde", "Trailrun"];
const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function AnmeldungenPage() {
  const [data, setData] = useState<Teilnehmer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/anmeldungen");
        const json = await res.json();
        if (json.teilnehmer) setData(json.teilnehmer);
      } catch { /* ignore */ } finally { setLoading(false); }
    };
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const streckenStats = useMemo(() => {
    const stats: Record<string, { total: number; m: number; w: number }> = {};
    STRECKEN_ORDER.forEach((s) => (stats[s] = { total: 0, m: 0, w: 0 }));
    data.forEach((t) => {
      if (!stats[t.strecke]) stats[t.strecke] = { total: 0, m: 0, w: 0 };
      stats[t.strecke].total++;
      if (t.geschlecht === "M") stats[t.strecke].m++;
      if (t.geschlecht === "W") stats[t.strecke].w++;
    });
    return stats;
  }, [data]);

  const akStats = useMemo(() => {
    const stats: Record<string, number> = {};
    data.forEach((t) => {
      if (t.altersklasse && t.altersklasse !== "–") {
        stats[t.altersklasse] = (stats[t.altersklasse] || 0) + 1;
      }
    });
    return Object.entries(stats).sort((a, b) => b[1] - a[1]);
  }, [data]);

  const genderTotal = useMemo(() => {
    const m = data.filter((t) => t.geschlecht === "M").length;
    const w = data.filter((t) => t.geschlecht === "W").length;
    return { m, w };
  }, [data]);

  const maxStrecke = useMemo(() => {
    return Math.max(...Object.values(streckenStats).map((s) => s.total), 1);
  }, [streckenStats]);

  if (loading) {
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
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">Koderlauf 2026</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Anmeldungen</h1>
        </motion.div>

        {/* Big total number */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.15 }}
          className="mt-8 rounded-3xl border border-border bg-gradient-to-br from-koder-orange/10 to-forest-deep/5 p-6 text-center sm:p-8">
          <Users className="mx-auto h-8 w-8 text-koder-orange" />
          <p className="mt-3 text-6xl font-black tabular-nums text-koder-orange sm:text-7xl">{data.length}</p>
          <p className="mt-1 text-lg font-medium text-muted-foreground">Anmeldungen gesamt</p>
          <div className="mt-3 flex items-center justify-center gap-6 text-sm">
            <span><span className="font-bold">{genderTotal.m}</span> <span className="text-muted-foreground">Männlich</span></span>
            <span className="text-border">|</span>
            <span><span className="font-bold">{genderTotal.w}</span> <span className="text-muted-foreground">Weiblich</span></span>
          </div>
        </motion.div>

        {/* Strecken bars */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange">
            <TrendingUp size={14} /> Anmeldungen pro Strecke
          </h2>
          <div className="mt-4 space-y-3">
            {STRECKEN_ORDER.map((name) => {
              const s = streckenStats[name] || { total: 0, m: 0, w: 0 };
              const pct = (s.total / maxStrecke) * 100;
              const color = STRECKEN_COLORS[name] || "#FF6B00";
              return (
                <div key={name} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-4 w-4 rounded-full" style={{ backgroundColor: color }} />
                      <span className="font-semibold">{name}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="text-muted-foreground">♂ {s.m}</span>
                      <span className="text-muted-foreground">♀ {s.w}</span>
                      <span className="min-w-[3ch] text-right text-xl font-black" style={{ color }}>{s.total}</span>
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
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
          className="mt-8 rounded-2xl border border-border bg-card p-4 sm:p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">Geschlechterverteilung</h2>
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex h-8 overflow-hidden rounded-full">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.length > 0 ? (genderTotal.m / data.length) * 100 : 50}%` }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="flex items-center justify-center bg-blue-500 text-xs font-bold text-white"
                >
                  {data.length > 0 ? Math.round((genderTotal.m / data.length) * 100) : 0}%
                </motion.div>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${data.length > 0 ? (genderTotal.w / data.length) * 100 : 50}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                  className="flex items-center justify-center bg-pink-500 text-xs font-bold text-white"
                >
                  {data.length > 0 ? Math.round((genderTotal.w / data.length) * 100) : 0}%
                </motion.div>
              </div>
              <div className="mt-2 flex justify-between text-xs text-muted-foreground">
                <span>♂ Männlich ({genderTotal.m})</span>
                <span>♀ Weiblich ({genderTotal.w})</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Altersklassen grid */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.45 }}
          className="mt-8">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">Altersklassen</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {akStats.map(([ak, count]) => (
              <div key={ak} className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2">
                <span className="text-sm font-semibold">{ak}</span>
                <span className="flex h-6 min-w-[1.5rem] items-center justify-center rounded-full bg-koder-orange/10 px-1.5 text-xs font-bold text-koder-orange">
                  {count}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Per-strecke breakdown removed — AK badges above are sufficient */}
      </div>
    </div>
  );
}
