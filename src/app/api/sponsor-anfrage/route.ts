import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPublicDomainLabel, getSiteUrl } from "@/lib/site-url";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import {
  getKostenposten,
  isSponsorStufe,
  SPONSORING_2027,
  type SponsorStufe,
} from "@/lib/sponsoring-2027";

const PROD_TO = "info@koderlauf.de";
const MAX_TEXT = 8000;
const MAX_SHORT = 180;
const GENERIC_SEND_ERROR =
  "Die Anfrage konnte nicht gesendet werden. Bitte versucht es später oder schreibt an info@koderlauf.de.";
const GENERIC_UNAVAILABLE =
  "E-Mail-Versand ist derzeit nicht eingerichtet. Bitte später erneut versuchen oder schreibt direkt an info@koderlauf.de.";

export const runtime = "nodejs";
export const maxDuration = 25;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

function clip(v: unknown, max: number): string {
  if (typeof v !== "string") return "";
  return v.trim().slice(0, max);
}

function isSameSiteRequest(request: Request): boolean {
  const host = request.headers.get("host");
  if (!host) return false;
  const expected = host.split(":")[0]?.toLowerCase();
  if (!expected) return false;

  const origin = request.headers.get("origin");
  if (origin) {
    try {
      return new URL(origin).hostname.toLowerCase() === expected;
    } catch {
      return false;
    }
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      return new URL(referer).hostname.toLowerCase() === expected;
    } catch {
      return false;
    }
  }

  return process.env.NODE_ENV === "development";
}

function getMailTo(): string {
  const devOverride = process.env.FEEDBACK_DEV_TO?.trim();
  if (process.env.NODE_ENV === "development" && devOverride && isValidEmail(devOverride)) {
    return devOverride;
  }
  return PROD_TO;
}

function getSmtpConfig():
  | { ok: true; transporter: nodemailer.Transporter; from: string }
  | { ok: false; reason: string } {
  const host = process.env.SMTP_HOST?.trim();
  const user = process.env.SMTP_USER?.trim();
  const pass = (process.env.SMTP_PASS ?? "").trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  const port = portRaw ? Number.parseInt(portRaw, 10) : 587;

  if (!host) return { ok: false, reason: "missing_host" };
  if (!user) return { ok: false, reason: "missing_user" };
  if (!pass) return { ok: false, reason: "missing_pass" };

  const secureEnv = process.env.SMTP_SECURE?.trim().toLowerCase();
  const secure = secureEnv === "true" || secureEnv === "1" || port === 465;

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    ...(port === 587 && !secure ? { requireTLS: true } : {}),
  });

  const from = process.env.SMTP_FROM?.trim() || `Koderlauf Website <${user}>`;
  return { ok: true, transporter, from };
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 403 });
  }

  const ip = clientIp(request);
  if (
    !allowRequest(`sponsor:${ip}`, { windowMs: 10 * 60 * 1000, max: 5 }) ||
    !allowRequest(`sponsor-hour:${ip}`, { windowMs: 60 * 60 * 1000, max: 12 })
  ) {
    return NextResponse.json(
      { error: "Zu viele Anfragen. Bitte in ein paar Minuten erneut versuchen." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 400 });
  }

  const rec = body as Record<string, unknown>;
  if (isNonEmptyString(rec.fax_number) || isNonEmptyString(rec.company_url_hp)) {
    return NextResponse.json({ ok: true });
  }

  if (!isSponsorStufe(rec.stufe)) {
    return NextResponse.json({ error: "Bitte Partner oder Hauptsponsor wählen." }, { status: 400 });
  }
  const stufe: SponsorStufe = rec.stufe;

  const firma = clip(rec.firma, MAX_SHORT);
  const ansprechpartner = clip(rec.ansprechpartner, MAX_SHORT);
  const email = clip(rec.email, MAX_SHORT);
  const telefon = clip(rec.telefon, 40);
  const web = clip(rec.web, 300);
  const instagram = clip(rec.instagram, 200);
  const budget = clip(rec.budget, 80);
  const nachricht = clip(rec.nachricht, MAX_TEXT);
  const addonBauzaun = rec.addonBauzaun === true;
  const postenId = typeof rec.postenId === "string" ? rec.postenId.trim() : "";
  const posten = getKostenposten(postenId);

  if (!firma) {
    return NextResponse.json({ error: "Bitte die Firma oder den Namen angeben." }, { status: 400 });
  }
  if (!ansprechpartner) {
    return NextResponse.json({ error: "Bitte einen Ansprechpartner angeben." }, { status: 400 });
  }
  if (!email || !isValidEmail(email)) {
    return NextResponse.json(
      { error: "Bitte eine gültige E-Mail-Adresse angeben." },
      { status: 400 },
    );
  }
  if (stufe === "hauptsponsor" && !posten) {
    return NextResponse.json(
      { error: "Bitte eine Kostenpartnerschaft für den Hauptsponsor wählen." },
      { status: 400 },
    );
  }
  if (postenId && !posten) {
    return NextResponse.json({ error: "Unbekannte Kostenpartnerschaft." }, { status: 400 });
  }
  if (posten && posten.status === "vergeben") {
    return NextResponse.json(
      { error: "Dieser Posten ist bereits vergeben. Bitte einen anderen wählen." },
      { status: 400 },
    );
  }

  const smtp = getSmtpConfig();
  if (!smtp.ok) {
    console.error("Sponsor SMTP:", smtp.reason);
    return NextResponse.json({ error: GENERIC_UNAVAILABLE }, { status: 503 });
  }

  const stufeLabel = stufe === "partner" ? `Partner (${SPONSORING_2027.partnerPreis} €)` : "Hauptsponsor (ab 500 €)";
  const to = getMailTo();
  const text = [
    ...(to !== PROD_TO ? [`[Nur Entwicklung: Zustellung an ${to} (Live: ${PROD_TO})]`, ""] : []),
    `Sponsoring-Anfrage über ${getPublicDomainLabel(getSiteUrl())}`,
    "",
    `Stufe: ${stufeLabel}`,
    posten ? `Kostenpartnerschaft: ${posten.titel} (${posten.id})` : "Kostenpartnerschaft: —",
    addonBauzaun ? "Add-on: zusätzliches Bauzaunfeld (Partner)" : "",
    budget ? `Wunsch-Budget: ${budget}` : "",
    "",
    `Firma: ${firma}`,
    `Ansprechpartner: ${ansprechpartner}`,
    `E-Mail: ${email}`,
    telefon ? `Telefon: ${telefon}` : "",
    web ? `Website: ${web}` : "",
    instagram ? `Instagram: ${instagram}` : "",
    "",
    "— Nachricht —",
    nachricht || "(keine)",
  ]
    .filter((line, i, arr) => line !== "" || arr[i - 1] !== "")
    .join("\n");

  try {
    await smtp.transporter.sendMail({
      from: smtp.from,
      to,
      replyTo: email,
      subject: `[Koderlauf Sponsor 2027] ${stufeLabel} – ${firma}`.slice(0, 250),
      text,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Sponsor SMTP send error:", msg, e);
    return NextResponse.json({ error: GENERIC_SEND_ERROR }, { status: 502 });
  }
}
