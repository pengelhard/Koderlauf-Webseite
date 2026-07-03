"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, ExternalLink } from "lucide-react";
import { YearSwitcher } from "@/components/ui/year-switcher";
import { useStaticReveal, variantsReveal } from "@/hooks/use-static-reveal";

interface Sponsor {
  name: string;
  ort: string;
  logo?: string;
  website?: string;
  /** Logo hat helle Farben – im Light-Mode invertieren für Sichtbarkeit */
  invertInLightMode?: boolean;
  /** Hauptsponsoren werden in einer eigenen, größeren Sektion oben angezeigt */
  hauptsponsor?: boolean;
}

const SPONSORS_2026: Sponsor[] = [
  { name: "Heiko Biermeyer", ort: "Obermögersheim", logo: "/sponsors/biermayer.png", website: "https://elektrotechnik-biermeyer.de/" },
  { name: "Bittig IT", ort: "Obermögersheim", logo: "/sponsors/bittig-it.png", website: "https://www.bittig-it.de/" },
  { name: "Edeka Holler", ort: "Wassertrüdingen", logo: "/sponsors/edeka.png", website: "https://edeka-wassertruedingen.de/" },
  { name: "Modehaus Steingass", ort: "Gunzenhausen", logo: "/sponsors/steingass.png", website: "https://www.modehaus-steingass.de/", invertInLightMode: true },
  { name: "Büttner Agrartechnik", ort: "Ehingen", logo: "/sponsors/buettner.png", website: "https://www.buettner-agrartechnik.de/" },
  { name: "S-Kuhl Hofladen", ort: "Obermögersheim", logo: "/sponsors/s-kuhl.png", website: "https://s-kuhl.de/" },
  { name: "Schmidt Haustechnik", ort: "Wassertrüdingen", logo: "/sponsors/schmidt.png", website: "https://schmidt-haustechnik.de/" },
  { name: "Schreinerei Zinsmeister", ort: "Obermögersheim", logo: "/sponsors/zinsmeister.png", website: "https://schreinerei-zinsmeister.de/" },
  { name: "Label B", ort: "Wassertrüdingen", logo: "/sponsors/label-b.png", website: "https://www.label-b.de/" },
  { name: "Mobiles Sägewerk", ort: "Obermögersheim", logo: "/sponsors/mobiles-saegewerk.png" },
  { name: "Jäger", ort: "Obermögersheim" },
  { name: "Kaffeetechnik Piesche", ort: "Gunzenhausen", logo: "/sponsors/kaffeetechnik-piesche.png", website: "http://www.kaffeetechnik.info/" },
  { name: "Tretlager", ort: "Wassertrüdingen", logo: "/sponsors/tretlager.gif", website: "http://tretlager.net/" },
  { name: "Adler Apotheke", ort: "Wassertrüdingen", logo: "/sponsors/adler-apotheke.png", website: "https://deineadlerapo.de/" },
  { name: "AMK Engelhardt", ort: "Hainsfarth", logo: "/sponsors/amk-engelhardt.png", website: "https://bauzaun-mieten.net/" },
  { name: "BayWa Bau & Garten", ort: "Gunzenhausen", logo: "/sponsors/baywa.png", website: "https://www.baywa-baumarkt.de/markt/gunzenhausen/" },
  { name: "Medien Schlicker", ort: "Obermögersheim", logo: "/sponsors/medien-schlicker.png", website: "https://medien-schlicker.de/" },
  { name: "Jeremias Abgastechnik", ort: "Wassertrüdingen", logo: "/sponsors/jeremias.png", website: "https://jeremias.de/" },
  { name: "Lucalia Balloons", ort: "Schobdach", logo: "/sponsors/lucalia-balloons.png", website: "https://lucalia-balloons-und-events-1.jimdosite.com/" },
  { name: "Martina Edelmann", ort: "Obermögersheim", logo: "/sponsors/edelmann.png", website: "https://www.dvag.de/martina.edelmann/index.html" },
  { name: "Beyhl", ort: "Auhausen", logo: "/sponsors/beyhl.png", website: "https://www.beyhl.de/" },
  { name: "Blattwerkbauer", ort: "Wassertrüdingen", logo: "/sponsors/blattwerk.png", website: "https://www.instagram.com/blattwerkbauer/", invertInLightMode: true },
  { name: "DOMMEL", ort: "Wassertrüdingen", logo: "/sponsors/dommel.png", website: "https://www.dommel.de/" },
  { name: "Fliesen Ballenberger", ort: "Gunzenhausen", logo: "/sponsors/ballenberger.png" },
  { name: "Rothenberger Optik und Schmuck", ort: "Wassertrüdingen", logo: "/sponsors/rothenberger.png", website: "https://www.optik-rothenberger.de/" },
  { name: "KFZ Rosenbauer", ort: "Unterschwaningen", logo: "/sponsors/kfz-rosenbauer.png" },
  { name: "KFZ Jungwirth", ort: "Obermögersheim", logo: "/sponsors/jungwirth.png" },
  { name: "Elektronic Thoma GmbH", ort: "Dentlein am Forst", logo: "/sponsors/thoma.png", website: "https://www.thoma.de/" },
  { name: "Kleeberger Forstdienstleistung", ort: "Obermögersheim", logo: "/sponsors/kleeberger.png" },
  { name: "R+V Versicherung Klaus Kapp", ort: "Wassertrüdingen", logo: "/sponsors/ruv.png", website: "https://www.ruv.de/vor-ort/wassertruedingen/kapp/" },
  { name: "GeuKo Laserscan", ort: "Wassertrüdingen", logo: "/sponsors/geuko.png", website: "https://geuko.de/", invertInLightMode: true },
  { name: "Getränke Peschke", ort: "Ostheim" },
  {
    name: "Sparkasse Wassertrüdingen",
    ort: "Wassertrüdingen",
    logo: "/sponsors/sparkasse-wassertruedingen.png",
    website: "https://www.sparkasse.de/standorte/filialen/sparkasse-ansbach-beratungs-center-wassertruedingen-104062",
  },
  {
    name: "Thomas Schneller e.K.",
    ort: "Unterschwaningen",
    logo: "/sponsors/schneller.png",
    website: "https://www.kartoffelfeinkost-schneller.de/unterschwaningen.html",
  },
  {
    name: "M. Flock",
    ort: "Wolframs-Eschenbach",
    logo: "/sponsors/flock-transporte.png",
    website: "https://www.flock-transporte.de/",
  },
  {
    name: "AMRO IT-Systeme GmbH",
    ort: "Weißenburg i. Bay.",
    logo: "/sponsors/amro-it-systeme.png",
    website: "https://www.amro.de/",
  },
  {
    name: "Stache Fitness",
    ort: "Oberasbach",
    logo: "/sponsors/stache-fitness.png",
    website: "https://www.stache-fitness.de/",
  },
];

const HAUPTSPONSOREN = SPONSORS_2026.filter((s) => s.hauptsponsor);
const WEITERE_SPONSOREN = SPONSORS_2026.filter((s) => !s.hauptsponsor);

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

function SponsorCard({ sponsor, gross = false }: { sponsor: Sponsor; gross?: boolean }) {
  const logoSize = gross ? "h-32 w-32" : "h-24 w-24";
  const inner = (
    <>
      {sponsor.logo ? (
        <Image
          src={sponsor.logo}
          alt={sponsor.name}
          width={gross ? 128 : 96}
          height={gross ? 128 : 96}
          className={`${logoSize} rounded-xl object-contain ${sponsor.invertInLightMode ? "invert dark:invert-0" : ""}`}
          unoptimized
        />
      ) : (
        <SponsorInitials name={sponsor.name} />
      )}
      <div className="min-w-0 flex-1 space-y-1">
        <h3 className={`break-words font-bold leading-relaxed ${gross ? "text-lg" : ""}`}>{sponsor.name}</h3>
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

export default function SponsorenPage() {
  const [yearTab, setYearTab] = useState<"2026" | "2027">("2026");
  const staticReveal = useStaticReveal();

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">Koderlauf {yearTab}</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Sponsoren</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Ohne unsere Sponsoren und Unterstützer wäre der Koderlauf nicht möglich. Wählt das Jahr –
            die Liste für 2027 wird ergänzt, sobald Partner feststehen.
          </p>
          <YearSwitcher value={yearTab} onChange={setYearTab} />
        </motion.div>

        {yearTab === "2027" ? (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10 rounded-3xl border border-border bg-card p-6 text-center sm:p-10"
          >
            <Heart className="mx-auto h-8 w-8 text-koder-orange" />
            <h2 className="mt-3 text-2xl font-extrabold">Sponsoring Koderlauf 2027</h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground sm:text-base">
              Die Sponsoren und Unterstützer für den Koderlauf 2027 werden wir hier bekannt geben, sobald
              die Partnerschaften feststehen. Interesse? Meldet euch gern bei uns.
            </p>
          </motion.div>
        ) : (
          <>
        {/* Danke Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 rounded-3xl border border-koder-orange/20 bg-gradient-to-r from-koder-orange/10 to-forest-deep/5 p-6 text-center sm:p-8">
          <Heart className="mx-auto h-8 w-8 text-koder-orange" />
          <h2 className="mt-3 text-2xl font-extrabold">Danke an alle Sponsoren & Unterstützer!</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Eure Unterstützung — ob Geld- oder Sachspende — macht den Koderlauf 2026 erst möglich.
            Ihr seid ein Teil unseres Laufs!
          </p>
        </motion.div>

        {/* Hauptsponsoren (nur sichtbar, wenn Einträge mit hauptsponsor: true markiert sind) */}
        {HAUPTSPONSOREN.length > 0 && (
          <motion.div {...variantsReveal(staticReveal, container)}
            className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
              Hauptsponsoren 2026
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {HAUPTSPONSOREN.map((s) => (
                <motion.div key={s.name} variants={item}>
                  <SponsorCard sponsor={s} gross />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Alle weiteren Sponsoren */}
        <motion.div {...variantsReveal(staticReveal, container)}
          className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
            {HAUPTSPONSOREN.length > 0 ? "Weitere Sponsoren & Unterstützer 2026" : "Unsere Sponsoren & Unterstützer 2026"}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {WEITERE_SPONSOREN.map((s) => (
              <motion.div key={s.name} variants={item}>
                <SponsorCard sponsor={s} />
              </motion.div>
            ))}
          </div>
        </motion.div>
          </>
        )}

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Du möchtest den Koderlauf auch unterstützen? Schreib uns an{" "}
          <a href="mailto:info@koderlauf.de" className="text-koder-orange hover:underline">info@koderlauf.de</a>
          {" "}oder nutzt unser{" "}
          <Link href="/feedback" className="text-koder-orange hover:underline">
            Kontaktformular
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
