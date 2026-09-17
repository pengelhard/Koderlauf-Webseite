"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getKostenposten,
  isSponsorStufe,
  KOSTENPARTNERSCHAFTEN,
  SPONSORING_2027,
  type SponsorStufe,
} from "@/lib/sponsoring-2027";

function isValidEmailFormat(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function SponsorAnfrageFormular() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stufeParam = searchParams.get("stufe");
  const postenParam = searchParams.get("posten");

  const [stufe, setStufe] = useState<SponsorStufe>(
    isSponsorStufe(stufeParam) ? stufeParam : "partner",
  );
  const [postenId, setPostenId] = useState(postenParam ?? "");
  const [addonBauzaun, setAddonBauzaun] = useState(false);
  const [firma, setFirma] = useState("");
  const [ansprechpartner, setAnsprechpartner] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [web, setWeb] = useState("");
  const [instagram, setInstagram] = useState("");
  const [budget, setBudget] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [bestaetigt, setBestaetigt] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [honeypotReady, setHoneypotReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHoneypotReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (isSponsorStufe(stufeParam)) setStufe(stufeParam);
    if (postenParam && getKostenposten(postenParam)) {
      setPostenId(postenParam);
      setStufe("hauptsponsor");
    }
  }, [stufeParam, postenParam]);

  function updateQuery(nextStufe: SponsorStufe, nextPosten: string) {
    const q = new URLSearchParams();
    q.set("stufe", nextStufe);
    if (nextStufe === "hauptsponsor" && nextPosten) q.set("posten", nextPosten);
    router.replace(`/sponsor-werden?${q.toString()}#anfrage`, { scroll: false });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);

    if (!firma.trim() || !ansprechpartner.trim()) {
      setStatus("error");
      setErrorMsg("Bitte Firma und Ansprechpartner angeben.");
      return;
    }
    if (!isValidEmailFormat(email.trim())) {
      setStatus("error");
      setErrorMsg("Bitte eine gültige E-Mail-Adresse angeben.");
      return;
    }
    if (stufe === "hauptsponsor" && !getKostenposten(postenId)) {
      setStatus("error");
      setErrorMsg("Bitte eine Kostenpartnerschaft wählen.");
      return;
    }
    if (!bestaetigt) {
      setStatus("error");
      setErrorMsg("Bitte bestätigt, dass ihr eine Anfrage ohne Online-Zahlung senden wollt.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/sponsor-anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stufe,
          postenId: stufe === "hauptsponsor" ? postenId : undefined,
          addonBauzaun: stufe === "partner" ? addonBauzaun : false,
          firma,
          ansprechpartner,
          email,
          telefon,
          web,
          instagram,
          budget: stufe === "hauptsponsor" ? budget : undefined,
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
        <p className="text-lg font-semibold">Danke – eure Anfrage ist unterwegs.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Wir melden uns von {""}
          <a href="mailto:info@koderlauf.de" className="text-koder-orange hover:underline">
            info@koderlauf.de
          </a>
          . Zahlung erfolgt später per Rechnung über den Verein – nicht online.
        </p>
        <Button type="button" variant="outline" className="mt-2" onClick={() => setStatus("idle")}>
          Weitere Anfrage
        </Button>
      </div>
    );
  }

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-6">
      <fieldset className="space-y-3">
        <legend className="text-sm font-semibold">Stufe</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(["partner", "hauptsponsor"] as const).map((id) => (
            <label
              key={id}
              className={`cursor-pointer rounded-2xl border p-4 text-sm transition-colors ${
                stufe === id
                  ? "border-koder-orange bg-koder-orange/10"
                  : "border-border hover:border-koder-orange/40"
              }`}
            >
              <input
                type="radio"
                name="stufe"
                value={id}
                checked={stufe === id}
                onChange={() => {
                  setStufe(id);
                  updateQuery(id, postenId);
                }}
                className="sr-only"
              />
              <span className="font-bold">
                {id === "partner" ? `Partner · ${SPONSORING_2027.partnerPreis} €` : "Hauptsponsor · ab 500 €"}
              </span>
              <span className="mt-1 block text-muted-foreground">
                {id === "partner"
                  ? "Banner, Website, Instagram."
                  : "Plus Startnummer, 5 Tickets und ein Posten."}
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {stufe === "hauptsponsor" && (
        <div className="space-y-2">
          <Label htmlFor="sponsor-posten">Kostenpartnerschaft</Label>
          <select
            id="sponsor-posten"
            name="posten"
            required
            value={postenId}
            onChange={(e) => {
              setPostenId(e.target.value);
              updateQuery("hauptsponsor", e.target.value);
            }}
            className="border-input bg-transparent focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
          >
            <option value="">Bitte wählen …</option>
            {KOSTENPARTNERSCHAFTEN.map((p) => (
              <option key={p.id} value={p.id} disabled={p.status === "vergeben"}>
                {p.titel}
                {p.status !== "offen" ? ` (${p.status})` : ""}
              </option>
            ))}
          </select>
          <p className="text-xs text-muted-foreground">
            Angezeigt „ab {SPONSORING_2027.hauptsponsorAb} €“. Wird der Posten teurer, trägt der Verein den Rest
            (Gelddeckel {SPONSORING_2027.hauptsponsorDeckel.toLocaleString("de-DE")} €). Finale Rechnung nach Meldezahlen.
          </p>
        </div>
      )}

      {stufe === "partner" && (
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={addonBauzaun}
            onChange={(e) => setAddonBauzaun(e.target.checked)}
            className="mt-1"
          />
          <span>
            Add-on: zusätzliches Bauzaunfeld (kein Solo-Paket, Preis nach Absprache ca. 80–100 €).
          </span>
        </label>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sponsor-firma">Firma / Name</Label>
          <Input
            id="sponsor-firma"
            name="firma"
            required
            value={firma}
            onChange={(e) => setFirma(e.target.value)}
            maxLength={180}
            autoComplete="organization"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-person">Ansprechpartner</Label>
          <Input
            id="sponsor-person"
            name="ansprechpartner"
            required
            value={ansprechpartner}
            onChange={(e) => setAnsprechpartner(e.target.value)}
            maxLength={180}
            autoComplete="name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-email">E-Mail</Label>
          <Input
            id="sponsor-email"
            name="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-tel">Telefon (optional)</Label>
          <Input
            id="sponsor-tel"
            name="telefon"
            type="tel"
            value={telefon}
            onChange={(e) => setTelefon(e.target.value)}
            autoComplete="tel"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-web">Website (optional)</Label>
          <Input
            id="sponsor-web"
            name="web"
            value={web}
            onChange={(e) => setWeb(e.target.value)}
            placeholder="https://"
            autoComplete="url"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sponsor-ig">Instagram (optional)</Label>
          <Input
            id="sponsor-ig"
            name="instagram"
            value={instagram}
            onChange={(e) => setInstagram(e.target.value)}
            placeholder="@…"
          />
        </div>
      </div>

      {stufe === "hauptsponsor" && (
        <div className="space-y-2">
          <Label htmlFor="sponsor-budget">Wunsch-Budget (optional)</Label>
          <Input
            id="sponsor-budget"
            name="budget"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder={`z. B. ${SPONSORING_2027.hauptsponsorAb} € oder bis Deckel`}
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="sponsor-msg">Nachricht (optional)</Label>
        <textarea
          id="sponsor-msg"
          name="nachricht"
          rows={5}
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          maxLength={8000}
          placeholder="Was euch wichtig ist, Wunsch-Fläche, Fragen …"
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[120px] w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
        />
      </div>

      <label className="flex items-start gap-2 text-sm">
        <input
          type="checkbox"
          required
          checked={bestaetigt}
          onChange={(e) => setBestaetigt(e.target.checked)}
          className="mt-1"
        />
        <span>
          Das ist eine unverbindliche Anfrage. Es gibt keine Online-Zahlung – der Verein meldet sich
          mit den nächsten Schritten und der Rechnung.
        </span>
      </label>

      {honeypotReady ? (
        <div className="hidden" aria-hidden="true">
          <label htmlFor="sponsor-fax">Fax</label>
          <input
            id="sponsor-fax"
            name="fax_number"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </div>
      ) : null}

      {status === "error" && errorMsg && (
        <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {errorMsg}
        </p>
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
            {stufe === "partner" ? "Partner anfragen (150 €)" : "Hauptsponsor anfragen"}
          </>
        )}
      </Button>
    </form>
  );
}
