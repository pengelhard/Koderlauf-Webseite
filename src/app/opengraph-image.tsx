import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Koderlauf Obermögersheim";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          padding: "72px",
          background:
            "radial-gradient(circle at 18% 0%, rgba(255,107,0,0.5), transparent 38%), radial-gradient(circle at 95% 100%, rgba(30,138,107,0.45), transparent 35%), #0A0A0A",
          color: "white",
          fontFamily: "Inter, sans-serif",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            fontSize: 28,
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: "#FF9F1C",
            fontWeight: 700,
          }}
        >
          Obermögersheim · Koderlauf
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 86, lineHeight: 0.95, fontWeight: 900 }}>Koderlauf 2027</div>
          <div style={{ fontSize: 42, color: "#E5E7EB" }}>Lauf mit Herz durch den Wald</div>
        </div>
      </div>
    ),
    size,
  );
}
