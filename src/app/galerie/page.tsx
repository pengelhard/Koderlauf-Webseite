"use client";

import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

/** Geteiltes Album – bei Wechsel des Albums URL anpassen. */
const GALLERY_PHOTOS_URL = "https://photos.app.goo.gl/MfnZNyHNQSxDaRWx6";

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
              Die ersten Bilder und Videos vom{" "}
              <span className="text-koder-orange">4. April</span> sind schon in der Galerie in
              Google&nbsp;Fotos. In den nächsten Tagen werden dort noch mehr ergänzt.
            </p>

            <a
              href={GALLERY_PHOTOS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-orange mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-koder-orange py-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright sm:w-auto sm:px-12"
            >
              Zur Galerie
              <ExternalLink className="h-4 w-4 opacity-90" aria-hidden />
            </a>

            <p className="mt-10 border-t border-border/80 pt-8 text-sm text-muted-foreground">
              <Link
                href="/feedback"
                className="font-medium text-koder-orange underline-offset-4 hover:underline"
              >
                Feedback
              </Link>
              {" · "}
              <Link
                href="/anmeldung"
                className="font-medium text-foreground/80 underline-offset-4 hover:underline"
              >
                Anmeldung 2027
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
