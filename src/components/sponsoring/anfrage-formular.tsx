"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  anfrageArtAusQuery,
  getKostenposten,
  isBeitragsart,
  isPostenRolle,
  KOSTENPARTNERSCHAFTEN,
  ROLLE_LABEL,
  rolleAusQuery,
  rolleHinweis,
  SPONSORING_2027,
  type AnfrageArt,
  type Beitragsart,
  type PostenRolle,
} from "@/lib/sponsoring-2027";

function isValidEmailFormat(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

export function SponsorAnfrageFormular() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stufeParam = searchParams.get("stufe");
  const postenParam = searchParams.get("posten");

  const [anfrageArt, setAnfrageArt] = useState<AnfrageArt>(
    anfrageArtAusQuery(stufeParam, postenParam),
  );
  const [rolle, setRolle] = useState<PostenRolle>(
    rolleAusQuery(stufeParam, getKostenposten(postenParam)),
  );
  const [postenId, setPostenId] = useState(
    getKostenposten(postenParam) ? postenParam! : "",
  );
  const [beitragsart, setBeitragsart] = useState<Beitragsart>("geld");
  const [addonBauzaun, setAddonBauzaun] = useState(false);
  const [firma, setFirma] = useState("");
  const [ansprechpartner, setAnsprechpartner] = useState("");
  const [email, setEmail] = useState("");
  const [telefon, setTelefon] = useState("");
  const [web, setWeb] = useState("");
  const [instagram, setInstagram] = useState("");
  const [nachricht, setNachricht] = useState("");
  const [bestaetigt, setBestaetigt] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [honeypotReady, setHoneypotReady] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const gewaehlterPosten = getKostenposten(postenId);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHoneypotReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const nextArt = anfrageArtAusQuery(stufeParam, postenParam);
    setAnfrageArt(nextArt);
    const nextPosten = getKostenposten(postenParam);
    if (nextPosten) setPostenId(nextPosten.id);
    if (nextArt === "posten") {
      setRolle(rolleAusQuery(stufeParam, nextPosten ?? getKostenposten(postenId)));
    }
    // postenId only as fallback when query has no posten; do not re-run on every postenId change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stufeParam, postenParam]);

  function updateQuery(nextArt: AnfrageArt, nextRolle: PostenRolle, nextPosten: string) {
    const q = new URLSearchParams();
    if (nextArt === "partner") {
      q.set("stufe", "partner");
    } else {
      q.set("stufe", nextRolle);
      if (nextPosten) q.set("posten", nextPosten);
    }
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
    if (anfrageArt === "posten" && !getKostenposten(postenId)) {
      setStatus("error");
      setErrorMsg("Bitte einen Posten wählen.");
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
          anfrageArt,
          rolle: anfrageArt === "posten" ? rolle : undefined,
          postenId: anfrageArt === "posten" ? postenId : undefined,
          beitragsart: anfrageArt === "posten" ? beitragsart : undefined,
          addonBauzaun: anfrageArt === "partner" ? addonBauzaun : false,
          firma,
          ansprechpartner,
          email,
          telefon,
          web,
          instagram,
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
          Wir melden uns von{" "}
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
        <legend className="text-sm font-semibold">Art der Anfrage</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          <label
            className={`cursor-pointer rounded-2xl border p-4 text-sm transition-colors ${
              anfrageArt === "partner"
                ? "border-koder-orange bg-koder-orange/10"
                : "border-border hover:border-koder-orange/40"
            }`}
          >
            <input
              type="radio"
              name="anfrageArt"
              value="partner"
              checked={anfrageArt === "partner"}
              onChange={() => {
                setAnfrageArt("partner");
                updateQuery("partner", rolle, postenId);
              }}
              className="sr-only"
            />
            <span className="font-bold">Partner · {SPONSORING_2027.partnerPreis} €</span>
            <span className="mt-1 block text-muted-foreground">
              Nur Geld. Bauzaun, Zieleinlauf, Website, Instagram. Kein Posten.
            </span>
          </label>
          <label
            className={`cursor-pointer rounded-2xl border p-4 text-sm transition-colors ${
              anfrageArt === "posten"
                ? "border-koder-orange bg-koder-orange/10"
                : "border-border hover:border-koder-orange/40"
            }`}
          >
            <input
              type="radio"
              name="anfrageArt"
              value="posten"
              checked={anfrageArt === "posten"}
              onChange={() => {
                setAnfrageArt("posten");
                updateQuery("posten", rolle, postenId);
              }}
              className="sr-only"
            />
            <span className="font-bold">Kostenpartnerschaft</span>
            <span className="mt-1 block text-muted-foreground">
              Posten wählen. Ab ca. {SPONSORING_2027.hauptsponsorAb} € Hauptsponsor, darunter Sachpartner.
            </span>
          </label>
        </div>
      </fieldset>

      {anfrageArt === "posten" && (
        <>
          <div className="space-y-2">
            <Label htmlFor="sponsor-posten">Posten (Pflicht)</Label>
            <select
              id="sponsor-posten"
              name="posten"
              required
              value={postenId}
              onChange={(e) => {
                const id = e.target.value;
                setPostenId(id);
                const p = getKostenposten(id);
                const nextRolle = rolleAusQuery(null, p);
                setRolle(nextRolle);
                updateQuery("posten", nextRolle, id);
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
            {gewaehlterPosten ? (
              <p className="text-xs text-muted-foreground">{rolleHinweis(gewaehlterPosten)}</p>
            ) : (
              <p className="text-xs text-muted-foreground">
                Ohne konkreten Posten gibt es keinen Hauptsponsor-Titel.
              </p>
            )}
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Gewünschte Rolle</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["hauptsponsor", "sachpartner"] as const).map((id) => (
                <label
                  key={id}
                  className={`cursor-pointer rounded-2xl border p-4 text-sm transition-colors ${
                    rolle === id
                      ? "border-koder-orange bg-koder-orange/10"
                      : "border-border hover:border-koder-orange/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="rolle"
                    value={id}
                    checked={rolle === id}
                    onChange={() => {
                      if (!isPostenRolle(id)) return;
                      setRolle(id);
                      updateQuery("posten", id, postenId);
                    }}
                    className="sr-only"
                  />
                  <span className="font-bold">{ROLLE_LABEL[id]}</span>
                  <span className="mt-1 block text-muted-foreground">
                    {id === "hauptsponsor"
                      ? `Posten ab ca. ${SPONSORING_2027.hauptsponsorAb} € · Partner-Sichtbarkeit plus Werbung auf dem Gegenstand.`
                      : "Unter ca. 500 € · Werbung nur am eigenen Posten, kleine Website-Nennung."}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Art des Beitrags</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {(
                [
                  ["geld", "Geld für den Posten"],
                  ["sach", "Sachspende"],
                  ["beides", "Beides"],
                ] as const
              ).map(([id, label]) => (
                <label
                  key={id}
                  className={`cursor-pointer rounded-2xl border p-3 text-sm transition-colors ${
                    beitragsart === id
                      ? "border-koder-orange bg-koder-orange/10"
                      : "border-border hover:border-koder-orange/40"
                  }`}
                >
                  <input
                    type="radio"
                    name="beitragsart"
                    value={id}
                    checked={beitragsart === id}
                    onChange={() => {
                      if (isBeitragsart(id)) setBeitragsart(id);
                    }}
                    className="sr-only"
                  />
                  <span className="font-semibold">{label}</span>
                </label>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              Wer die Sache stellt, muss nicht bar nachzahlen. Der Richtwert dient nur der Einordnung.
            </p>
          </fieldset>
        </>
      )}

      {anfrageArt === "partner" && (
        <label className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={addonBauzaun}
            onChange={(e) => setAddonBauzaun(e.target.checked)}
            className="mt-1"
          />
          <span>
            Add-on: zusätzliches Bauzaunfeld (kein Solo-Hauptsponsor, Preis nach Absprache ca. 80–100 €).
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
            {anfrageArt === "partner"
              ? `Partner anfragen (${SPONSORING_2027.partnerPreis} €)`
              : rolle === "hauptsponsor"
                ? "Hauptsponsor anfragen"
                : "Sachpartner anfragen"}
          </>
        )}
      </Button>
    </form>
  );
}
