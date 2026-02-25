import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RegistrationSuccessPage() {
  return (
    <main className="section-shell flex min-h-screen items-center justify-center">
      <div className="glass-card mx-auto max-w-xl space-y-6 p-8 text-center md:p-12">
        <CheckCircle2 className="mx-auto h-14 w-14 text-success" />
        <h1 className="text-balance text-5xl md:text-6xl">Stark! Anmeldung erfolgreich.</h1>
        <p className="text-text-secondary">
          Deine Registrierung wurde bestätigt. Wir schicken dir alle Details zusätzlich per E-Mail.
        </p>
        <div className="flex justify-center">
          <Link href="/">
            <Button size="lg">Zur Startseite</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
