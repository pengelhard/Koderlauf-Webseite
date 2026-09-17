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
  bandWarnung,
  beitragsartWarnung,
  BAND_LABEL,
  defaultBeitragsart,
  flaecheOptionLabel,
  flaecheParamAusSearch,
  getFlaeche,
  isBeitragsart,
  isBeitragsartGueltig,
  isBeitragsband,
  isFlaecheBuchbar,
  isSachspendeFlaeche,
  SPONSOR_FLAECHEN,
  SPONSORING_2027,
  submitLabel,
  vorschlagBand,
  type AnfrageWeg,
  type Beitragsart,
  type Beitragsband,
} from "@/lib/sponsoring-2027";

function isValidEmailFormat(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

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
  const [beitragsart, setBeitragsart] = useState<Beitragsart>(
    defaultBeitragsart(getFlaeche(flaecheParam)),
  );
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
  const artWarnung = beitragsartWarnung(gewaehlteFlaeche, beitragsart);
  const istSachspende = isSachspendeFlaeche(gewaehlteFlaeche);

  useEffect(() => {
    const id = requestAnimationFrame(() => setHoneypotReady(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const resolved = flaecheParamAusSearch(
      searchParams.get("flaeche"),
      searchParams.get("posten"),
    );
    const nextWeg = anfrageWegAusQuery(stufeParam, searchParams.get("flaeche"), searchParams.get("posten"));
    setAnfrageWeg(nextWeg);
    const nextFlaeche = getFlaeche(resolved);
    if (nextFlaeche) {
      setFlaecheId(nextFlaeche.id);
      setBand(vorschlagBand(nextFlaeche));
      setBeitragsart(defaultBeitragsart(nextFlaeche));
    } else if (nextWeg === "paket") {
      setBand(bandAusQuery(stufeParam, undefined));
      setFlaecheId("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stufeParam, searchParams]);

  function updateQuery(nextWeg: AnfrageWeg, nextBand: Beitragsband, nextFlaeche: string) {
    const q = new URLSearchParams();
    if (nextWeg === "flaeche" && nextFlaeche) {
      q.set("stufe", nextBand);
      q.set("flaeche", nextFlaeche);
    } else {
      q.set("stufe", nextBand);
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
    if (flaecheId && !isFlaecheBuchbar(flaecheId)) {
      setStatus("error");
      setErrorMsg("Diese Fläche ist gerade nicht buchbar.");
      return;
    }
    if (anfrageWeg === "flaeche" && !isBeitragsartGueltig(gewaehlteFlaeche, beitragsart)) {
      setStatus("error");
      setErrorMsg("Diese Fläche ist eine Sachspende. Geld allein bucht sie nicht.");
      return;
    }
    if (!bestaetigt) {
      setStatus("error");
      setErrorMsg("Bitte bestätigt, dass ihr eine unverbindliche Anfrage senden wollt.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/sponsor-anfrage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anfrageWeg,
          band,
          flaecheId: anfrageWeg === "flaeche" ? flaecheId : undefined,
          beitragsart: anfrageWeg === "flaeche" ? beitragsart : undefined,
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
          . Als Nächstes: Paket bestätigen, Fläche ja/nein, Logo-Formate, Rechnungsadresse.
        </p>
        <Button type="button" variant="outline" className="mt-2" onClick={() => setStatus("idle")}>
          Weitere Anfrage
        </Button>
      </div>
    );
  }

  const flaecheOptions = SPONSOR_FLAECHEN.filter((f) => isFlaecheBuchbar(f.id) || f.mehrereMoeglich);

  return (
    <form noValidate onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2">
        <fieldset
          className={`rounded-2xl border p-5 transition-colors ${
            anfrageWeg === "paket" ? "border-koder-orange bg-koder-orange/5" : "border-border"
          }`}
        >
          <legend className="px-1 text-sm font-bold">Nur Paket</legend>
          <p className="mt-1 text-sm text-muted-foreground">Partner 150 € · Sponsor 300 € · Hauptsponsor 500 €</p>
          <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm">
            <input
              type="radio"
              name="anfrageWeg"
              checked={anfrageWeg === "paket"}
              onChange={() => {
                setAnfrageWeg("paket");
                setFlaecheId("");
                setBand("partner");
                updateQuery("paket", "partner", "");
              }}
              className="mt-1"
            />
            <span>Paket wählen (ohne Fläche)</span>
          </label>
          {anfrageWeg === "paket" && (
            <div className="mt-4 grid gap-2">
              {(["partner", "sponsor", "hauptsponsor"] as const).map((id) => (
                <label
                  key={id}
                  className={`cursor-pointer rounded-xl border p-3 text-sm ${
                    band === id ? "border-koder-orange bg-koder-orange/10" : "border-border"
                  }`}
                >
                  <input
                    type="radio"
                    name="paket"
                    value={id}
                    checked={band === id}
                    onChange={() => {
                      if (!isBeitragsband(id)) return;
                      setBand(id);
                      updateQuery("paket", id, "");
                    }}
                    className="sr-only"
                  />
                  <span className="font-bold">{BAND_LABEL[id]}</span>
                  <span className="text-muted-foreground">
                    {" "}
                    ·{" "}
                    {id === "partner"
                      ? `${SPONSORING_2027.partnerPreis} €`
                      : id === "sponsor"
                        ? `ab ${SPONSORING_2027.sponsorAb} €`
                        : `ab ${SPONSORING_2027.hauptsponsorAb} €`}
                  </span>
                </label>
              ))}
            </div>
          )}
        </fieldset>

        <fieldset
          className={`rounded-2xl border p-5 transition-colors ${
            anfrageWeg === "flaeche" ? "border-koder-orange bg-koder-orange/5" : "border-border"
          }`}
        >
          <legend className="px-1 text-sm font-bold">Eine Fläche wählen</legend>
          <p className="mt-1 text-sm text-muted-foreground">
            Paket folgt aus dem Gegenwert. Art des Beitrags aus Flächentyp.
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
                  setBeitragsart(defaultBeitragsart(first));
                  updateQuery("flaeche", vorschlagBand(first), first.id);
                }
              }}
              className="mt-1"
            />
            <span>Konkrete Fläche übernehmen</span>
          </label>
        </fieldset>
      </div>

      {anfrageWeg === "flaeche" && (
        <div className="space-y-5 rounded-2xl border border-border bg-muted/20 p-5">
          <div className="space-y-2">
            <Label htmlFor="sponsor-flaeche">Fläche (Pflicht)</Label>
            <select
              id="sponsor-flaeche"
              name="flaeche"
              required
              value={flaecheId}
              onChange={(e) => {
                const id = e.target.value;
                const f = getFlaeche(id);
                setFlaecheId(id);
                const nextBand = vorschlagBand(f);
                setBand(nextBand);
                setBeitragsart(defaultBeitragsart(f));
                updateQuery("flaeche", nextBand, id);
              }}
              className="border-input bg-background focus-visible:border-ring focus-visible:ring-ring/50 flex h-10 w-full rounded-md border px-3 text-sm outline-none focus-visible:ring-[3px]"
            >
              <option value="">Bitte wählen …</option>
              {flaecheOptions.map((f) => (
                <option key={f.id} value={f.id} disabled={!isFlaecheBuchbar(f.id)}>
                  {flaecheOptionLabel(f)}
                </option>
              ))}
            </select>
          </div>

          {gewaehlteFlaeche && (
            <p className="text-sm text-muted-foreground">
              Vorgeschlagenes Paket: <strong>{BAND_LABEL[band]}</strong> ({gewaehlteFlaeche.festpreis} €)
            </p>
          )}

          {istSachspende && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-900 dark:text-amber-100">
              Sachspende: Bitte die Sache stellen. Eine Überweisung ersetzt das nicht.
            </p>
          )}

          <BeitragsartFeld
            beitragsart={beitragsart}
            setBeitragsart={setBeitragsart}
            sachspende={istSachspende}
          />

          {bandHinweis && (
            <p className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-xs text-amber-900 dark:text-amber-100">
              {bandHinweis}
            </p>
          )}
          {artWarnung && (
            <p className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
              {artWarnung}
            </p>
          )}
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
          rows={4}
          value={nachricht}
          onChange={(e) => setNachricht(e.target.value)}
          maxLength={8000}
          placeholder="Was euch wichtig ist, Fragen …"
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 flex min-h-[100px] w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs outline-none focus-visible:ring-[3px] md:text-sm"
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
          Unverbindliche Anfrage, keine Online-Zahlung. Der Verein meldet sich.{" "}
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
            {submitLabel(anfrageWeg, band, gewaehlteFlaeche)}
          </>
        )}
      </Button>
    </form>
  );
}

function BeitragsartFeld({
  beitragsart,
  setBeitragsart,
  sachspende,
}: {
  beitragsart: Beitragsart;
  setBeitragsart: (v: Beitragsart) => void;
  sachspende: boolean;
}) {
  const options: { id: Beitragsart; label: string; disabled?: boolean }[] = sachspende
    ? [
        { id: "sach", label: "Sachspende" },
        { id: "beides", label: "Sache + Zuschuss" },
        { id: "geld", label: "Nur Geld", disabled: true },
      ]
    : [
        { id: "geld", label: "Geld" },
        { id: "sach", label: "Sache" },
        { id: "beides", label: "Beides" },
      ];

  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold">Art des Beitrags</legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {options.map(({ id, label, disabled }) => (
          <label
            key={id}
            className={`rounded-xl border p-3 text-sm ${
              disabled
                ? "cursor-not-allowed border-border opacity-50"
                : beitragsart === id
                  ? "cursor-pointer border-koder-orange bg-koder-orange/10"
                  : "cursor-pointer border-border"
            }`}
          >
            <input
              type="radio"
              name="beitragsart"
              value={id}
              checked={beitragsart === id}
              disabled={disabled}
              onChange={() => {
                if (isBeitragsart(id) && !disabled) setBeitragsart(id);
              }}
              className="sr-only"
            />
            <span className="font-semibold">{label}</span>
          </label>
        ))}
      </div>
      {!sachspende && (
        <p className="text-xs text-muted-foreground">
          Wer die Sache stellt, zahlt nicht bar nach.
        </p>
      )}
    </fieldset>
  );
}
