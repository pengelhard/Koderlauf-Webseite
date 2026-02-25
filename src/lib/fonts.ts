import { Inter } from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

/**
 * Satoshi-Dateien fehlen aktuell im Repository.
 * Bis die lokale Fontdatei vorliegt, nutzen wir Inter als Display-Fallback
 * und halten die Variable stabil, damit ein späterer Austausch trivial bleibt.
 */
export const satoshi = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-satoshi",
});
