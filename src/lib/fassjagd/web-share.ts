/** Web Share für Fassjagd-Stories: Geste nicht durch await verlieren. */

export const PNG_MIME = "image/png";
export const JPEG_MIME = "image/jpeg";

export type ShareStep = "png" | "jpeg" | "text" | "download";
export type ShareChainResult = "ok" | "abort" | "fail" | "downloaded";

type StoryCacheEntry = {
  blob: Blob;
  png: File;
  jpeg: File | null;
};

const ready = new Map<string, StoryCacheEntry>();
const inflight = new Map<string, Promise<StoryCacheEntry>>();

export function resetStoryCache() {
  ready.clear();
  inflight.clear();
}

export function isAbortError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "name" in err && err.name === "AbortError";
}

export function isNotAllowedError(err: unknown): boolean {
  return typeof err === "object" && err !== null && "name" in err && err.name === "NotAllowedError";
}

export function pngFileFromBlob(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: PNG_MIME });
}

export function jpegFileFromBlob(blob: Blob, filename: string): File {
  return new File([blob], filename, { type: JPEG_MIME });
}

export function peekStoryPng(path: string): File | null {
  return ready.get(path)?.png ?? null;
}

export function peekStoryBlob(path: string): Blob | null {
  return ready.get(path)?.blob ?? null;
}

export function peekStoryJpeg(path: string): File | null {
  return ready.get(path)?.jpeg ?? null;
}

export function cacheStoryPng(path: string, blob: Blob, filename: string): File {
  const png = pngFileFromBlob(blob, filename);
  const prev = ready.get(path);
  ready.set(path, { blob, png, jpeg: prev?.jpeg ?? null });
  return png;
}

export function cacheStoryJpeg(path: string, jpeg: File) {
  const prev = ready.get(path);
  if (!prev) return;
  prev.jpeg = jpeg;
}

export async function prefetchStoryPng(
  path: string,
  filename: string,
  fetchImpl: typeof fetch = fetch,
): Promise<File> {
  const hit = ready.get(path);
  if (hit) return hit.png;

  const pending = inflight.get(path);
  if (pending) return (await pending).png;

  const job = (async () => {
    const res = await fetchImpl(path);
    if (!res.ok) throw new Error("card");
    const blob = await res.blob();
    const png = pngFileFromBlob(blob, filename);
    const entry: StoryCacheEntry = { blob, png, jpeg: null };
    ready.set(path, entry);
    return entry;
  })();

  inflight.set(path, job);
  try {
    return (await job).png;
  } catch (err) {
    inflight.delete(path);
    throw err;
  }
}

/**
 * canShare({ files }) ist nur ein Hint. Nie deswegen File-Share überspringen —
 * auf manchen Handys ist canShare false, navigator.share mit File klappt trotzdem.
 */
export function canShareFilesHint(file: File): boolean | null {
  if (typeof navigator === "undefined" || typeof navigator.canShare !== "function") {
    return null;
  }
  try {
    return Boolean(navigator.canShare({ files: [file] }));
  } catch {
    return false;
  }
}

export function shareFallbackOrder(opts: {
  hasNavigatorShare: boolean;
  pngFile: File | null;
  jpegFile?: File | null;
}): ShareStep[] {
  const steps: ShareStep[] = [];
  if (opts.hasNavigatorShare && opts.pngFile) steps.push("png");
  if (opts.hasNavigatorShare && opts.jpegFile) steps.push("jpeg");
  if (opts.hasNavigatorShare) steps.push("text");
  steps.push("download");
  return steps;
}

export function filesShareData(file: File, title: string, text: string): ShareData {
  return { files: [file], title, text };
}

export function textShareData(title: string, text: string): ShareData {
  return { title, text };
}

/** Ersten Step synchron starten (gleiche User-Geste), Rest als Fallback. */
export async function runShareChain(
  steps: Array<() => Promise<ShareChainResult>>,
): Promise<ShareChainResult> {
  for (const step of steps) {
    const result = await step();
    if (result === "ok" || result === "abort" || result === "downloaded") return result;
  }
  return "fail";
}

export function classifyPostFetchShare(err: unknown): "abort" | "needs_second_tap" | "continue" {
  if (isAbortError(err)) return "abort";
  if (isNotAllowedError(err)) return "needs_second_tap";
  return "continue";
}

export function shareStepFromClick(opts: {
  pngReady: boolean;
  hasNavigatorShare: boolean;
}): "share_now" | "fetch_then_second_tap" | "download" {
  if (opts.pngReady && opts.hasNavigatorShare) return "share_now";
  if (opts.hasNavigatorShare) return "fetch_then_second_tap";
  return "download";
}
