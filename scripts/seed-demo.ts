import { createClient } from "@supabase/supabase-js";
import { generateSite } from "../src/lib/site-generator/generate-site";
import { slugify } from "../src/lib/utils";
import type { OnboardingInput } from "../src/lib/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const email = process.env.TRIPONE_DEMO_EMAIL;
const password = process.env.TRIPONE_DEMO_PASSWORD;
if (!url || !anonKey || !email || !password) {
  throw new Error(
    "Set Supabase and TRIPONE_DEMO_* values in .env.local before seeding.",
  );
}

const input: OnboardingInput = {
  businessType: "jetski",
  name: "Dubai Wave Jetski",
  slug: "dubai-wave-jetski-demo",
  shortDescription: "Demo jet ski experiences departing from Dubai Marina.",
  country: "United Arab Emirates",
  city: "Dubai Marina",
  region: "Dubai",
  timezone: "Asia/Dubai",
  currency: "AED",
  phone: "+971 00 000 0000",
  whatsapp: "+971 00 000 0000",
  email,
  brand: { primary: "#063D2E", secondary: "#087A5A", accent: "#F5A623" },
  themeId: "horizon",
  experiences: [
    [
      "60 Minute Jet Ski Experience",
      450,
      60,
      "A one-hour demo ride around Dubai Marina with clear booking details.",
    ],
    [
      "90 Minute Jet Ski Experience",
      650,
      90,
      "A longer demo route for guests who want more time on the water.",
    ],
    [
      "Burj Al Arab Jet Ski Tour",
      750,
      90,
      "A demo guided jet ski route toward the Burj Al Arab coastline.",
    ],
  ].map(([name, priceFrom, durationValue, shortDescription]) => ({
    name: String(name),
    experienceType: "jet ski experience",
    priceFrom: Number(priceFrom),
    currency: "AED",
    durationValue: Number(durationValue),
    durationUnit: "minutes",
    locationName: "Dubai Marina",
    shortDescription: String(shortDescription),
    extraDetails: { safetyEquipment: "Demo detail: confirm with the operator" },
  })),
};

const supabase = createClient(url, anonKey);
const { error: authError } = await supabase.auth.signInWithPassword({
  email,
  password,
});
if (authError) throw authError;
const experiences = input.experiences.map((experience) => ({
  ...experience,
  slug: slugify(`${experience.name} ${experience.locationName ?? ""}`),
}));
const { data, error } = await supabase.rpc("create_generated_site", {
  payload: { ...input, experiences, generated: generateSite(input) },
});
if (error) throw error;
console.log(`Demo site ready: ${data}`);
