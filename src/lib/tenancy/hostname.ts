const defaultAppHosts = new Set([
  "triponeplus.com",
  "www.triponeplus.com",
  "app.triponeplus.com",
  "tools.neurerohan.com.np",
  "localhost",
  "127.0.0.1",
]);

export function normalizeRequestHostname(headers: Headers) {
  const forwarded = headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  return normalizeHost(forwarded || headers.get("host") || "");
}

export function isSameOriginMutation(headers: Headers) {
  const requestedHost = normalizeRequestHostname(headers);
  const origin = headers.get("origin");
  const fetchSite = headers.get("sec-fetch-site");
  if (!origin) return fetchSite == null || fetchSite === "same-origin";
  try {
    return normalizeHost(new URL(origin).hostname) === requestedHost;
  } catch {
    return false;
  }
}

export function normalizeHost(value: string) {
  const hostname = value
    .trim()
    .toLowerCase()
    .replace(/:\d+$/, "")
    .replace(/\.$/, "");
  return /^(?=.{1,253}$)[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?$/.test(hostname)
    ? hostname
    : "";
}

export function isAppHostname(hostname: string) {
  const configured = (process.env.APP_HOSTS ?? "")
    .split(",")
    .map((host) => normalizeHost(host))
    .filter(Boolean);
  return (
    defaultAppHosts.has(hostname) ||
    configured.includes(hostname) ||
    hostname.endsWith(".vercel.app")
  );
}

export function isTenantHostname(hostname: string) {
  if (!hostname || isAppHostname(hostname)) return false;
  if (hostname.endsWith(".localhost")) return hostname.split(".").length > 1;
  if (hostname.endsWith(".triponeplus.com")) {
    const subdomain = hostname.slice(0, -".triponeplus.com".length);
    return Boolean(subdomain && !["www", "app"].includes(subdomain));
  }
  return hostname.includes(".");
}

export function productionHostname(hostname: string) {
  if (hostname.endsWith(".localhost")) {
    const slug = hostname.slice(0, -".localhost".length);
    return `${slug}.triponeplus.com`;
  }
  return hostname;
}

export function safeTenantPath(pathname: string) {
  const decoded = decodeURIComponent(pathname);
  if (decoded.includes("\\") || decoded.includes("\0")) return null;
  return pathname.startsWith("/") && !pathname.startsWith("//")
    ? pathname
    : null;
}
