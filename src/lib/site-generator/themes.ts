import type { ThemeId } from "@/lib/types";

export type ThemeTokens = {
  id: ThemeId;
  name: string;
  description: string;
  font: string;
  headingFont: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    muted: string;
  };
  radius: string;
  buttonStyle: "solid" | "pill" | "outline";
  imageTreatment: string;
  headerStyle: string;
  spacingCharacter: "compact" | "balanced" | "airy";
  sectionStyle: "clean" | "editorial" | "layered";
  headingWeight: 500 | 600 | 700 | 800;
  baseTextScale: "compact" | "standard" | "large";
  cardBorder: "none" | "subtle" | "strong";
  shadowStrength: "none" | "soft" | "medium";
  contentWidth: "narrow" | "standard" | "wide";
  headerHeight: "compact" | "standard" | "tall";
};

export const themes: Record<ThemeId, ThemeTokens> = {
  horizon: {
    id: "horizon",
    name: "Horizon",
    description: "Immersive and image-led",
    font: "var(--font-geist-sans)",
    headingFont: "var(--font-geist-sans)",
    colors: {
      primary: "#063D2E",
      secondary: "#087A5A",
      accent: "#F5A623",
      background: "#F7FAF9",
      surface: "#FFFFFF",
      text: "#022C22",
      muted: "#587168",
    },
    radius: "1.25rem",
    buttonStyle: "solid",
    imageTreatment: "cinematic",
    headerStyle: "floating",
    spacingCharacter: "airy",
    sectionStyle: "layered",
    headingWeight: 700,
    baseTextScale: "standard",
    cardBorder: "subtle",
    shadowStrength: "soft",
    contentWidth: "wide",
    headerHeight: "standard",
  },
  "luxe-voyage": {
    id: "luxe-voyage",
    name: "Luxe Voyage",
    description: "Refined editorial luxury",
    font: "var(--font-geist-sans)",
    headingFont: "Georgia, serif",
    colors: {
      primary: "#1D2A25",
      secondary: "#6B5B45",
      accent: "#C69B55",
      background: "#F8F5EF",
      surface: "#FFFCF6",
      text: "#181C1A",
      muted: "#746F66",
    },
    radius: "0.25rem",
    buttonStyle: "outline",
    imageTreatment: "editorial",
    headerStyle: "classic",
    spacingCharacter: "airy",
    sectionStyle: "editorial",
    headingWeight: 500,
    baseTextScale: "large",
    cardBorder: "subtle",
    shadowStrength: "none",
    contentWidth: "standard",
    headerHeight: "tall",
  },
  "wild-current": {
    id: "wild-current",
    name: "Wild Current",
    description: "Bold outdoor energy",
    font: "var(--font-geist-sans)",
    headingFont: "var(--font-geist-sans)",
    colors: {
      primary: "#132D24",
      secondary: "#D6532E",
      accent: "#F0B429",
      background: "#EEF2E8",
      surface: "#FFFFFF",
      text: "#102019",
      muted: "#52635C",
    },
    radius: "0.75rem",
    buttonStyle: "solid",
    imageTreatment: "high-contrast",
    headerStyle: "bold",
    spacingCharacter: "compact",
    sectionStyle: "layered",
    headingWeight: 800,
    baseTextScale: "standard",
    cardBorder: "strong",
    shadowStrength: "medium",
    contentWidth: "wide",
    headerHeight: "compact",
  },
  atlas: {
    id: "atlas",
    name: "Atlas",
    description: "Clean modern minimalism",
    font: "var(--font-geist-sans)",
    headingFont: "var(--font-geist-sans)",
    colors: {
      primary: "#123B4A",
      secondary: "#3F7181",
      accent: "#E59D40",
      background: "#F5F7F7",
      surface: "#FFFFFF",
      text: "#15282F",
      muted: "#60737A",
    },
    radius: "0.875rem",
    buttonStyle: "pill",
    imageTreatment: "natural",
    headerStyle: "minimal",
    spacingCharacter: "balanced",
    sectionStyle: "clean",
    headingWeight: 600,
    baseTextScale: "compact",
    cardBorder: "subtle",
    shadowStrength: "soft",
    contentWidth: "standard",
    headerHeight: "standard",
  },
};

export function getTheme(
  id: ThemeId,
  brand?: Partial<ThemeTokens["colors"]>,
): ThemeTokens {
  const selected = themes[id] ?? themes.horizon;
  return { ...selected, colors: { ...selected.colors, ...brand } };
}
