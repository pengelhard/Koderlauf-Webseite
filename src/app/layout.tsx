import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    default: "Koderlauf – Waldlauf in Obermögersheim",
    template: "%s | Koderlauf",
  },
  description:
    "Der jährliche Waldlauf in Obermögersheim. Ergebnisse, Galerie und Anmeldung für den Koderlauf 2027.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://koderlauf.de"
  ),
  openGraph: {
    title: "Koderlauf 2027 – Lauf mit Herz durch den Wald",
    description:
      "5 km & 10 km Waldlauf in Obermögersheim. Ergebnisse, Galerie und Online-Anmeldung.",
    type: "website",
    locale: "de_DE",
    siteName: "Koderlauf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koderlauf 2027",
    description: "Lauf mit Herz durch den Wald – Obermögersheim",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
