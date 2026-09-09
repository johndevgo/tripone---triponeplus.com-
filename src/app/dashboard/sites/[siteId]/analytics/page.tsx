import Link from "next/link";
import { BarChart3, Eye, MousePointerClick, Send, Users } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { summarizeEvents } from "@/lib/analytics/schema";
import { PageHead } from "../experiences/page";

export default async function Analytics({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ range?: string }>;
}) {
  const { siteId } = await params;
  const query = await searchParams;
  const days = query.range === "90" ? 90 : query.range === "7" ? 7 : 30;
  // This request-time dashboard intentionally anchors relative date ranges to now.
  // eslint-disable-next-line react-hooks/purity
  const since = new Date(Date.now() - days * 86_400_000).toISOString();
  const supabase = await createClient();
  const [{ data: events }, { data: experiences }] = await Promise.all([
    supabase
      .from("analytics_events")
      .select(
        "event_name,page_path,session_id,created_at,experience_id,rental_product_id",
      )
      .eq("site_id", siteId)
      .gte("created_at", since)
      .order("created_at", { ascending: true })
      .limit(10_000),
    supabase.from("experiences").select("id,name").eq("site_id", siteId),
  ]);
  const rows = events ?? [];
  const summary = summarizeEvents(rows);
  const names = new Map(
    (experiences ?? []).map((item) => [item.id, item.name]),
  );
  const cards = [
    [Users, "Sessions", summary.sessions],
    [Eye, "Page views", summary.pageViews],
    [MousePointerClick, "Booking clicks", summary.bookingClicks],
    [Send, "Lead submissions", summary.leads],
  ] as const;
  const trend = dailyTrend(rows, days);
  const max = Math.max(1, ...trend.map((item) => item.views));
  const topPages = rank(
    rows
      .filter((item) => item.event_name === "page_view")
      .map((item) => item.page_path),
  );
  const topExperienceIds = rank(
    rows
      .filter(
        (item) => item.event_name === "booking_click" && item.experience_id,
      )
      .map((item) => item.experience_id!),
  );
  return (
    <>
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <PageHead eyebrow="Privacy-first insights" title="Analytics" />
        <nav
          aria-label="Analytics date range"
          className="flex rounded-xl border border-white/10 p-1"
        >
          {[7, 30, 90].map((range) => (
            <Link
              key={range}
              href={`?range=${range}`}
              className={`rounded-lg px-3 py-2 text-xs ${days === range ? "bg-white/10 text-white" : "text-white/45"}`}
            >
              {range} days
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(([Icon, label, value]) => (
          <article className="glass rounded-2xl p-5" key={label}>
            <Icon size={19} className="text-emerald-300" />
            <p className="mt-5 text-3xl font-semibold">{value}</p>
            <p className="mt-1 text-sm text-white/45">{label}</p>
          </article>
        ))}
      </div>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <Metric
          label="Booking click-through rate"
          value={`${summary.bookingCtr.toFixed(1)}%`}
          hint="Booking clicks ÷ page views"
        />
        <Metric
          label="Lead conversion rate"
          value={`${summary.leadConversion.toFixed(1)}%`}
          hint="Lead submissions ÷ page views"
        />
      </div>
      <p className="mt-4 text-sm text-white/45">
        {summary.experienceViews} experience views · {summary.rentalViews}{" "}
        rental product views
      </p>
      {rows.length === 0 ? (
        <section className="glass mt-5 grid min-h-72 place-items-center rounded-3xl p-8 text-center">
          <div>
            <BarChart3 className="mx-auto text-[#ffc857]" />
            <h2 className="mt-4 text-xl font-semibold">No visitor data yet</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-white/45">
              Publish the website and share its live hostname. Page views and
              conversion actions will appear here without storing full IP
              addresses.
            </p>
          </div>
        </section>
      ) : (
        <>
          <section className="glass mt-5 rounded-3xl p-6">
            <h2 className="font-semibold">Page-view trend</h2>
            <div
              className="mt-7 flex h-48 items-end gap-1"
              aria-label={`Page views over ${days} days`}
            >
              {trend.map((item) => (
                <div
                  key={item.date}
                  title={`${item.date}: ${item.views}`}
                  className="group relative flex-1 rounded-t bg-emerald-300/35 hover:bg-[#ffc857]"
                  style={{
                    height: `${Math.max(3, (item.views / max) * 100)}%`,
                  }}
                >
                  <span className="sr-only">
                    {item.date}: {item.views}
                  </span>
                </div>
              ))}
            </div>
          </section>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <Ranking
              title="Top pages"
              rows={topPages.map(([key, count]) => [key, count])}
            />
            <Ranking
              title="Top booking-click experiences"
              rows={topExperienceIds.map(([key, count]) => [
                names.get(key) ?? "Deleted experience",
                count,
              ])}
            />
          </div>
        </>
      )}
      <p className="mt-5 text-xs text-white/35">
        Events are capped at 10,000 rows for this dashboard range. TripOne+ does
        not store full IP addresses or lead messages in analytics.
      </p>
    </>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <article className="glass rounded-2xl p-5">
      <p className="text-sm text-white/45">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      <p className="mt-1 text-xs text-white/30">{hint}</p>
    </article>
  );
}
function Ranking({
  title,
  rows,
}: {
  title: string;
  rows: Array<[string, number]>;
}) {
  return (
    <section className="glass rounded-3xl p-6">
      <h2 className="font-semibold">{title}</h2>
      <div className="mt-5 grid gap-3">
        {rows.length ? (
          rows.slice(0, 8).map(([label, count], index) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 text-sm"
            >
              <span className="truncate text-white/60">
                {index + 1}. {label}
              </span>
              <strong>{count}</strong>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/35">No matching events yet.</p>
        )}
      </div>
    </section>
  );
}
function rank(values: string[]): Array<[string, number]> {
  const counts = new Map<string, number>();
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1));
  return [...counts].sort((a, b) => b[1] - a[1]);
}
function dailyTrend(
  events: Array<{ event_name: string; created_at: string }>,
  days: number,
) {
  const counts = new Map<string, number>();
  events
    .filter((item) => item.event_name === "page_view")
    .forEach((item) => {
      const date = item.created_at.slice(0, 10);
      counts.set(date, (counts.get(date) ?? 0) + 1);
    });
  return Array.from({ length: days }, (_, offset) => {
    const date = new Date(Date.now() - (days - offset - 1) * 86_400_000)
      .toISOString()
      .slice(0, 10);
    return { date, views: counts.get(date) ?? 0 };
  });
}
