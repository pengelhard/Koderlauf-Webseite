import sharp from "sharp";
import type { FassjagdClub } from "@/lib/fassjagd/types";
import { fassjagdCardResponse } from "@/lib/fassjagd/card";

const MAX_BYTES = 280_000;

export async function fassjagdOgJpegResponse(club: FassjagdClub): Promise<Response> {
  const pngRes = await fassjagdCardResponse(club, "og");
  const png = Buffer.from(await pngRes.arrayBuffer());
  let quality = 72;
  let jpg = await sharp(png).jpeg({ quality, mozjpeg: true }).toBuffer();
  while (jpg.length > MAX_BYTES && quality > 40) {
    quality -= 8;
    jpg = await sharp(png).jpeg({ quality, mozjpeg: true }).toBuffer();
  }
  return new Response(jpg, {
    headers: {
      "Content-Type": "image/jpeg",
      "Cache-Control": "public, max-age=600, s-maxage=600",
    },
  });
}
