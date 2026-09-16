import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { headers } from "next/headers";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyCta } from "@/components/layout/sticky-cta";
import { TestBanner } from "@/components/layout/test-banner";
import { MobileMotionConfig } from "@/components/mobile-motion-config";
import { EVENT } from "@/lib/event-config";
import { getCanonicalUrl, getSiteUrlFromHost, isTestHost, PROD_SITE_URL } from "@/lib/site-url";
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
  const pathname = headersList.get("x-pathname") || "/";
  const canonical = getCanonicalUrl(pathname);

  return {
    title: {
      default: `Koderlauf ${EVENT.jahr} – Der jährliche Koderlauf in Obermögersheim`,
      template: "%s | Koderlauf",
    },
    description: `Der jährliche Koderlauf in Obermögersheim. Strecken, Galerie und Anmeldung für den Koderlauf ${EVENT.jahr} am ${EVENT.datumFormatiert}.`,
    metadataBase: new URL(isTest ? siteUrl : PROD_SITE_URL),
    ...(isTest
      ? { robots: { index: false, follow: false } }
      : {
          alternates: {
            canonical,
          },
        }),
    openGraph: {
      title: `Koderlauf ${EVENT.jahr} – ${EVENT.claim}`,
      description: `Koderlauf in ${EVENT.ort} am ${EVENT.datumFormatiert}. ${streckenListe}.`,
      type: "website",
      locale: "de_DE",
      siteName: "Koderlauf",
      url: isTest ? siteUrl : canonical,
    },
    twitter: {
      card: "summary_large_image",
      title: `Koderlauf ${EVENT.jahr}`,
      description: `Koderlauf am ${EVENT.datumFormatiert} in ${EVENT.ort}`,
    },
    // Echtes Maskottchen aus public/mascot-koderlauf.png (transparent).
    // Kein SVG in der Liste: Chrome würde sonst ein anderes Icon bevorzugen.
    // Keine app/icon.png+icon.svg (Next 16 Turbopack-Crash). Query gegen Browser-Cache.
    icons: {
      icon: [
        { url: "/koder-icon.png?v=20260916-2", type: "image/png", sizes: "32x32" },
        { url: "/koder-icon-192.png?v=20260916-2", type: "image/png", sizes: "192x192" },
        { url: "/favicon.ico?v=20260916-2", type: "image/x-icon", sizes: "16x16 32x32 48x48" },
      ],
      shortcut: "/koder-icon.png?v=20260916-2",
      apple: [{ url: "/apple-touch-icon.png?v=20260916-2", sizes: "180x180" }],
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
          <MobileMotionConfig />
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
