"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ChevronRight, User, Mail, Activity } from "lucide-react";

const categories = ["Herren", "Damen", "Jugend U18"];

export default function AnmeldungPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    category: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 pt-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <CheckCircle className="h-10 w-10 text-success" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold">Anmeldung erfolgreich!</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Vielen Dank, {form.firstName}! Du bist für den Koderlauf 2027
            angemeldet.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Eine Bestätigung wurde an {form.email} gesendet.
          </p>
        </motion.div>
      </div>
    );
  }

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

        {/* Progress steps */}
        <div className="mt-10 flex items-center gap-4">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-colors ${
                  step >= s
                    ? "bg-koder-orange text-white"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {s}
              </div>
              <span className="text-sm font-medium">
                {s === 1 ? "Persönliche Daten" : "Kategorie"}
              </span>
              {s < 2 && <ChevronRight size={16} className="text-muted-foreground" />}
            </div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Card className="mt-8 rounded-3xl border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                {step === 1 ? (
                  <>
                    <User className="h-5 w-5 text-koder-orange" />
                    Persönliche Daten
                  </>
                ) : (
                  <>
                    <Activity className="h-5 w-5 text-koder-orange" />
                    Kategorie wählen
                  </>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">Vorname</Label>
                        <Input
                          id="firstName"
                          placeholder="Max"
                          className="rounded-2xl"
                          value={form.firstName}
                          onChange={(e) =>
                            setForm({ ...form, firstName: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Nachname</Label>
                        <Input
                          id="lastName"
                          placeholder="Mustermann"
                          className="rounded-2xl"
                          value={form.lastName}
                          onChange={(e) =>
                            setForm({ ...form, lastName: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-Mail</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="email"
                          type="email"
                          placeholder="max@beispiel.de"
                          className="rounded-2xl pl-10"
                          value={form.email}
                          onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      disabled={!form.firstName || !form.lastName || !form.email}
                      className="w-full rounded-2xl bg-koder-orange py-6 text-sm font-semibold uppercase tracking-widest text-white hover:bg-koder-orange-bright"
                    >
                      Weiter
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                      {categories.map((cat) => (
                        <motion.button
                          key={cat}
                          type="button"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => setForm({ ...form, category: cat })}
                          className={`rounded-2xl border-2 p-6 text-center font-semibold transition-all ${
                            form.category === cat
                              ? "border-koder-orange bg-koder-orange/10 text-koder-orange"
                              : "border-border hover:border-koder-orange/30"
                          }`}
                        >
                          {cat}
                        </motion.button>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setStep(1)}
                        className="flex-1 rounded-2xl py-6"
                      >
                        Zurück
                      </Button>
                      <Button
                        type="submit"
                        disabled={!form.category}
                        className="flex-1 rounded-2xl bg-koder-orange py-6 text-sm font-semibold uppercase tracking-widest text-white hover:bg-koder-orange-bright"
                      >
                        Anmelden
                      </Button>
                    </div>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
