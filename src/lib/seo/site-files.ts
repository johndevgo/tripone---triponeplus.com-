export function buildSitemap(
  host: string,
  paths: Array<{ path: string; updatedAt?: string }>,
) {
  const origin = host.replace(/\/$/, "");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${paths.map((item) => `\n  <url><loc>${escapeXml(`${origin}${item.path}`)}</loc>${item.updatedAt ? `<lastmod>${escapeXml(item.updatedAt)}</lastmod>` : ""}</url>`).join("")}\n</urlset>`;
}

export function buildRobots(
  host: string,
  indexingEnabled: boolean,
  sitemapPath = "/sitemap.xml",
) {
  const origin = host.replace(/\/$/, "");
  return indexingEnabled
    ? `User-agent: *\nAllow: /\nDisallow: /dashboard\nDisallow: /preview\nSitemap: ${origin}${sitemapPath.startsWith("/") ? sitemapPath : `/${sitemapPath}`}\n`
    : "User-agent: *\nDisallow: /\n";
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
