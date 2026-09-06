import { buildSitemap } from "@/lib/seo/site-files";
import { loadPublishedSite } from "@/lib/tenancy/published-site";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hostname: string }> },
) {
  const { hostname } = await params;
  const published = await loadPublishedSite(hostname);
  if (!published) return new Response("Not found", { status: 404 });
  const { snapshot } = published;
  const paths: Array<{ path: string; updatedAt?: string }> = [];
  for (const page of snapshot.pages) {
    if (page.seo_settings.indexable === false) continue;
    paths.push({
      path: page.slug ? `/${page.slug.replace(/^\/+/, "")}` : "/",
      updatedAt: page.updated_at,
    });
  }
  for (const experience of snapshot.experiences) {
    if (experience.seo_settings.indexable === false) continue;
    paths.push({
      path: `/experiences/${experience.slug}`,
      updatedAt: experience.updated_at,
    });
  }
  for (const location of snapshot.locations) {
    if (typeof location.slug !== "string") continue;
    const seo = object(location.seo_settings);
    if (seo.indexable === false) continue;
    paths.push({
      path: `/locations/${location.slug}`,
      updatedAt:
        typeof location.updated_at === "string"
          ? location.updated_at
          : undefined,
    });
  }
  return new Response(
    buildSitemap(`https://${published.primaryHostname}`, dedupe(paths)),
    {
      headers: {
        "content-type": "application/xml; charset=utf-8",
        "cache-control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=3600",
      },
    },
  );
}

function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function dedupe(paths: Array<{ path: string; updatedAt?: string }>) {
  return [...new Map(paths.map((item) => [item.path, item])).values()];
}
