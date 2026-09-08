"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Copy, ExternalLink, Plus, Save, Trash2 } from "lucide-react";
import {
  createCustomPage,
  deleteCustomPage,
  duplicatePage,
  updatePage,
} from "@/app/dashboard/sites/[siteId]/pages/actions";

type Page = {
  id: string;
  title: string;
  slug: string;
  page_type: string;
  status: "draft" | "published";
  show_in_navigation: boolean;
  navigation_label: string | null;
};
type SiteTemplate = {
  id: string;
  name: string;
  template_kind: string;
  subtype: string;
  version: number;
};
const input =
  "min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm outline-none focus:border-[#FFC857]";

export function PageManager({
  siteId,
  pages,
  templates,
}: {
  siteId: string;
  pages: Page[];
  templates: SiteTemplate[];
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  const run = (task: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const result = await task();
      setMessage(
        result.ok
          ? "Changes saved."
          : (result.error ?? "Could not save changes."),
      );
    });
  return (
    <div className="mt-8 space-y-5">
      <div className="glass flex flex-col gap-3 rounded-2xl p-4 sm:flex-row">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New custom page title"
          className={`${input} flex-1`}
        />
        <button
          disabled={pending || title.trim().length < 2}
          onClick={() =>
            run(async () => {
              const result = await createCustomPage({ siteId, title });
              if (result.ok) setTitle("");
              return result;
            })
          }
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028] disabled:opacity-40"
        >
          <Plus size={16} /> Add page
        </button>
      </div>
      {message && (
        <p aria-live="polite" className="text-sm text-white/55">
          {message}
        </p>
      )}
      <div className="grid gap-4">
        {pages.map((page) => (
          <PageCard
            key={page.id}
            page={page}
            siteId={siteId}
            run={run}
            pending={pending}
          />
        ))}
      </div>
      <section className="pt-4">
        <div className="mb-4">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#FFC857]">
            Dynamic pages
          </p>
          <h2 className="mt-2 text-xl font-semibold">
            Shared detail templates
          </h2>
          <p className="mt-1 max-w-2xl text-sm text-white/45">
            Template changes apply to matching experience, rental, taxonomy, or
            location pages after the next publish. Record content and SEO remain
            independent.
          </p>
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          {templates.map((template) => (
            <article className="glass rounded-2xl p-5" key={template.id}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold">{template.name}</h3>
                  <p className="mt-1 text-xs capitalize text-white/40">
                    {template.template_kind.replaceAll("_", " ")} ·{" "}
                    {template.subtype}
                    {" · "}version {template.version}
                  </p>
                </div>
                <Link
                  href={`/dashboard/sites/${siteId}/builder?target=${template.id}`}
                  className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm hover:bg-white/[.06]"
                >
                  Edit template <ExternalLink size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function PageCard({
  page,
  siteId,
  run,
  pending,
}: {
  page: Page;
  siteId: string;
  pending: boolean;
  run: (task: () => Promise<{ ok: boolean; error?: string }>) => void;
}) {
  const [title, setTitle] = useState(page.title);
  const [slug, setSlug] = useState(page.slug);
  const [label, setLabel] = useState(page.navigation_label ?? "");
  const [visible, setVisible] = useState(page.show_in_navigation);
  const [status, setStatus] = useState(page.status);
  const system =
    page.page_type === "home" || page.page_type.endsWith("_system");
  return (
    <article className="glass rounded-2xl p-5">
      <div className="grid gap-4 md:grid-cols-[1fr_1fr_1fr_auto]">
        <label className="text-xs text-white/50">
          Page title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className={`mt-2 w-full ${input}`}
          />
        </label>
        <label className="text-xs text-white/50">
          Slug
          <input
            value={slug}
            disabled={system}
            onChange={(event) => setSlug(event.target.value)}
            className={`mt-2 w-full ${input} disabled:opacity-45`}
          />
        </label>
        <label className="text-xs text-white/50">
          Navigation label
          <input
            value={label}
            onChange={(event) => setLabel(event.target.value)}
            placeholder={title}
            className={`mt-2 w-full ${input}`}
          />
        </label>
        <div className="flex items-end gap-2">
          <Link
            aria-label={`Edit ${title}`}
            href={`/dashboard/sites/${siteId}/builder?target=${page.id}`}
            className="grid size-10 place-items-center rounded-xl border border-white/10"
          >
            <ExternalLink size={16} />
          </Link>
          <button
            disabled={pending}
            aria-label={`Save ${title}`}
            onClick={() =>
              run(() =>
                updatePage({
                  siteId,
                  pageId: page.id,
                  title,
                  slug,
                  navigationLabel: label,
                  showInNavigation: visible,
                  status,
                }),
              )
            }
            className="grid size-10 place-items-center rounded-xl bg-[#F5A623] text-[#173028]"
          >
            <Save size={16} />
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-white/10 pt-4 text-sm">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={visible}
            onChange={(event) => setVisible(event.target.checked)}
          />{" "}
          In navigation
        </label>
        <label>
          Status{" "}
          <select
            value={status}
            onChange={(event) =>
              setStatus(event.target.value as "draft" | "published")
            }
            className="ml-2 rounded-lg bg-white/10 px-2 py-1"
          >
            <option className="text-black">draft</option>
            <option className="text-black">published</option>
          </select>
        </label>
        <span className="text-xs text-white/35">{page.page_type}</span>
        <div className="ml-auto flex gap-2">
          {!system && (
            <button
              onClick={() =>
                run(() => duplicatePage({ siteId, pageId: page.id }))
              }
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-white/55"
            >
              <Copy size={14} /> Duplicate
            </button>
          )}
          {page.page_type === "custom" && (
            <button
              onClick={() =>
                confirm(`Delete ${title}?`) &&
                run(() => deleteCustomPage({ siteId, pageId: page.id }))
              }
              className="inline-flex items-center gap-2 rounded-lg px-2 py-1 text-xs text-red-200"
            >
              <Trash2 size={14} /> Delete
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
