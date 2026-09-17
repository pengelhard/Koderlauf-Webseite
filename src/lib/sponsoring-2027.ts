/** Sponsoring Koderlauf 2027 – Pakete + Flächen-Inventar. */

export type Beitragsband = "partner" | "sponsor" | "hauptsponsor";
export type AnfrageWeg = "paket" | "flaeche";
export type FlaecheStatus = "offen" | "reserviert" | "vergeben";
export type FlaecheTyp = "sachspende" | "geld_oder_sache";
export type Beitragsart = "geld" | "sach" | "beides";

export const SPONSORING_2027 = {
  partnerPreis: 150,
  sponsorAb: 300,
  hauptsponsorAb: 500,
  hauptsponsorMax: 5,
  kontaktEmail: "info@koderlauf.de",
  fairnessSatz: "Rang folgt dem Betrag. Fläche folgt der Sache.",
  starterKalkulation: 500,
  premiere2026: {
    anmeldungen: 400,
    finisher: 378,
    ortsteilEinwohner: 550,
  },
} as const;

export const BAND_LABEL: Record<Beitragsband, string> = {
  partner: "Partner",
  sponsor: "Sponsor",
  hauptsponsor: "Hauptsponsor",
};

export const STATUS_LABEL: Record<FlaecheStatus, string> = {
  offen: "OFFEN",
  reserviert: "IN SPRACHE",
  vergeben: "VERGEBEN",
};

export const TYP_LABEL: Record<FlaecheTyp, string> = {
  sachspende: "Sachspende",
  geld_oder_sache: "Geld oder Sache",
};

const FLAECHE_ID_ALIASES: Record<string, string> = {
  "bauzaun-feld": "bauzaun",
  "bauzaun-einzelfeld": "bauzaun",
  "bauzaun-buendel": "bauzaun",
  "bauzaun-stellen": "bauzaun",
  siegerpreise: "preise",
  streckenverpflegung: "strecke",
};

const KOMPLETT_HAELFTE: Record<string, [string, string]> = {
  medaillen: ["medaillen-a", "medaillen-b"],
  preise: ["preise-1", "preise-2"],
};

const STUFE_ALIASES: Record<string, Beitragsband> = {
  foerderer: "sponsor",
  sachpartner: "sponsor",
};

export const SPONSOR_PAKETE: {
  id: Beitragsband;
  name: string;
  preisLabel: string;
  kurz: string;
  leistungen: string[];
  ctaHref: string;
  ctaLabel: string;
}[] = [
  {
    id: "partner",
    name: "Partner",
    preisLabel: "150 €",
    kurz: "Geldpaket – beliebig viele.",
    leistungen: [
      "1 Banner am Bauzaun (klein)",
      "1 Banner am Absperrgitter Zieleinlauf",
      "Website-Nennung",
      "Instagram-Link",
    ],
    ctaHref: "/sponsor-werden?stufe=partner#anfrage",
    ctaLabel: "Partner werden",
  },
  {
    id: "sponsor",
    name: "Sponsor",
    preisLabel: "ab 300 €",
    kurz: "Partner-Paket plus größere Sichtbarkeit.",
    leistungen: [
      "Alles wie Partner",
      "Größeres Logo auf der Sponsoren-Seite",
      "Mittleres Zaunbanner",
      "Fläche optional",
    ],
    ctaHref: "/sponsor-werden?stufe=sponsor#anfrage",
    ctaLabel: "Sponsor anfragen",
  },
  {
    id: "hauptsponsor",
    name: "Hauptsponsor",
    preisLabel: "ab 500 €",
    kurz: "Partner-Paket plus prominente Nennung.",
    leistungen: [
      "Alles wie Partner",
      "Prominente Website-Nennung",
      "Dank bei der Siegerehrung",
      "Großes Zaunbanner · Fläche optional",
    ],
    ctaHref: "/sponsor-werden?stufe=hauptsponsor#anfrage",
    ctaLabel: "Hauptsponsor anfragen",
  },
];

export const SPONSOR_ABLAUF = [
  { schritt: "1", titel: "Paket oder Fläche", text: "150 €, 300 € oder 500 € – oder eine konkrete Fläche." },
  { schritt: "2", titel: "Kurz formulieren", text: "Geld, Sache oder beides – je nach Flächentyp." },
  { schritt: "3", titel: "Verein meldet sich", text: "Logo-Formate, Rechnung, Termine." },
];

export interface SponsorFlaeche {
  id: string;
  titel: string;
  kurz: string;
  werbungKurz: string;
  festpreis: number;
  typ: FlaecheTyp;
  vorgeschlagenesBand: Beitragsband;
  minBand: Beitragsband;
  beschreibung: string;
  hinweis?: string;
  aufteilbar?: string;
  status: FlaecheStatus;
  komplettHaelften?: [string, string];
  halfteVon?: string;
  mehrereMoeglich?: boolean;
  /** CTA-Text z. B. „Zaun stellen“ */
  aktionLabel?: string;
}

/** Alle buchbaren Slots (Formular). */
export const SPONSOR_FLAECHEN: SponsorFlaeche[] = [
  {
    id: "bauzaun",
    titel: "Bauzaun stellen",
    kurz: "Ca. 60 Bauzaunfelder + 70 Absperrgitter stellen (Transport/Aufbau nach Absprache).",
    werbungKurz: "Hauptmotiv + „Bauzaun von …“ – alle anderen Sponsoren bekommen trotzdem Platz.",
    festpreis: 300,
    typ: "sachspende",
    vorgeschlagenesBand: "sponsor",
    minBand: "sponsor",
    beschreibung:
      "Eine Firma stellt den Zaun. Wer 300 € überweist ohne Zaun, bucht Restkosten – nicht diese Fläche.",
    aktionLabel: "Zaun stellen",
    status: "offen",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen stellen",
    kurz: "Eigenen Start-/Zielbogen mit Branding stellen oder bekleben/produzieren.",
    werbungKurz: "Großes Logo auf dem Bogen – fotogen.",
    festpreis: 300,
    typ: "sachspende",
    vorgeschlagenesBand: "sponsor",
    minBand: "sponsor",
    beschreibung:
      "Neutralbogen-Leihe vom Verein = Restkosten, keine Individualwerbung. 300 € ohne Bogen ≠ diese Fläche.",
    aktionLabel: "Bogen stellen",
    status: "offen",
  },
  {
    id: "ziel-bier",
    titel: "Ziel-Bier stellen",
    kurz: "Fässer/Gebinde + nach Absprache Ausschank für erwachsene Finisher (Kinderlauf ausgenommen).",
    werbungKurz: "Zapfstelle/Schild „Zielbier präsentiert von …“.",
    festpreis: 400,
    typ: "sachspende",
    vorgeschlagenesBand: "sponsor",
    minBand: "sponsor",
    beschreibung: "Geld ohne Bier = Restkosten, nicht diese Fläche. Alkohol nur für Erwachsene.",
    aktionLabel: "Bier stellen",
    status: "offen",
  },
  {
    id: "medaillen",
    titel: "Medaillen (Komplett)",
    kurz: "Finisher-Medaille inkl. Band und Aufkleber für 500 Starter plus Reserve.",
    werbungKurz: "Logo auf Band und Aufkleber.",
    festpreis: 1000,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    beschreibung: "Komplett setzt Hälfte A und B auf VERGEBEN. Kalkulation: 500 Starter, Festpreis.",
    komplettHaelften: ["medaillen-a", "medaillen-b"],
    hinweis: "Eine Firma darf beide Hälften. Zwei Firmen je eine Hälfte.",
    status: "offen",
  },
  {
    id: "medaillen-a",
    titel: "Medaillen – Hälfte A (Band)",
    kurz: "Logo auf dem Medaillenband.",
    werbungKurz: "Logo auf dem Band.",
    festpreis: 500,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    beschreibung: "Hälfte A – Logo auf dem Band.",
    halfteVon: "medaillen",
    status: "offen",
  },
  {
    id: "medaillen-b",
    titel: "Medaillen – Hälfte B (Aufkleber)",
    kurz: "Logo auf dem Medaillen-Aufkleber.",
    werbungKurz: "Logo auf dem Aufkleber.",
    festpreis: 500,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    beschreibung: "Hälfte B – Logo auf dem Aufkleber.",
    halfteVon: "medaillen",
    status: "offen",
  },
  {
    id: "preise",
    titel: "Siegerpreise (Komplett)",
    kurz: "6 Läufe × Platz 1–3 – alle Wertungen.",
    werbungKurz: "Übergabe, Nennung, Foto.",
    festpreis: 500,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    beschreibung:
      "Spielerei, Kinderlauf, Trailrun, Koderrunde Lauf, Koderrunde Walking, Kurz und knackig.",
    komplettHaelften: ["preise-1", "preise-2"],
    status: "offen",
  },
  {
    id: "preise-1",
    titel: "Siegerpreise – Paket 1",
    kurz: "Spielerei, Trailrun, Koderrunde Lauf.",
    werbungKurz: "Übergabe, Nennung, Foto.",
    festpreis: 300,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "sponsor",
    minBand: "sponsor",
    beschreibung: "Paket 1 der Siegerpreise.",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "preise-2",
    titel: "Siegerpreise – Paket 2",
    kurz: "Kinderlauf, Koderrunde Walking, Kurz und knackig.",
    werbungKurz: "Übergabe, Nennung, Foto.",
    festpreis: 300,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "sponsor",
    minBand: "sponsor",
    beschreibung: "Paket 2 der Siegerpreise.",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "zielverpflegung",
    titel: "Zielverpflegung",
    kurz: "Getränk + Kleinigkeit am Ziel, ohne Bier.",
    werbungKurz: "Schild oder Theke am Ziel.",
    festpreis: 500,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "hauptsponsor",
    minBand: "hauptsponsor",
    beschreibung: "Nicht splitten. Standard: Verein beschafft.",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    kurz: "Druck + Reserve, Logo unten exklusiv.",
    werbungKurz: "Logo unten auf der Startnummer.",
    festpreis: 300,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "sponsor",
    minBand: "sponsor",
    beschreibung: "Ohne Timing-Chip. Standard: Verein bestellt.",
    status: "offen",
  },
  {
    id: "strecke",
    titel: "Streckenverpflegung",
    kurz: "Wasser, Iso, Obst, Becher an der/den Station(en).",
    werbungKurz: "Schild an der Station.",
    festpreis: 300,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "sponsor",
    minBand: "sponsor",
    beschreibung: "Verpflegung an der Strecke.",
    aufteilbar: "Optional 2 Stationen à 150 € – dann Partner plus Fläche.",
    status: "offen",
  },
  {
    id: "restkosten",
    titel: "Restkosten / Lauf ermöglichen",
    kurz: "Zeitnahme, Sanitäter, Markierung, Reserve, Neutralbogen, Zaunleihe.",
    werbungKurz: "Nennung – kein Logo am Gegenstand.",
    festpreis: 300,
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "sponsor",
    minBand: "partner",
    beschreibung: "Reines Geld landet hier. Pakete 150 / 300 / 500 €.",
    mehrereMoeglich: true,
    status: "offen",
  },
];

/** UI-Gruppen für Flächen-Sektion. */
export const FLAECHEN_UI = {
  sachspendeIds: ["bauzaun", "zielbogen", "ziel-bier"] as const,
  gruppen: [
    {
      id: "medaillen",
      titel: "Medaillen",
      zeile: "1.000 € Komplett oder 2× 500 € (Band / Aufkleber) · Hauptsponsor",
      slotIds: ["medaillen", "medaillen-a", "medaillen-b"],
    },
    {
      id: "preise",
      titel: "Siegerpreise",
      zeile: "500 € Komplett oder 2× 300 € (Paket 1 / 2) · 6 Läufe",
      slotIds: ["preise", "preise-1", "preise-2"],
    },
  ],
  kurzIds: ["zielverpflegung", "startnummern", "strecke", "restkosten"] as const,
};

export const SPONSOR_FAQ: { frage: string; antwort: string }[] = [
  {
    frage: "Warum Zaun, Bogen und Bier nur als Sache?",
    antwort: "Weil wir die Sache brauchen – kein Geld ohne Gestell, Bogen oder Fässer. Überweisung ohne Sache = Restkosten.",
  },
  {
    frage: "Muss ich nachzahlen, wenn ich die Sache stelle?",
    antwort: "Nein. Wer die Sache stellt, zahlt nicht bar nach.",
  },
  {
    frage: "Können zwei Firmen eine Fläche teilen?",
    antwort: "Nur bei Medaillen und Siegerpreisen (Hälften/Pakete). Eine Firma darf auch beide nehmen.",
  },
  {
    frage: "Hauptsponsor ohne Fläche?",
    antwort: "Ja – 500 € über Restkosten. Kein Logo am Gegenstand.",
  },
  {
    frage: "Neutraler Leihbogen?",
    antwort: "Keine Individualwerbung. Das ist Restkosten, nicht die Fläche Zielbogen.",
  },
  {
    frage: "Wer hängt Banner an den Zaun?",
    antwort: "Alle Pakete bekommen Platz. Die stellende Firma hat das Hauptmotiv.",
  },
  {
    frage: "Gibt es Fotos?",
    antwort: "Von eurer Fläche, soweit vorhanden.",
  },
];

const BAND_RANK: Record<Beitragsband, number> = {
  partner: 1,
  sponsor: 2,
  hauptsponsor: 3,
};

export function normalizeFlaecheId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return FLAECHE_ID_ALIASES[id] ?? id;
}

export function normalizePostenId(id: string | null | undefined): string | undefined {
  return normalizeFlaecheId(id);
}

export function normalizeStufe(stufe: string | null | undefined): Beitragsband | undefined {
  if (!stufe) return undefined;
  if (stufe in STUFE_ALIASES) return STUFE_ALIASES[stufe];
  if (stufe === "partner" || stufe === "sponsor" || stufe === "hauptsponsor") return stufe;
  return undefined;
}

export function getFlaeche(id: string | null | undefined): SponsorFlaeche | undefined {
  const normalized = normalizeFlaecheId(id);
  if (!normalized) return undefined;
  return SPONSOR_FLAECHEN.find((f) => f.id === normalized);
}

export function getKostenposten(id: string | null | undefined): SponsorFlaeche | undefined {
  return getFlaeche(id);
}

export function flaecheParamAusSearch(flaeche: string | null, posten: string | null): string | null {
  return flaeche ?? posten;
}

export function isSachspendeFlaeche(f: SponsorFlaeche | undefined): boolean {
  return f?.typ === "sachspende";
}

export function getEffectiveStatus(flaeche: SponsorFlaeche): FlaecheStatus {
  if (flaeche.status === "vergeben") return "vergeben";

  if (flaeche.halfteVon) {
    const parent = getFlaeche(flaeche.halfteVon);
    if (parent && getEffectiveStatus(parent) === "vergeben") return "vergeben";
  }

  if (flaeche.komplettHaelften) {
    const [a, b] = flaeche.komplettHaelften;
    if (getFlaeche(a)?.status === "vergeben" || getFlaeche(b)?.status === "vergeben") {
      return "vergeben";
    }
  }

  return flaeche.status;
}

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

  if (f.halfteVon && getFlaeche(f.halfteVon)?.status === "vergeben") return false;

  return true;
}

export function flaecheOptionLabel(f: SponsorFlaeche): string {
  const status = getEffectiveStatus(f);
  const suffix = status !== "offen" && !f.mehrereMoeglich ? ` (${STATUS_LABEL[status]})` : "";
  return `${f.titel} – ${f.festpreis} €${suffix}`;
}

export function vorschlagBand(flaeche: SponsorFlaeche | undefined): Beitragsband {
  if (!flaeche) return "sponsor";
  return flaeche.vorgeschlagenesBand;
}

export function bandAusQuery(stufe: string | null, flaeche: SponsorFlaeche | undefined): Beitragsband {
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
  if (flaeche) return "flaeche";
  if (normalizeStufe(stufe)) return "paket";
  return "paket";
}

export function bandWarnung(flaeche: SponsorFlaeche | undefined, band: Beitragsband): string | null {
  if (!flaeche) return null;
  if (BAND_RANK[band] < BAND_RANK[flaeche.minBand]) {
    return `Diese Fläche liegt bei ${flaeche.festpreis} €. Daraus folgt ${BAND_LABEL[flaeche.minBand]}. Niedriger nur nach Absprache.`;
  }
  return null;
}

export function beitragsartWarnung(
  flaeche: SponsorFlaeche | undefined,
  beitragsart: Beitragsart,
): string | null {
  if (!flaeche || !isSachspendeFlaeche(flaeche)) return null;
  if (beitragsart === "geld") {
    return "Diese Fläche ist eine Sachspende. Geld allein bucht sie nicht – bitte Sache oder beides wählen.";
  }
  return null;
}

export function isBeitragsartGueltig(
  flaeche: SponsorFlaeche | undefined,
  beitragsart: Beitragsart,
): boolean {
  if (!flaeche) return true;
  if (isSachspendeFlaeche(flaeche) && beitragsart === "geld") return false;
  return true;
}

export function defaultBeitragsart(flaeche: SponsorFlaeche | undefined): Beitragsart {
  if (isSachspendeFlaeche(flaeche)) return "sach";
  return "geld";
}

export function ctaFuerFlaeche(flaeche: SponsorFlaeche): { href: string; label: string } {
  const band = vorschlagBand(flaeche);
  const label = flaeche.aktionLabel
    ? `${flaeche.aktionLabel} anfragen`
    : "Diese Fläche anfragen";
  return {
    href: `/sponsor-werden?stufe=${band}&flaeche=${flaeche.id}#anfrage`,
    label,
  };
}

export function ctaFuerPosten(flaeche: SponsorFlaeche): { href: string; label: string } {
  return ctaFuerFlaeche(flaeche);
}

export function isAnfrageWeg(v: unknown): v is AnfrageWeg {
  return v === "paket" || v === "flaeche";
}

export function isAnfrageArt(v: unknown): v is AnfrageWeg {
  return isAnfrageWeg(v);
}

export function isBeitragsband(v: unknown): v is Beitragsband {
  return v === "partner" || v === "sponsor" || v === "hauptsponsor";
}

export function isBeitragsart(v: unknown): v is Beitragsart {
  return v === "geld" || v === "sach" || v === "beides";
}

export function submitLabel(
  weg: AnfrageWeg,
  band: Beitragsband,
  flaeche?: SponsorFlaeche,
): string {
  if (weg === "flaeche" && flaeche && isSachspendeFlaeche(flaeche)) return "Sachspende anfragen";
  if (weg === "flaeche") return "Fläche anfragen";
  if (band === "partner") return "Partner anfragen";
  if (band === "sponsor") return "Sponsor anfragen";
  if (band === "hauptsponsor") return "Hauptsponsor anfragen";
  return "Anfrage senden";
}
