import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { isTestHost } from "@/lib/site-url";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host");
  const response = NextResponse.next();

  if (isTestHost(host)) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
