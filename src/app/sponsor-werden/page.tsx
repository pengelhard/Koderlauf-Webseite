import type { Metadata } from "next";
import { Suspense } from "react";
import { EVENT } from "@/lib/event-config";
import { SponsorWerdenContent } from "@/components/sponsoring/sponsor-werden-content";

export const metadata: Metadata = {
  title: `Sponsor ${EVENT.jahr} werden`,
  description: `Liste, Banner oder Bühne – auch eine Kiste Äpfel oder 50 €. Koderlauf ${EVENT.jahr} am ${EVENT.datumFormatiert} in ${EVENT.ort}. Unverbindliche Anfrage, keine Online-Zahlung.`,
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
