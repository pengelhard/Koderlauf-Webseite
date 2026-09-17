"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useScroll } from "@/hooks/use-scroll";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { AnmeldeLink } from "@/components/anmeldung/anmelde-link";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { href: "/strecken", label: "Strecken" },
  { href: "/teilnehmer", label: "Teilnehmer" },
  { href: "/fassjagd", label: "Fassjagd" },
  { href: "/ergebnisse", label: "Ergebnisse" },
  { href: "/galerie", label: "Galerie" },
  { href: "/sponsoren", label: "Sponsoren" },
  { href: "/feedback", label: "Feedback" },
] as const;

const sponsorLink = { href: "/sponsor-werden", label: "Sponsor 2027" };

function navLinkClass(active: boolean) {
  return cn(
    "whitespace-nowrap transition-colors hover:text-koder-orange",
    active && "text-koder-orange",
  );
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScroll(50);
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const sponsorActive = pathname === sponsorLink.href || pathname.startsWith(`${sponsorLink.href}/`);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 cursor-default border-0 bg-black/45"
            aria-label="Menü schließen"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-forest-deep shadow-lg lg:transition-all lg:duration-300",
          scrolled
            ? "lg:bg-forest-deep/95 lg:backdrop-blur-md"
            : "lg:bg-forest-deep/70 lg:backdrop-blur-sm lg:shadow-none",
        )}
      >
        <nav
          className="mx-auto grid max-w-7xl grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 px-3 py-3 sm:gap-3 sm:px-6 sm:py-4 lg:px-8"
        >
          <div className="relative z-10 shrink-0">
            <Logo size="md" />
          </div>

          <div
            className="hidden min-w-0 items-center justify-center gap-x-2 gap-y-1 lg:flex xl:gap-x-3 text-[10px] font-semibold uppercase tracking-wide text-white/90 xl:text-xs"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={navLinkClass(pathname === link.href)}
              >
                {link.label}
              </Link>
            ))}
            <Link href={sponsorLink.href} className={navLinkClass(sponsorActive)}>
              {sponsorLink.label}
            </Link>
          </div>

          <div className="flex shrink-0 items-center justify-end gap-2 sm:gap-3">
            {mounted && (
              <button
                type="button"
                suppressHydrationWarning
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full p-2 text-white/70 transition-colors hover:text-koder-orange"
                aria-label="Theme wechseln"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            <Link
              href={sponsorLink.href}
              className={cn(
                "hidden rounded-xl border px-3 py-2 text-[10px] font-semibold uppercase tracking-wide transition md:inline-flex xl:hidden",
                sponsorActive
                  ? "border-koder-orange bg-koder-orange/15 text-koder-orange"
                  : "border-white/40 text-white hover:border-koder-orange hover:text-koder-orange",
              )}
            >
              Sponsor
            </Link>

            <AnmeldeLink
              className="hidden md:inline-flex rounded-xl bg-koder-orange px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition hover:bg-koder-orange/90 xl:px-5 xl:text-sm"
            >
              Anmelden
            </AnmeldeLink>

            <button
              type="button"
              suppressHydrationWarning
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-lg p-2 text-white"
              aria-expanded={mobileOpen}
              aria-label={mobileOpen ? "Menü schließen" : "Menü öffnen"}
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              role="presentation"
              className="cursor-pointer overflow-hidden bg-forest-deep"
              onClick={() => setMobileOpen(false)}
            >
              <div className="flex flex-col gap-4 px-6 py-8">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "block text-lg font-semibold uppercase tracking-widest transition-colors hover:text-koder-orange",
                        pathname === link.href ? "text-koder-orange" : "text-white",
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <Link
                  href={sponsorLink.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "text-lg font-semibold uppercase tracking-widest transition-colors hover:text-koder-orange",
                    sponsorActive ? "text-koder-orange" : "text-white",
                  )}
                >
                  Sponsor 2027 werden
                </Link>
                <AnmeldeLink
                  onClick={() => setMobileOpen(false)}
                  className="rounded-2xl bg-koder-orange px-6 py-3 text-center text-sm font-semibold uppercase tracking-widest text-white"
                >
                  Jetzt anmelden
                </AnmeldeLink>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
