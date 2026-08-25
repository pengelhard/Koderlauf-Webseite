/**
 * Zentrale Event-Konfiguration für den Koderlauf.
 *
 * Für eine neue Saison müssen nur die Werte in dieser Datei angepasst werden –
 * Startseite, Metadaten, OG-Image, Anmeldung und Countdown lesen alle von hier.
 */

export interface EventStrecke {
  id: string;
  name: string;
  distanz: string;
  startzeit: string;
  farbe: string;
  gpxFile: string;
  /** Kurzer Zusatz unter dem Namen, z. B. „eigene Wertung“ */
  badge?: string;
  /** Mindestalter in Jahren (Wettkampfjahr) */
  minAlter?: number;
  /** Maximalalter in Jahren (z. B. Kinderlauf) */
  maxAlter?: number;
}

export interface PreisPhase {
  id: "fruehbucher" | "normal" | "spaet" | "vor_ort";
  name: string;
  /** Ende der Phase als ISO-Datum, null = bis Eventtag (nur für vor_ort) */
  bis: string | null;
  hinweis: string;
  kinderlauf: number;
  andere: number;
}

export interface ZeitplanEintrag {
  zeit: string;
  titel: string;
  /** Verweist auf eine Strecke (für Farbe/Icon), sonst allgemeiner Programmpunkt */
  streckeId?: string;
}

export const EVENT = {
  jahr: 2027,
  /** Wievielter Koderlauf (Ausgabe) */
  ausgabe: 2,
  /** Erster Start (Spielerei) */
  datum: "2027-05-29T15:00:00",
  datumFormatiert: "29. Mai 2027",
  datumKurz: "Sa, 29. Mai 2027",
  ort: "Obermögersheim",
  ortDetail: "Sportheim Obermögersheim",
  mapsUrl:
    "https://maps.google.com/?q=Sportheim+Obermögersheim+91717+Wassertrüdingen",
  claim: "Lauf mit Herz durch den Wald",
  /** Steuert Vorverkaufs-Banner und Sticky-CTA */
  anmeldungOffen: true,
  jubilaeum: "50 Jahre SV Obermögersheim",
  kontaktEmail: "info@koderlauf.de",
  /** Online-Anmeldung & Zeitmessung */
  anmeldePartner: {
    name: "RaceSolution",
    url: "https://www.racesolution.de/",
  },
  vorjahr: {
    jahr: 2026,
    anmeldungen: 399,
  },
  strecken: [
    { id: "spielerei", name: "Spielerei", distanz: "25 km", startzeit: "15:00", farbe: "#7C3AED", gpxFile: "/2027-spielerei.gpx", minAlter: 18 },
    { id: "kinderlauf", name: "Kinderlauf", distanz: "800 m", startzeit: "15:10", farbe: "#FF6B00", gpxFile: "/2027-kinderlauf.gpx", maxAlter: 8 },
    { id: "trailrun", name: "Trailrun", distanz: "10,5 km", startzeit: "16:20", farbe: "#3B82F6", gpxFile: "/2027-trailrun.gpx", minAlter: 16 },
    { id: "koderrunde", name: "Koderrunde (Lauf)", distanz: "8,5 km", startzeit: "16:30", farbe: "#EAB308", gpxFile: "/2027-koderrunde.gpx", badge: "eigene Wertung", minAlter: 12 },
    { id: "koderrunde-walking", name: "Koderrunde (Walking)", distanz: "8,5 km", startzeit: "16:30", farbe: "#EAB308", gpxFile: "/2027-koderrunde.gpx", badge: "eigene Wertung", minAlter: 12 },
    { id: "kurz-knackig", name: "Kurz und knackig", distanz: "4 km", startzeit: "16:40", farbe: "#22C55E", gpxFile: "/2027-kurz-knackig.gpx", minAlter: 8 },
  ] satisfies EventStrecke[],
  /**
   * Variante A: hartes Mindestalter; unter 18 immer Eltern-Einverständnis.
   */
  elternEinverstaendnis:
    "Das Mindestalter gilt verbindlich – darunter ist kein Start möglich. Alle Teilnehmerinnen und Teilnehmer unter 18 Jahren brauchen bei der Anmeldung das Einverständnis der Erziehungsberechtigten (Checkbox sowie Name und Telefon der Eltern).",
  zeitplan: [
    { zeit: "13:00", titel: "Startnummernausgabe am Eventtag" },
    { zeit: "15:00", titel: "Start Spielerei", streckeId: "spielerei" },
    { zeit: "15:10", titel: "Start Kinderlauf", streckeId: "kinderlauf" },
    { zeit: "16:20", titel: "Start Trailrun", streckeId: "trailrun" },
    { zeit: "16:30", titel: "Start Koderrunde (Lauf & Walking)", streckeId: "koderrunde" },
    { zeit: "16:40", titel: "Start Kurz und knackig", streckeId: "kurz-knackig" },
    { zeit: "18:30", titel: "Siegerehrung" },
  ] satisfies ZeitplanEintrag[],
  /** Vorab-Ausgabe Startnummern & T-Shirts (empfohlen) */
  startnummernAusgabe: {
    ort: "Sportplatz / Sportheim Obermögersheim",
    termine: [
      { tag: "Donnerstag", datum: "27. Mai 2027", zeit: "17:00–20:00 Uhr" },
      { tag: "Freitag", datum: "28. Mai 2027", zeit: "17:00–20:00 Uhr" },
    ],
    eventtag: "Samstag, 29. Mai 2027 ab 13:00 Uhr",
    hinweis:
      "Empfohlen für alle mit kurzer Anreise: Holt Startnummer und bestellte T-Shirts schon Donnerstag oder Freitag ab – weniger Stress am Eventtag.",
  },
  /** Was in der Startgebühr enthalten ist */
  startgebuehrEnthaelt: [
    "Startnummer mit Timing-Chip",
    "Exklusive KoderMedaille für jeden Finisher",
    "Verpflegung während der Läufe",
    "Verpflegung im Ziel",
  ],
  preise: {
    phasen: [
      { id: "fruehbucher", name: "Frühbucher", bis: "2026-11-30T23:59:59", hinweis: "online bis 30.11.2026", kinderlauf: 5, andere: 8 },
      { id: "normal", name: "Normalpreis", bis: "2027-03-31T23:59:59", hinweis: "online bis 31.03.2027", kinderlauf: 7, andere: 12 },
      { id: "spaet", name: "Spätmeldung", bis: "2027-05-28T23:59:59", hinweis: "online bis 28.05.2027", kinderlauf: 10, andere: 16 },
      { id: "vor_ort", name: "Nachmeldung vor Ort", bis: null, hinweis: "am Eventtag bis 14:30 Uhr am Sportheim", kinderlauf: 15, andere: 21 },
    ] satisfies PreisPhase[],
    /** Senioren ab 70 zahlen auf allen Strecken und in allen Phasen diesen Preis */
    seniorenAb70: 5,
  },
  extras: {
    tshirt: {
      name: "Koderlauf-T-Shirt",
      preis: 25,
      bild: "/tshirt-koderlauf.png",
      hinweis:
        "Motiv vom letzten Jahr – neues Motiv folgt. Größen: 116, 128, 140, 152, 164, S–XXL, 3XL, 4XL.",
    },
    abendkarte: {
      name: "Abendkarte Tape Jam",
      /** Reduzierter Teilnehmerpreis – genauer Betrag folgt nach Abstimmung */
      preisHinweis: "günstiger Teilnehmerpreis",
      beschreibung:
        "Als Läuferin oder Läufer könnt ihr bei der Anmeldung eine günstigere Abendkarte für Tape Jam (Tribute to 80's Rock) mitbestellen – ab 21:30 Uhr am Sportheim.",
    },
  },
};

export function getStrecke(id: string): EventStrecke | undefined {
  return EVENT.strecken.find((s) => s.id === id);
}

/** z. B. „ab 16 Jahre“ / „bis 8 Jahre“ */
export function formatAlterHinweis(strecke: EventStrecke): string | null {
  if (strecke.maxAlter != null) return `bis ${strecke.maxAlter} Jahre`;
  if (strecke.minAlter != null) return `ab ${strecke.minAlter} Jahre`;
  return null;
}

/** Distanz-String ("800 m", "4 km", "10,5 km") in Kilometer für Sortierung. */
export function parseDistanzKm(distanz: string): number {
  const normalized = distanz.replace(",", ".").trim().toLowerCase();
  if (normalized.endsWith(" m")) {
    return parseFloat(normalized) / 1000;
  }
  if (normalized.endsWith(" km")) {
    return parseFloat(normalized);
  }
  return 0;
}

export function getStreckenNachDistanz(): EventStrecke[] {
  return [...EVENT.strecken].sort((a, b) => {
    const byDist = parseDistanzKm(a.distanz) - parseDistanzKm(b.distanz);
    if (byDist !== 0) return byDist;
    return a.name.localeCompare(b.name, "de");
  });
}

/** Strecke mit der frühesten Startzeit (chronologischer erster Start). */
export function getErsterStart(): EventStrecke {
  return EVENT.strecken.reduce((earliest, s) =>
    s.startzeit < earliest.startzeit ? s : earliest
  );
}

export function getAktuellePreisPhase(now: Date = new Date()): PreisPhase {
  for (const phase of EVENT.preise.phasen) {
    if (phase.bis === null || now <= new Date(phase.bis)) return phase;
  }
  return EVENT.preise.phasen[EVENT.preise.phasen.length - 1];
}

export function getAktuellerPreis(streckeId: string, now?: Date): string {
  const phase = getAktuellePreisPhase(now);
  const preis = streckeId === "kinderlauf" ? phase.kinderlauf : phase.andere;
  return `${preis} €`;
}
