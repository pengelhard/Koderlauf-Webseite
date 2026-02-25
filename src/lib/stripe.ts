import Stripe from "stripe";

import { getServerEnv } from "@/lib/env";

let stripeClient: Stripe | null = null;

export function getStripeClient() {
  if (stripeClient) return stripeClient;

  const env = getServerEnv();
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY ist nicht gesetzt.");
  }

  stripeClient = new Stripe(env.STRIPE_SECRET_KEY);
  return stripeClient;
}

export function getStripePriceId(distance: "5km" | "10km" | "15km" | "kids") {
  const env = getServerEnv();
  const map = {
    "5km": env.STRIPE_PRICE_5KM,
    "10km": env.STRIPE_PRICE_10KM,
    "15km": env.STRIPE_PRICE_15KM,
    kids: env.STRIPE_PRICE_KIDS,
  } as const;

  return map[distance];
}
