"use client";

import Link from "next/link";
import { FassjagdAnmeldeButtons } from "@/components/fassjagd/anmelde-buttons";
import { FassjagdFassBild } from "@/components/fassjagd/fass-bild";
import { FassjagdFlame, FassjagdLiveBadge, useFassjagdBoard } from "@/components/fassjagd/live";
import { FassjagdShareButtons } from "@/components/fassjagd/share-buttons";
import { gapLine } from "@/lib/fassjagd/copy";
import type { FassjagdBoard, FassjagdClub } from "@/lib/fassjagd/types";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";
import { cn } from "@/lib/utils";

function PlaceMark({ place, lead }: { place: number; lead: boolean }) {
  return (
    <span
      className={cn(
        "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold",
        lead ? "bg-koder-orange text-white" : "bg-muted text-muted-foreground",
      )}
    >
      {place}
    </span>
  );
}

function ClubRow({ club, max }: { club: FassjagdClub; max: number }) {
  const pct = max > 0 ? (club.total / max) * 100 : 0;
  return (
    <Link
      href={`/fassjagd/${club.slug}`}
      className="block rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:border-koder-orange/40"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PlaceMark place={club.place ?? 0} lead={club.place === 1} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-semibold">{club.name}</span>
              <FassjagdFlame show={club.flaming} />
            </div>
            <p className="text-xs text-muted-foreground">{gapLine(club)}</p>
          </div>
        </div>
        <span className="shrink-0 text-xl font-black tabular-nums text-koder-orange">
          {club.total}
        </span>
      </div>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full bg-koder-orange" style={{ width: `${pct}%` }} />
      </div>
    </Link>
  );
}

export function FassjagdTafel({ initial }: { initial: FassjagdBoard }) {
  const { board, refreshing } = useFassjagdBoard(initial);
  const max = board.ranking[0]?.total ?? 1;
  const leader = board.ranking[0];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <FassjagdLiveBadge status={board.status} />
        {refreshing && (
          <span className="text-xs text-muted-foreground">Aktualisiere…</span>
        )}
      </div>

      <div className="overflow-hidden rounded-3xl border border-koder-orange/35 bg-gradient-to-br from-koder-orange/15 to-forest-deep/10">
        <div className="flex flex-col items-center gap-5 p-6 text-center sm:flex-row sm:items-center sm:text-left sm:p-8">
          <FassjagdFassBild size={168} priority className="h-36 w-36 shrink-0 object-contain sm:h-40 sm:w-40" />
          <div className="min-w-0">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Fassjagd 2027</h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground sm:text-base">
              {VEREINS_WERTUNG.kurz} {VEREINS_WERTUNG.ausrichterCanonical} ist als Hausherr sichtbar,
              aber außer Wertung. Wertung bis Online-Anmeldeschluss, danach Freeze.
            </p>
            {leader && (
              <p className="mt-4 text-sm font-semibold text-foreground">
                Auf dem Fass: {leader.name} · {leader.total} Starter
                {leader.leadBy ? ` · führt mit +${leader.leadBy}` : ""}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {board.ranking.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            Noch keine Teams in der Wertung. Bei der Anmeldung den Teamnamen in der Combobox
            wählen (Verein, Firma oder Gruppe) – sonst zählt die Meldung nicht für die Fassjagd.
          </div>
        ) : (
          board.ranking.map((club) => <ClubRow key={club.slug} club={club} max={max} />)
        )}
      </div>

      {board.hausherr && (
        <div className="rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Hausherr · außer Wertung
          </p>
          <div className="mt-1 flex items-center justify-between gap-3">
            <Link href={`/fassjagd/${board.hausherr.slug}`} className="font-semibold hover:text-koder-orange">
              {board.hausherr.name}
            </Link>
            <span className="tabular-nums text-koder-orange font-black">{board.hausherr.total}</span>
          </div>
        </div>
      )}

      {board.ohneAngabe > 0 && (
        <p className="text-xs text-muted-foreground">Ohne Teamangabe: {board.ohneAngabe} (zählen nicht)</p>
      )}

      {leader && (
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="mb-3 text-sm font-semibold">Teamkarte teilen ({leader.name})</p>
          <FassjagdShareButtons club={leader} />
          <p className="mt-2 text-xs text-muted-foreground">
            Nur Team-Sharecards – keine privaten „Ich bin dabei“-Karten.
          </p>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-center text-sm font-semibold uppercase tracking-widest text-koder-orange">
          Starter für dein Team anmelden
        </p>
        <FassjagdAnmeldeButtons />
      </div>
    </div>
  );
}
