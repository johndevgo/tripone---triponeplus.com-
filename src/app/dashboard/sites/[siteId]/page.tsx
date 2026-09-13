import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  Box,
  CheckCircle2,
  Circle,
  Eye,
  PackagePlus,
  Users,
} from "lucide-react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { oneRelation } from "@/lib/operations/relations";
import { currentPublicSiteUrl } from "@/lib/tenancy/public-url";
export default async function SiteOverview({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  const todayBoundary = today.toISOString().slice(0, 10);
  const tomorrowBoundary = tomorrow.toISOString().slice(0, 10);
  const [
    { data: site },
    { count: pages },
    { count: allExperiences },
    { count: leads },
    { count: rentals },
    { count: packages },
    { count: todayBookings },
    { count: pendingBookings },
    { data: upcomingBookings },
    { data: domains },
  ] = await Promise.all([
    supabase
      .from("sites")
      .select(
        "id,name,slug,status,theme_id,published_at,businesses(city,country)",
      )
      .eq("id", siteId)
      .single(),
    supabase
      .from("pages")
      .select("id", { count: "exact", head: true })
      .eq("site_id", siteId),
    supabase
      .from("experiences")
      .select("id", { count: "exact", head: true })
      .eq("site_id", siteId),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("site_id", siteId),
    supabase
      .from("rental_products")
      .select("id", { count: "exact", head: true })
      .eq("site_id", siteId)
      .neq("status", "archived"),
    supabase
      .from("packages")
      .select("id", { count: "exact", head: true })
      .eq("site_id", siteId)
      .neq("status", "archived"),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("site_id", siteId)
      .gte("starts_at", todayBoundary)
      .lt("starts_at", tomorrowBoundary),
    supabase
      .from("bookings")
      .select("id", { count: "exact", head: true })
      .eq("site_id", siteId)
      .in("status", ["pending", "awaiting_confirmation"]),
    supabase
      .from("bookings")
      .select(
        "id,reference,starts_at,status,customers(name),experiences(name),rental_products(name),packages(name)",
      )
      .eq("site_id", siteId)
      .in("status", ["pending", "awaiting_confirmation", "confirmed"])
      .gte("starts_at", today.toISOString())
      .order("starts_at")
      .limit(5),
    supabase
      .from("domains")
      .select("hostname,verification_status,is_primary")
      .eq("site_id", siteId),
  ]);
  if (!site) notFound();
  const cards = [
    [CalendarDays, "Today's bookings", todayBookings ?? 0],
    [Circle, "Pending confirmation", pendingBookings ?? 0],
    [Users, "Leads", leads ?? 0],
    [
      Box,
      "Active services",
      (allExperiences ?? 0) + (rentals ?? 0) + (packages ?? 0),
    ],
    [PackagePlus, "Website pages", pages ?? 0],
  ] as const;
  return (
    <>
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-[#FFC857]">Overview</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
            {site.name}
          </h1>
          <p className="mt-2 text-white/45">
            {currentPublicSiteUrl(site.slug, domains ?? [])} ·{" "}
            <span className="capitalize">{site.status}</span>
          </p>
        </div>
        <Link
          href={`/preview/${site.id}`}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#F5A623] px-5 text-sm font-semibold text-[#173028]"
        >
          Preview website <ArrowUpRight size={17} />
        </Link>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map(([Icon, label, n]) => (
          <article className="glass rounded-2xl p-5" key={label}>
            <Icon className="text-emerald-300" size={20} />
            <p className="mt-6 text-3xl font-semibold">{n}</p>
            <p className="mt-1 text-sm text-white/45">{label}</p>
          </article>
        ))}
      </div>
      <section className="glass mt-5 rounded-3xl p-5">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-semibold">Quick actions</h2>
            <p className="mt-1 text-xs text-white/40">
              Common operator workflows
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Quick href="/admin/offerings" label="Add service" />
            <Quick href="/admin/bookings/new" label="Add booking" />
            <Quick href="/admin/leads#add-lead" label="Add lead" />
            <Quick href="/admin/calendar" label="Open calendar" />
            <Quick href="/admin/website" label="Edit website" />
          </div>
        </div>
      </section>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1.3fr_.7fr]">
        <section className="glass overflow-hidden rounded-3xl">
          <div className="flex items-center justify-between border-b border-white/10 p-5">
            <div>
              <h2 className="font-semibold">Website preview</h2>
              <p className="mt-1 text-xs text-white/40">
                Your shared production renderer
              </p>
            </div>
            <Eye className="text-[#FFC857]" />
          </div>
          <div className="m-4 grid min-h-72 place-items-center rounded-2xl bg-[linear-gradient(135deg,#087A5A,#022C22)] p-8 text-center">
            <div>
              <p className="text-xs uppercase tracking-[.2em] text-[#FFC857]">
                {site.theme_id}
              </p>
              <h3 className="mt-3 text-3xl font-semibold">{site.name}</h3>
              <Link
                className="mt-6 inline-flex rounded-xl bg-white px-4 py-2 text-sm font-semibold text-[#063D2E]"
                href={`/preview/${site.id}`}
              >
                Open preview
              </Link>
            </div>
          </div>
        </section>
        <div className="grid gap-5">
          <section className="glass rounded-3xl p-6">
            <h2 className="font-semibold">Upcoming work</h2>
            <div className="mt-5 grid gap-3">
              {upcomingBookings?.length ? (
                upcomingBookings.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/admin/bookings/${booking.id}`}
                    className="rounded-xl border border-white/10 p-3 text-sm hover:bg-white/[.04]"
                  >
                    <strong className="block">
                      {oneRelation(booking.experiences)?.name ??
                        oneRelation(booking.rental_products)?.name ??
                        oneRelation(booking.packages)?.name ??
                        "Service"}
                    </strong>
                    <span className="mt-1 block text-xs text-white/40">
                      {new Date(booking.starts_at).toLocaleString()} ·{" "}
                      {oneRelation(booking.customers)?.name ??
                        "Unknown customer"}{" "}
                      · {booking.reference}
                    </span>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-white/40">
                  No upcoming bookings yet.
                </p>
              )}
            </div>
          </section>
          <section className="glass rounded-3xl p-6">
            <h2 className="font-semibold">Setup checklist</h2>
            <div className="mt-6 space-y-5">
              {[
                [true, "Website structure created"],
                [(allExperiences ?? 0) > 0, "Add an experience"],
                [false, "Review SEO details"],
                [site.status === "published", "Publish website"],
              ].map(([done, text]) => (
                <div className="flex gap-3 text-sm" key={String(text)}>
                  {done ? (
                    <CheckCircle2 className="text-emerald-300" size={19} />
                  ) : (
                    <Circle className="text-white/25" size={19} />
                  )}
                  <span className={done ? "text-white/70" : "text-white/45"}>
                    {String(text)}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
function Quick({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-9 items-center gap-2 rounded-xl border border-white/10 px-3 text-xs text-white/60 hover:border-[#FFC857]/40 hover:text-white"
    >
      <PackagePlus size={14} />
      {label}
    </Link>
  );
}
