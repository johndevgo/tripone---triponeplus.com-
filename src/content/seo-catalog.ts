import { z } from "zod";
import generatedCatalog from "./seo-catalog.generated.json";
import { marketingImages } from "./marketing-assets";
import { resources } from "./resources";

const seoPageTypeSchema = z.enum([
  "Growth Service",
  "Industry",
  "Compare",
  "Resource",
  "Tool",
  "Blog",
]);

const seoPageSpecSchema = z.object({
  sn: z.number().int().positive(),
  pageType: seoPageTypeSchema,
  title: z.string().min(4),
  primaryKeyword: z.string().min(2),
  secondaryKeywords: z.array(z.string()).min(1),
  keywordCluster: z.string().min(2),
  path: z.string().regex(/^\/[a-z0-9/-]+$/),
  entities: z.array(z.string()).min(3),
  metaTitle: z.string().min(10),
  metaDescription: z.string().min(50),
  faqs: z.array(z.string()).min(3),
  intent: z.string().min(2),
  funnelStage: z.string().min(2),
  vertical: z.string().min(2),
  internalLinks: z.array(z.string()),
  inboundLinks: z.array(z.string()),
  contentAngle: z.string().min(10),
  cta: z.string().min(2),
  priority: z.string().min(2),
  demandSignal: z.string().min(2),
});

export type SeoPageType = z.infer<typeof seoPageTypeSchema>;
export type SeoPageSpec = z.infer<typeof seoPageSpecSchema>;

export const seoPages = z
  .array(seoPageSpecSchema)
  .length(138)
  .parse(generatedCatalog);

const serviceArtwork: Record<string, string> = {
  "/services/seo": "/images/service-art/travel-seo.webp",
  "/services/google-ads": "/images/service-art/google-ads.webp",
  "/services/meta-ads": "/images/service-art/meta-ads.webp",
  "/services/tiktok-ads": "/images/service-art/tiktok-ads.webp",
  "/services/social-media-marketing": "/images/service-art/social-media.webp",
  "/services/content-marketing": "/images/service-art/content-marketing.webp",
  "/services/creative-design": "/images/service-art/creative-design.webp",
  "/services/conversion-rate-optimisation":
    "/images/service-art/conversion-optimisation.webp",
  "/services/website-growth": "/images/service-art/website-growth.webp",
  "/services/analytics-tracking": "/images/service-art/analytics-tracking.webp",
  "/services/strategy-consulting":
    "/images/service-art/strategy-consulting.webp",
  "/services/email-marketing-crm": "/images/service-art/email-crm.webp",
  "/services/landing-pages-funnels": "/images/service-art/landing-pages.webp",
  "/services/reputation-review-growth":
    "/images/service-art/reputation-growth.webp",
  "/services/marketing-automation":
    "/images/service-art/marketing-automation.webp",
  "/services/brand-positioning": "/images/service-art/brand-positioning.webp",
};

const pagesByPath = new Map(seoPages.map((page) => [page.path, page]));

export const seoNamespaces = [
  "services",
  "for",
  "compare",
  "resources",
  "tools",
  "blog",
] as const;

export type SeoNamespace = (typeof seoNamespaces)[number];

export function getSeoPage(path: string) {
  return pagesByPath.get(normalizePath(path));
}

export function getSeoPages(namespace?: SeoNamespace) {
  if (!namespace) return seoPages;
  if (namespace === "for") {
    return seoPages.filter((page) => page.pageType === "Industry");
  }
  return seoPages.filter((page) => page.path.startsWith(`/${namespace}/`));
}

export function getSeoPageFromSlug(namespace: SeoNamespace, slug: string) {
  return getSeoPage(`/${namespace}/${slug}`);
}

export function getSeoPageSlug(page: SeoPageSpec) {
  return page.path.split("/").filter(Boolean).at(-1)!;
}

export function getSeoNamespace(page: SeoPageSpec): SeoNamespace {
  if (page.pageType === "Industry") return "for";
  return page.path.split("/").filter(Boolean)[0] as SeoNamespace;
}

const knownMarketingRoutes = new Set([
  "/",
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
  ...resources.map((resource) => `/resources/${resource.slug}`),
  ...seoPages.map((page) => page.path),
]);

const routeAliases: Record<string, string> = {
  "/platform": "/features",
  "/growth-services": "/services",
  "/growth-services/cro": "/services/conversion-rate-optimisation",
  "/growth-services/social-media": "/services/social-media-marketing",
  "/for/transfer-operators": "/for-transfer-operators",
  "/tools/utm-builder": "/tools/travel-utm-builder",
};

export type SeoEditorialLink = {
  href: string;
  label: string;
  description: string;
};

export function getSeoEditorialLinks(page: SeoPageSpec, limit = 6) {
  const links: SeoEditorialLink[] = [];
  const seen = new Set([page.path]);

  for (const requestedPath of page.internalLinks) {
    const href = resolveInternalPath(requestedPath);
    if (!href || seen.has(href)) continue;
    seen.add(href);
    const destination = getSeoPage(href);
    links.push({
      href,
      label: destination?.title ?? routeLabel(href),
      description:
        destination?.metaDescription ??
        `Continue with the TripOne+ ${routeLabel(href).toLowerCase()} overview.`,
    });
    if (links.length === limit) return links;
  }

  for (const destination of getRelatedSeoPages(page, limit)) {
    if (seen.has(destination.path)) continue;
    seen.add(destination.path);
    links.push({
      href: destination.path,
      label: destination.title,
      description: destination.metaDescription,
    });
    if (links.length === limit) break;
  }
  return links;
}

export function resolveInternalPath(path: string) {
  const normalized = normalizePath(path);
  const exactAlias = routeAliases[normalized];
  if (exactAlias) return exactAlias;
  if (normalized.startsWith("/platform/")) return "/features";
  if (normalized.startsWith("/growth-services/")) {
    const candidate = normalized.replace("/growth-services/", "/services/");
    return knownMarketingRoutes.has(candidate) ? candidate : "/services";
  }
  return knownMarketingRoutes.has(normalized) ? normalized : undefined;
}

export function getRelatedSeoPages(page: SeoPageSpec, limit = 6) {
  const ownEntities = new Set(
    page.entities.map((entity) => entity.toLowerCase()),
  );
  return seoPages
    .filter((candidate) => candidate.path !== page.path)
    .map((candidate) => ({
      candidate,
      score:
        Number(candidate.keywordCluster === page.keywordCluster) * 8 +
        Number(candidate.pageType === page.pageType) * 3 +
        candidate.entities.filter((entity) =>
          ownEntities.has(entity.toLowerCase()),
        ).length *
          2 +
        Number(page.internalLinks.includes(candidate.path)) * 12,
    }))
    .sort((a, b) => b.score - a.score || a.candidate.sn - b.candidate.sn)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
}

export function getSeoPageImage(page: SeoPageSpec) {
  const suppliedArtwork = serviceArtwork[page.path];
  if (suppliedArtwork) return suppliedArtwork;

  const context = [
    page.title,
    page.keywordCluster,
    page.vertical,
    ...page.entities,
  ]
    .join(" ")
    .toLowerCase();
  if (/safari|wildlife|jungle/.test(context))
    return marketingImages.jungleSafari;
  if (/diving|snork|reef/.test(context)) return marketingImages.diving;
  if (/boat|yacht|marine|water|raft/.test(context))
    return marketingImages.luxuryYacht;
  if (/trek|hiking|adventure|mountain/.test(context))
    return marketingImages.mountain;
  if (/wellness|retreat|yoga/.test(context)) return marketingImages.wellness;
  if (/food|culinary|market/.test(context)) return marketingImages.market;
  if (/culture|walking|city|local/.test(context)) return marketingImages.city;
  if (/transfer|vehicle|motorcycle|bike|rental/.test(context))
    return marketingImages.himalayanJeep;
  if (/desert|atv|buggy/.test(context)) return marketingImages.desert;
  if (/package|itinerary|agency|dmc/.test(context)) return marketingImages.rail;
  if (/creative|social|tiktok|meta ads/.test(context))
    return marketingImages.balloon;
  return [
    marketingImages.planning,
    marketingImages.beach,
    marketingImages.arctic,
    marketingImages.jungle,
  ][page.sn % 4]!;
}

export function getSeoPageImageAlt(page: SeoPageSpec) {
  if (serviceArtwork[page.path]) {
    return `TripOne+ ${page.title.toLowerCase()} capability artwork`;
  }
  return `Travel business scene supporting ${page.primaryKeyword} for ${page.vertical.toLowerCase()}`;
}

function normalizePath(path: string) {
  const normalized = `/${path.trim().replace(/^\/+|\/+$/g, "")}`;
  return normalized === "/" ? normalized : normalized.toLowerCase();
}

function routeLabel(path: string) {
  if (path === "/features") return "TripOne+ platform";
  return path
    .split("/")
    .filter(Boolean)
    .at(-1)!
    .split("-")
    .map((word) => `${word.charAt(0).toUpperCase()}${word.slice(1)}`)
    .join(" ");
}
