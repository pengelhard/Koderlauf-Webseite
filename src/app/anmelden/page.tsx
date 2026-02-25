import type { Metadata } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { RegistrationForm } from "@/components/forms/registration-form";
import { createPageMetadata } from "@/lib/seo";

export const metadata: Metadata = createPageMetadata({
  title: "Anmeldung 2027",
  description: "Melde dich für den Koderlauf 2027 an – schnell, professionell und DSGVO-konform.",
  path: "/anmelden",
});

export default function RegistrationPage() {
  return (
    <>
      <SiteHeader />
      <main className="pt-28">
        <section className="section-shell">
          <div className="mx-auto max-w-5xl space-y-10">
            <div className="space-y-5 text-center">
              <p className="font-display text-sm uppercase tracking-[0.24em] text-primary-glow">Startblock 2027</p>
              <h1 className="text-balance">Anmeldung</h1>
              <p className="mx-auto max-w-3xl text-text-secondary">
                Sichere dir deinen Startplatz für den Koderlauf 2027. Nach dem Formular wirst du direkt
                zur Stripe-Zahlung geleitet.
              </p>
            </div>

            <RegistrationForm />
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
