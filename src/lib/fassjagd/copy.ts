import type { FassjagdClub } from "@/lib/fassjagd/types";

export type CardVariant = "lead" | "hunt" | "chase";

export function cardVariant(club: FassjagdClub): CardVariant {
  if (club.place === 1) return "lead";
  if (club.flaming && club.weekDelta > 0) return "chase";
  return "hunt";
}

export function gapHeadline(club: FassjagdClub): string {
  const variant = cardVariant(club);
  if (variant === "lead") return "sitzen auf dem Fass";
  if (variant === "chase") return `+${club.weekDelta} diese Woche`;
  return club.gapToLeader > 0 ? `noch ${club.gapToLeader}` : "noch 0";
}

export function gapLine(club: FassjagdClub): string {
  if (club.place === 1) {
    const lead = club.leadBy ?? 0;
    return lead > 0 ? `führt mit +${lead}` : "führt die Fassjagd an";
  }
  return club.gapToLeader > 0
    ? `noch ${club.gapToLeader} bis zum Fass`
    : "noch 0 bis zum Fass";
}

export function whatsappText(club: FassjagdClub, url: string): string {
  const place = club.place ?? "–";
  const diffPart =
    club.place === 1
      ? club.leadBy && club.leadBy > 0
        ? `führt mit +${club.leadBy}`
        : "sitzen auf dem Fass"
      : `Noch ${club.gapToLeader} bis zum Fass`;
  return `Fassjagd: ${club.name} Platz ${place} · ${club.total} Starter. ${diffPart}. ${url}`;
}

export function dankeText(club: FassjagdClub, starterNr: number): string {
  const place = club.place ?? "–";
  return `Du bist Starter #${starterNr} für ${club.name}. Platz ${place}. ${gapLine(club)}.`;
}
