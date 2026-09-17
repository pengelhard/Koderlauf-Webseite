/**
 * Server-only: volle Sponsoren-Stammdaten für das Orga-PDF.
 * Nicht in Client-Komponenten importieren – Telefon/Mail sollen nicht
 * im öffentlichen JavaScript landen.
 *
 * Quelle: Code-Liste (Website) + optionales Overlay für Kontakte.
 * Wenn die Tabelle `sponsors` in Supabase existiert und Zeilen hat,
 * gewinnt die Datenbank (analog Demo-Fallback der restlichen App).
 */
import { createClient } from "@supabase/supabase-js";
import {
  getPublicSponsors,
  type PublicSponsor,
  type SponsorYear,
} from "./sponsors-public.ts";
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
  // "bittig-it-2026": {
  //   adresse: "Musterstraße 1",
  //   ansprechpartner: "Max Mustermann",
  //   email: "info@example.de",
  //   telefon: "09832 123456",
  //   socialMedia: "https://www.instagram.com/beispiel/",
  // },
};

export function mergeSponsorRecord(pub: PublicSponsor): SponsorRecord {
  const extra = SPONSOR_CONTACTS[pub.id] ?? {};
  return { ...pub, ...extra };
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
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !serviceKey) return null;

  try {
    const supabase = createClient<Database>(url, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
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
    return { year, sponsors: fromDb, source: "database" };
  }
  return { year, sponsors: getSponsorsFromCode(year), source: "code" };
}
