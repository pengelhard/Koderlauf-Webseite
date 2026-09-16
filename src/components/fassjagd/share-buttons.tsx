"use client";

import { useEffect, useState } from "react";
import { Download, Share2 } from "lucide-react";
import { instagramCaption, teamShareUrl, whatsappShareHref, whatsappText } from "@/lib/fassjagd/copy";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { cn } from "@/lib/utils";
import {
  cacheStoryJpeg,
  filesShareData,
  isAbortError,
  jpegFileFromBlob,
  peekStoryBlob,
  peekStoryJpeg,
  peekStoryPng,
  prefetchStoryPng,
  runShareChain,
  textShareData,
  type ShareChainResult,
} from "@/lib/fassjagd/web-share";

function liveOrigin(): string {
  return window.location.origin;
}

function liveTeamUrl(slug: string) {
  return `${liveOrigin()}/fassjagd/${slug}`;
}

function hasNavigatorShare() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function copyCaption(text: string) {
  void navigator.clipboard?.writeText(text).catch(() => {
    /* Zwischenablage ist optional – Share hängt nicht daran */
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const objectUrl = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = objectUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1500);
}

async function jpegFromPngBlob(blob: Blob, filename: string): Promise<File | null> {
  if (typeof createImageBitmap !== "function" || typeof document === "undefined") {
    return null;
  }
  try {
    const bitmap = await createImageBitmap(blob);
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      bitmap.close();
      return null;
    }
    ctx.drawImage(bitmap, 0, 0);
    bitmap.close();
    const jpegBlob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", 0.92);
    });
    if (!jpegBlob) return null;
    return jpegFileFromBlob(jpegBlob, filename);
  } catch {
    return null;
  }
}

function tryShare(data: ShareData): Promise<ShareChainResult> {
  if (!hasNavigatorShare()) return Promise.resolve("fail");
  // share() hier synchron starten – kein await davor.
  return navigator
    .share(data)
    .then((): ShareChainResult => "ok")
    .catch((err: unknown): ShareChainResult => (isAbortError(err) ? "abort" : "fail"));
}

export function FassjagdShareButtons({
  club,
  className,
}: {
  club: FassjagdClub;
  className?: string;
}) {
  const storyPath = `/api/fassjagd/card/${club.slug}?format=story`;
  const pngName = `fassjagd-${club.slug}-story.png`;
  const jpgName = `fassjagd-${club.slug}-story.jpg`;
  const [igHint, setIgHint] = useState<string | null>(null);
  const [igBusy, setIgBusy] = useState(false);
  const [pendingShare, setPendingShare] = useState<{ caption: string } | null>(null);
  const [waHref, setWaHref] = useState<string>();

  async function warmJpeg(path: string) {
    const blob = peekStoryBlob(path);
    if (!blob || peekStoryJpeg(path)) return;
    const jpeg = await jpegFromPngBlob(blob, jpgName);
    if (jpeg) cacheStoryJpeg(path, jpeg);
  }

  function prefetchNow() {
    void prefetchStoryPng(storyPath, pngName).then(() => warmJpeg(storyPath));
  }

  useEffect(() => {
    prefetchNow();
    // storyPath/pngName binden an club.slug
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyPath, pngName, jpgName]);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setWaHref(whatsappShareHref(club, liveOrigin()));
    });
    return () => cancelAnimationFrame(frame);
  }, [club]);

  function shareTitle() {
    return `Fassjagd: ${club.name}`;
  }

  function downloadCached(filename = pngName) {
    const blob = peekStoryBlob(storyPath);
    if (!blob) return false;
    downloadBlob(blob, filename);
    setIgHint("Bild gespeichert. Auf dem Handy: Teilen → Instagram-Story.");
    return true;
  }

  function shareChain(caption: string, allowDownload: boolean) {
    const title = shareTitle();
    const png = peekStoryPng(storyPath);
    const jpeg = peekStoryJpeg(storyPath);
    const steps: Array<() => Promise<ShareChainResult>> = [];
    if (png) {
      steps.push(() => tryShare(filesShareData(png, title, caption)));
    }
    if (jpeg) {
      steps.push(() => tryShare(filesShareData(jpeg, title, caption)));
    }
    if (hasNavigatorShare()) {
      steps.push(() => tryShare(textShareData(title, caption)));
    }
    if (allowDownload) {
      steps.push(async () => (downloadCached() ? "downloaded" : "fail"));
    }
    return runShareChain(steps);
  }

  function onShareSettled(result: ShareChainResult, caption: string) {
    if (result === "abort") {
      setPendingShare(null);
      return;
    }
    if (result === "ok") {
      setPendingShare(null);
      setIgHint(null);
      return;
    }
    if (result === "downloaded") {
      setPendingShare(null);
      return;
    }
    setPendingShare({ caption });
    setIgHint("Tippe Jetzt teilen – dann Instagram wählen.");
  }

  /** Frische Geste: File liegt schon im Cache, share() ohne Fetch. */
  function onJetztTeilen() {
    const caption = pendingShare?.caption ?? instagramCaption(club, liveTeamUrl(club.slug));
    const png = peekStoryPng(storyPath);
    if (!png) {
      prefetchNow();
      setIgHint("Bild wird geladen – gleich nochmal „Jetzt teilen“.");
      return;
    }
    const sharePromise = shareChain(caption, true);
    copyCaption(caption);
    void sharePromise.then((result) => onShareSettled(result, caption));
  }

  function onInstagramClick() {
    setIgHint(null);
    const caption = instagramCaption(club, liveTeamUrl(club.slug));
    const png = peekStoryPng(storyPath);

    if (png && hasNavigatorShare()) {
      // Gleiche User-Geste: share() ohne vorheriges await.
      const sharePromise = shareChain(caption, false);
      copyCaption(caption);
      void sharePromise.then((result) => onShareSettled(result, caption));
      return;
    }

    if (png && !hasNavigatorShare()) {
      copyCaption(caption);
      downloadCached();
      return;
    }

    setIgBusy(true);
    void prefetchStoryPng(storyPath, pngName)
      .then((file) => {
        setIgBusy(false);
        void warmJpeg(storyPath);
        copyCaption(caption);
        if (!hasNavigatorShare()) {
          downloadCached();
          return;
        }
        // Nach await ist die Geste auf iOS oft weg – zweiten Button zeigen
        // und Share trotzdem versuchen (Android erlaubt das manchmal noch).
        setPendingShare({ caption });
        setIgHint("Tippe Jetzt teilen – dann Instagram wählen.");
        void tryShare(filesShareData(file, shareTitle(), caption)).then((result) => {
          if (result === "ok" || result === "abort") {
            setPendingShare(null);
            if (result === "ok") setIgHint(null);
          }
        });
      })
      .catch(() => {
        setIgBusy(false);
        setPendingShare(null);
        setIgHint("Bild konnte nicht geladen werden. Nochmal tippen.");
      });
  }

  function openWhatsApp() {
    window.open(whatsappShareHref(club, liveOrigin()), "_blank", "noopener,noreferrer");
  }

  async function nativeShare() {
    const live = teamShareUrl(liveOrigin(), club.slug);
    const liveText = whatsappText(club, live);
    if (hasNavigatorShare()) {
      try {
        await navigator.share({ title: `Fassjagd: ${club.name}`, text: liveText, url: live });
        return;
      } catch {
        /* user cancelled */
      }
    }
    openWhatsApp();
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap gap-2">
        {waHref ? (
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/whatsapp.png" alt="" width={20} height={20} className="h-5 w-5" />
            WhatsApp
          </a>
        ) : (
          <button
            type="button"
            onClick={openWhatsApp}
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/whatsapp.png" alt="" width={20} height={20} className="h-5 w-5" />
            WhatsApp
          </button>
        )}
        <button
          type="button"
          onPointerDown={prefetchNow}
          onTouchStart={prefetchNow}
          onClick={onInstagramClick}
          disabled={igBusy}
          className="inline-flex items-center gap-2 rounded-xl bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-800 disabled:opacity-60"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/instagram.png" alt="" width={20} height={20} className="h-5 w-5 rounded-[5px]" />
          {igBusy ? "Story…" : "Instagram-Story"}
        </button>
        {pendingShare && (
          <button
            type="button"
            onPointerDown={prefetchNow}
            onClick={onJetztTeilen}
            className="inline-flex items-center gap-2 rounded-xl bg-koder-orange px-4 py-2.5 text-sm font-semibold text-white hover:brightness-110"
          >
            <Share2 className="h-4 w-4" aria-hidden />
            Jetzt teilen
          </button>
        )}
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
        Instagram öffnet Teilen mit dem Bild – Instagram wählen. Falls nichts passiert: „Jetzt
        teilen“.
      </p>
      {igHint && <p className="text-sm font-medium text-foreground">{igHint}</p>}
    </div>
  );
}
