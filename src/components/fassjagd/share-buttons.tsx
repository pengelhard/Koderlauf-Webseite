"use client";

import { useState } from "react";
import { Download, Share2 } from "lucide-react";
import { instagramCaption, whatsappText } from "@/lib/fassjagd/copy";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { getSiteUrl } from "@/lib/site-url";
import { cn } from "@/lib/utils";

function canonicalTeamUrl(slug: string) {
  return `${getSiteUrl()}/fassjagd/${slug}`;
}

function liveTeamUrl(slug: string) {
  if (typeof window !== "undefined") {
    return `${window.location.origin}/fassjagd/${slug}`;
  }
  return canonicalTeamUrl(slug);
}

function isAndroid() {
  return /Android/i.test(navigator.userAgent);
}

function isIOS() {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

/** Instagram hat keine offizielle Web-Story-API. Deep-Link in die App, sonst instagram.com. */
function openInstagramApp() {
  if (isAndroid()) {
    window.location.href =
      "intent://story-camera#Intent;scheme=instagram;package=com.instagram.android;S.browser_fallback_url=https%3A%2F%2Fwww.instagram.com%2F;end";
    return;
  }
  if (isIOS()) {
    window.location.href = "instagram://story-camera";
    window.setTimeout(() => {
      if (document.visibilityState !== "visible") return;
      window.location.href = "instagram://app";
      window.setTimeout(() => {
        if (document.visibilityState === "visible") {
          window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
        }
      }, 700);
    }, 900);
    return;
  }
  window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
}

async function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}

export function FassjagdShareButtons({
  club,
  className,
}: {
  club: FassjagdClub;
  className?: string;
}) {
  const url = canonicalTeamUrl(club.slug);
  const text = whatsappText(club, url);
  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`;
  const storyPath = `/api/fassjagd/card/${club.slug}?format=story`;
  const [igHint, setIgHint] = useState<string | null>(null);
  const [igBusy, setIgBusy] = useState(false);

  async function nativeShare() {
    const live = liveTeamUrl(club.slug);
    const liveText = whatsappText(club, live);
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: `Fassjagd: ${club.name}`, text: liveText, url: live });
        return;
      } catch {
        /* user cancelled */
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(liveText)}`, "_blank", "noopener,noreferrer");
  }

  async function instagramStory() {
    setIgBusy(true);
    const live = liveTeamUrl(club.slug);
    const caption = instagramCaption(club, live);
    try {
      const res = await fetch(storyPath);
      if (!res.ok) throw new Error("card");
      const blob = await res.blob();
      await downloadBlob(blob, `fassjagd-${club.slug}-story.png`);
      try {
        await navigator.clipboard.writeText(live);
      } catch {
        try {
          await navigator.clipboard.writeText(caption);
        } catch {
          /* clipboard optional */
        }
      }
      setIgHint("Bild ist gespeichert – in Instagram als Story posten. Link ist kopiert.");
      window.setTimeout(() => openInstagramApp(), 350);
    } catch {
      window.location.href = storyPath;
      setIgHint("Bild ist gespeichert – in Instagram als Story posten.");
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
      <p className="text-xs text-muted-foreground">
        Instagram-Story speichert das Bild und versucht, die App zu öffnen. Es gibt keine offizielle
        Web-Story-Funktion – danach in Instagram als Story posten.{" "}
        <a
          href="https://www.instagram.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-koder-orange hover:underline"
        >
          Instagram öffnen
        </a>
      </p>
      {igHint && <p className="text-sm font-medium text-foreground">{igHint}</p>}
    </div>
  );
}
