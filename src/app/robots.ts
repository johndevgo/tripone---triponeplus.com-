import type { MetadataRoute } from "next";
import { getAppUrl } from "@/lib/app-url";

export default function robots(): MetadataRoute.Robots {
  const origin = getAppUrl("https://tools.neurerohan.com.np");
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard/", "/onboarding/", "/preview/", "/tenant-sites/"],
    },
    sitemap: `${origin.replace(/\/$/, "")}/sitemap.xml`,
    host: origin,
  };
}
