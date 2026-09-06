import { CheckCircle2, CircleDashed, Globe2, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getDnsFallback } from "@/lib/domains/validation";
import { isDomainProviderConfigured } from "@/lib/domains/provider";
import { PageHead } from "../experiences/page";
import {
  addDomain,
  deleteDomain,
  setPrimaryDomain,
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
  const { data: domains } = await supabase
    .from("domains")
    .select(
      "id,hostname,domain_type,verification_status,is_primary,provider_data,last_checked_at,last_error",
    )
    .eq("site_id", siteId)
    .order("domain_type")
    .order("created_at");
  const configured = isDomainProviderConfigured();
  return (
    <>
      <PageHead eyebrow="Publishing" title="Domains" />
      <Notice {...notice} />
      <section className="glass mt-8 rounded-3xl p-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-xl font-semibold">Connected hostnames</h2>
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
        <div className="mt-6 grid gap-4">
          {(domains ?? []).map((domain) => {
            const dns = getDnsFallback(domain.hostname);
            const provider = object(domain.provider_data);
            const records = Array.isArray(provider.records)
              ? provider.records
              : [];
            return (
              <article
                key={domain.id}
                className="rounded-2xl border border-white/10 bg-black/10 p-5"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row">
                  <div className="flex gap-3">
                    {domain.verification_status === "verified" ? (
                      <CheckCircle2 className="text-emerald-300" />
                    ) : (
                      <CircleDashed className="text-amber-200" />
                    )}
                    <div>
                      <p className="font-semibold">{domain.hostname}</p>
                      <p className="mt-1 text-xs capitalize text-white/40">
                        {domain.domain_type} · {domain.verification_status}
                        {domain.is_primary ? " · Primary" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(domain.verification_status !== "verified" ||
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
                    {domain.verification_status === "verified" &&
                      !domain.is_primary && (
                        <form action={setPrimaryDomain}>
                          <Hidden siteId={siteId} domainId={domain.id} />
                          <MiniButton>Make primary</MiniButton>
                        </form>
                      )}
                    {domain.domain_type === "custom" && !domain.is_primary && (
                      <form action={deleteDomain}>
                        <Hidden siteId={siteId} domainId={domain.id} />
                        <MiniButton danger>Remove</MiniButton>
                      </form>
                    )}
                  </div>
                </div>
                {domain.domain_type === "custom" &&
                  domain.verification_status !== "verified" && (
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
              </article>
            );
          })}
        </div>
      </section>
      <section className="glass mt-5 rounded-3xl p-6">
        <div className="flex items-center gap-3">
          <Globe2 className="text-[#ffc857]" />
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
          <button className="mt-auto min-h-11 rounded-xl bg-[#f5a623] px-5 font-semibold text-[#173028]">
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
      className={`min-h-9 rounded-lg border px-3 text-xs ${danger ? "border-red-300/20 text-red-200" : "border-white/15 text-white/70"}`}
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
