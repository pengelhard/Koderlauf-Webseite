import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import {
  getDemoResultsByDistance,
  STRECKE_ID_TO_DISTANZ,
  type ResultRow,
} from "@/lib/data/results";

export async function GET(req: NextRequest) {
  const strecke = req.nextUrl.searchParams.get("strecke");
  if (!strecke || !STRECKE_ID_TO_DISTANZ[strecke]) {
    return NextResponse.json(
      {
        error:
          "Parameter ?strecke= erforderlich: kinderlauf | kurz | koderrunde | trailrun",
      },
      { status: 400 }
    );
  }

  const distanz = STRECKE_ID_TO_DISTANZ[strecke];
  let rows: ResultRow[] = [];
  let usedDemo = true;

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase
      .from("results")
      .select("*")
      .eq("jahr", 2026)
      .eq("distanz", distanz)
      .order("platz_gesamt", { ascending: true });

    if (!error && data && data.length > 0) {
      usedDemo = false;
      rows = (data as unknown as ResultRow[]).map((r) => ({
        platz_gesamt: Number(r.platz_gesamt) || 0,
        startnummer: Number(r.startnummer) || 0,
        vorname: String(r.vorname ?? ""),
        nachname: String(r.nachname ?? ""),
        distanz: String(r.distanz ?? ""),
        zeit: String(r.zeit ?? ""),
        platz_ak: r.platz_ak ?? null,
        geschlecht: (r.geschlecht === "W" ? "W" : "M") as "M" | "W",
        altersklasse:
          typeof r.altersklasse === "number"
            ? r.altersklasse
            : r.altersklasse != null
              ? Number(r.altersklasse)
              : null,
      }));
    }
  } catch {
    // Fallback Demo
  }

  if (rows.length === 0) {
    rows = getDemoResultsByDistance(distanz);
    usedDemo = true;
  }

  return NextResponse.json({
    strecke,
    distanz,
    results: rows,
    demo: usedDemo,
  });
}
