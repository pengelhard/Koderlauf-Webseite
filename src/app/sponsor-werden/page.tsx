import type { Metadata } from "next";
import { Suspense } from "react";
import { EVENT } from "@/lib/event-config";
import { SponsorWerdenContent } from "@/components/sponsoring/sponsor-werden-content";

export const metadata: Metadata = {
  title: `Sponsor ${EVENT.jahr} werden`,
  description: `Partner für 150 € oder Hauptsponsor ab 500 € beim Koderlauf ${EVENT.jahr} am ${EVENT.datumFormatiert} in ${EVENT.ort}. Kostenpartnerschaften: Medaillen, Startnummern, Verpflegung und mehr.`,
};

export default function SponsorWerdenPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen pt-24 pb-16 text-center text-sm text-muted-foreground">
          Seite wird geladen…
        </div>
      }
    >
      <SponsorWerdenContent />
    </Suspense>
  );
}
