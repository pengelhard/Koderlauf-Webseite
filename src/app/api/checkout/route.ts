import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getPrice, formatPrice } from "@/lib/pricing";
import type { Distance } from "@/lib/pricing";

function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  return new Stripe(key, { apiVersion: "2026-02-25.clover" });
}

export async function POST(request: NextRequest) {
  try {
    const stripe = getStripe();

    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      distance,
    } = body as {
      firstName: string;
      lastName: string;
      email: string;
      distance: Distance;
    };

    const priceInfo = getPrice(distance);
    const distanceLabels: Record<Distance, string> = {
      "5km": "5 km Lauf",
      "10km": "10 km Lauf",
      kids: "Kids-Lauf (~2 km)",
    };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: email,
      metadata: {
        firstName,
        lastName,
        email,
        distance,
        priceTier: priceInfo.tier,
      },
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Koderlauf 2027 – ${distanceLabels[distance]}`,
              description: `${priceInfo.label}: ${formatPrice(priceInfo.amount)} · ${firstName} ${lastName}`,
            },
            unit_amount: priceInfo.amount,
          },
          quantity: 1,
        },
      ],
      success_url: `${request.nextUrl.origin}/anmeldung/erfolg?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${request.nextUrl.origin}/anmeldung?cancelled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Checkout konnte nicht erstellt werden." },
      { status: 500 }
    );
  }
}
