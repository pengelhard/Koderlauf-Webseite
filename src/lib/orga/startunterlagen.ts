import { normalizeContest, STRECKEN_ORDER_2027 } from "@/lib/anmeldungen/aggregate";
import { EVENT, getStrecke, type EventStrecke } from "@/lib/event-config";
import type { OrgaParticipant } from "@/lib/orga/types";

export type StartunterlagenVariant = "ausgabe" | "gesamt";

export interface StartunterlagenRow {
  bib: string;
  nachname: string;
  vorname: string;
  jahrgang: string;
  strecke: string;
  shirt: string;
  abendkarten: string;
  verein: string;
}

export interface StreckeMeta {
  label: string;
  eventStrecke: EventStrecke | null;
  distanz: string;
  startzeit: string;
}

const EVENT_LABEL_BY_ID = new Map(
  EVENT.strecken.map((s) => {
    const label =
      s.id === "koderrunde-walking"
        ? "Koderrunde (Walking)"
        : s.id === "koderrunde"
          ? "Koderrunde (Lauf)"
          : s.name;
    return [s.id, label];
  }),
);

const LABEL_TO_STRECKE_ID: Record<string, string> = {
  Spielerei: "spielerei",
  Kinderlauf: "kinderlauf",
  Trailrun: "trailrun",
  "Koderrunde (Lauf)": "koderrunde",
  "Koderrunde (Walking)": "koderrunde-walking",
  "Kurz und knackig": "kurz-knackig",
};

export function parseBibNumber(bib: string): number {
  const n = Number.parseInt(bib.replace(/\D/g, ""), 10);
  return Number.isFinite(n) ? n : Number.MAX_SAFE_INTEGER;
}

export function streckeMeta(label: string): StreckeMeta {
  const id = LABEL_TO_STRECKE_ID[label];
  const eventStrecke = id ? getStrecke(id) : undefined;
  return {
    label,
    eventStrecke: eventStrecke ?? null,
    distanz: eventStrecke?.distanz ?? "–",
    startzeit: eventStrecke?.startzeit ?? "–",
  };
}

export function toStartunterlagenRow(p: OrgaParticipant): StartunterlagenRow {
  const strecke = normalizeContest(p.wettbewerb) || p.wettbewerb || "Unbekannt";
  return {
    bib: p.bib.trim(),
    nachname: p.nachname.trim(),
    vorname: p.vorname.trim(),
    jahrgang: p.jahrgang.trim(),
    strecke,
    shirt: p.tshirtSize ?? "–",
    abendkarten: p.abendkarten > 0 ? String(p.abendkarten) : "–",
    verein: p.verein.trim(),
  };
}

export function sortByBib(rows: StartunterlagenRow[]): StartunterlagenRow[] {
  return [...rows].sort((a, b) => {
    const d = parseBibNumber(a.bib) - parseBibNumber(b.bib);
    if (d !== 0) return d;
    return a.nachname.localeCompare(b.nachname, "de", { sensitivity: "base" });
  });
}

export function groupStartunterlagen(
  participants: OrgaParticipant[],
): Map<string, StartunterlagenRow[]> {
  const groups = new Map<string, StartunterlagenRow[]>();

  for (const label of STRECKEN_ORDER_2027) {
    groups.set(label, []);
  }
  groups.set("Unbekannt", []);

  for (const p of participants) {
    const row = toStartunterlagenRow(p);
    const key = groups.has(row.strecke) ? row.strecke : "Unbekannt";
    groups.get(key)!.push(row);
  }

  for (const [, rows] of groups) {
    sortByBib(rows);
  }

  return groups;
}

export function listStreckenWithParticipants(
  groups: Map<string, StartunterlagenRow[]>,
): string[] {
  const result: string[] = [];
  for (const label of STRECKEN_ORDER_2027) {
    if ((groups.get(label)?.length ?? 0) > 0) result.push(label);
  }
  if ((groups.get("Unbekannt")?.length ?? 0) > 0) result.push("Unbekannt");
  return result;
}

export function allStartunterlagenRows(
  participants: OrgaParticipant[],
): StartunterlagenRow[] {
  return sortByBib(participants.map(toStartunterlagenRow));
}

export function streckeSlug(label: string): string {
  const id = LABEL_TO_STRECKE_ID[label];
  if (id) return id;
  return label
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function streckeLabelFromSlug(slug: string): string | null {
  for (const [label, id] of Object.entries(LABEL_TO_STRECKE_ID)) {
    if (id === slug) return label;
  }
  if (slug === "unbekannt") return "Unbekannt";
  return null;
}

export function summarizeStrecke(rows: StartunterlagenRow[]) {
  const shirts = rows.filter((r) => r.shirt !== "–").length;
  const karten = rows.reduce(
    (sum, r) => sum + (r.abendkarten === "–" ? 0 : Number.parseInt(r.abendkarten, 10) || 0),
    0,
  );
  return { teilnehmer: rows.length, shirts, karten };
}

/** Kurzform für enge Spalten in der Gesamtliste. */
export function streckeKurz(label: string): string {
  const map: Record<string, string> = {
    Spielerei: "Spiel.",
    Kinderlauf: "Kinder",
    Trailrun: "Trail",
    "Koderrunde (Lauf)": "Koder L",
    "Koderrunde (Walking)": "Koder W",
    "Kurz und knackig": "Kurz",
    Unbekannt: "?",
  };
  return map[label] ?? label.slice(0, 8);
}

export { EVENT_LABEL_BY_ID, LABEL_TO_STRECKE_ID };
