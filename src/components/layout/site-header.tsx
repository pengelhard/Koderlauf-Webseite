"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/ergebnisse", label: "Ergebnisse 2026" },
  { href: "/galerie", label: "Galerie" },
  { href: "/anmelden", label: "Jetzt anmelden" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed left-0 top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-primary-koder/15 bg-dark/92 shadow-lg backdrop-blur-xl"
          : "bg-transparent",
      )}
    >
      <div className="container flex h-20 items-center justify-between">
        <Link href="/" className="group inline-flex items-center gap-3" aria-label="Koderlauf Startseite">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-koder text-sm font-black uppercase tracking-wider text-white shadow-orange-glow transition group-hover:scale-105">
            KL
          </span>
          <span className="hidden font-display text-xl font-extrabold tracking-tight text-white sm:inline-flex">
            Koderlauf
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.slice(0, 2).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-soft transition hover:text-primary-glow"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/anmelden" className="hidden sm:inline-flex">
            <Button size="lg" className="cta-glow">
              Jetzt anmelden
            </Button>
          </Link>
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Navigation schließen" : "Navigation öffnen"}
            aria-expanded={open}
            aria-controls="mobile-nav"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.24, ease: "easeInOut" }}
            className="overflow-hidden border-t border-primary-koder/15 bg-dark-muted/95 px-6 pb-8 pt-4 backdrop-blur-xl lg:hidden"
          >
            <div className="mx-auto flex max-w-md flex-col gap-3">
              {navLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-primary-koder/15 bg-dark-elevated px-4 py-3 font-medium text-text-soft transition hover:border-primary-koder/45 hover:text-primary-glow"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
