"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { dankeText } from "@/lib/fassjagd/copy";
import type { FassjagdBoard } from "@/lib/fassjagd/types";
import { VereinCombobox } from "@/components/fassjagd/verein-combobox";
import { slugifyVerein } from "@/lib/fassjagd/slug";

export function FassjagdDanke({ justRegistered }: { justRegistered: boolean }) {
  const [board, setBoard] = useState<FassjagdBoard | null>(null);
  const [verein, setVerein] = useState("");

  useEffect(() => {
    void fetch("/api/fassjagd", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (j && Array.isArray(j.ranking)) setBoard(j as FassjagdBoard);
      })
      .catch(() => undefined);
  }, []);

  const club = useMemo(() => {
    const name = verein.trim();
    if (!name || !board) return null;
    const slug = slugifyVerein(name);
    return (
      board.ranking.find((c) => c.slug === slug || c.name.toLowerCase() === name.toLowerCase()) ??
      (board.hausherr &&
      (board.hausherr.slug === slug || board.hausherr.name.toLowerCase() === name.toLowerCase())
        ? board.hausherr
        : null)
    );
  }, [board, verein]);

  const starterNr = club ? club.total + (justRegistered ? 1 : 0) : 0;
  const names = board?.names ?? [];

  return (
    <div className="mt-3 space-y-3 border-t border-koder-orange/25 pt-3">
      <p className="text-sm font-semibold">Fassjagd – nur mit Vereinsname</p>
      <VereinCombobox
        names={names}
        value={verein}
        onChange={setVerein}
        placeholder="Welchen Verein hast du angegeben?"
      />
      {club && !club.hausherr && (
        <>
          <p className="text-sm">{dankeText(club, Math.max(1, starterNr))}</p>
          <Link
            href={`/fassjagd/${club.slug}`}
            className="inline-flex rounded-xl bg-koder-orange px-4 py-2 text-sm font-semibold text-white"
          >
            Vereinskarte in den Chat
          </Link>
        </>
      )}
      {club?.hausherr && (
        <p className="text-sm text-muted-foreground">
          {club.name} ist Hausherr und steht außer Wertung – sichtbar auf der Fassjagd-Tafel.
        </p>
      )}
    </div>
  );
}
