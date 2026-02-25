"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  distanceOptions,
  registrationSchema,
  shirtSizes,
  startBlocks,
  type RegistrationInput,
} from "@/lib/validation/registration";
import { cn } from "@/lib/utils";

interface FloatingInputProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

function FloatingField({ label, error, children }: FloatingInputProps) {
  return (
    <label className="relative block">
      <span className="pointer-events-none absolute -top-2.5 left-4 z-10 rounded-md bg-dark px-2 text-xs font-semibold uppercase tracking-widest text-primary-glow">
        {label}
      </span>
      {children}
      {error ? <p className="mt-2 text-sm text-error">{error}</p> : null}
    </label>
  );
}

const inputBaseClass =
  "h-14 rounded-2xl border-primary-koder/25 bg-dark-muted text-text-soft focus:border-primary-koder/70 focus:ring-primary-koder";

export function RegistrationForm() {
  const [requestError, setRequestError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegistrationInput>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      distance: "10km",
      photoConsent: true,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    setRequestError(null);

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    const data = (await response.json()) as {
      ok?: boolean;
      checkoutUrl?: string;
      errors?: unknown;
    };

    if (!response.ok || !data.ok || !data.checkoutUrl) {
      setRequestError("Anmeldung konnte nicht gestartet werden. Bitte versuche es erneut.");
      return;
    }

    window.location.href = data.checkoutUrl;
  });

  return (
    <form
      onSubmit={onSubmit}
      className="glass-card space-y-8 p-6 md:p-10"
      aria-label="Anmeldeformular für den Koderlauf 2027"
    >
      <div className="grid gap-5 md:grid-cols-2">
        <FloatingField label="Vorname" error={errors.firstName?.message}>
          <Input className={inputBaseClass} {...register("firstName")} />
        </FloatingField>
        <FloatingField label="Nachname" error={errors.lastName?.message}>
          <Input className={inputBaseClass} {...register("lastName")} />
        </FloatingField>
        <FloatingField label="E-Mail" error={errors.email?.message}>
          <Input type="email" className={inputBaseClass} {...register("email")} />
        </FloatingField>
        <FloatingField label="Telefon" error={errors.phone?.message}>
          <Input type="tel" className={inputBaseClass} {...register("phone")} />
        </FloatingField>
        <FloatingField label="Geburtsjahr" error={errors.birthYear?.message}>
          <Input inputMode="numeric" className={inputBaseClass} {...register("birthYear")} />
        </FloatingField>
        <FloatingField label="Distanz" error={errors.distance?.message}>
          <select
            className={cn(
              inputBaseClass,
              "w-full px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-koder",
            )}
            {...register("distance")}
          >
            {distanceOptions.map((value) => (
              <option key={value} value={value}>
                {value.toUpperCase()}
              </option>
            ))}
          </select>
        </FloatingField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FloatingField label="Startblock">
          <select
            className={cn(
              inputBaseClass,
              "w-full px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-koder",
            )}
            {...register("startBlock")}
          >
            <option value="">Auto</option>
            {startBlocks.map((value) => (
              <option key={value} value={value}>
                Block {value}
              </option>
            ))}
          </select>
        </FloatingField>
        <FloatingField label="Shirt-Größe">
          <select
            className={cn(
              inputBaseClass,
              "w-full px-4 text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-koder",
            )}
            {...register("shirtSize")}
          >
            <option value="">Keine Auswahl</option>
            {shirtSizes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </FloatingField>
        <FloatingField label="Notfallkontakt">
          <Input className={inputBaseClass} {...register("emergencyContact")} />
        </FloatingField>
        <FloatingField label="Notfallnummer">
          <Input className={inputBaseClass} {...register("emergencyPhone")} />
        </FloatingField>
      </div>

      <FloatingField label="Nachricht an das Orga-Team" error={errors.message?.message}>
        <textarea
          className="min-h-36 w-full rounded-2xl border border-primary-koder/25 bg-dark-muted px-4 py-4 text-base text-text-soft focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-koder"
          maxLength={500}
          {...register("message")}
        />
      </FloatingField>

      <div className="space-y-4 rounded-2xl border border-primary-koder/20 bg-dark-muted/80 p-5">
        <label className="flex items-start gap-3 text-sm text-text-soft">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#FF6B00]" {...register("privacyConsent")} />
          <span>
            Ich habe die Datenschutzhinweise gelesen und stimme der Verarbeitung meiner Daten zu.
            {errors.privacyConsent?.message ? (
              <span className="block text-error">{errors.privacyConsent.message}</span>
            ) : null}
          </span>
        </label>

        <label className="flex items-start gap-3 text-sm text-text-soft">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#FF6B00]" {...register("photoConsent")} />
          <span>Ich stimme der Nutzung von Foto-/Videoaufnahmen für die Event-Dokumentation zu.</span>
        </label>

        <label className="flex items-start gap-3 text-sm text-text-soft">
          <input type="checkbox" className="mt-1 h-4 w-4 accent-[#FF6B00]" {...register("termsConsent")} />
          <span>
            Ich akzeptiere die Teilnahmebedingungen und Sicherheitsregeln.
            {errors.termsConsent?.message ? (
              <span className="block text-error">{errors.termsConsent.message}</span>
            ) : null}
          </span>
        </label>
      </div>

      {requestError ? (
        <p className="rounded-xl border border-error/30 bg-error/10 px-4 py-3 text-sm text-error">{requestError}</p>
      ) : null}

      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          type="submit"
          size="xl"
          className="w-full"
          disabled={isSubmitting}
          aria-label="Anmeldung starten und zur Zahlung"
        >
          {isSubmitting ? (
            <>
              <LoaderCircle className="h-4 w-4 animate-spin" /> Wird vorbereitet...
            </>
          ) : (
            "Jetzt anmelden"
          )}
        </Button>
      </motion.div>
    </form>
  );
}
