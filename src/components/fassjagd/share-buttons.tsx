"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { instagramCaption, whatsappText } from "@/lib/fassjagd/copy";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { cn } from "@/lib/utils";

function pageUrl(slug: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/fassjagd/${slug}`;
  }
  return `https://koderlauf.de/fassjagd/${slug}`;
}

export function FassjagdShareButtons({
  club,
  className,
}: {
  club: FassjagdClub;
  className?: string;
}) {
  const url = pageUrl(club.slug);
  const text = whatsappText(club, url);
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const storyPath = `/api/fassjagd/card/${club.slug}?format=story`;
  const [igHint, setIgHint] = useState<string | null>(null);
  const [igBusy, setIgBusy] = useState(false);

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

  async function instagramStory() {
    setIgBusy(true);
    const caption = instagramCaption(club, url);
    try {
      const res = await fetch(storyPath);
      if (!res.ok) throw new Error("card");
      const blob = await res.blob();
      const file = new File([blob], `fassjagd-${club.slug}-story.png`, { type: "image/png" });
      const nav = navigator as Navigator & {
        canShare?: (data: ShareData) => boolean;
      };
      if (typeof nav.canShare === "function" && nav.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Fassjagd: ${club.name}`,
            text: caption,
          });
          setIgHint("Als Instagram-Story einfügen – Bild ist bereit.");
          return;
        } catch {
          /* cancelled or unsupported */
        }
      }
      const objectUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = objectUrl;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
      try {
        await navigator.clipboard.writeText(caption);
        setIgHint("Story gespeichert, Text kopiert. In Instagram als Story posten.");
      } catch {
        setIgHint("Story gespeichert. In Instagram als Story posten.");
      }
    } catch {
      window.location.href = storyPath;
      setIgHint("Story-Karte herunterladen und in Instagram als Story posten.");
    } finally {
      setIgBusy(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        <a
          href={wa}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/whatsapp.png" alt="" width={20} height={20} className="h-5 w-5" />
          WhatsApp
        </a>
        <button
          type="button"
          onClick={() => void instagramStory()}
          disabled={igBusy}
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/instagram.png" alt="" width={20} height={20} className="h-5 w-5 rounded-[5px]" />
          {igBusy ? "Story…" : "Instagram-Story"}
        </button>
        <a
          href={storyPath}
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
      {igHint && <p className="text-xs text-muted-foreground">{igHint}</p>}
    </div>
  );
}
