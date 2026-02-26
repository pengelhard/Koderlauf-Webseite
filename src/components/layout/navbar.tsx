"use client";

import Link from "next/link";
import { useScroll } from "@/hooks/use-scroll";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";

const navLinks = [
  { href: "/", label: "Start" },
  { href: "/strecken", label: "Strecken" },
  { href: "/ergebnisse", label: "Ergebnisse" },
  { href: "/galerie", label: "Galerie" },
  { href: "/anmeldung", label: "Anmeldung" },
];

export function Navbar() {
  const scrolled = useScroll(50);
  const { theme, setTheme } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-forest-deep/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Logo size="md" />

        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium uppercase tracking-widest text-white/80 transition-colors hover:text-koder-orange"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full p-2 text-white/70 transition-colors hover:text-koder-orange"
              aria-label="Theme wechseln"
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          )}

          <Link
            href="/anmeldung"
            className="hidden rounded-2xl bg-koder-orange px-6 py-2.5 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright hover:shadow-lg hover:shadow-koder-orange/25 md:block"
          >
            Jetzt anmelden
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-white md:hidden"
            aria-label="Menü"
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
            className="overflow-hidden bg-forest-deep/98 backdrop-blur-xl md:hidden"
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
                    className="block text-lg font-semibold uppercase tracking-widest text-white transition-colors hover:text-koder-orange"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <Link
                href="/anmeldung"
                onClick={() => setMobileOpen(false)}
                className="mt-4 rounded-2xl bg-koder-orange px-6 py-3 text-center text-sm font-semibold uppercase tracking-widest text-white"
              >
                Jetzt anmelden
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
