/** Sponsoring Koderlauf 2027 – Sichtbarkeit statt Preispakete. */

export type Sichtbarkeit = "liste" | "banner" | "buehne";
/** Alter Name im Formular und in der API. */
export type Beitragsband = Sichtbarkeit;
export type AnfrageWeg = "stufe" | "flaeche";
export type FlaecheStatus = "offen" | "reserviert" | "vergeben";
export type FlaecheTyp = "sachspende" | "geld_oder_sache";
export type Beitragsart = "geld" | "sach" | "beides";

export const SPONSORING_2027 = {
  bannerAb: 150,
  buehneAb: 500,
  kontaktEmail: "info@koderlauf.de",
  zuordnungSatz: "Geld hat einen Betrag. Sache ordnen wir im Gespräch zu.",
  starterKalkulation: 500,
  premiere2026: {
    anmeldungen: 400,
    finisher: 378,
    ortsteilEinwohner: 550,
  },
} as const;

export const BAND_LABEL: Record<Sichtbarkeit, string> = {
  liste: "Liste",
  banner: "Banner",
  buehne: "Bühne",
};

export const STATUS_LABEL: Record<FlaecheStatus, string> = {
  offen: "OFFEN",
  reserviert: "IM GESPRÄCH",
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

const STUFE_ALIASES: Record<string, Sichtbarkeit> = {
  foerderer: "banner",
  sachpartner: "banner",
  partner: "banner",
  sponsor: "banner",
  hauptsponsor: "buehne",
};

export const SPONSOR_STUFEN: {
  id: Sichtbarkeit;
  name: string;
  preisLabel: string;
  kurz: string;
  leistungen: string[];
  ctaHref: string;
  ctaLabel: string;
}[] = [
  {
    id: "liste",
    name: "Liste",
    preisLabel: "klein",
    kurz: "Äpfel, Riegel, 50 €, kleine Gutscheine.",
    leistungen: ["Name auf der Dankesliste", "Kein Banner"],
    ctaHref: "/sponsor-werden?stufe=liste#anfrage",
    ctaLabel: "Liste anfragen",
  },
  {
    id: "banner",
    name: "Banner",
    preisLabel: "ab etwa 150 €",
    kurz: "Geld ab etwa 150 € – oder Ware und Gutscheine in der Größenordnung.",
    leistungen: [
      "Banner am Zaun",
      "Logo auf der Website",
      "Instagram",
      "Mehr Umfang, größeres Banner",
    ],
    ctaHref: "/sponsor-werden?stufe=banner#anfrage",
    ctaLabel: "Banner anfragen",
  },
  {
    id: "buehne",
    name: "Bühne",
    preisLabel: "ab etwa 500 €",
    kurz: "Geld ab etwa 500 € – oder eine Sache, die den Lauf trägt.",
    leistungen: ["Großes Banner", "Prominente Nennung", "Dank bei der Siegerehrung"],
    ctaHref: "/sponsor-werden?stufe=buehne#anfrage",
    ctaLabel: "Bühne anfragen",
  },
];

export interface SponsorFlaeche {
  id: string;
  titel: string;
  kurz: string;
  werbungKurz: string;
  typ: FlaecheTyp;
  vorgeschlagenesBand: Sichtbarkeit;
  minBand: Sichtbarkeit;
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

/** Alle buchbaren Slots (Formular). Ohne Euro-Preise: Sache wird im Gespräch eingeordnet. */
export const SPONSOR_FLAECHEN: SponsorFlaeche[] = [
  {
    id: "bauzaun",
    titel: "Bauzaun stellen",
    kurz: "Ca. 60 Bauzaunfelder und 70 Absperrgitter stellen. Transport und Aufbau nach Absprache.",
    werbungKurz: "Hauptmotiv und „Bauzaun von …“. Alle anderen bekommen trotzdem Platz für ihr Banner.",
    typ: "sachspende",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung:
      "Wir brauchen den Zaun, keine Überweisung an seiner Stelle. Im Gespräch, noch nicht fest.",
    aktionLabel: "Zaun stellen",
    status: "reserviert",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen stellen",
    kurz: "Eigenen Start- und Zielbogen mit Branding stellen, bekleben oder produzieren.",
    werbungKurz: "Großes Logo auf dem Bogen.",
    typ: "sachspende",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung:
      "Ein geliehener Neutralbogen hat kein eigenes Logo. Den ordnen wir anders ein.",
    aktionLabel: "Bogen stellen",
    status: "offen",
  },
  {
    id: "ziel-bier",
    titel: "Ziel-Bier stellen",
    kurz: "Fässer oder Gebinde und nach Absprache Ausschank für erwachsene Finisher. Kinderlauf ausgenommen.",
    werbungKurz: "Zapfstelle oder Schild „Zielbier präsentiert von …“.",
    typ: "sachspende",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Ohne Bier ist es keine Fläche. Alkohol nur für Erwachsene.",
    aktionLabel: "Bier stellen",
    status: "offen",
  },
  {
    id: "medaillen",
    titel: "Medaillen (Komplett)",
    kurz: "Finisher-Medaille inklusive Band und Aufkleber, plus Reserve.",
    werbungKurz: "Logo auf Band und Aufkleber.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung:
      "Komplett schließt die beiden Hälften. Eine Firma darf beides nehmen, zwei Firmen je eine Hälfte.",
    komplettHaelften: ["medaillen-a", "medaillen-b"],
    hinweis: "Im Gespräch, noch nicht fest. Name nennen wir erst, wenn es zu ist.",
    status: "reserviert",
  },
  {
    id: "medaillen-a",
    titel: "Medaillen – Hälfte A (Band)",
    kurz: "Logo auf dem Medaillenband.",
    werbungKurz: "Logo auf dem Band.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Hälfte A. Wer die Medaillen herstellt oder bezahlt, kommt auf die Bühne.",
    halfteVon: "medaillen",
    status: "reserviert",
  },
  {
    id: "medaillen-b",
    titel: "Medaillen – Hälfte B (Aufkleber)",
    kurz: "Logo auf dem Medaillen-Aufkleber.",
    werbungKurz: "Logo auf dem Aufkleber.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Hälfte B. Wer die Medaillen herstellt oder bezahlt, kommt auf die Bühne.",
    halfteVon: "medaillen",
    status: "reserviert",
  },
  {
    id: "preise",
    titel: "Siegerpreise (Komplett)",
    kurz: "6 Läufe, Platz 1 bis 3.",
    werbungKurz: "Übergabe, Nennung, Foto.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
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
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Paket 1. Umfang der Preise klären wir zusammen.",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "preise-2",
    titel: "Siegerpreise – Paket 2",
    kurz: "Kinderlauf, Koderrunde Walking, Kurz und knackig.",
    werbungKurz: "Übergabe, Nennung, Foto.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Paket 2. Umfang der Preise klären wir zusammen.",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "zielverpflegung",
    titel: "Zielverpflegung",
    kurz: "Getränk und eine Kleinigkeit am Ziel, ohne Bier.",
    werbungKurz: "Schild oder Theke am Ziel.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Nicht teilen. Verein kann einkaufen, oder ihr liefert.",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    kurz: "Druck plus Reserve. Logo unten, exklusiv.",
    werbungKurz: "Logo unten auf der Startnummer.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Ohne Timing-Chip. Verein kann bestellen, oder ihr liefert.",
    status: "offen",
  },
  {
    id: "strecke",
    titel: "Streckenverpflegung",
    kurz: "Wasser, Iso, Obst, Becher an der Station.",
    werbungKurz: "Schild an der Station.",
    typ: "geld_oder_sache",
    vorgeschlagenesBand: "buehne",
    minBand: "buehne",
    beschreibung: "Verein kann einkaufen, oder ihr stellt die Verpflegung.",
    aufteilbar: "Zwei Stationen gehen auch getrennt. Eine einzelne Station kann Banner sein – sagen wir im Gespräch.",
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
      zeile: "Komplett, oder Band und Aufkleber getrennt.",
      slotIds: ["medaillen", "medaillen-a", "medaillen-b"],
    },
    {
      id: "preise",
      titel: "Siegerpreise",
      zeile: "Alle 6 Läufe, oder zwei Pakete.",
      slotIds: ["preise", "preise-1", "preise-2"],
    },
  ],
  kurzIds: ["zielverpflegung", "startnummern", "strecke"] as const,
};

export const SPONSOR_FAQ: { frage: string; antwort: string }[] = [
  {
    frage: "Wie ordnet ihr Äpfel, Riegel oder Gutscheine ein?",
    antwort:
      "Das machen wir im Gespräch. Eine Kiste oder 50 € ist Liste. Gutscheine über ein paar hundert Euro sind meist Banner. Ihr müsst keinen Preis festlegen.",
  },
  {
    frage: "Warum Zaun, Bogen und Bier nur als Sache?",
    antwort: "Weil wir die Sache brauchen. Geld ohne Gestell, Bogen oder Fässer ist eine andere Stufe, kein Logo auf dem Gegenstand.",
  },
  {
    frage: "Muss ich nachzahlen, wenn ich die Sache stelle?",
    antwort: "Nein.",
  },
  {
    frage: "Können zwei Firmen eine Fläche teilen?",
    antwort: "Bei Medaillen und Siegerpreisen ja. Sonst eine Firma pro Fläche.",
  },
  {
    frage: "Banner ohne Fläche?",
    antwort: "Ja. Geld ab etwa 150 € oder eine vergleichbare Sache. Kein Logo auf Zaun, Medaille oder Bogen.",
  },
  {
    frage: "Was heißt „im Gespräch“?",
    antwort: "Wir reden schon mit jemandem, es ist noch nicht fest. Namen stehen hier erst, wenn es zu ist. Du kannst dich trotzdem melden.",
  },
  {
    frage: "Neutraler Leihbogen?",
    antwort: "Kein eigenes Logo. Das ist nicht die Fläche Zielbogen.",
  },
  {
    frage: "Wer hängt Banner an den Zaun?",
    antwort: "Banner und Bühne. Die Firma, die den Zaun stellt, hat das Hauptmotiv.",
  },
  {
    frage: "Gibt es Fotos?",
    antwort: "Von eurer Fläche, soweit vorhanden.",
  },
];

const BAND_RANK: Record<Sichtbarkeit, number> = {
  liste: 1,
  banner: 2,
  buehne: 3,
};

export function normalizeFlaecheId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return FLAECHE_ID_ALIASES[id] ?? id;
}

export function normalizePostenId(id: string | null | undefined): string | undefined {
  return normalizeFlaecheId(id);
}

export function normalizeStufe(stufe: string | null | undefined): Sichtbarkeit | undefined {
  if (!stufe) return undefined;
  if (stufe in STUFE_ALIASES) return STUFE_ALIASES[stufe];
  if (stufe === "liste" || stufe === "banner" || stufe === "buehne") return stufe;
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
  const suffix = status !== "offen" ? ` (${STATUS_LABEL[status]})` : "";
  return `${f.titel}${suffix}`;
}

export function vorschlagBand(flaeche: SponsorFlaeche | undefined): Sichtbarkeit {
  if (!flaeche) return "liste";
  return flaeche.vorgeschlagenesBand;
}

export function bandAusQuery(stufe: string | null, flaeche: SponsorFlaeche | undefined): Sichtbarkeit {
  if (flaeche) return vorschlagBand(flaeche);
  return normalizeStufe(stufe) ?? "liste";
}

export function anfrageWegAusQuery(
  stufe: string | null,
  flaecheId: string | null,
  postenId: string | null = null,
): AnfrageWeg {
  const flaeche = getFlaeche(flaecheParamAusSearch(flaecheId, postenId));
  if (flaeche) return "flaeche";
  return "stufe";
}

export function bandWarnung(flaeche: SponsorFlaeche | undefined, band: Sichtbarkeit): string | null {
  if (!flaeche) return null;
  if (BAND_RANK[band] < BAND_RANK[flaeche.minBand]) {
    return `Wer diese Fläche übernimmt, kommt auf die ${BAND_LABEL[flaeche.minBand]}. Kleiner nur nach Absprache.`;
  }
  return null;
}

export function beitragsartWarnung(
  flaeche: SponsorFlaeche | undefined,
  beitragsart: Beitragsart,
): string | null {
  if (!flaeche || !isSachspendeFlaeche(flaeche)) return null;
  if (beitragsart === "geld") {
    return "Diese Fläche ist eine Sachspende. Geld allein bucht sie nicht.";
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
  const label = flaeche.aktionLabel ? `${flaeche.aktionLabel} anfragen` : "Diese Fläche anfragen";
  return {
    href: `/sponsor-werden?stufe=${band}&flaeche=${flaeche.id}#anfrage`,
    label,
  };
}

export function ctaFuerPosten(flaeche: SponsorFlaeche): { href: string; label: string } {
  return ctaFuerFlaeche(flaeche);
}

export function normalizeAnfrageWeg(v: unknown): AnfrageWeg | null {
  if (v === "stufe" || v === "paket") return "stufe";
  if (v === "flaeche") return "flaeche";
  return null;
}

export function isAnfrageWeg(v: unknown): v is AnfrageWeg {
  return normalizeAnfrageWeg(v) !== null;
}

export function isAnfrageArt(v: unknown): v is AnfrageWeg {
  return isAnfrageWeg(v);
}

export function isSichtbarkeit(v: unknown): v is Sichtbarkeit {
  return v === "liste" || v === "banner" || v === "buehne";
}

export function isBeitragsband(v: unknown): v is Beitragsband {
  return isSichtbarkeit(v);
}

export function isBeitragsart(v: unknown): v is Beitragsart {
  return v === "geld" || v === "sach" || v === "beides";
}

export function submitLabel(
  weg: AnfrageWeg,
  band: Sichtbarkeit,
  flaeche?: SponsorFlaeche,
): string {
  if (weg === "flaeche" && flaeche && isSachspendeFlaeche(flaeche)) return "Sachspende anfragen";
  if (band === "liste") return "Liste anfragen";
  if (band === "banner") return "Banner anfragen";
  if (band === "buehne") return "Bühne anfragen";
  return "Anfrage senden";
}
