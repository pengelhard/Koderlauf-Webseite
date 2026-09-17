/** Sponsoring-Konzept Koderlauf 2027 – Beitragsbänder + Flächen-Inventar. */

export type Beitragsband = "partner" | "foerderer" | "hauptsponsor";
export type AnfrageWeg = "partner" | "beitrag" | "flaeche";
export type FlaecheStatus = "offen" | "reserviert" | "vergeben";
export type Beitragsart = "geld" | "sach" | "beides";

export const SPONSORING_2027 = {
  partnerPreis: 150,
  foerdererAb: 300,
  hauptsponsorAb: 500,
  hauptsponsorMax: 5,
  kontaktEmail: "info@koderlauf.de",
  fairnessSatz:
    "Status folgt dem Beitrag ab 150 / 300 / 500 €. Fläche ist extra. 500 € Cash ohne freie Medaille = gleicher Rang wie eine Medaillen-Hälfte – aber nicht dasselbe Band-Logo.",
  premiere2026: {
    anmeldungen: 400,
    finisher: 378,
    ortsteilEinwohner: 550,
  },
} as const;

export const BAND_LABEL: Record<Beitragsband, string> = {
  partner: "Partner",
  foerderer: "Förderer",
  hauptsponsor: "Hauptsponsor",
};

export const STATUS_LABEL: Record<FlaecheStatus, string> = {
  offen: "OFFEN",
  reserviert: "RESERVIERT",
  vergeben: "VERGEBEN",
};

const FLAECHE_ID_ALIASES: Record<string, string> = {
  "bauzaun-feld": "bauzaun-stellen",
  "bauzaun-einzelfeld": "bauzaun-stellen",
  "bauzaun-buendel": "bauzaun-stellen",
  siegerpreise: "preise",
};

const KOMPLETT_HAELFTE: Record<string, [string, string]> = {
  medaillen: ["medaillen-a", "medaillen-b"],
  preise: ["preise-1", "preise-2"],
};

const STUFE_ALIASES: Record<string, Beitragsband> = {
  sachpartner: "foerderer",
};

export const SPONSOR_BANDER: {
  id: Beitragsband;
  name: string;
  preisLabel: string;
  kurz: string;
  leistungen: string[];
  flaecheHinweis: string;
  ctaHref: string;
  ctaLabel: string;
}[] = [
  {
    id: "partner",
    name: "Partner",
    preisLabel: "ab 150 €",
    kurz: "Sichtbarkeit ohne Exklusivfläche – beliebig viele Partner.",
    leistungen: [
      "1× Zaunbanner",
      "1× Gitterbanner am Zieleinlauf",
      "Erwähnung auf der Website",
      "Verlinkung auf Instagram",
    ],
    flaecheHinweis: "Keine Exklusivfläche am Gegenstand.",
    ctaHref: "/sponsor-werden?stufe=partner#anfrage",
    ctaLabel: "Partner werden",
  },
  {
    id: "foerderer",
    name: "Förderer",
    preisLabel: "ab 300 €",
    kurz: "Partner-Paket plus größeres Logo auf der Sponsoren-Seite und klarer Dank.",
    leistungen: [
      "Alles wie Partner",
      "Größere Nennung auf der Sponsoren-Seite",
      "Klarer Dank in der Kommunikation",
      "Fläche optional, wenn noch eine passende offen ist",
    ],
    flaecheHinweis: "Fläche optional – nicht Pflicht.",
    ctaHref: "/sponsor-werden?stufe=foerderer#anfrage",
    ctaLabel: "Förderer anfragen",
  },
  {
    id: "hauptsponsor",
    name: "Hauptsponsor",
    preisLabel: "ab 500 €",
    kurz: "Partner-Paket plus große Nennung und Dank bei der Siegerehrung.",
    leistungen: [
      "Alles wie Partner",
      "Prominente Nennung auf der Website",
      "Dank bei der Siegerehrung",
      "Fläche optional, wenn noch eine passende offen ist",
    ],
    flaecheHinweis:
      "Fläche optional – Geld ohne lieferbare Sache ist erlaubt. Max. 5 Hauptsponsoren (Medaillen-Hälften zählen bewusst separat).",
    ctaHref: "/sponsor-werden?stufe=hauptsponsor#anfrage",
    ctaLabel: "Hauptsponsor anfragen",
  },
];

export const BAND_VERGLEICH: {
  leistung: string;
  partner: string;
  foerderer: string;
  hauptsponsor: string;
}[] = [
  { leistung: "Website-Nennung", partner: "klein", foerderer: "groß", hauptsponsor: "prominent" },
  { leistung: "Instagram", partner: "ja", foerderer: "ja", hauptsponsor: "ja" },
  { leistung: "Banner-Paket Zaun+Ziel", partner: "ja", foerderer: "ja", hauptsponsor: "ja" },
  { leistung: "Dank Siegerehrung", partner: "nein", foerderer: "kurz möglich", hauptsponsor: "ja" },
  {
    leistung: "Exklusivfläche",
    partner: "nein",
    foerderer: "optional wenn offen",
    hauptsponsor: "optional wenn offen",
  },
  { leistung: "Titel", partner: "Partner", foerderer: "Förderer", hauptsponsor: "Hauptsponsor" },
  {
    leistung: "Gegenwert",
    partner: "ab 150 €",
    foerderer: "ab 300 €",
    hauptsponsor: "ab 500 €",
  },
  { leistung: "Sache nötig?", partner: "nein", foerderer: "nein", hauptsponsor: "nein" },
  {
    leistung: "Geht, wenn alle Flächen weg sind?",
    partner: "ja",
    foerderer: "ja, über Restkosten",
    hauptsponsor: "ja, über Restkosten",
  },
];

export const SPONSOR_SO_FUNKTIONIERT = [
  { schritt: "1", titel: "Band wählen", text: "150 €, 300 € oder ab 500 € – Geld oder Sache." },
  {
    schritt: "2",
    titel: "Optional Fläche dazu",
    text: "Eine offene Fläche übernehmen – oder Restkosten, wenn das Inventar voll ist.",
  },
  {
    schritt: "3",
    titel: "Anfrage senden",
    text: "Der Verein klärt Beschaffung, Logo-Formate und Rechnung.",
  },
];

export interface SponsorFlaeche {
  id: string;
  titel: string;
  kurz: string;
  werbungKurz: string;
  badgeLabel: string;
  beschreibung: string;
  werbung: string;
  festpreis: number;
  vorgeschlagenesBand: Beitragsband;
  minBand: Beitragsband;
  aufteilbar?: string;
  hinweis?: string;
  status: FlaecheStatus;
  /** Komplett-Slot mit zwei Hälften. */
  komplettHaelften?: [string, string];
  /** Hälfte eines Komplett-Slots. */
  halfteVon?: string;
  /** Mehrere Firmen möglich (Restkosten). */
  mehrereMoeglich?: boolean;
}

export const SPONSOR_FLAECHEN: SponsorFlaeche[] = [
  {
    id: "medaillen",
    titel: "Medaillen (Komplett)",
    kurz: "Finisher-Medaille inkl. Band und Aufkleber für ca. 500 Starter plus Reserve.",
    werbungKurz: "Logo auf Band und Aufkleber.",
    badgeLabel: "1.000 € · Hauptsponsor · Komplett",
    beschreibung:
      "Finisher-Medaille inkl. Band und Aufkleber. Kalkulation: 500 Starter, Festpreis. Komplett buchen setzt Hälfte A und B auf VERGEBEN.",
    werbung: "Logo auf dem Medaillenband und auf dem Aufkleber.",
    festpreis: 1000,
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    komplettHaelften: ["medaillen-a", "medaillen-b"],
    hinweis: "Eine Firma darf auch beide Hälften buchen. Zwei Firmen können je eine Hälfte nehmen.",
    status: "offen",
  },
  {
    id: "medaillen-a",
    titel: "Medaillen – Hälfte A",
    kurz: "Logo auf dem Medaillenband für alle Finisher.",
    werbungKurz: "Logo auf dem Band.",
    badgeLabel: "500 € · Hauptsponsor · Hälfte A",
    beschreibung: "Hälfte A der Medaillen-Fläche – Logo auf dem Band.",
    werbung: "Logo auf dem Medaillenband.",
    festpreis: 500,
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    halfteVon: "medaillen",
    status: "offen",
  },
  {
    id: "medaillen-b",
    titel: "Medaillen – Hälfte B",
    kurz: "Logo auf dem Medaillen-Aufkleber.",
    werbungKurz: "Logo auf dem Aufkleber.",
    badgeLabel: "500 € · Hauptsponsor · Hälfte B",
    beschreibung: "Hälfte B der Medaillen-Fläche – Logo auf dem Aufkleber.",
    werbung: "Logo auf dem Aufkleber.",
    festpreis: 500,
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    halfteVon: "medaillen",
    status: "offen",
  },
  {
    id: "preise",
    titel: "Siegerpreise (Komplett)",
    kurz: "6 Läufe × Platz 1–3: Spielerei, Kinderlauf, Trailrun, Koderrunde Lauf, Koderrunde Walking, Kurz und knackig.",
    werbungKurz: "Übergabe, Nennung, Foto – alle 6 Läufe.",
    badgeLabel: "500 € · Hauptsponsor · Komplett",
    beschreibung:
      "Sachpreise oder Gutscheine für alle sechs Läufe. Komplett buchen setzt Paket 1 und 2 auf VERGEBEN.",
    werbung: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    festpreis: 500,
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    komplettHaelften: ["preise-1", "preise-2"],
    hinweis: "Eine Firma darf beide Pakete nehmen. Zwei Firmen können je ein Paket buchen.",
    status: "offen",
  },
  {
    id: "preise-1",
    titel: "Siegerpreise – Paket 1",
    kurz: "Spielerei, Trailrun, Koderrunde Lauf.",
    werbungKurz: "Übergabe, Nennung, Foto.",
    badgeLabel: "300 € · Förderer",
    beschreibung: "Sachpreise für Spielerei, Trailrun und Koderrunde Lauf.",
    werbung: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    festpreis: 300,
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "preise-2",
    titel: "Siegerpreise – Paket 2",
    kurz: "Kinderlauf, Koderrunde Walking, Kurz und knackig.",
    werbungKurz: "Übergabe, Nennung, Foto.",
    badgeLabel: "300 € · Förderer",
    beschreibung: "Sachpreise für Kinderlauf, Koderrunde Walking und Kurz und knackig.",
    werbung: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    festpreis: 300,
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "zielverpflegung",
    titel: "Zielverpflegung",
    kurz: "Getränk und Kleinigkeit direkt nach dem Zieleinlauf.",
    werbungKurz: "Schild oder Theke am Ziel.",
    badgeLabel: "500 € · Hauptsponsor · nicht teilbar",
    beschreibung: "Getränk und Kleinigkeit am Ziel. Ziel-Bier ist ein eigener Posten. Nicht splitten.",
    werbung: "Schild oder Theke am Ziel.",
    festpreis: 500,
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    status: "offen",
  },
  {
    id: "ziel-bier",
    titel: "Ziel-Bier",
    kurz: "Ein Bier (o. ä.) für jeden Finisher am Ziel. Kinderlauf ausgenommen.",
    werbungKurz: "Zapfstelle oder Schild „Zielbier präsentiert von …“.",
    badgeLabel: "400 € · Förderer",
    beschreibung: "Ein Bier für jeden Finisher am Ziel. Kinderlauf ausgenommen.",
    werbung: "Zapfstelle/Schild „Zielbier präsentiert von …“.",
    festpreis: 400,
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    hinweis: "Alkohol nur für Erwachsene.",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    kurz: "Druck der Startnummern für alle Starter plus Reserve (ohne Timing-Chip).",
    werbungKurz: "Logo unten auf der Startnummer – exklusiv.",
    badgeLabel: "300 € · Förderer",
    beschreibung: "Druck der Startnummern für alle Starter plus Reserve. Ohne Zeitnahme-Chip.",
    werbung: "Logo unten auf der Startnummer – exklusiv.",
    festpreis: 300,
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    hinweis: "Standard: Verein bestellt.",
    status: "offen",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen",
    kurz: "Start-/Zielbogen mit eigenem Branding – sehr fotogen.",
    werbungKurz: "Großes Logo auf dem Zielbogen.",
    badgeLabel: "300 € · Förderer",
    beschreibung: "Start-/Zielbogen mit Branding. 2026: Jeremias am Start-/Zielbogen.",
    werbung: "Großes Logo auf dem Bogen – sehr sichtbar auf Fotos.",
    festpreis: 300,
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    hinweis:
      "Logo nur bei eigenem/gebrandetem Bogen. Neutralleihe ohne Individualwerbung = Restkosten.",
    status: "offen",
  },
  {
    id: "bauzaun-stellen",
    titel: "Bauzaun stellen",
    kurz: "Eine Firma stellt 60 Zaunelemente und 70 Gitter – alle Sponsoren bekommen trotzdem Platz.",
    werbungKurz: "Logo auf dem Bauzaun; HS groß, Förderer mittel, Partner 1 Banner.",
    badgeLabel: "300 € · Förderer · Sachleistung",
    beschreibung:
      "Eine Firma stellt 60 Zaunelemente und 70 Gitter. Alle anderen Sponsoren bekommen trotzdem Platz am Bauzaun.",
    werbung: "Logo am Bauzaun – Größe nach Band (HS groß, Förderer mittel, Partner 1 Banner).",
    festpreis: 300,
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    hinweis: "Sachleistung zählt als Gegenwert. Wer stellt, zahlt nicht bar nach.",
    status: "offen",
  },
  {
    id: "streckenverpflegung",
    titel: "Streckenverpflegung",
    kurz: "Wasser, Iso, Obst und Becher an der/den Station(en).",
    werbungKurz: "Schild „Verpflegung präsentiert von …“ an der Station.",
    badgeLabel: "300 € · Förderer",
    beschreibung: "Verpflegung an einer oder mehreren Stationen.",
    werbung: "Schild an der Station.",
    festpreis: 300,
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    aufteilbar:
      "Optional zwei Stationen à 150 € – dann Partner-Paket plus Fläche an der Station.",
    status: "offen",
  },
  {
    id: "restkosten",
    titel: "Lauf ermöglichen (Restkosten)",
    kurz: "Zeitnahme, Sanitäter, Streckenmarkierung, Reserve, Kinderlauf-Unkosten.",
    werbungKurz: "Nennung als Sponsor – kein Logo am Gegenstand.",
    badgeLabel: "150 / 300 / 500 € → passendes Band",
    beschreibung:
      "Zeitnahme, Sanitäter, Streckenmarkierung, Reserve, Kinderlauf-Unkosten. Kein fotogenes Logo – ehrlicher Cash-Weg.",
    werbung: "Nennung auf der Website und in der Kommunikation.",
    festpreis: 300,
    vorgeschlagenesBand: "foerderer",
    minBand: "partner",
    hinweis: "Pakete 150 € (Partner), 300 € (Förderer) oder 500 € (Hauptsponsor). Mehrere möglich.",
    status: "offen",
    mehrereMoeglich: true,
  },
];

export const SPONSOR_FALLBEISPIELE: { titel: string; text: string }[] = [
  {
    titel: "Wir wollen Hauptsponsor sein, können aber nichts liefern.",
    text:
      "Ja. Ab 500 € Gegenwert – oder ihr zahlt eine Medaillen-Hälfte und der Verein bestellt. Titel ja. Logo auf dem Band nur, wenn die Fläche noch frei ist.",
  },
  {
    titel: "Alle Flächen sind vergeben.",
    text: "Beitrag über Restkosten. Gleicher Rang möglich. Der Verein meldet sich, welches Band passt.",
  },
  {
    titel: "Wir stellen den Bauzaun (300 €).",
    text:
      "Ihr seid Sponsor mit der Fläche Bauzaun – das ist die Anerkennung. Partner-Paket 150 € zusätzlich für Zaun- und Gitterbanner möglich.",
  },
];

export const SPONSOR_FAQ: { frage: string; antwort: string }[] = [
  {
    frage: "Muss ich nachzahlen, wenn ich die Sache stelle?",
    antwort: "Nein. Wer die Sache stellt, zahlt nicht bar nach. Der Gegenwert zählt für euer Band.",
  },
  {
    frage: "Wann ist eine Fläche vergeben?",
    antwort: "Bei Zusage wechselt der Status auf VERGEBEN – öffentlich auf dieser Seite.",
  },
  {
    frage: "Können zwei Firmen eine Fläche teilen?",
    antwort:
      "Ja, wo Hälften existieren (Medaillen, Siegerpreise). Eine Firma darf auch beide Hälften nehmen. Komplett-Buchung sperrt beide Hälften.",
  },
  {
    frage: "Hauptsponsor ohne Fläche?",
    antwort: "Ja, ab 500 € Gegenwert. Geld ohne lieferbare Sache ist ausdrücklich erlaubt.",
  },
  {
    frage: "Kann ich nur eine Verpflegungsstation nehmen?",
    antwort:
      "Ja. Streckenverpflegung optional als zwei Stationen à 150 € – dann Partner plus Fläche an der Station.",
  },
  {
    frage: "Gibt es Fotos nach dem Lauf?",
    antwort: "Ausgewählte Fotos eurer Fläche, soweit vorhanden. Keine Aftermovie-Garantie.",
  },
  {
    frage: "Was ist der Unterschied zwischen Band und Fläche?",
    antwort:
      "Das Band (150 / 300 / 500 €) bestimmt Rang und Sichtbarkeitspaket. Die Fläche ist knappes Inventar – Logo am Gegenstand, Festpreis pro Slot.",
  },
  {
    frage: "Warum ist 300 € Zaun nicht gleich 500 € Medaillen-Hälfte?",
    antwort:
      "Rang folgt dem Euro-Gegenwert im Band. Die Fläche folgt dem Inventar. Beides ist wertvoll – nur anders sichtbar.",
  },
  {
    frage: "Wer bestellt Medaillen, Bogen und Startnummern?",
    antwort:
      "Standard: der Verein kauft und organisiert, ihr zahlt den Festpreis. Sache liefern nur nach Absprache.",
  },
];

export const SPONSOR_ABLAUF = [
  {
    schritt: "1",
    titel: "Band wählen (und optional Fläche)",
    text: "150 €, 300 € oder ab 500 € – plus Fläche, wenn ihr wollt.",
  },
  { schritt: "2", titel: "Geld, Sache oder beides", text: "Kurz formulieren – wir klären Details per Mail." },
  {
    schritt: "3",
    titel: "Verein meldet sich",
    text: "Rückfragen, Logo-Formate, Rechnungsadresse, Liefer-/Drucktermin falls Sache.",
  },
];

const BAND_RANK: Record<Beitragsband, number> = {
  partner: 1,
  foerderer: 2,
  hauptsponsor: 3,
};

export function normalizeFlaecheId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return FLAECHE_ID_ALIASES[id] ?? id;
}

/** @deprecated Alias – nutzt flaeche oder legacy posten. */
export function normalizePostenId(id: string | null | undefined): string | undefined {
  return normalizeFlaecheId(id);
}

export function normalizeStufe(stufe: string | null | undefined): Beitragsband | undefined {
  if (!stufe) return undefined;
  if (stufe in STUFE_ALIASES) return STUFE_ALIASES[stufe];
  if (stufe === "partner" || stufe === "foerderer" || stufe === "hauptsponsor") {
    return stufe;
  }
  return undefined;
}

export function getFlaeche(id: string | null | undefined): SponsorFlaeche | undefined {
  const normalized = normalizeFlaecheId(id);
  if (!normalized) return undefined;
  return SPONSOR_FLAECHEN.find((f) => f.id === normalized);
}

/** @deprecated Alias für getFlaeche. */
export function getKostenposten(id: string | null | undefined): SponsorFlaeche | undefined {
  return getFlaeche(id);
}

export function flaecheParamAusSearch(
  flaeche: string | null,
  posten: string | null,
): string | null {
  return flaeche ?? posten;
}

/** Effektiver Status inkl. Komplett/Hälften-Logik. */
export function getEffectiveStatus(flaeche: SponsorFlaeche): FlaecheStatus {
  if (flaeche.status === "vergeben") return "vergeben";

  if (flaeche.halfteVon) {
    const parent = getFlaeche(flaeche.halfteVon);
    if (parent && getEffectiveStatus(parent) === "vergeben") return "vergeben";
  }

  if (flaeche.komplettHaelften) {
    const [a, b] = flaeche.komplettHaelften;
    const ha = getFlaeche(a);
    const hb = getFlaeche(b);
    if (ha?.status === "vergeben" || hb?.status === "vergeben") return "vergeben";
  }

  return flaeche.status;
}

/** Ob ein Slot aktuell buchbar ist (Komplett/Hälften-Konflikte). */
export function isFlaecheBuchbar(id: string): boolean {
  const f = getFlaeche(id);
  if (!f) return false;
  if (getEffectiveStatus(f) === "vergeben") return false;

  if (f.komplettHaelften) {
    const [a, b] = f.komplettHaelften;
    if (getFlaeche(a)?.status === "vergeben" || getFlaeche(b)?.status === "vergeben") {
      return false;
    }
  }

  if (f.halfteVon) {
    const [ha, hb] = KOMPLETT_HAELFTE[f.halfteVon] ?? [];
    if (ha && hb) {
      const other = f.id === ha ? hb : ha;
      if (getFlaeche(f.halfteVon)?.status === "vergeben") return false;
      if (f.id !== other && getFlaeche(other)?.status === "vergeben") {
        // andere Hälfte vergeben – diese Hälfte noch buchbar
      }
    }
  }

  return true;
}

export function flaecheOptionLabel(f: SponsorFlaeche): string {
  const status = getEffectiveStatus(f);
  const suffix =
    status !== "offen" && !f.mehrereMoeglich ? ` (${STATUS_LABEL[status]})` : "";
  return `${f.titel} – ${f.festpreis} €${suffix}`;
}

export function vorschlagBand(flaeche: SponsorFlaeche | undefined): Beitragsband {
  if (!flaeche) return "foerderer";
  return flaeche.vorgeschlagenesBand;
}

export function bandAusQuery(
  stufe: string | null,
  flaeche: SponsorFlaeche | undefined,
): Beitragsband {
  const normalized = normalizeStufe(stufe);
  if (normalized) return normalized;
  return vorschlagBand(flaeche);
}

export function anfrageWegAusQuery(
  stufe: string | null,
  flaecheId: string | null,
  postenId: string | null = null,
): AnfrageWeg {
  const flaeche = getFlaeche(flaecheParamAusSearch(flaecheId, postenId));
  const band = normalizeStufe(stufe);

  if (band === "partner" && !flaeche) return "partner";

  if (stufe === "sachpartner" && flaeche) return "flaeche";
  if (stufe === "sachpartner" && !flaeche) return "beitrag";

  if (flaeche && (!band || band === "partner")) return "flaeche";

  if (band === "foerderer" || band === "hauptsponsor") return "beitrag";

  if (flaeche) return "flaeche";

  return "partner";
}

export function bandWarnung(
  flaeche: SponsorFlaeche | undefined,
  band: Beitragsband,
): string | null {
  if (!flaeche) return null;
  if (BAND_RANK[band] < BAND_RANK[flaeche.minBand]) {
    return `Diese Fläche liegt bei ${flaeche.festpreis} €. Daraus folgt ${BAND_LABEL[flaeche.minBand]}. Niedriger nur nach Absprache.`;
  }
  return null;
}

export function bandHinweisOhneFlaeche(band: Beitragsband, flaecheId: string): string | null {
  if ((band === "hauptsponsor" || band === "foerderer") && !flaecheId) {
    return "Ohne Fläche bleibt der Rang. Die Exklusivwerbung am Gegenstand entfällt.";
  }
  return null;
}

export function ctaFuerFlaeche(flaeche: SponsorFlaeche): { href: string; label: string } {
  const band = vorschlagBand(flaeche);
  return {
    href: `/sponsor-werden?stufe=${band}&flaeche=${flaeche.id}#anfrage`,
    label: "Diese Fläche anfragen",
  };
}

/** @deprecated Alias. */
export function ctaFuerPosten(flaeche: SponsorFlaeche): { href: string; label: string } {
  return ctaFuerFlaeche(flaeche);
}

export function isAnfrageWeg(v: unknown): v is AnfrageWeg {
  return v === "partner" || v === "beitrag" || v === "flaeche";
}

/** @deprecated */
export function isAnfrageArt(v: unknown): v is AnfrageWeg {
  return isAnfrageWeg(v);
}

export function isBeitragsband(v: unknown): v is Beitragsband {
  return v === "partner" || v === "foerderer" || v === "hauptsponsor";
}

export function isBeitragsart(v: unknown): v is Beitragsart {
  return v === "geld" || v === "sach" || v === "beides";
}

export function submitLabel(weg: AnfrageWeg, band: Beitragsband): string {
  if (weg === "partner") return `Partner anfragen (${SPONSORING_2027.partnerPreis} €)`;
  if (weg === "flaeche") return "Fläche anfragen";
  if (band === "hauptsponsor") return "Hauptsponsor anfragen";
  if (band === "foerderer") return "Förderer anfragen";
  return `Partner anfragen (${SPONSORING_2027.partnerPreis} €)`;
}
