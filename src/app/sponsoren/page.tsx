"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Heart, ExternalLink } from "lucide-react";

interface Sponsor {
  name: string;
  ort: string;
  logo?: string;
  website?: string;
  type: "gold" | "sponsor";
}

const SPONSORS: Sponsor[] = [
  { name: "Heiko Biermeyer", ort: "Obermögersheim", type: "gold" },
  { name: "Bittig IT", ort: "Obermögersheim", type: "gold" },
  { name: "Edeka Holler", ort: "Wassertrüdingen", logo: "/sponsors/edeka.png", website: "https://edeka-wassertruedingen.de/", type: "sponsor" },
  { name: "Modehaus Steingass", ort: "Gunzenhausen", logo: "/sponsors/steingass.png", website: "https://www.modehaus-steingass.de/", type: "sponsor" },
  { name: "S-Kuhl Hofladen", ort: "Obermögersheim", website: "https://s-kuhl.de/", type: "sponsor" },
  { name: "Kaufhalle Schmidt", ort: "Wassertrüdingen", type: "sponsor" },
  { name: "Schreinerei Zinsmeister", ort: "Obermögersheim", website: "https://schreinerei-zinsmeister.de/", type: "sponsor" },
  { name: "Label B", ort: "Wassertrüdingen", type: "sponsor" },
  { name: "Mobiles Sägewerk", ort: "Obermögersheim", type: "sponsor" },
  { name: "Jäger", ort: "Obermögersheim", type: "sponsor" },
  { name: "Kaffeetechnik Piesche", ort: "Gunzenhausen", website: "http://www.kaffeetechnik.info/", type: "sponsor" },
  { name: "Tretlager", ort: "Wassertrüdingen", website: "http://tretlager.net/", type: "sponsor" },
  { name: "Adler Apotheke", ort: "Wassertrüdingen", logo: "/sponsors/adler-apotheke.png", website: "https://deineadlerapo.de/", type: "sponsor" },
  { name: "Medien Schlicker", ort: "Obermögersheim", website: "https://medien-schlicker.de/", type: "sponsor" },
  { name: "Jeremias Abgastechnik", ort: "Wassertrüdingen", logo: "/sponsors/jeremias.png", website: "https://jeremias.de/", type: "sponsor" },
  { name: "Lucalia Balloons", ort: "Schobdach", type: "sponsor" },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

function SponsorInitials({ name }: { name: string }) {
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-koder-orange/20 to-forest-deep/20 text-xl font-black text-koder-orange">
      {initials}
    </div>
  );
}

export default function SponsorenPage() {
  const goldSponsors = SPONSORS.filter((s) => s.type === "gold");
  const regularSponsors = SPONSORS.filter((s) => s.type === "sponsor");

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

        {/* Gold-Sponsoren */}
        {goldSponsors.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
            className="mt-10">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-yellow-500">
              ⭐ Gold-Sponsoren
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {goldSponsors.map((s) => (
                <div key={s.name} className="flex items-center gap-4 rounded-2xl border-2 border-yellow-500/20 bg-gradient-to-r from-yellow-500/5 to-transparent p-5">
                  <SponsorInitials name={s.name} />
                  <div>
                    <h3 className="text-lg font-bold">{s.name}</h3>
                    <p className="text-xs text-muted-foreground">{s.ort} · Geldspende</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Alle Sponsoren */}
        <motion.div variants={container} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
            Unsere Sponsoren & Unterstützer
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {regularSponsors.map((s) => (
              <motion.div key={s.name} variants={item}>
                {s.website ? (
                  <a href={s.website} target="_blank" rel="noopener noreferrer"
                    className="group flex items-center gap-4 rounded-2xl border border-border bg-card p-4 transition-all hover:border-koder-orange/30 hover:shadow-lg hover:shadow-koder-orange/5">
                    {s.logo ? (
                      <Image src={s.logo} alt={s.name} width={64} height={64} className="h-16 w-16 rounded-xl object-contain" unoptimized />
                    ) : (
                      <SponsorInitials name={s.name} />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold">{s.name}</h3>
                      <p className="text-xs text-muted-foreground">{s.ort}</p>
                      <p className="mt-1 flex items-center gap-1 text-[10px] text-koder-orange opacity-0 transition-opacity group-hover:opacity-100">
                        <ExternalLink size={10} /> Website besuchen
                      </p>
                    </div>
                  </a>
                ) : (
                  <div className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4">
                    {s.logo ? (
                      <Image src={s.logo} alt={s.name} width={64} height={64} className="h-16 w-16 rounded-xl object-contain" unoptimized />
                    ) : (
                      <SponsorInitials name={s.name} />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-bold">{s.name}</h3>
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
