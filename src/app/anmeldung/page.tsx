"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChevronRight,
  ChevronLeft,
  User,
  Mail,
  Calendar,
  Activity,
  CreditCard,
  Shirt,
  Users,
  AlertCircle,
} from "lucide-react";
import {
  type Distance,
  type TShirtSize,
  DISTANCE_LABELS,
  TSHIRT_SIZES,
  getPrice,
  getAllPrices,
  formatPrice,
  getCurrentTier,
  isKidsAgeValid,
} from "@/lib/pricing";
import { registerParticipant } from "@/lib/data/registration";
import { getParticipantCounts } from "@/lib/data/events";

interface FormData {
  vorname: string;
  nachname: string;
  email: string;
  geburtstag: string;
  distanz: Distance | "";
  verein: string;
  tshirtSize: TShirtSize | "";
}

const INITIAL_FORM: FormData = {
  vorname: "",
  nachname: "",
  email: "",
  geburtstag: "",
  distanz: "",
  verein: "",
  tshirtSize: "",
};

const STEP_CONFIG = [
  { num: 1, label: "Persönliches", icon: User },
  { num: 2, label: "Lauf-Details", icon: Activity },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? 80 : -80, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -80 : 80, opacity: 0 }),
};

export default function AnmeldungPage() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [spotCounts, setSpotCounts] = useState<Record<string, number>>({});

  const currentTier = getCurrentTier();

  useEffect(() => {
    getParticipantCounts().then((counts) => {
      setSpotCounts({ "5km": counts["5km"], "10km": counts["10km"], kids: counts.kids });
    });
  }, []);

  const currentPrice = useMemo(() => {
    if (!form.distanz) return null;
    return getPrice(form.distanz as Distance);
  }, [form.distanz]);

  const kidsAgeError = useMemo(() => {
    if (form.distanz !== "kids" || !form.geburtstag) return false;
    return !isKidsAgeValid(new Date(form.geburtstag));
  }, [form.distanz, form.geburtstag]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goTo(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }

  const canProceedStep1 = form.vorname && form.nachname && form.email;
  const canSubmit = form.distanz && form.tshirtSize && !kidsAgeError;

  async function handleSubmit() {
    if (!canSubmit || !form.distanz) return;
    setSubmitting(true);
    setSubmitError("");

    try {
      const result = await registerParticipant({
        vorname: form.vorname,
        nachname: form.nachname,
        email: form.email,
        geburtstag: form.geburtstag || null,
        verein: form.verein || null,
        tshirtSize: form.tshirtSize as TShirtSize,
        distanz: form.distanz as Distance,
      });

      if (!result.success) {
        setSubmitError(result.error || "Fehler bei der Registrierung.");
        setSubmitting(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.vorname,
          lastName: form.nachname,
          email: form.email,
          distance: form.distanz,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setSubmitError(data.error || "Checkout konnte nicht erstellt werden.");
        setSubmitting(false);
      }
    } catch {
      setSubmitError("Verbindungsfehler. Bitte versuche es erneut.");
      setSubmitting(false);
    }
  }

  const maxSpots: Record<string, number> = { "5km": 200, "10km": 150, kids: 100 };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">
            Koderlauf 2027
          </p>
          <h1 className="mt-4 text-5xl font-extrabold tracking-tight sm:text-6xl">
            Anmeldung
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Sichere dir deinen Startplatz für den Koderlauf 2027 in
            Obermögersheim.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="mt-10 flex items-center gap-2 sm:gap-4">
          {STEP_CONFIG.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => { if (s.num < step) goTo(s.num); }}
                disabled={s.num > step}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step >= s.num
                    ? "bg-koder-orange text-white shadow-md shadow-koder-orange/20"
                    : "bg-muted text-muted-foreground"
                } ${s.num < step ? "cursor-pointer hover:bg-koder-orange-bright" : ""}`}
              >
                {s.num}
              </button>
              <span className="hidden text-sm font-medium sm:block">{s.label}</span>
              {i < STEP_CONFIG.length - 1 && (
                <ChevronRight size={16} className="text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-koder-orange/10 px-4 py-2 text-sm font-medium text-koder-orange">
          <CreditCard size={14} />
          Aktueller Tarif:{" "}
          <span className="font-bold">
            {currentTier === "early_bird" ? "Early Bird" : currentTier === "normal" ? "Normalpreis" : "Nachmeldung"}
          </span>
        </div>

        <Card className="mt-6 overflow-hidden rounded-3xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              {step === 1 ? (
                <><User className="h-5 w-5 text-koder-orange" /> Persönliche Daten</>
              ) : (
                <><Activity className="h-5 w-5 text-koder-orange" /> Lauf-Details & Zahlung</>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait" custom={direction}>
              {step === 1 && (
                <motion.div key="step1" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="vorname">Vorname <span className="text-koder-orange">*</span></Label>
                      <Input id="vorname" placeholder="Max" className="rounded-2xl" value={form.vorname} onChange={(e) => update("vorname", e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nachname">Nachname <span className="text-koder-orange">*</span></Label>
                      <Input id="nachname" placeholder="Mustermann" className="rounded-2xl" value={form.nachname} onChange={(e) => update("nachname", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">E-Mail <span className="text-koder-orange">*</span></Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input id="email" type="email" placeholder="max@beispiel.de" className="rounded-2xl pl-10" value={form.email} onChange={(e) => update("email", e.target.value)} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="geburtstag"><Calendar className="mr-1 inline h-4 w-4" /> Geburtsdatum</Label>
                    <Input id="geburtstag" type="date" className="rounded-2xl" value={form.geburtstag} onChange={(e) => update("geburtstag", e.target.value)} />
                  </div>
                  <Button type="button" onClick={() => goTo(2)} disabled={!canProceedStep1} className="w-full rounded-2xl bg-koder-orange py-6 text-sm font-semibold uppercase tracking-widest text-white hover:bg-koder-orange-bright">
                    Weiter <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="step2" custom={direction} variants={slideVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.25 }} className="space-y-6">
                  <div className="space-y-3">
                    <Label>Distanz <span className="text-koder-orange">*</span></Label>
                    <div className="grid gap-3">
                      {(Object.entries(DISTANCE_LABELS) as [Distance, string][]).map(([key, label]) => {
                        const price = getPrice(key);
                        const allPrices = getAllPrices(key);
                        const remaining = maxSpots[key] - (spotCounts[key] || 0);
                        return (
                          <motion.button key={key} type="button" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                            onClick={() => update("distanz", key)}
                            className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                              form.distanz === key ? "border-koder-orange bg-koder-orange/10" : "border-border hover:border-koder-orange/30"
                            }`}>
                            <div>
                              <p className="font-semibold">{label}</p>
                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {currentTier === "early_bird" ? `Ab ${formatPrice(allPrices.normal)} ab März` : currentTier === "normal" ? `War ${formatPrice(allPrices.early_bird)} (Early Bird vorbei)` : "Nachmeldung vor Ort"}
                                <span className="ml-2 text-forest-light">· Noch {remaining} Plätze frei</span>
                              </p>
                            </div>
                            <span className={`text-lg font-extrabold tabular-nums ${form.distanz === key ? "text-koder-orange" : "text-foreground"}`}>
                              {formatPrice(price.amount)}
                            </span>
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>

                  {kidsAgeError && (
                    <div className="rounded-2xl border-2 border-error/30 bg-error/5 p-4 text-sm text-error">
                      Der Kids-Lauf ist nur für Teilnehmer unter 15 Jahren.
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="verein"><Users className="mr-1 inline h-4 w-4" /> Verein (optional)</Label>
                    <Input id="verein" placeholder="z.B. TSV Obermögersheim" className="rounded-2xl" value={form.verein} onChange={(e) => update("verein", e.target.value)} />
                  </div>

                  <div className="space-y-2">
                    <Label><Shirt className="mr-1 inline h-4 w-4" /> T-Shirt-Größe <span className="text-koder-orange">*</span></Label>
                    <div className="flex flex-wrap gap-2">
                      {TSHIRT_SIZES.map((size) => (
                        <motion.button key={size} type="button" whileTap={{ scale: 0.95 }} onClick={() => update("tshirtSize", size)}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                            form.tshirtSize === size ? "border-koder-orange bg-koder-orange/10 text-koder-orange" : "border-border hover:border-koder-orange/30"
                          }`}>
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {currentPrice && (
                    <div className="rounded-2xl border-2 border-koder-orange/30 bg-koder-orange/5 p-5">
                      <h4 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">Zusammenfassung</h4>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">{form.vorname} {form.nachname}</span>
                          <span>{form.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Distanz</span>
                          <span className="font-medium">{form.distanz ? DISTANCE_LABELS[form.distanz as Distance] : "–"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">T-Shirt</span>
                          <span className="font-medium">{form.tshirtSize || "–"}</span>
                        </div>
                        <div className="my-2 border-t border-border" />
                        <div className="flex justify-between text-lg font-extrabold">
                          <span>Gesamt</span>
                          <span className="text-koder-orange">{formatPrice(currentPrice.amount)}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {submitError && (
                    <div className="flex items-start gap-3 rounded-2xl border-2 border-error/30 bg-error/5 p-4 text-sm text-error">
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {submitError}
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button type="button" variant="outline" onClick={() => goTo(1)} className="flex-1 rounded-2xl py-6">
                      <ChevronLeft className="mr-2 h-4 w-4" /> Zurück
                    </Button>
                    <Button type="button" onClick={handleSubmit} disabled={!canSubmit || submitting}
                      className="flex-1 rounded-2xl bg-koder-orange py-6 text-sm font-semibold uppercase tracking-widest text-white hover:bg-koder-orange-bright glow-orange">
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Wird geladen...
                        </span>
                      ) : (
                        <><CreditCard className="mr-2 h-4 w-4" /> Jetzt bezahlen & anmelden</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
