import { getAppUrl } from "@/lib/app-url";

export type DomainCandidate = {
  hostname: string;
  verification_status: string;
  is_primary: boolean;
};

export function fallbackSitePath(siteSlug: string) {
  return `/s/${encodeURIComponent(siteSlug)}`;
}

export function fallbackSiteUrl(siteSlug: string, origin = getAppUrl()) {
  return `${origin}${fallbackSitePath(siteSlug)}`;
}

export function currentPublicSiteUrl(
  siteSlug: string,
  domains: DomainCandidate[] = [],
  origin = getAppUrl(),
) {
  const verified = domains
    .filter((domain) => domain.verification_status === "verified")
    .sort(
      (left, right) => Number(right.is_primary) - Number(left.is_primary),
    )[0];
  return verified
    ? `https://${verified.hostname}`
    : fallbackSiteUrl(siteSlug, origin);
}
