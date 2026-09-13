import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { publicBookingSchema } from "@/lib/operations/schemas";
import { createClient } from "@/lib/supabase/server";
import {
  isAppHostname,
  isSameOriginMutation,
  normalizeRequestHostname,
  productionHostname,
} from "@/lib/tenancy/hostname";

export async function POST(request: Request) {
  if (!isSameOriginMutation(request.headers))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const body = publicBookingSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!body.success)
    return NextResponse.json(
      { error: body.error.issues[0]?.message ?? "Invalid booking request." },
      { status: 400 },
    );
  const forwarded =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const fingerprint = createHash("sha256")
    .update(`${forwarded}|${request.headers.get("user-agent") ?? "unknown"}`)
    .digest("hex");
  const hostname = productionHostname(
    normalizeRequestHostname(request.headers),
  );
  if (!hostname)
    return NextResponse.json(
      { error: "Invalid website origin." },
      { status: 400 },
    );
  const fallback = isAppHostname(hostname) && Boolean(body.data.siteSlug);
  const supabase = await createClient();
  const { error } = await supabase.rpc("submit_public_booking", {
    payload: {
      ...body.data,
      hostname,
      deliveryMode: fallback ? "fallback" : "verified_hostname",
    },
    fingerprint,
  });
  if (error)
    return NextResponse.json(
      {
        error: error.message.includes("Too many")
          ? error.message
          : "We could not submit your request. Please try again.",
      },
      { status: error.message.includes("Too many") ? 429 : 400 },
    );
  return NextResponse.json({ ok: true });
}
