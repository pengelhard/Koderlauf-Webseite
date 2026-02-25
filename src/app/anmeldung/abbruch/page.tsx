import Link from "next/link";
import { AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function RegistrationCancelPage() {
  return (
    <main className="section-shell flex min-h-screen items-center justify-center">
      <div className="glass-card mx-auto max-w-xl space-y-6 p-8 text-center md:p-12">
        <AlertCircle className="mx-auto h-14 w-14 text-primary-glow" />
        <h1 className="text-balance text-5xl md:text-6xl">Zahlung abgebrochen.</h1>
        <p className="text-text-secondary">
          Kein Problem – deine Daten bleiben erhalten und du kannst den Zahlungsvorgang jederzeit erneut
          starten.
        </p>
        <div className="flex justify-center">
          <Link href="/anmelden">
            <Button size="lg">Erneut versuchen</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
