import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://koderlauf.de";

  return [
    { url: `${base}/`, lastModified: new Date(), priority: 1 },
    { url: `${base}/anmelden`, lastModified: new Date(), priority: 0.9 },
    { url: `${base}/ergebnisse`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/galerie`, lastModified: new Date(), priority: 0.8 },
    { url: `${base}/anmeldung/erfolg`, lastModified: new Date(), priority: 0.2 },
    { url: `${base}/anmeldung/abbruch`, lastModified: new Date(), priority: 0.2 },
  ];
}
