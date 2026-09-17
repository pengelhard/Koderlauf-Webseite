import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPublicDomainLabel, getSiteUrl } from "@/lib/site-url";
import { allowRequest, clientIp } from "@/lib/rate-limit";

const PROD_TO = "info@koderlauf.de";
const MAX_SUBJECT = 180;
const MAX_MESSAGE = 8000;
const MAX_NAME = 120;
const GENERIC_SEND_ERROR =
  "Die E-Mail konnte nicht gesendet werden. Bitte versucht es später oder schreibt an info@koderlauf.de.";
const GENERIC_UNAVAILABLE =
  "E-Mail-Versand ist derzeit nicht eingerichtet. Bitte später erneut versuchen oder schreibt direkt an info@koderlauf.de.";

export const runtime = "nodejs";
/** Vercel: genug Zeit für SMTP-Handshake */
export const maxDuration = 25;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

function isNonEmptyString(v: unknown): v is string {
  return typeof v === "string" && v.trim().length > 0;
}

/** Same-site only: Origin/Referer muss zum Request-Host passen. */
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

/** Lokal: optional andere Empfänger-Adresse (z. B. zum Testen). */
function getFeedbackTo(): string {
  const devOverride = process.env.FEEDBACK_DEV_TO?.trim();
  if (process.env.NODE_ENV === "development" && devOverride && isValidEmail(devOverride)) {
    return devOverride;
  }
  return PROD_TO;
}

function getSmtpConfig():
  | { ok: true; transporter: nodemailer.Transporter; from: string }
  | { ok: false; reason: "missing_host" | "missing_user" | "missing_pass" } {
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

  const from =
    process.env.SMTP_FROM?.trim() ||
    `Koderlauf Website <${user}>`;

  return { ok: true, transporter, from };
}

export async function POST(request: Request) {
  if (!isSameSiteRequest(request)) {
    return NextResponse.json({ error: "Ungültige Anfrage." }, { status: 403 });
  }

  const ip = clientIp(request);
  if (
    !allowRequest(`feedback:${ip}`, { windowMs: 10 * 60 * 1000, max: 5 }) ||
    !allowRequest(`feedback-hour:${ip}`, { windowMs: 60 * 60 * 1000, max: 12 })
  ) {
    return NextResponse.json(
      { error: "Zu viele Nachrichten. Bitte in ein paar Minuten erneut versuchen." },
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

  const { subject, message, email, name, website, fax_number } = body as Record<string, unknown>;

  // Honeypot: Bots füllen versteckte Felder – still {ok:true}, kein Versand
  if (isNonEmptyString(website) || isNonEmptyString(fax_number)) {
    return NextResponse.json({ ok: true });
  }

  const smtp = getSmtpConfig();
  if (!smtp.ok) {
    console.error("Feedback SMTP:", smtp.reason);
    return NextResponse.json({ error: GENERIC_UNAVAILABLE }, { status: 503 });
  }

  const subjectStr = typeof subject === "string" ? subject.trim() : "";
  const messageStr = typeof message === "string" ? message.trim() : "";
  const emailStr = typeof email === "string" ? email.trim() : "";
  const nameStr = typeof name === "string" ? name.trim() : "";

  if (!nameStr) {
    return NextResponse.json({ error: "Bitte euren Namen angeben." }, { status: 400 });
  }
  if (nameStr.length > MAX_NAME) {
    return NextResponse.json({ error: "Der Name ist zu lang." }, { status: 400 });
  }
  if (!emailStr || !isValidEmail(emailStr)) {
    return NextResponse.json(
      { error: "Bitte eine gültige E-Mail-Adresse angeben – sonst können wir euch nicht zurückschreiben." },
      { status: 400 }
    );
  }
  if (!subjectStr || subjectStr.length > MAX_SUBJECT) {
    return NextResponse.json(
      { error: `Bitte einen Betreff angeben (max. ${MAX_SUBJECT} Zeichen).` },
      { status: 400 }
    );
  }
  if (messageStr.length < 10 || messageStr.length > MAX_MESSAGE) {
    return NextResponse.json(
      { error: `Eure Nachricht sollte mindestens 10 und höchstens ${MAX_MESSAGE} Zeichen haben.` },
      { status: 400 }
    );
  }

  const to = getFeedbackTo();
  const text = [
    ...(to !== PROD_TO ? [`[Nur Entwicklung: Zustellung an ${to} (Live: ${PROD_TO})`, ""] : []),
    `Nachricht über das Feedback-Formular auf ${getPublicDomainLabel(getSiteUrl())}`,
    "",
    `Name/Crew: ${nameStr}`,
    `Antwort an: ${emailStr}`,
    "",
    "— Nachricht —",
    messageStr,
  ].join("\n");

  try {
    await smtp.transporter.sendMail({
      from: smtp.from,
      to,
      replyTo: emailStr,
      subject: `[Koderlauf Feedback] ${subjectStr}`.slice(0, 250),
      text,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Feedback SMTP send error:", msg, e);
    return NextResponse.json({ error: GENERIC_SEND_ERROR }, { status: 502 });
  }
}
