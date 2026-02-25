import { NextRequest, NextResponse } from "next/server";

import { getPublicEnv } from "@/lib/env";
import { getResendClient, getResendFromAddress } from "@/lib/resend";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getStripeClient, getStripePriceId } from "@/lib/stripe";
import { registrationSchema } from "@/lib/validation/registration";

function getBaseUrl(request: NextRequest) {
  try {
    const env = getPublicEnv();
    return env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  } catch {
    return request.nextUrl.origin;
  }
}

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = registrationSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        errors: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const values = parsed.data;
  const baseUrl = getBaseUrl(request);

  let registrationId: string | null = null;

  try {
    const supabase = createSupabaseAdminClient();

    const { data, error } = await supabase
      .from("registrations")
      .insert([
        {
          first_name: values.firstName,
          last_name: values.lastName,
          email: values.email,
          phone: values.phone || null,
          birth_year: values.birthYear ? Number(values.birthYear) : null,
          distance: values.distance,
          start_block: values.startBlock ?? null,
          shirt_size: values.shirtSize ?? null,
          emergency_contact: values.emergencyContact || null,
          emergency_phone: values.emergencyPhone || null,
          message: values.message || null,
          privacy_consent: values.privacyConsent,
          photo_consent: values.photoConsent,
          terms_consent: values.termsConsent,
          payment_status: "pending",
        },
      ])
      .select("id")
      .single();

    if (error) throw error;
    registrationId = data?.id ?? null;
  } catch {
    // Ohne Service Role kann lokal weiter getestet werden.
  }

  const stripePriceId = getStripePriceId(values.distance);
  if (!stripePriceId) {
    return NextResponse.json({
      ok: true,
      checkoutUrl: `${baseUrl}/anmeldung/erfolg?mock=1`,
      mode: "mock",
      registrationId,
    });
  }

  const stripe = getStripeClient();
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [{ price: stripePriceId, quantity: 1 }],
    success_url: `${baseUrl}/anmeldung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/anmeldung/abbruch`,
    customer_email: values.email,
    metadata: {
      registrationId: registrationId ?? "",
      firstName: values.firstName,
      lastName: values.lastName,
      distance: values.distance,
    },
  });

  if (registrationId) {
    try {
      const supabase = createSupabaseAdminClient();
      await supabase
        .from("registrations")
        .update({ stripe_checkout_session_id: session.id })
        .eq("id", registrationId);
    } catch {
      // Fallback ohne DB-Update
    }
  }

  try {
    const resend = getResendClient();
    await resend.emails.send({
      from: getResendFromAddress(),
      to: [values.email],
      subject: "Koderlauf 2027 – Anmeldung gestartet",
      html: `<p>Hi ${values.firstName},</p>
             <p>danke für deine Voranmeldung zum Koderlauf 2027. Bitte schließe jetzt die Zahlung ab:</p>
             <p><a href="${session.url}">Zur Zahlung</a></p>
             <p>Wir sehen uns im Wald! 🌲</p>`,
    });
  } catch {
    // Optionaler Schritt, kein Blocker für Checkout
  }

  return NextResponse.json({
    ok: true,
    checkoutUrl: session.url,
    sessionId: session.id,
    registrationId,
  });
}
