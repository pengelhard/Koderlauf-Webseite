import { ImageResponse } from "next/og";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { cardVariant, gapHeadline, gapLine } from "@/lib/fassjagd/copy";

export const OG_SIZE = { width: 1200, height: 630 };
export const STORY_SIZE = { width: 1080, height: 1920 };

export function fassjagdCardResponse(club: FassjagdClub, format: "og" | "story") {
  const size = format === "story" ? STORY_SIZE : OG_SIZE;
  const story = format === "story";
  const variant = cardVariant(club);
  const place = club.place ?? "–";
  const headline = gapHeadline(club);
  const sub = gapLine(club);
  const pad = story ? 72 : 56;
  const nameSize = story ? 72 : 54;
  const kickerSize = story ? 28 : 22;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #0A3D2A 0%, #0A0A0A 58%, #1a0c00 100%)",
          padding: pad,
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            right: 0,
            width: 420,
            height: 420,
            background: "radial-gradient(circle, rgba(255,107,0,0.28) 0%, transparent 70%)",
          }}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: kickerSize,
                fontWeight: 800,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#FF6B00",
                display: "flex",
              }}
            >
              Fassjagd 2027
            </div>
            <div
              style={{
                fontSize: story ? 36 : 22,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 600,
                display: "flex",
                marginTop: 8,
              }}
            >
              Koderlauf · ein Fass Bier
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
            <div style={{ fontSize: story ? 56 : 40, display: "flex" }}>🍺</div>
            <div style={{ fontSize: story ? 28 : 20, display: "flex" }}>🐈‍⬛</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: nameSize,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: -1.5,
              maxWidth: "95%",
              display: "flex",
            }}
          >
            {club.name}
          </div>
          <div style={{ display: "flex", marginTop: story ? 20 : 12 }}>
            <div style={{ fontSize: story ? 44 : 32, fontWeight: 800, color: "#FF9F1C", display: "flex" }}>
              Platz {place}
            </div>
            <div
              style={{
                fontSize: story ? 36 : 26,
                color: "rgba(255,255,255,0.8)",
                display: "flex",
                marginLeft: 16,
              }}
            >
              {club.total} Starter
            </div>
          </div>
          <div
            style={{
              marginTop: 16,
              display: "flex",
              alignItems: "center",
              borderRadius: 999,
              background: variant === "lead" ? "#FF6B00" : "rgba(255,107,0,0.18)",
              color: variant === "lead" ? "white" : "#FF9F1C",
              padding: story ? "14px 28px" : "10px 22px",
              fontSize: story ? 32 : 24,
              fontWeight: 800,
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: story ? 28 : 22,
              color: "rgba(255,255,255,0.7)",
              fontWeight: 600,
              display: "flex",
              marginTop: 12,
            }}
          >
            {sub}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: story ? 22 : 18,
            color: "rgba(255,255,255,0.45)",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          <div style={{ display: "flex" }}>koderlauf.de/fassjagd/{club.slug}</div>
          <div style={{ display: "flex" }}>kein Personenname</div>
        </div>
      </div>
    ),
    { ...size },
  );
}

export function fassjagdWeekResponse(top: FassjagdClub[]) {
  const rows = top.slice(0, 3);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(160deg, #0A3D2A 0%, #0A0A0A 70%)",
          padding: 56,
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: "#FF6B00",
                display: "flex",
              }}
            >
              Fassjagd 2027 · Wochenstand
            </div>
            <div style={{ fontSize: 42, fontWeight: 900, display: "flex", marginTop: 6 }}>
              Top 3 auf dem Fass
            </div>
          </div>
          <div style={{ fontSize: 48, display: "flex" }}>🍺</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          {rows.map((club, i) => (
            <div
              key={club.slug}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: i === 0 ? "rgba(255,107,0,0.22)" : "rgba(255,255,255,0.06)",
                borderRadius: 20,
                padding: "18px 24px",
                marginTop: i === 0 ? 0 : 16,
              }}
            >
              <div style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 999,
                    background: i === 0 ? "#FF6B00" : "#333",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 900,
                    fontSize: 22,
                  }}
                >
                  {i + 1}
                </div>
                <div style={{ fontSize: 32, fontWeight: 800, display: "flex", marginLeft: 18 }}>
                  {club.name}
                </div>
              </div>
              <div style={{ fontSize: 32, fontWeight: 900, color: "#FF9F1C", display: "flex" }}>
                {club.total}
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 18, color: "rgba(255,255,255,0.45)", fontWeight: 600, display: "flex" }}>
          koderlauf.de/fassjagd
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
