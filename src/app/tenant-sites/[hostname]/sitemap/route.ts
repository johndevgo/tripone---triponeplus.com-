import { buildSitemap } from "@/lib/seo/site-files";
import {
  loadPublishedSite,
  publishedSitemapEntries,
} from "@/lib/tenancy/published-site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hostname: string }> },
) {
  const { hostname } = await params;
  const published = await loadPublishedSite(hostname);
  if (!published) return new Response("Not found", { status: 404 });
  const { snapshot } = published;
  return new Response(
    buildSitemap(
      `https://${published.primaryHostname}`,
      publishedSitemapEntries(snapshot),
    ),
    {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
