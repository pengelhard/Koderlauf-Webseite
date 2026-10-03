/** Sponsoring Koderlauf 2027 – drei Stufen, Sache ohne festgesetzten Preis. */

export type Sichtbarkeit = "unter100" | "unterstuetzer" | "sponsor" | "hauptsponsor";
export type Beitragsband = Sichtbarkeit;
export type AnfrageWeg = "stufe" | "flaeche";
export type FlaecheStatus = "offen" | "reserviert" | "vergeben";
export type FlaecheTyp = "sachspende" | "geld_oder_sache";
export type Beitragsart = "geld" | "sach" | "beides";

export const SPONSORING_2027 = {
  unterstuetzerAb: 100,
  sponsorAb: 250,
  hauptsponsorAb: 500,
  kontaktEmail: "info@koderlauf.de",
  wertHinweis:
    "Bei einer Geldspende ist es der Betrag. Bei einer Sachspende schätzt ihr den Wert. Die Zahl legt die Stufe fest. Unter 100 € nur eine Erwähnung auf der Website. Ab 100 € Unterstützer. Ab 250 € Sponsor. Ab 500 € Hauptsponsor.",
  premiere2026: {
    anmeldungen: 400,
    finisher: 378,
    ortsteilEinwohner: 550,
  },
} as const;

export const BAND_LABEL: Record<Sichtbarkeit, string> = {
  unter100: "Unter 100 €",
  unterstuetzer: "Unterstützer",
  sponsor: "Sponsor",
  hauptsponsor: "Hauptsponsor",
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
  streckenverpflegung: "verpflegung",
  strecke: "verpflegung",
  zielverpflegung: "verpflegung",
};

const STUFE_ALIASES: Record<string, Sichtbarkeit> = {
  foerderer: "sponsor",
  sachpartner: "sponsor",
  partner: "unterstuetzer",
  liste: "unter100",
  banner: "unterstuetzer",
  buehne: "hauptsponsor",
};

export const SPONSOR_STUFEN: {
  id: Sichtbarkeit;
  name: string;
  preisLabel: string;
  info: string;
  leistungen: string[];
  ctaHref: string;
  ctaLabel: string;
}[] = [
  {
    id: "unterstuetzer",
    name: "Unterstützer",
    preisLabel: "100 €",
    info: "Unter 100 € seid ihr herzlich willkommen. Dafür gibt es nur eine Erwähnung auf der Website. Ein Bannerfeld am Bauzaun gibt es ab 100 €.",
    leistungen: ["Banner am Bauzaun", "Kleines Logo und Name auf der Website"],
    ctaHref: "/sponsor-werden#anfrage",
    ctaLabel: "Unterstützer anfragen",
  },
  {
    id: "sponsor",
    name: "Sponsor",
    preisLabel: "250 €",
    info: "",
    leistungen: [
      "Alles aus 100 €",
      "Banner am Gitter Zieleinlauf",
      "Etwas größeres Logo auf der Website",
      "Instagram",
    ],
    ctaHref: "/sponsor-werden#anfrage",
    ctaLabel: "Sponsor anfragen",
  },
  {
    id: "hauptsponsor",
    name: "Hauptsponsor",
    preisLabel: "ab 500 €",
    info: "",
    leistungen: [
      "Alles aus 250 €",
      "Banner an der Bühne",
      "Logo ganz oben, sehr präsent",
      "Dank bei der Siegerehrung",
    ],
    ctaHref: "/sponsor-werden#anfrage",
    ctaLabel: "Hauptsponsor anfragen",
  },
];

export interface SponsorFlaeche {
  id: string;
  titel: string;
  kurz: string;
  typ: FlaecheTyp;
  status: FlaecheStatus;
  beschreibung?: string;
  hinweis?: string;
  komplettHaelften?: [string, string];
  halfteVon?: string;
  mehrereMoeglich?: boolean;
  aktionLabel?: string;
}

export const SPONSOR_FLAECHEN: SponsorFlaeche[] = [
  {
    id: "bauzaun",
    titel: "Bauzaun stellen",
    kurz: "Zum Absperren und als Absperrung am Zieleinlauf.",
    typ: "sachspende",
    status: "offen",
    aktionLabel: "Zaun stellen",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen stellen",
    kurz: "Ihr stellt einen Zielbogen mit eigenem Logo.",
    typ: "sachspende",
    status: "offen",
    aktionLabel: "Bogen stellen",
  },
  {
    id: "ziel-bier",
    titel: "Bier für Finisher",
    kurz: "Ein Bier für jeden Finisher. Ideal für eine Brauerei: Das Bier ist die Werbung.",
    typ: "geld_oder_sache",
    status: "offen",
    aktionLabel: "Bier stellen",
  },
  {
    id: "medaillen",
    titel: "Medaillen",
    kurz: "Wir gestalten die Medaille. Werbung kann auf dem Band präsentiert werden.",
    beschreibung: "Beim Design helfen wir gerne.",
    typ: "geld_oder_sache",
    komplettHaelften: ["medaillen-a", "medaillen-b"],
    status: "offen",
  },
  {
    id: "medaillen-a",
    titel: "Medaillen – Band",
    kurz: "Logo auf dem Band.",
    typ: "geld_oder_sache",
    halfteVon: "medaillen",
    status: "offen",
  },
  {
    id: "medaillen-b",
    titel: "Medaillen – Aufkleber",
    kurz: "Logo auf dem Aufkleber.",
    typ: "geld_oder_sache",
    halfteVon: "medaillen",
    status: "offen",
  },
  {
    id: "preise",
    titel: "Siegerpreise",
    kurz: "Zum Beispiel Gutscheine oder etwas aus eurem Sortiment.",
    beschreibung: "Vorschläge stimmen wir mit euch ab. Wir kommen auf euch zurück.",
    typ: "geld_oder_sache",
    komplettHaelften: ["preise-1", "preise-2"],
    status: "offen",
  },
  {
    id: "preise-1",
    titel: "Siegerpreise – Paket 1",
    kurz: "Spielerei, Trailrun, Koderrunde Lauf.",
    typ: "geld_oder_sache",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "preise-2",
    titel: "Siegerpreise – Paket 2",
    kurz: "Kinderlauf, Koderrunde Walking, Kurz und knackig.",
    typ: "geld_oder_sache",
    halfteVon: "preise",
    status: "offen",
  },
  {
    id: "verpflegung",
    titel: "Verpflegung",
    kurz: "Ziel und Strecke. Schreibt, was ihr bieten könnt.",
    beschreibung: "Wir kommen auf euch zurück und stimmen das mit euch ab.",
    typ: "geld_oder_sache",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    kurz: "Logo und Name auf der Startnummer.",
    typ: "geld_oder_sache",
    status: "offen",
  },
];

/** Sichtbare Sachspenden, ohne Aufteilungs-Slots. */
export const SACHSPENDEN_SICHTBAR = SPONSOR_FLAECHEN.filter((f) => !f.halfteVon);

export function werbeleistungKurz(stufe: Sichtbarkeit): string {
  switch (stufe) {
    case "unter100":
      return "Kleines Logo und Name auf der Website, wie 2026.";
    case "unterstuetzer":
      return "Banner am Bauzaun. Kleines Logo und Name auf der Website.";
    case "sponsor":
      return "Banner am Zieleinlauf, etwas größeres Logo, Instagram, plus alles ab 100 €.";
    case "hauptsponsor":
      return "Banner an der Bühne, Logo ganz oben und sehr präsent, Dank bei der Siegerehrung, plus alles ab 250 €.";
  }
}

export function brauchtAngebot(id: string | null | undefined): boolean {
  return id === "preise" || id === "verpflegung";
}

export function stufeAusWert(wert: number): Sichtbarkeit {
  if (!Number.isFinite(wert) || wert < SPONSORING_2027.unterstuetzerAb) return "unter100";
  if (wert < SPONSORING_2027.sponsorAb) return "unterstuetzer";
  if (wert < SPONSORING_2027.hauptsponsorAb) return "sponsor";
  return "hauptsponsor";
}

export function stufeHinweis(wert: number): string {
  const stufe = stufeAusWert(wert);
  const betrag = new Intl.NumberFormat("de-DE", { maximumFractionDigits: 2 }).format(wert);
  if (stufe === "unter100") return `Bei ${betrag} € gibt es die Erwähnung auf der Website.`;
  return `Bei ${betrag} € seid ihr ${BAND_LABEL[stufe]}.`;
}

export function getFlaeche(id: string | null | undefined): SponsorFlaeche | undefined {
  const normalized = normalizeFlaecheId(id);
  if (!normalized) return undefined;
  return SPONSOR_FLAECHEN.find((f) => f.id === normalized);
}

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
  if (stufe === "unter100" || stufe === "unterstuetzer" || stufe === "sponsor" || stufe === "hauptsponsor") {
    return stufe;
  }
  return undefined;
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
    if (getFlaeche(a)?.status === "vergeben" || getFlaeche(b)?.status === "vergeben") return "vergeben";
  }
  return flaeche.status;
}

export function isFlaecheBuchbar(id: string): boolean {
  const f = getFlaeche(id);
  if (!f) return false;
  if (getEffectiveStatus(f) === "vergeben") return false;
  if (f.komplettHaelften) {
    const [a, b] = f.komplettHaelften;
    if (getFlaeche(a)?.status === "vergeben" || getFlaeche(b)?.status === "vergeben") return false;
  }
  if (f.halfteVon && getFlaeche(f.halfteVon)?.status === "vergeben") return false;
  return true;
}

export function flaecheOptionLabel(f: SponsorFlaeche): string {
  const status = getEffectiveStatus(f);
  return status === "offen" ? f.titel : `${f.titel} (${STATUS_LABEL[status]})`;
}

export function vorschlagBand(): Sichtbarkeit {
  return "unterstuetzer";
}

export function bandAusQuery(stufe: string | null): Sichtbarkeit {
  return normalizeStufe(stufe) ?? "unterstuetzer";
}

export function anfrageWegAusQuery(
  stufe: string | null,
  flaecheId: string | null,
  postenId: string | null = null,
): AnfrageWeg {
  if (getFlaeche(flaecheParamAusSearch(flaecheId, postenId))) return "flaeche";
  if (normalizeStufe(stufe)) return "stufe";
  return "stufe";
}

export function beitragsartWarnung(
  flaeche: SponsorFlaeche | undefined,
  beitragsart: Beitragsart,
): string | null {
  if (!flaeche || !isSachspendeFlaeche(flaeche)) return null;
  if (beitragsart === "geld") {
    return "Diese Sache muss geliefert werden. Geld allein ersetzt sie nicht.";
  }
  return null;
}

export function isBeitragsartGueltig(flaeche: SponsorFlaeche | undefined, beitragsart: Beitragsart): boolean {
  if (!flaeche) return true;
  if (isSachspendeFlaeche(flaeche) && beitragsart === "geld") return false;
  return true;
}

export function defaultBeitragsart(flaeche: SponsorFlaeche | undefined): Beitragsart {
  if (flaeche) return "sach";
  return "geld";
}

export function ctaFuerFlaeche(flaeche: SponsorFlaeche): { href: string; label: string } {
  return {
    href: `/sponsor-werden?flaeche=${flaeche.id}#anfrage`,
    label: "Wert nennen",
  };
}

export function normalizeAnfrageWeg(v: unknown): AnfrageWeg | null {
  if (v === "stufe" || v === "paket") return "stufe";
  if (v === "flaeche") return "flaeche";
  return null;
}

export function isAnfrageWeg(v: unknown): v is AnfrageWeg {
  return normalizeAnfrageWeg(v) !== null;
}

export function isSichtbarkeit(v: unknown): v is Sichtbarkeit {
  return v === "unter100" || v === "unterstuetzer" || v === "sponsor" || v === "hauptsponsor";
}

export function isBeitragsband(v: unknown): v is Beitragsband {
  return isSichtbarkeit(v);
}

export function isBeitragsart(v: unknown): v is Beitragsart {
  return v === "geld" || v === "sach" || v === "beides";
}

export function submitLabel(band: Sichtbarkeit): string {
  if (band === "unter100") return "Anfragen";
  if (band === "unterstuetzer") return "Unterstützer anfragen";
  if (band === "sponsor") return "Sponsor anfragen";
  if (band === "hauptsponsor") return "Hauptsponsor anfragen";
  return "Anfragen";
}
