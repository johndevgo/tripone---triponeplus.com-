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
    if (mode === "add" && response.status === 400)
      return requestDomain(hostname, "verify");
    throw new Error(await providerError(response));
  }
  const raw = (await response.json()) as VercelDomain;
  return {
    configured: true,
    verified: raw.verified === true,
    records: normalizeRecords(raw.verification),
    dns: getDnsFallback(hostname),
    raw,
  } satisfies DomainProviderResult;
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
