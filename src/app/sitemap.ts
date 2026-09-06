import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getAppUrl("https://tools.neurerohan.com.np");
  return ["", "/features", "/templates", "/pricing", "/privacy", "/terms"].map(
    (path) => ({
      url: `${origin}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    }),
  );
}
