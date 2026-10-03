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
  zuordnungSatz: "Ihr sagt, was die Sache wert ist. Daraus seht ihr die Stufe.",
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
  streckenverpflegung: "strecke",
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
    info: "Ab 100 €. Darunter steht nur der Name auf der Website.",
    leistungen: [
      "Banner am Bauzaun",
      "Banner am Gitter Zieleinlauf",
      "Instagram",
      "Website",
    ],
    ctaHref: "/sponsor-werden?stufe=unterstuetzer#anfrage",
    ctaLabel: "Unterstützer anfragen",
  },
  {
    id: "sponsor",
    name: "Sponsor",
    preisLabel: "250 €",
    info: "Ab 250 €. Mittleres Banner und größeres Logo, plus alles aus 100 €.",
    leistungen: [
      "Alles aus 100 €",
      "Mittleres Banner am Bauzaun",
      "Größeres Logo auf der Website",
    ],
    ctaHref: "/sponsor-werden?stufe=sponsor#anfrage",
    ctaLabel: "Sponsor anfragen",
  },
  {
    id: "hauptsponsor",
    name: "Hauptsponsor",
    preisLabel: "ab 500 €",
    info: "Ab 500 €. Großes Banner und Dank bei der Siegerehrung, plus alles aus 250 €.",
    leistungen: [
      "Alles aus 250 €",
      "Großes Banner",
      "Logo oben auf der Website",
      "Dank bei der Siegerehrung",
    ],
    ctaHref: "/sponsor-werden?stufe=hauptsponsor#anfrage",
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
    kurz: "Gestell, Transport und Aufbau.",
    typ: "sachspende",
    beschreibung: "Bitte den Zaun stellen. Eine Überweisung ersetzt das nicht.",
    status: "reserviert",
    aktionLabel: "Zaun stellen",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen stellen",
    kurz: "Eigener Bogen mit Logo.",
    typ: "sachspende",
    beschreibung: "Ein geliehener Neutralbogen hat kein eigenes Logo.",
    status: "offen",
    aktionLabel: "Bogen stellen",
  },
  {
    id: "ziel-bier",
    titel: "Ziel-Bier stellen",
    kurz: "Für erwachsene Finisher.",
    typ: "sachspende",
    beschreibung: "Ohne Bier ist es diese Sache nicht.",
    status: "offen",
    aktionLabel: "Bier stellen",
  },
  {
    id: "medaillen",
    titel: "Medaillen",
    kurz: "Band und Aufkleber, oder getrennt.",
    typ: "geld_oder_sache",
    hinweis: "Im Gespräch, noch nicht fest.",
    komplettHaelften: ["medaillen-a", "medaillen-b"],
    status: "reserviert",
  },
  {
    id: "medaillen-a",
    titel: "Medaillen – Band",
    kurz: "Logo auf dem Band.",
    typ: "geld_oder_sache",
    halfteVon: "medaillen",
    status: "reserviert",
  },
  {
    id: "medaillen-b",
    titel: "Medaillen – Aufkleber",
    kurz: "Logo auf dem Aufkleber.",
    typ: "geld_oder_sache",
    halfteVon: "medaillen",
    status: "reserviert",
  },
  {
    id: "preise",
    titel: "Siegerpreise",
    kurz: "6 Läufe, oder zwei Pakete.",
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
    id: "zielverpflegung",
    titel: "Zielverpflegung",
    kurz: "Getränk und Kleinigkeit, ohne Bier.",
    typ: "geld_oder_sache",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    kurz: "Logo unten auf der Nummer.",
    typ: "geld_oder_sache",
    status: "offen",
  },
  {
    id: "strecke",
    titel: "Streckenverpflegung",
    kurz: "Wasser, Iso, Obst.",
    typ: "geld_oder_sache",
    status: "offen",
  },
];

/** Sichtbare Sachspenden, ohne Aufteilungs-Slots. */
export const SACHSPENDEN_SICHTBAR = SPONSOR_FLAECHEN.filter((f) => !f.halfteVon);

export function werbeleistungKurz(stufe: Sichtbarkeit): string {
  switch (stufe) {
    case "unter100":
      return "Nur Name auf der Website.";
    case "unterstuetzer":
      return "Banner am Bauzaun und am Gitter Zieleinlauf, Instagram, Website.";
    case "sponsor":
      return "Mittleres Banner, größeres Logo, plus alles ab 100 €.";
    case "hauptsponsor":
      return "Großes Banner, Dank bei der Siegerehrung, plus alles ab 250 €.";
  }
}

export function stufeAusWert(wert: number): Sichtbarkeit {
  if (!Number.isFinite(wert) || wert < SPONSORING_2027.unterstuetzerAb) return "unter100";
  if (wert < SPONSORING_2027.sponsorAb) return "unterstuetzer";
  if (wert < SPONSORING_2027.hauptsponsorAb) return "sponsor";
  return "hauptsponsor";
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
