/**
 * Server-only: volle Sponsoren-Stammdaten für das Orga-PDF.
 * Nicht in Client-Komponenten importieren – Telefon/Mail sollen nicht
 * im öffentlichen JavaScript landen.
 *
 * Quelle: Code-Liste (Website) + optionales Overlay für Kontakte.
 * Wenn die Tabelle `sponsors` in Supabase existiert und Zeilen hat,
 * gewinnt die Datenbank (analog Demo-Fallback der restlichen App).
 */
import {
  getPublicSponsors,
  type PublicSponsor,
  type SponsorYear,
} from "./sponsors-public.ts";
import { createAdminSupabaseClient } from "../supabase/admin.ts";
import type { Database } from "../../types/database";

export type { SponsorYear };

export type SponsorContact = {
  /** Straße, Hausnummer, optional PLZ – Ort steht separat */
  adresse?: string | null;
  ansprechpartner?: string | null;
  email?: string | null;
  telefon?: string | null;
  socialMedia?: string | null;
  /** Weitere URLs neben website */
  links?: string[];
  /** Nur intern, erscheint nicht auf der Website */
  notes?: string | null;
};

export type SponsorRecord = PublicSponsor & SponsorContact;

export type SponsorsSource = "database" | "code";

export type SponsorsLoadResult = {
  year: SponsorYear;
  sponsors: SponsorRecord[];
  source: SponsorsSource;
};

/**
 * Interne Kontaktdaten, Schlüssel = PublicSponsor.id (z. B. "bittig-it-2026").
 * Felder leer lassen, bis die Orga sie hat – das PDF zeigt dann „–“.
 * Diese Map nicht auf der öffentlichen Sponsoren-Seite importieren.
 */
export const SPONSOR_CONTACTS: Record<string, SponsorContact> = {
  "heiko-biermeyer-2026": {
    adresse: "Obermögersheim 89, 91717 Wassertrüdingen",
    ansprechpartner: "Heiko Biermeyer",
    email: "info@elektrotechnik-biermeyer.de",
    telefon: "0160 6016317 / 0151 10686733",
  },
  "bittig-it-2026": {
    adresse: "Obermögersheim 211, 91717 Wassertrüdingen",
    ansprechpartner: "Tobias Bittig",
    email: "info@bittig-it.de",
    telefon: "09836 9709607",
  },
  "edeka-holler-2026": {
    adresse: "Oettinger Str. 46, 91717 Wassertrüdingen",
    ansprechpartner: "Alexander Holler",
    email: "impressum@edeka-wassertruedingen.de",
    telefon: "09832 7061970",
  },
  "modehaus-steingass-2026": {
    adresse: "Marktplatz 2, 91710 Gunzenhausen",
    ansprechpartner: "Hugo Peter Steingass GmbH & Co. KG",
    email: "info.gunzenhausen@modehaus-steingass.de",
    telefon: "09831 88689-0",
    links: ["https://www.modehaus-steingass.de/"],
  },
  "buttner-agrartechnik-2026": {
    adresse: "Lentersheim 83, 91725 Ehingen",
    ansprechpartner: "Friedrich Büttner / Bernd Büttner",
    email: "info@buettner-agrartechnik.de",
    telefon: "09835 9778736",
    notes: "Sitz auch Oberschwaningen 53.",
  },
  "s-kuhl-hofladen-2026": {
    adresse: "Obermögersheim 28, 91717 Wassertrüdingen",
    ansprechpartner: "Simone Steingruber-Wittmann",
    email: "kontakt@s-kuhl.de",
    telefon: "09836 9993081",
    notes: "Impressum: Obermögersheim 22 (Wohnsitz), Hofladen Nr. 28.",
  },
  "schmidt-haustechnik-2026": {
    adresse: "Frankenstr. 10, 91717 Wassertrüdingen",
    ansprechpartner: "Max Schmidt / Christoph Schmidt",
    email: "info@schmidt-haustechnik.de",
    telefon: "09832 68980",
  },
  "schreinerei-zinsmeister-2026": {
    adresse: "Obermögersheim 23, 91717 Wassertrüdingen",
    ansprechpartner: "Klaus Zinsmeister",
    email: "info@schreinerei-zinsmeister.de",
    telefon: "09836 475",
  },
  "label-b-2026": {
    adresse: "Poststr. 4, 91717 Wassertrüdingen",
    ansprechpartner: "Thomas Kredel",
    email: "kontakt@label-b.de",
    telefon: "09832 9876",
  },
  "mobiles-sagewerk-2026": {
    adresse: "Obermögersheim 25, 91717 Wassertrüdingen",
    ansprechpartner: "Sven Bühringer",
    email: "buehringersven@aol.com",
    telefon: "0160 3476538",
  },
  "kaffeetechnik-piesche-2026": {
    adresse: "Weißenburger Str. 10, 91710 Gunzenhausen",
    ansprechpartner: "Christian Piesche",
    email: "Piesche@kaffeetechnik.info",
    telefon: "09831 6869462",
  },
  "tretlager-2026": {
    adresse: "Blumenstr. 10, 91717 Wassertrüdingen",
    ansprechpartner: "Uwe Zimmermann / Jürgen Zimmermann",
    email: "info@tretlager.net",
    telefon: "09832 67871",
  },
  "adler-apotheke-2026": {
    adresse: "Dinkelsbühler Str. 7, 91717 Wassertrüdingen",
    ansprechpartner: "Dr. Marit-Saskia Wahrendorf",
    email: "meine@deineadlerapo.de",
    telefon: "09832 360",
  },
  "amk-engelhardt-2026": {
    adresse: "Oberer Kesselweg 2, 86744 Hainsfarth",
    ansprechpartner: "Michael Engelhardt",
    email: "info@bauzaun-mieten.net",
    telefon: "09082 921777",
  },
  "baywa-bau-garten-2026": {
    adresse: "Weißenburger Str. 110, 91710 Gunzenhausen",
    email: "bm224@baywa-baumarkt.de",
    telefon: "09831 883180",
  },
  "medien-schlicker-2026": {
    adresse: "Obermögersheim 16a, 91717 Wassertrüdingen",
    ansprechpartner: "Juliane Schlicker",
    email: "info@medien-schlicker.de",
    telefon: "09836 2529807",
  },
  "jeremias-abgastechnik-2026": {
    adresse: "Opfenrieder Str. 12, 91717 Wassertrüdingen",
    email: "info@jeremias.de",
    telefon: "09832 686850",
  },
  "lucalia-balloons-2026": {
    adresse: "Schobdach 66, 91717 Wassertrüdingen",
    email: "lucaliaballoons@gmail.com",
    telefon: "0174 8152628",
    notes: "Kontakt auch per WhatsApp; Instagram/Facebook über die Website.",
  },
  "martina-edelmann-2026": {
    adresse: "Obermögersheim 55, 91717 Wassertrüdingen",
    ansprechpartner: "Martina Edelmann",
    email: "martina.edelmann@dvag.de",
    telefon: "09836 970199",
  },
  "beyhl-2026": {
    adresse: "Westheimer Straße 2, 86736 Auhausen",
    ansprechpartner: "Georg Beyhl sen. / Georg Beyhl jun.",
    email: "info@beyhl.de",
    telefon: "09832 7070",
    socialMedia: "https://www.instagram.com/beyhlgmbh/",
  },
  "blattwerkbauer-2026": {
    adresse: "Ulmenweg 11, 91717 Wassertrüdingen",
    email: "kontakt@blattwerkbauer.de",
    telefon: "09832 705370",
    socialMedia: "https://www.instagram.com/blattwerkbauer/",
  },
  "dommel-2026": {
    adresse: "Westring 15, 91717 Wassertrüdingen",
    ansprechpartner: "Frank Dommel / Markus Gerold",
    email: "info@dommel.de",
    telefon: "09832 6866-0",
  },
  "fliesen-ballenberger-2026": {
    adresse: "An der Stemme 16, 91710 Gunzenhausen",
    email: "fliesen-ballenberger@t-online.de",
    telefon: "09831 9250",
  },
  "rothenberger-optik-und-schmuck-2026": {
    adresse: "Marktstraße 16, 91717 Wassertrüdingen",
    email: "info@optik-rothenberger.de",
    telefon: "09832 569",
  },
  "kfz-rosenbauer-2026": {
    adresse: "Im Hirtenfeld 8, 91743 Unterschwaningen",
    ansprechpartner: "Felix Rosenbauer",
    telefon: "09836 828",
  },
  "kfz-jungwirth-2026": {
    adresse: "Obermögersheim 188, 91717 Wassertrüdingen",
    ansprechpartner: "Stefan Jungwirth",
    telefon: "09836 9993035",
    links: ["https://www.kfz-jungwirth.de/"],
  },
  "elektronic-thoma-gmbh-2026": {
    adresse: "Thoma-Weg 2-6, 91599 Dentlein am Forst",
    ansprechpartner: "Andrea Thoma / Stefan Thoma",
    email: "info@thoma.de",
    telefon: "09855 9777-0",
  },
  "kleeberger-forstdienstleistung-2026": {
    adresse: "Obermögersheim 111, 91717 Wassertrüdingen",
    telefon: "0160 2880781",
  },
  "r-v-versicherung-klaus-kapp-2026": {
    adresse: "Geilsheim 154, 91717 Wassertrüdingen",
    ansprechpartner: "Klaus Kapp",
    email: "klaus.kapp@ruv.de",
    telefon: "09832 7281",
  },
  "geuko-laserscan-2026": {
    adresse: "Obermögersheim 90, 91717 Wassertrüdingen",
    ansprechpartner: "Simon Geuder / Jonas Koch",
    email: "info@geuko.de",
    telefon: "01515 9412044",
  },
  "getranke-peschke-2026": {
    adresse: "Ostheim 125, 91747 Westheim",
    telefon: "09833 5566",
  },
  "sparkasse-wassertrudingen-2026": {
    adresse: "Marktstraße 17, 91717 Wassertrüdingen",
    ansprechpartner: "Sparkasse Ansbach, BeratungsCenter Wassertrüdingen",
    telefon: "0981 189-883700",
  },
  "thomas-schneller-e-k-2026": {
    adresse: "Bahnhofstraße 9, 91743 Unterschwaningen",
    ansprechpartner: "Thomas Schneller",
    email: "info@kartoffelfeinkost-schneller.de",
    telefon: "09836 9713-0",
    notes: "Firmensitz Impressum: In den Seen 4, 86754 Munningen-Schwörsheim.",
  },
  "m-flock-2026": {
    adresse: "Waizendorf 3a, 91639 Wolframs-Eschenbach",
    ansprechpartner: "Manuel Flock",
    email: "manuel-flock@web.de",
    telefon: "0171 1910410",
  },
  "amro-it-systeme-gmbh-2026": {
    adresse: "Treuchtlinger Str. 1, 91781 Weißenburg",
    ansprechpartner: "Jürgen Reutelhuber",
    email: "info@amro.de",
    telefon: "09141 9019-0",
  },
  "stache-fitness-2026": {
    adresse: "Oberasbach 99, 91710 Gunzenhausen",
    ansprechpartner: "Nicole Stache",
    email: "info@stache-fitness.de",
    telefon: "09831 8809704 / 0170 3525352",
  },
};

function filledText(value: string | null | undefined): boolean {
  return Boolean((value ?? "").trim());
}

function filledList(value: string[] | undefined): boolean {
  return Boolean(value?.some((item) => (item ?? "").trim()));
}

/** DB-Werte gewinnen, leere Felder werden aus der Code-Kontaktliste ergänzt. */
export function overlaySponsorContact(record: SponsorRecord): SponsorRecord {
  const extra = SPONSOR_CONTACTS[record.id];
  if (!extra) return record;
  return {
    ...record,
    adresse: filledText(record.adresse) ? record.adresse : extra.adresse ?? record.adresse,
    ansprechpartner: filledText(record.ansprechpartner)
      ? record.ansprechpartner
      : extra.ansprechpartner ?? record.ansprechpartner,
    email: filledText(record.email) ? record.email : extra.email ?? record.email,
    telefon: filledText(record.telefon) ? record.telefon : extra.telefon ?? record.telefon,
    socialMedia: filledText(record.socialMedia)
      ? record.socialMedia
      : extra.socialMedia ?? record.socialMedia,
    links: filledList(record.links) ? record.links : extra.links ?? record.links,
    notes: filledText(record.notes) ? record.notes : extra.notes ?? record.notes,
  };
}

export function mergeSponsorRecord(pub: PublicSponsor): SponsorRecord {
  return overlaySponsorContact({ ...pub });
}

export function getSponsorsFromCode(year: SponsorYear): SponsorRecord[] {
  return getPublicSponsors(year).map(mergeSponsorRecord);
}

function dashable(value: string | null | undefined): string {
  return (value ?? "").trim();
}

export function formatSponsorAdresse(s: SponsorRecord): string {
  const street = dashable(s.adresse);
  const city = dashable(s.ort);
  if (street && city) {
    return street.toLowerCase().includes(city.toLowerCase())
      ? street
      : `${street}, ${city}`;
  }
  return street || city;
}

export function formatSponsorSocial(s: SponsorRecord): string {
  const explicit = dashable(s.socialMedia);
  if (explicit) return explicit;
  const web = dashable(s.website);
  if (web && isSocialUrl(web)) return web;
  return "";
}

export function formatSponsorLinks(s: SponsorRecord): string {
  const items: string[] = [];
  const web = dashable(s.website);
  if (web) items.push(web);
  for (const link of s.links ?? []) {
    const t = dashable(link);
    if (t && !items.includes(t)) items.push(t);
  }
  return items.join(" · ");
}

export function isSocialUrl(url: string): boolean {
  return /(?:instagram|facebook|linkedin|tiktok|x\.com|twitter)\.com/i.test(url);
}

export function pdfDash(value: string | null | undefined): string {
  const t = dashable(value);
  return t || "–";
}

type SponsorRow = Database["public"]["Tables"]["sponsors"]["Row"];

function rowToRecord(row: SponsorRow): SponsorRecord {
  const year: SponsorYear = row.year === 2027 ? 2027 : 2026;
  return {
    id: row.id,
    year,
    firma: row.firma,
    ort: row.ort ?? "",
    logo: row.logo_path ?? undefined,
    website: row.website ?? undefined,
    invertInLightMode: row.invert_in_light_mode,
    hauptsponsor: row.hauptsponsor,
    adresse: row.adresse,
    ansprechpartner: row.ansprechpartner,
    email: row.email,
    telefon: row.telefon,
    socialMedia: row.social_media,
    links: row.links ?? undefined,
    notes: row.notes,
  };
}

async function tryLoadSponsorsFromDb(year: SponsorYear): Promise<SponsorRecord[] | null> {
  const supabase = createAdminSupabaseClient();
  if (!supabase) return null;

  try {
    const { data, error } = await supabase
      .from("sponsors")
      .select("*")
      .eq("year", year)
      .order("sort_order", { ascending: true })
      .order("firma", { ascending: true });

    if (error || !data) return null;
    if (data.length === 0) return null;
    return data.map(rowToRecord);
  } catch {
    return null;
  }
}

/** Orga-PDF: Datenbank wenn befüllt, sonst Code-Liste. */
export async function getSponsorsForYear(year: SponsorYear): Promise<SponsorsLoadResult> {
  const fromDb = await tryLoadSponsorsFromDb(year);
  if (fromDb && fromDb.length > 0) {
    return { year, sponsors: fromDb.map(overlaySponsorContact), source: "database" };
  }
  return { year, sponsors: getSponsorsFromCode(year), source: "code" };
}
