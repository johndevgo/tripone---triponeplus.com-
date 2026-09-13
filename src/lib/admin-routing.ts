export const ACTIVE_SITE_COOKIE = "tripone-active-site";

const SITE_ID_PATTERN =
  "[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}";
const LEGACY_SITE_ROUTE = new RegExp(
  `^/dashboard/sites/(${SITE_ID_PATTERN})(?:/(.*))?$`,
);

export function isUuid(value: string | undefined): value is string {
  return Boolean(value && new RegExp(`^${SITE_ID_PATTERN}$`).test(value));
}

export function adminPathFromLegacy(pathname: string) {
  if (pathname === "/dashboard/account") return "/admin/account";
  if (pathname === "/dashboard/sites") return "/admin/workspaces";
  const match = pathname.match(LEGACY_SITE_ROUTE);
  if (!match) return null;
  const segment = match[2] ?? "";
  if (!segment) return "/admin/dashboard";
  if (segment === "builder") return "/admin/website";
  return `/admin/${segment}`;
}

export function legacyPathFromAdmin(
  siteId: string | undefined,
  pathname: string,
) {
  if (pathname === "/admin/account") return "/dashboard/account";
  if (pathname === "/admin/workspaces") return "/dashboard/sites";
  if (!isUuid(siteId)) return null;
  if (pathname === "/admin" || pathname === "/admin/dashboard")
    return `/dashboard/sites/${siteId}`;
  if (!pathname.startsWith("/admin/")) return null;
  let segment: string;
  try {
    segment = decodeURIComponent(pathname.slice("/admin/".length));
  } catch {
    return null;
  }
  if (
    !segment ||
    !segment
      .split("/")
      .every((part) => /^[a-z0-9_-]+$/i.test(part) && part !== ".")
  )
    return null;
  if (segment === "website") return `/dashboard/sites/${siteId}/builder`;
  return `/dashboard/sites/${siteId}/${segment}`;
}

export function activationPath(siteId: string, next = "/admin/dashboard") {
  const params = new URLSearchParams({ siteId, next });
  return `/api/workspace/activate?${params.toString()}`;
}
