/** Sponsoring-Konzept Koderlauf 2027 – Beitragsbänder + Flächen-Inventar. */

export type Beitragsband = "partner" | "foerderer" | "hauptsponsor";
export type AnfrageWeg = "partner" | "beitrag" | "flaeche";
export type FlaecheStatus = "offen" | "reserviert" | "vergeben";
export type Beitragsart = "geld" | "sach" | "beides";

export const SPONSORING_2027 = {
  partnerPreis: 150,
  foerdererVon: 400,
  foerdererBis: 500,
  hauptsponsorAb: 800,
  hauptsponsorMax: 5,
  kontaktEmail: "info@koderlauf.de",
  fairnessSatz:
    "Status folgt dem Beitrag. Fläche folgt dem Inventar. 800 € ohne freie Medaille ergeben denselben Rang wie die Medaillen – aber nicht dasselbe Band-Logo.",
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
  "bauzaun-feld": "bauzaun-einzelfeld",
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
    preisLabel: "150 € bar",
    kurz: "Sichtbarkeit ohne Exklusivfläche – beliebig viele Partner.",
    leistungen: [
      "1× Banner am Bauzaun",
      "1× Banner am Zieleinlauf",
      "Erwähnung auf der Website",
      "Verlinkung auf Instagram",
    ],
    flaecheHinweis: "Keine Exklusivfläche – Bauzaun-Einzelfeld optional als Add-on.",
    ctaHref: "/sponsor-werden?stufe=partner#anfrage",
    ctaLabel: "Partner werden",
  },
  {
    id: "foerderer",
    name: "Förderer",
    preisLabel: "ca. 400–500 € Gegenwert",
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
    preisLabel: "ab ca. 800 € Gegenwert",
    kurz: "Partner-Paket plus große Nennung und Dank bei der Siegerehrung.",
    leistungen: [
      "Alles wie Partner",
      "Prominente Nennung auf der Website",
      "Dank bei der Siegerehrung",
      "Fläche optional, wenn noch eine passende offen ist",
    ],
    flaecheHinweis:
      "Fläche optional – Geld ohne lieferbare Sache ist ausdrücklich erlaubt. Begrenzt auf max. 5 Hauptsponsoren.",
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
  { leistung: "Banner-Paket Bauzaun+Ziel", partner: "ja", foerderer: "ja", hauptsponsor: "ja" },
  { leistung: "Dank Siegerehrung", partner: "nein", foerderer: "kurz möglich", hauptsponsor: "ja" },
  {
    leistung: "Exklusivfläche",
    partner: "nein, außer Add-on",
    foerderer: "optional wenn offen",
    hauptsponsor: "optional wenn offen",
  },
  { leistung: "Titel", partner: "Partner", foerderer: "Förderer", hauptsponsor: "Hauptsponsor" },
  {
    leistung: "Gegenwert",
    partner: "150 € bar",
    foerderer: "ca. 400–500 €",
    hauptsponsor: "ab ca. 800 €",
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
  { schritt: "1", titel: "Band wählen", text: "150 €, ca. 500 € oder ab 800 € Gegenwert – Geld oder Sache." },
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
  richtkosten: string;
  vorgeschlagenesBand: Beitragsband;
  minBand: Beitragsband;
  wertCa?: string;
  aufteilbar?: string;
  hinweis?: string;
  status: FlaecheStatus;
  /** Mehrere Firmen möglich (z. B. Restkosten-Topf). */
  mehrereMoeglich?: boolean;
}

export const SPONSOR_FLAECHEN: SponsorFlaeche[] = [
  {
    id: "medaillen",
    titel: "Medaillen",
    kurz: "Finisher-Medaille inkl. Band und Aufkleber für alle Finisher plus Reserve.",
    werbungKurz: "Logo auf dem Medaillenband; Aufkleber optional.",
    badgeLabel: "ca. 720–800 € · typisch Hauptsponsor",
    beschreibung:
      "Finisher-Medaille inkl. Band und Aufkleber für alle Finisher plus Reserve (ca. 5–10 %).",
    werbung: "Logo auf dem Band (Hauptplatz); Aufkleber optional mit Logo oder Claim.",
    richtkosten: "ca. 1,80 €/Finisher. Bei 400 Finishern ca. 720–800 €.",
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "foerderer",
    wertCa: "720–800",
    hinweis: "Wer die Sache stellt, zahlt nicht bar nach. Standard: Verein bestellt.",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    kurz: "Druck der Startnummern für alle Starter plus Reserve (ohne Timing-Chip).",
    werbungKurz: "Logo unten auf der Startnummer – exklusiv.",
    badgeLabel: "ca. 0,80–1,50 €/Starter · oft Förderer oder Hauptsponsor",
    beschreibung: "Druck der Startnummern für alle Starter plus Reserve. Ohne Zeitnahme-Chip.",
    werbung: "Logo unten auf der Startnummer – exklusiv für diese Fläche.",
    richtkosten: "ca. 0,80–1,50 €/Starter. Summe oft um oder über 500 €.",
    vorgeschlagenesBand: "foerderer",
    minBand: "partner",
    hinweis: "Standard: Verein bestellt. Die Logo-Fläche wird nicht parallel an zwei Firmen verkauft.",
    status: "offen",
  },
  {
    id: "streckenverpflegung",
    titel: "Streckenverpflegung",
    kurz: "Wasser, Iso, Obst und Becher an einer oder mehreren Stationen.",
    werbungKurz: "Schild „Verpflegung präsentiert von …“ an der Station.",
    badgeLabel: "ca. 0,40–0,80 €/Starter/Station · Förderer oder Hauptsponsor",
    beschreibung: "Wasser, Iso, Obst, Becher und Müll an einer oder mehreren Stationen.",
    werbung: "Schild „Verpflegung präsentiert von …“ an der Station.",
    richtkosten: "ca. 0,40–0,80 €/Starter pro Station (Einkaufswert / Angebot).",
    vorgeschlagenesBand: "foerderer",
    minBand: "partner",
    aufteilbar: "Station A, Station B oder alle Stationen.",
    status: "offen",
  },
  {
    id: "zielverpflegung",
    titel: "Zielverpflegung",
    kurz: "Getränk und Kleinigkeit direkt nach dem Zieleinlauf.",
    werbungKurz: "Schild oder Theke am Ziel.",
    badgeLabel: "ca. 0,80–1,50 €/Finisher · Förderer oder Hauptsponsor",
    beschreibung: "Getränk und Kleinigkeit direkt nach dem Zieleinlauf. Ziel-Bier ist ein eigener Posten.",
    werbung: "Schild oder Theke am Ziel.",
    richtkosten: "ca. 0,80–1,50 €/Finisher (Einkaufswert).",
    vorgeschlagenesBand: "foerderer",
    minBand: "partner",
    aufteilbar: "z. B. Getränke und Snack getrennt.",
    status: "offen",
  },
  {
    id: "ziel-bier",
    titel: "Ziel-Bier",
    kurz: "Ein Bier (o. ä.) für jeden Finisher am Ziel. Kinderlauf ausgenommen.",
    werbungKurz: "Zapfstelle oder Schild „Zielbier präsentiert von …“.",
    badgeLabel: "ca. 1,00–2,00 €/Finisher · Förderer oder Hauptsponsor",
    beschreibung: "Ein Bier (o. ä.) für jeden Finisher am Ziel. Kinderlauf ausgenommen.",
    werbung: "Zapfstelle/Schild „Zielbier präsentiert von …“.",
    richtkosten: "ca. 1,00–2,00 €/Finisher (Gebinde und Ausschank).",
    vorgeschlagenesBand: "foerderer",
    minBand: "partner",
    hinweis: "Alkohol nur für Erwachsene.",
    status: "offen",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen",
    kurz: "Start-/Zielbogen mit Branding – sehr fotogen.",
    werbungKurz: "Großes Logo auf dem Zielbogen.",
    badgeLabel: "oft 300–800 € · Förderer bis Hauptsponsor",
    beschreibung: "Start-/Zielbogen mit Branding. 2026: Jeremias am Start-/Zielbogen.",
    werbung: "Großes Logo auf dem Bogen – sehr sichtbar auf Fotos.",
    richtkosten: "Angebot oder Sachspende zum Einkaufswert, oft ca. 300–800 €.",
    vorgeschlagenesBand: "foerderer",
    minBand: "foerderer",
    hinweis: "300 € allein → Förderer. Obere Spanne → Hauptsponsor. Standard: Verein bestellt.",
    status: "offen",
  },
  {
    id: "siegerpreise",
    titel: "Siegerpreise",
    kurz: "Sachpreise oder Gutscheine für Platzierungen und Altersklassen.",
    werbungKurz: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    badgeLabel: "oft 150–400 € · typisch Partner oder Förderer",
    beschreibung: "Sachpreise oder Gutscheine für Platzierungen und Altersklassen.",
    werbung: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    richtkosten: "Pauschale oft ca. 150–400 € Gesamttopf.",
    vorgeschlagenesBand: "foerderer",
    minBand: "partner",
    aufteilbar: "z. B. nur Frauenwertung, Trail oder Kinderlauf.",
    status: "offen",
  },
  {
    id: "bauzaun-buendel",
    titel: "Bauzaun (Bündel)",
    kurz: "2–3 Felder oder ein Bereich am Bauzaun Start/Ziel.",
    werbungKurz: "Logo und Motiv auf den Bannern.",
    badgeLabel: "ca. 200–250 € · Fläche + Partner oder Förderer",
    beschreibung: "2–3 Felder oder ein Bereich am Bauzaun Start/Ziel.",
    werbung: "Logo und Motiv auf den Bannern.",
    richtkosten: "ab ca. 200–250 € gesamt (Druck).",
    vorgeschlagenesBand: "partner",
    minBand: "partner",
    status: "offen",
  },
  {
    id: "bauzaun-einzelfeld",
    titel: "Bauzaun (Einzelfeld)",
    kurz: "Ein einzelnes Feld am Bauzaun.",
    werbungKurz: "Logo auf diesem einen Banner.",
    badgeLabel: "ca. 80–100 € · Fläche + Partner-Niveau",
    beschreibung: "Ein einzelnes Feld. Typisch unter 200 €.",
    werbung: "Logo auf diesem einen Banner.",
    richtkosten: "ca. 80–100 € bzw. unter 200 €.",
    vorgeschlagenesBand: "partner",
    minBand: "partner",
    hinweis: "Auch als Add-on zum Partner 150 € möglich.",
    status: "offen",
  },
  {
    id: "restkosten",
    titel: "Lauf ermöglichen (Restkosten)",
    kurz: "Zeitnahme, Sanitäter, Streckenmarkierung, Reserve, Kinderlauf-Unkosten.",
    werbungKurz: "Nennung als Sponsor – kein fotogenes Logo am Gegenstand.",
    badgeLabel: "Pakete 150 / 400–500 / 800 € → passendes Band",
    beschreibung:
      "Zeitnahme, Sanitäter, Streckenmarkierung, Reserve, Kinderlauf-Unkosten. Kein fotogenes Logo am Gegenstand, aber ehrlicher Cash-Weg.",
    werbung: "Nennung auf der Website und in der Kommunikation – kein Logo am Gegenstand.",
    richtkosten:
      "Richtwert-Pakete z. B. 150 € (Partner), 400–500 € (Förderer) oder 800 € (Hauptsponsor).",
    vorgeschlagenesBand: "foerderer",
    minBand: "partner",
    hinweis:
      "Mehrere Förderer möglich. Standard: Verein kauft und organisiert. Sache liefern nur nach Absprache.",
    status: "offen",
    mehrereMoeglich: true,
  },
];

export const SPONSOR_FALLBEISPIELE: { titel: string; text: string }[] = [
  {
    titel: "Wir wollen Hauptsponsor sein, können aber nichts liefern.",
    text:
      "Ja. Ab ca. 800 € Gegenwert – oder ihr zahlt die Medaillen und der Verein bestellt. Titel ja. Logo auf dem Band nur, wenn die Fläche noch frei ist.",
  },
  {
    titel: "Alle Flächen sind vergeben.",
    text:
      "Beitrag über Restkosten. Gleicher Rang möglich. Der Verein meldet sich, welches Band passt.",
  },
  {
    titel: "Wir stellen nur den Bauzaun (~200 €).",
    text:
      "Ihr seid Sponsor mit der Fläche Bauzaun – das ist die Anerkennung. Kein Hauptsponsor-Titel. Partner-Paket 150 € als Add-on möglich.",
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
    frage: "Hauptsponsor ohne Fläche?",
    antwort: "Ja, ab ca. 800 € Gegenwert. Geld ohne lieferbare Sache ist ausdrücklich erlaubt.",
  },
  {
    frage: "Kann ich nur eine Verpflegungsstation nehmen?",
    antwort: "Ja. Strecken- und Zielverpflegung sind aufteilbar – z. B. nur Station A oder nur Getränke.",
  },
  {
    frage: "Gibt es Fotos nach dem Lauf?",
    antwort:
      "Ausgewählte Fotos eurer Fläche, soweit vorhanden. Keine Aftermovie-Garantie.",
  },
  {
    frage: "Partner plus Einzelfeld Bauzaun?",
    antwort: "Ja. Das Einzelfeld kann als Add-on zum Partner 150 € gebucht werden.",
  },
  {
    frage: "Was ist der Unterschied zwischen Band und Fläche?",
    antwort:
      "Das Band (Partner, Förderer, Hauptsponsor) bestimmt euren Rang und die Sichtbarkeit im Paket. Die Fläche ist knappes Inventar – Logo am Gegenstand, eine Firma pro Fläche.",
  },
  {
    frage: "Warum ist 200 € Zaun nicht gleich 800 € Medaillen?",
    antwort:
      "Rang folgt dem Euro-Gegenwert im Band. Die Fläche folgt dem Inventar. Beides ist wertvoll – nur anders sichtbar.",
  },
  {
    frage: "Wer bestellt Medaillen, Bogen und Startnummern?",
    antwort:
      "Standard: der Verein kauft und organisiert, ihr zahlt den Richtwert. Sache liefern nur nach Absprache (Qualität, Termin, Motiv).",
  },
];

export const SPONSOR_ABLAUF = [
  { schritt: "1", titel: "Band wählen (und optional Fläche)", text: "150 €, ca. 500 € oder ab 800 € – plus Fläche, wenn ihr wollt." },
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
  if (!flaeche || band === "hauptsponsor") return null;
  if (BAND_RANK[band] < BAND_RANK[flaeche.minBand]) {
    const wert = flaeche.wertCa ? `ca. ${flaeche.wertCa} €` : flaeche.badgeLabel.split("·")[0]?.trim();
    return `Diese Fläche liegt bei ${wert ?? "diesem Richtwert"}. Daraus folgt ${BAND_LABEL[flaeche.minBand]}. Niedriger nur nach Absprache.`;
  }
  return null;
}

export function bandHinweisOhneFlaeche(band: Beitragsband, flaecheId: string): string | null {
  if (band === "hauptsponsor" && !flaecheId) {
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
