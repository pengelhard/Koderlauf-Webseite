import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTestHost, PROD_SITE_HOST } from "@/lib/site-url";
import { isSocialCrawler } from "@/lib/social-crawler";

const WWW_HOST = `www.${PROD_SITE_HOST}`;

export function proxy(request: NextRequest) {
  const host = (request.headers.get("host") ?? "").split(":")[0].toLowerCase();

  if (host === WWW_HOST) {
    const url = request.nextUrl.clone();
    url.hostname = PROD_SITE_HOST;
    url.protocol = "https:";
    url.port = "";
    return NextResponse.redirect(url, 301);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  const response = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const path = request.nextUrl.pathname;
  const social = isSocialCrawler(request.headers.get("user-agent"));
  const ogImage = path.includes("/opengraph-image") || path.includes("/twitter-image") || path.endsWith("/og.jpg");
  // Google bleibt draußen; WhatsApp/Facebook brauchen die OG-Karte ohne noindex.
  if (isTestHost(host) && !social && !ogImage) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
