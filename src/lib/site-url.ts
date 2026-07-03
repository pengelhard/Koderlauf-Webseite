/** Öffentliche Produktionsdomain */
export const PROD_SITE_HOST = "koderlauf.de";
export const PROD_SITE_URL = `https://${PROD_SITE_HOST}`;

/** Test-/Preview-Domain (Option B) */
export const TEST_SITE_HOST = "test.koderlauf.de";
export const TEST_SITE_URL = `https://${TEST_SITE_HOST}`;

export function isTestHost(host: string | null | undefined): boolean {
  if (!host) return false;
  return host.split(":")[0].toLowerCase() === TEST_SITE_HOST;
}

/** Basis-URL anhand des Request-Hosts (SSR) oder Fallbacks (Build/Client). */
export function getSiteUrlFromHost(host: string | null | undefined): string {
  if (isTestHost(host)) return TEST_SITE_URL;
  if (host && !host.includes("localhost")) {
    const clean = host.split(":")[0];
    if (clean.endsWith(".vercel.app")) return `https://${clean}`;
    if (clean === PROD_SITE_HOST || clean === `www.${PROD_SITE_HOST}`) {
      return PROD_SITE_URL;
    }
  }

  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (fromEnv) return fromEnv;

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return PROD_SITE_URL;
}

export function getSiteUrl(): string {
  return getSiteUrlFromHost(null);
}

export function getPublicDomainLabel(url: string = getSiteUrl()): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return PROD_SITE_HOST;
  }
}
