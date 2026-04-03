"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Send, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const DE_REQUIRED_BY_NAME: Record<string, string> = {
  name: "Bitte gebt euren Namen ein.",
  email: "Bitte gebt eure E-Mail-Adresse ein.",
  subject: "Bitte einen Betreff eingeben.",
  message: "Bitte eine Nachricht eingeben.",
};

const DE_EMAIL_FORMAT = "Bitte eine gültige E-Mail-Adresse eingeben.";

function isValidEmailFormat(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

/** Setzt deutsche Meldungen und zeigt die erste per reportValidity – braucht noValidate am Formular. */
function reportFirstInvalidFeedbackField(form: HTMLFormElement): boolean {
  const nameEl = form.elements.namedItem("name") as HTMLInputElement;
  const emailEl = form.elements.namedItem("email") as HTMLInputElement;
  const subjectEl = form.elements.namedItem("subject") as HTMLInputElement;
  const messageEl = form.elements.namedItem("message") as HTMLTextAreaElement;

  for (const el of [nameEl, emailEl, subjectEl, messageEl]) {
    el.setCustomValidity("");
  }

  if (!nameEl.value.trim()) nameEl.setCustomValidity(DE_REQUIRED_BY_NAME.name);

  const emailTrim = emailEl.value.trim();
  if (!emailTrim) emailEl.setCustomValidity(DE_REQUIRED_BY_NAME.email);
  else if (!isValidEmailFormat(emailTrim)) emailEl.setCustomValidity(DE_EMAIL_FORMAT);

  if (!subjectEl.value.trim()) subjectEl.setCustomValidity(DE_REQUIRED_BY_NAME.subject);

  const msgTrim = messageEl.value.trim();
  if (!msgTrim) messageEl.setCustomValidity(DE_REQUIRED_BY_NAME.message);
  else if (msgTrim.length < 10) messageEl.setCustomValidity("Die Nachricht braucht mindestens 10 Zeichen.");

  if (!form.checkValidity()) {
    const order = [nameEl, emailEl, subjectEl, messageEl];
    order.find((el) => !el.validity.valid)?.reportValidity();
    return false;
  }
  return true;
}

export default function FeedbackPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg(null);
    if (!reportFirstInvalidFeedbackField(e.currentTarget)) {
      setStatus("idle");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, subject, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        const base = typeof data.error === "string" ? data.error : "Senden fehlgeschlagen.";
        const hint = typeof data.hint === "string" ? data.hint : "";
        const detail = typeof data.detail === "string" ? data.detail : "";
        const parts = [base];
        if (hint) parts.push(hint);
        if (detail) parts.push(`Technische Info: ${detail}`);
        setErrorMsg(parts.join("\n\n"));
        return;
      }
      setStatus("success");
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setStatus("error");
      setErrorMsg("Netzwerkfehler. Bitte später erneut versuchen.");
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-koder-orange">Koderlauf 2026</p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">Feedback &amp; Kontakt</h1>
          <p className="mt-4 text-muted-foreground">
            Wir freuen uns über eure Rückmeldung: Wie hat euch der Koderlauf gefallen, was lief besonders gut – und was
            können wir fürs nächste Mal noch verbessern? Hier könnt ihr uns auch gern allgemeine{" "}
            <strong className="font-semibold text-foreground">Fragen zur Veranstaltung</strong> stellen.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8"
        >
          {status === "success" ? (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              <CheckCircle2 className="h-14 w-14 text-koder-orange" aria-hidden />
              <p className="text-lg font-semibold">Danke – eure Nachricht ist unterwegs!</p>
              <p className="max-w-md text-sm text-muted-foreground">
                Wir melden uns bei Bedarf an die angegebene Adresse.
              </p>
              <Button type="button" variant="outline" className="mt-2" onClick={() => setStatus("idle")}>
                Weitere Nachricht senden
              </Button>
            </div>
          ) : (
            <form noValidate onSubmit={handleSubmit} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="feedback-name">Name (erforderlich)</Label>
                  <Input
                    id="feedback-name"
                    name="name"
                    autoComplete="name"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="z. B. Anna M."
                    maxLength={120}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback-email">E-Mail (erforderlich)</Label>
                  <Input
                    id="feedback-email"
                    name="email"
                    type="text"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@beispiel.de"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-subject">Betreff (erforderlich)</Label>
                <Input
                  id="feedback-subject"
                  name="subject"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="z. B. Lob zur Strecke oder Frage zur Startzeit"
                  maxLength={180}
                  aria-invalid={status === "error" && !subject.trim()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="feedback-message">Nachricht (erforderlich, mind. 10 Zeichen)</Label>
                <textarea
                  id="feedback-message"
                  name="message"
                  required
                  minLength={10}
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Was war toll? Was können wir verbessern? Oder eure Frage …"
                  maxLength={8000}
                  className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex min-h-[180px] w-full resize-y rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                />
                <p className="text-xs text-muted-foreground">{message.length} / 8000 Zeichen (min. 10)</p>
              </div>

              {status === "error" && errorMsg && (
                <p className="whitespace-pre-line rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {errorMsg}
                </p>
              )}

              <Button type="submit" disabled={status === "sending"} className="w-full sm:w-auto" size="lg">
                {status === "sending" ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Wird gesendet…
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Senden
                  </>
                )}
              </Button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
