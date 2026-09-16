import type { MetadataRoute } from "next";
import { headers } from "next/headers";
import { isTestHost, PROD_SITE_HOST, PROD_SITE_URL } from "@/lib/site-url";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host");
  if (isTestHost(host)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/fassjagd/admin"] },
    sitemap: `${PROD_SITE_URL}/sitemap.xml`,
    host: PROD_SITE_HOST,
  };
}
