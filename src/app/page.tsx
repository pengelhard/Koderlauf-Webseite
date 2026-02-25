import Link from "next/link";
import { ArrowRight, Camera, Medal, Trees } from "lucide-react";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { HeroSection } from "@/components/sections/hero-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getCountdownSettings } from "@/lib/supabase/queries";

const highlights = [
  {
    title: "Ergebnisse 2026",
    text: "Alle Zeiten, Altersklassen und Platzierungen – schnell filterbar und live aktualisiert.",
    icon: Medal,
    href: "/ergebnisse",
  },
  {
    title: "Galerie",
    text: "Momente im Wald, auf der Strecke und im Ziel. Energie, Emotion und Community.",
    icon: Camera,
    href: "/galerie",
  },
  {
    title: "Anmeldung 2027",
    text: "Professioneller Check-out mit klaren Klassen, Consent und sofortiger Bestätigung.",
    icon: Trees,
    href: "/anmelden",
  },
];

export default async function HomePage() {
  const countdown = await getCountdownSettings("koderlauf-2027");

  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection countdownTarget={countdown.targetTimestamp} countdownLabel={countdown.label} />

        <section className="section-shell">
          <div className="mb-12 flex items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <p className="font-display text-sm uppercase tracking-[0.24em] text-primary-glow">Was dich erwartet</p>
              <h2 className="text-balance">Von lokalen Trails zu Marathon-Vibes</h2>
              <p className="text-text-secondary">
                Koderlauf verbindet dörfliche Herzlichkeit mit einer digitalen Plattform auf Profi-Niveau.
              </p>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {highlights.map((item, index) => (
              <Card key={item.title} className="group" style={{ animationDelay: `${index * 120}ms` }}>
                <CardHeader>
                  <span className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-primary-koder/25 bg-primary-koder/12 text-primary-glow">
                    <item.icon className="h-6 w-6" />
                  </span>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.text}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={item.href}>
                    <Button variant="ghost" className="group-hover:text-primary-glow">
                      Mehr entdecken <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
