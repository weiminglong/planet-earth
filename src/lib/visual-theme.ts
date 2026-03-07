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

  if (flora.slug.includes("olea") || flora.primaryRegion?.slug === "mediterranean-region") {
    return palettes["golden-warm"];
  }

  if (flora.slug.includes("victoria") || flora.primaryRegion?.slug === "amazon-basin") {
    return palettes["lush-green"];
  }

  return palettes["indigo-night"];
}
