"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";

interface Sponsor {
  name: string;
  ort: string;
  logo?: string;
  website?: string;
  /** Logo hat helle Farben – im Light-Mode invertieren für Sichtbarkeit */
  invertInLightMode?: boolean;
}

const SPONSORS: Sponsor[] = [
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
  { name: "KFZ Rosenbauer", ort: "Unterschwaningen" },
  { name: "KFZ Jungwirth", ort: "Obermögersheim", logo: "/sponsors/jungwirth.png" },
];

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

export default function SponsorenPage() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">Koderlauf 2026</p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">Sponsoren</h1>
          <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
            Ohne unsere großartigen Sponsoren und Unterstützer wäre der Koderlauf nicht möglich.
            Ein herzliches Dankeschön an alle, die dieses Event ermöglichen!
          </p>
        </motion.div>

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

        {/* Alle Sponsoren */}
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
            Unsere Sponsoren & Unterstützer
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {SPONSORS.map((s) => (
              <motion.div key={s.name} variants={item}>
                {s.website ? (
                  <a href={s.website} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-koder-orange/30 hover:shadow-lg hover:shadow-koder-orange/5">
                    {s.logo ? (
                      <Image src={s.logo} alt={s.name} width={96} height={96} className={`h-24 w-24 rounded-xl object-contain ${s.invertInLightMode ? "invert dark:invert-0" : ""}`} unoptimized />
                    ) : (
                      <SponsorInitials name={s.name} />
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="break-words font-bold leading-relaxed">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.ort}</p>
                      <p className="flex items-center gap-1 pt-0.5 text-[10px] text-koder-orange opacity-0 transition-opacity group-hover:opacity-100">
                        <ExternalLink size={10} /> Website besuchen
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                    {s.logo ? (
                      <Image src={s.logo} alt={s.name} width={96} height={96} className={`h-24 w-24 rounded-xl object-contain ${s.invertInLightMode ? "invert dark:invert-0" : ""}`} unoptimized />
                    ) : (
                      <SponsorInitials name={s.name} />
                    )}
                    <div className="min-w-0 flex-1 space-y-1">
                      <h3 className="break-words font-bold leading-relaxed">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.ort}</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>

        <p className="mt-10 text-center text-sm text-muted-foreground">
          Du möchtest den Koderlauf auch unterstützen? Schreib uns an{" "}
          <a href="mailto:info@koderlauf.de" className="text-koder-orange hover:underline">info@koderlauf.de</a>
        </p>
      </div>
    </div>
  );
}
