import Link from "next/link";
import { Package, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Empty, PageHead } from "../experiences/page";

export default async function PackagesPage({
  params,
}: {
  params: Promise<{ siteId: string }>;
}) {
  const { siteId } = await params;
  const supabase = await createClient();
  const { data: packages } = await supabase
    .from("packages")
    .select(
      "id,name,short_description,duration_days,price_from,currency,status,featured,updated_at,package_items(count)",
    )
    .eq("site_id", siteId)
    .neq("status", "archived")
    .order("updated_at", { ascending: false });
  return (
    <>
      <PageHead
        eyebrow="Operations"
        title="Packages"
        action={
          <Link
            href="/admin/packages/new"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#5BCD57] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} />
            Add package
          </Link>
        }
      />
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
        Compose multi-day products from existing tours and rentals while keeping
        one source of truth.
      </p>
      {packages?.length ? (
        <div className="mt-7 grid gap-4 lg:grid-cols-2">
          {packages.map((item) => (
            <Link
              key={item.id}
              href={`/admin/packages/${item.id}`}
              className="glass rounded-2xl p-5 transition hover:border-[#95EE8E]/40"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-[#95EE8E]/10 text-[#95EE8E]">
                  <Package />
                </span>
                <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs capitalize text-white/50">
                  {item.status === "published" ? "Active" : item.status}
                </span>
              </div>
              <h2 className="mt-5 text-lg font-semibold">{item.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/45">
                {item.short_description}
              </p>
              <div className="mt-5 flex flex-wrap gap-4 text-xs text-white/40">
                <span>
                  {item.duration_days
                    ? `${item.duration_days} days`
                    : "Flexible duration"}
                </span>
                <span>
                  {item.price_from == null
                    ? "Quote-based"
                    : `From ${item.currency} ${Number(item.price_from).toLocaleString()}`}
                </span>
                <span>{item.package_items?.[0]?.count ?? 0} items</span>
                {item.featured && (
                  <span className="text-[#95EE8E]">Featured</span>
                )}
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          icon={Package}
          title="No packages yet"
          copy="Create a package and attach existing tours or rentals without duplicating their content."
        />
      )}
    </>
  );
}
