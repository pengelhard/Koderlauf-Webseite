"use client";

import { Download, MessageCircle, Share2 } from "lucide-react";
import { whatsappText } from "@/lib/fassjagd/copy";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { cn } from "@/lib/utils";

export function FassjagdShareButtons({
  club,
  className,
}: {
  club: FassjagdClub;
  className?: string;
}) {
  const url =
    typeof window !== "undefined"
      ? `${window.location.origin}/fassjagd/${club.slug}`
      : `https://koderlauf.de/fassjagd/${club.slug}`;
  const text = whatsappText(club, url);
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;

  async function nativeShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `Fassjagd: ${club.name}`, text, url });
        return;
      } catch {
        /* user cancelled */
      }
    }
    window.open(wa, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      <a
        href={wa}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
      >
        <MessageCircle className="h-4 w-4" aria-hidden />
        WhatsApp
      </a>
      <a
        href={`/api/fassjagd/card/${club.slug}?format=story`}
        className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
      >
        <Download className="h-4 w-4" aria-hidden />
        Story-Karte
      </a>
      <button
        type="button"
        onClick={() => void nativeShare()}
        className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold hover:border-koder-orange/40"
      >
        <Share2 className="h-4 w-4" aria-hidden />
        Teilen
      </button>
    </div>
  );
}
