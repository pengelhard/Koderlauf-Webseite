import type { AnmeldungParticipant } from "@/lib/anmeldungen/types";
import { resolveVerein } from "@/lib/anmeldungen/vereine";
import { getFassjagdFreezeAt, isFassjagdFrozen } from "@/lib/fassjagd/freeze";
import { slugifyVerein } from "@/lib/fassjagd/slug";
import {
  getFassjagdOverrides,
  lockFreezeSnapshot,
  rememberDailyCounts,
  weekAgoCounts,
} from "@/lib/fassjagd/store";
import type { FassjagdBoard, FassjagdClub, FassjagdStarter } from "@/lib/fassjagd/types";

const TRAIL_SPIELEREI = new Set(["Trailrun", "Spielerei"]);

function firstRegKey(starters: { bib?: number; rrId?: number }[]): number {
  let min = Number.POSITIVE_INFINITY;
  for (const s of starters) {
    const n = s.bib ?? s.rrId;
    if (typeof n === "number" && n > 0 && n < min) min = n;
  }
  return min;
}

function toClub(partial: {
  name: string;
  total: number;
  trailSpielerei: number;
  firstReg: number;
  ausgeschlossen: boolean;
  hausherr: boolean;
  strecken: Record<string, number>;
  starters: FassjagdStarter[];
  weekDelta: number;
}): FassjagdClub {
  return {
    name: partial.name,
    slug: slugifyVerein(partial.name),
    total: partial.total,
    place: null,
    ausgeschlossen: partial.ausgeschlossen,
    hausherr: partial.hausherr,
    trailSpielerei: partial.trailSpielerei,
    firstReg: partial.firstReg,
    weekDelta: partial.weekDelta,
    flaming: partial.weekDelta > 0,
    gapToLeader: 0,
    gapToAbove: null,
    gapToBelow: null,
    leadBy: null,
    strecken: partial.strecken,
    starters: partial.starters,
  };
}

function compareClubs(a: FassjagdClub, b: FassjagdClub): number {
  if (b.total !== a.total) return b.total - a.total;
  if (b.trailSpielerei !== a.trailSpielerei) return b.trailSpielerei - a.trailSpielerei;
  const fa = Number.isFinite(a.firstReg) ? a.firstReg : Number.MAX_SAFE_INTEGER;
  const fb = Number.isFinite(b.firstReg) ? b.firstReg : Number.MAX_SAFE_INTEGER;
  if (fa !== fb) return fa - fb;
  return a.name.localeCompare(b.name, "de");
}

function decoratePlaces(ranked: FassjagdClub[]): FassjagdClub[] {
  const leader = ranked[0];
  return ranked.map((club, i) => {
    const above = i > 0 ? ranked[i - 1] : null;
    const below = ranked[i + 1] ?? null;
    const gapToLeader = leader ? Math.max(0, leader.total - club.total) : 0;
    return {
      ...club,
      place: i + 1,
      gapToLeader,
      gapToAbove: above ? Math.max(0, above.total - club.total) : null,
      gapToBelow: below ? Math.max(0, club.total - below.total) : null,
      leadBy: i === 0 && below ? Math.max(0, club.total - below.total) : i === 0 ? 0 : null,
    };
  });
}

export function buildFassjagdBoard(
  participants: AnmeldungParticipant[],
  lastUpdated: string,
  now = new Date(),
): FassjagdBoard {
  const overrides = getFassjagdOverrides();
  const frozenByTime = isFassjagdFrozen(now, overrides.manualFreeze);
  if (frozenByTime && overrides.freezeSnapshot) {
    return {
      ...overrides.freezeSnapshot,
      status: "offiziell",
      frozen: true,
      freezeAt: getFassjagdFreezeAt().toISOString(),
    };
  }

  type Acc = {
    name: string;
    starters: (FassjagdStarter & { bib?: number; rrId?: number })[];
    hausherr: boolean;
    ausgeschlossen: boolean;
  };
  const byName = new Map<string, Acc>();
  let ohneAngabe = 0;

  for (const p of participants) {
    const r = resolveVerein(p.verein, overrides.aliases);
    if (r.empty) {
      ohneAngabe += 1;
      continue;
    }
    const extraExcluded = overrides.excluded.includes(r.canonical);
    const excluded = r.isAusrichter || extraExcluded;
    const cur = byName.get(r.canonical) ?? {
      name: r.canonical,
      starters: [],
      hausherr: r.isAusrichter,
      ausgeschlossen: excluded,
    };
    cur.ausgeschlossen = excluded;
    cur.hausherr = cur.hausherr || r.isAusrichter;
    cur.starters.push({
      vorname: p.vorname,
      nachname: p.nachname,
      strecke: p.strecke,
      bib: p.bib,
      rrId: p.rrId,
    });
    byName.set(r.canonical, cur);
  }

  const liveCounts: Record<string, number> = {};
  for (const [name, acc] of byName) liveCounts[name] = acc.starters.length;
  rememberDailyCounts(liveCounts, now);
  const week = weekAgoCounts(now);

  const clubs: FassjagdClub[] = [];
  let hausherr: FassjagdClub | null = null;

  for (const acc of byName.values()) {
    const strecken: Record<string, number> = {};
    let trailSpielerei = 0;
    const starters: FassjagdStarter[] = acc.starters
      .map((s) => {
        strecken[s.strecke] = (strecken[s.strecke] ?? 0) + 1;
        if (TRAIL_SPIELEREI.has(s.strecke)) trailSpielerei += 1;
        return { vorname: s.vorname, nachname: s.nachname, strecke: s.strecke };
      })
      .sort((a, b) => {
        const n = a.nachname.localeCompare(b.nachname, "de");
        if (n !== 0) return n;
        return a.vorname.localeCompare(b.vorname, "de");
      });

    const club = toClub({
      name: acc.name,
      total: acc.starters.length,
      trailSpielerei,
      firstReg: firstRegKey(acc.starters),
      ausgeschlossen: acc.ausgeschlossen,
      hausherr: acc.hausherr,
      strecken,
      starters,
      weekDelta: week
        ? Math.max(0, acc.starters.length - (week[acc.name] ?? 0))
        : 0,
    });

    if (acc.hausherr) hausherr = club;
    if (!acc.ausgeschlossen) clubs.push(club);
  }

  clubs.sort(compareClubs);
  const ranking = decoratePlaces(clubs);
  const names = [...new Set([...ranking.map((c) => c.name), ...(hausherr ? [hausherr.name] : [])])].sort(
    (a, b) => a.localeCompare(b, "de"),
  );

  const board: FassjagdBoard = {
    status: frozenByTime ? "offiziell" : "live",
    freezeAt: getFassjagdFreezeAt().toISOString(),
    frozen: frozenByTime,
    lastUpdated,
    ranking,
    hausherr,
    ohneAngabe,
    names,
  };

  if (frozenByTime) lockFreezeSnapshot(board);

  return board;
}

export function findFassjagdClub(board: FassjagdBoard, slug: string): FassjagdClub | null {
  const ranked = board.ranking.find((c) => c.slug === slug);
  if (ranked) return ranked;
  if (board.hausherr?.slug === slug) return board.hausherr;
  return null;
}
