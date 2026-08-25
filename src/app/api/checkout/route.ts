import { NextRequest, NextResponse } from "next/server";

/**
 * Eigenes Stripe-Checkout ist abgeschaltet – Anmeldung/Zahlung laufen über RaceSolution.
 */
export async function POST(_request: NextRequest) {
  return NextResponse.json(
    {
      error:
        "Die Anmeldung und Zahlung laufen über RaceSolution. Bitte nutze /anmeldung.",
      redirect: "/anmeldung",
    },
    { status: 410 },
  );
}
