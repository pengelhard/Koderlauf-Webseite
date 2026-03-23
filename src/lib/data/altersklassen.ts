/**
 * Altersklassen Kurz / Koderrunde / Trailrun (Koderlauf).
 * Pro Klasse getrennte Benennung für männlich / weiblich (gleicher Jahrgang & Altersspanne).
 * Maßgeblich bleibt der Jahrgang; Altersspanne ca. am Lauftag (04.04.2026).
 */
export type AltersklasseMeta = {
  nr: 1 | 2 | 3 | 4 | 5 | 6;
  /** Jahrgangsbereich, z. B. "1997 – 2010" oder "bis 1966" */
  jahrgang: string;
  /** Kompakte Altersspanne für die Anzeige, z. B. "16–29" oder "ab 60" */
  alterSpan: string;
};

export const ALTERSKLASSEN_KODERLAUF: readonly AltersklasseMeta[] = [
  { nr: 1, jahrgang: "2015 – 2018", alterSpan: "8–11" },
  { nr: 2, jahrgang: "2011 – 2014", alterSpan: "12–15" },
  { nr: 3, jahrgang: "1997 – 2010", alterSpan: "16–29" },
  { nr: 4, jahrgang: "1977 – 1996", alterSpan: "30–49" },
  { nr: 5, jahrgang: "1967 – 1976", alterSpan: "50–59" },
  { nr: 6, jahrgang: "bis 1966", alterSpan: "ab 60" },
] as const;

/**
 * z. B. "männlich 16–29 (Jg. 1997 – 2010)"
 */
export function formatAkLabel(
  geschlecht: "M" | "W",
  meta: AltersklasseMeta,
): string {
  const prefix = geschlecht === "M" ? "männlich" : "weiblich";
  return `${prefix} ${meta.alterSpan} (Jg. ${meta.jahrgang})`;
}

export function getAltersklasseMeta(nr: number): AltersklasseMeta | undefined {
  return ALTERSKLASSEN_KODERLAUF.find((a) => a.nr === nr);
}
