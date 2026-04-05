/**
 * Liest src/lib/data/ergebnisse-2026-mwak.csv und schreibt demo-ergebnisse.ts
 * Aufruf: node scripts/generate-demo-ergebnisse.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const csvPath = path.join(root, "src/lib/data/ergebnisse-2026-mwak.csv");
const outPath = path.join(root, "src/lib/data/demo-ergebnisse.ts");

const DISTANCES = new Set(["Kinderlauf", "Koderrunde", "Kurz und knackig", "Trailrun"]);

function akToNr(cell) {
  const m = String(cell || "").match(/AK\s+(.+)/);
  if (!m) return null;
  const label = m[1].trim();
  if (label.startsWith("8")) return 1;
  if (label.startsWith("12")) return 2;
  if (label.startsWith("16")) return 3;
  if (label.startsWith("30")) return 4;
  if (label.startsWith("50")) return 5;
  if (label.startsWith("60")) return 6;
  return null;
}

function normalizeZeit(raw) {
  const s = String(raw).trim();
  const p = s.split(":").map((x) => parseInt(x, 10));
  if (p.length === 2) {
    return `00:${String(p[0]).padStart(2, "0")}:${String(p[1]).padStart(2, "0")}`;
  }
  if (p.length === 3) {
    return `${String(p[0]).padStart(2, "0")}:${String(p[1]).padStart(2, "0")}:${String(p[2]).padStart(2, "0")}`;
  }
  return "00:00:00";
}

function esc(s) {
  return String(s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
}

const text = fs.readFileSync(csvPath, "utf8");
const lines = text.split(/\r?\n/);

let currentDist = null;
let gender = null;
const rows = [];

for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  const parts = line.split(";");
  const col0 = (parts[0] ?? "").trim();

  if (DISTANCES.has(col0)) {
    currentDist = col0;
    gender = null;
    continue;
  }
  if (col0 === "Männlich") {
    gender = "M";
    continue;
  }
  if (col0 === "Weiblich") {
    gender = "W";
    continue;
  }

  if (!currentDist || !gender) continue;

  const platzRaw = (parts[0] ?? "").replace(/\.$/, "").trim();
  const platz = parseInt(platzRaw, 10);
  const bib = parseInt(parts[1], 10);
  const nameRaw = parts[2] ?? "";
  const akCell = parts[5] ?? "";
  const zeitRaw = parts[6] ?? "";

  if (!nameRaw || !zeitRaw || Number.isNaN(bib)) continue;

  const comma = nameRaw.indexOf(",");
  const nachname = comma >= 0 ? nameRaw.slice(0, comma).trim() : nameRaw.trim();
  const vorname = comma >= 0 ? nameRaw.slice(comma + 1).trim() : "";

  const finish_time = normalizeZeit(zeitRaw);
  const ak = currentDist === "Kinderlauf" ? null : akToNr(akCell);
  const rank = Number.isNaN(platz) ? rows.length + 1 : platz;

  rows.push({
    rank,
    bib,
    first_name: vorname,
    last_name: nachname,
    gender,
    distance: currentDist,
    finish_time,
    ak,
  });
}

const linesOut = [
  "/**",
  " * Offizielle Ergebnisse Koderlauf 2026 (MWAk CSV, semikolongetrennt).",
  " * Fallback, wenn die Supabase-Tabelle `results` für 2026 leer ist.",
  " * CSV-Quelle: src/lib/data/ergebnisse-2026-mwak.csv — bei Aktualisierung",
  " * `node scripts/generate-demo-ergebnisse.mjs` erneut ausführen.",
  " * `ak` entspricht ALTERSKLASSEN_KODERLAUF (1–6); Kinderlauf: null.",
  " */",
  "export const ERGEBNISSE_FALLBACK_OFFIZIELL_2026 = true;",
  "",
  "export type DemoErgebnisRow = {",
  "  rank: number;",
  "  bib: number;",
  "  first_name: string;",
  "  last_name: string;",
  "  gender: \"M\" | \"W\";",
  "  distance: string;",
  "  finish_time: string;",
  "  ak: number | null;",
  "};",
  "",
  "export const DEMO_ERGEBNISSE: DemoErgebnisRow[] = [",
];

for (const r of rows) {
  linesOut.push(
    `  { rank: ${r.rank}, bib: ${r.bib}, first_name: '${esc(r.first_name)}', last_name: '${esc(r.last_name)}', gender: '${r.gender}', distance: '${esc(r.distance)}', finish_time: '${r.finish_time}', ak: ${r.ak === null ? "null" : r.ak} },`,
  );
}

linesOut.push("];", "");
fs.writeFileSync(outPath, linesOut.join("\n"), "utf8");
console.log(`Wrote ${rows.length} rows to ${outPath}`);
