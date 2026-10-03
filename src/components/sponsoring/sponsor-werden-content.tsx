"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { EVENT } from "@/lib/event-config";
import { SPONSORING_2027 } from "@/lib/sponsoring-2027";
import { SponsorAnfrageFormular } from "@/components/sponsoring/anfrage-formular";
import { SponsorStickyAnfrage } from "@/components/sponsoring/sponsor-sticky-anfrage";
import { SponsorSachen, SponsorStufen } from "@/components/sponsoring/sponsor-werden-sections";

export function SponsorWerdenContent() {
  const { kontaktEmail } = SPONSORING_2027;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const scrollToAnfrage = () => {
      if (window.location.hash === "#anfrage") {
        requestAnimationFrame(() => {
          document.getElementById("anfrage")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      }
    };
    scrollToAnfrage();
    window.addEventListener("hashchange", scrollToAnfrage);
    return () => window.removeEventListener("hashchange", scrollToAnfrage);
  }, []);

  return (
    <>
      <div className="min-h-screen pt-24 pb-24 md:pb-20">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <motion.section
            id="sponsor-hero"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="scroll-mt-28"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
              Koderlauf {EVENT.jahr}
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Sponsor werden
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
              100 €, 250 € oder ab 500 €. Auch eine Kiste Äpfel.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {EVENT.datumKurz} · {EVENT.ortDetail}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/sponsor-werden?stufe=unterstuetzer#anfrage"
                className="rounded-xl bg-koder-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-koder-orange/90"
              >
                100 €
              </Link>
              <Link
                href="/sponsor-werden?stufe=sponsor#anfrage"
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
              >
                250 €
              </Link>
              <Link
                href="/sponsor-werden?stufe=hauptsponsor#anfrage"
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
              >
                500 €
              </Link>
              <Link
                href="#sachen"
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
              >
                Sachen
              </Link>
            </div>
          </motion.section>

          <SponsorStufen />
          <SponsorSachen />

          <section id="anfrage" className="mt-12 scroll-mt-28" aria-labelledby="anfrage-titel">
            <h2 id="anfrage-titel" className="text-2xl font-extrabold tracking-tight">
              Kurz Bescheid sagen
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Keine Online-Zahlung. Antwort von {kontaktEmail}.
            </p>
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <SponsorAnfrageFormular />
            </div>
          </section>
        </div>
      </div>
      <SponsorStickyAnfrage heroId="sponsor-hero" />
    </>
  );
}
