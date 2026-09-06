import { buildRobots } from "@/lib/seo/site-files";
import { loadPublishedSite } from "@/lib/tenancy/published-site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hostname: string }> },
) {
  const { hostname } = await params;
  const published = await loadPublishedSite(hostname);
  if (!published)
    return new Response(buildRobots(`https://${hostname}`, false), {
      status: 404,
      headers: textHeaders,
    });
  const enabled = published.snapshot.site.seoSettings.indexingEnabled !== false;
  return new Response(
    buildRobots(`https://${published.primaryHostname}`, enabled),
    {
      headers: textHeaders,
    },
  );
}

const textHeaders = {
  "content-type": "text/plain; charset=utf-8",
  "cache-control":
    "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
};
