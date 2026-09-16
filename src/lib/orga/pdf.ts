import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";
import { EVENT } from "@/lib/event-config";
import type { OrgaStats } from "@/lib/orga/types";
import { shirtsBySizeThenName } from "@/lib/orga/stats";

const A4: [number, number] = [595.28, 841.89];
const MARGIN = 48;
const FOREST = rgb(0.04, 0.24, 0.16);
const ORANGE = rgb(1, 0.42, 0);
const LINE = rgb(0.82, 0.84, 0.86);
const MUTED = rgb(0.35, 0.4, 0.45);
const BLACK = rgb(0.1, 0.1, 0.1);

function winAnsi(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/\u2026/g, "...")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "?");
}

function formatStand(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleString("de-DE", {
    timeZone: "Europe/Berlin",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function wrap(font: PDFFont, text: string, size: number, maxWidth: number): string[] {
  const safe = winAnsi(text);
  if (!safe) return [""];
  const words = safe.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    const next = cur ? `${cur} ${w}` : w;
    if (font.widthOfTextAtSize(next, size) <= maxWidth) {
      cur = next;
    } else {
      if (cur) lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

type Col = { key: string; header: string; width: number; align?: "left" | "right" };

class PdfWriter {
  doc!: PDFDocument;
  font!: PDFFont;
  bold!: PDFFont;
  page!: PDFPage;
  y = 0;
  pageNo = 0;
  footer = "";

  async init(footer: string) {
    this.doc = await PDFDocument.create();
    this.font = await this.doc.embedFont(StandardFonts.Helvetica);
    this.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.footer = footer;
    this.newPage();
  }

  newPage() {
    this.page = this.doc.addPage(A4);
    this.pageNo += 1;
    this.y = A4[1] - MARGIN;
    this.page.drawLine({
      start: { x: MARGIN, y: 36 },
      end: { x: A4[0] - MARGIN, y: 36 },
      thickness: 0.5,
      color: LINE,
    });
    this.page.drawText(winAnsi(this.footer), {
      x: MARGIN,
      y: 22,
      size: 8,
      font: this.font,
      color: MUTED,
    });
    const pn = `Seite ${this.pageNo}`;
    this.page.drawText(pn, {
      x: A4[0] - MARGIN - this.font.widthOfTextAtSize(pn, 8),
      y: 22,
      size: 8,
      font: this.font,
      color: MUTED,
    });
  }

  ensure(h: number) {
    if (this.y - h < 52) this.newPage();
  }

  title(text: string) {
    this.page.drawText(winAnsi(text), {
      x: MARGIN,
      y: this.y - 16,
      size: 16,
      font: this.bold,
      color: FOREST,
    });
    this.y -= 28;
  }

  subtitle(text: string) {
    this.page.drawText(winAnsi(text), {
      x: MARGIN,
      y: this.y - 10,
      size: 10,
      font: this.font,
      color: MUTED,
    });
    this.y -= 18;
  }

  paragraph(text: string, size = 9) {
    const width = A4[0] - MARGIN * 2;
    for (const line of wrap(this.font, text, size, width)) {
      this.ensure(14);
      this.page.drawText(winAnsi(line), {
        x: MARGIN,
        y: this.y - 11,
        size,
        font: this.font,
        color: BLACK,
      });
      this.y -= 14;
    }
  }

  heading(text: string) {
    this.ensure(28);
    this.y -= 8;
    this.page.drawText(winAnsi(text), {
      x: MARGIN,
      y: this.y - 12,
      size: 12,
      font: this.bold,
      color: ORANGE,
    });
    this.y -= 20;
  }

  table(cols: Col[], rows: Record<string, string>[]) {
    const rowH = 16;
    const headerH = 18;
    const drawHeader = () => {
      this.ensure(headerH + 4);
      let x = MARGIN;
      this.page.drawRectangle({
        x: MARGIN - 2,
        y: this.y - headerH,
        width: A4[0] - MARGIN * 2 + 4,
        height: headerH,
        color: rgb(0.94, 0.96, 0.95),
      });
      for (const col of cols) {
        this.page.drawText(winAnsi(col.header), {
          x: x + 2,
          y: this.y - 13,
          size: 8,
          font: this.bold,
          color: FOREST,
        });
        x += col.width;
      }
      this.y -= headerH;
    };

    drawHeader();
    if (rows.length === 0) {
      this.ensure(rowH);
      this.page.drawText(winAnsi("Keine Einträge."), {
        x: MARGIN + 2,
        y: this.y - 12,
        size: 9,
        font: this.font,
        color: MUTED,
      });
      this.y -= rowH;
      return;
    }

    for (const row of rows) {
      const cellLines = cols.map((col) =>
        wrap(this.font, row[col.key] ?? "", 9, col.width - 6),
      );
      const lines = Math.max(1, ...cellLines.map((l) => l.length));
      const h = Math.max(rowH, lines * 12 + 6);
      if (this.y - h < 52) {
        this.newPage();
        drawHeader();
      }
      let x = MARGIN;
      this.page.drawLine({
        start: { x: MARGIN, y: this.y },
        end: { x: A4[0] - MARGIN, y: this.y },
        thickness: 0.3,
        color: LINE,
      });
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        cellLines[i].forEach((line, li) => {
          const tw = this.font.widthOfTextAtSize(winAnsi(line), 9);
          const tx =
            col.align === "right" ? x + col.width - 4 - tw : x + 2;
          this.page.drawText(winAnsi(line), {
            x: tx,
            y: this.y - 12 - li * 12,
            size: 9,
            font: this.font,
            color: BLACK,
          });
        });
        x += col.width;
      }
      this.y -= h;
    }
  }

  async save(): Promise<Uint8Array> {
    return this.doc.save();
  }
}

function footerNote(): string {
  return `Koderlauf ${EVENT.jahr} · intern · Sportheim Obermögersheim`;
}

function bibLabel(bib: string): string {
  return bib || "–";
}

export async function pdfTshirtProduktion(stats: OrgaStats): Promise<Uint8Array> {
  const w = new PdfWriter();
  await w.init(footerNote());
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
  const w = new PdfWriter();
  await w.init(footerNote());
  w.title(`Koderlauf ${EVENT.jahr} – T-Shirt Ausgabe`);
  w.subtitle(
    `Stand ${formatStand(stats.fetchedAt)} · ${stats.tshirtTotal} Shirts · Sportheim / Startnummernausgabe`,
  );
  w.paragraph(
    "Nur Personen mit bestelltem Shirt. Keine Mailadressen. Haken-Spalte zum Abhaken bei der Ausgabe.",
  );

  const paymentCol = stats.fields.payment;
  const colsA: Col[] = [
    { key: "bib", header: "Startnr.", width: 58 },
    { key: "name", header: "Name", width: paymentCol ? 220 : 280 },
    { key: "size", header: "Größe", width: 70 },
    ...(paymentCol
      ? [{ key: "pay", header: "Status", width: 70 } satisfies Col]
      : []),
    { key: "ok", header: "OK", width: 40 },
  ];

  w.heading("A) Alphabetisch (Nachname)");
  w.table(
    colsA,
    stats.tshirtRecipients.map((r) => ({
      bib: bibLabel(r.bib),
      name: r.name,
      size: r.size,
      pay: r.paymentStatus || "–",
      ok: "",
    })),
  );

  w.heading("B) Nach Größe, dann Name (Karton)");
  w.table(
    colsA,
    shirtsBySizeThenName(stats).map((r) => ({
      bib: bibLabel(r.bib),
      name: r.name,
      size: r.size,
      pay: r.paymentStatus || "–",
      ok: "",
    })),
  );
  return w.save();
}

export async function pdfAbendkarten(stats: OrgaStats): Promise<Uint8Array> {
  const w = new PdfWriter();
  await w.init(footerNote());
  w.title(`Koderlauf ${EVENT.jahr} – Abendkarten Tape Jam`);
  w.subtitle(
    `Stand ${formatStand(stats.fetchedAt)} · ${stats.abendkartenTotal} Karten / ${stats.abendkartenPersonen} Personen`,
  );
  w.paragraph(
    "Nur wer eine Abendkarte bestellt hat. Teilnehmer ohne Karte stehen nicht auf dieser Liste. Ausgabe am Sportheim.",
  );
  w.heading("Ausgabe-Liste (alphabetisch)");
  w.table(
    [
      { key: "bib", header: "Startnr.", width: 58 },
      { key: "name", header: "Name", width: 280 },
      { key: "anzahl", header: "Karten", width: 70, align: "right" },
      { key: "ok", header: "OK", width: 40 },
    ],
    stats.abendkartenRecipients.map((r) => ({
      bib: bibLabel(r.bib),
      name: r.name,
      anzahl: String(r.anzahl),
      ok: "",
    })),
  );
  if (stats.abendkartenTotal === 0) {
    w.paragraph("Bisher keine Tape-Jam-Abendkarten in der Adressliste.");
  }
  return w.save();
}

export type OrgaPdfKind = "produktion" | "ausgabe" | "abendkarten";

export async function buildOrgaPdf(kind: OrgaPdfKind, stats: OrgaStats): Promise<Uint8Array> {
  if (kind === "produktion") return pdfTshirtProduktion(stats);
  if (kind === "ausgabe") return pdfTshirtAusgabe(stats);
  return pdfAbendkarten(stats);
}

export function pdfFilename(kind: OrgaPdfKind): string {
  const map: Record<OrgaPdfKind, string> = {
    produktion: `koderlauf-${EVENT.jahr}-tshirt-produktion.pdf`,
    ausgabe: `koderlauf-${EVENT.jahr}-tshirt-ausgabe.pdf`,
    abendkarten: `koderlauf-${EVENT.jahr}-abendkarten.pdf`,
  };
  return map[kind];
}
