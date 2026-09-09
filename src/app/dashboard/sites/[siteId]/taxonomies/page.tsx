import { Tags } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  archiveTaxonomyTerm,
  createTaxonomyTerm,
  saveTaxonomyTerm,
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
      "id,name,slug,parent_id,description,hero_image_url,seo_settings,status,listing_mode,source_location_id,template_id",
    )
    .eq("site_id", siteId)
    .eq("taxonomy_id", active.id)
    .neq("status", "archived")
    .order("sort_order")
    .order("name");
  const { data: taxonomyTemplates } = await supabase
    .from("site_templates")
    .select("id,subtype")
    .eq("site_id", siteId)
    .eq("template_kind", "taxonomy_landing");
  const defaultTemplate =
    taxonomyTemplates?.find((template) => template.subtype === activeType) ??
    taxonomyTemplates?.find((template) => template.subtype === "default");
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
              <article key={term.id} className="glass rounded-2xl p-4">
                <div className="flex items-start justify-between gap-4">
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
                      {termPath(terms, term, activeType)}
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
                </div>
                {term.source_location_id ? (
                  <Link
                    href={`/dashboard/sites/${siteId}/locations`}
                    className="mt-4 inline-flex rounded-lg border border-white/10 px-3 py-2 text-xs text-[#FFC857]"
                  >
                    Edit from Locations
                  </Link>
                ) : (
                  <details className="mt-4 border-t border-white/10 pt-4">
                    <summary className="cursor-pointer text-sm font-medium text-[#FFC857]">
                      Edit landing page and SEO
                    </summary>
                    <form
                      action={saveTaxonomyTerm}
                      className="mt-4 grid gap-4 sm:grid-cols-2"
                    >
                      <input type="hidden" name="siteId" value={siteId} />
                      <input type="hidden" name="termId" value={term.id} />
                      <input
                        type="hidden"
                        name="taxonomyId"
                        value={active.id}
                      />
                      <input
                        type="hidden"
                        name="taxonomyType"
                        value={activeType}
                      />
                      <Field
                        label="Title"
                        name="name"
                        value={term.name}
                        required
                      />
                      <Field
                        label="Slug"
                        name="slug"
                        value={term.slug}
                        required
                      />
                      <label className="text-sm text-white/65">
                        Parent
                        <select
                          name="parentId"
                          defaultValue={term.parent_id ?? ""}
                          className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-[#0b3027] px-3"
                        >
                          <option value="">Top level</option>
                          {terms
                            .filter((candidate) => candidate.id !== term.id)
                            .map((candidate) => (
                              <option key={candidate.id} value={candidate.id}>
                                {candidate.name}
                              </option>
                            ))}
                        </select>
                      </label>
                      <Field
                        label="Hero image URL"
                        name="heroImageUrl"
                        value={term.hero_image_url ?? ""}
                      />
                      <label className="text-sm text-white/65 sm:col-span-2">
                        Landing-page introduction
                        <textarea
                          name="description"
                          defaultValue={term.description}
                          rows={5}
                          className="mt-2 w-full rounded-xl border border-white/15 bg-white/[.06] p-3"
                        />
                      </label>
                      <Field
                        label="SEO title"
                        name="seoTitle"
                        value={setting(term.seo_settings, "title")}
                      />
                      <Field
                        label="Meta description"
                        name="seoDescription"
                        value={setting(term.seo_settings, "description")}
                      />
                      <label className="text-sm text-white/65">
                        Listing
                        <select
                          name="listingMode"
                          defaultValue={term.listing_mode}
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
                          defaultValue={term.status}
                          className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-[#0b3027] px-3"
                        >
                          <option>draft</option>
                          <option>published</option>
                        </select>
                      </label>
                      <div className="flex flex-wrap gap-3 sm:col-span-2">
                        <button className="min-h-10 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]">
                          Save landing page
                        </button>
                        <Link
                          href={`/dashboard/sites/${siteId}/builder?target=${term.id}`}
                          className="inline-flex min-h-10 items-center rounded-xl border border-white/10 px-4 text-sm"
                        >
                          Customize this page
                        </Link>
                        <Link
                          href={`/dashboard/sites/${siteId}/builder?target=${term.template_id ?? defaultTemplate?.id ?? ""}`}
                          className="inline-flex min-h-10 items-center rounded-xl border border-white/10 px-4 text-sm text-white/60"
                        >
                          Edit shared template
                        </Link>
                      </div>
                    </form>
                  </details>
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
  value,
}: {
  label: string;
  name: string;
  required?: boolean;
  value?: string;
}) {
  return (
    <label className="mt-4 block text-sm text-white/65">
      {label}
      <input
        name={name}
        required={required}
        defaultValue={value}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/15 bg-white/[.06] px-3"
      />
    </label>
  );
}

function setting(value: unknown, key: string) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  const found = (value as Record<string, unknown>)[key];
  return typeof found === "string" ? found : "";
}

function termPath(
  terms: Array<{ id: string; slug: string; parent_id: string | null }>,
  term: { id: string; slug: string; parent_id: string | null },
  type: TaxonomyType,
) {
  const bases: Record<TaxonomyType, string> = {
    activity: "activities",
    destination: "destinations",
    travel_style: "travel-styles",
    package_category: "package-categories",
    product_category: "rental-categories",
  };
  const slugs = [term.slug];
  const visited = new Set([term.id]);
  let parentId = term.parent_id;
  while (parentId) {
    const parent = terms.find((candidate) => candidate.id === parentId);
    if (!parent || visited.has(parent.id)) break;
    visited.add(parent.id);
    slugs.unshift(parent.slug);
    parentId = parent.parent_id;
  }
  return `/${bases[type]}/${slugs.join("/")}`;
}
