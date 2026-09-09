import type { ThemeId } from "@/lib/types";

export const marketingImages = {
  ocean: "/images/marketing/ocean-hero.webp",
  mountain: "/images/marketing/mountain-trek.webp",
  safari: "/images/marketing/safari-dawn.webp",
  yacht: "/images/marketing/coastal-yacht.webp",
  diving: "/images/marketing/reef-diving.webp",
  guide: "/images/marketing/local-guide.webp",
} as const;

export const themeMarketingImages: Record<ThemeId, string> = {
  horizon: marketingImages.ocean,
  "luxe-voyage": marketingImages.yacht,
  "wild-current": marketingImages.diving,
  atlas: marketingImages.guide,
  summit: marketingImages.mountain,
  marina: marketingImages.yacht,
  dune: marketingImages.safari,
  nomad: marketingImages.guide,
};
