import { Tags } from "lucide-react";
import { notFound } from "next/navigation";
import {
  archiveTaxonomyTerm,
  createTaxonomyTerm,
} from "../multi-service-actions";
import { createClient } from "@/lib/supabase/server";
import { taxonomyTypes, type TaxonomyType } from "@/lib/types";

const labels: Record<TaxonomyType, string> = {
  activity: "Activities",
  destination: "Destinations",
  travel_style: "Travel styles",
  package_category: "Package categories",
  product_category: "Product categories",
};

export default async function TaxonomiesPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ type?: string; message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const query = await searchParams;
  const activeType = taxonomyTypes.includes(query.type as TaxonomyType)
    ? (query.type as TaxonomyType)
    : "activity";
  const supabase = await createClient();
  const { data: taxonomies } = await supabase
    .from("taxonomies")
    .select("id,taxonomy_type,name,singular_name")
    .eq("site_id", siteId)
    .order("taxonomy_type");
  const active = taxonomies?.find(
    (taxonomy) => taxonomy.taxonomy_type === activeType,
  );
  if (!active) notFound();
  const { data: terms } = await supabase
    .from("taxonomy_terms")
    .select(
      "id,name,slug,parent_id,description,status,listing_mode,source_location_id",
    )
    .eq("site_id", siteId)
    .eq("taxonomy_id", active.id)
    .neq("status", "archived")
    .order("sort_order")
    .order("name");
  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-sm font-medium text-[#FFC857]">
        Information architecture
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Taxonomies</h1>
      <p className="mt-2 max-w-2xl text-white/45">
        Organize experiences and rentals without generating empty public pages.
        Terms remain draft until they have useful content and assignments.
      </p>
      <nav
        aria-label="Taxonomy type"
        className="mt-7 flex gap-2 overflow-x-auto pb-2"
      >
        {taxonomyTypes.map((type) => (
          <a
            key={type}
            href={`?type=${type}`}
            className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm ${type === activeType ? "bg-[#F5A623] font-semibold text-[#173028]" : "glass text-white/60"}`}
          >
            {labels[type]}
          </a>
        ))}
      </nav>
      {query.message && (
        <p className="mt-4 text-sm text-emerald-300">{query.message}</p>
      )}
      {query.error && (
        <p role="alert" className="mt-4 text-sm text-red-200">
          {query.error}
        </p>
      )}
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px]">
        <section className="space-y-3">
          {terms?.length ? (
            terms.map((term) => (
              <article
                key={term.id}
                className="glass flex items-start justify-between gap-4 rounded-2xl p-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">{term.name}</h2>
                    <span className="rounded-full bg-white/[.07] px-2 py-0.5 text-[11px] capitalize text-white/40">
                      {term.status}
                    </span>
                    {term.source_location_id && (
                      <span className="text-[11px] text-[#FFC857]">
                        Synced location
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-white/35">
                    /{activeType.replaceAll("_", "-")}/{term.slug}
                    {term.parent_id ? " · nested" : ""} · {term.listing_mode}
                  </p>
                  <p className="mt-2 line-clamp-2 text-sm text-white/50">
                    {term.description || "No landing-page description yet."}
                  </p>
                </div>
                {!term.source_location_id && (
                  <form action={archiveTaxonomyTerm}>
                    <input type="hidden" name="siteId" value={siteId} />
                    <input type="hidden" name="termId" value={term.id} />
                    <button className="rounded-lg px-3 py-2 text-xs text-white/35 hover:bg-white/[.06] hover:text-white">
                      Archive
                    </button>
                  </form>
                )}
              </article>
            ))
          ) : (
            <div className="glass grid min-h-64 place-items-center rounded-3xl p-8 text-center">
              <div>
                <Tags className="mx-auto text-[#FFC857]" />
                <h2 className="mt-4 font-semibold">
                  No {labels[activeType].toLowerCase()} yet
                </h2>
                <p className="mt-2 text-sm text-white/40">
                  Create only terms that help visitors browse real inventory.
                </p>
              </div>
            </div>
          )}
        </section>
        <form
          action={createTaxonomyTerm}
          className="glass h-fit rounded-3xl p-5"
        >
          <h2 className="text-lg font-semibold">
            Add {active.singular_name.toLowerCase()}
          </h2>
          <input type="hidden" name="siteId" value={siteId} />
          <input type="hidden" name="taxonomyId" value={active.id} />
          <input type="hidden" name="taxonomyType" value={activeType} />
          <Field label="Name" name="name" required />
          <Field label="Slug (optional)" name="slug" />
          <label className="mt-4 block text-sm text-white/65">
            Parent
            <select
              name="parentId"
              className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-[#0b3027] px-3"
            >
              <option value="">Top level</option>
              {terms?.map((term) => (
                <option key={term.id} value={term.id}>
                  {term.name}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-4 block text-sm text-white/65">
            Description
            <textarea
              name="description"
              rows={5}
              className="mt-2 w-full rounded-xl border border-white/15 bg-white/[.06] p-3"
            />
          </label>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm text-white/65">
              Listing
              <select
                name="listingMode"
                className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-[#0b3027] px-3"
              >
                <option>automatic</option>
                <option>manual</option>
              </select>
            </label>
            <label className="text-sm text-white/65">
              Status
              <select
                name="status"
                className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-[#0b3027] px-3"
              >
                <option>draft</option>
                <option>published</option>
              </select>
            </label>
          </div>
          <button className="mt-5 min-h-11 w-full rounded-xl bg-[#F5A623] font-semibold text-[#173028]">
            Create term
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  required,
}: {
  label: string;
  name: string;
  required?: boolean;
}) {
  return (
    <label className="mt-4 block text-sm text-white/65">
      {label}
      <input
        name={name}
        required={required}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-white/[.06] px-3"
      />
    </label>
  );
}
