import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  isAppHostname,
  isSameOriginMutation,
  normalizeRequestHostname,
  productionHostname,
} from "@/lib/tenancy/hostname";

const schema = z.object({
  siteId: z.uuid(),
  experienceId: z.union([z.literal(""), z.uuid()]).optional(),
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: z.string().max(40).optional(),
  desiredDate: z.union([z.literal(""), z.iso.date()]).optional(),
  guests: z
    .union([z.literal(""), z.coerce.number().int().positive().max(1000)])
    .optional(),
  message: z.string().max(3000).optional(),
  sourcePage: z.string().max(300).optional(),
  website: z.string().max(0).optional(),
  siteSlug: z
    .union([z.literal(""), z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)])
    .optional(),
});

export async function POST(request: Request) {
  if (!isSameOriginMutation(request.headers))
    return NextResponse.json(
      { error: "Invalid request origin." },
      { status: 403 },
    );
  const body = schema.safeParse(await request.json());
  if (!body.success)
    return NextResponse.json(
      { error: body.error.issues[0]?.message ?? "Invalid enquiry." },
      { status: 400 },
    );
  const forwarded =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const fingerprint = createHash("sha256")
    .update(`${forwarded}|${request.headers.get("user-agent") ?? "unknown"}`)
    .digest("hex");
  const supabase = await createClient();
  const hostname = productionHostname(
    normalizeRequestHostname(request.headers),
  );
  if (!hostname)
    return NextResponse.json(
      { error: "Invalid website origin." },
      { status: 400 },
    );
  const fallback = isAppHostname(hostname) && Boolean(body.data.siteSlug);
  const { error } = await supabase.rpc("submit_public_lead", {
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
          : "We could not send your enquiry. Please try again.",
      },
      { status: error.message.includes("Too many") ? 429 : 400 },
    );
  return NextResponse.json({ ok: true });
}
