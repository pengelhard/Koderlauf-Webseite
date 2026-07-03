"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { EVENT } from "@/lib/event-config";

/**
 * Mobiler Sticky-CTA am unteren Bildschirmrand.
 * Erscheint nur, wenn die Anmeldung geöffnet ist (EVENT.anmeldungOffen).
 */
export function StickyCta() {
  const pathname = usePathname();

  if (!EVENT.anmeldungOffen) return null;
  if (pathname.startsWith("/anmeldung")) return null;

  // Kein backdrop-blur: fixierte Elemente mit Blur verursachen auf Mobile Scroll-Ghosting
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-koder-orange/20 bg-background p-3 md:hidden">
      <Link
        href="/anmeldung"
        className="glow-orange flex w-full items-center justify-center rounded-2xl bg-koder-orange px-6 py-3 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-koder-orange-bright"
      >
        Jetzt anmelden
      </Link>
    </div>
  );
}
