"use client";

import { motion } from "framer-motion";
import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, RefreshCw, Filter } from "lucide-react";

interface Teilnehmer {
  vorname: string;
  nachname: string;
  geschlecht: string;
  altersklasse: string;
  strecke: string;
}

const STRECKE_COLORS: Record<string, string> = {
  Kinderlauf: "bg-green-500/10 text-green-600 border-green-500/20",
  "Kurz und knackig": "bg-amber-500/10 text-amber-600 border-amber-500/20",
  Koderrunde: "bg-koder-orange/10 text-koder-orange border-koder-orange/20",
  Trailrun: "bg-red-500/10 text-red-600 border-red-500/20",
};

const REFRESH_INTERVAL = 5 * 60 * 1000;

export default function AnmeldungenPage() {
  const [data, setData] = useState<Teilnehmer[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [filterStrecke, setFilterStrecke] = useState("");
  const [filterGeschlecht, setFilterGeschlecht] = useState("");
  const [filterAK, setFilterAK] = useState("");

  const fetchData = async () => {
    try {
      const res = await fetch("/api/anmeldungen");
      const json = await res.json();
      if (json.teilnehmer) {
        setData(json.teilnehmer);
        setLastUpdated(json.lastUpdated);
      }
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, []);

  const strecken = useMemo(
    () => [...new Set(data.map((t) => t.strecke))].sort(),
    [data]
  );
  const geschlechter = useMemo(
    () => [...new Set(data.map((t) => t.geschlecht))].sort(),
    [data]
  );
  const altersklassen = useMemo(
    () =>
      [...new Set(data.map((t) => t.altersklasse))]
        .filter((a) => a !== "–")
        .sort(),
    [data]
  );

  const filtered = useMemo(() => {
    return data.filter((t) => {
      if (filterStrecke && t.strecke !== filterStrecke) return false;
      if (filterGeschlecht && t.geschlecht !== filterGeschlecht) return false;
      if (filterAK && t.altersklasse !== filterAK) return false;
      return true;
    });
  }, [data, filterStrecke, filterGeschlecht, filterAK]);

  const streckeCounts = useMemo(() => {
    const c: Record<string, number> = {};
    data.forEach((t) => {
      c[t.strecke] = (c[t.strecke] || 0) + 1;
    });
    return c;
  }, [data]);

  const hasActiveFilter = filterStrecke || filterGeschlecht || filterAK;

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
            Anmeldungen
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Alle bisherigen Anmeldungen für den Koderlauf 2026.
          </p>
        </motion.div>

        {/* Stats cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 flex flex-wrap gap-2 sm:mt-8 sm:grid sm:grid-cols-5 sm:gap-3"
        >
          <div className="rounded-xl border border-border bg-card px-3 py-2 text-center sm:rounded-2xl sm:p-4">
            <p className="text-xl font-extrabold text-koder-orange sm:text-3xl">
              {data.length}
            </p>
            <p className="text-[10px] text-muted-foreground sm:text-xs">Gesamt</p>
          </div>
          {["Kinderlauf", "Kurz und knackig", "Koderrunde", "Trailrun"].map(
            (s) => (
              <div
                key={s}
                className="rounded-xl border border-border bg-card px-3 py-2 text-center sm:rounded-2xl sm:p-4"
              >
                <p className="text-xl font-extrabold sm:text-3xl">
                  {streckeCounts[s] || 0}
                </p>
                <p className="text-[10px] text-muted-foreground sm:text-xs">{s}</p>
              </div>
            )
          )}
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25 }}
          className="mt-6 space-y-2 sm:mt-8"
        >
          <span className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
            <Filter size={14} />
            Filter
          </span>
          <div className="flex flex-wrap items-center gap-2">

          {/* Strecke filter */}
          <select
            value={filterStrecke}
            onChange={(e) => setFilterStrecke(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-koder-orange focus:outline-none focus:ring-1 focus:ring-koder-orange"
          >
            <option value="">Alle Strecken</option>
            {strecken.map((s) => (
              <option key={s} value={s}>
                {s} ({streckeCounts[s] || 0})
              </option>
            ))}
          </select>

          {/* Geschlecht filter */}
          <select
            value={filterGeschlecht}
            onChange={(e) => setFilterGeschlecht(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-koder-orange focus:outline-none focus:ring-1 focus:ring-koder-orange"
          >
            <option value="">Alle Geschlechter</option>
            {geschlechter.map((g) => (
              <option key={g} value={g}>
                {g === "M" ? "Männlich" : g === "W" ? "Weiblich" : g}
              </option>
            ))}
          </select>

          {/* Altersklasse filter */}
          <select
            value={filterAK}
            onChange={(e) => setFilterAK(e.target.value)}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm focus:border-koder-orange focus:outline-none focus:ring-1 focus:ring-koder-orange"
          >
            <option value="">Alle Altersklassen</option>
            {altersklassen.map((ak) => (
              <option key={ak} value={ak}>
                {ak}
              </option>
            ))}
          </select>

          {hasActiveFilter && (
            <button
              onClick={() => {
                setFilterStrecke("");
                setFilterGeschlecht("");
                setFilterAK("");
              }}
              className="rounded-xl px-3 py-2 text-sm font-medium text-koder-orange hover:bg-koder-orange/10"
            >
              Zurücksetzen
            </button>
          )}

            <div className="ml-auto flex items-center gap-2 text-xs text-muted-foreground">
              <RefreshCw size={12} />
              {lastUpdated
                ? `${new Date(lastUpdated).toLocaleTimeString("de-DE")}`
                : "..."}
            </div>
          </div>
        </motion.div>

        {/* Result count */}
        {hasActiveFilter && (
          <p className="mt-3 text-sm text-muted-foreground">
            {filtered.length} von {data.length} Teilnehmern
          </p>
        )}

        {/* Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-6 overflow-hidden rounded-3xl border border-border bg-card"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-forest-deep/5 hover:bg-forest-deep/5 dark:bg-forest-deep/30">
                  <TableHead className="w-12 text-center font-semibold uppercase tracking-wider">
                    #
                  </TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider">
                    Name
                  </TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider">
                    Strecke
                  </TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider">
                    Geschlecht
                  </TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider">
                    Altersklasse
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((t, i) => (
                  <TableRow key={`${t.vorname}-${t.nachname}-${i}`} className="hover:bg-koder-orange/5">
                    <TableCell className="text-center text-sm text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell className="font-medium">
                      {t.vorname} {t.nachname}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STRECKE_COLORS[t.strecke] || ""}`}
                      >
                        {t.strecke}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {t.geschlecht === "M"
                          ? "♂ Männlich"
                          : t.geschlecht === "W"
                            ? "♀ Weiblich"
                            : t.geschlecht}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">
                        {t.altersklasse}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center text-muted-foreground">
                      <Users className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                      Keine Teilnehmer gefunden.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </motion.div>

        {/* Refresh hint removed */}
      </div>
    </div>
  );
}
