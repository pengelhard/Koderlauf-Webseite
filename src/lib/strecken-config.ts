export const STRECKEN_COLORS: Record<string, string> = {
  Kinderlauf: "#FF6B00",
  "Kurz und knackig": "#22C55E",
  Koderrunde: "#EAB308",
  Trailrun: "#3B82F6",
};

export const STRECKEN_BADGE_CLASSES: Record<string, string> = {
  Kinderlauf: "bg-koder-orange/10 text-koder-orange border-koder-orange/20",
  "Kurz und knackig": "bg-green-500/10 text-green-600 border-green-500/20",
  Koderrunde: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
  Trailrun: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

export function getStreckeColor(name: string): string {
  return STRECKEN_COLORS[name] || "#FF6B00";
}
