const localFallback = "http://localhost:3000";

export function parseAppUrl(
  value: string | undefined,
  fallback = localFallback,
) {
  const candidate = value?.trim() || fallback;
  if (candidate.includes(","))
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must contain one absolute URL; use APP_HOSTS for hostname lists.",
    );

  let url: URL;
  try {
    url = new URL(candidate);
  } catch {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an absolute URL.");
  }
  if (
    !["http:", "https:"].includes(url.protocol) ||
    url.username ||
    url.password ||
    url.search ||
    url.hash ||
    (url.pathname !== "/" && url.pathname !== "")
  )
    throw new Error(
      "NEXT_PUBLIC_SITE_URL must be one HTTP(S) application origin without a path, query or credentials.",
    );
  return url.origin;
}

export function getAppUrl(fallback = localFallback) {
  return parseAppUrl(process.env.NEXT_PUBLIC_SITE_URL, fallback);
}
