import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { getPublicDomainLabel, getSiteUrl } from "@/lib/site-url";
import { allowRequest, clientIp } from "@/lib/rate-limit";
import {
  BAND_LABEL,
  brauchtAngebot,
  getFlaeche,
  isBeitragsart,
  stufeAusWert,
  isBeitragsartGueltig,
  isFlaecheBuchbar,
  isSachspendeFlaeche,
  normalizeAnfrageWeg,
  normalizeStufe,
  TYP_LABEL,
  type AnfrageWeg,
  type Beitragsart,
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
  const fromField = normalizeAnfrageWeg(rec.anfrageWeg);
  if (fromField) return fromField;
  if (typeof rec.flaecheId === "string" || typeof rec.postenId === "string") return "flaeche";
  if (rec.anfrageArt === "posten" || rec.anfrageArt === "flaeche") return "flaeche";
  if (rec.anfrageArt === "partner" || rec.anfrageArt === "beitrag" || rec.anfrageArt === "paket" || rec.anfrageArt === "stufe") {
    return "stufe";
  }
  if (normalizeStufe(typeof rec.stufe === "string" ? rec.stufe : null)) return "stufe";
  return null;
}

function parseWert(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(",", "."));
    if (Number.isFinite(n)) return n;
  }
  return null;
}

const DATEI_MAX = 4 * 1024 * 1024;
const DATEI_TYPEN = new Set(["image/png", "image/jpeg", "image/webp", "application/pdf"]);

type UploadedFile = { filename: string; contentType: string; content: Buffer };

function isUpload(v: FormDataEntryValue | null): v is File {
  return typeof v === "object" && v !== null && "arrayBuffer" in v && "size" in v && "name" in v && "type" in v;
}

function dateiTyp(file: { type: string; name: string }): string | null {
  const type = file.type.toLowerCase();
  if (DATEI_TYPEN.has(type)) return type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".png")) return "image/png";
  if (name.endsWith(".jpg") || name.endsWith(".jpeg")) return "image/jpeg";
  if (name.endsWith(".webp")) return "image/webp";
  if (name.endsWith(".pdf")) return "application/pdf";
  return null;
}

function safeFilename(name: string, type: string): string {
  const ext = type === "application/pdf" ? ".pdf" : type === "image/png" ? ".png" : type === "image/webp" ? ".webp" : ".jpg";
  const base = (name.split(/[/\\]/).pop() ?? "datei").replace(/[^\w.\-]+/g, "_").replace(/^\.+/, "").slice(0, 80);
  if (!base) return `datei${ext}`;
  return base.toLowerCase().endsWith(ext) ? base : `${base}${ext}`;
}

async function readIncoming(
  request: Request,
): Promise<
  | { ok: true; rec: Record<string, unknown>; file: UploadedFile | null }
  | { ok: false; error: string; status: number }
> {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.includes("multipart/form-data")) {
    try {
      const body = await request.json();
      if (!body || typeof body !== "object") {
        return { ok: false, error: "Ungültige Anfrage.", status: 400 };
      }
      return { ok: true, rec: body as Record<string, unknown>, file: null };
    } catch {
      return { ok: false, error: "Ungültige Anfrage.", status: 400 };
    }
  }

  const length = Number(request.headers.get("content-length") ?? "0");
  if (Number.isFinite(length) && length > DATEI_MAX + 200_000) {
    return { ok: false, error: "Die Datei ist zu groß. Maximal 4 MB.", status: 400 };
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return { ok: false, error: "Ungültige Anfrage.", status: 400 };
  }

  const rec: Record<string, unknown> = {};
  for (const [key, value] of form.entries()) {
    if (typeof value === "string") rec[key] = value;
  }

  const raw = form.get("datei");
  if (!isUpload(raw) || raw.size === 0) return { ok: true, rec, file: null };
  if (raw.size > DATEI_MAX) {
    return { ok: false, error: "Die Datei ist zu groß. Maximal 4 MB.", status: 400 };
  }
  const type = dateiTyp(raw);
  if (!type) {
    return { ok: false, error: "Bitte PNG, JPG, WEBP oder PDF.", status: 400 };
  }
  return {
    ok: true,
    rec,
    file: {
      filename: safeFilename(raw.name, type),
      contentType: type,
      content: Buffer.from(await raw.arrayBuffer()),
    },
  };
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

  const incoming = await readIncoming(request);
  if (!incoming.ok) {
    return NextResponse.json({ error: incoming.error }, { status: incoming.status });
  }
  const rec = incoming.rec;
  const datei = incoming.file;
  if (isNonEmptyString(rec.fax_number) || isNonEmptyString(rec.company_url_hp)) {
    return NextResponse.json({ ok: true });
  }

  const anfrageWeg = resolveAnfrageWeg(rec);
  if (!anfrageWeg) {
    return NextResponse.json(
      { error: "Bitte Stufe oder Fläche wählen." },
      { status: 400 },
    );
  }

  const wert = parseWert(rec.wert);
  if (wert === null || wert < 0) {
    return NextResponse.json({ error: "Bitte einen Wert in Euro angeben." }, { status: 400 });
  }
  const band = stufeAusWert(wert);
  const firma = clip(rec.firma, MAX_SHORT);
  const ansprechpartner = clip(rec.ansprechpartner, MAX_SHORT);
  const email = clip(rec.email, MAX_SHORT);
  const telefon = clip(rec.telefon, 40);
  const web = clip(rec.web, 300);
  const instagram = clip(rec.instagram, 200);
  const nachricht = clip(rec.nachricht, MAX_TEXT);
  const angebot = clip(rec.angebot, MAX_TEXT);
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
  if (flaeche && brauchtAngebot(flaeche.id) && !angebot) {
    return NextResponse.json(
      { error: "Bitte schreiben, was ihr schenken oder sponsern wollt." },
      { status: 400 },
    );
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
    `Stufe: ${BAND_LABEL[band]}`,
    flaeche ? `Fläche: ${flaeche.titel} (${flaeche.id})` : "Fläche: —",
    flaeche ? `Typ: ${TYP_LABEL[flaeche.typ]}` : "",
    beitragLabel ? `Beitrag: ${beitragLabel}` : "",
    wert !== null ? `Genannter Wert: ${wert} €` : "",
    angebot ? `Angebot: ${angebot}` : "",
    datei ? `Datei: ${datei.filename}` : "",
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
      ...(datei
        ? { attachments: [{ filename: datei.filename, content: datei.content, contentType: datei.contentType }] }
        : {}),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Sponsor SMTP send error:", msg, e);
    return NextResponse.json({ error: GENERIC_SEND_ERROR }, { status: 502 });
  }
}
