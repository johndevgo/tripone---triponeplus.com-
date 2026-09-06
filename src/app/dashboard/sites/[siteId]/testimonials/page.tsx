import { Quote, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHead } from "../experiences/page";
import { deleteTestimonial, saveTestimonial } from "./actions";
export default async function Testimonials({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ edit?: string; message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const query = await searchParams;
  const supabase = await createClient();
  const { data: items } = await supabase
    .from("testimonials")
    .select("*")
    .eq("site_id", siteId)
    .order("sort_order");
  const editing = items?.find((item) => item.id === query.edit);
  return (
    <>
      <PageHead eyebrow="Trust content" title="Testimonials" />
      {(query.message || query.error) && (
        <p
          className={`mt-5 rounded-xl p-3 text-sm ${query.error ? "bg-red-400/10 text-red-100" : "bg-emerald-300/10 text-emerald-100"}`}
        >
          {query.error ?? query.message}
        </p>
      )}
      <div className="mt-8 grid gap-5 xl:grid-cols-[.8fr_1.2fr]">
        <section className="glass h-fit rounded-3xl p-6">
          <h2 className="font-semibold">
            {editing ? "Edit testimonial" : "Add real customer feedback"}
          </h2>
          <p className="mt-1 text-xs text-white/40">
            TripOne+ does not scrape, fabricate or independently verify reviews.
          </p>
          <form action={saveTestimonial} className="mt-5 grid gap-3">
            <input type="hidden" name="siteId" value={siteId} />
            <input
              type="hidden"
              name="testimonialId"
              value={editing?.id ?? ""}
            />
            <Field
              name="authorName"
              label="Author"
              value={editing?.author_name}
              required
            />
            <Field
              name="authorLocation"
              label="Location"
              value={editing?.author_location}
            />
            <label className="text-sm">
              Quote
              <textarea
                name="quote"
                rows={5}
                required
                defaultValue={editing?.quote}
                className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3"
              />
            </label>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                name="rating"
                label="Rating (optional)"
                value={editing?.rating?.toString()}
                type="number"
              />
              <Field name="source" label="Source" value={editing?.source} />
              <Field
                name="sourceUrl"
                label="Source URL"
                value={editing?.source_url}
                type="url"
              />
              <Field
                name="avatarUrl"
                label="Avatar URL"
                value={editing?.avatar_url}
                type="url"
              />
            </div>
            <label className="text-sm">
              Status
              <select
                name="status"
                defaultValue={editing?.status ?? "draft"}
                className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#08271f] px-3"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>
            <button className="min-h-11 rounded-xl bg-[#f5a623] font-semibold text-[#173028]">
              Save testimonial
            </button>
          </form>
        </section>
        <section className="glass overflow-hidden rounded-3xl">
          {items?.length ? (
            <div className="divide-y divide-white/10">
              {items.map((item) => (
                <article key={item.id} className="p-5">
                  <div className="flex justify-between gap-4">
                    <Quote className="shrink-0 text-emerald-300" />
                    <p className="flex-1 text-sm leading-6 text-white/65">
                      “{item.quote}”
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`?edit=${item.id}`}
                        className="rounded-lg border border-white/10 px-3 py-2 text-xs"
                      >
                        Edit
                      </a>
                      <form action={deleteTestimonial}>
                        <input type="hidden" name="siteId" value={siteId} />
                        <input
                          type="hidden"
                          name="testimonialId"
                          value={item.id}
                        />
                        <button
                          aria-label={`Delete testimonial by ${item.author_name}`}
                          className="grid size-9 place-items-center rounded-lg border border-red-300/15 text-red-200"
                        >
                          <Trash2 size={15} />
                        </button>
                      </form>
                    </div>
                  </div>
                  <p className="mt-3 pl-10 text-xs text-white/35">
                    {item.author_name}
                    {item.author_location ? ` · ${item.author_location}` : ""}
                    {item.rating ? ` · ${item.rating}/5` : ""} · {item.status}
                  </p>
                </article>
              ))}
            </div>
          ) : (
            <p className="p-8 text-center text-sm text-white/40">
              Add customer feedback only when you have permission to publish it.
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
        min={type === "number" ? 1 : undefined}
        max={type === "number" ? 5 : undefined}
        defaultValue={value ?? ""}
        required={required}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
      />
    </label>
  );
}
