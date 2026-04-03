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
  { href: "/strecken", label: "Strecken" },
  { href: "/anmeldungen", label: "Anmeldungen" },
  { href: "/ergebnisse", label: "Ergebnisse" },
  { href: "/galerie", label: "Galerie" },
  { href: "/sponsoren", label: "Sponsoren" },
  { href: "/feedback", label: "Feedback" },
] as const;

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
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            type="button"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 cursor-default border-0 bg-black/45 backdrop-blur-[2px]"
            aria-label="Menü schließen"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-forest-deep/95 backdrop-blur-md shadow-lg"
            : "bg-forest-deep/70 backdrop-blur-sm"
        )}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
          <Logo size="md" />

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

            <button
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
              className="cursor-pointer overflow-hidden bg-forest-deep/98 backdrop-blur-xl"
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
    </>
  );
}
