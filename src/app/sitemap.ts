import type { MetadataRoute } from "next";
import {
  resourceCategories,
  resourceCategorySlugs,
  resources,
} from "@/content/resources";
import {
  getSeoPageImage,
  seoNamespaces,
  seoPages,
} from "@/content/seo-catalog";
import { getAppUrl } from "@/lib/app-url";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = getAppUrl("https://triponeplus.com").replace(/\/$/, "");
  const marketingPages = [
    "",
    "/features",
    "/growth-services",
    "/templates",
    "/pricing",
    "/resources",
    "/services",
    "/for",
    "/compare",
    "/tools",
    "/blog",
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
  const resourceCollections = resourceCategories.map(
    (category): MetadataRoute.Sitemap[number] => ({
      url: `${origin}/resources/category/${resourceCategorySlugs[category]}`,
      changeFrequency: "monthly",
      priority: 0.76,
    }),
  );
  const seoHubs = seoNamespaces.map(
    (namespace): MetadataRoute.Sitemap[number] => ({
      url: `${origin}/${namespace}`,
      changeFrequency: "weekly",
      priority: 0.82,
    }),
  );
  const seoCatalogPages = seoPages.map(
    (page): MetadataRoute.Sitemap[number] => ({
      url: `${origin}${page.path}`,
      lastModified: "2026-09-20",
      changeFrequency: page.pageType === "Blog" ? "monthly" : "weekly",
      priority:
        page.priority === "P0" ? 0.86 : page.priority === "P1" ? 0.78 : 0.7,
      images: [`${origin}${getSeoPageImage(page)}`],
    }),
  );
  const unique = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [
    ...marketingPages,
    ...resourceCollections,
    ...resourcePages,
    ...seoHubs,
    ...seoCatalogPages,
  ])
    unique.set(entry.url, entry);
  return [...unique.values()];
}
