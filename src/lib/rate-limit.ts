/**
 * Best-effort Rate-Limit im Prozessspeicher (Vercel: pro Instanz).
 * Reicht gegen einfaches Formular-Spam; kein Ersatz für WAF.
 */

type Bucket = number[];

const buckets = new Map<string, Bucket>();
const MAX_KEYS = 4000;

function prune(now: number, windowMs: number, times: number[]): number[] {
  return times.filter((t) => now - t < windowMs);
}

export function allowRequest(
  key: string,
  { windowMs, max }: { windowMs: number; max: number },
): boolean {
  const now = Date.now();
  const next = prune(now, windowMs, buckets.get(key) ?? []);
  if (next.length >= max) {
    buckets.set(key, next);
    return false;
  }
  next.push(now);
  buckets.set(key, next);

  if (buckets.size > MAX_KEYS) {
    const first = buckets.keys().next().value;
    if (typeof first === "string") buckets.delete(first);
  }
  return true;
}

export function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first.slice(0, 128);
  }
  const real = request.headers.get("x-real-ip")?.trim();
  if (real) return real.slice(0, 128);
  return "unknown";
}
