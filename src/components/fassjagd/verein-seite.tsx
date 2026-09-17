"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { STRECKEN_ORDER_2027 } from "@/lib/anmeldungen/aggregate";
import { FassjagdFassBild } from "@/components/fassjagd/fass-bild";
import { FassjagdFlame, useFassjagdBoard } from "@/components/fassjagd/live";
import { FassjagdShareButtons } from "@/components/fassjagd/share-buttons";
import { FASSJAGD_KASTEN_CLASS } from "@/components/fassjagd/hinweis-kasten";
import { PlaceMark } from "@/components/fassjagd/place-mark";
import { gapLine } from "@/lib/fassjagd/copy";
import type { FassjagdBoard, FassjagdClub } from "@/lib/fassjagd/types";
import { cn } from "@/lib/utils";

export function FassjagdVerein({
  initial,
  slug,
}: {
  initial: FassjagdBoard;
  slug: string;
}) {
  const { board } = useFassjagdBoard(initial);
  const club =
    board.ranking.find((c) => c.slug === slug) ??
    (board.hausherr?.slug === slug ? board.hausherr : null);

  if (!club) {
    return (
      <p className="text-center text-muted-foreground">
        Team nicht gefunden.{" "}
        <Link href="/fassjagd" className="text-koder-orange hover:underline">
          Zur Fassjagd
        </Link>
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <Link
        href="/fassjagd"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-koder-orange bg-koder-orange/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-widest text-koder-orange hover:bg-koder-orange hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Zurück zur Übersicht
      </Link>

      <header className={cn(FASSJAGD_KASTEN_CLASS, "p-6 sm:p-8")}>
        <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
          <FassjagdFassBild size={112} className="h-28 w-28 shrink-0 object-contain" />
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
              Fassjagd 2027
            </p>
            <h1 className="mt-2 flex items-center gap-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
              {club.name}
              <FassjagdFlame show={club.flaming} />
            </h1>
            <p className="mt-3 flex flex-wrap items-center gap-2 text-lg text-muted-foreground">
              {club.hausherr ? (
                <>Hausherr · außer Wertung · {club.total} Starter</>
              ) : (
                <>
                  {club.place ? <PlaceMark place={club.place} /> : null}
                  Platz {club.place} · {club.total} Starter · {gapLine(club)}
                </>
              )}
            </p>
          </div>
        </div>
      </header>

      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="text-sm font-semibold">Karte für Instagram oder WhatsApp teilen</p>
        <p className="mt-1 text-xs text-muted-foreground">
          WhatsApp schickt den Link. Instagram: Teilen → Instagram (Bild ist dabei).
          Falls nichts passiert: „Jetzt teilen“ tippen.
        </p>
        <div className="mt-3">
          <FassjagdShareButtons club={club} />
        </div>
      </div>

      <TeamStarterTabelle club={club} />

      <Link
        href="/fassjagd"
        className="inline-flex items-center gap-1 text-sm font-semibold text-koder-orange hover:underline"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Zurück zur Übersicht
      </Link>
    </div>
  );
}

function streckenKeys(club: FassjagdClub) {
  return [
    ...STRECKEN_ORDER_2027.filter((s) => club.strecken[s]),
    ...Object.keys(club.strecken).filter(
      (s) => !(STRECKEN_ORDER_2027 as readonly string[]).includes(s),
    ),
  ];
}

function TeamStarterTabelle({ club }: { club: FassjagdClub }) {
  const keys = streckenKeys(club);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card">
      {keys.length > 0 && (
        <div className="flex flex-wrap gap-2 border-b border-border px-4 py-3">
          {keys.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold"
            >
              {name}
              <span className="tabular-nums text-koder-orange">{club.strecken[name]}</span>
            </span>
          ))}
        </div>
      )}
      {club.starters.length === 0 ? (
        <p className="px-4 py-6 text-sm text-muted-foreground">Noch keine Starter.</p>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-left">
              <th className="px-4 py-2.5 font-semibold">Nachname</th>
              <th className="px-4 py-2.5 font-semibold">Vorname</th>
              <th className="px-4 py-2.5 font-semibold">Strecke</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {club.starters.map((s, i) => (
              <tr key={`${s.nachname}-${s.vorname}-${s.strecke}-${i}`}>
                <td className="px-4 py-2 font-medium">{s.nachname || "–"}</td>
                <td className="px-4 py-2">{s.vorname || "–"}</td>
                <td className="px-4 py-2 text-muted-foreground">{s.strecke || "–"}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t border-border bg-muted/30">
              <td className="px-4 py-2.5 font-semibold" colSpan={3}>
                {club.total} Starter
              </td>
            </tr>
          </tfoot>
        </table>
      )}
    </div>
  );
}
