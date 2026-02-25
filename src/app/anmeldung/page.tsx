"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useMemo } from "react";
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
  ShieldCheck,
  CreditCard,
  Shirt,
  Phone,
  Users,
} from "lucide-react";
import {
  type Distance,
  type Gender,
  type TShirtSize,
  DISTANCE_LABELS,
  GENDER_OPTIONS,
  TSHIRT_SIZES,
  getPrice,
  getAllPrices,
  formatPrice,
  getCurrentTier,
  isKidsAgeValid,
} from "@/lib/pricing";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  birthDate: string;
  gender: Gender | "";
  distance: Distance | "";
  club: string;
  tshirtSize: TShirtSize | "";
  emergencyName: string;
  emergencyPhone: string;
  photoConsent: boolean;
  privacyAccepted: boolean;
}

const INITIAL_FORM: FormData = {
  firstName: "",
  lastName: "",
  email: "",
  birthDate: "",
  gender: "",
  distance: "",
  club: "",
  tshirtSize: "",
  emergencyName: "",
  emergencyPhone: "",
  photoConsent: false,
  privacyAccepted: false,
};

const STEP_CONFIG = [
  { num: 1, label: "Persönliches", icon: User },
  { num: 2, label: "Lauf-Details", icon: Activity },
  { num: 3, label: "Sicherheit & Zahlung", icon: ShieldCheck },
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

  const currentTier = getCurrentTier();

  const currentPrice = useMemo(() => {
    if (!form.distance) return null;
    return getPrice(form.distance as Distance);
  }, [form.distance]);

  const kidsAgeError = useMemo(() => {
    if (form.distance !== "kids" || !form.birthDate) return false;
    return !isKidsAgeValid(new Date(form.birthDate));
  }, [form.distance, form.birthDate]);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function goTo(target: number) {
    setDirection(target > step ? 1 : -1);
    setStep(target);
  }

  const canProceedStep1 =
    form.firstName && form.lastName && form.email && form.birthDate && form.gender;

  const canProceedStep2 =
    form.distance && form.tshirtSize && !kidsAgeError;

  const canSubmit =
    form.emergencyName && form.emergencyPhone && form.privacyAccepted;

  async function handleSubmit() {
    if (!canSubmit || !form.distance) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          distance: form.distance,
          birthDate: form.birthDate,
          gender: form.gender,
          club: form.club || null,
          tshirtSize: form.tshirtSize,
          emergencyName: form.emergencyName,
          emergencyPhone: form.emergencyPhone,
          photoConsent: form.photoConsent,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || "Ein Fehler ist aufgetreten.");
        setSubmitting(false);
      }
    } catch {
      alert("Verbindungsfehler. Bitte versuche es erneut.");
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
            Obermögersheim. Zahlung per Stripe direkt bei Anmeldung.
          </p>
        </motion.div>

        {/* Step Indicator */}
        <div className="mt-10 flex items-center gap-2 sm:gap-4">
          {STEP_CONFIG.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (s.num < step) goTo(s.num);
                }}
                disabled={s.num > step}
                className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all ${
                  step >= s.num
                    ? "bg-koder-orange text-white shadow-md shadow-koder-orange/20"
                    : "bg-muted text-muted-foreground"
                } ${s.num < step ? "cursor-pointer hover:bg-koder-orange-bright" : ""}`}
              >
                {s.num}
              </button>
              <span className="hidden text-sm font-medium sm:block">
                {s.label}
              </span>
              {i < STEP_CONFIG.length - 1 && (
                <ChevronRight size={16} className="text-muted-foreground" />
              )}
            </div>
          ))}
        </div>

        {/* Price Tier Badge */}
        <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-koder-orange/10 px-4 py-2 text-sm font-medium text-koder-orange">
          <CreditCard size={14} />
          Aktueller Tarif:{" "}
          <span className="font-bold">
            {currentTier === "early_bird"
              ? "Early Bird"
              : currentTier === "normal"
                ? "Normalpreis"
                : "Nachmeldung"}
          </span>
        </div>

        {/* Form Card */}
        <Card className="mt-6 overflow-hidden rounded-3xl border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-xl">
              {step === 1 && (
                <>
                  <User className="h-5 w-5 text-koder-orange" />
                  Persönliche Daten
                </>
              )}
              {step === 2 && (
                <>
                  <Activity className="h-5 w-5 text-koder-orange" />
                  Lauf-Details
                </>
              )}
              {step === 3 && (
                <>
                  <ShieldCheck className="h-5 w-5 text-koder-orange" />
                  Sicherheit & Einwilligungen
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AnimatePresence mode="wait" custom={direction}>
              {/* STEP 1: Personal Data */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">
                        Vorname <span className="text-koder-orange">*</span>
                      </Label>
                      <Input
                        id="firstName"
                        placeholder="Max"
                        className="rounded-2xl"
                        value={form.firstName}
                        onChange={(e) => update("firstName", e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">
                        Nachname <span className="text-koder-orange">*</span>
                      </Label>
                      <Input
                        id="lastName"
                        placeholder="Mustermann"
                        className="rounded-2xl"
                        value={form.lastName}
                        onChange={(e) => update("lastName", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">
                      E-Mail <span className="text-koder-orange">*</span>
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="max@beispiel.de"
                        className="rounded-2xl pl-10"
                        value={form.email}
                        onChange={(e) => update("email", e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="birthDate">
                        Geburtsdatum <span className="text-koder-orange">*</span>
                      </Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="birthDate"
                          type="date"
                          className="rounded-2xl pl-10"
                          value={form.birthDate}
                          onChange={(e) => update("birthDate", e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>
                        Geschlecht <span className="text-koder-orange">*</span>
                      </Label>
                      <div className="flex gap-2">
                        {GENDER_OPTIONS.map((g) => (
                          <motion.button
                            key={g.value}
                            type="button"
                            whileTap={{ scale: 0.97 }}
                            onClick={() => update("gender", g.value)}
                            className={`flex-1 rounded-2xl border-2 py-3 text-center text-sm font-semibold transition-all ${
                              form.gender === g.value
                                ? "border-koder-orange bg-koder-orange/10 text-koder-orange"
                                : "border-border hover:border-koder-orange/30"
                            }`}
                          >
                            {g.label}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={() => goTo(2)}
                    disabled={!canProceedStep1}
                    className="w-full rounded-2xl bg-koder-orange py-6 text-sm font-semibold uppercase tracking-widest text-white hover:bg-koder-orange-bright"
                  >
                    Weiter
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </motion.div>
              )}

              {/* STEP 2: Race Details */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  {/* Distance selection with live pricing */}
                  <div className="space-y-3">
                    <Label>
                      Distanz <span className="text-koder-orange">*</span>
                    </Label>
                    <div className="grid gap-3">
                      {(Object.entries(DISTANCE_LABELS) as [Distance, string][]).map(
                        ([key, label]) => {
                          const price = getPrice(key);
                          const allPrices = getAllPrices(key);
                          return (
                            <motion.button
                              key={key}
                              type="button"
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              onClick={() => update("distance", key)}
                              className={`flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition-all ${
                                form.distance === key
                                  ? "border-koder-orange bg-koder-orange/10"
                                  : "border-border hover:border-koder-orange/30"
                              }`}
                            >
                              <div>
                                <p className="font-semibold">{label}</p>
                                <p className="mt-0.5 text-xs text-muted-foreground">
                                  {currentTier === "early_bird"
                                    ? `Ab ${formatPrice(allPrices.normal)} ab März`
                                    : currentTier === "normal"
                                      ? `War ${formatPrice(allPrices.early_bird)} (Early Bird vorbei)`
                                      : "Nachmeldung vor Ort"}
                                </p>
                              </div>
                              <span
                                className={`text-lg font-extrabold tabular-nums ${
                                  form.distance === key
                                    ? "text-koder-orange"
                                    : "text-foreground"
                                }`}
                              >
                                {formatPrice(price.amount)}
                              </span>
                            </motion.button>
                          );
                        }
                      )}
                    </div>
                  </div>

                  {/* Kids age warning */}
                  {kidsAgeError && (
                    <div className="rounded-2xl border-2 border-error/30 bg-error/5 p-4 text-sm text-error">
                      Der Kids-Lauf ist nur für Teilnehmer unter 15 Jahren.
                      Das Geburtsdatum ergibt ein Alter von 15+.
                    </div>
                  )}

                  {/* Club */}
                  <div className="space-y-2">
                    <Label htmlFor="club">
                      <Users className="mr-1 inline h-4 w-4" />
                      Verein (optional)
                    </Label>
                    <Input
                      id="club"
                      placeholder="z.B. TSV Obermögersheim"
                      className="rounded-2xl"
                      value={form.club}
                      onChange={(e) => update("club", e.target.value)}
                    />
                  </div>

                  {/* T-Shirt Size */}
                  <div className="space-y-2">
                    <Label>
                      <Shirt className="mr-1 inline h-4 w-4" />
                      T-Shirt-Größe <span className="text-koder-orange">*</span>
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {TSHIRT_SIZES.map((size) => (
                        <motion.button
                          key={size}
                          type="button"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => update("tshirtSize", size)}
                          className={`rounded-xl border-2 px-4 py-2 text-sm font-semibold transition-all ${
                            form.tshirtSize === size
                              ? "border-koder-orange bg-koder-orange/10 text-koder-orange"
                              : "border-border hover:border-koder-orange/30"
                          }`}
                        >
                          {size}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Live Price Summary */}
                  {currentPrice && (
                    <div className="rounded-2xl border border-koder-orange/20 bg-koder-orange/5 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          Startgebühr ({currentPrice.label})
                        </span>
                        <span className="text-xl font-extrabold text-koder-orange">
                          {formatPrice(currentPrice.amount)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo(1)}
                      className="flex-1 rounded-2xl py-6"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Zurück
                    </Button>
                    <Button
                      type="button"
                      onClick={() => goTo(3)}
                      disabled={!canProceedStep2}
                      className="flex-1 rounded-2xl bg-koder-orange py-6 text-sm font-semibold uppercase tracking-widest text-white hover:bg-koder-orange-bright"
                    >
                      Weiter
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              )}

              {/* STEP 3: Safety & Consent */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.25 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="emergencyName">
                      <Phone className="mr-1 inline h-4 w-4" />
                      Notfallkontakt – Name{" "}
                      <span className="text-koder-orange">*</span>
                    </Label>
                    <Input
                      id="emergencyName"
                      placeholder="Name des Notfallkontakts"
                      className="rounded-2xl"
                      value={form.emergencyName}
                      onChange={(e) => update("emergencyName", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergencyPhone">
                      <Phone className="mr-1 inline h-4 w-4" />
                      Notfallkontakt – Telefon{" "}
                      <span className="text-koder-orange">*</span>
                    </Label>
                    <Input
                      id="emergencyPhone"
                      type="tel"
                      placeholder="+49 151 12345678"
                      className="rounded-2xl"
                      value={form.emergencyPhone}
                      onChange={(e) => update("emergencyPhone", e.target.value)}
                      required
                    />
                  </div>

                  {/* Photo consent */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-border p-4 transition-all hover:border-koder-orange/30">
                    <input
                      type="checkbox"
                      checked={form.photoConsent}
                      onChange={(e) => update("photoConsent", e.target.checked)}
                      className="mt-1 h-5 w-5 rounded accent-koder-orange"
                    />
                    <div className="text-sm">
                      <p className="font-medium">
                        Einwilligung Foto-Veröffentlichung
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Ich bin damit einverstanden, dass Fotos und Videos, auf
                        denen ich zu sehen bin, auf der Website und in sozialen
                        Medien veröffentlicht werden.{" "}
                        <a href="#" className="text-koder-orange underline">
                          Datenschutz
                        </a>
                      </p>
                    </div>
                  </label>

                  {/* Privacy / AGB */}
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-border p-4 transition-all hover:border-koder-orange/30">
                    <input
                      type="checkbox"
                      checked={form.privacyAccepted}
                      onChange={(e) =>
                        update("privacyAccepted", e.target.checked)
                      }
                      className="mt-1 h-5 w-5 rounded accent-koder-orange"
                    />
                    <div className="text-sm">
                      <p className="font-medium">
                        Datenschutz & AGB{" "}
                        <span className="text-koder-orange">*</span>
                      </p>
                      <p className="mt-1 text-muted-foreground">
                        Ich habe die{" "}
                        <a href="#" className="text-koder-orange underline">
                          Datenschutzerklärung
                        </a>{" "}
                        und{" "}
                        <a href="#" className="text-koder-orange underline">
                          AGB
                        </a>{" "}
                        gelesen und akzeptiere diese.
                      </p>
                    </div>
                  </label>

                  {/* Final Price Summary */}
                  {currentPrice && (
                    <div className="rounded-2xl border-2 border-koder-orange/30 bg-koder-orange/5 p-5">
                      <h4 className="text-sm font-semibold uppercase tracking-widest text-koder-orange">
                        Zusammenfassung
                      </h4>
                      <div className="mt-3 space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            {form.firstName} {form.lastName}
                          </span>
                          <span>{form.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Distanz</span>
                          <span className="font-medium">
                            {form.distance
                              ? DISTANCE_LABELS[form.distance as Distance]
                              : "–"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">
                            T-Shirt
                          </span>
                          <span className="font-medium">
                            {form.tshirtSize || "–"}
                          </span>
                        </div>
                        <div className="my-2 border-t border-border" />
                        <div className="flex justify-between text-lg font-extrabold">
                          <span>Gesamt</span>
                          <span className="text-koder-orange">
                            {formatPrice(currentPrice.amount)}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => goTo(2)}
                      className="flex-1 rounded-2xl py-6"
                    >
                      <ChevronLeft className="mr-2 h-4 w-4" />
                      Zurück
                    </Button>
                    <Button
                      type="button"
                      onClick={handleSubmit}
                      disabled={!canSubmit || submitting}
                      className="flex-1 rounded-2xl bg-koder-orange py-6 text-sm font-semibold uppercase tracking-widest text-white hover:bg-koder-orange-bright glow-orange"
                    >
                      {submitting ? (
                        <span className="flex items-center gap-2">
                          <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Wird geladen...
                        </span>
                      ) : (
                        <>
                          <CreditCard className="mr-2 h-4 w-4" />
                          Jetzt bezahlen & anmelden
                        </>
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
