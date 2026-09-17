"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  anfrageWegAusQuery,
  bandAusQuery,
  bandHinweisOhneFlaeche,
  bandWarnung,
  BAND_LABEL,
  flaecheParamAusSearch,
  getFlaeche,
  isBeitragsart,
  isBeitragsband,
  SPONSOR_FLAECHEN,
  SPONSORING_2027,
  STATUS_LABEL,
  submitLabel,
  vorschlagBand,
  type AnfrageWeg,
  type Beitragsart,
  type Beitragsband,
} from "@/lib/sponsoring-2027";

function isValidEmailFormat(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

const KEINE_FLAECHE = "";
const RESTKOSTEN_ID = "restkosten";

export function SponsorAnfrageFormular() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const stufeParam = searchParams.get("stufe");
  const flaecheParam = flaecheParamAusSearch(
    searchParams.get("flaeche"),
    searchParams.get("posten"),
  );

  const [anfrageWeg, setAnfrageWeg] = useState<AnfrageWeg>(
    anfrageWegAusQuery(stufeParam, searchParams.get("flaeche"), searchParams.get("posten")),
  );
  const [band, setBand] = useState<Beitragsband>(
    bandAusQuery(stufeParam, getFlaeche(flaecheParam)),
  );
  const [flaecheId, setFlaecheId] = useState(getFlaeche(flaecheParam)?.id ?? "");
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

  const gewaehlteFlaeche = getFlaeche(flaecheId);
  const bandHinweis = bandWarnung(gewaehlteFlaeche, band);
  const ohneFlaecheHinweis = bandHinweisOhneFlaeche(band, flaecheId);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHoneypotReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const flaecheIdResolved = flaecheParamAusSearch(
      searchParams.get("flaeche"),
      searchParams.get("posten"),
    );
    const nextWeg = anfrageWegAusQuery(
      stufeParam,
      searchParams.get("flaeche"),
      searchParams.get("posten"),
    );
    setAnfrageWeg(nextWeg);
    const nextFlaeche = getFlaeche(flaecheIdResolved);
    if (nextFlaeche) {
      setFlaecheId(nextFlaeche.id);
      if (nextWeg === "flaeche") {
        setBand(bandAusQuery(stufeParam, nextFlaeche));
      }
    }
    if (nextWeg === "beitrag") {
      setBand(bandAusQuery(stufeParam, nextFlaeche));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stufeParam, searchParams]);

  function updateQuery(
    nextWeg: AnfrageWeg,
    nextBand: Beitragsband,
    nextFlaeche: string,
  ) {
    const q = new URLSearchParams();
    if (nextWeg === "partner") {
      q.set("stufe", "partner");
    } else if (nextWeg === "beitrag") {
      q.set("stufe", nextBand);
      if (nextFlaeche) q.set("flaeche", nextFlaeche);
    } else {
      q.set("stufe", nextBand);
      if (nextFlaeche) q.set("flaeche", nextFlaeche);
    }
    router.replace(`/sponsor-werden?${q.toString()}#anfrage`, { scroll: false });
    requestAnimationFrame(() => {
      document.getElementById("anfrage")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
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
    if (anfrageWeg === "flaeche" && !getFlaeche(flaecheId)) {
      setStatus("error");
      setErrorMsg("Bitte eine Fläche wählen.");
      return;
    }
    if (!bestaetigt) {
      setStatus("error");
      setErrorMsg("Bitte bestätigt, dass ihr eine unverbindliche Anfrage ohne Online-Zahlung senden wollt.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/sponsor-anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anfrageWeg,
          band: anfrageWeg === "partner" ? "partner" : band,
          flaecheId: anfrageWeg !== "partner" && flaecheId ? flaecheId : undefined,
          beitragsart: anfrageWeg !== "partner" ? beitragsart : undefined,
          addonBauzaun: anfrageWeg === "partner" ? addonBauzaun : false,
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
        <p className="text-lg font-semibold">Danke – eure Anfrage ist raus.</p>
        <p className="max-w-md text-sm text-muted-foreground">
          Ihr hört von{" "}
          <a href={`mailto:${SPONSORING_2027.kontaktEmail}`} className="text-koder-orange hover:underline">
            {SPONSORING_2027.kontaktEmail}
          </a>
          . Als Nächstes: Band bestätigen, Fläche ja/nein, Logo-Formate, Rechnungsadresse – falls ihr eine
          Sache stellt, den Liefertermin.
        </p>
        <Button type="button" variant="outline" className="mt-2" onClick={() => setStatus("idle")}>
          Weitere Anfrage
        </Button>
      </div>
    );
  }

  const flaecheOptions = SPONSOR_FLAECHEN.filter(
    (f) => f.status !== "vergeben" || f.mehrereMoeglich,
  );

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Weg A */}
        <fieldset
          className={`rounded-2xl border p-5 transition-colors ${
            anfrageWeg === "partner" ? "border-koder-orange bg-koder-orange/5" : "border-border"
          }`}
        >
          <legend className="px-1 text-sm font-bold">Weg A – Partner {SPONSORING_2027.partnerPreis} €</legend>
          <p className="mt-2 text-sm text-muted-foreground">
            Kein Flächen-Select nötig. Bauzaun, Zieleinlauf, Website, Instagram.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="radio"
              name="anfrageWeg"
              checked={anfrageWeg === "partner"}
              onChange={() => {
                setAnfrageWeg("partner");
                setFlaecheId("");
                updateQuery("partner", "partner", "");
              }}
              className="mt-1"
            />
            <span>Partner {SPONSORING_2027.partnerPreis} € bar wählen</span>
          </label>
          {anfrageWeg === "partner" && (
            <label className="mt-3 flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={addonBauzaun}
                onChange={(e) => setAddonBauzaun(e.target.checked)}
                className="mt-1"
              />
              <span>Add-on: Bauzaun-Einzelfeld (ca. 80–100 €, nach Absprache)</span>
            </label>
          )}
        </fieldset>

        {/* Weg B */}
        <fieldset
          className={`rounded-2xl border p-5 transition-colors ${
            anfrageWeg === "beitrag" ? "border-koder-orange bg-koder-orange/5" : "border-border"
          }`}
        >
          <legend className="px-1 text-sm font-bold">Weg B – Förderer oder Hauptsponsor</legend>
          <p className="mt-2 text-sm text-muted-foreground">
            Beitrag nach Band. Fläche optional – oder Restkosten.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="radio"
              name="anfrageWeg"
              checked={anfrageWeg === "beitrag"}
              onChange={() => {
                setAnfrageWeg("beitrag");
                setBand("foerderer");
                updateQuery("beitrag", "foerderer", flaecheId);
              }}
              className="mt-1"
            />
            <span>Förderer oder Hauptsponsor (Beitrag)</span>
          </label>
        </fieldset>

        {/* Weg C */}
        <fieldset
          className={`rounded-2xl border p-5 transition-colors ${
            anfrageWeg === "flaeche" ? "border-koder-orange bg-koder-orange/5" : "border-border"
          }`}
        >
          <legend className="px-1 text-sm font-bold">Weg C – Nur eine Fläche</legend>
          <p className="mt-2 text-sm text-muted-foreground">
            Fläche Pflicht. Band wird aus dem Richtwert vorgeschlagen – ihr könnt höher gehen.
          </p>
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="radio"
              name="anfrageWeg"
              checked={anfrageWeg === "flaeche"}
              onChange={() => {
                setAnfrageWeg("flaeche");
                const first = flaecheOptions[0];
                if (first) {
                  setFlaecheId(first.id);
                  setBand(vorschlagBand(first));
                  updateQuery("flaeche", vorschlagBand(first), first.id);
                } else {
                  updateQuery("flaeche", "foerderer", "");
                }
              }}
              className="mt-1"
            />
            <span>Eine Fläche übernehmen</span>
          </label>
        </fieldset>
      </div>

      {anfrageWeg === "beitrag" && (
        <div className="space-y-6 rounded-2xl border border-border bg-muted/20 p-5">
          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Band</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {(["foerderer", "hauptsponsor"] as const).map((id) => (
                <label
                  key={id}
                  className={`cursor-pointer rounded-xl border p-3 text-sm transition-colors ${
                    band === id ? "border-koder-orange bg-koder-orange/10" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="band"
                    value={id}
                    checked={band === id}
                    onChange={() => {
                      if (!isBeitragsband(id)) return;
                      setBand(id);
                      updateQuery("beitrag", id, flaecheId);
                    }}
                    className="sr-only"
                  />
                  <span className="font-bold">{BAND_LABEL[id]}</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {id === "foerderer" ? "ca. 400–500 € Gegenwert" : "ab ca. 800 € Gegenwert"}
                  </p>
                </label>
              ))}
            </div>
            {band === "hauptsponsor" && (
              <p className="text-xs text-muted-foreground">
                Hauptsponsoren begrenzt auf max. {SPONSORING_2027.hauptsponsorMax} – wir sagen zu oder
                bieten Förderer an.
              </p>
            )}
          </fieldset>

          <div className="space-y-2">
            <Label htmlFor="sponsor-flaeche-opt">Fläche (optional)</Label>
            <select
              id="sponsor-flaeche-opt"
              name="flaecheOptional"
              value={flaecheId}
              onChange={(e) => {
                const id = e.target.value;
                setFlaecheId(id);
                updateQuery("beitrag", band, id);
              }}
              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            >
              <option value={KEINE_FLAECHE}>Keine Fläche / nur Beitrag</option>
              <option value={RESTKOSTEN_ID}>Restkosten (Lauf ermöglichen)</option>
              {flaecheOptions
                .filter((f) => f.id !== RESTKOSTEN_ID)
                .map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.titel}
                  </option>
                ))}
            </select>
            {ohneFlaecheHinweis && !flaecheId && (
              <p className="rounded-lg border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                {ohneFlaecheHinweis}
              </p>
            )}
          </div>

          <BeitragsartFeld beitragsart={beitragsart} setBeitragsart={setBeitragsart} />
        </div>
      )}

      {anfrageWeg === "flaeche" && (
        <div className="space-y-6 rounded-2xl border border-border bg-muted/20 p-5">
          <div className="space-y-2">
            <Label htmlFor="sponsor-flaeche">Fläche (Pflicht)</Label>
            <select
              id="sponsor-flaeche"
              name="flaeche"
              required
              value={flaecheId}
              onChange={(e) => {
                const id = e.target.value;
                setFlaecheId(id);
                const f = getFlaeche(id);
                const nextBand = vorschlagBand(f);
                setBand(nextBand);
                updateQuery("flaeche", nextBand, id);
              }}
              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            >
              <option value="">Bitte wählen …</option>
              {flaecheOptions.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.titel}
                  {f.status !== "offen" && !f.mehrereMoeglich ? ` (${STATUS_LABEL[f.status]})` : ""}
                </option>
              ))}
            </select>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-semibold">Band (Vorschlag)</legend>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["partner", "foerderer", "hauptsponsor"] as const).map((id) => (
                <label
                  key={id}
                  className={`cursor-pointer rounded-xl border p-3 text-sm transition-colors ${
                    band === id ? "border-koder-orange bg-koder-orange/10" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="bandFlaeche"
                    value={id}
                    checked={band === id}
                    onChange={() => {
                      if (!isBeitragsband(id)) return;
                      setBand(id);
                      updateQuery("flaeche", id, flaecheId);
                    }}
                    className="sr-only"
                  />
                  <span className="font-bold">{BAND_LABEL[id]}</span>
                </label>
              ))}
            </div>
            {bandHinweis && (
              <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-100">
                {bandHinweis}
              </p>
            )}
          </fieldset>

          <BeitragsartFeld beitragsart={beitragsart} setBeitragsart={setBeitragsart} />
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="sponsor-firma">Firma / Name *</Label>
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
          <Label htmlFor="sponsor-person">Ansprechpartner *</Label>
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
          <Label htmlFor="sponsor-email">E-Mail *</Label>
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
          Unverbindliche Anfrage, keine Online-Zahlung. Der Verein meldet sich mit den nächsten Schritten
          und der Rechnung.{" "}
          <Link href="/datenschutz" className="text-koder-orange hover:underline">
            Datenschutz
          </Link>
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
            {submitLabel(anfrageWeg, band)}
          </>
        )}
      </Button>
    </form>
  );
}

function BeitragsartFeld({
  beitragsart,
  setBeitragsart,
}: {
  beitragsart: Beitragsart;
  setBeitragsart: (v: Beitragsart) => void;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold">Art des Beitrags</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {(
          [
            ["geld", "Geld"],
            ["sach", "Sache"],
            ["beides", "Beides"],
          ] as const
        ).map(([id, label]) => (
          <label
            key={id}
            className={`cursor-pointer rounded-xl border p-3 text-sm ${
              beitragsart === id ? "border-koder-orange bg-koder-orange/10" : "border-border"
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
        Wer die Sache stellt, zahlt nicht bar nach. Gegenwert zählt für das Band.
      </p>
    </fieldset>
  );
}
