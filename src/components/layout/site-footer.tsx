import Link from "next/link";
import { Instagram } from "lucide-react";

const footerLinks = [
  { href: "/ergebnisse", label: "Ergebnisse 2026" },
  { href: "/galerie", label: "Galerie" },
  { href: "/anmelden", label: "Anmeldung 2027" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-primary-koder/15 bg-dark-muted/90">
      <div className="container flex flex-col gap-10 py-14 md:flex-row md:items-start md:justify-between">
        <div className="max-w-md space-y-4">
          <h2 className="font-display text-3xl font-black tracking-tight">Koderlauf Obermögersheim</h2>
          <p className="text-text-secondary">
            Die neue digitale Heimat des jährlichen Koderlaufs – gemacht für alle, die Wald, Tempo
            und Gemeinschaft lieben.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <div className="space-y-3">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-primary-glow">Schnellzugriff</p>
            <ul className="space-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link className="text-text-secondary transition hover:text-primary-glow" href={link.href}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="font-display text-sm uppercase tracking-[0.2em] text-primary-glow">Social</p>
            <div className="flex items-center gap-3">
              <Link
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-primary-koder/20 p-3 text-text-soft transition hover:border-primary-koder/50 hover:text-primary-glow"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.strava.com"
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl border border-primary-koder/20 px-4 py-3 text-sm font-semibold uppercase tracking-widest text-text-soft transition hover:border-primary-koder/50 hover:text-primary-glow"
                aria-label="Strava"
              >
                Strava
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
