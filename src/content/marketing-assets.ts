import type { ThemeId } from "@/lib/types";

export const marketingImages = {
  ocean: "/images/marketing/ocean-hero.webp",
  mountain: "/images/marketing/mountain-trek.webp",
  safari: "/images/marketing/safari-dawn.webp",
  yacht: "/images/marketing/coastal-yacht.webp",
  diving: "/images/marketing/reef-diving.webp",
  guide: "/images/marketing/local-guide.webp",
  transfer: "/images/marketing/airport-transfer.webp",
  atv: "/images/marketing/desert-atv.webp",
  planning: "/images/marketing/travel-planning.webp",
  bhutanJeep: "/images/marketing/bhutan-jeep-tour.webp",
  bhutanTrekking: "/images/marketing/bhutan-trekking-vehicle.webp",
  mountainWellness: "/images/marketing/mountain-wellness-retreat.webp",
  mountainYoga: "/images/marketing/mountain-yoga-retreat.webp",
} as const;

export const themeMarketingImages: Record<ThemeId, string> = {
  horizon: marketingImages.ocean,
  "luxe-voyage": marketingImages.yacht,
  "wild-current": marketingImages.diving,
  atlas: marketingImages.guide,
  summit: marketingImages.mountain,
  marina: marketingImages.yacht,
  dune: marketingImages.atv,
  nomad: marketingImages.planning,
  urban: marketingImages.transfer,
  escape: marketingImages.planning,
};
