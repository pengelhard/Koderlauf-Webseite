import { EVENT } from "@/lib/event-config";
import type { OrgaStats } from "@/lib/orga/types";
import {
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

function ausgabeWriter() {
  return new PdfWriter({
    bodySize: 10.5,
    headerSize: 9.5,
    rowHeight: 22,
    lineHeight: 13.5,
    margin: 36,
  });
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

function blankAusgabe(): Record<string, string> {
  return {
    bib: "",
    nachname: "",
    vorname: "",
    jg: "",
    shirt: "",
    okShirt: CHECKBOX_CELL,
    karte: "",
    okKarte: CHECKBOX_CELL,
    sn: CHECKBOX_CELL,
  };
}

/** Hochformat A4: Spaltenbreiten Summe 523 bei Rand 36. */
const COLS_AUSGABE: Col[] = [
  { key: "bib", header: "Startnr.", width: 56 },
  { key: "nachname", header: "Nachname", width: 118 },
  { key: "vorname", header: "Vorname", width: 102 },
  { key: "jg", header: "Jahrgang", width: 42 },
  { key: "shirt", header: "Größe", width: 42 },
  { key: "okShirt", header: "Shirt", width: 36, checkbox: true },
  { key: "karte", header: "Karten", width: 42 },
  { key: "okKarte", header: "Karte", width: 38, checkbox: true },
  { key: "sn", header: "Nr. aus", width: 47, checkbox: true },
];

function writeAusgabeTable(w: PdfWriter, rows: StartunterlagenRow[]) {
  w.tableWithDivider(
    COLS_AUSGABE,
    [...rows.map(rowToAusgabe), ...Array.from({ length: NACHMELDUNG_ROWS }, blankAusgabe)],
    4,
    "Teilnehmer",
    "Ausgabe",
  );
  if (rows.length === 0) {
    w.paragraph("Noch keine Teilnehmer für diese Strecke in der Adressliste.");
  }
}

function writeStreckeHeader(
  w: PdfWriter,
  meta: ReturnType<typeof streckeMeta>,
  stats: OrgaStats,
  summary: ReturnType<typeof summarizeStrecke>,
  extraSubtitle?: string,
) {
  w.title(`Koderlauf ${EVENT.jahr} – Startunterlagen`);
  w.subtitle(
    extraSubtitle
      ? `${meta.label} · ${meta.distanz} · Start ${meta.startzeit} · ${extraSubtitle}`
      : `${meta.label} · ${meta.distanz} · Start ${meta.startzeit} · Ausgabe`,
  );
  w.metaLine(
    `Stand ${formatStand(stats.fetchedAt)} · ${summary.teilnehmer} Teilnehmer · ${summary.shirts} Shirts · ${summary.karten} Abendkarten`,
  );
  w.paragraph(
    "Links Name und Startnummer, rechts Ausgabe zum Abhaken (Shirt, Abendkarte, Startnummer). Die Startnr. bleibt –, bis Race Result die Nummern in der Adressliste setzt. Beim nächsten PDF-Download erscheinen sie automatisch.",
    9.5,
  );
}

export async function pdfStartunterlagenStrecke(
  stats: OrgaStats,
  streckeLabel: string,
): Promise<Uint8Array> {
  const groups = groupStartunterlagen(stats.participants);
  const rows = groups.get(streckeLabel) ?? [];
  const meta = streckeMeta(streckeLabel);
  const summary = summarizeStrecke(rows);

  const w = ausgabeWriter();
  await w.init(footer());
  w.runningHeader = `Koderlauf ${EVENT.jahr} – ${meta.label} Ausgabe`;
  writeStreckeHeader(w, meta, stats, summary);
  writeAusgabeTable(w, rows);
  return w.save();
}

/** Alle B-Ausgaben hintereinander, jede Strecke auf einer neuen Seite. */
export async function pdfStartunterlagenGesamt(stats: OrgaStats): Promise<Uint8Array> {
  const groups = groupStartunterlagen(stats.participants);
  const labels = listStreckenWithParticipants(groups);
  const w = ausgabeWriter();
  await w.init(footer());

  if (labels.length === 0) {
    w.title(`Koderlauf ${EVENT.jahr} – Startunterlagen`);
    w.subtitle("Gesamtliste – alle Strecken");
    w.paragraph("Noch keine Teilnehmer in der Adressliste.");
    return w.save();
  }

  for (let i = 0; i < labels.length; i++) {
    const label = labels[i];
    const rows = groups.get(label) ?? [];
    const meta = streckeMeta(label);
    const summary = summarizeStrecke(rows);

    if (i > 0) {
      w.runningHeader = "";
      w.newPage();
    }
    w.runningHeader = `Koderlauf ${EVENT.jahr} – ${meta.label} Ausgabe`;
    writeStreckeHeader(w, meta, stats, summary, "Gesamtliste");
    writeAusgabeTable(w, rows);
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
  return pdfStartunterlagenStrecke(stats, streckeLabel);
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
  return `koderlauf-${EVENT.jahr}-start-${slug}-ausgabe.pdf`;
}

export function getStartunterlagenStrecken(stats: OrgaStats): string[] {
  return listStreckenWithParticipants(groupStartunterlagen(stats.participants));
}
