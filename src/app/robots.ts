import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/app-url";
import { createPublicClient } from "@/lib/supabase/public";

export const revalidate = 300;

export default async function robots(): Promise<MetadataRoute.Robots> {
  const origin = getAppUrl("https://tools.neurerohan.com.np");
  const sitemaps = [`${origin.replace(/\/$/, "")}/sitemap.xml`];
  try {
    const { data } = await createPublicClient().rpc(
      "list_published_site_slugs",
    );
    for (const item of (data ?? []) as Array<{ slug?: unknown }>) {
      if (
        typeof item.slug === "string" &&
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(item.slug)
      )
        sitemaps.push(
          `${origin.replace(/\/$/, "")}/s/${encodeURIComponent(item.slug)}/sitemap`,
        );
    }
  } catch {
    // Marketing pages stay discoverable during a transient database outage.
  }
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/onboarding/", "/preview/", "/tenant-sites/"],
    },
    sitemap: sitemaps,
    host: origin,
  };
}
