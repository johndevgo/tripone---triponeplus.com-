import type { Metadata } from "next";

type PublishedMetadataInput = {
  pageTitle: string;
  seo: Record<string, unknown>;
  publicBaseUrl: string;
  requestedPath: string;
  siteIndexingEnabled: boolean;
  defaultImage?: string | null;
  resourceImage?: string | null;
  favicon?: string | null;
};

export function createPublishedMetadata({
  pageTitle,
  seo,
  publicBaseUrl,
  requestedPath,
  siteIndexingEnabled,
  defaultImage,
  resourceImage,
  favicon,
}: PublishedMetadataInput): Metadata {
  const title = string(seo.title) || pageTitle;
  const description =
    string(seo.description) || string(seo.metaDescription) || undefined;
  const canonical = canonicalUrl(
    string(seo.canonicalOverride) ||
      string(seo.canonical) ||
      string(seo.canonicalPath),
    publicBaseUrl,
    requestedPath,
  );
  const socialTitle = string(seo.socialTitle) || string(seo.ogTitle) || title;
  const socialDescription =
    string(seo.socialDescription) || string(seo.ogDescription) || description;
  const image =
    safeHttpUrl(string(seo.socialImage) || string(seo.ogImage)) ||
    safeHttpUrl(resourceImage) ||
    safeHttpUrl(defaultImage);
  const index =
    siteIndexingEnabled && seo.indexable !== false && seo.noindex !== true;
  const follow = index && seo.follow !== false && seo.nofollow !== true;
  const noarchive = seo.noarchive === true;
  const noimageindex = seo.noimageindex === true;
  const nosnippet = seo.nosnippet === true;

  return {
    title,
    description,
    alternates: { canonical },
    icons: favicon ? { icon: favicon } : undefined,
    openGraph: {
      title: socialTitle,
      description: socialDescription,
      url: canonical,
      images: image ? [image] : undefined,
      type: "website",
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title: socialTitle,
      description: socialDescription,
      images: image ? [image] : undefined,
    },
    robots: {
      index,
      follow,
      noarchive,
      noimageindex,
      nosnippet,
      googleBot: { index, follow, noarchive, noimageindex, nosnippet },
    },
  };
}

export function canonicalUrl(
  override: string | undefined,
  publicBaseUrl: string,
  requestedPath: string,
) {
  const base = publicBaseUrl.replace(/\/$/, "");
  if (override) {
    const absolute = safeHttpUrl(override);
    if (absolute) return absolute;
    if (override.startsWith("/") && !override.startsWith("//"))
      return `${base}${override === "/" ? "" : override}`;
  }
  const path = requestedPath.startsWith("/")
    ? requestedPath
    : `/${requestedPath}`;
  return `${base}${path === "/" ? "" : path}`;
}

function safeHttpUrl(value?: string | null) {
  if (!value) return undefined;
  try {
    const parsed = new URL(value);
    return ["http:", "https:"].includes(parsed.protocol)
      ? parsed.href
      : undefined;
  } catch {
    return undefined;
  }
}

function string(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}
