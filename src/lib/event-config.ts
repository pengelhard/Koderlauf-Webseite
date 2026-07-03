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
  /** Erster Start (Kinderlauf) */
  datum: "2027-05-29T14:30:00",
  datumFormatiert: "29. Mai 2027",
  datumKurz: "Sa, 29. Mai 2027",
  ort: "Obermögersheim",
  ortDetail: "Sportheim Obermögersheim",
  mapsUrl:
    "https://maps.google.com/?q=Sportheim+Obermögersheim+91717+Wassertrüdingen",
  claim: "Lauf mit Herz durch den Wald",
  /** Steuert Vorverkaufs-Banner und Sticky-CTA */
  anmeldungOffen: false,
  jubilaeum: "50 Jahre SV Obermögersheim",
  vorjahr: {
    jahr: 2026,
    anmeldungen: 399,
  },
  strecken: [
    { id: "kinderlauf", name: "Kinderlauf", distanz: "800 m", startzeit: "14:30", farbe: "#FF6B00", gpxFile: "/2027-kinderlauf.gpx" },
    { id: "spielerei", name: "Spielerei", distanz: "24 km", startzeit: "15:00", farbe: "#7C3AED", gpxFile: "/2027-spielerei.gpx" },
    { id: "trailrun", name: "Trailrun", distanz: "10,5 km", startzeit: "15:10", farbe: "#3B82F6", gpxFile: "/2027-trailrun.gpx" },
    { id: "koderrunde", name: "Koderrunde", distanz: "8,5 km", startzeit: "15:20", farbe: "#EAB308", gpxFile: "/2027-koderrunde.gpx" },
    { id: "kurz-knackig", name: "Kurz und knackig", distanz: "4 km", startzeit: "15:30", farbe: "#22C55E", gpxFile: "/2027-kurz-knackig.gpx" },
  ] satisfies EventStrecke[],
  zeitplan: [
    { zeit: "13:00", titel: "Startnummern- & Chipausgabe" },
    { zeit: "14:30", titel: "Start Kinderlauf", streckeId: "kinderlauf" },
    { zeit: "15:00", titel: "Start Spielerei", streckeId: "spielerei" },
    { zeit: "15:10", titel: "Start Trailrun", streckeId: "trailrun" },
    { zeit: "15:20", titel: "Start Koderrunde", streckeId: "koderrunde" },
    { zeit: "15:30", titel: "Start Kurz und knackig", streckeId: "kurz-knackig" },
    { zeit: "19:00", titel: "Siegerehrung" },
  ] satisfies ZeitplanEintrag[],
  preise: {
    phasen: [
      { id: "fruehbucher", name: "Frühbucher", bis: "2026-11-30T23:59:59", hinweis: "online bis 30.11.2026", kinderlauf: 5, andere: 8 },
      { id: "normal", name: "Normalpreis", bis: "2027-03-31T23:59:59", hinweis: "online bis 31.03.2027", kinderlauf: 7, andere: 12 },
      { id: "spaet", name: "Spätmeldung", bis: "2027-05-15T23:59:59", hinweis: "online bis 15.05.2027", kinderlauf: 10, andere: 16 },
      { id: "vor_ort", name: "Nachmeldung vor Ort", bis: null, hinweis: "am Eventtag am Sportheim", kinderlauf: 15, andere: 21 },
    ] satisfies PreisPhase[],
    /** Senioren ab 70 zahlen auf allen Strecken und in allen Phasen diesen Preis */
    seniorenAb70: 5,
  },
};

export function getStrecke(id: string): EventStrecke | undefined {
  return EVENT.strecken.find((s) => s.id === id);
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
