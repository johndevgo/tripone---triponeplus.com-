"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { themeIds } from "@/lib/types";
import { getTheme } from "@/lib/site-generator";

const themeSchema = z.object({
  id: z.enum(themeIds),
  name: z.string(),
  description: z.string(),
  font: z.enum([
    "var(--font-geist-sans)",
    "Arial, sans-serif",
    "Georgia, serif",
  ]),
  headingFont: z.enum([
    "var(--font-geist-sans)",
    "Arial, sans-serif",
    "Georgia, serif",
  ]),
  colors: z.object({
    primary: z.string().regex(/^#[0-9a-f]{6}$/i),
    secondary: z.string().regex(/^#[0-9a-f]{6}$/i),
    accent: z.string().regex(/^#[0-9a-f]{6}$/i),
    background: z.string().regex(/^#[0-9a-f]{6}$/i),
    surface: z.string().regex(/^#[0-9a-f]{6}$/i),
    text: z.string().regex(/^#[0-9a-f]{6}$/i),
    muted: z.string().regex(/^#[0-9a-f]{6}$/i),
  }),
  radius: z.enum(["0rem", "0.25rem", "0.75rem", "0.875rem", "1.25rem", "2rem"]),
  buttonStyle: z.enum(["solid", "pill", "outline"]),
  imageTreatment: z.enum([
    "natural",
    "soft-rounded",
    "rounded",
    "cinematic",
    "editorial",
    "high-contrast",
  ]),
  headerStyle: z.string().max(30),
  spacingCharacter: z.enum(["compact", "balanced", "airy"]),
  sectionStyle: z.enum(["clean", "editorial", "layered"]),
  headingWeight: z.union([
    z.literal(500),
    z.literal(600),
    z.literal(700),
    z.literal(800),
  ]),
  baseTextScale: z.enum(["compact", "standard", "large"]),
  cardBorder: z.enum(["none", "subtle", "strong"]),
  shadowStrength: z.enum(["none", "soft", "medium"]),
  contentWidth: z.enum(["narrow", "standard", "wide"]),
  headerHeight: z.enum(["compact", "standard", "tall"]),
});

export async function saveTheme(siteId: string, value: unknown) {
  const id = z.uuid().safeParse(siteId);
  const theme = themeSchema.safeParse(value);
  if (!id.success || !theme.success)
    return { ok: false, error: "Invalid theme settings." };
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Authentication required." };
  const { error } = await supabase
    .from("sites")
    .update({ theme_id: theme.data.id, theme_settings: theme.data })
    .eq("id", id.data);
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/dashboard/sites/${id.data}/design`);
  revalidatePath(`/preview/${id.data}`);
  return { ok: true };
}

export async function resetTheme(siteId: string, themeId: string) {
  return saveTheme(siteId, getTheme(z.enum(themeIds).parse(themeId)));
}
