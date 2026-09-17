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
import {
  PdfWriter,
  formatStand,
  footerNote,
  bibLabel,
  CHECKBOX_CELL,
  type Col,
} from "@/lib/orga/pdf-core";

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
    sn: CHECKBOX_CELL,
    okShirt: CHECKBOX_CELL,
    okKarte: CHECKBOX_CELL,
  };
}

function rowToAusgabe(r: StartunterlagenRow): Record<string, string> {
  return {
    bib: bibLabel(r.bib),
    nachname: r.nachname,
    vorname: r.vorname,
    jg: r.jahrgang || "–",
    shirt: r.shirt,
    okShirt: CHECKBOX_CELL,
    karte: r.abendkarten,
    okKarte: CHECKBOX_CELL,
    sn: CHECKBOX_CELL,
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
    sn: CHECKBOX_CELL,
    okShirt: CHECKBOX_CELL,
    okKarte: CHECKBOX_CELL,
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
    sn: CHECKBOX_CELL,
    okShirt: CHECKBOX_CELL,
    okKarte: CHECKBOX_CELL,
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
    sn: CHECKBOX_CELL,
    okShirt: CHECKBOX_CELL,
    okKarte: CHECKBOX_CELL,
  };
}

const COLS_STANDARD: Col[] = [
  { key: "bib", header: "Startnr.", width: 34 },
  { key: "nachname", header: "Nachname", width: 100 },
  { key: "vorname", header: "Vorname", width: 76 },
  { key: "jg", header: "Jahrgang", width: 34 },
  { key: "shirt", header: "T-Shirt Größe", width: 44 },
  { key: "karte", header: "Tape Jam", width: 30 },
  { key: "sn", header: "Startnummer", width: 44, checkbox: true },
  { key: "okShirt", header: "T-Shirt", width: 36, checkbox: true },
  { key: "okKarte", header: "Abendkarte", width: 40, checkbox: true },
];

const COLS_AUSGABE: Col[] = [
  { key: "bib", header: "Startnr.", width: 34 },
  { key: "nachname", header: "Nachname", width: 108 },
  { key: "vorname", header: "Vorname", width: 80 },
  { key: "jg", header: "Jahrgang", width: 34 },
  { key: "shirt", header: "T-Shirt Größe", width: 44 },
  { key: "okShirt", header: "T-Shirt", width: 36, checkbox: true },
  { key: "karte", header: "Tape Jam", width: 30 },
  { key: "okKarte", header: "Abendkarte", width: 40, checkbox: true },
  { key: "sn", header: "Startnummer", width: 44, checkbox: true },
];

const COLS_GESAMT: Col[] = [
  { key: "bib", header: "Startnr.", width: 34 },
  { key: "strecke", header: "Strecke", width: 84 },
  { key: "nachname", header: "Nachname", width: 88 },
  { key: "vorname", header: "Vorname", width: 68 },
  { key: "jg", header: "Jahrgang", width: 34 },
  { key: "shirt", header: "T-Shirt Größe", width: 42 },
  { key: "karte", header: "Tape Jam", width: 28 },
  { key: "sn", header: "Startnummer", width: 44, checkbox: true },
  { key: "okShirt", header: "T-Shirt", width: 36, checkbox: true },
  { key: "okKarte", header: "Abendkarte", width: 40, checkbox: true },
];

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
    "In den Spalten Startnummer, T-Shirt und Abendkarte zum Abhaken ausgeben.",
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
      COLS_STANDARD,
      [
        ...rows.map(rowToStandard),
        ...Array.from({ length: NACHMELDUNG_ROWS }, blankStandard),
      ],
    );
  } else {
    w.tableWithDivider(
      COLS_AUSGABE,
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
    "Für den Fall „Ich kenne meine Nummer, aber nicht die Strecke“. Kästchen zum Abhaken bei der Ausgabe.",
    7.5,
  );

  w.table(
    COLS_GESAMT,
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
