"use client";
import { useState, useTransition } from "react";
import { Check, CircleAlert, Save } from "lucide-react";
import {
  scoreCro,
  scoreSeo,
  type ReadinessScore,
} from "@/lib/readiness/scores";
import type { SiteSection } from "@/lib/types";
import {
  saveCroSettings,
  savePageSeo,
  saveSiteSeo,
} from "@/app/dashboard/sites/[siteId]/seo/actions";

type Page = {
  id: string;
  title: string;
  slug: string;
  sections: SiteSection[];
  seo_settings: Record<string, unknown>;
};
const input =
  "mt-2 min-h-10 w-full rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm outline-none focus:border-[#FFC857]";
export function SeoDashboard({
  siteId,
  pages,
  siteSeo,
  ogImage,
  cro,
  experienceStats,
  hasContact,
}: {
  siteId: string;
  pages: Page[];
  siteSeo: Record<string, unknown>;
  ogImage: string;
  cro: Record<string, unknown>;
  experienceStats: {
    hasPrice: boolean;
    hasDuration: boolean;
    bookingUrl: string | null;
    galleryCount: number;
    hasCancellation: boolean;
    hasLocation: boolean;
    hasInclusions: boolean;
  };
  hasContact: boolean;
}) {
  const [active, setActive] = useState(pages[0]);
  const [message, setMessage] = useState("");
  const [, start] = useTransition();
  if (!active) return <p>No pages are available.</p>;
  const seo = active.seo_settings;
  const score = scoreSeo({
    title: String(seo.title ?? active.title),
    description: String(seo.description ?? ""),
    canonical: String(seo.canonicalPath ?? `/${active.slug}`),
    indexable: seo.indexable !== false,
    slug: active.slug,
    sections: active.sections,
    images: [],
    hasBreadcrumbs: true,
  });
  const croScore = scoreCro({
    sections: active.sections,
    hasPrice: experienceStats.hasPrice,
    hasDuration: experienceStats.hasDuration,
    hasContact,
    bookingUrl: experienceStats.bookingUrl,
    stickyMobileCta: cro.stickyMobileCta !== false,
    testimonialCount: 0,
    galleryCount: experienceStats.galleryCount,
    hasCancellation: experienceStats.hasCancellation,
    hasLocation: experienceStats.hasLocation,
    hasInclusions: experienceStats.hasInclusions,
  });
  const run = (task: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const result = await task();
      setMessage(
        result.ok ? "Settings saved." : (result.error ?? "Save failed."),
      );
    });
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <main className="space-y-6">
        <SiteSeoForm
          initial={siteSeo}
          ogImage={ogImage}
          save={(value) => run(() => saveSiteSeo({ siteId, ...value }))}
        />
        <div className="glass rounded-3xl p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-[#FFC857]">Per-page metadata</p>
              <h2 className="mt-1 text-xl font-semibold">Search appearance</h2>
            </div>
            <select
              value={active.id}
              onChange={(event) =>
                setActive(pages.find((page) => page.id === event.target.value)!)
              }
              className="min-h-10 rounded-xl bg-white/10 px-3 text-sm"
            >
              {pages.map((page) => (
                <option className="text-black" value={page.id} key={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
          </div>
          <PageSeoForm
            key={active.id}
            page={active}
            save={(value) =>
              run(() => savePageSeo({ siteId, pageId: active.id, ...value }))
            }
          />
        </div>
        <CroSettings
          initial={cro}
          save={(value) => run(() => saveCroSettings({ siteId, ...value }))}
        />
        {message && (
          <p aria-live="polite" className="text-sm text-white/55">
            {message}
          </p>
        )}
      </main>
      <aside className="space-y-5">
        <ScoreCard title="TripOne+ SEO readiness score" score={score} />
        <ScoreCard
          title="TripOne+ Conversion Readiness Score"
          score={croScore}
        />
      </aside>
    </div>
  );
}
function SiteSeoForm({
  initial,
  ogImage,
  save,
}: {
  initial: Record<string, unknown>;
  ogImage: string;
  save: (value: {
    siteTitle: string;
    titleSuffix: string;
    description: string;
    indexingEnabled: boolean;
    ogImage: string;
  }) => void;
}) {
  const [v, set] = useState({
    siteTitle: String(initial.siteTitle ?? ""),
    titleSuffix: String(initial.titleSuffix ?? ""),
    description: String(initial.defaultDescription ?? ""),
    indexingEnabled: initial.indexingEnabled !== false,
    ogImage,
  });
  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xl font-semibold">Site SEO defaults</h2>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field
          label="Site title"
          value={v.siteTitle}
          set={(x) => set({ ...v, siteTitle: x })}
        />
        <Field
          label="Default title suffix"
          value={v.titleSuffix}
          set={(x) => set({ ...v, titleSuffix: x })}
        />
        <Field
          label="Default meta description"
          value={v.description}
          set={(x) => set({ ...v, description: x })}
          span
        />
        <Field
          label="Default OG image URL"
          value={v.ogImage}
          set={(x) => set({ ...v, ogImage: x })}
          span
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={v.indexingEnabled}
            onChange={(e) => set({ ...v, indexingEnabled: e.target.checked })}
          />{" "}
          Site indexing enabled
        </label>
      </div>
      <SaveButton save={() => save(v)} />
    </div>
  );
}
function PageSeoForm({
  page,
  save,
}: {
  page: Page;
  save: (value: {
    title: string;
    description: string;
    canonical: string;
    indexable: boolean;
  }) => void;
}) {
  const s = page.seo_settings;
  const [v, set] = useState({
    title: String(s.title ?? ""),
    description: String(s.description ?? ""),
    canonical: String(s.canonicalPath ?? `/${page.slug}`),
    indexable: s.indexable !== false,
  });
  return (
    <div className="mt-5 grid gap-4">
      <Field
        label="SEO title"
        value={v.title}
        set={(x) => set({ ...v, title: x })}
      />
      <Field
        label="Meta description"
        value={v.description}
        set={(x) => set({ ...v, description: x })}
      />
      <Field
        label="Canonical path"
        value={v.canonical}
        set={(x) => set({ ...v, canonical: x })}
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={v.indexable}
          onChange={(e) => set({ ...v, indexable: e.target.checked })}
        />{" "}
        Allow indexing
      </label>
      <div className="rounded-xl bg-white p-4 text-[#173028]">
        <p className="text-xs text-emerald-700">triponeplus.com/{page.slug}</p>
        <p className="mt-1 text-lg text-blue-800">{v.title || page.title}</p>
        <p className="mt-1 text-sm text-slate-600">
          {v.description || "Add a useful description for this page."}
        </p>
      </div>
      <SaveButton save={() => save(v)} />
    </div>
  );
}
function CroSettings({
  initial,
  save,
}: {
  initial: Record<string, unknown>;
  save: (value: {
    primaryCta: string;
    stickyMobileCta: boolean;
    whatsappEnabled: boolean;
    phoneEnabled: boolean;
    trustBarEnabled: boolean;
  }) => void;
}) {
  const [v, set] = useState({
    primaryCta: String(initial.primaryCta ?? "Book now"),
    stickyMobileCta: initial.stickyMobileCta !== false,
    whatsappEnabled: initial.whatsappEnabled !== false,
    phoneEnabled: initial.phoneEnabled !== false,
    trustBarEnabled: initial.trustBarEnabled !== false,
  });
  return (
    <div className="glass rounded-3xl p-6">
      <h2 className="text-xl font-semibold">Conversion guardrails</h2>
      <Field
        label="Default primary CTA"
        value={v.primaryCta}
        set={(x) => set({ ...v, primaryCta: x })}
      />
      {(
        [
          "stickyMobileCta",
          "whatsappEnabled",
          "phoneEnabled",
          "trustBarEnabled",
        ] as const
      ).map((key) => (
        <label className="mt-4 flex items-center gap-2 text-sm" key={key}>
          <input
            type="checkbox"
            checked={v[key]}
            onChange={(e) => set({ ...v, [key]: e.target.checked })}
          />{" "}
          {key.replace(/([A-Z])/g, " $1")}
        </label>
      ))}
      <SaveButton save={() => save(v)} />
    </div>
  );
}
function ScoreCard({ title, score }: { title: string; score: ReadinessScore }) {
  return (
    <div className="glass rounded-3xl p-6">
      <p className="text-sm text-white/50">{title}</p>
      <p className="mt-3 text-5xl font-semibold text-[#FFC857]">
        {score.score}
        <span className="text-lg text-white/30">/100</span>
      </p>
      <div className="mt-6 space-y-3">
        {score.passed.slice(0, 4).map((item) => (
          <p className="flex gap-2 text-xs text-emerald-200" key={item.id}>
            <Check size={14} />
            {item.label}
          </p>
        ))}
        {score.improvements.slice(0, 5).map((item) => (
          <p
            className="flex gap-2 text-xs leading-5 text-amber-100"
            key={item.id}
          >
            <CircleAlert className="shrink-0" size={14} />
            {item.detail}
          </p>
        ))}
      </div>
    </div>
  );
}
function Field({
  label,
  value,
  set,
  span,
}: {
  label: string;
  value: string;
  set: (value: string) => void;
  span?: boolean;
}) {
  return (
    <label className={`text-sm text-white/60 ${span ? "sm:col-span-2" : ""}`}>
      {label}
      <input
        value={value}
        onChange={(event) => set(event.target.value)}
        className={input}
      />
    </label>
  );
}
function SaveButton({ save }: { save: () => void }) {
  return (
    <button
      onClick={save}
      className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
    >
      <Save size={15} /> Save settings
    </button>
  );
}
