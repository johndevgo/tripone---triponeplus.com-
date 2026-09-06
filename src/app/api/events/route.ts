import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { analyticsEventSchema } from "@/lib/analytics/schema";
import { createPublicClient } from "@/lib/supabase/public";
import { normalizeRequestHostname } from "@/lib/tenancy/hostname";

export async function POST(request: Request) {
  const parsed = analyticsEventSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!parsed.success)
    return NextResponse.json(
      { error: "Invalid analytics event." },
      { status: 400 },
    );
  const hostname = normalizeRequestHostname(request.headers);
  if (!hostname)
    return NextResponse.json(
      { error: "Invalid site origin." },
      { status: 400 },
    );
  const forwarded =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const fingerprint = createHash("sha256")
    .update(`${forwarded}|${request.headers.get("user-agent") ?? "unknown"}`)
    .digest("hex");
  const supabase = createPublicClient();
  const { error } = await supabase.rpc("submit_analytics_event", {
    payload: { ...parsed.data, hostname },
    fingerprint,
  });
  if (error) {
    const limited = error.message.includes("Too many");
    return NextResponse.json(
      { error: limited ? "Rate limit reached." : "Event rejected." },
      { status: limited ? 429 : 400 },
    );
  }
  return new NextResponse(null, { status: 204 });
}
