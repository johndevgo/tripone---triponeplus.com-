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
  summit: {
    id: "summit",
    name: "Summit",
    description: "Technical alpine confidence",
    font: "var(--font-geist-sans)",
    headingFont: "var(--font-geist-sans)",
    colors: {
      primary: "#18352F",
      secondary: "#657C70",
      accent: "#E86F3D",
      background: "#F2F1EB",
      surface: "#FCFBF6",
      text: "#14231F",
      muted: "#65726D",
    },
    radius: "0.25rem",
    buttonStyle: "solid",
    imageTreatment: "high-contrast",
    headerStyle: "expedition",
    spacingCharacter: "compact",
    sectionStyle: "layered",
    headingWeight: 800,
    baseTextScale: "compact",
    cardBorder: "strong",
    shadowStrength: "none",
    contentWidth: "wide",
    headerHeight: "compact",
  },
  marina: {
    id: "marina",
    name: "Marina",
    description: "Bright coastal leisure",
    font: "var(--font-geist-sans)",
    headingFont: "var(--font-geist-sans)",
    colors: {
      primary: "#064E63",
      secondary: "#0891B2",
      accent: "#F4B860",
      background: "#F2FAFC",
      surface: "#FFFFFF",
      text: "#083344",
      muted: "#56747D",
    },
    radius: "2rem",
    buttonStyle: "pill",
    imageTreatment: "soft-rounded",
    headerStyle: "floating",
    spacingCharacter: "airy",
    sectionStyle: "clean",
    headingWeight: 700,
    baseTextScale: "standard",
    cardBorder: "none",
    shadowStrength: "soft",
    contentWidth: "wide",
    headerHeight: "standard",
  },
  dune: {
    id: "dune",
    name: "Dune",
    description: "Warm cinematic desert journeys",
    font: "var(--font-geist-sans)",
    headingFont: "Georgia, serif",
    colors: {
      primary: "#3F2A20",
      secondary: "#9B6848",
      accent: "#D99B45",
      background: "#F6EFE5",
      surface: "#FFF9F0",
      text: "#2C211B",
      muted: "#78685D",
    },
    radius: "0.75rem",
    buttonStyle: "outline",
    imageTreatment: "cinematic",
    headerStyle: "classic",
    spacingCharacter: "airy",
    sectionStyle: "editorial",
    headingWeight: 600,
    baseTextScale: "large",
    cardBorder: "subtle",
    shadowStrength: "soft",
    contentWidth: "standard",
    headerHeight: "tall",
  },
  nomad: {
    id: "nomad",
    name: "Nomad",
    description: "Editorial routes and local stories",
    font: "var(--font-geist-sans)",
    headingFont: "Georgia, serif",
    colors: {
      primary: "#27332B",
      secondary: "#6F7B54",
      accent: "#C87045",
      background: "#F4F2E9",
      surface: "#FCFAF3",
      text: "#222820",
      muted: "#6D7168",
    },
    radius: "0rem",
    buttonStyle: "outline",
    imageTreatment: "editorial",
    headerStyle: "minimal",
    spacingCharacter: "balanced",
    sectionStyle: "editorial",
    headingWeight: 500,
    baseTextScale: "standard",
    cardBorder: "none",
    shadowStrength: "none",
    contentWidth: "narrow",
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
