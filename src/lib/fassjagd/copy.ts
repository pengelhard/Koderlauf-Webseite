import type { FassjagdClub } from "@/lib/fassjagd/types";

export type CardVariant = "lead" | "hunt" | "chase";

export function cardVariant(club: FassjagdClub): CardVariant {
  if (club.hausherr) return "hunt";
  if (club.place === 1) return "lead";
  if (club.flaming && club.weekDelta > 0) return "chase";
  return "hunt";
}

/** Jagd-Gap: einer mehr als der Führende, sonst nur Gleichstand. */
export function huntGapText(n: number, capitalize = false): string {
  const noch = capitalize ? "Noch" : "noch";
  if (n === 1) return `${noch} 1 Starter bis zum Fass`;
  return `${noch} ${n} Starter bis zum Fass`;
}

export function gapHeadline(club: FassjagdClub): string {
  if (club.hausherr) return "Hausherr · außer Wertung";
  if (club.place === 1) {
    const lead = club.leadBy ?? 0;
    return lead > 0 ? `führt mit +${lead}` : "Erster Platz";
  }
  return huntGapText(club.gapToLeader);
}

export function gapLine(club: FassjagdClub): string {
  if (club.hausherr) return `${club.total} Starter, nicht in der Wertung`;
  if (club.place === 1) {
    const lead = club.leadBy ?? 0;
    return lead > 0 ? `führt mit +${lead}` : "führt die Fassjagd an";
  }
  return huntGapText(club.gapToLeader);
}

export function weekLine(club: FassjagdClub): string | null {
  if (club.hausherr) return null;
  if (club.weekDelta > 0) return `+${club.weekDelta} diese Woche`;
  return null;
}

function shareDiff(club: FassjagdClub): string {
  if (club.hausherr) return "Hausherr, außer Wertung";
  if (club.place === 1) {
    return club.leadBy && club.leadBy > 0
      ? `führt mit +${club.leadBy}`
      : "Erster Platz";
  }
  return huntGapText(club.gapToLeader, true);
}

export function whatsappText(club: FassjagdClub, url: string): string {
  if (club.hausherr) {
    return `Fassjagd: ${club.name} ist Hausherr und außer Wertung · ${club.total} Starter. ${url}`;
  }
  const place = club.place ?? "–";
  return `Fassjagd: ${club.name} Platz ${place} · ${club.total} Starter. ${shareDiff(club)}. ${url}`;
}

export function instagramCaption(club: FassjagdClub, url: string): string {
  if (club.hausherr) {
    return `Fassjagd 2027 · ${club.name} (Hausherr, außer Wertung) · ${club.total} Starter\n${url}`;
  }
  const place = club.place ?? "–";
  return `Fassjagd 2027 · ${club.name} · Platz ${place} · ${club.total} Starter. ${shareDiff(club)}.\n${url}`;
}

export function dankeText(club: FassjagdClub, starterNr: number): string {
  const place = club.place ?? "–";
  return `Du bist Starter #${starterNr} für ${club.name}. Platz ${place}. ${gapLine(club)}.`;
}
