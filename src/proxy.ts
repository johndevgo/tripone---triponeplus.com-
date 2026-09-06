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

export async function proxy(request: NextRequest) {
  const hostname = normalizeRequestHostname(request.headers);
  const pathname = safeTenantPath(request.nextUrl.pathname);

  if (!pathname) return new NextResponse("Bad request", { status: 400 });

  if (isTenantHostname(hostname) && !pathname.startsWith("/tenant-sites/")) {
    if (pathname.startsWith("/api/")) return NextResponse.next();
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
    requestHeaders.set("x-tripone-host", tenantHost);
    return NextResponse.rewrite(destination, {
      request: { headers: requestHeaders },
    });
  }

  if (!isSupabaseConfigured()) {
    if (
      request.nextUrl.pathname.startsWith("/dashboard") ||
      request.nextUrl.pathname.startsWith("/onboarding")
    )
      return NextResponse.redirect(new URL("/login?error=setup", request.url));
    return NextResponse.next();
  }
  return updateSession(request);
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
