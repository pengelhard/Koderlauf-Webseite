import type { MetadataRoute } from "next";
import { getCanonicalUrl } from "@/lib/site-url";

const PATHS = [
  "/",
  "/strecken",
  "/teilnehmer",
  "/ergebnisse",
  "/galerie",
  "/fassjagd",
  "/anmeldung",
  "/anmeldung/einzeln",
  "/anmeldung/sammel",
  "/sponsoren",
  "/feedback",
  "/impressum",
  "/datenschutz",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  return PATHS.map((path) => ({
    url: getCanonicalUrl(path),
    lastModified: new Date(),
    changeFrequency: path === "/" ? "weekly" : "monthly",
    priority: path === "/" ? 1 : path.startsWith("/anmeldung") ? 0.8 : 0.7,
  }));
}
