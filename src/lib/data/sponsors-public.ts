/**
 * Öffentliche Sponsoren (Website). Nur Name, Ort, Logo, Website.
 * Interne Kontaktdaten liegen in `sponsors.ts` (Server/Orga-PDF) und kommen
 * nicht in das Client-Bundle.
 */

export const SPONSOR_YEARS = [2026, 2027] as const;
export type SponsorYear = (typeof SPONSOR_YEARS)[number];

export type PublicSponsor = {
  id: string;
  year: SponsorYear;
  firma: string;
  ort: string;
  logo?: string;
  website?: string;
  /** Logo hat helle Farben – im Light-Mode invertieren für Sichtbarkeit */
  invertInLightMode?: boolean;
  /** Hauptsponsoren werden in einer eigenen, größeren Sektion oben angezeigt */
  hauptsponsor?: boolean;
};

function slugId(firma: string, year: SponsorYear): string {
  const slug = firma
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slug}-${year}`;
}

function s(
  firma: string,
  ort: string,
  extra: Partial<Omit<PublicSponsor, "id" | "year" | "firma" | "ort">> = {},
): PublicSponsor {
  const year: SponsorYear = 2026;
  return {
    id: slugId(firma, year),
    year,
    firma,
    ort,
    ...extra,
  };
}

/** Koderlauf 2026 – wie bisher auf /sponsoren. */
export const PUBLIC_SPONSORS_2026: PublicSponsor[] = [
  s("Heiko Biermeyer", "Obermögersheim", {
    logo: "/sponsors/biermayer.png",
    website: "https://elektrotechnik-biermeyer.de/",
  }),
  s("Bittig IT", "Obermögersheim", {
    logo: "/sponsors/bittig-it.png",
    website: "https://www.bittig-it.de/",
  }),
  s("Edeka Holler", "Wassertrüdingen", {
    logo: "/sponsors/edeka.png",
    website: "https://edeka-wassertruedingen.de/",
  }),
  s("Modehaus Steingass", "Gunzenhausen", {
    logo: "/sponsors/steingass.png",
    website: "https://www.modehaus-steingass.de/",
    invertInLightMode: true,
  }),
  s("Büttner Agrartechnik", "Ehingen", {
    logo: "/sponsors/buettner.png",
    website: "https://www.buettner-agrartechnik.de/",
  }),
  s("S-Kuhl Hofladen", "Obermögersheim", {
    logo: "/sponsors/s-kuhl.png",
    website: "https://s-kuhl.de/",
  }),
  s("Schmidt Haustechnik", "Wassertrüdingen", {
    logo: "/sponsors/schmidt.png",
    website: "https://schmidt-haustechnik.de/",
  }),
  s("Schreinerei Zinsmeister", "Obermögersheim", {
    logo: "/sponsors/zinsmeister.png",
    website: "https://schreinerei-zinsmeister.de/",
  }),
  s("Label B", "Wassertrüdingen", {
    logo: "/sponsors/label-b.png",
    website: "https://www.label-b.de/",
  }),
  s("Mobiles Sägewerk", "Obermögersheim", {
    logo: "/sponsors/mobiles-saegewerk.png",
  }),
  s("Jäger", "Obermögersheim"),
  s("Kaffeetechnik Piesche", "Gunzenhausen", {
    logo: "/sponsors/kaffeetechnik-piesche.png",
    website: "http://www.kaffeetechnik.info/",
  }),
  s("Tretlager", "Wassertrüdingen", {
    logo: "/sponsors/tretlager.gif",
    website: "http://tretlager.net/",
  }),
  s("Adler Apotheke", "Wassertrüdingen", {
    logo: "/sponsors/adler-apotheke.png",
    website: "https://deineadlerapo.de/",
  }),
  s("AMK Engelhardt", "Hainsfarth", {
    logo: "/sponsors/amk-engelhardt.png",
    website: "https://bauzaun-mieten.net/",
  }),
  s("BayWa Bau & Garten", "Gunzenhausen", {
    logo: "/sponsors/baywa.png",
    website: "https://www.baywa-baumarkt.de/markt/gunzenhausen/",
  }),
  s("Medien Schlicker", "Obermögersheim", {
    logo: "/sponsors/medien-schlicker.png",
    website: "https://medien-schlicker.de/",
  }),
  s("Jeremias Abgastechnik", "Wassertrüdingen", {
    logo: "/sponsors/jeremias.png",
    website: "https://jeremias.de/",
  }),
  s("Lucalia Balloons", "Schobdach", {
    logo: "/sponsors/lucalia-balloons.png",
    website: "https://lucalia-balloons-und-events-1.jimdosite.com/",
  }),
  s("Martina Edelmann", "Obermögersheim", {
    logo: "/sponsors/edelmann.png",
    website: "https://www.dvag.de/martina.edelmann/index.html",
  }),
  s("Beyhl", "Auhausen", {
    logo: "/sponsors/beyhl.png",
    website: "https://www.beyhl.de/",
  }),
  s("Blattwerkbauer", "Wassertrüdingen", {
    logo: "/sponsors/blattwerk.png",
    website: "https://www.instagram.com/blattwerkbauer/",
    invertInLightMode: true,
  }),
  s("DOMMEL", "Wassertrüdingen", {
    logo: "/sponsors/dommel.png",
    website: "https://www.dommel.de/",
  }),
  s("Fliesen Ballenberger", "Gunzenhausen", {
    logo: "/sponsors/ballenberger.png",
  }),
  s("Rothenberger Optik und Schmuck", "Wassertrüdingen", {
    logo: "/sponsors/rothenberger.png",
    website: "https://www.optik-rothenberger.de/",
  }),
  s("KFZ Rosenbauer", "Unterschwaningen", {
    logo: "/sponsors/kfz-rosenbauer.png",
  }),
  s("KFZ Jungwirth", "Obermögersheim", {
    logo: "/sponsors/jungwirth.png",
  }),
  s("Elektronic Thoma GmbH", "Dentlein am Forst", {
    logo: "/sponsors/thoma.png",
    website: "https://www.thoma.de/",
  }),
  s("Kleeberger Forstdienstleistung", "Obermögersheim", {
    logo: "/sponsors/kleeberger.png",
  }),
  s("R+V Versicherung Klaus Kapp", "Wassertrüdingen", {
    logo: "/sponsors/ruv.png",
    website: "https://www.ruv.de/vor-ort/wassertruedingen/kapp/",
  }),
  s("GeuKo Laserscan", "Wassertrüdingen", {
    logo: "/sponsors/geuko.png",
    website: "https://geuko.de/",
    invertInLightMode: true,
  }),
  s("Getränke Peschke", "Ostheim"),
  s("Sparkasse Wassertrüdingen", "Wassertrüdingen", {
    logo: "/sponsors/sparkasse-wassertruedingen.png",
    website:
      "https://www.sparkasse.de/standorte/filialen/sparkasse-ansbach-beratungs-center-wassertruedingen-104062",
  }),
  s("Thomas Schneller e.K.", "Unterschwaningen", {
    logo: "/sponsors/schneller.png",
    website: "https://www.kartoffelfeinkost-schneller.de/unterschwaningen.html",
  }),
  s("M. Flock", "Wolframs-Eschenbach", {
    logo: "/sponsors/flock-transporte.png",
    website: "https://www.flock-transporte.de/",
  }),
  s("AMRO IT-Systeme GmbH", "Weißenburg i. Bay.", {
    logo: "/sponsors/amro-it-systeme.png",
    website: "https://www.amro.de/",
  }),
  s("Stache Fitness", "Oberasbach", {
    logo: "/sponsors/stache-fitness.png",
    website: "https://www.stache-fitness.de/",
  }),
];

/** Koderlauf 2027 – noch keine Einträge; PDF und Seite zeigen den Hinweis. */
export const PUBLIC_SPONSORS_2027: PublicSponsor[] = [];

export const PUBLIC_SPONSORS: PublicSponsor[] = [
  ...PUBLIC_SPONSORS_2026,
  ...PUBLIC_SPONSORS_2027,
];

export function getPublicSponsors(year: SponsorYear): PublicSponsor[] {
  return PUBLIC_SPONSORS.filter((sp) => sp.year === year);
}

export function parseSponsorYear(value: string | number | null | undefined): SponsorYear | null {
  if (value === 2026 || value === "2026") return 2026;
  if (value === 2027 || value === "2027") return 2027;
  return null;
}
