"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { getResults, type ResultRow } from "@/lib/data/results";

const DISTANCE_TABS = [
  { key: "", label: "Alle" },
  { key: "10km", label: "10 km" },
  { key: "5km", label: "5 km" },
  { key: "kids", label: "Kids" },
];

export default function ErgebnissePage() {
  const [filter, setFilter] = useState("");
  const [results, setResults] = useState<ResultRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    requestAnimationFrame(() => {
      if (!cancelled) setLoading(true);
    });
    getResults(2026, filter || undefined).then((data) => {
      if (!cancelled) {
        setResults(data);
        setLoading(false);
      }
    });
    return () => { cancelled = true; };
  }, [filter]);

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
            Ergebnisse
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Alle Zeiten und Platzierungen des Koderlauf 2026 auf einen Blick.
          </p>
        </motion.div>

        <div className="mt-8 flex flex-wrap gap-2">
          {DISTANCE_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`rounded-2xl px-5 py-2 text-sm font-semibold uppercase tracking-wider transition-all ${
                filter === tab.key
                  ? "bg-koder-orange text-white shadow-md shadow-koder-orange/20"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 overflow-hidden rounded-3xl border border-border bg-card"
        >
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-forest-deep/5 hover:bg-forest-deep/5 dark:bg-forest-deep/30">
                  <TableHead className="w-16 font-semibold uppercase tracking-wider">Platz</TableHead>
                  <TableHead className="w-20 font-semibold uppercase tracking-wider">Nr.</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider">Name</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider">Distanz</TableHead>
                  <TableHead className="font-semibold uppercase tracking-wider">Zeit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((r) => (
                  <TableRow
                    key={`${r.distanz}-${r.platz_gesamt}-${r.startnummer}`}
                    className={
                      r.platz_gesamt <= 3
                        ? "bg-koder-orange/5 hover:bg-koder-orange/10"
                        : "hover:bg-koder-orange/5"
                    }
                  >
                    <TableCell className="font-bold">
                      <div className="flex items-center gap-2">
                        {r.platz_gesamt <= 3 && (
                          <Trophy
                            size={14}
                            className={
                              r.platz_gesamt === 1 ? "text-yellow-500"
                                : r.platz_gesamt === 2 ? "text-gray-400"
                                  : "text-amber-700"
                            }
                          />
                        )}
                        {r.platz_gesamt}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded-lg bg-koder-orange/10 px-2 py-1 text-sm font-bold text-koder-orange">
                        {r.startnummer}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      {r.vorname} {r.nachname}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs uppercase tracking-wider">
                        {r.distanz}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono font-semibold">{r.zeit}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </motion.div>
      </div>
    </div>
  );
}
