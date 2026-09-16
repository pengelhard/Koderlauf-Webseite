import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties, ReactElement } from "react";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { cardVariant, gapHeadline, gapLine, weekLine } from "@/lib/fassjagd/copy";

export const OG_SIZE = { width: 1200, height: 630 };
export const STORY_SIZE = { width: 1080, height: 1920 };

const ORANGE = "#FF6B00";
const ORANGE_SOFT = "#FF9F1C";

const uriCache = new Map<string, string>();

async function publicDataUri(filename: string, mime: string): Promise<string> {
  const hit = uriCache.get(filename);
  if (hit) return hit;
  const buf = await readFile(join(process.cwd(), "public", filename));
  const uri = `data:${mime};base64,${buf.toString("base64")}`;
  uriCache.set(filename, uri);
  return uri;
}

async function cardAssets() {
  const [forest, fass] = await Promise.all([
    publicDataUri("fassjagd-wald.jpg", "image/jpeg"),
    publicDataUri("fassjagd-fass-card.png", "image/png"),
  ]);
  return { forest, fass };
}

export const EMPTY_FASSJAGD_CLUB: FassjagdClub = {
  name: "Fassjagd",
  slug: "fassjagd",
  total: 0,
  place: null,
  ausgeschlossen: false,
  hausherr: false,
  trailSpielerei: 0,
  firstReg: Number.POSITIVE_INFINITY,
  weekDelta: 0,
  flaming: false,
  gapToLeader: 0,
  gapToAbove: null,
  gapToBelow: null,
  leadBy: null,
  strecken: {},
  starters: [],
};

const flex: CSSProperties = { display: "flex" };

function ForestStage({
  size,
  forestSrc,
  objectPosition,
  children,
}: {
  size: { width: number; height: number };
  forestSrc: string;
  objectPosition: string;
  children: ReactElement;
}) {
  return (
    <div
      style={{
        ...flex,
        width: "100%",
        height: "100%",
        position: "relative",
        overflow: "hidden",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <img
        src={forestSrc}
        alt=""
        width={size.width}
        height={size.height}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: size.height,
          objectFit: "cover",
          objectPosition,
        }}
      />
      <div
        style={{
          ...flex,
          position: "absolute",
          top: 0,
          left: 0,
          width: size.width,
          height: Math.round(size.height * 0.36),
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.78) 0%, rgba(0,0,0,0.28) 58%, transparent 100%)",
        }}
      />
      <div
        style={{
          ...flex,
          position: "absolute",
          bottom: 0,
          left: 0,
          width: size.width,
          height: Math.round(size.height * 0.62),
          background:
            "linear-gradient(0deg, rgba(5,8,6,0.96) 0%, rgba(8,10,8,0.78) 38%, rgba(8,10,8,0.22) 72%, transparent 100%)",
        }}
      />
      <div
        style={{
          ...flex,
          position: "absolute",
          top: 0,
          left: 0,
          width: 8,
          height: size.height,
          background: ORANGE,
        }}
      />
      {children}
    </div>
  );
}

export async function fassjagdCardResponse(club: FassjagdClub, format: "og" | "story") {
  const { forest, fass } = await cardAssets();
  const size = format === "story" ? STORY_SIZE : OG_SIZE;
  const story = format === "story";
  const variant = cardVariant(club);
  const place = club.place ?? "–";
  const headline = gapHeadline(club);
  const sub = gapLine(club);
  const week = weekLine(club);
  const pad = story ? 72 : 52;
  const longName = club.name.length > 22;
  const nameSize = story ? (longName ? 58 : 74) : longName ? 42 : 54;
  const kickerSize = story ? 26 : 20;
  const fassSize = story ? 168 : 118;
  const roleLabel = club.hausherr ? "HAUSHERR" : "TEAM";

  return new ImageResponse(
    (
      <ForestStage
        size={size}
        forestSrc={forest}
        objectPosition={story ? "50% 42%" : "50% 20%"}
      >
        <div
          style={{
            ...flex,
            position: "relative",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: pad,
          }}
        >
          <div
            style={{
              ...flex,
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <div style={{ ...flex, flexDirection: "column" }}>
              <div
                style={{
                  ...flex,
                  fontSize: kickerSize,
                  fontWeight: 800,
                  letterSpacing: story ? 8 : 6,
                  textTransform: "uppercase",
                  color: ORANGE,
                }}
              >
                Fassjagd 2027
              </div>
              <div
                style={{
                  ...flex,
                  fontSize: story ? 30 : 20,
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 600,
                  marginTop: 8,
                }}
              >
                Koderlauf · ein Fass Bier
              </div>
            </div>
            <img
              src={fass}
              alt=""
              width={fassSize}
              height={fassSize}
              style={{
                width: fassSize,
                height: fassSize,
                objectFit: "contain",
              }}
            />
          </div>

          <div style={{ ...flex, flexDirection: "column" }}>
            <div
              style={{
                ...flex,
                alignItems: "center",
                alignSelf: "flex-start",
                borderRadius: 999,
                background: club.hausherr ? "rgba(255,255,255,0.14)" : "rgba(255,107,0,0.18)",
                color: club.hausherr ? "rgba(255,255,255,0.9)" : ORANGE_SOFT,
                padding: story ? "8px 18px" : "6px 14px",
                fontSize: story ? 20 : 15,
                fontWeight: 800,
                letterSpacing: 3,
              }}
            >
              {roleLabel}
            </div>
            <div
              style={{
                ...flex,
                fontSize: nameSize,
                fontWeight: 900,
                lineHeight: 1.05,
                letterSpacing: -1.4,
                maxWidth: "96%",
                marginTop: story ? 16 : 10,
                textShadow: "0 3px 22px rgba(0,0,0,0.55)",
              }}
            >
              {club.name}
            </div>
            <div style={{ ...flex, marginTop: story ? 22 : 14, alignItems: "center" }}>
              {!club.hausherr && (
                <div
                  style={{
                    ...flex,
                    fontSize: story ? 40 : 30,
                    fontWeight: 800,
                    color: ORANGE_SOFT,
                  }}
                >
                  Platz {place}
                </div>
              )}
              <div
                style={{
                  ...flex,
                  fontSize: story ? 34 : 24,
                  color: "rgba(255,255,255,0.86)",
                  fontWeight: 700,
                  marginLeft: club.hausherr ? 0 : 16,
                }}
              >
                {club.total} Starter
              </div>
            </div>
            <div
              style={{
                ...flex,
                marginTop: story ? 22 : 16,
                alignItems: "center",
                alignSelf: "flex-start",
                borderRadius: 999,
                background: variant === "lead" ? ORANGE : "rgba(0,0,0,0.45)",
                color: variant === "lead" ? "white" : ORANGE_SOFT,
                border: variant === "lead" ? "none" : "1px solid rgba(255,107,0,0.45)",
                padding: story ? "14px 28px" : "10px 22px",
                fontSize: story ? 32 : 24,
                fontWeight: 800,
              }}
            >
              {headline}
            </div>
            {week && !club.hausherr && (
              <div
                style={{
                  ...flex,
                  fontSize: story ? 26 : 20,
                  color: "rgba(255,255,255,0.78)",
                  fontWeight: 700,
                  marginTop: 12,
                }}
              >
                {week}
              </div>
            )}
            {club.hausherr && (
              <div
                style={{
                  ...flex,
                  fontSize: story ? 26 : 20,
                  color: "rgba(255,255,255,0.72)",
                  fontWeight: 600,
                  marginTop: 12,
                }}
              >
                {sub}
              </div>
            )}
            <div
              style={{
                ...flex,
                justifyContent: "space-between",
                marginTop: story ? 36 : 22,
                fontSize: story ? 22 : 18,
                color: "rgba(255,255,255,0.55)",
                fontWeight: 600,
                letterSpacing: 0.6,
              }}
            >
              <div style={flex}>koderlauf.de/fassjagd/{club.slug}</div>
              <div style={flex}>Teamwertung</div>
            </div>
          </div>
        </div>
      </ForestStage>
    ),
    { ...size },
  );
}

export async function fassjagdWeekResponse(top: FassjagdClub[]) {
  const { forest, fass } = await cardAssets();
  const rows = top.slice(0, 3);
  const size = OG_SIZE;

  return new ImageResponse(
    (
      <ForestStage size={size} forestSrc={forest} objectPosition="50% 18%">
        <div
          style={{
            ...flex,
            position: "relative",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
            padding: 52,
          }}
        >
          <div style={{ ...flex, justifyContent: "space-between", alignItems: "flex-start" }}>
            <div style={{ ...flex, flexDirection: "column" }}>
              <div
                style={{
                  ...flex,
                  fontSize: 20,
                  fontWeight: 800,
                  letterSpacing: 6,
                  textTransform: "uppercase",
                  color: ORANGE,
                }}
              >
                Fassjagd 2027 · Wochenstand
              </div>
              <div style={{ ...flex, fontSize: 42, fontWeight: 900, marginTop: 8 }}>
                Top 3 auf dem Fass
              </div>
            </div>
            <img
              src={fass}
              alt=""
              width={110}
              height={110}
              style={{ width: 110, height: 110, objectFit: "contain" }}
            />
          </div>
          <div style={{ ...flex, flexDirection: "column" }}>
            {rows.map((club, i) => (
              <div
                key={club.slug}
                style={{
                  ...flex,
                  justifyContent: "space-between",
                  alignItems: "center",
                  background: i === 0 ? "rgba(255,107,0,0.32)" : "rgba(0,0,0,0.42)",
                  border: i === 0 ? "1px solid rgba(255,159,28,0.55)" : "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 20,
                  padding: "16px 22px",
                  marginTop: i === 0 ? 0 : 14,
                }}
              >
                <div style={{ ...flex, alignItems: "center" }}>
                  <div
                    style={{
                      ...flex,
                      width: 48,
                      height: 48,
                      borderRadius: 999,
                      background: i === 0 ? ORANGE : "#222",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 900,
                      fontSize: 22,
                    }}
                  >
                    {i + 1}
                  </div>
                  <div style={{ ...flex, fontSize: 30, fontWeight: 800, marginLeft: 16 }}>
                    {club.name}
                  </div>
                </div>
                <div style={{ ...flex, fontSize: 30, fontWeight: 900, color: ORANGE_SOFT }}>
                  {club.total}
                </div>
              </div>
            ))}
            {rows.length === 0 && (
              <div
                style={{
                  ...flex,
                  fontSize: 26,
                  fontWeight: 700,
                  color: "rgba(255,255,255,0.75)",
                }}
              >
                Noch keine Teams in der Wertung
              </div>
            )}
          </div>
          <div
            style={{
              ...flex,
              justifyContent: "space-between",
              fontSize: 18,
              color: "rgba(255,255,255,0.55)",
              fontWeight: 600,
            }}
          >
            <div style={flex}>koderlauf.de/fassjagd</div>
            <div style={flex}>Verein · Firma · Gruppe</div>
          </div>
        </div>
      </ForestStage>
    ),
    { ...size },
  );
}
