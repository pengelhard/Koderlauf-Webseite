"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { ResultEntry } from "@/lib/supabase/queries";
import { cn } from "@/lib/utils";

interface ResultsTableProps {
  results: ResultEntry[];
}

function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0) {
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  }

  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export function ResultsTable({ results }: ResultsTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [distance, setDistance] = useState("all");

  const distanceOptions = useMemo(() => {
    const values = Array.from(new Set(results.map((entry) => entry.distance))).sort();
    return ["all", ...values];
  }, [results]);

  const filteredResults = useMemo(() => {
    return results.filter((entry) => {
      const byDistance = distance === "all" || entry.distance === distance;
      const needle = searchTerm.trim().toLowerCase();
      const bySearch =
        needle.length === 0 ||
        entry.name.toLowerCase().includes(needle) ||
        (entry.team ? entry.team.toLowerCase().includes(needle) : false) ||
        entry.bibNumber.toLowerCase().includes(needle);

      return byDistance && bySearch;
    });
  }, [distance, results, searchTerm]);

  return (
    <div className="space-y-4">
      <div className="grid gap-3 md:grid-cols-[1fr_220px]">
        <label className="relative block">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <Input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Name, Team oder Startnummer suchen..."
            className="pl-10"
            aria-label="Ergebnisse durchsuchen"
          />
        </label>
        <label className="relative block">
          <span className="sr-only">Distanz filtern</span>
          <select
            value={distance}
            onChange={(event) => setDistance(event.target.value)}
            className={cn(
              "h-14 w-full rounded-2xl border border-primary-koder/20 bg-dark-muted px-4 text-base text-text-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-koder",
            )}
            aria-label="Distanz filtern"
          >
            {distanceOptions.map((option) => (
              <option key={option} value={option}>
                {option === "all" ? "Alle Distanzen" : option.toUpperCase()}
              </option>
            ))}
          </select>
        </label>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rang</TableHead>
            <TableHead>Startnr.</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Distanz</TableHead>
            <TableHead>Zeit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredResults.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-text-secondary">
                Keine Ergebnisse für diese Auswahl gefunden.
              </TableCell>
            </TableRow>
          ) : (
            filteredResults.map((result) => (
              <TableRow key={result.id} data-winner={result.rank === 1}>
                <TableCell>{result.rank}</TableCell>
                <TableCell>{result.bibNumber}</TableCell>
                <TableCell className="font-semibold text-white">{result.name}</TableCell>
                <TableCell>{result.team ?? "—"}</TableCell>
                <TableCell>{result.distance.toUpperCase()}</TableCell>
                <TableCell>{formatTime(result.timeSeconds)}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
