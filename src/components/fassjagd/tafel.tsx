"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FassjagdHinweisKasten } from "@/components/fassjagd/hinweis-kasten";
import { FassjagdFlame, useFassjagdBoard } from "@/components/fassjagd/live";
import { PlaceMark } from "@/components/fassjagd/place-mark";
import { gapLine } from "@/lib/fassjagd/copy";
import type { FassjagdBoard, FassjagdClub } from "@/lib/fassjagd/types";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";
import { EVENT } from "@/lib/event-config";

function ClubRow({ club, max }: { club: FassjagdClub; max: number }) {
  const pct = max > 0 ? (club.total / max) * 100 : 0;
  return (
    <Link
      href={`/fassjagd/${club.slug}`}
      className="group block cursor-pointer rounded-2xl border border-border bg-card px-4 py-3 transition-colors hover:border-koder-orange/40 hover:bg-koder-orange/5"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <PlaceMark place={club.place ?? 0} />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate font-semibold">{club.name}</span>
              <FassjagdFlame show={club.flaming} />
            </div>
            <p className="text-xs text-muted-foreground">{gapLine(club)}</p>
          </div>
        </div>
        <span className="flex shrink-0 items-center gap-2">
          <span className="text-xl font-black tabular-nums text-koder-orange">{club.total}</span>
          <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-koder-orange">
            <span className="hidden sm:inline">Teilen &amp; Details</span>
            <ChevronRight
              className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
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
      {refreshing && (
        <p className="text-center text-xs text-muted-foreground">Aktualisiere…</p>
      )}

      <FassjagdHinweisKasten
        title={`${VEREINS_WERTUNG.titel} ${EVENT.jahr}`}
        titleAs="h1"
        linkHref={null}
        extra={
          leader ? (
            <p className="mt-4 text-sm font-semibold text-foreground">
              Platz 1: {leader.name} · {leader.total} Starter
              {leader.leadBy ? ` · führt mit +${leader.leadBy}` : ""}
            </p>
          ) : null
        }
      />

      <div className="space-y-2">
        {board.ranking.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card px-4 py-8 text-center text-sm text-muted-foreground">
            Noch keine Teams in der Wertung. {VEREINS_WERTUNG.angabe}
          </div>
        ) : (
          board.ranking.map((club) => <ClubRow key={club.slug} club={club} max={max} />)
        )}
      </div>

      {board.hausherr && (
        <Link
          href={`/fassjagd/${board.hausherr.slug}`}
          className="group flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-dashed border-border bg-muted/40 px-4 py-3 transition-colors hover:border-koder-orange/40 hover:bg-koder-orange/5"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Hausherr · außer Wertung
            </p>
            <p className="mt-1 font-semibold group-hover:text-koder-orange">{board.hausherr.name}</p>
          </div>
          <span className="flex items-center gap-2">
            <span className="tabular-nums text-koder-orange font-black">{board.hausherr.total}</span>
            <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-koder-orange">
              <span className="hidden sm:inline">Teilen &amp; Details</span>
              <ChevronRight
                className="h-5 w-5 transition-transform group-hover:translate-x-0.5"
                aria-hidden
              />
            </span>
          </span>
        </Link>
      )}

      {board.ohneAngabe > 0 && (
        <p className="text-xs text-muted-foreground">Ohne Teamangabe: {board.ohneAngabe} (zählen nicht)</p>
      )}
    </div>
  );
}
