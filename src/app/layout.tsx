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
    default: "Koderlauf 2026 – Der jährliche Koderlauf in Obermögersheim",
    template: "%s | Koderlauf",
  },
  description:
    "Der jährliche Koderlauf in Obermögersheim. Strecken, Galerie und Anmeldung für den Koderlauf 2026.",
  metadataBase: new URL("https://koderlauf.de"),
  openGraph: {
    title: "Koderlauf 2026 – Lauf mit Herz durch den Wald",
    description:
      "Koderlauf in Obermögersheim am 04. April 2026. Kinderlauf, 4 km, 8,5 km und Trailrun.",
    type: "website",
    locale: "de_DE",
    siteName: "Koderlauf",
  },
  twitter: {
    card: "summary_large_image",
    title: "Koderlauf 2026",
    description: "Koderlauf am 04. April 2026 in Obermögersheim",
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
