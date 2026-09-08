import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { publishSite } from "../actions";
import { PageHead } from "../experiences/page";
import {
  archiveSite,
  deleteSite,
  saveSettings,
  unpublishSite,
} from "./actions";

export default async function Settings({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const notice = await searchParams;
  const supabase = await createClient();
  const { data: site } = await supabase
    .from("sites")
    .select(
      "name,slug,status,published_at,global_settings,cro_settings,favicon_url,default_og_image_url,businesses(timezone,currency,phone,whatsapp,email,address,instagram_url,facebook_url,youtube_url,tripadvisor_url,logo_url)",
    )
    .eq("id", siteId)
    .single();
  const business = Array.isArray(site?.businesses)
    ? site.businesses[0]
    : site?.businesses;
  const global = object(site?.global_settings);
  const cro = object(site?.cro_settings);
  const integrations = object(global.integrations);
  if (!site || !business) return null;
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageHead eyebrow="Workspace" title="Website settings" />
        <div className="flex gap-2">
          <Link
            href={`/preview/${siteId}`}
            className="inline-flex min-h-11 items-center rounded-xl border border-white/15 px-4 text-sm"
          >
            Preview
          </Link>
          <form action={publishSite}>
            <input type="hidden" name="siteId" value={siteId} />
            <button className="min-h-11 rounded-xl bg-[#f5a623] px-5 text-sm font-semibold text-[#173028]">
              {site.status === "published"
                ? "Publish updates"
                : "Publish website"}
            </button>
          </form>
        </div>
      </div>
      {(notice.message || notice.error) && (
        <p
          role={notice.error ? "alert" : "status"}
          className={`mt-6 rounded-xl p-3 text-sm ${notice.error ? "bg-red-400/10 text-red-100" : "bg-emerald-300/10 text-emerald-100"}`}
        >
          {notice.error ?? notice.message}
        </p>
      )}
      <form action={saveSettings} className="mt-8 grid gap-5">
        <input type="hidden" name="siteId" value={siteId} />
        <SettingsSection
          title="General"
          copy="Identity and regional defaults used throughout the website."
        >
          <Fields>
            <Field
              name="siteName"
              label="Site name"
              value={site.name}
              required
            />
            <Field
              name="locale"
              label="Locale"
              value={text(global.locale, "en-US")}
              required
            />
            <Field
              name="timezone"
              label="Timezone"
              value={business.timezone}
              required
            />
            <Field
              name="currency"
              label="Currency"
              value={business.currency}
              required
            />
          </Fields>
        </SettingsSection>
        <SettingsSection
          title="Contact & social"
          copy="These details can appear in headers, footers and conversion sections."
        >
          <Fields>
            <Field name="phone" label="Phone" value={business.phone} />
            <Field name="whatsapp" label="WhatsApp" value={business.whatsapp} />
            <Field
              name="email"
              label="Email"
              value={business.email}
              type="email"
              required
            />
            <Field name="address" label="Address" value={business.address} />
            <Field
              name="instagramUrl"
              label="Instagram URL"
              value={business.instagram_url}
              type="url"
            />
            <Field
              name="facebookUrl"
              label="Facebook URL"
              value={business.facebook_url}
              type="url"
            />
            <Field
              name="youtubeUrl"
              label="YouTube URL"
              value={business.youtube_url}
              type="url"
            />
            <Field
              name="tripadvisorUrl"
              label="TripAdvisor URL"
              value={business.tripadvisor_url}
              type="url"
            />
          </Fields>
        </SettingsSection>
        <SettingsSection
          title="Booking"
          copy="Control the default booking journey without injecting custom scripts."
        >
          <Fields>
            <Field
              name="defaultBookingCta"
              label="Default CTA label"
              value={text(cro.defaultBookingCta, "Book now")}
              required
            />
            <Field
              name="bookingUrl"
              label="Fallback booking URL"
              value={text(global.bookingUrl)}
              type="url"
            />
          </Fields>
          <Checks
            items={[
              [
                "openBookingInNewTab",
                "Open external booking links in a new tab",
                bool(global.openBookingInNewTab),
              ],
              [
                "stickyMobileCta",
                "Show sticky mobile booking CTA",
                bool(cro.stickyMobileCta, true),
              ],
              [
                "whatsappEnabled",
                "Enable WhatsApp CTA",
                bool(cro.whatsappEnabled, true),
              ],
              [
                "phoneEnabled",
                "Enable phone CTA",
                bool(cro.phoneEnabled, true),
              ],
            ]}
          />
        </SettingsSection>
        <SettingsSection
          title="Brand assets"
          copy="Use HTTPS images from your media library for reliable production rendering."
        >
          <Fields>
            <Field
              name="logoUrl"
              label="Logo URL"
              value={business.logo_url}
              type="url"
            />
            <Field
              name="faviconUrl"
              label="Favicon URL"
              value={site.favicon_url}
              type="url"
            />
            <Field
              name="ogImageUrl"
              label="Default social image URL"
              value={site.default_og_image_url}
              type="url"
            />
          </Fields>
        </SettingsSection>
        <SettingsSection
          title="Privacy & integrations"
          copy="Only typed tracking IDs are accepted. Arbitrary JavaScript is never executed."
        >
          <label className="text-sm">
            Cookie consent mode
            <select
              name="cookieConsentMode"
              defaultValue={text(global.cookieConsentMode, "disabled")}
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#08271f] px-3 sm:max-w-sm"
            >
              <option value="disabled">Disabled</option>
              <option value="basic">Basic consent banner</option>
            </select>
          </label>
          <Fields>
            <Field
              name="googleTagManagerId"
              label="Google Tag Manager ID"
              value={text(integrations.googleTagManagerId)}
              placeholder="GTM-XXXXXXX"
            />
            <Field
              name="googleAnalyticsId"
              label="GA4 Measurement ID"
              value={text(integrations.googleAnalyticsId)}
              placeholder="G-XXXXXXXXXX"
            />
            <Field
              name="metaPixelId"
              label="Meta Pixel ID"
              value={text(integrations.metaPixelId)}
            />
            <Field
              name="tiktokPixelId"
              label="TikTok Pixel ID"
              value={text(integrations.tiktokPixelId)}
            />
          </Fields>
          <p className="text-xs leading-5 text-white/35">
            Provider scripts run only on a verified, isolated customer domain.
            They stay disabled in the dashboard, authenticated preview and the
            shared tools.neurerohan.com.np/s/ fallback. First-party aggregate
            events can still be collected there after consent. <br />
            The banner is a technical consent control, not a guarantee of legal
            compliance. Site owners must review applicable privacy and cookie
            laws.
          </p>
        </SettingsSection>
        <button className="min-h-12 justify-self-start rounded-xl bg-[#f5a623] px-6 font-semibold text-[#173028]">
          Save settings
        </button>
      </form>
      <section className="mt-8 rounded-3xl border border-red-300/15 bg-red-950/10 p-6">
        <h2 className="text-xl font-semibold text-red-100">Danger zone</h2>
        <p className="mt-2 text-sm text-white/40">
          Destructive actions require explicit confirmation. Site deletion
          cascades to its pages, media records, leads, domains and analytics.
        </p>
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {site.status === "published" && (
            <form
              action={unpublishSite}
              className="rounded-2xl border border-white/10 p-4"
            >
              <input type="hidden" name="siteId" value={siteId} />
              <p className="font-medium">Unpublish</p>
              <p className="mt-1 text-xs text-white/35">
                Immediately remove the public site.
              </p>
              <DangerButton>Unpublish site</DangerButton>
            </form>
          )}
          <form
            action={archiveSite}
            className="rounded-2xl border border-white/10 p-4"
          >
            <input type="hidden" name="siteId" value={siteId} />
            <p className="font-medium">Archive</p>
            <p className="mt-1 text-xs text-white/35">
              Type {site.name} to confirm.
            </p>
            <input
              name="confirmation"
              required
              className="mt-3 min-h-10 w-full rounded-lg border border-white/10 bg-black/20 px-3 text-sm"
            />
            <DangerButton>Archive site</DangerButton>
          </form>
          <form
            action={deleteSite}
            className="rounded-2xl border border-red-300/15 p-4"
          >
            <input type="hidden" name="siteId" value={siteId} />
            <p className="font-medium text-red-100">Delete permanently</p>
            <p className="mt-1 text-xs text-white/35">
              Type DELETE {site.name}
            </p>
            <input
              name="confirmation"
              required
              className="mt-3 min-h-10 w-full rounded-lg border border-red-300/15 bg-black/20 px-3 text-sm"
            />
            <DangerButton>Delete site</DangerButton>
          </form>
        </div>
      </section>
    </>
  );
}

function SettingsSection({
  title,
  copy,
  children,
}: {
  title: string;
  copy: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-1 text-sm text-white/40">{copy}</p>
      <div className="mt-6 grid gap-5">{children}</div>
    </section>
  );
}
function Fields({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Field({
  name,
  label,
  value,
  type = "text",
  required,
  placeholder,
}: {
  name: string;
  label: string;
  value?: string | null;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value ?? ""}
        required={required}
        placeholder={placeholder}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
      />
    </label>
  );
}
function Checks({ items }: { items: Array<[string, string, boolean]> }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map(([name, label, checked]) => (
        <label
          key={name}
          className="flex items-center gap-3 rounded-xl border border-white/10 p-3 text-sm"
        >
          <input
            type="checkbox"
            name={name}
            defaultChecked={checked}
            className="size-4 accent-[#f5a623]"
          />
          {label}
        </label>
      ))}
    </div>
  );
}
function DangerButton({ children }: { children: React.ReactNode }) {
  return (
    <button className="mt-3 min-h-10 rounded-lg border border-red-300/25 px-4 text-sm text-red-100">
      {children}
    </button>
  );
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function text(value: unknown, fallback = "") {
  return typeof value === "string" ? value : fallback;
}
function bool(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}
