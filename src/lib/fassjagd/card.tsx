import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import type { CSSProperties, ReactElement } from "react";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { cardVariant, gapHeadline, weekLine } from "@/lib/fassjagd/copy";

/* Satori/ImageResponse braucht <img>, nicht next/image. */
/* eslint-disable @next/next/no-img-element */

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
    publicDataUri("fassjagd-fass-blend.png", "image/png"),
  ]);
  return { forest, fass };
}

type FassLayout = "og" | "story" | "week";

const FASS_LAYOUT: Record<
  FassLayout,
  { box: number; right: number; bottom: number; glow: number }
> = {
  og: { box: 430, right: -64, bottom: -96, glow: 300 },
  story: { box: 560, right: -24, bottom: 400, glow: 400 },
  week: { box: 400, right: -56, bottom: -80, glow: 280 },
};

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

/** Preview-Team in der Wertung (nicht in der öffentlichen UI). */
export const DEMO_TEAM_CLUB: FassjagdClub = {
  name: "TV 1860 Gunzenhausen",
  slug: "tv-1860-gunzenhausen",
  total: 12,
  place: 1,
  ausgeschlossen: false,
  hausherr: false,
  trailSpielerei: 2,
  firstReg: 1,
  weekDelta: 3,
  flaming: true,
  gapToLeader: 0,
  gapToAbove: null,
  gapToBelow: 4,
  leadBy: 4,
  strecken: {},
  starters: [],
};

/** Preview 2. Platz — Gap zum Fass, nicht Hausherr. */
export const DEMO_PLACE2_CLUB: FassjagdClub = {
  name: "TV 1860 Gunzenhausen",
  slug: "tv-1860-gunzenhausen",
  total: 8,
  place: 2,
  ausgeschlossen: false,
  hausherr: false,
  trailSpielerei: 1,
  firstReg: 12,
  weekDelta: 0,
  flaming: false,
  gapToLeader: 5,
  gapToAbove: 4,
  gapToBelow: 2,
  leadBy: null,
  strecken: {},
  starters: [],
};

const flex: CSSProperties = { display: "flex" };

function FassPrize({ src, layout }: { src: string; layout: FassLayout }) {
  const { box, right, bottom, glow } = FASS_LAYOUT[layout];
  return (
    <div
      style={{
        ...flex,
        position: "absolute",
        right,
        bottom,
        width: box,
        height: box,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          ...flex,
          position: "absolute",
          width: glow,
          height: glow,
          borderRadius: 9999,
          background:
            "radial-gradient(circle, rgba(255,107,0,0.42) 0%, rgba(255,107,0,0.16) 38%, rgba(255,107,0,0) 72%)",
        }}
      />
      <img
        src={src}
        alt=""
        width={box}
        height={box}
        style={{
          width: box,
          height: box,
          objectFit: "contain",
        }}
      />
    </div>
  );
}

function ForestStage({
  size,
  forestSrc,
  fassSrc,
  fassLayout,
  objectPosition,
  children,
}: {
  size: { width: number; height: number };
  forestSrc: string;
  fassSrc: string;
  fassLayout: FassLayout;
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
      <FassPrize src={fassSrc} layout={fassLayout} />
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
  const week = weekLine(club);
  const pad = story ? 68 : 48;
  const longName = club.name.length > 20;
  const nameSize = story ? (longName ? 70 : 86) : longName ? 52 : 66;
  const kickerSize = story ? 32 : 26;
  const roleLabel = club.hausherr ? "HAUSHERR" : "TEAM";
  const textMax = story ? 980 : 720;

  return new ImageResponse(
    (
      <ForestStage
        size={size}
        forestSrc={forest}
        fassSrc={fass}
        fassLayout={story ? "story" : "og"}
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
                fontSize: story ? 36 : 24,
                color: "rgba(255,255,255,0.78)",
                fontWeight: 600,
                marginTop: 8,
              }}
            >
              Koderlauf · ein Fass Bier
            </div>
          </div>

          <div style={{ ...flex, flexDirection: "column", maxWidth: textMax, width: textMax }}>
            <div
              style={{
                ...flex,
                alignItems: "center",
                alignSelf: "flex-start",
                borderRadius: 999,
                background: club.hausherr ? "rgba(0,0,0,0.62)" : ORANGE,
                color: "white",
                padding: story ? "10px 22px" : "8px 18px",
                fontSize: story ? 26 : 20,
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
                lineHeight: 1.08,
                letterSpacing: -1.4,
                width: textMax,
                maxWidth: textMax,
                flexWrap: "wrap",
                marginTop: story ? 14 : 8,
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
                    fontSize: story ? 50 : 38,
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
                  fontSize: story ? 44 : 34,
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
                flexWrap: "wrap",
                maxWidth: textMax,
                borderRadius: 999,
                background: variant === "lead" ? ORANGE : "rgba(0,0,0,0.45)",
                color: variant === "lead" ? "white" : ORANGE_SOFT,
                border: variant === "lead" ? "none" : "1px solid rgba(255,107,0,0.45)",
                padding: story ? "16px 30px" : "12px 26px",
                fontSize: story ? (headline.length > 28 ? 34 : 40) : headline.length > 28 ? 26 : 30,
                fontWeight: 800,
              }}
            >
              {headline}
            </div>
            {week && !club.hausherr && (
              <div
                style={{
                  ...flex,
                  fontSize: story ? 30 : 24,
                  color: "rgba(255,255,255,0.78)",
                  fontWeight: 700,
                  marginTop: 12,
                }}
              >
                {week}
              </div>
            )}
            <div
              style={{
                ...flex,
                justifyContent: "space-between",
                marginTop: story ? 32 : 18,
                fontSize: story ? 28 : 22,
                color: "rgba(255,255,255,0.7)",
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
      <ForestStage
        size={size}
        forestSrc={forest}
        fassSrc={fass}
        fassLayout="week"
        objectPosition="50% 18%"
      >
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
          <div style={{ ...flex, flexDirection: "column", maxWidth: 760 }}>
            <div
              style={{
                ...flex,
                fontSize: 24,
                fontWeight: 800,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: ORANGE,
              }}
            >
              Fassjagd 2027 · Wochenstand
            </div>
            <div style={{ ...flex, fontSize: 48, fontWeight: 900, marginTop: 8 }}>
              Die ersten drei
            </div>
          </div>
          <div style={{ ...flex, flexDirection: "column", maxWidth: 760, width: 760 }}>
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
                  <div style={{ ...flex, fontSize: 34, fontWeight: 800, marginLeft: 16 }}>
                    {club.name}
                  </div>
                </div>
                <div style={{ ...flex, fontSize: 34, fontWeight: 900, color: ORANGE_SOFT }}>
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
              fontSize: 22,
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
