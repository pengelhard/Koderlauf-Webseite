import { PDFDocument, StandardFonts, rgb, type PDFFont, type PDFPage } from "pdf-lib";

export const A4_PORTRAIT: [number, number] = [595.28, 841.89];
export const A4_LANDSCAPE: [number, number] = [841.89, 595.28];

const FOREST = rgb(0.04, 0.24, 0.16);
const ORANGE = rgb(1, 0.42, 0);
const LINE = rgb(0.82, 0.84, 0.86);
const MUTED = rgb(0.35, 0.4, 0.45);
const BLACK = rgb(0.1, 0.1, 0.1);

export function winAnsi(text: string): string {
  return text
    .replace(/[\u2013\u2014]/g, "-")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201c\u201d]/g, '"')
    .replace(/\u00a0/g, " ")
    .replace(/\u2026/g, "...")
    .replace(/[^\x09\x0A\x0D\x20-\x7E\xA0-\xFF]/g, "?");
}

export function formatStand(iso: string): string {
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

  const flushLong = (chunk: string) => {
    if (font.widthOfTextAtSize(chunk, size) <= maxWidth) {
      const next = cur ? `${cur} ${chunk}` : chunk;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        cur = next;
        return;
      }
      if (cur) lines.push(cur);
      cur = chunk;
      return;
    }
    if (cur) {
      lines.push(cur);
      cur = "";
    }
    let buf = "";
    for (const ch of chunk) {
      const next = buf + ch;
      if (font.widthOfTextAtSize(next, size) <= maxWidth) {
        buf = next;
      } else {
        if (buf) lines.push(buf);
        buf = ch;
      }
    }
    cur = buf;
  };

  for (const w of words) flushLong(w);
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

export const CHECKBOX_CELL = "\x00cb";

export type Col = {
  key: string;
  header: string;
  width: number;
  align?: "left" | "right";
  /** Leere Zelle wird als Abhak-Kästchen gezeichnet. */
  checkbox?: boolean;
};

export type PdfWriterOptions = {
  landscape?: boolean;
  compact?: boolean;
  margin?: number;
  bodySize?: number;
  headerSize?: number;
  rowHeight?: number;
  lineHeight?: number;
};

export type KvRow = { label: string; value: string };

export class PdfWriter {
  doc!: PDFDocument;
  font!: PDFFont;
  bold!: PDFFont;
  page!: PDFPage;
  y = 0;
  pageNo = 0;
  footer = "";
  /** Wird auf Folgeseiten oben wiederholt. */
  runningHeader = "";
  pageSize: [number, number];
  margin: number;
  compact: boolean;
  bodySize: number;
  headerSize: number;
  rowHeight: number;
  lineHeight: number;

  constructor(options: PdfWriterOptions = {}) {
    this.pageSize = options.landscape ? A4_LANDSCAPE : A4_PORTRAIT;
    this.margin = options.margin ?? 40;
    this.compact = options.compact ?? false;
    this.bodySize = options.bodySize ?? (this.compact ? 7.5 : 9);
    this.headerSize = options.headerSize ?? (this.compact ? 7 : 8);
    this.rowHeight = options.rowHeight ?? (this.compact ? 13 : 16);
    this.lineHeight = options.lineHeight ?? (this.compact ? 10.5 : 12);
  }

  get pageWidth() {
    return this.pageSize[0];
  }

  get pageHeight() {
    return this.pageSize[1];
  }

  get contentWidth() {
    return this.pageWidth - this.margin * 2;
  }

  async init(footer: string) {
    this.doc = await PDFDocument.create();
    this.font = await this.doc.embedFont(StandardFonts.Helvetica);
    this.bold = await this.doc.embedFont(StandardFonts.HelveticaBold);
    this.footer = footer;
    this.newPage();
  }

  newPage() {
    this.page = this.doc.addPage(this.pageSize);
    this.pageNo += 1;
    this.y = this.pageHeight - this.margin;
    this.page.drawLine({
      start: { x: this.margin, y: 32 },
      end: { x: this.pageWidth - this.margin, y: 32 },
      thickness: 0.5,
      color: LINE,
    });
    this.page.drawText(winAnsi(this.footer), {
      x: this.margin,
      y: 18,
      size: 7,
      font: this.font,
      color: MUTED,
    });
    const pn = `Seite ${this.pageNo}`;
    this.page.drawText(pn, {
      x: this.pageWidth - this.margin - this.font.widthOfTextAtSize(pn, 7),
      y: 18,
      size: 7,
      font: this.font,
      color: MUTED,
    });
    if (this.pageNo > 1 && this.runningHeader) {
      this.page.drawText(winAnsi(this.runningHeader), {
        x: this.margin,
        y: this.y - 11,
        size: 10,
        font: this.bold,
        color: FOREST,
      });
      this.y -= 16;
      this.page.drawLine({
        start: { x: this.margin, y: this.y },
        end: { x: this.pageWidth - this.margin, y: this.y },
        thickness: 0.9,
        color: ORANGE,
      });
      this.y -= 12;
    }
  }

  ensure(h: number) {
    if (this.y - h < 48) this.newPage();
  }

  title(text: string) {
    const size = this.compact ? 14 : 16;
    this.page.drawText(winAnsi(text), {
      x: this.margin,
      y: this.y - 14,
      size,
      font: this.bold,
      color: FOREST,
    });
    this.y -= this.compact ? 22 : 28;
  }

  subtitle(text: string) {
    this.page.drawText(winAnsi(text), {
      x: this.margin,
      y: this.y - 9,
      size: this.compact ? 9 : 10,
      font: this.font,
      color: MUTED,
    });
    this.y -= this.compact ? 14 : 18;
  }

  metaLine(text: string) {
    this.page.drawText(winAnsi(text), {
      x: this.margin,
      y: this.y - 9,
      size: 8,
      font: this.font,
      color: MUTED,
    });
    this.y -= 13;
  }

  paragraph(text: string, size?: number) {
    const fs = size ?? this.bodySize;
    const width = this.contentWidth;
    for (const line of wrap(this.font, text, fs, width)) {
      this.ensure(this.lineHeight + 2);
      this.page.drawText(winAnsi(line), {
        x: this.margin,
        y: this.y - fs,
        size: fs,
        font: this.font,
        color: BLACK,
      });
      this.y -= this.lineHeight + 2;
    }
  }

  heading(text: string) {
    this.ensure(24);
    this.y -= 6;
    this.page.drawText(winAnsi(text), {
      x: this.margin,
      y: this.y - 11,
      size: this.compact ? 10.5 : 12,
      font: this.bold,
      color: ORANGE,
    });
    this.y -= this.compact ? 16 : 20;
  }

  /**
   * Firma als Block, darunter beschriftete Kontaktdaten.
   * Passt der Block nicht, folgt eine neue Seite (laufender Header).
   */
  kvBlock(
    title: string,
    rows: KvRow[],
    options?: { index?: number; badge?: string },
  ) {
    const padX = 12;
    const padY = 11;
    const titleSize = 12.5;
    const labelW = 128;
    const valueW = this.contentWidth - padX * 2 - labelW;
    const titleMaxW =
      this.contentWidth - padX * 2 - (options?.badge ? 110 : 0);
    const titleText =
      options?.index != null ? `${options.index}. ${title}` : title;
    const titleLines = wrap(this.bold, titleText, titleSize, titleMaxW);
    const valueLines = rows.map((r) =>
      wrap(this.font, r.value, this.bodySize, valueW),
    );
    const rowHs = valueLines.map((lines) =>
      Math.max(this.lineHeight + 3, lines.length * this.lineHeight + 3),
    );
    const titleH = titleLines.length * (titleSize + 3) + 8;
    const h = padY + titleH + rowHs.reduce((a, b) => a + b, 0) + padY;

    this.ensure(h + 10);

    const boxY = this.y - h;
    this.page.drawRectangle({
      x: this.margin - 2,
      y: boxY,
      width: this.contentWidth + 4,
      height: h,
      color: rgb(0.97, 0.98, 0.97),
      borderColor: LINE,
      borderWidth: 0.6,
    });

    let cursor = this.y - padY;
    titleLines.forEach((line) => {
      this.page.drawText(winAnsi(line), {
        x: this.margin + padX - 4,
        y: cursor - titleSize,
        size: titleSize,
        font: this.bold,
        color: FOREST,
      });
      cursor -= titleSize + 3;
    });

    if (options?.badge) {
      const badge = winAnsi(options.badge);
      const bw = this.bold.widthOfTextAtSize(badge, 8);
      const bx = this.pageWidth - this.margin - padX - bw + 2;
      const by = this.y - padY - 12;
      this.page.drawRectangle({
        x: bx - 5,
        y: by - 3,
        width: bw + 10,
        height: 14,
        color: rgb(1, 0.94, 0.88),
        borderColor: ORANGE,
        borderWidth: 0.5,
      });
      this.page.drawText(badge, {
        x: bx,
        y: by,
        size: 8,
        font: this.bold,
        color: ORANGE,
      });
    }

    cursor -= 6;
    for (let i = 0; i < rows.length; i++) {
      this.page.drawText(winAnsi(rows[i].label), {
        x: this.margin + padX - 4,
        y: cursor - this.bodySize,
        size: this.bodySize,
        font: this.bold,
        color: MUTED,
      });
      valueLines[i].forEach((line, li) => {
        this.page.drawText(winAnsi(line), {
          x: this.margin + padX - 4 + labelW,
          y: cursor - this.bodySize - li * this.lineHeight,
          size: this.bodySize,
          font: this.font,
          color: BLACK,
        });
      });
      cursor -= rowHs[i];
    }

    this.y -= h + 8;
  }

  private headerLines(cols: Col[]): string[][] {
    return cols.map((col) => wrap(this.bold, col.header, this.headerSize, col.width - 4));
  }

  private headerHeight(colLines: string[][]): number {
    const lines = Math.max(1, ...colLines.map((l) => l.length));
    return Math.max(this.compact ? 18 : 22, lines * (this.headerSize + 2) + 6);
  }

  private drawCheckbox(cx: number, cy: number, size?: number) {
    const box = size ?? (this.bodySize >= 11 ? 11 : 9);
    const half = box / 2;
    this.page.drawRectangle({
      x: cx - half,
      y: cy - half,
      width: box,
      height: box,
      borderColor: BLACK,
      borderWidth: 0.75,
    });
  }

  private drawTableCell(
    col: Col,
    value: string,
    x: number,
    rowTop: number,
    rowH: number,
    cellLines: string[],
  ) {
    if (col.checkbox && (!value || value === CHECKBOX_CELL)) {
      this.drawCheckbox(x + col.width / 2, rowTop - rowH / 2);
      return;
    }
    cellLines.forEach((line, li) => {
      const tw = this.font.widthOfTextAtSize(winAnsi(line), this.bodySize);
      const tx = col.align === "right" ? x + col.width - 3 - tw : x + 2;
      this.page.drawText(winAnsi(line), {
        x: tx,
        y: rowTop - this.bodySize - 1 - li * this.lineHeight,
        size: this.bodySize,
        font: this.font,
        color: BLACK,
      });
    });
  }

  table(cols: Col[], rows: Record<string, string>[]) {
    const drawHeader = () => {
      const colLines = this.headerLines(cols);
      const headerH = this.headerHeight(colLines);
      this.ensure(headerH + 4);
      let x = this.margin;
      this.page.drawRectangle({
        x: this.margin - 2,
        y: this.y - headerH,
        width: this.contentWidth + 4,
        height: headerH,
        color: rgb(0.94, 0.96, 0.95),
      });
      for (let i = 0; i < cols.length; i++) {
        const col = colLines[i];
        col.forEach((line, li) => {
          this.page.drawText(winAnsi(line), {
            x: x + 2,
            y: this.y - headerH + 5 + li * (this.headerSize + 2),
            size: this.headerSize,
            font: this.bold,
            color: FOREST,
          });
        });
        x += cols[i].width;
      }
      this.y -= headerH;
    };

    drawHeader();
    if (rows.length === 0) {
      this.ensure(this.rowHeight);
      this.page.drawText(winAnsi("Keine Einträge."), {
        x: this.margin + 2,
        y: this.y - 10,
        size: this.bodySize,
        font: this.font,
        color: MUTED,
      });
      this.y -= this.rowHeight;
      return;
    }

    for (const row of rows) {
      const cellLines = cols.map((col) => {
        const raw = row[col.key] ?? "";
        if (col.checkbox && (!raw || raw === CHECKBOX_CELL)) return [""];
        return wrap(this.font, raw, this.bodySize, col.width - 4);
      });
      const lines = Math.max(1, ...cellLines.map((l) => l.length));
      const h = Math.max(this.rowHeight, lines * this.lineHeight + 4);
      if (this.y - h < 48) {
        this.newPage();
        drawHeader();
      }
      let x = this.margin;
      this.page.drawLine({
        start: { x: this.margin, y: this.y },
        end: { x: this.pageWidth - this.margin, y: this.y },
        thickness: 0.3,
        color: LINE,
      });
      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        this.drawTableCell(col, row[col.key] ?? "", x, this.y, h, cellLines[i]);
        x += col.width;
      }
      this.y -= h;
    }
  }

  groupBanner(text: string) {
    const h = this.bodySize >= 11 ? 24 : this.compact ? 16 : 20;
    this.ensure(h + 10);
    this.y -= 6;
    this.page.drawRectangle({
      x: this.margin - 2,
      y: this.y - h,
      width: this.contentWidth + 4,
      height: h,
      color: FOREST,
    });
    this.page.drawText(winAnsi(text), {
      x: this.margin + 6,
      y: this.y - h + (h - (this.bodySize >= 11 ? 12 : 10)) / 2,
      size: this.bodySize >= 11 ? 12 : this.compact ? 10 : 11,
      font: this.bold,
      color: rgb(1, 1, 1),
    });
    this.y -= h + 2;
  }

  /** Tabellen mit Gruppenköpfen (z. B. T-Shirt-Größe). Header wiederholt sich pro Seite. */
  tableGrouped(cols: Col[], groups: { label: string; rows: Record<string, string>[] }[]) {
    const drawColHeader = () => {
      const colLines = this.headerLines(cols);
      const headerH = this.headerHeight(colLines);
      this.ensure(headerH + 4);
      let x = this.margin;
      this.page.drawRectangle({
        x: this.margin - 2,
        y: this.y - headerH,
        width: this.contentWidth + 4,
        height: headerH,
        color: rgb(0.94, 0.96, 0.95),
      });
      for (let i = 0; i < cols.length; i++) {
        colLines[i].forEach((line, li) => {
          this.page.drawText(winAnsi(line), {
            x: x + 2,
            y: this.y - headerH + 5 + li * (this.headerSize + 2),
            size: this.headerSize,
            font: this.bold,
            color: FOREST,
          });
        });
        x += cols[i].width;
      }
      this.y -= headerH;
    };

    if (groups.length === 0) {
      drawColHeader();
      this.ensure(this.rowHeight);
      this.page.drawText(winAnsi("Keine Einträge."), {
        x: this.margin + 2,
        y: this.y - 10,
        size: this.bodySize,
        font: this.font,
        color: MUTED,
      });
      this.y -= this.rowHeight;
      return;
    }

    for (const group of groups) {
      const colLines = this.headerLines(cols);
      const headerH = this.headerHeight(colLines);
      const bannerH = this.bodySize >= 11 ? 24 : this.compact ? 16 : 20;
      this.ensure(bannerH + headerH + this.rowHeight + 12);
      this.groupBanner(group.label);
      drawColHeader();

      if (group.rows.length === 0) {
        this.ensure(this.rowHeight);
        this.page.drawText(winAnsi("Keine Einträge."), {
          x: this.margin + 2,
          y: this.y - 10,
          size: this.bodySize,
          font: this.font,
          color: MUTED,
        });
        this.y -= this.rowHeight;
        continue;
      }

      for (const row of group.rows) {
        const cellLines = cols.map((col) => {
          const raw = row[col.key] ?? "";
          if (col.checkbox && (!raw || raw === CHECKBOX_CELL)) return [""];
          return wrap(this.font, raw, this.bodySize, col.width - 4);
        });
        const lines = Math.max(1, ...cellLines.map((l) => l.length));
        const h = Math.max(this.rowHeight, lines * this.lineHeight + 6);
        if (this.y - h < 48) {
          this.newPage();
          this.groupBanner(group.label);
          drawColHeader();
        }
        let x = this.margin;
        this.page.drawLine({
          start: { x: this.margin, y: this.y },
          end: { x: this.pageWidth - this.margin, y: this.y },
          thickness: 0.4,
          color: LINE,
        });
        for (let i = 0; i < cols.length; i++) {
          const col = cols[i];
          this.drawTableCell(col, row[col.key] ?? "", x, this.y, h, cellLines[i]);
          x += col.width;
        }
        this.y -= h;
      }
      this.y -= 8;
    }
  }

  /** Zwei Gruppen-Überschriften mit vertikaler Trennlinie (Variante B). */
  tableWithDivider(
    cols: Col[],
    rows: Record<string, string>[],
    dividerAfterCol: number,
    leftLabel: string,
    rightLabel: string,
  ) {
    const drawHeader = () => {
      const colLines = this.headerLines(cols);
      const subHeaderH = this.compact ? 12 : 14;
      const colHeaderH = this.headerHeight(colLines);
      const headerH = subHeaderH + colHeaderH;
      const tableW = cols.reduce((s, c) => s + c.width, 0);
      const leftW = cols.slice(0, dividerAfterCol).reduce((s, c) => s + c.width, 0);

      this.ensure(headerH + 4);
      this.page.drawRectangle({
        x: this.margin - 2,
        y: this.y - headerH,
        width: tableW + 4,
        height: headerH,
        color: rgb(0.94, 0.96, 0.95),
      });

      this.page.drawText(winAnsi(leftLabel), {
        x: this.margin + 4,
        y: this.y - 10,
        size: this.headerSize,
        font: this.bold,
        color: FOREST,
      });
      this.page.drawText(winAnsi(rightLabel), {
        x: this.margin + leftW + 6,
        y: this.y - 10,
        size: this.headerSize,
        font: this.bold,
        color: FOREST,
      });

      let x = this.margin;
      const colHeaderTop = this.y - subHeaderH;
      for (let i = 0; i < cols.length; i++) {
        colLines[i].forEach((line, li) => {
          this.page.drawText(winAnsi(line), {
            x: x + 2,
            y: colHeaderTop - colHeaderH + 5 + li * (this.headerSize + 2),
            size: this.headerSize,
            font: this.bold,
            color: FOREST,
          });
        });
        x += cols[i].width;
      }

      const dividerX = this.margin + leftW;
      this.page.drawLine({
        start: { x: dividerX, y: this.y - headerH },
        end: { x: dividerX, y: this.y },
        thickness: 0.6,
        color: LINE,
      });

      this.y -= headerH;
    };

    drawHeader();

    for (const row of rows) {
      const cellLines = cols.map((col) => {
        const raw = row[col.key] ?? "";
        if (col.checkbox && (!raw || raw === CHECKBOX_CELL)) return [""];
        return wrap(this.font, raw, this.bodySize, col.width - 4);
      });
      const lines = Math.max(1, ...cellLines.map((l) => l.length));
      const h = Math.max(this.rowHeight, lines * this.lineHeight + 4);
      if (this.y - h < 48) {
        this.newPage();
        drawHeader();
      }

      const leftW = cols.slice(0, dividerAfterCol).reduce((s, c) => s + c.width, 0);
      const dividerX = this.margin + leftW;

      let x = this.margin;
      this.page.drawLine({
        start: { x: this.margin, y: this.y },
        end: { x: this.margin + cols.reduce((s, c) => s + c.width, 0), y: this.y },
        thickness: 0.3,
        color: LINE,
      });
      this.page.drawLine({
        start: { x: dividerX, y: this.y },
        end: { x: dividerX, y: this.y - h },
        thickness: 0.4,
        color: LINE,
      });

      for (let i = 0; i < cols.length; i++) {
        const col = cols[i];
        this.drawTableCell(col, row[col.key] ?? "", x, this.y, h, cellLines[i]);
        x += col.width;
      }
      this.y -= h;
    }
  }

  async save(): Promise<Uint8Array> {
    return this.doc.save();
  }
}

export function footerNote(jahr = 0): string {
  const y = jahr || new Date().getFullYear();
  return `Koderlauf ${y} · intern · Sportheim Obermögersheim`;
}

export function bibLabel(bib: string | number | null | undefined): string {
  const s = String(bib ?? "").trim();
  if (!s || /^(0+|unassigned|n\/?a|none|null|-|–|—)$/i.test(s)) return "–";
  return s;
}
