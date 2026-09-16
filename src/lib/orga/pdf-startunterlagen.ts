import { EVENT } from "@/lib/event-config";
import type { OrgaStats } from "@/lib/orga/types";
import {
  allStartunterlagenRows,
  groupStartunterlagen,
  listStreckenWithParticipants,
  streckeMeta,
  summarizeStrecke,
  type StartunterlagenRow,
  type StartunterlagenVariant,
} from "@/lib/orga/startunterlagen";
import { PdfWriter, formatStand, footerNote, bibLabel } from "@/lib/orga/pdf-core";

function footer(): string {
  return footerNote(EVENT.jahr);
}

const NACHMELDUNG_ROWS = 5;

function rowToStandard(r: StartunterlagenRow): Record<string, string> {
  return {
    bib: bibLabel(r.bib),
    nachname: r.nachname,
    vorname: r.vorname,
    jg: r.jahrgang || "–",
    shirt: r.shirt,
    karte: r.abendkarten,
    sn: "",
    okShirt: "",
    okKarte: "",
  };
}

function rowToAusgabe(r: StartunterlagenRow): Record<string, string> {
  return {
    bib: bibLabel(r.bib),
    nachname: r.nachname,
    vorname: r.vorname,
    jg: r.jahrgang || "–",
    shirt: r.shirt,
    okShirt: "",
    karte: r.abendkarten,
    okKarte: "",
    sn: "",
  };
}

function rowToGesamt(r: StartunterlagenRow): Record<string, string> {
  return {
    bib: bibLabel(r.bib),
    strecke: r.strecke,
    nachname: r.nachname,
    vorname: r.vorname,
    jg: r.jahrgang || "–",
    shirt: r.shirt,
    karte: r.abendkarten,
    sn: "",
    okShirt: "",
    okKarte: "",
  };
}

function blankStandard(): Record<string, string> {
  return {
    bib: "",
    nachname: "",
    vorname: "",
    jg: "",
    shirt: "",
    karte: "",
    sn: "",
    okShirt: "",
    okKarte: "",
  };
}

function blankGesamt(): Record<string, string> {
  return {
    bib: "",
    strecke: "",
    nachname: "",
    vorname: "",
    jg: "",
    shirt: "",
    karte: "",
    sn: "",
    okShirt: "",
    okKarte: "",
  };
}

const COLS_STANDARD = [
  { key: "bib", header: "Nr.", width: 30 },
  { key: "nachname", header: "Nachname", width: 108 },
  { key: "vorname", header: "Vorname", width: 82 },
  { key: "jg", header: "Jg.", width: 26 },
  { key: "shirt", header: "Shirt", width: 34 },
  { key: "karte", header: "Jam", width: 24 },
  { key: "sn", header: "SN", width: 22 },
  { key: "okShirt", header: "S", width: 20 },
  { key: "okKarte", header: "K", width: 20 },
] as const;

const COLS_AUSGABE = [
  { key: "bib", header: "Nr.", width: 30 },
  { key: "nachname", header: "Nachname", width: 118 },
  { key: "vorname", header: "Vorname", width: 88 },
  { key: "jg", header: "Jg.", width: 26 },
  { key: "shirt", header: "Shirt", width: 34 },
  { key: "okShirt", header: "S", width: 20 },
  { key: "karte", header: "Jam", width: 24 },
  { key: "okKarte", header: "K", width: 20 },
  { key: "sn", header: "SN", width: 22 },
] as const;

const COLS_GESAMT = [
  { key: "bib", header: "Nr.", width: 30 },
  { key: "strecke", header: "Strecke", width: 88 },
  { key: "nachname", header: "Nachname", width: 96 },
  { key: "vorname", header: "Vorname", width: 72 },
  { key: "jg", header: "Jg.", width: 26 },
  { key: "shirt", header: "Shirt", width: 32 },
  { key: "karte", header: "Jam", width: 22 },
  { key: "sn", header: "SN", width: 22 },
  { key: "okShirt", header: "S", width: 20 },
  { key: "okKarte", header: "K", width: 20 },
] as const;

async function writeStreckeHeader(
  w: PdfWriter,
  meta: ReturnType<typeof streckeMeta>,
  stats: OrgaStats,
  variantLabel: string,
  summary: ReturnType<typeof summarizeStrecke>,
) {
  w.title(`Koderlauf ${EVENT.jahr} – Startunterlagen`);
  w.subtitle(
    `${meta.label} · ${meta.distanz} · Start ${meta.startzeit} · ${variantLabel}`,
  );
  w.metaLine(
    `Stand ${formatStand(stats.fetchedAt)} · ${summary.teilnehmer} Teilnehmer · ${summary.shirts} Shirts · ${summary.karten} Abendkarten`,
  );
  w.paragraph(
    "Abhaken bei der Ausgabe: SN = Startnummer/Chip, S = T-Shirt, K = Tape-Jam-Karte.",
    7.5,
  );
}

export async function pdfStartunterlagenStrecke(
  stats: OrgaStats,
  streckeLabel: string,
  variant: "standard" | "ausgabe",
): Promise<Uint8Array> {
  const groups = groupStartunterlagen(stats.participants);
  const rows = groups.get(streckeLabel) ?? [];
  const meta = streckeMeta(streckeLabel);
  const summary = summarizeStrecke(rows);

  const w = new PdfWriter({ landscape: true, compact: true });
  await w.init(footer());

  const variantLabel =
    variant === "standard" ? "Variante A – Checkliste" : "Variante B – Ausgabe-Blöcke";

  await writeStreckeHeader(w, meta, stats, variantLabel, summary);

  if (variant === "standard") {
    w.table(
      [...COLS_STANDARD],
      [
        ...rows.map(rowToStandard),
        ...Array.from({ length: NACHMELDUNG_ROWS }, blankStandard),
      ],
    );
  } else {
    w.tableWithDivider(
      [...COLS_AUSGABE],
      [...rows.map(rowToAusgabe), ...Array.from({ length: NACHMELDUNG_ROWS }, blankStandard)],
      4,
      "Identität",
      "Ausgabe",
    );
  }

  if (rows.length === 0) {
    w.paragraph("Noch keine Teilnehmer für diese Strecke in der Adressliste.");
  }

  return w.save();
}

export async function pdfStartunterlagenGesamt(stats: OrgaStats): Promise<Uint8Array> {
  const rows = allStartunterlagenRows(stats.participants);
  const shirts = rows.filter((r) => r.shirt !== "–").length;
  const karten = rows.reduce(
    (sum, r) => sum + (r.abendkarten === "–" ? 0 : Number.parseInt(r.abendkarten, 10) || 0),
    0,
  );

  const w = new PdfWriter({ landscape: true, compact: true });
  await w.init(footer());
  w.title(`Koderlauf ${EVENT.jahr} – Startunterlagen Gesamt`);
  w.subtitle("Variante C – alle Strecken nach Startnummer");
  w.metaLine(
    `Stand ${formatStand(stats.fetchedAt)} · ${rows.length} Teilnehmer · ${shirts} Shirts · ${karten} Abendkarten`,
  );
  w.paragraph(
    "Für den Fall „Ich kenne meine Nummer, aber nicht die Strecke“. SN = Startnummer, S = Shirt, K = Karte.",
    7.5,
  );

  w.table(
    [...COLS_GESAMT],
    [...rows.map(rowToGesamt), ...Array.from({ length: NACHMELDUNG_ROWS }, blankGesamt)],
  );

  if (rows.length === 0) {
    w.paragraph("Noch keine Teilnehmer in der Adressliste.");
  }

  return w.save();
}

export function buildStartunterlagenPdf(
  stats: OrgaStats,
  variant: StartunterlagenVariant,
  streckeLabel?: string,
): Promise<Uint8Array> {
  if (variant === "gesamt") return pdfStartunterlagenGesamt(stats);
  if (!streckeLabel) throw new Error("Strecke fehlt");
  if (variant === "ausgabe") return pdfStartunterlagenStrecke(stats, streckeLabel, "ausgabe");
  return pdfStartunterlagenStrecke(stats, streckeLabel, "standard");
}

export function startunterlagenFilename(
  variant: StartunterlagenVariant,
  streckeLabel?: string,
): string {
  if (variant === "gesamt") {
    return `koderlauf-${EVENT.jahr}-startunterlagen-gesamt.pdf`;
  }
  const slug = streckeLabel
    ?.toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  const suffix = variant === "ausgabe" ? "ausgabe" : "checkliste";
  return `koderlauf-${EVENT.jahr}-start-${slug}-${suffix}.pdf`;
}

export function getStartunterlagenStrecken(stats: OrgaStats): string[] {
  return listStreckenWithParticipants(groupStartunterlagen(stats.participants));
}
