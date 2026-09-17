import { EVENT } from "@/lib/event-config";
import type { OrgaStats } from "@/lib/orga/types";
import { shirtsGroupedBySize } from "@/lib/orga/stats";
import {
  PdfWriter,
  formatStand,
  footerNote,
  bibLabel,
  CHECKBOX_CELL,
  type Col,
} from "@/lib/orga/pdf-core";
import {
  buildStartunterlagenPdf,
  startunterlagenFilename,
  getStartunterlagenStrecken,
} from "@/lib/orga/pdf-startunterlagen";
import type { StartunterlagenVariant } from "@/lib/orga/startunterlagen";

export { formatStand, footerNote, bibLabel };

export async function pdfTshirtProduktion(stats: OrgaStats): Promise<Uint8Array> {
  const w = new PdfWriter();
  await w.init(footerNote(EVENT.jahr));
  w.title(`Koderlauf ${EVENT.jahr} – T-Shirt Produktion`);
  w.subtitle(`Stand ${formatStand(stats.fetchedAt)} · nur Stückzahlen für die Druckerei`);
  w.paragraph(
    "Keine Namen, keine Mailadressen. Jede ausgefüllte Größe in der Race-Result-Adressliste zählt als ein Shirt.",
  );
  w.heading("Stückliste");
  w.table(
    [
      { key: "size", header: "Größe", width: 200 },
      { key: "count", header: "Anzahl", width: 100, align: "right" },
    ],
    [
      ...stats.tshirtBySize.map((r) => ({
        size: r.size,
        count: String(r.count),
      })),
      { size: "Gesamt", count: String(stats.tshirtTotal) },
    ],
  );
  if (stats.tshirtTotal === 0) {
    w.paragraph("Noch keine T-Shirt-Bestellungen in der Liste.");
  }
  return w.save();
}

export async function pdfTshirtAusgabe(stats: OrgaStats): Promise<Uint8Array> {
  const w = new PdfWriter({
    bodySize: 11,
    headerSize: 10,
    rowHeight: 22,
    lineHeight: 14,
    margin: 42,
  });
  await w.init(footerNote(EVENT.jahr));
  w.title(`Koderlauf ${EVENT.jahr} – T-Shirt Ausgabe`);
  w.subtitle(
    `Stand ${formatStand(stats.fetchedAt)} · ${stats.tshirtTotal} Shirts · nach Größe, dann Name`,
  );
  w.paragraph(
    "Nur Personen mit bestelltem Shirt. Keine Mailadressen. Spalte Startnr. bleibt '-', bis Race Result die Nummern in der Adressliste setzt. Haken zum Abhaken bei der Ausgabe.",
    10,
  );

  const cols: Col[] = [
    { key: "size", header: "Größe", width: 78 },
    { key: "name", header: "Name", width: 290 },
    { key: "bib", header: "Startnr.", width: 82 },
    { key: "ok", header: "Abgeholt", width: 61, checkbox: true },
  ];

  const groups = shirtsGroupedBySize(stats).map((g) => ({
    label: `${g.size}  ·  ${g.count} ${g.count === 1 ? "Shirt" : "Shirts"}`,
    rows: g.rows.map((r) => ({
      size: r.size,
      name: r.name,
      bib: bibLabel(r.bib),
      ok: CHECKBOX_CELL,
    })),
  }));

  w.tableGrouped(cols, groups);
  return w.save();
}

export async function pdfAbendkarten(stats: OrgaStats): Promise<Uint8Array> {
  const w = new PdfWriter({ landscape: true, compact: true });
  await w.init(footerNote(EVENT.jahr));
  w.title(`Koderlauf ${EVENT.jahr} – Abendkarten Tape Jam`);
  w.subtitle(
    `Stand ${formatStand(stats.fetchedAt)} · ${stats.abendkartenTotal} Karten / ${stats.abendkartenPersonen} Personen`,
  );
  w.paragraph(
    "Nur wer eine Abendkarte bestellt hat. Teilnehmer ohne Karte stehen nicht auf dieser Liste. Ausgabe am Sportheim.",
    7.5,
  );
  w.heading("Ausgabe-Liste (alphabetisch)");
  w.table(
    [
      { key: "bib", header: "Startnr.", width: 42 },
      { key: "name", header: "Name", width: 280 },
      { key: "anzahl", header: "Karten", width: 52, align: "right" },
      { key: "ok", header: "Ausgegeben", width: 44, checkbox: true },
    ],
    stats.abendkartenRecipients.map((r) => ({
      bib: bibLabel(r.bib),
      name: r.name,
      anzahl: String(r.anzahl),
      ok: CHECKBOX_CELL,
    })),
  );
  if (stats.abendkartenTotal === 0) {
    w.paragraph("Bisher keine Tape-Jam-Abendkarten in der Adressliste.");
  }
  return w.save();
}

export type OrgaPdfKind =
  | "produktion"
  | "ausgabe"
  | "abendkarten"
  | "start-standard"
  | "start-ausgabe"
  | "start-gesamt";

export async function buildOrgaPdf(
  kind: OrgaPdfKind,
  stats: OrgaStats,
  options?: { strecke?: string },
): Promise<Uint8Array> {
  if (kind === "produktion") return pdfTshirtProduktion(stats);
  if (kind === "ausgabe") return pdfTshirtAusgabe(stats);
  if (kind === "abendkarten") return pdfAbendkarten(stats);
  if (kind === "start-gesamt") return buildStartunterlagenPdf(stats, "gesamt");
  if (kind === "start-ausgabe") {
    if (!options?.strecke) throw new Error("Strecke fehlt");
    return buildStartunterlagenPdf(stats, "ausgabe", options.strecke);
  }
  if (kind === "start-standard") {
    if (!options?.strecke) throw new Error("Strecke fehlt");
    return buildStartunterlagenPdf(stats, "standard", options.strecke);
  }
  throw new Error("Unbekanntes PDF");
}

export function pdfFilename(kind: OrgaPdfKind, options?: { strecke?: string }): string {
  const map: Record<Exclude<OrgaPdfKind, `start-${string}`>, string> = {
    produktion: `koderlauf-${EVENT.jahr}-tshirt-produktion.pdf`,
    ausgabe: `koderlauf-${EVENT.jahr}-tshirt-ausgabe.pdf`,
    abendkarten: `koderlauf-${EVENT.jahr}-abendkarten.pdf`,
  };
  if (kind in map) return map[kind as keyof typeof map];
  if (kind === "start-gesamt") return startunterlagenFilename("gesamt");
  const variant: StartunterlagenVariant =
    kind === "start-ausgabe" ? "ausgabe" : "standard";
  return startunterlagenFilename(variant, options?.strecke);
}

export { getStartunterlagenStrecken };
