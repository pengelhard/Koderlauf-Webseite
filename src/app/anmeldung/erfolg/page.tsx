"use client";

import { motion } from "framer-motion";
import { CheckCircle, PartyPopper } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErfolgContent() {
  const params = useSearchParams();
  const sessionId = params.get("session_id");

  return (
    <div className="flex min-h-screen items-center justify-center px-4 pt-24 pb-16">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" as const, stiffness: 200 }}
          className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-success/10"
        >
          <CheckCircle className="h-12 w-12 text-success" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1 className="mt-8 text-4xl font-extrabold tracking-tight">
            Anmeldung erfolgreich! <PartyPopper className="inline h-8 w-8" />
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Deine Zahlung wurde bestätigt und du bist offiziell für den
            <span className="font-semibold text-koder-orange"> Koderlauf 2027 </span>
            angemeldet!
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Eine Bestätigungs-E-Mail mit deiner Startnummer ist unterwegs.
          </p>

          {sessionId && (
            <p className="mt-4 rounded-2xl bg-muted px-4 py-2 text-xs text-muted-foreground">
              Buchungs-Ref: {sessionId.slice(0, 20)}...
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center"
        >
          <Link
            href="/"
            className="rounded-2xl border-2 border-border px-6 py-3 text-sm font-semibold uppercase tracking-widest transition-all hover:border-koder-orange/30"
          >
            Zur Startseite
          </Link>
          <Link
            href="/ergebnisse"
            className="rounded-2xl bg-koder-orange px-6 py-3 text-sm font-semibold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
          >
            Ergebnisse ansehen
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function ErfolgPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-koder-orange border-t-transparent" />
        </div>
      }
    >
      <ErfolgContent />
    </Suspense>
  );
}
