import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_SITE_URL ?? "https://triponeplus.com";
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
