/** Sponsoring-Konzept Koderlauf 2027. Drei Rollen, öffentlich und fair. */

export type AnfrageArt = "partner" | "posten";
export type PostenRolle = "hauptsponsor" | "sachpartner";
export type PostenStatus = "offen" | "reserviert" | "vergeben";
export type Beitragsart = "geld" | "sach" | "beides";
export type TypischeRolle = PostenRolle | "je_nach_summe";

export const SPONSORING_2027 = {
  partnerPreis: 150,
  hauptsponsorAb: 500,
  kontaktEmail: "info@koderlauf.de",
  premiere2026: {
    anmeldungen: 400,
    finisher: 378,
    ortsteilEinwohner: 550,
  },
} as const;

export const ROLLE_LABEL: Record<PostenRolle, string> = {
  hauptsponsor: "Hauptsponsor",
  sachpartner: "Sachpartner",
};

export const STATUS_LABEL: Record<PostenStatus, string> = {
  offen: "OFFEN",
  reserviert: "RESERVIERT",
  vergeben: "VERGEBEN",
};

const POSTEN_ID_ALIASES: Record<string, string> = {
  "bauzaun-feld": "bauzaun-einzelfeld",
};

export const SPONSOR_ROLLEN: {
  id: "partner" | "hauptsponsor" | "sachpartner";
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
    preisLabel: "150 € bar",
    kurz: "Sichtbarkeit ohne Gegenstand – beliebig viele Partner.",
    leistungen: [
      "1× Banner am Bauzaun",
      "1× Banner am Zieleinlauf",
      "Erwähnung auf der Website",
      "Verlinkung auf Instagram",
    ],
    ctaHref: "/sponsor-werden?stufe=partner#anfrage",
    ctaLabel: "Partner werden",
  },
  {
    id: "hauptsponsor",
    name: "Hauptsponsor",
    preisLabel: "ab ca. 500 € + Posten",
    kurz: "Nur mit konkretem Event-Posten – Sache oder Geld dafür.",
    leistungen: [
      "Alles wie Partner",
      "Exklusive Werbung auf diesem Gegenstand",
      "Pro Posten nur eine Firma",
    ],
    ctaHref: "/sponsor-werden#posten",
    ctaLabel: "Posten ansehen",
  },
  {
    id: "sachpartner",
    name: "Sachpartner",
    preisLabel: "unter ca. 500 €",
    kurz: "Kleiner Posten oder kleine Sache – ehrlich benannt.",
    leistungen: [
      "Werbung nur am eigenen Posten",
      "Kleine Nennung auf der Website",
      "Kein automatisches Bauzaun-Paket",
    ],
    ctaHref: "/sponsor-werden#posten",
    ctaLabel: "Posten ansehen",
  },
];

export const ROLLEN_VERGLEICH: {
  leistung: string;
  partner: string;
  sachpartner: string;
  hauptsponsor: string;
}[] = [
  { leistung: "Website-Nennung", partner: "ja", sachpartner: "klein", hauptsponsor: "ja" },
  { leistung: "Instagram", partner: "ja", sachpartner: "nein", hauptsponsor: "ja" },
  { leistung: "Bauzaun-Paket", partner: "ja", sachpartner: "nein", hauptsponsor: "ja" },
  { leistung: "Exklusivfläche am Posten", partner: "nein", sachpartner: "ja", hauptsponsor: "ja" },
  { leistung: "Titel", partner: "Partner", sachpartner: "Sachpartner", hauptsponsor: "Hauptsponsor" },
  {
    leistung: "Richtwert",
    partner: "150 € bar",
    sachpartner: "unter ca. 500 €",
    hauptsponsor: "ab ca. 500 € + Posten",
  },
];

export interface Kostenposten {
  id: string;
  titel: string;
  /** 1 Satz für Karten */
  kurz: string;
  /** 1 Satz Werbefläche */
  werbungKurz: string;
  /** 1 Zeile Richtwert + Rolle */
  richtwertKurz: string;
  beschreibung: string;
  werbung: string;
  richtkosten: string;
  typischeRolle: TypischeRolle;
  aufteilbar?: string;
  hinweis?: string;
  status: PostenStatus;
}

export const KOSTENPARTNERSCHAFTEN: Kostenposten[] = [
  {
    id: "medaillen",
    titel: "Medaillen",
    kurz: "Finisher-Medaille inkl. Band und Aufkleber für alle Finisher plus Reserve.",
    werbungKurz: "Logo auf dem Medaillenband; Aufkleber optional.",
    richtwertKurz: "ca. 1,80 €/Finisher · bei 400 ca. 720–800 € · typisch Hauptsponsor",
    beschreibung:
      "Finisher-Medaille inkl. Band und Aufkleber für alle Finisher plus Reserve (ca. 5–10 %).",
    werbung: "Logo auf dem Band (Hauptplatz); Aufkleber optional mit Logo oder Claim.",
    richtkosten:
      "Stück × Menge: ca. 1,80 €/Finisher. Bei 400 Finishern ca. 720–800 €.",
    typischeRolle: "hauptsponsor",
    hinweis: "Sachsteller müssen nicht bar nachzahlen, wenn sie die Medaillen stellen.",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    kurz: "Druck der Startnummern für alle Starter plus Reserve (ohne Timing-Chip).",
    werbungKurz: "Logo unten auf der Startnummer – exklusiv.",
    richtwertKurz: "ca. 0,80–1,50 €/Starter · oft um 500 € · HS oder Sachpartner",
    beschreibung: "Druck der Startnummern für alle Starter plus Reserve. Ohne Zeitnahme-Chip.",
    werbung: "Logo unten auf der Startnummer – exklusiv für diesen Posten.",
    richtkosten: "ca. 0,80–1,50 €/Starter. Summe oft um oder über 500 €.",
    typischeRolle: "je_nach_summe",
    status: "offen",
  },
  {
    id: "streckenverpflegung",
    titel: "Streckenverpflegung",
    kurz: "Wasser, Iso, Obst und Becher an einer oder mehreren Stationen.",
    werbungKurz: "Schild „Verpflegung präsentiert von …“ an der Station.",
    richtwertKurz: "ca. 0,40–0,80 €/Starter/Station · HS oder Sachpartner",
    beschreibung: "Wasser, Iso, Obst, Becher und Müll an einer oder mehreren Stationen.",
    werbung: "Schild „Verpflegung präsentiert von …“ an der Station.",
    richtkosten: "ca. 0,40–0,80 €/Starter pro Station (Einkaufswert / Angebot).",
    typischeRolle: "je_nach_summe",
    aufteilbar: "Station A, Station B oder alle Stationen.",
    status: "offen",
  },
  {
    id: "zielverpflegung",
    titel: "Zielverpflegung",
    kurz: "Getränk und Kleinigkeit direkt nach dem Zieleinlauf.",
    werbungKurz: "Schild oder Theke am Ziel.",
    richtwertKurz: "ca. 0,80–1,50 €/Finisher · HS oder Sachpartner",
    beschreibung: "Getränk und Kleinigkeit direkt nach dem Zieleinlauf. Ziel-Bier ist ein eigener Posten.",
    werbung: "Schild oder Theke am Ziel.",
    richtkosten: "ca. 0,80–1,50 €/Finisher (Einkaufswert).",
    typischeRolle: "je_nach_summe",
    aufteilbar: "z. B. Getränke und Snack getrennt.",
    status: "offen",
  },
  {
    id: "ziel-bier",
    titel: "Ziel-Bier",
    kurz: "Ein Bier (o. ä.) für jeden Finisher am Ziel. Kinderlauf ausgenommen.",
    werbungKurz: "Zapfstelle oder Schild „Zielbier präsentiert von …“.",
    richtwertKurz: "ca. 1,00–2,00 €/Finisher · HS oder Sachpartner",
    beschreibung: "Ein Bier (o. ä.) für jeden Finisher am Ziel. Kinderlauf ausgenommen.",
    werbung: "Zapfstelle/Schild „Zielbier präsentiert von …“.",
    richtkosten: "ca. 1,00–2,00 €/Finisher (Gebinde und Ausschank).",
    typischeRolle: "je_nach_summe",
    hinweis: "Alkohol nur für Erwachsene.",
    status: "offen",
  },
  {
    id: "zielbogen",
    titel: "Zielbogen",
    kurz: "Start-/Zielbogen mit Branding – sehr fotogen.",
    werbungKurz: "Großes Logo auf dem Zielbogen.",
    richtwertKurz: "oft 300–800 € · HS oder Sachpartner je nach Gegenwert",
    beschreibung: "Start-/Zielbogen mit Branding. 2026: Jeremias am Start-/Zielbogen.",
    werbung: "Großes Logo auf dem Bogen – sehr sichtbar auf Fotos.",
    richtkosten: "Angebot oder Sachspende zum Einkaufswert, oft ca. 300–800 €.",
    typischeRolle: "je_nach_summe",
    status: "offen",
  },
  {
    id: "siegerpreise",
    titel: "Siegerpreise",
    kurz: "Sachpreise oder Gutscheine für Platzierungen und Altersklassen.",
    werbungKurz: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    richtwertKurz: "oft 150–400 € · typisch Sachpartner",
    beschreibung: "Sachpreise oder Gutscheine für Platzierungen und Altersklassen.",
    werbung: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    richtkosten: "Pauschale oft ca. 150–400 € Gesamttopf.",
    typischeRolle: "sachpartner",
    aufteilbar: "z. B. nur Frauenwertung, Trail oder Kinderlauf.",
    hinweis: "Hauptsponsor-Titel erst ab ca. 500 € Gegenwert.",
    status: "offen",
  },
  {
    id: "bauzaun-buendel",
    titel: "Bauzaun (Bündel)",
    kurz: "2–3 Felder oder ein Bereich am Bauzaun Start/Ziel.",
    werbungKurz: "Logo und Motiv auf den Bannern.",
    richtwertKurz: "ca. 200–250 € Druck · typisch Sachpartner",
    beschreibung: "2–3 Felder oder ein Bereich am Bauzaun Start/Ziel.",
    werbung: "Logo und Motiv auf den Bannern.",
    richtkosten: "ab ca. 200–250 € gesamt (Druck).",
    typischeRolle: "sachpartner",
    status: "offen",
  },
  {
    id: "bauzaun-einzelfeld",
    titel: "Bauzaun (Einzelfeld)",
    kurz: "Ein einzelnes Feld am Bauzaun.",
    werbungKurz: "Logo auf diesem einen Banner.",
    richtwertKurz: "ca. 80–100 € · Sachpartner · Add-on zu Partner 150 €",
    beschreibung: "Ein einzelnes Feld. Typisch unter 200 €.",
    werbung: "Logo auf diesem einen Banner.",
    richtkosten: "ca. 80–100 € bzw. unter 200 €.",
    typischeRolle: "sachpartner",
    hinweis: "Auch als Add-on zum Partner 150 € möglich.",
    status: "offen",
  },
];

export const SPONSOR_FAQ: { frage: string; antwort: string }[] = [
  {
    frage: "Muss ich nachzahlen, wenn ich die Sache stelle?",
    antwort: "Nein. Wer die Sache stellt, zahlt nicht bar nach. Der Richtwert dient nur zur Einordnung.",
  },
  {
    frage: "Wann ist ein Posten vergeben?",
    antwort: "Sobald eine Zusage feststeht, wechselt der Status auf VERGEBEN – öffentlich auf dieser Seite.",
  },
  {
    frage: "Bekomme ich den Titel Hauptsponsor mit einer Überweisung ohne Posten?",
    antwort: "Nein. Hauptsponsor gibt es nur mit einem konkreten Posten. Reines Geld ohne Posten bleibt Partner.",
  },
  {
    frage: "Kann ich nur eine Verpflegungsstation nehmen?",
    antwort: "Ja. Strecken- und Zielverpflegung sind aufteilbar – z. B. nur Station A oder nur Getränke.",
  },
  {
    frage: "Gibt es Fotos nach dem Lauf?",
    antwort:
      "Ja – ausgewählte Fotos eurer Fläche, soweit vorhanden. Keine Garantie für ein Aftermovie.",
  },
  {
    frage: "Partner plus Einzelfeld Bauzaun?",
    antwort: "Ja. Das Einzelfeld kann als Add-on zum Partner 150 € gebucht werden.",
  },
];

export const SPONSOR_ABLAUF = [
  { schritt: "1", titel: "Rolle oder Posten wählen", text: "Partner 150 € oder einen offenen Posten auswählen." },
  { schritt: "2", titel: "Kurz formulieren", text: "Geld, Sache oder beides – wir klären Details per Mail." },
  { schritt: "3", titel: "Verein meldet sich", text: "Rückfragen, Logo-Formate, Rechnungsadresse, Liefertermin falls Sache." },
];

export function normalizePostenId(id: string | null | undefined): string | undefined {
  if (!id) return undefined;
  return POSTEN_ID_ALIASES[id] ?? id;
}

export function rolleBadgeLabel(posten: Kostenposten): string {
  if (posten.typischeRolle === "hauptsponsor") return "Hauptsponsor";
  if (posten.typischeRolle === "sachpartner") return "Sachpartner";
  return "Hauptsponsor oder Sachpartner";
}

export function vorschlagRolle(posten: Kostenposten | undefined): PostenRolle {
  if (!posten) return "hauptsponsor";
  if (posten.typischeRolle === "sachpartner") return "sachpartner";
  if (posten.typischeRolle === "hauptsponsor") return "hauptsponsor";
  if (posten.id === "zielbogen" || posten.id === "medaillen" || posten.id === "startnummern") {
    return "hauptsponsor";
  }
  return "sachpartner";
}

export function rolleWarnung(posten: Kostenposten | undefined, rolle: PostenRolle): string | null {
  if (!posten || rolle !== "hauptsponsor") return null;
  if (posten.typischeRolle === "sachpartner") {
    return "Hauptsponsor gilt erst ab ca. 500 € Gegenwert und nur mit diesem konkreten Posten. Liegt der Beitrag darunter, wird daraus Sachpartner.";
  }
  if (posten.id === "siegerpreise" || posten.id === "bauzaun-einzelfeld" || posten.id === "bauzaun-buendel") {
    return "Dieser Posten ist typischerweise Sachpartner. Hauptsponsor nur ab ca. 500 € Gegenwert.";
  }
  return null;
}

export function ctaFuerPosten(posten: Kostenposten): { href: string; label: string } {
  const rolle = vorschlagRolle(posten);
  return {
    href: `/sponsor-werden?stufe=${rolle}&posten=${posten.id}#anfrage`,
    label: "Diesen Posten anfragen",
  };
}

export function getKostenposten(id: string | null | undefined): Kostenposten | undefined {
  const normalized = normalizePostenId(id);
  if (!normalized) return undefined;
  return KOSTENPARTNERSCHAFTEN.find((p) => p.id === normalized);
}

export function isAnfrageArt(v: unknown): v is AnfrageArt {
  return v === "partner" || v === "posten";
}

export function isPostenRolle(v: unknown): v is PostenRolle {
  return v === "hauptsponsor" || v === "sachpartner";
}

export function isBeitragsart(v: unknown): v is Beitragsart {
  return v === "geld" || v === "sach" || v === "beides";
}

export function anfrageArtAusQuery(stufe: string | null, postenId: string | null): AnfrageArt {
  if (stufe === "partner") return "partner";
  if (postenId || stufe === "hauptsponsor" || stufe === "sachpartner" || stufe === "posten") {
    return "posten";
  }
  return "partner";
}

export function rolleAusQuery(stufe: string | null, posten: Kostenposten | undefined): PostenRolle {
  if (isPostenRolle(stufe)) return stufe;
  return vorschlagRolle(posten);
}
