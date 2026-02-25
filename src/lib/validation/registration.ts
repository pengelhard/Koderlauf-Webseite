import { z } from "zod";

export const distanceOptions = ["5km", "10km", "15km", "kids"] as const;
export const startBlocks = ["A", "B", "C"] as const;
export const shirtSizes = ["XS", "S", "M", "L", "XL"] as const;

export const registrationSchema = z.object({
  firstName: z.string().min(2, "Bitte gib deinen Vornamen ein."),
  lastName: z.string().min(2, "Bitte gib deinen Nachnamen ein."),
  email: z.string().email("Bitte gib eine gültige E-Mail-Adresse ein."),
  phone: z.string().min(7, "Bitte gib eine gültige Telefonnummer ein.").optional().or(z.literal("")),
  birthYear: z
    .string()
    .optional()
    .refine((value) => !value || /^\d{4}$/.test(value), "Bitte gib ein gültiges Geburtsjahr ein."),
  distance: z.enum(distanceOptions, { message: "Bitte wähle eine Distanz." }),
  startBlock: z.enum(startBlocks).optional(),
  shirtSize: z.enum(shirtSizes).optional(),
  emergencyContact: z.string().optional(),
  emergencyPhone: z.string().optional(),
  message: z.string().max(500, "Maximal 500 Zeichen.").optional(),
  privacyConsent: z.literal(true, { message: "Datenschutzerklärung muss akzeptiert werden." }),
  photoConsent: z.boolean(),
  termsConsent: z.literal(true, { message: "Teilnahmebedingungen müssen akzeptiert werden." }),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;
