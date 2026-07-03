"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Camera, ExternalLink, PlayCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { YearSwitcher } from "@/components/ui/year-switcher";

/**
 * Video-Overlay für eine Galerie-Kachel: lädt das Video erst, wenn die Kachel
 * im Viewport ist, und blendet es erst ein, sobald es abspielbereit ist.
 * Bis dahin bleibt das darunterliegende Bild sichtbar (schneller First Paint).
 */
function GalleryVideo({ src, label }: { src: string; label: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0" aria-hidden={!ready}>
      {inView && (
        <video
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-label={label}
          onCanPlay={() => setReady(true)}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 lg:group-hover:scale-105 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

/** Öffentliche Google-Fotos-Alben für die Galerie. */
const GALLERY_ROUTE_URL = "https://photos.app.goo.gl/yDoCZKztQSZx1w9v7";
const GALLERY_START_FINISH_URL = "https://photos.app.goo.gl/CSWq4RVGnuqMbYs68";
const GALLERY_SETUP_URL = "https://photos.app.goo.gl/gL4wMBUdV857n1qF8";
const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@koderlauf";

type GalleryLink = {
  label: string;
  hint: string;
  href: string;
  image: string;
  imageAlt: string;
  /** Optionales Video, das statt des Bildes in Dauerschleife läuft */
  video?: string;
  accent?: "default" | "youtube";
};

const GALLERY_LINKS: GalleryLink[] = [
  {
    label: "Auf der Strecke",
    hint: "Laufmomente und Eindrücke entlang der Strecke",
    href: GALLERY_ROUTE_URL,
    image: "/gallery-strecke.webp",
    imageAlt: "Streckenposten beim Koderlauf mit Wegweisern für Koderrunde und Trailrun",
  },
  {
    label: "Start-Zielbereich",
    hint: "Start, Zieleinlauf und Stimmung vor Ort",
    href: GALLERY_START_FINISH_URL,
    image: "/gallery-start-ziel.webp",
    imageAlt: "Kinderlauf-Start im Start- und Zielbereich des Koderlaufs",
  },
  {
    label: "Aufbau",
    hint: "Vorbereitungen rund um den Koderlauf",
    href: GALLERY_SETUP_URL,
    image: "/gallery-aufbau.webp",
    imageAlt: "Helfer beim Aufbau der Banner am Sportgelände",
  },
  {
    label: "YouTube",
    hint: "Drohnenaufnahmen",
    href: YOUTUBE_CHANNEL_URL,
    image: "/gallery-drohne.webp",
    imageAlt: "Drohnenaufnahme vom Sportheim und Start-Zielbereich des Koderlaufs",
    video: "/gallery-drohne-loop.mp4",
    accent: "youtube",
  },
];

export default function GaleriePage() {
  const [yearTab, setYearTab] = useState<"2026" | "2027">("2026");

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-koder-orange">
            Koderlauf {yearTab}
          </p>
          <h1 className="mt-3 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Galerie
          </h1>
          <YearSwitcher value={yearTab} onChange={setYearTab} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.06 }}
          className="relative mt-12 overflow-hidden rounded-3xl border border-border/80 bg-card p-4 shadow-xl sm:p-6"
        >
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,var(--color-koder-orange)_0%,transparent_55%)] opacity-[0.12]"
            aria-hidden
          />

          <div className="relative">
            {yearTab === "2026" ? (
              <>
                <p className="mx-auto max-w-2xl text-center text-lg font-medium leading-relaxed text-foreground sm:text-xl">
                  Die Bilder und Videos vom{" "}
                  <span className="text-koder-orange">1. Koderlauf 2026</span>{" "}
                  findest du in Google-Fotos-Alben und auf YouTube.
                </p>

                <div className="mt-8 grid gap-4 sm:grid-cols-2">
                  {GALLERY_LINKS.map((link, index) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={[
                        // Hover-Transforms nur auf Desktop: Touch-Geräte (Mali-GPU) zeigen sonst Scroll-Ghosting
                        "group relative min-h-64 overflow-hidden rounded-3xl border text-left transition-colors duration-300 lg:transition-all",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-koder-orange/60",
                        link.accent === "youtube"
                          ? "border-red-500/30 hover:border-red-500/70 lg:hover:-translate-y-1 lg:hover:shadow-2xl lg:hover:shadow-red-500/15"
                          : "border-border/80 hover:border-koder-orange/70 lg:hover:-translate-y-1 lg:hover:shadow-2xl lg:hover:shadow-koder-orange/15",
                      ].join(" ")}
                    >
                      {/* Bild immer sofort rendern – das Video lädt im Hintergrund nach
                          und blendet sich erst ein, wenn es abspielbereit ist. */}
                      <Image
                        src={link.image}
                        alt={link.imageAlt}
                        fill
                        priority={index < 2}
                        loading={index < 2 ? "eager" : "lazy"}
                        quality={70}
                        className="object-cover lg:transition-transform lg:duration-500 lg:group-hover:scale-105"
                        sizes="(min-width: 640px) 50vw, 100vw"
                      />
                      {link.video && <GalleryVideo src={link.video} label={link.imageAlt} />}
                      <span className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/5" />
                      <span
                        className={
                          link.accent === "youtube"
                            ? "absolute inset-0 bg-red-500/0 transition-colors duration-300 group-hover:bg-red-500/10"
                            : "absolute inset-0 bg-koder-orange/0 transition-colors duration-300 group-hover:bg-koder-orange/10"
                        }
                        aria-hidden
                      />

                      <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 sm:p-6">
                        <span className="min-w-0">
                          <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-white lg:backdrop-blur-sm">
                            {link.accent === "youtube" ? (
                              <PlayCircle size={14} />
                            ) : (
                              <Camera size={14} />
                            )}
                            {link.accent === "youtube" ? "Video" : "Fotoalbum"}
                          </span>
                          <span className="block text-2xl font-extrabold tracking-tight text-white">
                            {link.label}
                          </span>
                          <span className="mt-1 block text-sm leading-relaxed text-white/75">
                            {link.hint}
                          </span>
                        </span>
                        <ExternalLink
                          className={[
                            "mb-1 h-5 w-5 shrink-0 text-white lg:transition-transform lg:duration-300 lg:group-hover:-translate-y-1 lg:group-hover:translate-x-1",
                            link.accent === "youtube" ? "drop-shadow-[0_0_10px_rgba(239,68,68,0.9)]" : "drop-shadow-[0_0_10px_rgba(255,107,0,0.9)]",
                          ].join(" ")}
                          aria-hidden
                        />
                      </span>
                    </a>
                  ))}
                </div>
              </>
            ) : (
              <div className="mx-auto max-w-2xl rounded-3xl border border-koder-orange/30 bg-koder-orange/10 p-8 text-center sm:p-10">
                <Camera className="mx-auto h-9 w-9 text-koder-orange" />
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight">
                  Galerie 2027 folgt
                </h2>
                <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                  Nach dem Koderlauf 2027 findet ihr hier die neuen Fotos,
                  Videos und Drohnenaufnahmen vom Jubiläumswochenende.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
