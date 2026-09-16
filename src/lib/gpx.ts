export interface GpxPoint {
  lat: number;
  lon: number;
  ele: number;
}

export interface GpxTrack {
  name: string;
  points: GpxPoint[];
  distance: number;
  elevationGain: number;
  elevationLoss: number;
  minEle: number;
  maxEle: number;
}

export function parseGpx(xml: string): GpxTrack {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");

  const name =
    doc.querySelector("trk > name")?.textContent ||
    doc.querySelector("metadata > name")?.textContent ||
    "Strecke";

  const trkpts = doc.querySelectorAll("trkpt");
  const points: GpxPoint[] = [];

  trkpts.forEach((pt) => {
    const lat = parseFloat(pt.getAttribute("lat") || "0");
    const lon = parseFloat(pt.getAttribute("lon") || "0");
    const eleEl = pt.querySelector("ele");
    const ele = eleEl ? parseFloat(eleEl.textContent || "0") : 0;
    points.push({ lat, lon, ele });
  });

  let distance = 0;
  let elevationGain = 0;
  let elevationLoss = 0;
  let minEle = Infinity;
  let maxEle = -Infinity;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];
    if (p.ele < minEle) minEle = p.ele;
    if (p.ele > maxEle) maxEle = p.ele;

    if (i > 0) {
      const prev = points[i - 1];
      distance += haversine(prev.lat, prev.lon, p.lat, p.lon);
      const eleDiff = p.ele - prev.ele;
      if (eleDiff > 0) elevationGain += eleDiff;
      else elevationLoss += Math.abs(eleDiff);
    }
  }

  return {
    name,
    points,
    distance: Math.round(distance * 100) / 100,
    elevationGain: Math.round(elevationGain),
    elevationLoss: Math.round(elevationLoss),
    minEle: Math.round(minEle),
    maxEle: Math.round(maxEle),
  };
}

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

/** Cumulative distances along a GPX line (same idea as Turf `along` / `length`). */
export type TrackIndex = {
  points: GpxPoint[];
  cumKm: number[];
  totalKm: number;
};

export function buildTrackIndex(points: GpxPoint[]): TrackIndex {
  const cumKm: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    cumKm.push(cumKm[i - 1] + haversine(prev.lat, prev.lon, curr.lat, curr.lon));
  }
  return { points, cumKm, totalKm: cumKm[cumKm.length - 1] ?? 0 };
}

/** Point at `km` along the track (linear interpolation between GPX vertices). */
export function alongTrack(index: TrackIndex, km: number): GpxPoint & { km: number } {
  const { points, cumKm, totalKm } = index;
  if (points.length === 0) {
    return { lat: 0, lon: 0, ele: 0, km: 0 };
  }
  const d = Math.max(0, Math.min(km, totalKm));
  if (points.length === 1 || d <= 0) {
    return { ...points[0], km: 0 };
  }
  if (d >= totalKm) {
    return { ...points[points.length - 1], km: totalKm };
  }

  let lo = 0;
  let hi = cumKm.length - 1;
  while (lo < hi - 1) {
    const mid = (lo + hi) >> 1;
    if (cumKm[mid] <= d) lo = mid;
    else hi = mid;
  }

  const seg = cumKm[lo + 1] - cumKm[lo];
  const t = seg > 0 ? (d - cumKm[lo]) / seg : 0;
  const a = points[lo];
  const b = points[lo + 1];
  return {
    lat: a.lat + t * (b.lat - a.lat),
    lon: a.lon + t * (b.lon - a.lon),
    ele: a.ele + t * (b.ele - a.ele),
    km: d,
  };
}

/** Compass bearing in degrees (0 = north) from A to B. */
export function bearingDegrees(
  from: { lat: number; lon: number },
  to: { lat: number; lon: number },
): number {
  const φ1 = toRad(from.lat);
  const φ2 = toRad(to.lat);
  const Δλ = toRad(to.lon - from.lon);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Shortest-path interpolation between two bearings. */
export function lerpBearing(from: number, to: number, t: number): number {
  const clamped = Math.max(0, Math.min(1, t));
  const diff = ((to - from + 540) % 360) - 180;
  return (from + diff * clamped + 360) % 360;
}

export function toGeoJson(points: GpxPoint[]) {
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: points.map((p) => [p.lon, p.lat, p.ele]),
    },
  };
}

export function getElevationProfile(
  points: GpxPoint[],
  samples = 200
): { distance: number; elevation: number }[] {
  if (points.length === 0) return [];

  const totalDist: number[] = [0];
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    totalDist.push(
      totalDist[i - 1] + haversine(prev.lat, prev.lon, curr.lat, curr.lon)
    );
  }

  const maxDist = totalDist[totalDist.length - 1];
  const step = maxDist / samples;
  const profile: { distance: number; elevation: number }[] = [];

  let ptIdx = 0;
  for (let s = 0; s <= samples; s++) {
    const d = s * step;
    while (ptIdx < totalDist.length - 1 && totalDist[ptIdx + 1] < d) ptIdx++;

    if (ptIdx >= points.length - 1) {
      profile.push({ distance: d, elevation: points[points.length - 1].ele });
      continue;
    }

    const segDist = totalDist[ptIdx + 1] - totalDist[ptIdx];
    const t = segDist > 0 ? (d - totalDist[ptIdx]) / segDist : 0;
    const ele = points[ptIdx].ele + t * (points[ptIdx + 1].ele - points[ptIdx].ele);
    profile.push({ distance: d, elevation: ele });
  }

  return profile;
}
