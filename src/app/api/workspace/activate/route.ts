import { NextRequest, NextResponse } from "next/server";
import { ACTIVE_SITE_COOKIE, isUuid } from "@/lib/admin-routing";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const siteId = request.nextUrl.searchParams.get("siteId") ?? "";
  const requestedNext = request.nextUrl.searchParams.get("next") ?? "";
  const next =
    requestedNext === "/admin" || requestedNext.startsWith("/admin/")
      ? requestedNext
      : "/admin/dashboard";
  if (!isUuid(siteId))
    return NextResponse.redirect(new URL("/dashboard", request.url), 303);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    const login = new URL("/login", request.url);
    login.searchParams.set(
      "next",
      request.nextUrl.pathname + request.nextUrl.search,
    );
    return NextResponse.redirect(login, 303);
  }
  const { data: site } = await supabase
    .from("sites")
    .select("id")
    .eq("id", siteId)
    .maybeSingle();
  if (!site)
    return NextResponse.redirect(new URL("/dashboard", request.url), 303);

  const response = NextResponse.redirect(new URL(next, request.url), 303);
  response.cookies.set(ACTIVE_SITE_COOKIE, siteId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  });
  return response;
}
