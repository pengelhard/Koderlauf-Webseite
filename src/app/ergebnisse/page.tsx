import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const metadata: Metadata = {
  title: "Ergebnisse 2026",
  description: "Ergebnisse, Zeiten und Platzierungen des Koderlaufs 2026.",
};

const demoResults = [
  { rank: 1, name: "Lena Baum", team: "TSV Obermögersheim", time: "00:38:12", bib: "114" },
  { rank: 2, name: "Jonas Fuchs", team: "Trail Crew", time: "00:39:07", bib: "052" },
  { rank: 3, name: "Emil Winter", team: "Laufclub Altmühl", time: "00:40:11", bib: "079" },
  { rank: 4, name: "Mia Haas", team: "Forest Pace", time: "00:42:59", bib: "165" },
];

export default function ResultsPage() {
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
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rang</TableHead>
                      <TableHead>Startnr.</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Team</TableHead>
                      <TableHead>Zeit</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {demoResults.map((result) => (
                      <TableRow key={result.bib} data-winner={result.rank === 1}>
                        <TableCell>{result.rank}</TableCell>
                        <TableCell>{result.bib}</TableCell>
                        <TableCell className="font-semibold">{result.name}</TableCell>
                        <TableCell>{result.team}</TableCell>
                        <TableCell>{result.time}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
