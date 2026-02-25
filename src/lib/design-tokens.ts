export const designTokens = {
  colors: {
    primaryKoderOrange: "#FF6B00",
    deepForestGreen: "#0A3D2A",
    lightForestGreen: "#1E8A6B",
    brightAccentOrange: "#FF9F1C",
    darkBackground: "#0A0A0A",
    lightBackground: "#F8F9FA",
    textPrimaryDark: "#FFFFFF",
    textSoftDark: "#E5E7EB",
    textSecondary: "#94A3B8",
    success: "#22C55E",
    error: "#EF4444",
  },
  radii: {
    card: "1.25rem",
    media: "1.75rem",
  },
} as const;

export type DesignTokens = typeof designTokens;
