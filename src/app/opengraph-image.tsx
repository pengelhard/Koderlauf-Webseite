import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Koderlauf 2027 – Lauf mit Herz durch den Wald";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0A3D2A 0%, #0A0A0A 70%)",
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 30% 40%, rgba(255, 107, 0, 0.15) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
          {/* Cat emoji as mascot placeholder in OG */}
          <div
            style={{
              fontSize: "72px",
              marginBottom: "8px",
            }}
          >
            🐈‍⬛
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 700,
              letterSpacing: "8px",
              textTransform: "uppercase" as const,
              color: "#FF6B00",
            }}
          >
            Obermögersheim · Waldlauf
          </div>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 900,
              color: "white",
              lineHeight: 0.95,
              letterSpacing: "-3px",
            }}
          >
            KODERLAUF
          </div>
          <div
            style={{
              fontSize: "96px",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-3px",
              background: "linear-gradient(135deg, #FF6B00, #FF9F1C)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            2027
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              marginTop: "16px",
            }}
          >
            Lauf mit Herz durch den Wald
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: "32px",
            display: "flex",
            gap: "24px",
            fontSize: "18px",
            fontWeight: 600,
            color: "rgba(255,255,255,0.5)",
            letterSpacing: "4px",
            textTransform: "uppercase" as const,
          }}
        >
          <span>15. Juni 2027</span>
          <span>·</span>
          <span>5 km & 10 km</span>
          <span>·</span>
          <span>koderlauf.de</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
