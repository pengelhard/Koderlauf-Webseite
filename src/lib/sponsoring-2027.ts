/** Sponsoring-Konzept Koderlauf 2027. Zwei Stufen + Kostenpartnerschaften. */

export type SponsorStufe = "partner" | "hauptsponsor";
export type PostenStatus = "offen" | "reserviert" | "vergeben";

export const SPONSORING_2027 = {
  partnerPreis: 150,
  hauptsponsorAb: 500,
  hauptsponsorDeckel: 1000,
  ticketsHauptsponsor: 5,
  soloSchwelleEuro: 200,
} as const;

export const SPONSOR_STUFEN: {
  id: SponsorStufe;
  name: string;
  preisLabel: string;
  kurz: string;
  leistungen: string[];
}[] = [
  {
    id: "partner",
    name: "Partner",
    preisLabel: "150 €",
    kurz: "Sichtbarkeit am Event und digital – klarer Einstieg.",
    leistungen: [
      "1× Banner am Bauzaun",
      "1× Banner Zieleinlauf (niedriges Absperrgitter)",
      "Erwähnung auf der Website",
      "Verlinkung auf Instagram",
    ],
  },
  {
    id: "hauptsponsor",
    name: "Hauptsponsor",
    preisLabel: "ab 500 €",
    kurz: "Alles wie Partner, plus starke Fläche und ein konkreter Posten.",
    leistungen: [
      "alles wie Partner",
      "Logo auf der Startnummer (exklusive Fläche)",
      `${SPONSORING_2027.ticketsHauptsponsor} Starttickets`,
      "Werbung auf dem gewählten Gegenstand der Kostenpartnerschaft",
    ],
  },
];

export interface Kostenposten {
  id: string;
  titel: string;
  beschreibung: string;
  werbung: string;
  richtkosten: string;
  aufteilbar?: string;
  hinweis?: string;
  status: PostenStatus;
}

export const KOSTENPARTNERSCHAFTEN: Kostenposten[] = [
  {
    id: "medaillen",
    titel: "Medaillen",
    beschreibung:
      "Finisher-Medaille inkl. Band und Aufkleber für alle Finisher plus Reserve (ca. 5–10 %).",
    werbung: "Logo auf dem Band (Hauptplatz); Aufkleber optional mit Logo oder Claim.",
    richtkosten:
      "ca. 1,80 €/Finisher (Medaille 1,50 € + Band 0,20 € + Aufkleber 0,10 €). Bei 400 Finishern ca. 720–800 €.",
    hinweis: `Hauptsponsor-Geldanteil max. ${SPONSORING_2027.hauptsponsorDeckel.toLocaleString("de-DE")} € – den Rest trägt der Verein.`,
    status: "offen",
  },
  {
    id: "bauzaun",
    titel: "Bauzaun (Bündel)",
    beschreibung:
      "Werbeflächen am Bauzaun Start/Ziel. Ein Einzelfeld liegt typisch unter 200 € und ist deshalb kein Solo-Einstieg.",
    werbung: "Logo und Motiv auf dem Banner am Bauzaun.",
    richtkosten: "2–3 Felder bzw. Bereich ab ca. 200–250 € gesamt.",
    hinweis: "Einzelnes Extra-Feld nur als Add-on zum Partner (ca. 80–100 €, nach Absprache).",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    beschreibung: "Druck der Startnummern für alle Starter plus Reserve. Ohne Zeitnahme-Chip.",
    werbung: "Logo unten auf der Startnummer – exklusiv für diesen Paten bzw. Hauptsponsor.",
    richtkosten: "ca. 0,80–1,50 €/Starter.",
    hinweis: "Die Logo-Fläche wird nicht parallel an zwei Partner verkauft.",
    status: "offen",
  },
  {
    id: "streckenverpflegung",
    titel: "Streckenverpflegung",
    beschreibung: "Wasser, Iso, Obst, Becher und Müll an einer oder mehreren Stationen.",
    werbung: "Schild „Verpflegung präsentiert von …“ an der Station.",
    richtkosten: "ca. 0,40–0,80 €/Starter pro Station (Richtwert).",
    aufteilbar: "Station A, Station B oder alle Stationen.",
    status: "offen",
  },
  {
    id: "zielverpflegung",
    titel: "Zielverpflegung",
    beschreibung: "Getränk und Kleinigkeit direkt nach dem Zieleinlauf. Ziel-Bier ist ein eigener Posten.",
    werbung: "Schild oder Theke am Ziel; optional Becher oder Servietten.",
    richtkosten: "ca. 0,80–1,50 €/Finisher.",
    aufteilbar: "z. B. Getränke-Pate und Snack-Pate.",
    status: "offen",
  },
  {
    id: "zielbier",
    titel: "Ziel-Bier",
    beschreibung: "Ein Bier (o. ä.) für jeden Finisher am Ziel. Kinderlauf ausgenommen.",
    werbung: "Zapfstelle/Schild „Zielbier präsentiert von …“; Nennung bei Siegerehrung.",
    richtkosten: "ca. 1,00–2,00 €/Finisher (je Gebinde und Ausschank).",
    hinweis: "Alkohol nur für Erwachsene – bitte klar kommunizieren.",
    status: "offen",
  },
  {
    id: "siegerpreise",
    titel: "Siegerpreise",
    beschreibung: "Sachpreise oder Gutscheine für Platzierungen und Altersklassen.",
    werbung: "Übergabe, Nennung bei der Siegerehrung, Foto-Post.",
    richtkosten: "Pauschale ca. 150–400 € Gesamttopf oder einzelne Preise.",
    aufteilbar: "z. B. nur Frauenwertung, Trail oder Kinderlauf.",
    status: "offen",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen",
    beschreibung: "Start-/Zielbogen mit Branding. 2026: Jeremias am Start-/Zielbogen.",
    werbung: "Großes Logo auf dem Bogen – sehr sichtbar auf Fotos.",
    richtkosten: "Sachspende (Druck/Gestellung) oder Pauschale ca. 300–800 €.",
    status: "offen",
  },
];

export const STATUS_LABEL: Record<PostenStatus, string> = {
  offen: "offen",
  reserviert: "reserviert",
  vergeben: "vergeben",
};

export function getKostenposten(id: string | null | undefined): Kostenposten | undefined {
  if (!id) return undefined;
  return KOSTENPARTNERSCHAFTEN.find((p) => p.id === id);
}

export function isSponsorStufe(v: unknown): v is SponsorStufe {
  return v === "partner" || v === "hauptsponsor";
}
