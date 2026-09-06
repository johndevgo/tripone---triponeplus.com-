import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = (
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://triponeplus.com"
  ).replace(/\/$/, "");
  return ["", "/features", "/templates", "/pricing", "/privacy", "/terms"].map(
    (path) => ({
      url: `${origin}${path}`,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    }),
  );
}
