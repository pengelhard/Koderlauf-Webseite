import type { Metadata } from "next";

import { ConsentBanner } from "@/components/consent/consent-banner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { inter, satoshi } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://koderlauf.de"),
  title: {
    default: "Koderlauf Obermögersheim",
    template: "%s | Koderlauf Obermögersheim",
  },
  description:
    "Die neue Heimat des jährlichen Koderlaufs in Obermögersheim – Ergebnisse 2026, Galerie und Anmeldung für 2027.",
  openGraph: {
    title: "Koderlauf Obermögersheim",
    description:
      "Lauf mit Herz durch den Wald – mit Live-Countdown, Ergebnissen, Galerie und professioneller Anmeldung.",
    images: ["/opengraph-image"],
    locale: "de_DE",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} ${satoshi.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
          <ConsentBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
