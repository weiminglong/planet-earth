type ThemePalette = {
  accent: string;
  accentSoft: string;
  glow: string;
  surface: string;
  border: string;
};

const palettes: Record<string, ThemePalette> = {
  "lush-green": {
    accent: "#6ee7b7",
    accentSoft: "#d1fae5",
    glow: "#34d399",
    surface: "rgba(16, 185, 129, 0.16)",
    border: "rgba(110, 231, 183, 0.32)",
  },
  "golden-warm": {
    accent: "#fbbf24",
    accentSoft: "#fde68a",
    glow: "#f59e0b",
    surface: "rgba(245, 158, 11, 0.16)",
    border: "rgba(251, 191, 36, 0.32)",
  },
  "blush-spring": {
    accent: "#f9a8d4",
    accentSoft: "#fbcfe8",
    glow: "#ec4899",
    surface: "rgba(236, 72, 153, 0.16)",
    border: "rgba(249, 168, 212, 0.32)",
  },
  "teal-wetland": {
    accent: "#5eead4",
    accentSoft: "#ccfbf1",
    glow: "#14b8a6",
    surface: "rgba(20, 184, 166, 0.18)",
    border: "rgba(94, 234, 212, 0.3)",
  },
  "misty-violet": {
    accent: "#c4b5fd",
    accentSoft: "#ddd6fe",
    glow: "#8b5cf6",
    surface: "rgba(139, 92, 246, 0.18)",
    border: "rgba(196, 181, 253, 0.3)",
  },
  "crimson-alpine": {
    accent: "#fda4af",
    accentSoft: "#ffe4e6",
    glow: "#fb7185",
    surface: "rgba(251, 113, 133, 0.16)",
    border: "rgba(253, 164, 175, 0.3)",
  },
  "sunset-fynbos": {
    accent: "#fb923c",
    accentSoft: "#ffedd5",
    glow: "#f97316",
    surface: "rgba(249, 115, 22, 0.17)",
    border: "rgba(251, 146, 60, 0.3)",
  },
  "earth-desert": {
    accent: "#eab308",
    accentSoft: "#fef3c7",
    glow: "#ca8a04",
    surface: "rgba(202, 138, 4, 0.18)",
    border: "rgba(234, 179, 8, 0.3)",
  },
  "indigo-night": {
    accent: "#a5b4fc",
    accentSoft: "#c7d2fe",
    glow: "#818cf8",
    surface: "rgba(99, 102, 241, 0.18)",
    border: "rgba(165, 180, 252, 0.3)",
  },
};

export function getVisualTheme(input?: string | null) {
  if (!input) {
    return palettes["indigo-night"];
  }

  return palettes[input] ?? palettes["indigo-night"];
}

export function getFloraPalette(flora: {
  slug: string;
  visualTheme?: string | null;
  primaryRegion?: { slug: string } | null;
}) {
  if (flora.visualTheme) {
    return getVisualTheme(flora.visualTheme);
  }

  if (flora.slug.includes("prunus") || flora.primaryRegion?.slug === "japan") {
    return palettes["blush-spring"];
  }

  if (
    flora.slug.includes("olea") ||
    flora.primaryRegion?.slug === "mediterranean-region"
  ) {
    return palettes["golden-warm"];
  }

  if (
    flora.slug.includes("victoria") ||
    flora.primaryRegion?.slug === "amazon-basin"
  ) {
    return palettes["lush-green"];
  }

  return palettes["indigo-night"];
}
