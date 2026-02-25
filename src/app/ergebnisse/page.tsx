import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { ResultsTable } from "@/components/results/results-table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getResults2026 } from "@/lib/supabase/queries";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Ergebnisse 2026",
  description: "Ergebnisse, Zeiten und Platzierungen des Koderlaufs 2026.",
  path: "/ergebnisse",
});

export default async function ResultsPage() {
  const results = await getResults2026();

  return (
    <>
      <SiteHeader />
      <main className="pt-28">
        <section className="section-shell">
          <div className="mx-auto max-w-6xl space-y-8">
            <div className="space-y-4">
              <p className="font-display text-sm uppercase tracking-[0.24em] text-primary-glow">
                Koderlauf · Official Results
              </p>
              <h1 className="text-balance">Ergebnisse 2026</h1>
              <p className="max-w-3xl text-text-secondary">
                Live-fähige Ergebnisübersicht mit Sieger-Akzent, sticky Header und sauberer Lesbarkeit auf
                jedem Device.
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>10KM Gesamtwertung</CardTitle>
              </CardHeader>
              <CardContent>
                <ResultsTable results={results} />
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
