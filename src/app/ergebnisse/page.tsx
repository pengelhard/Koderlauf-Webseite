"use client";

import { motion } from "framer-motion";
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

const demoResults = [
  { rank: 1, bib: 42, name: "Max Waldläufer", category: "Herren", time: "00:18:34", pace: "3:43/km" },
  { rank: 2, bib: 17, name: "Leon Förster", category: "Herren", time: "00:19:02", pace: "3:48/km" },
  { rank: 3, bib: 5, name: "Anna Bergmann", category: "Damen", time: "00:19:45", pace: "3:57/km" },
  { rank: 4, bib: 88, name: "Tom Eichner", category: "Herren", time: "00:20:11", pace: "4:02/km" },
  { rank: 5, bib: 23, name: "Sophie Grünwald", category: "Damen", time: "00:20:33", pace: "4:07/km" },
  { rank: 6, bib: 61, name: "Felix Tannenbaum", category: "Jugend", time: "00:21:05", pace: "4:13/km" },
  { rank: 7, bib: 34, name: "Laura Moosbach", category: "Damen", time: "00:21:22", pace: "4:16/km" },
  { rank: 8, bib: 99, name: "Niklas Steinweg", category: "Herren", time: "00:21:48", pace: "4:22/km" },
];

export default function ErgebnissePage() {
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 overflow-hidden rounded-3xl border border-border bg-card"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-forest-deep/5 hover:bg-forest-deep/5 dark:bg-forest-deep/30">
                <TableHead className="w-16 font-semibold uppercase tracking-wider">
                  Platz
                </TableHead>
                <TableHead className="w-20 font-semibold uppercase tracking-wider">
                  Nr.
                </TableHead>
                <TableHead className="font-semibold uppercase tracking-wider">
                  Name
                </TableHead>
                <TableHead className="font-semibold uppercase tracking-wider">
                  Kategorie
                </TableHead>
                <TableHead className="font-semibold uppercase tracking-wider">
                  Zeit
                </TableHead>
                <TableHead className="font-semibold uppercase tracking-wider">
                  Pace
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {demoResults.map((r, i) => (
                <TableRow
                  key={r.bib}
                  className={
                    r.rank <= 3
                      ? "bg-koder-orange/5 hover:bg-koder-orange/10"
                      : "hover:bg-koder-orange/5"
                  }
                >
                  <TableCell className="font-bold">
                    <div className="flex items-center gap-2">
                      {r.rank <= 3 && (
                        <Trophy
                          size={14}
                          className={
                            r.rank === 1
                              ? "text-yellow-500"
                              : r.rank === 2
                                ? "text-gray-400"
                                : "text-amber-700"
                          }
                        />
                      )}
                      {r.rank}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-lg bg-koder-orange/10 px-2 py-1 text-sm font-bold text-koder-orange">
                      {r.bib}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">{r.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className="text-xs uppercase tracking-wider"
                    >
                      {r.category}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono font-semibold">
                    {r.time}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {r.pace}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </motion.div>
      </div>
    </div>
  );
}
