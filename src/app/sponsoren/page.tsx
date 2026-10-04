"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { YearSwitcher } from "@/components/ui/year-switcher";
import { useStaticReveal, variantsReveal } from "@/hooks/use-static-reveal";
import {
  getPublicSponsors,
  type PublicSponsor,
  type SponsorYear,
} from "@/lib/data/sponsors-public";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function SponsorInitials({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-koder-orange/20 to-forest-deep/20 text-xl font-black text-koder-orange">
      {initials}
    </div>
  );
}

function SponsorCard({ sponsor, gross = false }: { sponsor: PublicSponsor; gross?: boolean }) {
  const logoSize = gross ? "h-32 w-32" : "h-24 w-24";
  const inner = (
    <>
      {sponsor.logo ? (
        <Image
          src={sponsor.logo}
          alt={sponsor.firma}
          width={gross ? 128 : 96}
          height={gross ? 128 : 96}
          className={`${logoSize} rounded-xl object-contain ${sponsor.invertInLightMode ? "invert dark:invert-0" : ""}`}
          unoptimized
        />
      ) : (
        <SponsorInitials name={sponsor.firma} />
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className={`break-words font-bold leading-relaxed ${gross ? "text-lg" : ""}`}>{sponsor.firma}</h3>
        <p className="text-xs text-muted-foreground">{sponsor.ort}</p>
        {sponsor.website && (
          <p className="flex items-center gap-1 pt-0.5 text-[10px] text-koder-orange opacity-0 transition-opacity group-hover:opacity-100">
            <ExternalLink size={10} /> Website besuchen
          </p>
        )}
      </div>
    </>
  );

  const cardClasses = gross
    ? "group flex items-center gap-5 rounded-3xl border-2 border-koder-orange/30 bg-gradient-to-br from-koder-orange/10 to-transparent p-6 transition-all hover:border-koder-orange/60 hover:shadow-xl hover:shadow-koder-orange/10"
    : "group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-koder-orange/30 hover:shadow-lg hover:shadow-koder-orange/5";

  if (sponsor.website) {
    return (
      <a href={sponsor.website} target="_blank" rel="noopener noreferrer" className={cardClasses}>
        {inner}
      </a>
    );
  }
  return <div className={cardClasses}>{inner}</div>;
}

function SponsorenAufbau({ jahr }: { jahr: string }) {
  return (
    <div className="mt-14">
      <div className="mx-auto max-w-2xl text-center">
        <p className="text-xl font-bold tracking-tight sm:text-2xl">
          Eure Werbung ist das ganze Festwochenende zu sehen.
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          So steht ihr auf dieser Seite. Die echten Logos kommen, sobald die Partnerschaften feststehen.
        </p>
      </div>

      <section className="relative mt-12 overflow-hidden rounded-[2rem] border-2 border-koder-orange/70 bg-gradient-to-br from-koder-orange/30 via-koder-orange/10 to-transparent px-5 py-8 shadow-[0_30px_90px_-36px_rgba(255,107,0,0.9)] sm:px-10 sm:py-12">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-5xl">Hauptsponsor</h2>
        <div className="mt-8 flex flex-col items-center gap-6 rounded-3xl bg-background/75 p-6 ring-1 ring-koder-orange/40 sm:flex-row sm:gap-10 sm:p-10">
          <div className="flex h-44 w-44 shrink-0 items-center justify-center rounded-[1.75rem] bg-gradient-to-br from-white to-zinc-200 text-3xl font-black tracking-tight text-zinc-900 shadow-2xl sm:h-60 sm:w-60 sm:text-4xl">
            Logo
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-4xl font-extrabold tracking-tight sm:text-5xl">Eure Firma</h3>
            <p className="mt-2 text-lg text-muted-foreground">Name und Ort</p>
            <p className="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-koder-orange">
              Hauptsponsoren {jahr}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl rounded-3xl border border-foreground/15 bg-card px-5 py-6 sm:px-8 sm:py-8">
        <h2 className="text-2xl font-extrabold tracking-tight">Sponsor</h2>
        <div className="mt-6 flex items-center gap-5 rounded-2xl border border-border bg-background/50 p-5">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-white to-zinc-200 text-lg font-black text-zinc-900">
            Logo
          </div>
          <div className="min-w-0">
            <h3 className="text-2xl font-bold">Eure Firma</h3>
            <p className="text-sm text-muted-foreground">Name und Ort</p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-koder-orange">
              Sponsoren {jahr}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-border/80 bg-muted/20 px-4 py-5 sm:px-6">
        <h2 className="text-lg font-bold">Unterstützer</h2>
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {["Eure Firma", "Weitere Firma", "Noch eine Firma"].map((firma) => (
            <div key={firma} className="flex items-center gap-3 rounded-xl border border-border bg-card px-3 py-2.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-white to-zinc-200 text-[10px] font-black text-zinc-900">
                Logo
              </div>
              <div className="min-w-0">
                <h3 className="truncate text-sm font-semibold">{firma}</h3>
                <p className="text-[11px] text-muted-foreground">Name und Ort</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Unterstützer {jahr}
        </p>
      </section>
    </div>
  );
}

export default function SponsorenPage() {
  const [yearTab, setYearTab] = useState<"2026" | "2027">("2026");
  const year = Number(yearTab) as SponsorYear;
  const list = getPublicSponsors(year);
  const hauptsponsoren = list.filter((s) => s.hauptsponsor);
  const weitere = list.filter((s) => !s.hauptsponsor);
  const staticReveal = useStaticReveal();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">Koderlauf {yearTab}</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Sponsoren</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Ohne unsere Sponsoren und Unterstützer wäre der Koderlauf nicht möglich.
          </p>
          <YearSwitcher value={yearTab} onChange={setYearTab} />
          <Link
            href="/sponsor-werden"
            className="mt-8 inline-flex rounded-xl bg-koder-orange px-6 py-3 text-sm font-bold uppercase tracking-widest text-white hover:bg-koder-orange/90"
          >
            Sponsor 2027 werden
          </Link>
        </motion.div>

        {list.length === 0 ? (
          <SponsorenAufbau jahr={yearTab} />
        ) : (
          <>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 rounded-3xl border border-koder-orange/20 bg-gradient-to-r from-koder-orange/10 to-forest-deep/5 p-6 text-center sm:p-8">
          <Heart className="mx-auto h-8 w-8 text-koder-orange" />
          <h2 className="mt-3 text-2xl font-extrabold">Danke an alle Sponsoren & Unterstützer!</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Eure Unterstützung — ob Geld- oder Sachspende — macht den Koderlauf {yearTab} erst möglich.
            Ihr seid ein Teil unseres Laufs!
          </p>
        </motion.div>

        {hauptsponsoren.length > 0 && (
          <motion.div {...variantsReveal(staticReveal, container)}
            className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
              Hauptsponsoren {yearTab}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {hauptsponsoren.map((s) => (
                <motion.div key={s.id} variants={item}>
                  <SponsorCard sponsor={s} gross />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div {...variantsReveal(staticReveal, container)}
          className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
            {hauptsponsoren.length > 0
              ? `Weitere Sponsoren & Unterstützer ${yearTab}`
              : `Unsere Sponsoren & Unterstützer ${yearTab}`}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {weitere.map((s) => (
              <motion.div key={s.id} variants={item}>
                <SponsorCard sponsor={s} />
              </motion.div>
            ))}
          </div>
        </motion.div>
          </>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Du möchtest den Koderlauf auch unterstützen?{" "}
          <Link href="/sponsor-werden" className="text-koder-orange hover:underline">
            Sponsor 2027 werden
          </Link>
          {" "}oder schreibt an{" "}
          <a href="mailto:info@koderlauf.de" className="text-koder-orange hover:underline">info@koderlauf.de</a>
          .
        </p>
      </div>
    </div>
  );
}
