import Link from "next/link";
import Image from "next/image";
import { Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-forest-deep text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 md:grid-cols-4">
          <div>
            <div className="flex items-center gap-3">
              <Image
                src="/mascot-koderlauf.png"
                alt="Koderlauf Maskottchen"
                width={48}
                height={52}
                className="drop-shadow-[0_2px_10px_rgba(255,107,0,0.3)]"
              />
              <span className="text-2xl font-black tracking-tight">
                <span className="text-white">Koder</span>
                <span className="text-koder-orange">lauf</span>
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-white/60">
              Der jährliche Koderlauf in Obermögersheim. Gemeinsam laufen,
              lachen, anfeuern – seit 2026.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
              Event
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <Link href="/" className="transition-colors hover:text-white">
                  Startseite
                </Link>
              </li>
              <li>
                <Link href="/strecken" className="transition-colors hover:text-white">
                  Strecken 2026
                </Link>
              </li>
              <li>
                <Link href="/ergebnisse" className="transition-colors hover:text-white">
                  Ergebnisse
                </Link>
              </li>
              <li>
                <Link href="/galerie" className="transition-colors hover:text-white">
                  Galerie
                </Link>
              </li>
              <li>
                <Link href="/anmeldung" className="transition-colors hover:text-white">
                  Anmeldung 2026
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
              Rechtliches
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/60">
              <li>
                <Link href="/impressum" className="transition-colors hover:text-white">
                  Impressum
                </Link>
              </li>
              <li>
                <Link href="/datenschutz" className="transition-colors hover:text-white">
                  Datenschutzerklärung
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
              Folge uns
            </h4>
            <div className="mt-4 flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-koder-orange"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://strava.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-xs font-bold transition-colors hover:bg-koder-orange"
                aria-label="Strava"
              >
                S
              </a>
            </div>
            <p className="mt-6 text-xs text-white/40">
              © {new Date().getFullYear()} Koderlauf Obermögersheim
              <br />
              <a href="https://koderlauf.de" className="hover:text-white/60">
                koderlauf.de
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
