import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import {
  cacheStoryJpeg,
  cacheStoryPng,
  classifyPostFetchShare,
  isAbortError,
  jpegFileFromBlob,
  peekStoryJpeg,
  peekStoryPng,
  pngFileFromBlob,
  prefetchStoryPng,
  resetStoryCache,
  runShareChain,
  shareFallbackOrder,
  shareStepFromClick,
  PNG_MIME,
  JPEG_MIME,
} from "./web-share.ts";

const here = dirname(fileURLToPath(import.meta.url));
const shareButtonsSrc = readFileSync(join(here, "../../components/fassjagd/share-buttons.tsx"), "utf8");

test("PNG-File bekommt immer type image/png, egal was der Blob sagt", () => {
  const empty = new Blob([new Uint8Array([137, 80, 78, 71])], { type: "" });
  const octet = new Blob([new Uint8Array([137, 80, 78, 71])], { type: "application/octet-stream" });
  const jpegLabeled = new Blob([new Uint8Array([137, 80, 78, 71])], { type: "image/jpeg" });
  for (const blob of [empty, octet, jpegLabeled]) {
    const file = pngFileFromBlob(blob, "fassjagd-team-story.png");
    assert.equal(file.type, PNG_MIME);
    assert.equal(file.name, "fassjagd-team-story.png");
  }
});

test("JPEG-Kopie setzt image/jpeg", () => {
  const blob = new Blob([new Uint8Array([0xff, 0xd8])], { type: "" });
  const file = jpegFileFromBlob(blob, "fassjagd-team-story.jpg");
  assert.equal(file.type, JPEG_MIME);
});

test("canShare false überspringt File-Share nicht", () => {
  const png = pngFileFromBlob(new Blob(["x"], { type: "text/plain" }), "a.png");
  const jpeg = jpegFileFromBlob(new Blob(["y"]), "a.jpg");
  assert.deepEqual(
    shareFallbackOrder({ hasNavigatorShare: true, pngFile: png, jpegFile: jpeg }),
    ["png", "jpeg", "text", "download"],
  );
  assert.deepEqual(
    shareFallbackOrder({ hasNavigatorShare: true, pngFile: png, jpegFile: null }),
    ["png", "text", "download"],
  );
  assert.deepEqual(
    shareFallbackOrder({ hasNavigatorShare: false, pngFile: png }),
    ["download"],
  );
});

test("Klick mit fertigem File teilt sofort, sonst zweiter Tap oder Download", () => {
  assert.equal(shareStepFromClick({ pngReady: true, hasNavigatorShare: true }), "share_now");
  assert.equal(
    shareStepFromClick({ pngReady: false, hasNavigatorShare: true }),
    "fetch_then_second_tap",
  );
  assert.equal(shareStepFromClick({ pngReady: true, hasNavigatorShare: false }), "download");
  assert.equal(shareStepFromClick({ pngReady: false, hasNavigatorShare: false }), "download");
});

test("AbortError ist still, NotAllowedError braucht zweiten Tap", () => {
  assert.equal(isAbortError({ name: "AbortError" }), true);
  assert.equal(isAbortError({ name: "NotAllowedError" }), false);
  assert.equal(classifyPostFetchShare({ name: "AbortError" }), "abort");
  assert.equal(classifyPostFetchShare({ name: "NotAllowedError" }), "needs_second_tap");
  assert.equal(classifyPostFetchShare({ name: "TypeError" }), "continue");
});

test("runShareChain ruft den ersten Step synchron auf (gleiche Geste)", async () => {
  let firstCalledSync = false;
  const p = runShareChain([
    async () => {
      firstCalledSync = true;
      return "ok";
    },
    async () => {
      throw new Error("darf nicht laufen");
    },
  ]);
  assert.equal(firstCalledSync, true);
  assert.equal(await p, "ok");
});

test("runShareChain: Abort bricht ab, Fail geht zum nächsten Step", async () => {
  const log: string[] = [];
  const aborted = await runShareChain([
    async () => {
      log.push("png");
      return "abort";
    },
    async () => {
      log.push("jpeg");
      return "ok";
    },
  ]);
  assert.equal(aborted, "abort");
  assert.deepEqual(log, ["png"]);

  const failedThenOk = await runShareChain([
    async () => "fail",
    async () => "ok",
  ]);
  assert.equal(failedThenOk, "ok");

  const downloaded = await runShareChain([
    async () => "fail",
    async () => "downloaded",
  ]);
  assert.equal(downloaded, "downloaded");
});

test("Prefetch cached File und setzt image/png", async () => {
  resetStoryCache();
  const blob = new Blob([new Uint8Array([1, 2, 3])], { type: "application/octet-stream" });
  const fetchImpl: typeof fetch = async () =>
    new Response(blob, { status: 200, headers: { "Content-Type": "application/octet-stream" } });
  const file = await prefetchStoryPng("/api/card/demo?format=story", "demo.png", fetchImpl);
  assert.equal(file.type, PNG_MIME);
  assert.equal(peekStoryPng("/api/card/demo?format=story"), file);
  const again = await prefetchStoryPng("/api/card/demo?format=story", "demo.png", async () => {
    throw new Error("kein zweiter Fetch");
  });
  assert.equal(again, file);
});

test("Prefetch-Fehler lässt Retry zu", async () => {
  resetStoryCache();
  let calls = 0;
  const failing: typeof fetch = async () => {
    calls += 1;
    return new Response("nope", { status: 500 });
  };
  await assert.rejects(() => prefetchStoryPng("/api/card/fail", "x.png", failing));
  const ok: typeof fetch = async () => new Response(new Blob(["ok"]), { status: 200 });
  const file = await prefetchStoryPng("/api/card/fail", "x.png", ok);
  assert.equal(file.type, PNG_MIME);
  assert.equal(calls, 1);
});

test("Story-Cache hält PNG und JPEG getrennt", () => {
  resetStoryCache();
  const png = cacheStoryPng("/p", new Blob(["png"]), "a.png");
  cacheStoryJpeg("/p", jpegFileFromBlob(new Blob(["jpg"]), "a.jpg"));
  assert.equal(peekStoryPng("/p"), png);
  assert.equal(peekStoryJpeg("/p")?.type, JPEG_MIME);
});

test("Share-Buttons bleiben ohne instagram:// und ohne canShare-Frühreturn", () => {
  assert.equal(shareButtonsSrc.includes("instagram://"), false);
  assert.equal(shareButtonsSrc.includes("intent://"), false);
  assert.equal(shareButtonsSrc.includes("story-camera"), false);
  assert.equal(/canShareFiles\(/.test(shareButtonsSrc), false);
  assert.match(shareButtonsSrc, /Jetzt teilen/);
  assert.match(shareButtonsSrc, /onPointerDown/);
  assert.match(shareButtonsSrc, /onTouchStart/);
  assert.match(shareButtonsSrc, /prefetchStoryPng/);
});

test("Instagram-Button verspricht kein direktes Öffnen der App", () => {
  assert.match(shareButtonsSrc, /\{igBusy \? "Bild…" : "Instagram"\}/);
  assert.match(shareButtonsSrc, /Teilen → Instagram \(Bild ist dabei\)/);
  assert.equal(shareButtonsSrc.includes("Instagram-Story"), false);
  assert.equal(shareButtonsSrc.includes("com.instagram.android"), false);
});

test("WhatsApp-href kommt erst nach Mount von window.location.origin", () => {
  assert.equal(shareButtonsSrc.includes("canonicalTeamUrl"), false);
  assert.equal(shareButtonsSrc.includes("getSiteUrl"), false);
  assert.match(shareButtonsSrc, /window\.location\.origin/);
  assert.match(shareButtonsSrc, /setWaHref/);
  assert.match(shareButtonsSrc, /whatsappShareHref/);
  assert.match(shareButtonsSrc, /prefetchStoryPng/);
});
