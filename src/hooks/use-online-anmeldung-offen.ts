"use client";

import { useEffect, useState } from "react";
import { isOnlineAnmeldungOffen } from "@/lib/event-config";

/** Prüft alle 30 s, ob der Online-Anmeldeschluss erreicht ist. */
export function useOnlineAnmeldungOffen() {
  const [offen, setOffen] = useState(() => isOnlineAnmeldungOffen());

  useEffect(() => {
    const tick = () => setOffen(isOnlineAnmeldungOffen());
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return offen;
}
