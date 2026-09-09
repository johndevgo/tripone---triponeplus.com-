import type { MetadataRoute } from "next";
import { resources } from "@/content/resources";
import { getAppUrl } from "@/lib/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getAppUrl("https://tools.neurerohan.com.np").replace(
    /\/$/,
    "",
  );
  const marketingPages = [
    "",
    "/features",
    "/templates",
    "/pricing",
    "/resources",
  ].map((path): MetadataRoute.Sitemap[number] => ({
    url: `${origin}${path}`,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : path === "/resources" ? 0.8 : 0.7,
  }));
  const resourcePages = resources.map(
    (article): MetadataRoute.Sitemap[number] => ({
      url: `${origin}/resources/${article.slug}`,
      lastModified: article.updatedAt,
      changeFrequency: "monthly",
      priority: 0.72,
      images: [`${origin}${article.image}`],
    }),
  );
  return [...marketingPages, ...resourcePages];
}
