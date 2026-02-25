"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Footprints, MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button
        variant="outline"
        size="icon"
        className="h-11 w-11 rounded-2xl border-border/60 bg-dark-elevated"
        aria-label="Theme laden"
      >
        <Footprints className="h-5 w-5" />
      </Button>
    );
  }

  const isDark = resolvedTheme !== "light";

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={isDark ? "Helles Theme aktivieren" : "Dunkles Theme aktivieren"}
      className="relative h-11 w-11 overflow-hidden rounded-2xl border-primary-koder/30 bg-dark-elevated text-foreground shadow-orange-glow transition hover:border-primary-koder/60 hover:bg-dark-muted"
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ opacity: 0, y: 8, rotate: -10 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          exit={{ opacity: 0, y: -8, rotate: 10 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {isDark ? <MoonStar className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </motion.span>
      </AnimatePresence>
      <Footprints className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 text-primary-glow/80" />
    </Button>
  );
}
