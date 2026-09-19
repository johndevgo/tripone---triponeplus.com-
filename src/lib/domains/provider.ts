import "server-only";
import { getDnsFallback } from "./validation";

export type VerificationRecord = {
  type: string;
  domain: string;
  value: string;
  reason?: string;
};

export type DomainProviderResult = {
  configured: boolean;
  projectVerified: boolean;
  dnsConfigured: boolean;
  verified: boolean;
  records: VerificationRecord[];
  dns: ReturnType<typeof getDnsFallback>;
  raw?: Record<string, unknown>;
};

type VercelDomain = {
  verified?: boolean;
  verification?: Array<{
    type?: unknown;
    domain?: unknown;
    value?: unknown;
    reason?: unknown;
  }>;
  [key: string]: unknown;
};

type VercelDomainConfiguration = {
  misconfigured?: boolean;
  recommendedCNAME?: Array<{ value?: unknown; rank?: unknown }>;
  recommendedIPv4?: Array<{ value?: unknown; rank?: unknown }>;
  [key: string]: unknown;
};

export function isDomainProviderConfigured() {
  return Boolean(process.env.VERCEL_TOKEN && process.env.VERCEL_PROJECT_ID);
}

export async function addProviderDomain(
  hostname: string,
): Promise<DomainProviderResult> {
  if (!isDomainProviderConfigured()) return unconfigured(hostname);
  return requestDomain(hostname, "add");
}

export async function verifyProviderDomain(
  hostname: string,
): Promise<DomainProviderResult> {
  if (!isDomainProviderConfigured()) return unconfigured(hostname);
  return requestDomain(hostname, "verify");
}

export async function removeProviderDomain(hostname: string) {
  if (!isDomainProviderConfigured()) return;
  const response = await fetch(
    vercelUrl(`/domains/${encodeURIComponent(hostname)}`, "v9"),
    {
      method: "DELETE",
      headers: authHeaders(),
      cache: "no-store",
    },
  );
  if (!response.ok && response.status !== 404)
    throw new Error(await providerError(response));
}

async function requestDomain(hostname: string, mode: "add" | "verify") {
  const endpoint =
    mode === "add"
      ? vercelUrl("/domains", "v10")
      : vercelUrl(`/domains/${encodeURIComponent(hostname)}/verify`, "v9");
  const response = await fetch(endpoint, {
    method: "POST",
    headers: { ...authHeaders(), "content-type": "application/json" },
    body: mode === "add" ? JSON.stringify({ name: hostname }) : undefined,
    cache: "no-store",
  });
  if (!response.ok) {
    const message = await providerError(response);
    // Vercel can answer a manual verify request with 400 while DNS is still
    // propagating. The project-domain and config endpoints remain the source
    // of truth, so refresh those instead of turning an expected pending state
    // into a destructive-looking error for the customer.
    if ((mode === "add" || mode === "verify") && response.status === 400) {
      const existing = await getProjectDomain(hostname);
      if (existing) return domainResult(hostname, existing);
    }
    throw new Error(message);
  }
  const raw = (await response.json()) as VercelDomain;
  return domainResult(hostname, raw);
}

async function getProjectDomain(hostname: string) {
  const response = await fetch(
    vercelUrl(`/domains/${encodeURIComponent(hostname)}`, "v9"),
    { headers: authHeaders(), cache: "no-store" },
  );
  if (response.status === 404) return null;
  if (!response.ok) throw new Error(await providerError(response));
  return (await response.json()) as VercelDomain;
}

async function domainResult(
  hostname: string,
  projectDomain: VercelDomain,
): Promise<DomainProviderResult> {
  const configuration = await getDomainConfiguration(hostname);
  const projectVerified = projectDomain.verified === true;
  const dnsConfigured = configuration?.misconfigured === false;
  const ownershipRecords = normalizeRecords(projectDomain.verification);
  const routingRecords = configurationRecords(hostname, configuration);
  const ownershipChallenges = ownershipRecords.filter(
    (record) => record.type.toUpperCase() === "TXT",
  );
  return {
    configured: true,
    projectVerified,
    dnsConfigured,
    // Vercel's project-domain `verified` flag only proves project access. A
    // domain is production-ready after its public DNS also passes config.
    verified: projectVerified && dnsConfigured,
    // A hostname must never be shown with two competing CNAME values. Route
    // records and ownership challenges are different requirements: keep the
    // single project-specific routing recommendation and append TXT ownership
    // proof only when Vercel explicitly asks for it.
    records: deduplicateRecords([
      ...routingRecords,
      ...ownershipChallenges,
      ...(routingRecords.length === 0
        ? preferredFallbackRecord(ownershipRecords)
        : []),
    ]),
    dns: getDnsFallback(hostname),
    raw: { projectDomain, configuration },
  } satisfies DomainProviderResult;
}

function configurationRecords(
  hostname: string,
  configuration: VercelDomainConfiguration | null,
): VerificationRecord[] {
  if (!configuration) return [];
  const recommendations = isApex(hostname)
    ? configuration.recommendedIPv4
    : configuration.recommendedCNAME;
  const type = isApex(hostname) ? "A" : "CNAME";
  const domain = isApex(hostname) ? "@" : hostname.split(".")[0]!;
  if (!Array.isArray(recommendations)) return [];
  const preferred = [...recommendations]
    .filter((item) => typeof item.value === "string")
    .sort((left, right) => numericRank(left.rank) - numericRank(right.rank))[0];
  return typeof preferred?.value === "string"
    ? [{ type, domain, value: preferred.value }]
    : [];
}

function numericRank(value: unknown) {
  return typeof value === "number" && Number.isFinite(value)
    ? value
    : Number.MAX_SAFE_INTEGER;
}

function preferredFallbackRecord(records: VerificationRecord[]) {
  const record = records.find((item) => item.type.toUpperCase() !== "TXT");
  return record ? [record] : [];
}

function deduplicateRecords(records: VerificationRecord[]) {
  const seen = new Set<string>();
  return records.filter((record) => {
    const key = `${record.type.toUpperCase()}|${record.domain.toLowerCase()}|${record.value.toLowerCase()}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function isApex(hostname: string) {
  return hostname.split(".").length === 2;
}

async function getDomainConfiguration(hostname: string) {
  const url = new URL(
    `https://api.vercel.com/v6/domains/${encodeURIComponent(hostname)}/config`,
  );
  if (process.env.VERCEL_TEAM_ID)
    url.searchParams.set("teamId", process.env.VERCEL_TEAM_ID);
  const response = await fetch(url, {
    headers: authHeaders(),
    cache: "no-store",
  });
  if (!response.ok) return null;
  return (await response.json()) as VercelDomainConfiguration;
}

function vercelUrl(path: string, version: "v9" | "v10") {
  const project = encodeURIComponent(process.env.VERCEL_PROJECT_ID!);
  const url = new URL(
    `https://api.vercel.com/${version}/projects/${project}${path}`,
  );
  if (process.env.VERCEL_TEAM_ID)
    url.searchParams.set("teamId", process.env.VERCEL_TEAM_ID);
  return url;
}

function authHeaders() {
  return { authorization: `Bearer ${process.env.VERCEL_TOKEN}` };
}

function unconfigured(hostname: string): DomainProviderResult {
  return {
    configured: false,
    projectVerified: false,
    dnsConfigured: false,
    verified: false,
    records: [],
    dns: getDnsFallback(hostname),
  };
}

function normalizeRecords(
  records: VercelDomain["verification"],
): VerificationRecord[] {
  if (!Array.isArray(records)) return [];
  return records.flatMap((record) =>
    typeof record.type === "string" &&
    typeof record.domain === "string" &&
    typeof record.value === "string"
      ? [
          {
            type: record.type,
            domain: record.domain,
            value: record.value,
            reason:
              typeof record.reason === "string" ? record.reason : undefined,
          },
        ]
      : [],
  );
}

async function providerError(response: Response) {
  try {
    const body = (await response.json()) as {
      error?: { message?: string };
      message?: string;
    };
    return (
      body.error?.message ??
      body.message ??
      `Domain provider returned ${response.status}.`
    );
  } catch {
    return `Domain provider returned ${response.status}.`;
  }
}
