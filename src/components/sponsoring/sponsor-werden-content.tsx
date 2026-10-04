"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { EVENT } from "@/lib/event-config";
import { SPONSORING_2027 } from "@/lib/sponsoring-2027";
import { SponsorAnfrageFormular } from "@/components/sponsoring/anfrage-formular";
import { SponsorStickyAnfrage } from "@/components/sponsoring/sponsor-sticky-anfrage";
import { SponsorSachen, SponsorStufen } from "@/components/sponsoring/sponsor-werden-sections";

export function SponsorWerdenContent({ vergebenIds = [] }: { vergebenIds?: string[] }) {
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
            <p className="mt-4 max-w-2xl text-lg text-foreground">
              Präsentiert eure Firma und zeigt, dass ihr Unterstützer des Koderlauf 2027 seid.
            </p>
            <p className="mt-3 max-w-2xl text-lg font-semibold text-foreground">
              Eure Werbung ist das ganze Festwochenende zu sehen.
            </p>
          </motion.section>

          <SponsorStufen />
          <SponsorSachen vergebenIds={vergebenIds} />

          <section id="anfrage" className="mt-12 scroll-mt-28" aria-labelledby="anfrage-titel">
            <h2 id="anfrage-titel" className="text-2xl font-extrabold tracking-tight">
              Kurz Bescheid sagen
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">Antwort von {kontaktEmail}.</p>
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 sm:p-8">
              <SponsorAnfrageFormular vergebenIds={vergebenIds} />
            </div>
          </section>
        </div>
      </div>
      <SponsorStickyAnfrage heroId="sponsor-hero" />
    </>
  );
}
