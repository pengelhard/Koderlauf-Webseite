"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Send, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InfoButton } from "@/components/sponsoring/sponsor-werden-sections";
import {
  beitragsartWarnung,
  defaultBeitragsart,
  flaecheOptionLabel,
  flaecheParamAusSearch,
  getFlaeche,
  isBeitragsartGueltig,
  isFlaecheBuchbar,
  isSachspendeFlaeche,
  brauchtAngebot,
  SACHSPENDEN_SICHTBAR,
  SPONSORING_2027,
  stufeAusWert,
  stufeHinweis,
  submitLabel,
  type Beitragsart,
} from "@/lib/sponsoring-2027";

function isValidEmailFormat(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

const DATEI_TYPEN = ["image/png", "image/jpeg", "image/webp", "application/pdf"];
const DATEI_ENDUNGEN = [".png", ".jpg", ".jpeg", ".webp", ".pdf"];
const DATEI_MAX = 4 * 1024 * 1024;

function dateiErlaubt(file: File): boolean {
  if (DATEI_TYPEN.includes(file.type)) return true;
  const name = file.name.toLowerCase();
  return DATEI_ENDUNGEN.some((ext) => name.endsWith(ext));
}

export function SponsorAnfrageFormular() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const flaecheParam = flaecheParamAusSearch(searchParams.get("flaeche"), searchParams.get("posten"));
  const dateiRef = useRef<HTMLInputElement>(null);

  const [flaecheId, setFlaecheId] = useState(getFlaeche(flaecheParam)?.id ?? "");
  const [wert, setWert] = useState("");
  const [wertInfo, setWertInfo] = useState(false);
  const [beitragsart, setBeitragsart] = useState<Beitragsart>(defaultBeitragsart(getFlaeche(flaecheParam)));
  const [firma, setFirma] = useState("");
  const [ansprechpartner, setAnsprechpartner] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [angebot, setAngebot] = useState("");
  const [datei, setDatei] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [honeypotReady, setHoneypotReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const gewaehlteFlaeche = getFlaeche(flaecheId);
  const wertZahl = wert.trim() === "" ? null : Number(wert.replace(",", "."));
  const wertGueltig = wertZahl !== null && Number.isFinite(wertZahl) && wertZahl >= 0;
  const band = wertGueltig ? stufeAusWert(wertZahl) : null;
  const artWarnung = beitragsartWarnung(gewaehlteFlaeche, beitragsart);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHoneypotReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const resolved = flaecheParamAusSearch(searchParams.get("flaeche"), searchParams.get("posten"));
    const nextFlaeche = getFlaeche(resolved);
    if (nextFlaeche) setFlaecheId(nextFlaeche.id);
  }, [searchParams]);

  function syncFlaeche(nextFlaeche: string) {
    const q = new URLSearchParams();
    if (nextFlaeche) q.set("flaeche", nextFlaeche);
    const qs = q.toString();
    router.replace(qs ? `/sponsor-werden?${qs}#anfrage` : "/sponsor-werden#anfrage", { scroll: false });
  }

  function onDatei(file: File | null) {
    if (!file) {
      setDatei(null);
      return;
    }
    if (file.size > DATEI_MAX) {
      setDatei(null);
      if (dateiRef.current) dateiRef.current.value = "";
      setStatus("error");
      setErrorMsg("Die Datei ist zu groß. Maximal 4 MB.");
      return;
    }
    if (!dateiErlaubt(file)) {
      setDatei(null);
      if (dateiRef.current) dateiRef.current.value = "";
      setStatus("error");
      setErrorMsg("Bitte PNG, JPG, WEBP oder PDF.");
      return;
    }
    setDatei(file);
    setStatus("idle");
    setErrorMsg(null);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    if (!wertGueltig || wertZahl === null || band === null) {
      setStatus("error");
      setErrorMsg("Bitte einen Wert in Euro angeben.");
      return;
    }
    if (!firma.trim()) {
      setStatus("error");
      setErrorMsg("Bitte Firma oder Name angeben.");
      return;
    }
    if (!ansprechpartner.trim()) {
      setStatus("error");
      setErrorMsg("Bitte einen Ansprechpartner angeben.");
      return;
    }
    if (!isValidEmailFormat(email.trim())) {
      setStatus("error");
      setErrorMsg("Bitte eine gültige E-Mail-Adresse angeben.");
      return;
    }
    if (flaecheId && !isFlaecheBuchbar(flaecheId)) {
      setStatus("error");
      setErrorMsg("Diese Sache ist gerade nicht frei.");
      return;
    }
    if (brauchtAngebot(flaecheId) && !angebot.trim()) {
      setStatus("error");
      setErrorMsg("Bitte schreiben, was ihr schenken oder sponsern wollt.");
      return;
    }
    if (gewaehlteFlaeche && !isBeitragsartGueltig(gewaehlteFlaeche, beitragsart)) {
      setStatus("error");
      setErrorMsg("Diese Sache muss geliefert werden. Geld allein ersetzt sie nicht.");
      return;
    }
    if (datei && (datei.size > DATEI_MAX || !dateiErlaubt(datei))) {
      setStatus("error");
      setErrorMsg("Bitte PNG, JPG, WEBP oder PDF, maximal 4 MB.");
      return;
    }

    setStatus("sending");
    try {
      const payload = {
        anfrageWeg: flaecheId ? "flaeche" : "stufe",
        band,
        flaecheId: flaecheId || undefined,
        beitragsart: flaecheId ? beitragsart : undefined,
        wert: wertZahl,
        firma,
        ansprechpartner,
        email,
        telefon,
        angebot: brauchtAngebot(flaecheId) ? angebot : undefined,
        nachricht,
        fax_number: honeypot,
      };
      const res = datei
        ? await fetch("/api/sponsor-anfrage", { method: "POST", body: toFormData(payload, datei) })
        : await fetch("/api/sponsor-anfrage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMsg(typeof data.error === "string" ? data.error : "Senden fehlgeschlagen.");
        return;
      }
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMsg("Netzwerkfehler. Bitte später erneut versuchen.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <CheckCircle2 className="h-14 w-14 text-koder-orange" aria-hidden />
        <p className="text-lg font-semibold">Danke. Wir melden uns.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Antwort von{" "}
          <a href={`mailto:${SPONSORING_2027.kontaktEmail}`} className="text-koder-orange hover:underline">
            {SPONSORING_2027.kontaktEmail}
          </a>
          .
        </p>
        <Button type="button" variant="outline" className="mt-2" onClick={() => setStatus("idle")}>
          Weitere Anfrage
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sponsor-sache">Sache (optional)</Label>
          <select
            id="sponsor-sache"
            value={flaecheId}
            onChange={(e) => {
              const id = e.target.value;
              setFlaecheId(id);
              const f = getFlaeche(id);
              setBeitragsart(defaultBeitragsart(f));
              syncFlaeche(id);
            }}
            className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            <option value="">Keine Sache</option>
            {SACHSPENDEN_SICHTBAR.map((f) => (
              <option key={f.id} value={f.id} disabled={!isFlaecheBuchbar(f.id)}>
                {flaecheOptionLabel(f)}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Label htmlFor="sponsor-wert">Wert in € *</Label>
            <InfoButton
              label="Info zum Wert"
              open={wertInfo}
              onToggle={() => setWertInfo((v) => !v)}
            />
          </div>
          <Input
            id="sponsor-wert"
            inputMode="decimal"
            required
            value={wert}
            onChange={(e) => setWert(e.target.value)}
            placeholder="z. B. 250"
          />
        </div>
        {wertInfo && (
          <p className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground sm:col-span-2">
            {SPONSORING_2027.wertHinweis}
          </p>
        )}
      </div>

      {brauchtAngebot(flaecheId) && (
        <div className="space-y-2">
          <Label htmlFor="sponsor-angebot">Was wollt ihr schenken oder sponsern? *</Label>
          <Input
            id="sponsor-angebot"
            value={angebot}
            onChange={(e) => setAngebot(e.target.value)}
            maxLength={500}
            required
            placeholder={flaecheId === "verpflegung" ? "Zum Beispiel Wasser, Obst, Riegel …" : "Zum Beispiel Gutscheine …"}
          />
        </div>
      )}

      {wertGueltig && wertZahl !== null && (
        <p className="rounded-lg border border-koder-orange/30 bg-koder-orange/10 px-3 py-2 text-sm">
          {stufeHinweis(wertZahl)}
        </p>
      )}

      {isSachspendeFlaeche(gewaehlteFlaeche) && (
        <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
          Bitte die Sache stellen. Eine Überweisung ersetzt das nicht.
        </p>
      )}
      {artWarnung && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          {artWarnung}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sponsor-firma">Firma / Name *</Label>
          <Input id="sponsor-firma" required value={firma} onChange={(e) => setFirma(e.target.value)} maxLength={180} autoComplete="organization" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-person">Ansprechpartner *</Label>
          <Input id="sponsor-person" required value={ansprechpartner} onChange={(e) => setAnsprechpartner(e.target.value)} maxLength={180} autoComplete="name" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-email">E-Mail *</Label>
          <Input id="sponsor-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-tel">Telefon (optional)</Label>
          <Input id="sponsor-tel" type="tel" value={telefon} onChange={(e) => setTelefon(e.target.value)} autoComplete="tel" />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="sponsor-msg">Nachricht (optional)</Label>
        <textarea
          id="sponsor-msg"
          rows={3}
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          maxLength={8000}
          placeholder="Was ihr mitbringt …"
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
        />
      </div>

      <div className="space-y-2">
        <input
          ref={dateiRef}
          id="sponsor-datei"
          type="file"
          accept="image/png,image/jpeg,image/webp,application/pdf"
          className="sr-only"
          onChange={(e) => onDatei(e.target.files?.[0] ?? null)}
        />
        <label
          htmlFor="sponsor-datei"
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold hover:border-koder-orange hover:text-koder-orange"
        >
          <Upload className="size-4" aria-hidden />
          Logo oder PDF hochladen
        </label>
        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP oder PDF, maximal 4 MB.</p>
        {datei && (
          <p className="flex items-center gap-3 text-sm">
            <span>{datei.name}</span>
            <button
              type="button"
              className="text-xs text-muted-foreground underline"
              onClick={() => {
                setDatei(null);
                if (dateiRef.current) dateiRef.current.value = "";
              }}
            >
              Entfernen
            </button>
          </p>
        )}
      </div>

      {honeypotReady ? (
        <div className="hidden" aria-hidden="true">
          <label htmlFor="sponsor-fax">Fax</label>
          <input id="sponsor-fax" name="fax_number" type="text" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
        </div>
      ) : null}

      {status === "error" && errorMsg && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">{errorMsg}</p>
      )}

      <Button type="submit" disabled={status === "sending"} size="lg" className="w-full sm:w-auto">
        {status === "sending" ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Wird gesendet…
          </>
        ) : (
          <>
            <Send className="size-4" />
            {band ? submitLabel(band) : "Anfragen"}
          </>
        )}
      </Button>
    </form>
  );
}

function toFormData(
  payload: {
    anfrageWeg: string;
    band: string;
    flaecheId?: string;
    beitragsart?: string;
    wert: number;
    firma: string;
    ansprechpartner: string;
    email: string;
    telefon: string;
    angebot?: string;
    nachricht: string;
    fax_number: string;
  },
  datei: File,
): FormData {
  const fd = new FormData();
  fd.set("anfrageWeg", payload.anfrageWeg);
  fd.set("band", payload.band);
  if (payload.flaecheId) fd.set("flaecheId", payload.flaecheId);
  if (payload.beitragsart) fd.set("beitragsart", payload.beitragsart);
  fd.set("wert", String(payload.wert));
  fd.set("firma", payload.firma);
  fd.set("ansprechpartner", payload.ansprechpartner);
  fd.set("email", payload.email);
  if (payload.telefon) fd.set("telefon", payload.telefon);
  if (payload.angebot) fd.set("angebot", payload.angebot);
  if (payload.nachricht) fd.set("nachricht", payload.nachricht);
  if (payload.fax_number) fd.set("fax_number", payload.fax_number);
  fd.set("datei", datei);
  return fd;
}
