import {
  CheckCircle2,
  CircleDashed,
  Globe2,
  Pencil,
  ShieldCheck,
  Trash2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDnsFallback } from "@/lib/domains/validation";
import { isDomainProviderConfigured } from "@/lib/domains/provider";
import { fallbackSiteUrl } from "@/lib/tenancy/public-url";
import { PageHead } from "../experiences/page";
import {
  addDomain,
  deleteDomain,
  setPrimaryDomain,
  updateDomain,
  verifyDomain,
} from "./actions";

export default async function Domains({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const notice = await searchParams;
  const supabase = await createClient();
  const [{ data: domains }, { data: site }] = await Promise.all([
    supabase
      .from("domains")
      .select(
        "id,hostname,domain_type,verification_status,is_primary,provider_data,last_checked_at,last_error",
      )
      .eq("site_id", siteId)
      .eq("domain_type", "custom")
      .order("created_at"),
    supabase.from("sites").select("slug").eq("id", siteId).single(),
  ]);
  const configured = isDomainProviderConfigured();
  const hostedUrl = site?.slug ? fallbackSiteUrl(site.slug) : null;
  return (
    <>
      <PageHead eyebrow="Publishing" title="Domains" />
      <Notice {...notice} />
      <section className="glass mt-8 rounded-3xl p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Website addresses</h2>
            <p className="mt-1 text-sm text-white/45">
              One verified hostname drives canonicals, sitemaps and social
              sharing.
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs ${configured ? "bg-emerald-300/10 text-emerald-200" : "bg-amber-300/10 text-amber-100"}`}
          >
            Vercel API {configured ? "connected" : "not configured"}
          </span>
        </div>
        {hostedUrl && (
          <a
            href={hostedUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 block rounded-2xl border border-emerald-300/15 bg-emerald-300/[.06] p-5 transition hover:border-emerald-300/30"
          >
            <span className="text-xs font-semibold uppercase tracking-[.16em] text-emerald-200">
              Live hosted address
            </span>
            <span className="mt-2 block break-all text-sm text-white/75">
              {hostedUrl}
            </span>
          </a>
        )}
        <div className="mt-6 grid gap-4">
          {(domains ?? []).map((domain) => {
            const dns = getDnsFallback(domain.hostname);
            const provider = object(domain.provider_data);
            const records = Array.isArray(provider.records)
              ? provider.records
              : [];
            const ready =
              domain.verification_status === "verified" &&
              provider.dnsConfigured === true;
            return (
              <article
                key={domain.id}
                className="rounded-2xl border border-white/10 bg-black/10 p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex gap-3">
                    {ready ? (
                      <CheckCircle2 className="text-emerald-300" />
                    ) : (
                      <CircleDashed className="text-amber-200" />
                    )}
                    <div>
                      <p className="font-semibold">{domain.hostname}</p>
                      <p className="mt-1 text-xs capitalize text-white/40">
                        {domain.domain_type} ·{" "}
                        {ready ? "connected" : "pending DNS"}
                        {domain.is_primary ? " · Primary" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(!ready ||
                      (configured &&
                        domain.domain_type === "subdomain" &&
                        provider.configured !== true)) && (
                      <form action={verifyDomain}>
                        <Hidden siteId={siteId} domainId={domain.id} />
                        <MiniButton>
                          {domain.domain_type === "subdomain"
                            ? "Provision hosting"
                            : "Check DNS"}
                        </MiniButton>
                      </form>
                    )}
                    {ready && !domain.is_primary && (
                      <form action={setPrimaryDomain}>
                        <Hidden siteId={siteId} domainId={domain.id} />
                        <MiniButton>Make primary</MiniButton>
                      </form>
                    )}
                    {domain.domain_type === "custom" && (
                      <form action={deleteDomain}>
                        <Hidden siteId={siteId} domainId={domain.id} />
                        <MiniButton danger>
                          <Trash2 size={14} /> Remove
                        </MiniButton>
                      </form>
                    )}
                  </div>
                </div>
                {domain.domain_type === "custom" && !ready && (
                  <div className="mt-5 rounded-xl bg-white/[.04] p-4 text-sm">
                    <p className="font-medium">DNS records</p>
                    {records.length > 0 ? (
                      records.map((record, index) => {
                        const item = object(record);
                        return (
                          <code
                            className="mt-2 block break-all text-xs text-white/60"
                            key={index}
                          >
                            {String(item.type)} {String(item.domain)} →{" "}
                            {String(item.value)}
                          </code>
                        );
                      })
                    ) : (
                      <code className="mt-2 block break-all text-xs text-white/60">
                        {dns.type} {dns.name} → {dns.value}
                      </code>
                    )}
                    {!configured && (
                      <p className="mt-3 text-xs text-amber-100/70">
                        Add VERCEL_TOKEN and VERCEL_PROJECT_ID to enable
                        verified provisioning.
                      </p>
                    )}
                  </div>
                )}
                {domain.last_error && (
                  <p className="mt-3 text-xs text-red-200">
                    {domain.last_error}
                  </p>
                )}
                {domain.domain_type === "custom" && (
                  <details className="mt-4 border-t border-white/10 pt-4">
                    <summary className="flex cursor-pointer list-none items-center gap-2 text-xs font-semibold text-white/55 marker:hidden hover:text-white">
                      <Pencil size={14} /> Edit hostname
                    </summary>
                    <form
                      action={updateDomain}
                      className="mt-3 flex flex-col gap-3 sm:flex-row"
                    >
                      <Hidden siteId={siteId} domainId={domain.id} />
                      <label className="flex-1 text-xs text-white/55">
                        Custom hostname
                        <input
                          name="hostname"
                          required
                          defaultValue={domain.hostname}
                          className="mt-2 min-h-10 w-full rounded-xl border border-white/12 bg-black/20 px-3 text-sm text-white"
                        />
                      </label>
                      <button className="mt-auto min-h-10 rounded-xl border border-[var(--brand-300)]/30 bg-[var(--brand-500)]/10 px-4 text-sm font-semibold text-[var(--brand-100)]">
                        Save hostname
                      </button>
                    </form>
                    <p className="mt-2 text-xs leading-5 text-white/35">
                      Changing a hostname disconnects the old Vercel project
                      domain and starts verification again for the new one.
                    </p>
                  </details>
                )}
              </article>
            );
          })}
          {(domains ?? []).length === 0 && (
            <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-white/45">
              No custom domain is connected. Your hosted address above remains
              live and fully functional.
            </p>
          )}
        </div>
      </section>
      <section className="glass mt-5 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <Globe2 className="text-[#95ee8e]" />
          <h2 className="text-xl font-semibold">Add a custom domain</h2>
        </div>
        <form
          action={addDomain}
          className="mt-5 flex flex-col gap-3 sm:flex-row"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <label className="flex-1 text-sm">
            Hostname
            <input
              name="hostname"
              required
              placeholder="dubaiwavejetski.com"
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-4"
            />
          </label>
          <button className="mt-auto min-h-11 rounded-xl bg-[#5bcd57] px-5 font-semibold text-[#173028]">
            Add domain
          </button>
        </form>
        <p className="mt-4 flex gap-2 text-xs text-white/40">
          <ShieldCheck size={15} />
          DNS ownership must be verified before traffic or canonicals switch.
        </p>
      </section>
    </>
  );
}

function Hidden({ siteId, domainId }: { siteId: string; domainId: string }) {
  return (
    <>
      <input type="hidden" name="siteId" value={siteId} />
      <input type="hidden" name="domainId" value={domainId} />
    </>
  );
}
function MiniButton({
  children,
  danger,
}: {
  children: React.ReactNode;
  danger?: boolean;
}) {
  return (
    <button
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-lg border px-3 text-xs ${danger ? "border-red-300/20 text-red-200 hover:bg-red-400/10" : "border-white/15 text-white/70 hover:bg-white/[.06]"}`}
    >
      {children}
    </button>
  );
}
function Notice({ message, error }: { message?: string; error?: string }) {
  if (!message && !error) return null;
  return (
    <p
      role={error ? "alert" : "status"}
      className={`mt-6 rounded-xl p-3 text-sm ${error ? "bg-red-400/10 text-red-100" : "bg-emerald-300/10 text-emerald-100"}`}
    >
      {error ?? message}
    </p>
  );
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
