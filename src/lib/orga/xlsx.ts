/**
 * Minimaler XLSX-Reader (erste Tabelle, Shared Strings).
 * Reicht für Race-Result-Simple-API „Adressliste.xlsx“.
 */
import { inflateRawSync } from "zlib";

const LOCAL_SIG = 0x04034b50;
const CD_SIG = 0x02014b50;
const EOCD_SIG = 0x06054b50;

function findEocd(buf: Buffer): number {
  const min = Math.max(0, buf.length - 22 - 0xffff);
  for (let i = buf.length - 22; i >= min; i--) {
    if (buf.readUInt32LE(i) === EOCD_SIG) return i;
  }
  throw new Error("Keine gültige XLSX/ZIP-Datei");
}

function unzip(buf: Buffer): Map<string, Buffer> {
  const eocd = findEocd(buf);
  const cdOffset = buf.readUInt32LE(eocd + 16);
  const cdEntries = buf.readUInt16LE(eocd + 10);
  const out = new Map<string, Buffer>();
  let p = cdOffset;

  for (let i = 0; i < cdEntries; i++) {
    if (buf.readUInt32LE(p) !== CD_SIG) {
      throw new Error("ZIP Central Directory ungültig");
    }
    const method = buf.readUInt16LE(p + 10);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const localOff = buf.readUInt32LE(p + 42);
    const name = buf.subarray(p + 46, p + 46 + nameLen).toString("utf8");
    p += 46 + nameLen + extraLen + commentLen;

    if (buf.readUInt32LE(localOff) !== LOCAL_SIG) {
      throw new Error(`ZIP Local Header fehlt: ${name}`);
    }
    const localNameLen = buf.readUInt16LE(localOff + 26);
    const localExtraLen = buf.readUInt16LE(localOff + 28);
    const dataStart = localOff + 30 + localNameLen + localExtraLen;
    const compressed = buf.subarray(dataStart, dataStart + compSize);

    let data: Buffer;
    if (method === 0) data = Buffer.from(compressed);
    else if (method === 8) data = inflateRawSync(compressed);
    else throw new Error(`ZIP-Kompression ${method} nicht unterstützt (${name})`);

    out.set(name, data);
  }
  return out;
}

function stripNs(xml: string): string {
  return xml
    .replace(/xmlns(:\w+)?="[^"]*"/g, "")
    .replace(/<\/?[A-Za-z0-9._-]+:/g, (m) => m.replace(/[A-Za-z0-9._-]+:/, ""));
}

function decodeXmlText(s: string): string {
  return s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

function parseSharedStrings(xml: string): string[] {
  const clean = stripNs(xml);
  const out: string[] = [];
  const siRe = /<si\b[^>]*>([\s\S]*?)<\/si>/g;
  let m: RegExpExecArray | null;
  while ((m = siRe.exec(clean))) {
    const texts: string[] = [];
    const tRe = /<t\b[^>]*>([\s\S]*?)<\/t>/g;
    let t: RegExpExecArray | null;
    while ((t = tRe.exec(m[1]))) texts.push(decodeXmlText(t[1]));
    out.push(texts.join(""));
  }
  return out;
}

function colIndex(ref: string): number {
  const letters = ref.replace(/[0-9]/g, "");
  let n = 0;
  for (const c of letters) n = n * 26 + (c.toUpperCase().charCodeAt(0) - 64);
  return n - 1;
}

function cellText(cellXml: string, shared: string[]): string {
  const type = /\bt="([^"]+)"/.exec(cellXml)?.[1];
  if (type === "inlineStr") {
    const t = /<t\b[^>]*>([\s\S]*?)<\/t>/.exec(cellXml);
    return t ? decodeXmlText(t[1]) : "";
  }
  const v = /<v\b[^>]*>([\s\S]*?)<\/v>/.exec(cellXml);
  if (!v) return "";
  const raw = decodeXmlText(v[1]);
  if (type === "s") {
    const i = Number.parseInt(raw, 10);
    return Number.isFinite(i) ? (shared[i] ?? "") : "";
  }
  return raw;
}

function parseSheet(xml: string, shared: string[]): string[][] {
  const clean = stripNs(xml);
  const rows: string[][] = [];
  const rowRe = /<row\b[^>]*>([\s\S]*?)<\/row>/g;
  let rm: RegExpExecArray | null;
  while ((rm = rowRe.exec(clean))) {
    const cells: Record<number, string> = {};
    let max = -1;
    const cellRe = /<c\b([^>]*)>([\s\S]*?)<\/c>|<c\b([^>]*)\/>/g;
    let cm: RegExpExecArray | null;
    while ((cm = cellRe.exec(rm[1]))) {
      const attrs = cm[1] || cm[3] || "";
      const body = cm[2] || "";
      const ref = /\br="([^"]+)"/.exec(attrs)?.[1];
      if (!ref) continue;
      const idx = colIndex(ref);
      max = Math.max(max, idx);
      cells[idx] = cellText(`<c ${attrs}>${body}</c>`, shared);
    }
    if (max < 0) {
      rows.push([]);
      continue;
    }
    const line: string[] = [];
    for (let i = 0; i <= max; i++) line.push(cells[i] ?? "");
    rows.push(line);
  }
  return rows;
}

export function parseXlsxSheet(buffer: Buffer | Uint8Array): string[][] {
  const buf = Buffer.isBuffer(buffer) ? buffer : Buffer.from(buffer);
  const files = unzip(buf);
  const sharedXml = files.get("xl/sharedStrings.xml");
  const shared = sharedXml ? parseSharedStrings(sharedXml.toString("utf8")) : [];
  const sheet =
    files.get("xl/worksheets/sheet1.xml") ??
    [...files.keys()]
      .filter((k) => k.startsWith("xl/worksheets/sheet") && k.endsWith(".xml"))
      .sort()
      .map((k) => files.get(k))[0];
  if (!sheet) throw new Error("XLSX ohne Tabelle");
  return parseSheet(sheet.toString("utf8"), shared);
}
