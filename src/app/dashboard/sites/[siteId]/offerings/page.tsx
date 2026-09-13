import Link from "next/link";
import { Boxes, Compass, Package, Plus, Search } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHead, Empty } from "../experiences/page";

type Offering = {
  id: string;
  name: string;
  kind: "experience" | "rental" | "package";
  subtype: string;
  status: string;
  price: number | null;
  currency: string;
  updatedAt: string;
  href: string;
};

export default async function OfferingsPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ q?: string; kind?: string; status?: string }>;
}) {
  const { siteId } = await params;
  const filters = await searchParams;
  const supabase = await createClient();
  const [{ data: experiences }, { data: rentals }, { data: packages }] =
    await Promise.all([
      supabase
        .from("experiences")
        .select("id,name,experience_type,status,price_from,currency,updated_at")
        .eq("site_id", siteId)
        .neq("status", "archived"),
      supabase
        .from("rental_products")
        .select(
          "id,name,rental_type,status,currency,updated_at,rental_rates(amount)",
        )
        .eq("site_id", siteId)
        .neq("status", "archived"),
      supabase
        .from("packages")
        .select("id,name,status,price_from,currency,updated_at")
        .eq("site_id", siteId)
        .neq("status", "archived"),
    ]);
  const rows: Offering[] = [
    ...(experiences ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      kind: "experience" as const,
      subtype: item.experience_type,
      status: item.status,
      price: item.price_from == null ? null : Number(item.price_from),
      currency: item.currency,
      updatedAt: item.updated_at,
      href: `/dashboard/sites/${siteId}/experiences/${item.id}`,
    })),
    ...(rentals ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      kind: "rental" as const,
      subtype: item.rental_type.replaceAll("_", " "),
      status: item.status,
      price:
        item.rental_rates?.[0]?.amount == null
          ? null
          : Number(item.rental_rates[0].amount),
      currency: item.currency,
      updatedAt: item.updated_at,
      href: `/dashboard/sites/${siteId}/rentals/${item.id}`,
    })),
    ...(packages ?? []).map((item) => ({
      id: item.id,
      name: item.name,
      kind: "package" as const,
      subtype: "travel package",
      status: item.status,
      price: item.price_from == null ? null : Number(item.price_from),
      currency: item.currency,
      updatedAt: item.updated_at,
      href: `/dashboard/sites/${siteId}/packages/${item.id}`,
    })),
  ]
    .filter(
      (item) =>
        (!filters.q ||
          item.name.toLowerCase().includes(filters.q.toLowerCase())) &&
        (!filters.kind || item.kind === filters.kind) &&
        (!filters.status || item.status === filters.status),
    )
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  return (
    <>
      <PageHead
        eyebrow="Operations"
        title="Products & Services"
        action={
          <div className="flex flex-wrap gap-2">
            <AddLink
              href={`/dashboard/sites/${siteId}/experiences/new`}
              label="Tour / activity"
            />
            <AddLink
              href={`/dashboard/sites/${siteId}/rentals/new`}
              label="Rental"
            />
            <AddLink
              href={`/dashboard/sites/${siteId}/packages/new`}
              label="Package"
            />
          </div>
        }
      />
      <p className="mt-3 max-w-3xl text-sm leading-6 text-white/50">
        One operational catalogue for bookable tours, activities, packages and
        physical rentals. Each type keeps the fields and rules it actually
        needs.
      </p>
      <form className="glass mt-7 grid gap-3 rounded-2xl p-4 sm:grid-cols-[1fr_180px_180px_auto]">
        <label className="relative">
          <span className="sr-only">Search products and services</span>
          <Search className="absolute left-3 top-3 text-white/30" size={17} />
          <input
            name="q"
            defaultValue={filters.q}
            placeholder="Search products and services"
            className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[.05] pl-10 pr-3"
          />
        </label>
        <Filter
          name="kind"
          value={filters.kind}
          options={["experience", "rental", "package"]}
          empty="All types"
        />
        <Filter
          name="status"
          value={filters.status}
          options={["draft", "published"]}
          empty="All statuses"
        />
        <button className="min-h-11 rounded-xl border border-white/12 px-4 text-sm font-medium">
          Filter
        </button>
      </form>
      {rows.length ? (
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[.035]">
          <div className="hidden grid-cols-[1fr_150px_130px_150px] gap-4 border-b border-white/10 px-5 py-3 text-xs uppercase tracking-[.12em] text-white/35 md:grid">
            <span>Offering</span>
            <span>Status</span>
            <span>Price</span>
            <span>Updated</span>
          </div>
          {rows.map((item) => (
            <Link
              key={`${item.kind}-${item.id}`}
              href={item.href}
              className="grid gap-3 border-b border-white/[.07] px-5 py-4 transition last:border-0 hover:bg-white/[.05] md:grid-cols-[1fr_150px_130px_150px] md:items-center"
            >
              <div className="flex items-center gap-3">
                <span className="grid size-10 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
                  {item.kind === "package" ? (
                    <Package size={18} />
                  ) : item.kind === "rental" ? (
                    <Boxes size={18} />
                  ) : (
                    <Compass size={18} />
                  )}
                </span>
                <div>
                  <strong className="block">{item.name}</strong>
                  <span className="text-xs capitalize text-white/40">
                    {item.kind} · {item.subtype}
                  </span>
                </div>
              </div>
              <span className="w-fit rounded-full border border-white/10 px-2.5 py-1 text-xs capitalize text-white/60">
                {item.status === "published" ? "Active" : item.status}
              </span>
              <span className="text-sm text-white/65">
                {item.price == null
                  ? "Request quote"
                  : `${item.currency} ${item.price.toLocaleString()}`}
              </span>
              <span className="text-sm text-white/40">
                {new Date(item.updatedAt).toLocaleDateString()}
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <Empty
          icon={Boxes}
          title="No products match"
          copy="Adjust the filters or add a tour, activity, rental or package."
        />
      )}
    </>
  );
}

function AddLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#F5A623] px-3 text-xs font-semibold text-[#173028]"
    >
      <Plus size={15} />
      {label}
    </Link>
  );
}
function Filter({
  name,
  value,
  options,
  empty,
}: {
  name: string;
  value?: string;
  options: string[];
  empty: string;
}) {
  return (
    <select
      name={name}
      defaultValue={value}
      className="min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3 text-sm"
    >
      <option value="">{empty}</option>
      {options.map((option) => (
        <option key={option} value={option} className="capitalize">
          {option}
        </option>
      ))}
    </select>
  );
}
