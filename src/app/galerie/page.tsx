"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

/** Oeffentliche Google-Fotos-Alben fuer die Galerie. */
const GALLERY_ROUTE_URL = "https://photos.app.goo.gl/yDoCZKztQSZx1w9v7";
const GALLERY_START_FINISH_URL = "https://photos.app.goo.gl/CSWq4RVGnuqMbYs68";
const GALLERY_SETUP_URL = "https://photos.app.goo.gl/gL4wMBUdV857n1qF8";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@koderlauf";

type GalleryLink = {
  label: string;
  hint: string;
  href: string;
  accent?: "default" | "youtube";
};

const GALLERY_LINKS: GalleryLink[] = [
  {
    label: "Auf der Strecke",
    hint: "Laufmomente und Eindruecke entlang der Strecke",
    href: GALLERY_ROUTE_URL,
  },
  {
    label: "Start-Zielbereich",
    hint: "Start, Zieleinlauf und Stimmung vor Ort",
    href: GALLERY_START_FINISH_URL,
  },
  {
    label: "Aufbau",
    hint: "Vorbereitungen rund um den Koderlauf",
    href: GALLERY_SETUP_URL,
  },
  {
    label: "YouTube",
    hint: "Drohnenaufnahmen",
    href: YOUTUBE_CHANNEL_URL,
    accent: "youtube",
  },
];

export default function GaleriePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-koder-orange">
            Koderlauf 2026
          </p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Galerie
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-border/80 bg-card p-8 shadow-xl sm:p-10"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-koder-orange)_0%,transparent_55%)] opacity-[0.12]"
            aria-hidden
          />

          <div className="relative mx-auto max-w-md text-center">
            <p className="text-lg font-medium leading-relaxed text-foreground sm:text-xl">
              Die Bilder und Videos vom <span className="text-koder-orange">1. Koderlauf 2026</span>{" "}
              findest du jetzt in Google-Fotos-Alben und auf YouTube.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {GALLERY_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={[
                    "group relative overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koder-orange/60",
                    link.accent === "youtube"
                      ? "border-red-500/30 bg-red-500/[0.07] hover:-translate-y-0.5 hover:border-red-500/60 hover:bg-red-500/[0.12] hover:shadow-lg hover:shadow-red-500/10"
                      : "border-border/80 bg-background/80 hover:-translate-y-0.5 hover:border-koder-orange/60 hover:bg-koder-orange/5 hover:shadow-lg hover:shadow-koder-orange/10",
                  ].join(" ")}
                >
                  <span
                    className={[
                      "pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100",
                      link.accent === "youtube"
                        ? "bg-[radial-gradient(circle_at_80%_20%,rgba(239,68,68,0.22),transparent_58%)]"
                        : "bg-[radial-gradient(circle_at_80%_20%,rgba(249,115,22,0.18),transparent_58%)]",
                    ].join(" ")}
                    aria-hidden
                  />

                  <span className="relative flex items-start gap-3">
                    <span className="flex-1">
                      <span className="block text-sm font-bold tracking-wide text-foreground">
                        {link.label}
                      </span>
                      <span className="mt-1 block text-xs text-muted-foreground">{link.hint}</span>
                    </span>
                    <ExternalLink
                      className={[
                        "mt-0.5 h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5",
                        link.accent === "youtube" ? "text-red-500" : "text-koder-orange",
                      ].join(" ")}
                      aria-hidden
                    />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
