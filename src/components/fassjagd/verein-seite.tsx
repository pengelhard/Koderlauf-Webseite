"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { STRECKEN_ORDER_2027 } from "@/lib/anmeldungen/aggregate";
import { FassjagdAnmeldeButtons } from "@/components/fassjagd/anmelde-buttons";
import { FassjagdFassBild } from "@/components/fassjagd/fass-bild";
import { FassjagdFlame, FassjagdLiveBadge, useFassjagdBoard } from "@/components/fassjagd/live";
import { FassjagdShareButtons } from "@/components/fassjagd/share-buttons";
import { gapLine } from "@/lib/fassjagd/copy";
import type { FassjagdBoard, FassjagdClub } from "@/lib/fassjagd/types";

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
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/fassjagd"
          className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-koder-orange bg-koder-orange/10 px-4 py-2.5 text-sm font-semibold uppercase tracking-widest text-koder-orange hover:bg-koder-orange hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Zurück zur Übersicht
        </Link>
        <FassjagdLiveBadge status={board.status} />
      </div>

      <header className="rounded-3xl border border-koder-orange/35 bg-gradient-to-br from-koder-orange/15 to-forest-deep/10 p-6 sm:p-8">
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
            <p className="mt-3 text-lg text-muted-foreground">
              {club.hausherr ? (
                <>Hausherr · {club.total} Starter · außer Wertung</>
              ) : (
                <>
                  Platz {club.place} · {club.total} Starter · {gapLine(club)}
                </>
              )}
            </p>
            {!club.hausherr && (
              <p className="mt-2 text-sm text-muted-foreground">
                {club.gapToAbove != null && club.gapToAbove > 0
                  ? `${club.gapToAbove} fehlen noch auf den Platz davor. `
                  : "Kein Team davor. "}
                {club.gapToBelow != null
                  ? `Vorsprung nach hinten: ${club.gapToBelow}.`
                  : "Letzter Platz in der Tafel."}
              </p>
            )}
          </div>
        </div>
      </header>

      <FassjagdShareButtons club={club} />

      <StreckenSplit club={club} />
      <StarterListe club={club} />

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
          Mit-Starter anmelden
        </p>
        <FassjagdAnmeldeButtons />
        <Link
          href="/fassjagd"
          className="inline-flex items-center gap-1 text-sm font-semibold text-koder-orange hover:underline"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
          Zurück zur Übersicht
        </Link>
      </div>
    </div>
  );
}

function StreckenSplit({ club }: { club: FassjagdClub }) {
  const keys = [
    ...STRECKEN_ORDER_2027.filter((s) => club.strecken[s]),
    ...Object.keys(club.strecken).filter(
      (s) => !(STRECKEN_ORDER_2027 as readonly string[]).includes(s),
    ),
  ];
  if (keys.length === 0) return null;
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
        Strecken-Split
      </h2>
      <ul className="mt-3 space-y-2">
        {keys.map((name) => (
          <li
            key={name}
            className="flex items-center justify-between rounded-xl border border-border bg-card px-4 py-2 text-sm"
          >
            <span>{name}</span>
            <span className="font-black tabular-nums text-koder-orange">{club.strecken[name]}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function StarterListe({ club }: { club: FassjagdClub }) {
  return (
    <section>
      <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
        Wer schon da ist
      </h2>
      {club.starters.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">Noch keine Starter.</p>
      ) : (
        <ul className="mt-3 divide-y divide-border overflow-hidden rounded-2xl border border-border">
          {club.starters.map((s, i) => (
            <li key={`${s.nachname}-${s.vorname}-${s.strecke}-${i}`} className="flex justify-between gap-3 bg-card px-4 py-2 text-sm">
              <span className="font-medium">
                {s.nachname}
                {s.nachname && s.vorname ? ", " : ""}
                {s.vorname}
              </span>
              <span className="text-muted-foreground">{s.strecke || "–"}</span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
