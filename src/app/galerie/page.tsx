"use client";

import { motion } from "framer-motion";
import { Camera, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

export default function GaleriePage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf 2026
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Galerie
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 rounded-3xl border-2 border-dashed border-koder-orange/20 bg-koder-orange/5 p-8 text-center sm:p-12"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-koder-orange/10">
            <Camera className="h-10 w-10 text-koder-orange" />
          </div>
          <h2 className="mt-6 text-2xl font-extrabold">
            Fotos nach dem Lauf
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted-foreground">
            Die Fotos und Videos vom Koderlauf 2026 werden nach der Veranstaltung am
            <span className="font-semibold text-koder-orange"> 04. April 2026 </span>
            hier veröffentlicht.
          </p>

          <div className="mx-auto mt-8 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <ImageIcon size={16} />
            Professionelle Fotos + Community-Uploads
          </div>

          <Link
            href="/anmeldung"
            className="mt-8 inline-flex rounded-2xl bg-koder-orange px-8 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
          >
            Jetzt anmelden
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
