/** Rohzeile der Race-Result-Adressliste (Simple API). */
export interface OrgaParticipant {
  bib: string;
  name: string;
  nachname: string;
  vorname: string;
  jahrgang: string;
  geschlecht: string;
  verein: string;
  wettbewerb: string;
  mail: string;
  tshirtRaw: string;
  tshirtSize: string | null;
  abendkarten: number;
  paymentStatus: string;
}

export interface SizeCount {
  size: string;
  count: number;
}

export interface OrgaFields {
  present: string[];
  mail: boolean;
  tshirt: boolean;
  abendkarte: boolean;
  bib: boolean;
  payment: boolean;
}

export interface ShirtRecipient {
  bib: string;
  name: string;
  nachname: string;
  vorname: string;
  size: string;
  paymentStatus: string;
}

export interface AbendkarteRecipient {
  bib: string;
  name: string;
  nachname: string;
  vorname: string;
  anzahl: number;
}

export interface StartunterlagenStreckeSummary {
  label: string;
  slug: string;
  teilnehmer: number;
  shirts: number;
  karten: number;
  distanz: string;
  startzeit: string;
}

export interface OrgaStats {
  fetchedAt: string;
  source: "raceresult" | "empty";
  error?: string;
  rowCount: number;
  fields: OrgaFields;
  hinweise: string[];
  participants: OrgaParticipant[];
  startunterlagen: StartunterlagenStreckeSummary[];
  tshirtTotal: number;
  tshirtBySize: SizeCount[];
  tshirtOhneGroesse: number;
  tshirtRecipients: ShirtRecipient[];
  abendkartenTotal: number;
  abendkartenPersonen: number;
  abendkartenRecipients: AbendkarteRecipient[];
  mailCount: number;
}

/** Öffentliche Admin-JSON-Antwort: keine Mails, keine Adressen. */
export interface OrgaAdminPayload {
  fetchedAt: string;
  source: OrgaStats["source"];
  error?: string;
  rowCount: number;
  fields: OrgaFields;
  hinweise: string[];
  tshirt: {
    total: number;
    bySize: SizeCount[];
    ohneGroesse: number;
    recipients: { bib: string; name: string; size: string; paymentStatus: string }[];
  };
  abendkarten: {
    totalKarten: number;
    personen: number;
    recipients: { bib: string; name: string; anzahl: number }[];
  };
  startunterlagen: StartunterlagenStreckeSummary[];
  mailCount: number;
}

export const KNOWN_ADRESSLISTE_HEADERS = [
  "Startnr.",
  "Name",
  "Jg.",
  "m/w",
  "Verein",
  "Wettbewerb",
  "Straße",
  "PLZ",
  "Ort",
  "Mail",
  "TShirt",
  "Abendkarte Tape Jam",
] as const;
