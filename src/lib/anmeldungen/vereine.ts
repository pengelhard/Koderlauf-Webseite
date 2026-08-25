/**
 * Vereinsnamen normalisieren + Vereinswertung (Fass Bier).
 * SV Obermögersheim ist Ausrichter und nicht in der Wertung.
 */

export const VEREINS_WERTUNG = {
  preis: "ein Fass Bier",
  ausrichterCanonical: "SV Obermögersheim",
  hinweis:
    "Bei der Anmeldung bitte den offiziellen Vereinsnamen angeben, damit die Zuordnung stimmt. Der Verein mit den meisten Teilnehmern gewinnt ein Fass Bier. SV Obermögersheim ist als Ausrichter nicht in der Wertung.",
} as const;

/** Kanonische Vereinsnamen → bekannte Schreibweisen (kleingeschrieben, normalisiert). */
const VEREIN_ALIASES: Record<string, string[]> = {
  "SV Obermögersheim": [
    "svo",
    "sv o",
    "sv obermogersheim",
    "sv obermögersheim",
    "svo obermogersheim",
    "svo obermögersheim",
    "sportverein obermogersheim",
    "sportverein obermögersheim",
    "sv obermogersheim e.v",
    "sv obermögersheim e.v",
    "sv obermogersheim e.v.",
    "sv obermögersheim e.v.",
    "s.v. obermogersheim",
    "s.v. obermögersheim",
  ],
  // Weitere Vereine bei Bedarf ergänzen, sobald Schreibweisen auftauchen:
  // "TSV Wassertrüdingen": ["tsv wassertrüdingen", "tsv wt", ...],
};

export function normalizeVereinKey(raw: string): string {
  return raw
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // Umlaute → Basisbuchstaben für Matching
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "ss")
    .replace(/e\.?\s*v\.?/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** Alias-Lookup mit normalisierten Keys (ohne Umlaute). */
const ALIAS_TO_CANONICAL = (() => {
  const map = new Map<string, string>();
  for (const [canonical, aliases] of Object.entries(VEREIN_ALIASES)) {
    map.set(normalizeVereinKey(canonical), canonical);
    for (const a of aliases) {
      map.set(normalizeVereinKey(a), canonical);
    }
  }
  return map;
})();

export function resolveVerein(raw: string | undefined | null): {
  display: string;
  canonical: string;
  isAusrichter: boolean;
  empty: boolean;
} {
  const trimmed = (raw ?? "").trim();
  if (!trimmed) {
    return { display: "", canonical: "", isAusrichter: false, empty: true };
  }
  const key = normalizeVereinKey(trimmed);
  const canonical = ALIAS_TO_CANONICAL.get(key) ?? trimmed.replace(/\s+/g, " ").trim();
  const isAusrichter = canonical === VEREINS_WERTUNG.ausrichterCanonical;
  return {
    display: canonical,
    canonical,
    isAusrichter,
    empty: false,
  };
}

export type VereinRankEntry = {
  name: string;
  total: number;
  /** true = Ausrichter, nicht in der Fass-Bier-Wertung */
  ausgeschlossen: boolean;
};

/**
 * Zählt Vereine; sortiert Wertung (ohne Ausrichter) nach Teilnehmerzahl.
 * Ausrichter wird separat zurückgegeben (nur Info).
 */
export function rankVereine(
  participants: { verein?: string }[],
): { ranking: VereinRankEntry[]; ausrichter: VereinRankEntry | null; ohneAngabe: number } {
  const counts = new Map<string, number>();
  let ohneAngabe = 0;

  for (const p of participants) {
    const r = resolveVerein(p.verein);
    if (r.empty) {
      ohneAngabe += 1;
      continue;
    }
    counts.set(r.canonical, (counts.get(r.canonical) ?? 0) + 1);
  }

  let ausrichter: VereinRankEntry | null = null;
  const ranking: VereinRankEntry[] = [];

  for (const [name, total] of counts) {
    const entry: VereinRankEntry = {
      name,
      total,
      ausgeschlossen: name === VEREINS_WERTUNG.ausrichterCanonical,
    };
    if (entry.ausgeschlossen) ausrichter = entry;
    else ranking.push(entry);
  }

  ranking.sort((a, b) => b.total - a.total || a.name.localeCompare(b.name, "de"));
  return { ranking, ausrichter, ohneAngabe };
}
