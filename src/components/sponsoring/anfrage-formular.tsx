"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  bandAusQuery,
  BAND_LABEL,
  beitragsartWarnung,
  defaultBeitragsart,
  flaecheOptionLabel,
  flaecheParamAusSearch,
  getFlaeche,
  isBeitragsartGueltig,
  isFlaecheBuchbar,
  isSachspendeFlaeche,
  isSichtbarkeit,
  SACHSPENDEN_SICHTBAR,
  SPONSORING_2027,
  stufeAusWert,
  submitLabel,
  werbeleistungKurz,
  type Beitragsart,
  type Sichtbarkeit,
} from "@/lib/sponsoring-2027";

function isValidEmailFormat(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

const STUFEN_WAHL: Sichtbarkeit[] = ["unter100", "unterstuetzer", "sponsor", "hauptsponsor"];

export function SponsorAnfrageFormular() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stufeParam = searchParams.get("stufe");
  const flaecheParam = flaecheParamAusSearch(searchParams.get("flaeche"), searchParams.get("posten"));

  const [band, setBand] = useState<Sichtbarkeit>(bandAusQuery(stufeParam));
  const [flaecheId, setFlaecheId] = useState(getFlaeche(flaecheParam)?.id ?? "");
  const [wert, setWert] = useState("");
  const [beitragsart, setBeitragsart] = useState<Beitragsart>(defaultBeitragsart(getFlaeche(flaecheParam)));
  const [firma, setFirma] = useState("");
  const [ansprechpartner, setAnsprechpartner] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [bestaetigt, setBestaetigt] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [honeypotReady, setHoneypotReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const gewaehlteFlaeche = getFlaeche(flaecheId);
  const wertZahl = wert.trim() === "" ? null : Number(wert.replace(",", "."));
  const wertGueltig = wertZahl !== null && Number.isFinite(wertZahl) && wertZahl >= 0;
  const stufeAusSache = wertGueltig ? stufeAusWert(wertZahl) : null;
  const artWarnung = beitragsartWarnung(gewaehlteFlaeche, beitragsart);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHoneypotReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const resolved = flaecheParamAusSearch(searchParams.get("flaeche"), searchParams.get("posten"));
    const nextFlaeche = getFlaeche(resolved);
    if (nextFlaeche) setFlaecheId(nextFlaeche.id);
    if (stufeParam) setBand(bandAusQuery(stufeParam));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stufeParam, searchParams]);

  function syncQuery(nextBand: Sichtbarkeit, nextFlaeche: string) {
    const q = new URLSearchParams();
    q.set("stufe", nextBand);
    if (nextFlaeche) q.set("flaeche", nextFlaeche);
    router.replace(`/sponsor-werden?${q.toString()}#anfrage`, { scroll: false });
  }

  function onWertChange(raw: string) {
    setWert(raw);
    const n = Number(raw.replace(",", "."));
    if (raw.trim() !== "" && Number.isFinite(n) && n >= 0) {
      const next = stufeAusWert(n);
      setBand(next);
      syncQuery(next, flaecheId);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
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
    if (gewaehlteFlaeche && !isBeitragsartGueltig(gewaehlteFlaeche, beitragsart)) {
      setStatus("error");
      setErrorMsg("Diese Sache muss geliefert werden. Geld allein ersetzt sie nicht.");
      return;
    }
    if (!bestaetigt) {
      setStatus("error");
      setErrorMsg("Bitte bestätigt die unverbindliche Anfrage.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/sponsor-anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anfrageWeg: flaecheId ? "flaeche" : "stufe",
          band,
          flaecheId: flaecheId || undefined,
          beitragsart: flaecheId ? beitragsart : undefined,
          wert: wertGueltig ? wertZahl : undefined,
          firma,
          ansprechpartner,
          email,
          telefon,
          nachricht,
          fax_number: honeypot,
        }),
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
          . Keine Zahlung über die Website.
        </p>
        <Button type="button" variant="outline" className="mt-2" onClick={() => setStatus("idle")}>
          Weitere Anfrage
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-2">
        <legend className="text-sm font-semibold">Stufe</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {STUFEN_WAHL.map((id) => (
            <label
              key={id}
              className={`cursor-pointer rounded-xl border p-3 text-sm ${
                band === id ? "border-koder-orange bg-koder-orange/10" : "border-border"
              }`}
            >
              <input
                type="radio"
                name="stufe"
                value={id}
                checked={band === id}
                onChange={() => {
                  if (!isSichtbarkeit(id)) return;
                  setBand(id);
                  syncQuery(id, flaecheId);
                }}
                className="sr-only"
              />
              <span className="font-bold">{BAND_LABEL[id]}</span>
              <p className="mt-1 text-xs text-muted-foreground">{werbeleistungKurz(id)}</p>
            </label>
          ))}
        </div>
      </fieldset>

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
              syncQuery(band, id);
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
          <Label htmlFor="sponsor-wert">Wert der Sache in € (optional)</Label>
          <Input
            id="sponsor-wert"
            inputMode="decimal"
            value={wert}
            onChange={(e) => onWertChange(e.target.value)}
            placeholder="z. B. 400"
          />
        </div>
      </div>

      {stufeAusSache && (
        <p className="rounded-lg border border-koder-orange/30 bg-koder-orange/10 px-3 py-2 text-sm">
          Bei {wertZahl} € seid ihr <strong>{BAND_LABEL[stufeAusSache]}</strong>. {werbeleistungKurz(stufeAusSache)}
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
          placeholder={
            flaecheId === "verpflegung"
              ? "Was ihr an Essen oder Trinken bieten könnt …"
              : flaecheId === "preise"
                ? "Idee für die Siegerpreise …"
                : "Was ihr mitbringt …"
          }
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[80px] w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" required checked={bestaetigt} onChange={(e) => setBestaetigt(e.target.checked)} className="mt-1" />
        <span>
          Unverbindliche Anfrage, keine Online-Zahlung.{" "}
          <Link href="/datenschutz" className="text-koder-orange hover:underline">
            Datenschutz
          </Link>
        </span>
      </label>

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
            {submitLabel(band)}
          </>
        )}
      </Button>
    </form>
  );
}
