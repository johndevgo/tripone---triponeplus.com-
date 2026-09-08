"use client";
/* eslint-disable react-hooks/refs -- dnd-kit exposes callback refs and transform state as hook results. */

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {
  ArrowLeft,
  BookmarkPlus,
  Check,
  Copy,
  Eye,
  EyeOff,
  ExternalLink,
  GripVertical,
  Laptop,
  Plus,
  Redo2,
  Search,
  Smartphone,
  Tablet,
  Trash2,
  Undo2,
  X,
} from "lucide-react";
import {
  SiteRenderer,
  type PublicExperience,
} from "@/components/site/site-renderer";
import { sectionRegistry, createDefaultSection } from "@/lib/sections/registry";
import type { SiteSection, ThemeId } from "@/lib/types";
import { getTheme, type ThemeTokens } from "@/lib/site-generator";
import { useBuilderStore } from "./store";
import {
  publishFromBuilder,
  saveReusableSection,
  savePageDraft,
  type SavedSectionRecord,
} from "@/app/dashboard/sites/[siteId]/builder/actions";

type BuilderPage = {
  id: string;
  title: string;
  slug: string;
  sections: SiteSection[];
  revision: number;
};
type Props = {
  site: {
    id: string;
    name: string;
    slug: string;
    theme_id: string;
    theme_settings: unknown;
    navigation: unknown;
    footer_settings: unknown;
    global_settings: unknown;
  };
  business: {
    name: string;
    city: string;
    country: string;
    phone: string | null;
    whatsapp: string | null;
    email: string;
    logo_url: string | null;
  };
  pages: BuilderPage[];
  experiences: PublicExperience[];
  savedSections: SavedSectionRecord[];
};

const panel = "border-white/10 bg-[#07271f]/95 backdrop-blur-xl";
const input =
  "mt-2 min-h-10 w-full rounded-xl border border-white/12 bg-white/[.06] px-3 text-sm text-white outline-none transition focus:border-[#FFC857]";

export function VisualBuilder({
  site,
  business,
  pages,
  experiences,
  savedSections: initialSavedSections,
}: Props) {
  const [activePageId, setActivePageId] = useState(pages[0]?.id ?? "");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedSections, setSavedSections] = useState(initialSavedSections);
  const store = useBuilderStore();
  const activePage = pages.find((page) => page.id === activePageId) ?? pages[0];
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 7 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  useEffect(() => {
    if (activePage)
      store.initialize(activePage.id, activePage.sections, activePage.revision);
    // The store methods are stable; page identity intentionally controls reinitialization.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePage?.id]);

  useEffect(() => {
    if (!store.dirty || !store.pageId) return;
    const savingSections = store.sections;
    const timer = window.setTimeout(async () => {
      useBuilderStore.getState().markSaving();
      const result = await savePageDraft({
        siteId: site.id,
        pageId: store.pageId,
        expectedRevision: store.revision,
        sections: savingSections,
      });
      const current = useBuilderStore.getState();
      if (result.ok)
        current.markSaved(result.revision, current.sections === savingSections);
      else if (!result.ok) current.markFailed(result.error);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [site.id, store.dirty, store.pageId, store.revision, store.sections]);

  const selected =
    store.sections.find((section) => section.id === store.selectedId) ?? null;
  const themeBase = getTheme(site.theme_id as ThemeId);
  const stored = site.theme_settings as Partial<ThemeTokens>;
  const theme: ThemeTokens = {
    ...themeBase,
    ...stored,
    colors: { ...themeBase.colors, ...stored.colors },
  };
  const width =
    device === "desktop" ? "100%" : device === "tablet" ? "768px" : "390px";

  function dragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    store.mutate((sections) =>
      arrayMove(
        sections,
        sections.findIndex((item) => item.id === active.id),
        sections.findIndex((item) => item.id === over.id),
      ),
    );
  }
  function patchSelected(
    patch: Partial<SiteSection> & { settings?: Record<string, unknown> },
  ) {
    if (!selected) return;
    store.mutate((sections) =>
      sections.map((section) =>
        section.id === selected.id
          ? {
              ...section,
              ...patch,
              settings: patch.settings
                ? { ...section.settings, ...patch.settings }
                : section.settings,
            }
          : section,
      ),
    );
  }
  function addSection(type: keyof typeof sectionRegistry) {
    const section = createDefaultSection(type);
    store.mutate((sections) => [...sections, section], section.id);
    setLibraryOpen(false);
  }
  function addSavedSection(saved: SavedSectionRecord) {
    const section: SiteSection = {
      id: crypto.randomUUID(),
      type: saved.section_type,
      variant: saved.variant,
      visible: true,
      settings: structuredClone(saved.settings),
      bindingMode: saved.save_mode,
      ...(saved.save_mode === "linked"
        ? { savedSectionId: saved.id, savedSectionRevision: saved.revision }
        : {}),
    };
    store.mutate((sections) => [...sections, section], section.id);
    setLibraryOpen(false);
  }
  async function saveSelected(mode: "copy" | "linked") {
    if (!selected) return;
    const result = await saveReusableSection({
      siteId: site.id,
      name: `${sectionRegistry[selected.type].label} reusable`,
      section: selected,
      mode,
    });
    if (result.ok) setSavedSections((current) => [result.section, ...current]);
    else store.markFailed(result.error);
  }
  async function publish() {
    if (store.dirty) {
      store.markSaving();
      const saved = await savePageDraft({
        siteId: site.id,
        pageId: store.pageId,
        expectedRevision: store.revision,
        sections: store.sections,
      });
      if (!saved.ok) return store.markFailed(saved.error);
      store.markSaved(saved.revision);
    }
    setPublishing(true);
    const result = await publishFromBuilder(site.id);
    setPublishing(false);
    if (result.ok) setPublishOpen(false);
    else store.markFailed(result.error);
  }

  if (!activePage)
    return (
      <div className="glass rounded-3xl p-8">
        Create a page before opening the builder.
      </div>
    );
  return (
    <div className="-mx-4 -my-7 min-h-screen sm:-mx-7 lg:-mx-10 lg:-my-10">
      <header
        className={`sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-3 border-b px-4 ${panel}`}
      >
        <Link
          href={`/dashboard/sites/${site.id}`}
          aria-label="Back to dashboard"
          className="grid size-10 place-items-center rounded-xl hover:bg-white/10"
        >
          <ArrowLeft size={18} />
        </Link>
        <select
          aria-label="Page"
          value={activePageId}
          onChange={(event) => setActivePageId(event.target.value)}
          className="min-h-10 rounded-xl border border-white/10 bg-white/[.06] px-3 text-sm"
        >
          {pages.map((page) => (
            <option className="text-black" value={page.id} key={page.id}>
              {page.title}
            </option>
          ))}
        </select>
        <div className="flex items-center gap-1">
          <ToolbarButton
            label="Undo"
            disabled={!store.history.length}
            onClick={store.undo}
          >
            <Undo2 size={17} />
          </ToolbarButton>
          <ToolbarButton
            label="Redo"
            disabled={!store.future.length}
            onClick={store.redo}
          >
            <Redo2 size={17} />
          </ToolbarButton>
        </div>
        <div
          aria-live="polite"
          className={`mr-auto flex items-center gap-2 text-xs ${store.saveState === "failed" ? "text-red-300" : "text-white/50"}`}
        >
          {store.saveState === "saved" && (
            <Check size={14} className="text-emerald-300" />
          )}
          {store.saveState === "saving"
            ? "Saving…"
            : store.saveState === "unsaved"
              ? "Unsaved changes"
              : store.saveState === "failed"
                ? store.saveError
                : "Saved"}
        </div>
        <div
          className="flex rounded-xl bg-white/[.06] p-1"
          aria-label="Preview device"
        >
          {(["desktop", "tablet", "mobile"] as const).map((item) => {
            const Icon =
              item === "desktop"
                ? Laptop
                : item === "tablet"
                  ? Tablet
                  : Smartphone;
            return (
              <button
                key={item}
                onClick={() => setDevice(item)}
                aria-label={`${item} preview`}
                className={`grid size-8 place-items-center rounded-lg ${device === item ? "bg-[#F5A623] text-[#173028]" : "text-white/50"}`}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
        <Link
          target="_blank"
          href={`/preview/${site.id}/${activePage.slug}`}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm"
        >
          <ExternalLink size={15} /> Preview
        </Link>
        <button
          onClick={() => setPublishOpen(true)}
          className="min-h-10 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
        >
          Publish changes
        </button>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] xl:grid-cols-[260px_minmax(0,1fr)_310px]">
        <aside className={`border-b p-4 xl:border-b-0 xl:border-r ${panel}`}>
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Sections</h2>
            <button
              onClick={() => setLibraryOpen(true)}
              className="grid size-9 place-items-center rounded-xl bg-[#F5A623] text-[#173028]"
              aria-label="Add section"
            >
              <Plus size={17} />
            </button>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={dragEnd}
          >
            <SortableContext
              items={store.sections.map((item) => item.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="mt-4 grid gap-2">
                {store.sections.map((section, index) => (
                  <SortableRow
                    section={section}
                    index={index}
                    selected={store.selectedId === section.id}
                    onSelect={() => store.select(section.id)}
                    key={section.id}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          <Link
            href={`/dashboard/sites/${site.id}/pages`}
            className="mt-5 block rounded-xl border border-white/10 p-3 text-center text-sm text-white/60"
          >
            Manage pages & navigation
          </Link>
        </aside>

        <main className="min-w-0 overflow-auto bg-[#03130f] p-4 sm:p-7">
          <div
            className="mx-auto origin-top overflow-hidden rounded-xl bg-white shadow-2xl transition-[width] duration-200"
            style={{ width, maxWidth: "100%" }}
          >
            <SiteRenderer
              site={site}
              business={business}
              page={{ ...activePage, sections: store.sections }}
              theme={theme}
              experiences={experiences}
              basePath={`/preview/${site.id}`}
              preview
              editor={{
                selectedSectionId: store.selectedId,
                onSelectSection: store.select,
              }}
            />
          </div>
        </main>

        <aside className={`border-t p-5 xl:border-l xl:border-t-0 ${panel}`}>
          {selected ? (
            <Inspector
              section={selected}
              patch={patchSelected}
              duplicate={() => {
                const copy = {
                  ...structuredClone(selected),
                  id: crypto.randomUUID(),
                };
                store.mutate((sections) => {
                  const index = sections.findIndex(
                    (item) => item.id === selected.id,
                  );
                  sections.splice(index + 1, 0, copy);
                  return sections;
                }, copy.id);
              }}
              remove={() =>
                store.mutate(
                  (sections) =>
                    sections.filter((item) => item.id !== selected.id),
                  null,
                )
              }
              saveReusable={saveSelected}
            />
          ) : (
            <p className="text-sm text-white/45">
              Select a section to edit its content and design.
            </p>
          )}
        </aside>
      </div>

      {libraryOpen && (
        <SectionLibrary
          query={query}
          setQuery={setQuery}
          add={addSection}
          savedSections={savedSections}
          addSaved={addSavedSection}
          close={() => setLibraryOpen(false)}
        />
      )}
      {publishOpen && (
        <Modal title="Publish changes" close={() => setPublishOpen(false)}>
          <p className="text-sm leading-6 text-white/55">
            Publishing creates an immutable version snapshot. Your working draft
            remains editable after it goes live.
          </p>
          <div className="mt-5 rounded-xl bg-amber-300/10 p-3 text-sm text-amber-100">
            Warnings do not block publishing. Review SEO and conversion
            readiness for detailed recommendations.
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setPublishOpen(false)}
              className="min-h-10 rounded-xl px-4 text-sm"
            >
              Cancel
            </button>
            <button
              disabled={publishing}
              onClick={publish}
              className="min-h-10 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028] disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish now"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function SortableRow({
  section,
  index,
  selected,
  onSelect,
}: {
  section: SiteSection;
  index: number;
  selected: boolean;
  onSelect: () => void;
}) {
  const sortable = useSortable({ id: section.id });
  const transform = sortable.transform
    ? `translate3d(${sortable.transform.x}px, ${sortable.transform.y}px, 0)`
    : undefined;
  return (
    <div
      ref={sortable.setNodeRef}
      style={{ transform, transition: sortable.transition }}
      className={`flex items-center rounded-xl border ${selected ? "border-[#F5A623] bg-[#F5A623]/10" : "border-white/10 bg-white/[.04]"}`}
    >
      <button
        {...sortable.attributes}
        {...sortable.listeners}
        aria-label={`Move ${sectionRegistry[section.type].label}`}
        className="grid size-10 shrink-0 touch-none place-items-center text-white/35"
      >
        <GripVertical size={16} />
      </button>
      <button onClick={onSelect} className="min-w-0 flex-1 py-3 pr-3 text-left">
        <span className="block truncate text-sm font-medium">
          {sectionRegistry[section.type].label}
        </span>
        <span className="block text-[11px] text-white/35">
          {index + 1} · {section.variant}
          {!section.visible ? " · hidden" : ""}
        </span>
      </button>
    </div>
  );
}

function Inspector({
  section,
  patch,
  duplicate,
  remove,
  saveReusable,
}: {
  section: SiteSection;
  patch: (
    value: Partial<SiteSection> & { settings?: Record<string, unknown> },
  ) => void;
  duplicate: () => void;
  remove: () => void;
  saveReusable: (mode: "copy" | "linked") => void;
}) {
  const definition = sectionRegistry[section.type];
  const value = (key: string) =>
    typeof section.settings[key] === "string"
      ? String(section.settings[key])
      : "";
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#FFC857]">
        Inspector
      </p>
      <h2 className="mt-2 text-xl font-semibold">{definition.label}</h2>
      <p className="mt-2 text-xs leading-5 text-white/40">
        {definition.description}
      </p>
      <div className="mt-6 grid gap-4">
        {["eyebrow", "title", "description", "body"].map(
          (key) =>
            key in section.settings && (
              <label className="text-xs text-white/60" key={key}>
                <span className="capitalize">{key}</span>
                {key === "description" || key === "body" ? (
                  <textarea
                    rows={key === "body" ? 6 : 3}
                    value={value(key)}
                    onChange={(event) =>
                      patch({ settings: { [key]: event.target.value } })
                    }
                    className={`${input} py-3`}
                  />
                ) : (
                  <input
                    value={value(key)}
                    onChange={(event) =>
                      patch({ settings: { [key]: event.target.value } })
                    }
                    className={input}
                  />
                )}
              </label>
            ),
        )}
        {section.type === "hero" && (
          <>
            {[
              "primaryCta",
              "primaryHref",
              "secondaryCta",
              "secondaryHref",
              "imageUrl",
            ].map((key) => (
              <label className="text-xs text-white/60" key={key}>
                <span>{key.replace(/([A-Z])/g, " $1")}</span>
                <input
                  value={value(key)}
                  onChange={(event) =>
                    patch({ settings: { [key]: event.target.value } })
                  }
                  className={input}
                />
              </label>
            ))}
          </>
        )}
        <label className="text-xs text-white/60">
          Variant
          <select
            value={section.variant}
            onChange={(event) => patch({ variant: event.target.value })}
            className={input}
          >
            {definition.variants.map((variant) => (
              <option className="text-black" value={variant} key={variant}>
                {variant.replaceAll("-", " ")}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs text-white/60">
          Alignment
          <select
            value={value("alignment") || "left"}
            onChange={(event) =>
              patch({ settings: { alignment: event.target.value } })
            }
            className={input}
          >
            <option className="text-black">left</option>
            <option className="text-black">center</option>
          </select>
        </label>
        <label className="text-xs text-white/60">
          Section spacing
          <select
            value={value("spacing") || "standard"}
            onChange={(event) =>
              patch({ settings: { spacing: event.target.value } })
            }
            className={input}
          >
            {["compact", "standard", "spacious", "extra"].map((item) => (
              <option className="text-black" value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mt-7 grid grid-cols-3 gap-2">
        <button
          onClick={() => patch({ visible: !section.visible })}
          className="grid min-h-11 place-items-center rounded-xl border border-white/10"
          aria-label={section.visible ? "Hide section" : "Show section"}
        >
          {section.visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
        <button
          onClick={duplicate}
          className="grid min-h-11 place-items-center rounded-xl border border-white/10"
          aria-label="Duplicate section"
        >
          <Copy size={17} />
        </button>
        <button
          onClick={remove}
          className="grid min-h-11 place-items-center rounded-xl border border-red-300/20 text-red-200"
          aria-label="Delete section"
        >
          <Trash2 size={17} />
        </button>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          onClick={() => saveReusable("copy")}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 text-xs"
        >
          <BookmarkPlus size={15} /> Save copy
        </button>
        <button
          onClick={() => saveReusable("linked")}
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#FFC857]/30 text-xs text-[#FFC857]"
        >
          <BookmarkPlus size={15} /> Save linked
        </button>
      </div>
    </div>
  );
}

function SectionLibrary({
  query,
  setQuery,
  add,
  savedSections,
  addSaved,
  close,
}: {
  query: string;
  setQuery: (value: string) => void;
  add: (type: keyof typeof sectionRegistry) => void;
  savedSections: SavedSectionRecord[];
  addSaved: (section: SavedSectionRecord) => void;
  close: () => void;
}) {
  const items = useMemo(
    () =>
      Object.entries(sectionRegistry).filter(([, item]) =>
        `${item.label} ${item.description} ${item.category}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <Modal title="Add a section" close={close} wide>
      <label className="relative block">
        <Search className="absolute left-3 top-3 text-white/35" size={18} />
        <input
          autoFocus
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search sections"
          className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[.06] pl-10 pr-3 outline-none focus:border-[#FFC857]"
        />
      </label>
      {savedSections.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FFC857]">
            Saved sections
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {savedSections.map((saved) => (
              <button
                key={saved.id}
                onClick={() => addSaved(saved)}
                className="rounded-xl border border-[#FFC857]/20 bg-[#FFC857]/[.05] p-3 text-left"
              >
                <span className="block text-sm font-medium">{saved.name}</span>
                <span className="mt-1 block text-[11px] text-white/35">
                  {saved.save_mode} · {saved.variant}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      <div className="mt-5 grid max-h-[60vh] gap-3 overflow-y-auto sm:grid-cols-2">
        {items.map(([type, item]) => (
          <button
            onClick={() => add(type as keyof typeof sectionRegistry)}
            key={type}
            className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-left transition hover:border-[#FFC857]/60 hover:bg-white/[.07]"
          >
            <span className="text-xs text-[#FFC857]">{item.category}</span>
            <span className="mt-2 block font-semibold">{item.label}</span>
            <span className="mt-1 block text-xs leading-5 text-white/40">
              {item.description}
            </span>
            <span className="mt-3 block text-[11px] text-white/30">
              {item.variants.length} variants
            </span>
          </button>
        ))}
      </div>
    </Modal>
  );
}

function Modal({
  title,
  close,
  children,
  wide,
}: {
  title: string;
  close: () => void;
  children: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4"
    >
      <div
        className={`glass max-h-[90vh] w-full overflow-auto rounded-3xl p-6 ${wide ? "max-w-4xl" : "max-w-lg"}`}
      >
        <div className="flex items-center justify-between">
          <h2 id="modal-title" className="text-xl font-semibold">
            {title}
          </h2>
          <button
            onClick={close}
            aria-label="Close dialog"
            className="grid size-9 place-items-center rounded-xl hover:bg-white/10"
          >
            <X size={18} />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  );
}

function ToolbarButton({
  label,
  onClick,
  disabled,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid size-9 place-items-center rounded-xl text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-25"
    >
      {children}
    </button>
  );
}
