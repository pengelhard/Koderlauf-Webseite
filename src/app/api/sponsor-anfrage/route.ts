import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPublicDomainLabel, getSiteUrl } from "@/lib/site-url";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import {
  BAND_LABEL,
  getFlaeche,
  isAnfrageWeg,
  isBeitragsart,
  isBeitragsband,
  isBeitragsartGueltig,
  isFlaecheBuchbar,
  isSachspendeFlaeche,
  normalizeStufe,
  TYP_LABEL,
  SPONSORING_2027,
  type AnfrageWeg,
  type Beitragsart,
  type Beitragsband,
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

function resolveAnfrageWeg(rec: Record<string, unknown>): AnfrageWeg | null {
  if (isAnfrageWeg(rec.anfrageWeg)) return rec.anfrageWeg;
  if (typeof rec.flaecheId === "string" || typeof rec.postenId === "string") return "flaeche";
  if (rec.anfrageArt === "posten" || rec.anfrageArt === "flaeche") return "flaeche";
  if (rec.anfrageArt === "partner" || rec.anfrageArt === "beitrag" || rec.anfrageArt === "paket") {
    return "paket";
  }
  if (normalizeStufe(typeof rec.stufe === "string" ? rec.stufe : null)) return "paket";
  return null;
}

function resolveBand(rec: Record<string, unknown>): Beitragsband {
  if (isBeitragsband(rec.band)) return rec.band;
  const stufe = normalizeStufe(typeof rec.stufe === "string" ? rec.stufe : null);
  if (stufe) return stufe;
  return "partner";
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

  const anfrageWeg = resolveAnfrageWeg(rec);
  if (!anfrageWeg) {
    return NextResponse.json(
      { error: "Bitte Paket oder Fläche wählen." },
      { status: 400 },
    );
  }

  const band = resolveBand(rec);
  const firma = clip(rec.firma, MAX_SHORT);
  const ansprechpartner = clip(rec.ansprechpartner, MAX_SHORT);
  const email = clip(rec.email, MAX_SHORT);
  const telefon = clip(rec.telefon, 40);
  const web = clip(rec.web, 300);
  const instagram = clip(rec.instagram, 200);
  const nachricht = clip(rec.nachricht, MAX_TEXT);
  const flaecheIdRaw =
    typeof rec.flaecheId === "string"
      ? rec.flaecheId.trim()
      : typeof rec.postenId === "string"
        ? rec.postenId.trim()
        : "";
  const flaeche = getFlaeche(flaecheIdRaw);
  const beitragsart: Beitragsart | null = isBeitragsart(rec.beitragsart) ? rec.beitragsart : null;

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
  if (anfrageWeg === "flaeche" && !flaeche) {
    return NextResponse.json({ error: "Bitte eine Fläche wählen." }, { status: 400 });
  }
  if (anfrageWeg === "flaeche" && !beitragsart) {
    return NextResponse.json(
      { error: "Bitte Art des Beitrags angeben." },
      { status: 400 },
    );
  }
  if (anfrageWeg === "flaeche" && flaeche && !isBeitragsartGueltig(flaeche, beitragsart ?? "geld")) {
    return NextResponse.json(
      { error: "Diese Fläche ist eine Sachspende. Geld allein bucht sie nicht." },
      { status: 400 },
    );
  }
  if (flaecheIdRaw && !flaeche) {
    return NextResponse.json({ error: "Unbekannte Fläche." }, { status: 400 });
  }
  if (flaecheIdRaw && flaeche && !isFlaecheBuchbar(flaeche.id) && !flaeche.mehrereMoeglich) {
    return NextResponse.json(
      { error: "Diese Fläche ist gerade nicht buchbar. Bitte einen anderen Slot wählen." },
      { status: 400 },
    );
  }

  const smtp = getSmtpConfig();
  if (!smtp.ok) {
    console.error("Sponsor SMTP:", smtp.reason);
    return NextResponse.json({ error: GENERIC_UNAVAILABLE }, { status: 503 });
  }

  const wegLabel =
    anfrageWeg === "flaeche"
      ? flaeche && isSachspendeFlaeche(flaeche)
        ? "Sachspende"
        : `${BAND_LABEL[band]} + Fläche`
      : BAND_LABEL[band];
  const beitragLabel =
    beitragsart === "geld"
      ? "Geld"
      : beitragsart === "sach"
        ? "Sachspende"
        : beitragsart === "beides"
          ? "Sache + Zuschuss"
          : "";
  const to = getMailTo();
  const text = [
    ...(to !== PROD_TO ? [`[Nur Entwicklung: Zustellung an ${to} (Live: ${PROD_TO})]`, ""] : []),
    `Sponsoring-Anfrage über ${getPublicDomainLabel(getSiteUrl())}`,
    "",
    `Weg: ${wegLabel}`,
    `Band: ${BAND_LABEL[band]}`,
    flaeche ? `Fläche: ${flaeche.titel} (${flaeche.id})` : "Fläche: —",
    flaeche ? `Typ: ${TYP_LABEL[flaeche.typ]}` : "",
    beitragLabel ? `Beitrag: ${beitragLabel}` : "",
    flaeche ? `Festpreis: ${flaeche.festpreis} €` : "",
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
      subject: `[Koderlauf Sponsor 2027] ${wegLabel} – ${firma}`.slice(0, 250),
      text,
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Sponsor SMTP send error:", msg, e);
    return NextResponse.json({ error: GENERIC_SEND_ERROR }, { status: 502 });
  }
}
