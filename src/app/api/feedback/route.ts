import { NextResponse } from "next/server";
import { Resend } from "resend";

const PROD_TO = "info@koderlauf.de";
const MAX_SUBJECT = 180;
const MAX_MESSAGE = 8000;
const MAX_NAME = 120;

function isValidEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Lokal: mit FEEDBACK_DEV_TO an die bei Resend erlaubte Test-Adresse senden. Live immer PROD_TO. */
function getFeedbackTo(): string {
  const devOverride = process.env.FEEDBACK_DEV_TO?.trim();
  if (process.env.NODE_ENV === "development" && devOverride && isValidEmail(devOverride)) {
    return devOverride;
  }
  return PROD_TO;
}

export async function POST(request: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.error("RESEND_API_KEY fehlt");
    return NextResponse.json(
      { error: "E-Mail-Versand ist derzeit nicht eingerichtet. Bitte später erneut versuchen oder schreibt direkt an info@koderlauf.de." },
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

  const from =
    process.env.RESEND_FROM_EMAIL?.trim() || "Koderlauf Website <onboarding@resend.dev>";

  const to = getFeedbackTo();
  const text = [
    ...(to !== PROD_TO
      ? [`[Nur Entwicklung: Zustellung an ${to} (Live: ${PROD_TO})`, ""]
      : []),
    "Nachricht über das Feedback-Formular auf koderlauf.de",
    "",
    `Name/Crew: ${nameStr}`,
    `Antwort an: ${emailStr}`,
    "",
    "— Nachricht —",
    messageStr,
  ].join("\n");

  try {
    const resend = new Resend(key);
    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: emailStr,
      subject: `[Koderlauf Feedback] ${subjectStr}`.slice(0, 250),
      text,
    });

    if (error) {
      console.error("Resend:", error);
      const detail =
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message: unknown }).message)
          : null;
      return NextResponse.json(
        {
          error: "Die E-Mail konnte nicht gesendet werden. Bitte versucht es später oder schreibt an info@koderlauf.de.",
          ...(process.env.NODE_ENV === "development" && detail ? { detail } : {}),
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("Feedback send error:", e);
    return NextResponse.json(
      { error: "Die E-Mail konnte nicht gesendet werden. Bitte später erneut versuchen." },
      { status: 500 }
    );
  }
}
