import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCta } from "@/components/layout/sticky-cta";
import { TestBanner } from "@/components/layout/test-banner";
import { EVENT } from "@/lib/event-config";
import { getSiteUrlFromHost, isTestHost } from "@/lib/site-url";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

const streckenListe = EVENT.strecken.map((s) => s.name).join(", ");

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const host = headersList.get("host");
  const siteUrl = getSiteUrlFromHost(host);
  const isTest = isTestHost(host);

  return {
    title: {
      default: `Koderlauf ${EVENT.jahr} – Der jährliche Koderlauf in Obermögersheim`,
      template: "%s | Koderlauf",
    },
    description: `Der jährliche Koderlauf in Obermögersheim. Strecken, Galerie und Anmeldung für den Koderlauf ${EVENT.jahr} am ${EVENT.datumFormatiert}.`,
    metadataBase: new URL(siteUrl),
    ...(isTest ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: `Koderlauf ${EVENT.jahr} – ${EVENT.claim}`,
      description: `Koderlauf in ${EVENT.ort} am ${EVENT.datumFormatiert}. ${streckenListe}.`,
      type: "website",
      locale: "de_DE",
      siteName: "Koderlauf",
    },
    twitter: {
      card: "summary_large_image",
      title: `Koderlauf ${EVENT.jahr}`,
      description: `Koderlauf am ${EVENT.datumFormatiert} in ${EVENT.ort}`,
    },
  };
}

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
          <TestBanner />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <StickyCta />
        </ThemeProvider>
      </body>
    </html>
  );
}
