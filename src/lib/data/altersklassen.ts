/**
 * Altersklassen nach Deutscher Leichtathletik-Ordnung (DLO / DLV).
 * Maßgeblich ist das Geburtsjahr im Wettkampfjahr (hier: EVENT.jahr).
 * Senioren ab M/W 30 in 5-Jahres-Schritten.
 */

import { EVENT } from "@/lib/event-config";

export type AltersklasseMeta = {
  /** Kurzname, z. B. "U16", "M/W 40" */
  name: string;
  /** Altersspanne im Wettkampfjahr */
  alterSpan: string;
  /** Jahrgangsbereich für EVENT.jahr */
  jahrgang: string;
  gruppe: "kinder" | "jugend" | "junioren" | "erwachsene" | "senioren";
};

/** Altersklassen für das aktuelle Eventjahr (DLV, 5er-Schritte bei Senioren). */
export function getAltersklassenDlv(wettkampfJahr: number = EVENT.jahr): AltersklasseMeta[] {
  const y = wettkampfJahr;
  const jg = (fromAge: number, toAge: number) =>
    `${y - toAge} – ${y - fromAge}`;

  return [
    { name: "U8", alterSpan: "6–7", jahrgang: jg(6, 7), gruppe: "kinder" },
    { name: "U10", alterSpan: "8–9", jahrgang: jg(8, 9), gruppe: "kinder" },
    { name: "U12", alterSpan: "10–11", jahrgang: jg(10, 11), gruppe: "kinder" },
    { name: "U14", alterSpan: "12–13", jahrgang: jg(12, 13), gruppe: "jugend" },
    { name: "U16", alterSpan: "14–15", jahrgang: jg(14, 15), gruppe: "jugend" },
    { name: "U18", alterSpan: "16–17", jahrgang: jg(16, 17), gruppe: "jugend" },
    { name: "U20", alterSpan: "18–19", jahrgang: jg(18, 19), gruppe: "jugend" },
    { name: "U23", alterSpan: "20–22", jahrgang: jg(20, 22), gruppe: "junioren" },
    { name: "Männer / Frauen", alterSpan: "23–29", jahrgang: jg(23, 29), gruppe: "erwachsene" },
    ...([30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95] as const).map((age) => ({
      name: `M/W ${age}`,
      alterSpan: age === 95 ? "ab 95" : `${age}–${age + 4}`,
      jahrgang: age === 95 ? `bis ${y - 95}` : jg(age, age + 4),
      gruppe: "senioren" as const,
    })),
  ];
}

/** Kompakte Liste für FAQ / Ausschreibungstext. */
export function formatAltersklassenKurz(wettkampfJahr: number = EVENT.jahr): string {
  return (
    `Jugend U8–U20, Junioren U23, Männer/Frauen sowie Senioren M/W 30–95 ` +
    `in 5-Jahres-Schritten (DLV/DLO, Wettkampfjahr ${wettkampfJahr}). ` +
    `Maßgeblich ist das Geburtsjahr.`
  );
}

/**
 * Legacy-Hilfen für Ergebnisse 2026 (alte 6er-Einteilung).
 * Pro Klasse getrennte Benennung für männlich / weiblich.
 */
export type AltersklasseLegacyMeta = {
  nr: 1 | 2 | 3 | 4 | 5 | 6;
  jahrgang: string;
  alterSpan: string;
};

export const ALTERSKLASSEN_KODERLAUF: readonly AltersklasseLegacyMeta[] = [
  { nr: 1, jahrgang: "2015 – 2018", alterSpan: "8–11" },
  { nr: 2, jahrgang: "2011 – 2014", alterSpan: "12–15" },
  { nr: 3, jahrgang: "1997 – 2010", alterSpan: "16–29" },
  { nr: 4, jahrgang: "1977 – 1996", alterSpan: "30–49" },
  { nr: 5, jahrgang: "1967 – 1976", alterSpan: "50–59" },
  { nr: 6, jahrgang: "bis 1966", alterSpan: "ab 60" },
] as const;

export function formatAkLabel(
  geschlecht: "M" | "W",
  meta: AltersklasseLegacyMeta,
): string {
  const prefix = geschlecht === "M" ? "männlich" : "weiblich";
  return `${prefix} ${meta.alterSpan} (Jg. ${meta.jahrgang})`;
}

export function getAltersklasseMeta(nr: number): AltersklasseLegacyMeta | undefined {
  return ALTERSKLASSEN_KODERLAUF.find((a) => a.nr === nr);
}
