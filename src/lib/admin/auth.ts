import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";
import type { NextResponse } from "next/server";

/** Gemeinsames Orga-Cookie (Fassjagd + T-Shirt/Abendkarten). */
export const ADMIN_COOKIE = "fassjagd_admin";
export const FASSJAGD_ADMIN_COOKIE = ADMIN_COOKIE;

export function adminSecret(): string {
  return (
    process.env.ADMIN_SECRET?.trim() ||
    process.env.FASSJAGD_ADMIN_SECRET?.trim() ||
    ""
  );
}

export function fassjagdAdminSecret(): string {
  return adminSecret();
}

export function adminToken(secret: string): string {
  return createHmac("sha256", secret).update("koder-fassjagd-admin").digest("hex");
}

export function fassjagdAdminToken(secret: string): string {
  return adminToken(secret);
}

export function adminCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function setAdminCookie(res: NextResponse, secret: string): void {
  res.cookies.set(ADMIN_COOKIE, adminToken(secret), adminCookieOptions(60 * 60 * 24 * 14));
}

export function clearAdminCookie(res: NextResponse): void {
  res.cookies.set(ADMIN_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function isOrgaAdmin(): Promise<boolean> {
  const s = adminSecret();
  if (!s) return false;
  const jar = await cookies();
  const got = jar.get(ADMIN_COOKIE)?.value;
  if (!got) return false;
  const expect = adminToken(s);
  try {
    return timingSafeEqual(Buffer.from(got), Buffer.from(expect));
  } catch {
    return false;
  }
}

export async function isFassjagdAdmin(): Promise<boolean> {
  return isOrgaAdmin();
}
