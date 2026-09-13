import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSupabaseEnv, isSupabaseConfigured } from "@/lib/supabase/env";
import { updateSession } from "@/lib/supabase/proxy";
import {
  isTenantHostname,
  normalizeRequestHostname,
  productionHostname,
  safeTenantPath,
} from "@/lib/tenancy/hostname";
import { tenantContentSecurityPolicy } from "@/lib/tenancy/csp";
import {
  ACTIVE_SITE_COOKIE,
  activationPath,
  adminPathFromLegacy,
  legacyPathFromAdmin,
} from "@/lib/admin-routing";

export async function proxy(request: NextRequest) {
  const hostname = normalizeRequestHostname(request.headers);
  const pathname = safeTenantPath(request.nextUrl.pathname);
  const cleanRequestHeaders = new Headers(request.headers);
  cleanRequestHeaders.delete("x-tripone-host");
  cleanRequestHeaders.delete("x-tripone-path");
  cleanRequestHeaders.delete("x-tripone-isolated-origin");
  cleanRequestHeaders.delete("x-nonce");
  cleanRequestHeaders.delete("x-tripone-admin-rewrite");

  if (!pathname) return new NextResponse("Bad request", { status: 400 });

  const canonical = canonicalAppUrl(request, hostname);
  if (canonical) return NextResponse.redirect(canonical, 308);

  if (isTenantHostname(hostname) && !pathname.startsWith("/tenant-sites/")) {
    if (
      pathname === "/api/events" ||
      pathname === "/api/leads" ||
      pathname === "/api/bookings"
    )
      return NextResponse.next();
    if (pathname.startsWith("/api/") || pathname.startsWith("/auth/"))
      return new NextResponse("Not found", { status: 404 });
    const tenantHost = productionHostname(hostname);
    const tenantRedirect = isSupabaseConfigured()
      ? await resolveTenantRedirect(tenantHost, pathname)
      : null;
    if (tenantRedirect) {
      const destination = tenantRedirect.destination.startsWith("/")
        ? new URL(tenantRedirect.destination, request.url)
        : new URL(tenantRedirect.destination);
      return NextResponse.redirect(destination, tenantRedirect.statusCode);
    }
    const destination = request.nextUrl.clone();
    destination.pathname =
      pathname === "/sitemap.xml"
        ? `/tenant-sites/${encodeURIComponent(tenantHost)}/sitemap`
        : `/tenant-sites/${encodeURIComponent(tenantHost)}${pathname}`;
    const requestHeaders = new Headers(request.headers);
    const nonce = btoa(crypto.randomUUID());
    const csp = tenantContentSecurityPolicy(nonce);
    requestHeaders.set("x-tripone-host", tenantHost);
    requestHeaders.set("x-tripone-path", pathname);
    requestHeaders.set("x-tripone-isolated-origin", "verified");
    requestHeaders.set("x-nonce", nonce);
    requestHeaders.set("Content-Security-Policy", csp);
    const response = NextResponse.rewrite(destination, {
      request: { headers: requestHeaders },
    });
    response.headers.set("Content-Security-Policy", csp);
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
    response.headers.set(
      "Permissions-Policy",
      "camera=(), microphone=(), geolocation=(), payment=()",
    );
    return response;
  }

  if (!isSupabaseConfigured()) {
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/admin") ||
      request.nextUrl.pathname.startsWith("/super-admin") ||
      request.nextUrl.pathname.startsWith("/onboarding")
    )
      return NextResponse.redirect(new URL("/login?error=setup", request.url));
    return NextResponse.next({ request: { headers: cleanRequestHeaders } });
  }

  const internalAdminRewrite = request.headers.get("x-tripone-admin-rewrite");
  const cleanAdminPath = adminPathFromLegacy(pathname);
  if (cleanAdminPath && internalAdminRewrite !== "1") {
    const match = pathname.match(
      /^\/dashboard\/sites\/([0-9a-fA-F-]{36})(?:\/|$)/,
    );
    if (match?.[1]) {
      const destination = request.nextUrl.clone();
      destination.pathname = activationPath(match[1], cleanAdminPath);
      destination.search = "";
      return NextResponse.redirect(destination, 307);
    }
    const destination = request.nextUrl.clone();
    destination.pathname = cleanAdminPath;
    return NextResponse.redirect(destination, 307);
  }

  if (pathname === "/admin" || pathname.startsWith("/admin/")) {
    const siteId = request.cookies.get(ACTIVE_SITE_COOKIE)?.value;
    const legacyPath = legacyPathFromAdmin(siteId, pathname);
    if (!legacyPath) {
      const destination = request.nextUrl.clone();
      destination.pathname = "/dashboard";
      destination.searchParams.set("next", pathname);
      return NextResponse.redirect(destination, 307);
    }
    const destination = request.nextUrl.clone();
    destination.pathname = legacyPath;
    cleanRequestHeaders.set("x-tripone-admin-rewrite", "1");
    return updateSession(request, cleanRequestHeaders, destination);
  }

  return updateSession(request, cleanRequestHeaders);
}

function canonicalAppUrl(request: NextRequest, hostname: string) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) return null;
  let destinationOrigin: URL;
  try {
    destinationOrigin = new URL(siteUrl);
  } catch {
    return null;
  }
  const configured = new Set(
    (process.env.APP_REDIRECT_HOSTS ?? "")
      .split(",")
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean),
  );
  if (destinationOrigin.hostname === "triponeplus.com") {
    configured.add("www.triponeplus.com");
    configured.add("tools.neurerohan.com.np");
  }
  if (!configured.has(hostname) || destinationOrigin.hostname === hostname)
    return null;
  return new URL(
    request.nextUrl.pathname + request.nextUrl.search,
    destinationOrigin,
  );
}

async function resolveTenantRedirect(hostname: string, path: string) {
  try {
    const { url, anonKey } = getSupabaseEnv();
    const response = await fetch(`${url}/rest/v1/rpc/get_tenant_redirect`, {
      method: "POST",
      headers: {
        apikey: anonKey,
        authorization: `Bearer ${anonKey}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({ input_hostname: hostname, input_path: path }),
      cache: "no-store",
    });
    if (!response.ok) return null;
    const value = (await response.json()) as unknown;
    if (
      value &&
      typeof value === "object" &&
      "destination" in value &&
      typeof value.destination === "string" &&
      "statusCode" in value &&
      (value.statusCode === 301 || value.statusCode === 302)
    )
      return value as { destination: string; statusCode: 301 | 302 };
  } catch {
    // A redirect lookup failure must not make the published website unavailable.
  }
  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|ico|woff2)$).*)",
  ],
};
