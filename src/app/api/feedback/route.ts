import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

const PROD_TO = "info@koderlauf.de";
const MAX_SUBJECT = 180;
const MAX_MESSAGE = 8000;
const MAX_NAME = 120;

export const runtime = "nodejs";
/** Vercel: genug Zeit für SMTP-Handshake */
export const maxDuration = 25;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Lokal: optional andere Empfänger-Adresse (z. B. zum Testen). */
function getFeedbackTo(): string {
  const devOverride = process.env.FEEDBACK_DEV_TO?.trim();
  if (process.env.NODE_ENV === "development" && devOverride && isValidEmail(devOverride)) {
    return devOverride;
  }
  return PROD_TO;
}

function smtpFailureHint(message: string): string | null {
  const m = message.toLowerCase();
  if (
    m.includes("invalid login") ||
    m.includes("authentication failed") ||
    m.includes("535") ||
    m.includes("eauth") ||
    m.includes("badcredentials")
  ) {
    return "SMTP-Anmeldung fehlgeschlagen: SMTP_USER und SMTP_PASS prüfen (Postfach-Passwort des Providers).";
  }
  if (m.includes("econnrefused") || m.includes("etimedout") || m.includes("enotfound") || m.includes("gai")) {
    return "Keine Verbindung zum SMTP-Server (Host/Port/Firewall). Hinweis: Einige Serverless-Plattformen blockieren ausgehendes SMTP – dann Relais oder anderen Host nutzen.";
  }
  if (m.includes("certificate") || m.includes("tls") || m.includes("ssl")) {
    return "TLS-Problem: Port 587 mit STARTTLS oder 465 mit SSL testen; SMTP_SECURE in der Doku des Providers prüfen.";
  }
  return null;
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
  const smtp = getSmtpConfig();
  if (!smtp.ok) {
    const msg =
      smtp.reason === "missing_host"
        ? "SMTP_HOST fehlt in der Server-Konfiguration."
        : smtp.reason === "missing_user"
          ? "SMTP_USER fehlt in der Server-Konfiguration."
          : "SMTP_PASS fehlt in der Server-Konfiguration.";
    console.error("Feedback SMTP:", msg);
    return NextResponse.json(
      {
        error: "E-Mail-Versand ist derzeit nicht eingerichtet. Bitte später erneut versuchen oder schreibt direkt an info@koderlauf.de.",
        hint: "Auf dem Server SMTP_HOST, SMTP_USER und SMTP_PASS setzen (siehe .env.example).",
      },
      { status: 503 }
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

  const { subject, message, email, name } = body as Record<string, unknown>;

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
    "Nachricht über das Feedback-Formular auf koderlauf.de",
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
    const hint = smtpFailureHint(msg);
    return NextResponse.json(
      {
        error: "Die E-Mail konnte nicht gesendet werden. Bitte versucht es später oder schreibt an info@koderlauf.de.",
        ...(hint ? { hint } : {}),
        ...(process.env.NODE_ENV === "development" ? { detail: msg } : {}),
      },
      { status: 502 }
    );
  }
}
