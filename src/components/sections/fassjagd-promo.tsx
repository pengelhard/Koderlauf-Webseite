"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FassjagdAnmeldeButtons } from "@/components/fassjagd/anmelde-buttons";
import { FassjagdFassBild } from "@/components/fassjagd/fass-bild";
import { VEREINS_WERTUNG } from "@/lib/anmeldungen/vereine";
import { fadeReveal, useStaticReveal } from "@/hooks/use-static-reveal";

export function FassjagdPromo() {
  const staticReveal = useStaticReveal();

  return (
    <section className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <motion.div
          {...fadeReveal(staticReveal, { duration: 0.6 })}
          className="overflow-hidden rounded-3xl border border-koder-orange/35 bg-gradient-to-br from-koder-orange/15 via-forest-deep/20 to-black"
        >
          <div className="grid items-center gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,280px)_1fr] lg:gap-10 lg:p-10">
            <div className="flex justify-center lg:justify-start">
              <FassjagdFassBild
                size={280}
                className="h-48 w-48 object-contain sm:h-56 sm:w-56 lg:h-64 lg:w-64"
              />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
                {VEREINS_WERTUNG.titel} 2027
              </p>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Wer holt das Fass?
              </h2>
              <p className="mt-4 max-w-xl text-base leading-relaxed text-muted-foreground">
                {VEREINS_WERTUNG.kurz}
              </p>
              <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground">
                {VEREINS_WERTUNG.punkte.slice(1).map((punkt) => (
                  <li key={punkt}>{punkt}</li>
                ))}
              </ul>
              <div className="mt-6 flex flex-col gap-4">
                <Link
                  href="/fassjagd"
                  className="inline-flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-widest text-koder-orange hover:text-koder-orange-bright"
                >
                  Zur Fassjagd <ArrowRight size={16} />
                </Link>
                <FassjagdAnmeldeButtons className="max-w-xl" />
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
