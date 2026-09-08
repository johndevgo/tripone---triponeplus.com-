import { getAppUrl } from "@/lib/app-url";
import { buildSitemap } from "@/lib/seo/site-files";
import {
  loadPublishedSiteBySlug,
  publishedSitemapEntries,
} from "@/lib/tenancy/published-site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteSlug: string }> },
) {
  const { siteSlug } = await params;
  const snapshot = await loadPublishedSiteBySlug(siteSlug);
  if (!snapshot) return new Response("Not found", { status: 404 });
  const prefix = `/s/${encodeURIComponent(siteSlug)}`;
  return new Response(
    buildSitemap(getAppUrl(), publishedSitemapEntries(snapshot, prefix)),
    {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}
