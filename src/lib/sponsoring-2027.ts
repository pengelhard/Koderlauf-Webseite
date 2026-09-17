/** Sponsoring-Konzept Koderlauf 2027. Drei Rollen, öffentlich und fair. */

export type AnfrageArt = "partner" | "posten";
export type PostenRolle = "hauptsponsor" | "sachpartner";
export type PostenStatus = "offen" | "reserviert" | "vergeben";
export type Beitragsart = "geld" | "sach" | "beides";
export type TypischeRolle = PostenRolle | "je_nach_summe";

export const SPONSORING_2027 = {
  partnerPreis: 150,
  hauptsponsorAb: 500,
  soloSchwelleEuro: 200,
} as const;

export const ROLLE_LABEL: Record<PostenRolle, string> = {
  hauptsponsor: "Hauptsponsor",
  sachpartner: "Sachpartner",
};

export const STATUS_LABEL: Record<PostenStatus, string> = {
  offen: "offen",
  reserviert: "reserviert",
  vergeben: "vergeben",
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
    kurz: "Sichtbarkeit ohne Gegenstand. Beliebig viele Partner.",
    leistungen: [
      "1× Banner am Bauzaun",
      "1× Banner Zieleinlauf (niedriges Absperrgitter)",
      "Erwähnung auf der Website",
      "Verlinkung auf Instagram",
    ],
    ctaHref: "/sponsor-werden?stufe=partner#anfrage",
    ctaLabel: "Partner werden (150 €)",
  },
  {
    id: "hauptsponsor",
    name: "Hauptsponsor",
    preisLabel: "Posten ab ca. 500 €",
    kurz: "Nur wer einen konkreten Event-Posten trägt – Sache oder Geld dafür. Kein Titel nur mit Überweisung.",
    leistungen: [
      "alles wie Partner",
      "Werbung auf diesem Gegenstand (pro Posten nur eine Firma)",
      "Richtwert ab ca. 500 € Gegenwert",
    ],
    ctaHref: "/sponsor-werden#posten",
    ctaLabel: "Posten wählen",
  },
  {
    id: "sachpartner",
    name: "Sachpartner",
    preisLabel: "Posten unter ca. 500 €",
    kurz: "Kleine Sache oder kleiner Posten – ehrlich benannt, kein abgeschwächter Hauptsponsor.",
    leistungen: [
      "Werbung nur am eigenen Posten",
      "kleine Nennung auf der Website",
      "kein Bauzaun-Paket automatisch",
    ],
    ctaHref: "/sponsor-werden#posten",
    ctaLabel: "Posten wählen",
  },
];

export interface Kostenposten {
  id: string;
  titel: string;
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
    beschreibung:
      "Finisher-Medaille inkl. Band und Aufkleber für alle Finisher plus Reserve (ca. 5–10 %).",
    werbung: "Logo auf dem Band (Hauptplatz); Aufkleber optional mit Logo oder Claim.",
    richtkosten:
      "Stück × Menge: ca. 1,80 €/Finisher (1,50 + 0,20 Band + 0,10 Aufkleber). Bei 400 Finishern ca. 720–800 €.",
    typischeRolle: "hauptsponsor",
    hinweis: "Sachsteller müssen nicht bar nachzahlen, wenn sie die Medaillen stellen.",
    status: "offen",
  },
  {
    id: "startnummern",
    titel: "Startnummern",
    beschreibung: "Druck der Startnummern für alle Starter plus Reserve. Ohne Zeitnahme-Chip.",
    werbung: "Logo unten auf der Startnummer – exklusiv für diesen Posten.",
    richtkosten: "ca. 0,80–1,50 €/Starter. Summe oft um oder über 500 €, je nach Meldezahl.",
    typischeRolle: "je_nach_summe",
    hinweis: "Die Logo-Fläche wird nicht parallel an zwei Firmen verkauft.",
    status: "offen",
  },
  {
    id: "streckenverpflegung",
    titel: "Streckenverpflegung",
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
    beschreibung: "Getränk und Kleinigkeit direkt nach dem Zieleinlauf. Ziel-Bier ist ein eigener Posten.",
    werbung: "Schild oder Theke am Ziel.",
    richtkosten: "ca. 0,80–1,50 €/Finisher (Einkaufswert, z. B. Edeka).",
    typischeRolle: "je_nach_summe",
    aufteilbar: "z. B. Getränke und Snack getrennt.",
    hinweis: "Große Verpflegung ≥ ca. 500 € → Hauptsponsor Verpflegung. Kleiner Snack → Sachpartner.",
    status: "offen",
  },
  {
    id: "zielbier",
    titel: "Ziel-Bier",
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
    beschreibung: "Start-/Zielbogen mit Branding. 2026: Jeremias am Start-/Zielbogen.",
    werbung: "Großes Logo auf dem Bogen – sehr sichtbar auf Fotos.",
    richtkosten: "Angebot oder Sachspende zum Einkaufswert, oft ca. 300–800 €.",
    typischeRolle: "je_nach_summe",
    hinweis: "Ab ca. 500 € Gegenwert Hauptsponsor Zielbogen, sonst Sachpartner.",
    status: "offen",
  },
  {
    id: "siegerpreise",
    titel: "Siegerpreise",
    beschreibung: "Sachpreise oder Gutscheine für Platzierungen und Altersklassen.",
    werbung: "Übergabe, Nennung bei der Siegerehrung, Foto.",
    richtkosten: "Pauschale oft ca. 150–400 € Gesamttopf.",
    typischeRolle: "sachpartner",
    aufteilbar: "z. B. nur Frauenwertung, Trail oder Kinderlauf.",
    hinweis: "Erst ab ca. 500 € Gegenwert Hauptsponsor-Titel.",
    status: "offen",
  },
  {
    id: "bauzaun-buendel",
    titel: "Bauzaun (Bündel)",
    beschreibung: "2–3 Felder oder ein Bereich am Bauzaun Start/Ziel.",
    werbung: "Logo und Motiv auf den Bannern.",
    richtkosten: "ab ca. 200–250 € gesamt (Druck). Hauptsponsor erst ab ca. 500 € Gegenwert.",
    typischeRolle: "sachpartner",
    status: "offen",
  },
  {
    id: "bauzaun-feld",
    titel: "Bauzaun (Einzelfeld)",
    beschreibung: "Ein einzelnes Feld. Typisch unter 200 € – kein Solo-Hauptsponsor.",
    werbung: "Logo auf diesem einen Banner.",
    richtkosten: "ca. 80–100 € bzw. unter 200 €.",
    typischeRolle: "sachpartner",
    hinweis: "Auch als Add-on zum Partner 150 € möglich.",
    status: "offen",
  },
];

export function rolleHinweis(posten: Kostenposten): string {
  if (posten.typischeRolle === "hauptsponsor") {
    return "Typische Rolle: Hauptsponsor (Richtwert ab ca. 500 €).";
  }
  if (posten.typischeRolle === "sachpartner") {
    return "Typische Rolle: Sachpartner (unter ca. 500 € Gegenwert).";
  }
  return "Rolle je nach Gegenwert: ab ca. 500 € Hauptsponsor, darunter Sachpartner.";
}

export function ctaFuerPosten(posten: Kostenposten): { href: string; label: string } {
  const rolle: PostenRolle =
    posten.typischeRolle === "sachpartner" ? "sachpartner" : "hauptsponsor";
  const label =
    posten.typischeRolle === "hauptsponsor"
      ? "Als Hauptsponsor anfragen"
      : posten.typischeRolle === "sachpartner"
        ? "Als Sachpartner anfragen"
        : "Diesen Posten anfragen";
  return {
    href: `/sponsor-werden?stufe=${rolle}&posten=${posten.id}#anfrage`,
    label,
  };
}

export function getKostenposten(id: string | null | undefined): Kostenposten | undefined {
  if (!id) return undefined;
  return KOSTENPARTNERSCHAFTEN.find((p) => p.id === id);
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

/** Alte Links ?stufe=hauptsponsor ohne Posten → Posten-Anfrage. */
export function anfrageArtAusQuery(stufe: string | null, postenId: string | null): AnfrageArt {
  if (stufe === "partner") return "partner";
  if (postenId || stufe === "hauptsponsor" || stufe === "sachpartner" || stufe === "posten") {
    return "posten";
  }
  return "partner";
}

export function rolleAusQuery(stufe: string | null, posten: Kostenposten | undefined): PostenRolle {
  if (isPostenRolle(stufe)) return stufe;
  if (posten?.typischeRolle === "sachpartner") return "sachpartner";
  return "hauptsponsor";
}
