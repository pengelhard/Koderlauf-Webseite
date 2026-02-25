import { Resend } from "resend";

import { getServerEnv } from "@/lib/env";

let resendClient: Resend | null = null;

export function getResendClient() {
  if (resendClient) return resendClient;

  const env = getServerEnv();
  if (!env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY ist nicht gesetzt.");
  }

  resendClient = new Resend(env.RESEND_API_KEY);
  return resendClient;
}

export function getResendFromAddress() {
  const env = getServerEnv();
  return env.RESEND_FROM_EMAIL ?? "Koderlauf <noreply@koderlauf.de>";
}
