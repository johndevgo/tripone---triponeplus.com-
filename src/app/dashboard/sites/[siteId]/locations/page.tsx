import { MapPin, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHead } from "../experiences/page";
import { deleteLocation, saveLocation } from "./actions";

export default async function Locations({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ edit?: string; message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const [{ data: locations }, { data: experiences }] = await Promise.all([
    supabase.from("locations").select("*").eq("site_id", siteId).order("name"),
    supabase.from("experiences").select("location_name").eq("site_id", siteId),
  ]);
  const editing = locations?.find((item) => item.id === query.edit);
  return (
    <>
      <PageHead eyebrow="Destination content" title="Locations" />
      {(query.message || query.error) && (
        <p
          className={`mt-5 rounded-xl p-3 text-sm ${query.error ? "bg-red-400/10 text-red-100" : "bg-emerald-300/10 text-emerald-100"}`}
        >
          {query.error ?? query.message}
        </p>
      )}
      <div className="mt-8 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <section className="glass h-fit rounded-3xl p-6">
          <h2 className="text-lg font-semibold">
            {editing ? "Edit location" : "Add location"}
          </h2>
          <p className="mt-1 text-xs text-white/40">
            Public pages require at least 120 characters of useful description.
          </p>
          <form action={saveLocation} className="mt-5 grid gap-3">
            <input type="hidden" name="siteId" value={siteId} />
            <input type="hidden" name="locationId" value={editing?.id ?? ""} />
            <Field name="name" label="Name" value={editing?.name} required />
            <Field name="slug" label="Slug" value={editing?.slug} />
            <label className="text-sm">
              Description
              <textarea
                required
                minLength={40}
                maxLength={10000}
                rows={6}
                name="description"
                defaultValue={editing?.description}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field name="city" label="City" value={editing?.city} />
              <Field name="region" label="Region" value={editing?.region} />
              <Field name="country" label="Country" value={editing?.country} />
              <Field
                name="imageUrl"
                label="Image URL"
                value={editing?.image_url}
                type="url"
              />
              <Field
                name="latitude"
                label="Latitude"
                value={editing?.latitude?.toString()}
                type="number"
              />
              <Field
                name="longitude"
                label="Longitude"
                value={editing?.longitude?.toString()}
                type="number"
              />
            </div>
            <Field
              name="seoTitle"
              label="SEO title"
              value={text(object(editing?.seo_settings).title)}
            />
            <Field
              name="seoDescription"
              label="SEO description"
              value={text(object(editing?.seo_settings).description)}
            />
            <button className="min-h-11 rounded-xl bg-[#f5a623] font-semibold text-[#173028]">
              Save location
            </button>
          </form>
        </section>
        <section className="glass overflow-hidden rounded-3xl">
          <div className="border-b border-white/10 p-5">
            <h2 className="font-semibold">Destinations</h2>
          </div>
          {locations?.length ? (
            <div className="divide-y divide-white/10">
              {locations.map((item) => {
                const linked =
                  experiences?.filter((exp) => exp.location_name === item.name)
                    .length ?? 0;
                return (
                  <article
                    className="flex items-center justify-between gap-4 p-5"
                    key={item.id}
                  >
                    <div className="flex min-w-0 gap-3">
                      <MapPin className="shrink-0 text-emerald-300" />
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="mt-1 text-xs text-white/35">
                          {item.description.length >= 120
                            ? "Publish-ready"
                            : "Needs more content"}{" "}
                          · {linked} related experiences
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <a
                        href={`?edit=${item.id}`}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs"
                      >
                        Edit
                      </a>
                      <form action={deleteLocation}>
                        <input type="hidden" name="siteId" value={siteId} />
                        <input
                          type="hidden"
                          name="locationId"
                          value={item.id}
                        />
                        <button
                          aria-label={`Delete ${item.name}`}
                          className="grid size-9 place-items-center rounded-lg border border-red-300/15 text-red-200"
                        >
                          <Trash2 size={15} />
                        </button>
                      </form>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-white/40">
              Add a useful destination page when you have enough original
              information to help visitors.
            </p>
          )}
        </section>
      </div>
    </>
  );
}
function Field({
  name,
  label,
  value,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  value?: string | null;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        step={type === "number" ? "any" : undefined}
        defaultValue={value ?? ""}
        required={required}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
      />
    </label>
  );
}
function object(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
function text(value: unknown) {
  return typeof value === "string" ? value : "";
}
