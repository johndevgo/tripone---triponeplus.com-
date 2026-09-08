import { getAppUrl } from "@/lib/app-url";
import { buildRobots } from "@/lib/seo/site-files";
import { loadPublishedSiteBySlug } from "@/lib/tenancy/published-site";

const textHeaders = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control":
    "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ siteSlug: string }> },
) {
  const { siteSlug } = await params;
  const snapshot = await loadPublishedSiteBySlug(siteSlug);
  const prefix = `/s/${encodeURIComponent(siteSlug)}`;
  if (!snapshot)
    return new Response(buildRobots(getAppUrl(), false), {
      status: 404,
      headers: textHeaders,
    });
  const enabled = snapshot.site.seoSettings.indexingEnabled !== false;
  return new Response(
    buildRobots(getAppUrl(), enabled, `${prefix}/sitemap`),
    { headers: textHeaders },
  );
}
