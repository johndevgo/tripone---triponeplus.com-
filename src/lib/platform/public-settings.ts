import "server-only";
import { defaultPlatformSettings } from "./config";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/public";

type PublicPlatformSettings = {
  foundingFreeYears: number;
  inactivityDays: number;
  annualPrice: number;
  currency: string;
  retentionEnabled: boolean;
};

let memo: { expiresAt: number; value: PublicPlatformSettings } | undefined;
let inFlight: Promise<PublicPlatformSettings> | undefined;

export async function getPublicPlatformSettings() {
  if (memo && memo.expiresAt > Date.now()) return memo.value;
  if (inFlight) return inFlight;
  inFlight = loadPublicPlatformSettings().then((value) => {
    memo = { value, expiresAt: Date.now() + 5 * 60_000 };
    return value;
  });
  try {
    return await inFlight;
  } finally {
    inFlight = undefined;
  }
}

async function loadPublicPlatformSettings(): Promise<PublicPlatformSettings> {
  if (!isSupabaseConfigured()) return defaultPlatformSettings;
  try {
    const { data } = await createPublicClient()
      .from("platform_settings")
      .select(
        "founding_free_years,inactivity_days,annual_price,currency,retention_enabled",
      )
      .eq("id", 1)
      .abortSignal(AbortSignal.timeout(2500))
      .single();
    if (!data) return defaultPlatformSettings;
    return {
      foundingFreeYears: data.founding_free_years,
      inactivityDays: data.inactivity_days,
      annualPrice: Number(data.annual_price),
      currency: data.currency,
      retentionEnabled: data.retention_enabled,
    };
  } catch {
    return defaultPlatformSettings;
  }
}
