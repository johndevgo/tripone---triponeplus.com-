import Link from "next/link";
/* eslint-disable @next/next/no-img-element -- user media is served from the configured Supabase project. */
import { Compass, Plus, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function Experiences({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{
    q?: string;
    status?: string;
    featured?: string;
    type?: string;
    location?: string;
    message?: string;
  }>;
}) {
  const { siteId } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  let query = supabase
    .from("experiences")
    .select(
      "id,name,slug,experience_type,price_from,currency,status,location_name,featured,featured_image_url,updated_at",
    )
    .eq("site_id", siteId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });
  if (filters.q)
    query = query.ilike("name", `%${filters.q.replaceAll("%", "")}%`);
  if (filters.status) query = query.eq("status", filters.status);
  if (filters.type) query = query.eq("experience_type", filters.type);
  if (filters.location)
    query = query.ilike(
      "location_name",
      `%${filters.location.replaceAll("%", "")}%`,
    );
  if (filters.featured === "true") query = query.eq("featured", true);
  const { data: items } = await query;
  return (
    <>
      <PageHead
        eyebrow="Content"
        title="Experiences"
        action={
          <Link
            href={`/dashboard/sites/${siteId}/experiences/new`}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} /> Add experience
          </Link>
        }
      />
      <form className="glass mt-8 grid gap-3 rounded-2xl p-4 sm:grid-cols-2 lg:grid-cols-5">
        <input
          name="q"
          defaultValue={filters.q}
          placeholder="Search experiences"
          className="min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm"
        />
        <select
          name="status"
          defaultValue={filters.status}
          className="min-h-10 rounded-xl bg-white/10 px-3 text-sm"
        >
          <option value="" className="text-black">
            All statuses
          </option>
          <option className="text-black">draft</option>
          <option className="text-black">published</option>
        </select>
        <input
          name="type"
          defaultValue={filters.type}
          placeholder="Type"
          className="min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm"
        />
        <input
          name="location"
          defaultValue={filters.location}
          placeholder="Location"
          className="min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm"
        />
        <button className="min-h-10 rounded-xl border border-white/10 text-sm">
          Apply filters
        </button>
        <label className="flex items-center gap-2 text-xs text-white/50">
          <input
            type="checkbox"
            name="featured"
            value="true"
            defaultChecked={filters.featured === "true"}
          />{" "}
          Featured only
        </label>
      </form>
      {filters.message && (
        <p className="mt-4 text-sm text-emerald-300">{filters.message}</p>
      )}
      {items?.length ? (
        <div className="mt-6 grid gap-4">
          {items.map((item) => (
            <Link
              href={`/dashboard/sites/${siteId}/experiences/${item.id}`}
              className="glass grid gap-4 rounded-2xl p-4 transition hover:border-[#FFC857]/40 sm:grid-cols-[96px_1fr_auto] sm:items-center"
              key={item.id}
            >
              <div className="grid aspect-square place-items-center overflow-hidden rounded-xl bg-white/[.06]">
                {item.featured_image_url ? (
                  <>
                    <img
                      src={item.featured_image_url}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </>
                ) : (
                  <Compass className="text-white/25" />
                )}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-semibold">{item.name}</h2>
                  {item.featured && (
                    <Star size={14} className="fill-[#FFC857] text-[#FFC857]" />
                  )}
                </div>
                <p className="mt-1 text-sm text-white/40">
                  {item.experience_type}
                  {item.location_name ? ` · ${item.location_name}` : ""}
                </p>
                <p className="mt-2 text-xs text-white/30">
                  Updated {new Date(item.updated_at).toLocaleDateString()}
                </p>
              </div>
              <div className="text-sm sm:text-right">
                <p>
                  {item.price_from
                    ? `From ${item.currency} ${item.price_from}`
                    : "Price on request"}
                </p>
                <p className="mt-1 capitalize text-white/40">{item.status}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          icon={Compass}
          title="No experiences match"
          copy="Adjust the filters or add your first experience."
        />
      )}
    </>
  );
}

export function PageHead({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-[#FFC857]">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      </div>
      {action}
    </div>
  );
}
export function Empty({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Compass;
  title: string;
  copy: string;
}) {
  return (
    <div className="glass mt-8 grid min-h-72 place-items-center rounded-3xl p-8 text-center">
      <div>
        <Icon className="mx-auto text-[#FFC857]" />
        <h2 className="mt-5 text-xl font-semibold">{title}</h2>
        <p className="mt-2 text-sm text-white/45">{copy}</p>
      </div>
    </div>
  );
}
