"use client";

import { motion } from "framer-motion";
import { Users, ExternalLink } from "lucide-react";

const SHEETS_EMBED_URL =
  "https://docs.google.com/spreadsheets/d/1A7vdAiOWQ0ZP1VnStvOD3YAlgR_xYN70A0eTPvZXaa4/pubhtml?gid=769374861&single=true&widget=true&headers=false";

const SHEETS_FULL_URL =
  "https://docs.google.com/spreadsheets/d/1A7vdAiOWQ0ZP1VnStvOD3YAlgR_xYN70A0eTPvZXaa4/edit?gid=769374861#gid=769374861";

export default function AnmeldungenPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf 2026
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Anmeldungen
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Alle bisherigen Anmeldungen für den Koderlauf 2026. Bist du schon
            dabei?
          </p>
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center gap-4"
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-koder-orange/10 px-4 py-2 text-sm font-medium text-koder-orange">
            <Users size={16} />
            Live-Teilnehmerliste
          </div>
          <a
            href={SHEETS_FULL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:border-koder-orange/30 hover:text-koder-orange"
          >
            <ExternalLink size={14} />
            In Google Sheets öffnen
          </a>
        </motion.div>

        {/* Google Sheets embed */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 overflow-hidden rounded-3xl border border-border bg-white"
        >
          <iframe
            src={SHEETS_EMBED_URL}
            title="Anmeldungen Koderlauf 2026"
            className="h-[600px] w-full sm:h-[700px] lg:h-[800px]"
            style={{ border: "none" }}
          />
        </motion.div>

        <p className="mt-4 text-center text-xs text-muted-foreground">
          Die Liste wird automatisch aktualisiert wenn neue Anmeldungen über
          Google Forms eingehen.
        </p>
      </div>
    </div>
  );
}
