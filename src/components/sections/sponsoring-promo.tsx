"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { HeartHandshake } from "lucide-react";
import { fadeReveal, useStaticReveal } from "@/hooks/use-static-reveal";
import { EVENT } from "@/lib/event-config";
import { SPONSORING_2027 } from "@/lib/sponsoring-2027";

export function SponsoringPromo() {
  const staticReveal = useStaticReveal();

  return (
    <section className="py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.5 })}
          className="rounded-3xl border border-border bg-card p-6 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-8"
        >
          <div className="flex gap-4">
            <HeartHandshake className="mt-1 h-8 w-8 shrink-0 text-koder-orange" aria-hidden />
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
                Sponsoring {EVENT.jahr}
              </p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight">
                Partner {SPONSORING_2027.partnerPreis} €, Förderer oder Hauptsponsor
              </h2>
              <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                Drei Bänder für Sichtbarkeit – Flächen optional. Hauptsponsor ab ca.{" "}
                {SPONSORING_2027.hauptsponsorAb} €, auch ohne lieferbare Sache. Anfrage ohne
                Online-Zahlung.
              </p>
            </div>
          </div>
          <Link
            href="/sponsor-werden"
            className="mt-5 inline-flex shrink-0 rounded-xl bg-koder-orange px-5 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-koder-orange/90 sm:mt-0"
          >
            Sponsor 2027 werden
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
