import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

export const FASSJAGD_ADMIN_COOKIE = "fassjagd_admin";

export function fassjagdAdminSecret(): string {
  return process.env.FASSJAGD_ADMIN_SECRET?.trim() || "";
}

export function fassjagdAdminToken(secret: string): string {
  return createHmac("sha256", secret).update("koder-fassjagd-admin").digest("hex");
}

export async function isFassjagdAdmin(): Promise<boolean> {
  const s = fassjagdAdminSecret();
  if (!s) return false;
  const jar = await cookies();
  const got = jar.get(FASSJAGD_ADMIN_COOKIE)?.value;
  if (!got) return false;
  const expect = fassjagdAdminToken(s);
  try {
    return timingSafeEqual(Buffer.from(got), Buffer.from(expect));
  } catch {
    return false;
  }
}
