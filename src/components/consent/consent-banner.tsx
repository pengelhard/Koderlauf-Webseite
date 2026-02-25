"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const CONSENT_KEY = "koderlauf-consent-v1";

export function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = window.localStorage.getItem(CONSENT_KEY);
    setVisible(!accepted);
  }, []);

  if (!visible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-0 right-0 z-50 px-4"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie und Foto-Consent"
    >
      <div className="mx-auto max-w-4xl rounded-2xl border border-primary-koder/30 bg-dark-elevated/95 p-5 shadow-orange-glow backdrop-blur-xl">
        <p className="text-sm text-text-soft">
          Wir nutzen technisch notwendige Cookies für Funktionalität und speichern Einwilligungen zur
          Foto-Nutzung DSGVO-konform.
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="sm:w-auto"
            onClick={() => {
              window.localStorage.setItem(CONSENT_KEY, "accepted");
              setVisible(false);
            }}
          >
            Zustimmung erteilen
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="sm:w-auto"
            onClick={() => {
              window.localStorage.setItem(CONSENT_KEY, "declined");
              setVisible(false);
            }}
          >
            Nur notwendig
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
