import Link from "next/link";
import { ArrowLeft, CornerDownRight, Trash2 } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { PageHead } from "../../experiences/page";
import { addRedirect, deleteRedirect } from "./actions";

export default async function Redirects({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const notice = await searchParams;
  const supabase = await createClient();
  const { data: redirects } = await supabase
    .from("redirects")
    .select("id,source_path,destination_path,status_code,created_at")
    .eq("site_id", siteId)
    .order("created_at", { ascending: false });
  return (
    <>
      <Link
        href={`/dashboard/sites/${siteId}/seo`}
        className="inline-flex items-center gap-2 text-sm text-white/50"
      >
        <ArrowLeft size={16} />
        SEO overview
      </Link>
      <div className="mt-4">
        <PageHead eyebrow="Technical SEO" title="Redirects" />
      </div>
      {(notice.message || notice.error) && (
        <p
          role={notice.error ? "alert" : "status"}
          className={`mt-5 rounded-xl p-3 text-sm ${notice.error ? "bg-red-400/10 text-red-100" : "bg-emerald-300/10 text-emerald-100"}`}
        >
          {notice.error ?? notice.message}
        </p>
      )}
      <section className="glass mt-8 rounded-3xl p-6">
        <h2 className="text-lg font-semibold">Add redirect</h2>
        <form
          action={addRedirect}
          className="mt-5 grid gap-4 md:grid-cols-[1fr_1fr_100px_auto] md:items-end"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <Field
            name="sourcePath"
            label="Source path"
            placeholder="/old-page"
          />
          <Field
            name="destinationPath"
            label="Destination"
            placeholder="/new-page"
          />
          <label className="text-sm">
            Type
            <select
              name="statusCode"
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#08271f] px-3"
            >
              <option value="301">301</option>
              <option value="302">302</option>
            </select>
          </label>
          <button className="min-h-11 rounded-xl bg-[#f5a623] px-5 font-semibold text-[#173028]">
            Add
          </button>
        </form>
      </section>
      <section className="glass mt-5 overflow-hidden rounded-3xl">
        <div className="border-b border-white/10 p-5">
          <h2 className="font-semibold">Active rules</h2>
          <p className="mt-1 text-sm text-white/40">
            Slug-change rules appear here too and are applied after the next
            publish.
          </p>
        </div>
        {(redirects ?? []).length ? (
          <div className="divide-y divide-white/10">
            {redirects!.map((item) => (
              <article
                className="flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                key={item.id}
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="rounded-lg bg-white/[.06] px-2 py-1 text-xs">
                    {item.status_code}
                  </span>
                  <p className="truncate text-sm">{item.source_path}</p>
                  <CornerDownRight
                    size={15}
                    className="shrink-0 text-white/30"
                  />
                  <p className="truncate text-sm text-white/55">
                    {item.destination_path}
                  </p>
                </div>
                <form action={deleteRedirect}>
                  <input type="hidden" name="siteId" value={siteId} />
                  <input type="hidden" name="redirectId" value={item.id} />
                  <button
                    aria-label={`Delete redirect from ${item.source_path}`}
                    className="grid size-9 place-items-center rounded-lg border border-red-300/15 text-red-200"
                  >
                    <Trash2 size={16} />
                  </button>
                </form>
              </article>
            ))}
          </div>
        ) : (
          <p className="p-8 text-center text-sm text-white/40">
            No redirects yet. Clean URLs can stay exactly where they are.
          </p>
        )}
      </section>
    </>
  );
}

function Field({
  name,
  label,
  placeholder,
}: {
  name: string;
  label: string;
  placeholder: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        required
        name={name}
        placeholder={placeholder}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
      />
    </label>
  );
}
