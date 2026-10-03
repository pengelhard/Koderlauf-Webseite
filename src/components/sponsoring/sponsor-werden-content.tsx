"use client";

import Link from "next/link";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { EVENT } from "@/lib/event-config";
import { SPONSORING_2027 } from "@/lib/sponsoring-2027";
import { SponsorAnfrageFormular } from "@/components/sponsoring/anfrage-formular";
import { SponsorStickyAnfrage } from "@/components/sponsoring/sponsor-sticky-anfrage";
import {
  SponsorFaq,
  SponsorHeroBilder,
  SponsorOffeneFlaechen,
  SponsorStufen,
} from "@/components/sponsoring/sponsor-werden-sections";

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
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              Auch eine Kiste Äpfel oder 50 € sind willkommen. Kurz Bescheid sagen – wir fragen auch persönlich nach.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              {EVENT.datumKurz} · {EVENT.ortDetail} · {EVENT.veranstalter}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                href="/sponsor-werden?stufe=liste#anfrage"
                className="rounded-xl bg-koder-orange px-4 py-2.5 text-sm font-bold text-white hover:bg-koder-orange/90"
              >
                Liste
              </Link>
              <Link
                href="/sponsor-werden?stufe=banner#anfrage"
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
              >
                Banner
              </Link>
              <Link
                href="/sponsor-werden?stufe=buehne#anfrage"
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
              >
                Bühne
              </Link>
              <Link
                href="#flaechen"
                className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
              >
                Flächen
              </Link>
            </div>

            <p className="mt-4 text-sm text-muted-foreground">
              {SPONSORING_2027.zuordnungSatz} Unverbindlich, keine Online-Zahlung.{" "}
              <a href={`mailto:${kontaktEmail}`} className="text-koder-orange hover:underline">
                {kontaktEmail}
              </a>
            </p>

            <SponsorHeroBilder />
          </motion.section>

          <SponsorStufen />
          <SponsorOffeneFlaechen />
          <SponsorFaq />

          <section id="anfrage" className="mt-12 scroll-mt-28" aria-labelledby="anfrage-titel">
            <h2 id="anfrage-titel" className="text-2xl font-extrabold tracking-tight">
              Kurz Bescheid sagen
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Kein Checkout. Wir melden uns von {kontaktEmail} und ordnen den Umfang zu.
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
