"use client";
/* eslint-disable react-hooks/refs -- dnd-kit exposes callback refs and transform state as hook results. */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
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
  ArrowDown,
  ArrowUp,
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
  type PublicPackage,
  type PublicRental,
} from "@/components/site/site-renderer";
import {
  sectionRecipes,
  sectionRegistry,
  createDefaultSection,
  type SectionRecipe,
} from "@/lib/sections/registry";
import type { SiteSection, ThemeId } from "@/lib/types";
import { getTheme, type ThemeTokens } from "@/lib/site-generator";
import { useBuilderStore } from "./store";
import {
  publishFromBuilder,
  resetRecordLayout,
  saveRecordLayoutDraft,
  saveReusableSection,
  savePageDraft,
  saveTemplateDraft,
  type SavedSectionRecord,
} from "@/app/dashboard/sites/[siteId]/builder/actions";

type BuilderPage = {
  id: string;
  title: string;
  slug: string;
  sections: SiteSection[];
  revision: number;
  editorKind?: "page" | "template" | "record";
  templateKind?: string;
  recordKind?: "experience" | "rental" | "taxonomy" | "location";
  templateVersion?: number | null;
  inheritedSections?: SiteSection[];
  isOverride?: boolean;
  activeExperienceId?: string;
  activeRentalId?: string;
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
    cro_settings?: unknown;
  };
  business: {
    name: string;
    city: string;
    country: string;
    phone: string | null;
    whatsapp: string | null;
    email: string;
    logo_url: string | null;
    address?: string | null;
    instagram_url?: string | null;
    facebook_url?: string | null;
    youtube_url?: string | null;
    tripadvisor_url?: string | null;
  };
  pages: BuilderPage[];
  experiences: PublicExperience[];
  rentals: PublicRental[];
  packages: PublicPackage[];
  savedSections: SavedSectionRecord[];
  initialTargetId?: string;
};

const panel = "border-white/10 bg-[#07271f]/95 backdrop-blur-xl";
const input =
  "mt-2 min-h-10 w-full rounded-xl border border-white/12 bg-white/[.06] px-3 text-sm text-white outline-none transition focus:border-[#95EE8E]";

export function VisualBuilder({
  site,
  business,
  pages,
  experiences,
  rentals,
  packages,
  savedSections: initialSavedSections,
  initialTargetId,
}: Props) {
  const [activePageId, setActivePageId] = useState(
    pages.some((page) => page.id === initialTargetId)
      ? (initialTargetId ?? "")
      : (pages[0]?.id ?? ""),
  );
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">(
    "desktop",
  );
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [publishOpen, setPublishOpen] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [savedSections, setSavedSections] = useState(initialSavedSections);
  const [recordOverrides, setRecordOverrides] = useState<
    Record<string, boolean>
  >(() =>
    Object.fromEntries(
      pages
        .filter((page) => page.editorKind === "record")
        .map((page) => [page.id, page.isOverride === true]),
    ),
  );
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
      const result =
        activePage?.editorKind === "template"
          ? await saveTemplateDraft({
              siteId: site.id,
              templateId: store.pageId,
              expectedVersion: store.revision,
              sections: savingSections,
            })
          : activePage?.editorKind === "record" && activePage.recordKind
            ? await saveRecordLayoutDraft({
                siteId: site.id,
                recordId: store.pageId,
                recordKind: activePage.recordKind,
                expectedRevision: store.revision,
                templateVersion: activePage.templateVersion ?? null,
                sections: savingSections,
              })
            : await savePageDraft({
                siteId: site.id,
                pageId: store.pageId,
                expectedRevision: store.revision,
                sections: savingSections,
              });
      const current = useBuilderStore.getState();
      if (result.ok) {
        current.markSaved(result.revision, current.sections === savingSections);
        if (activePage?.editorKind === "record")
          setRecordOverrides((value) => ({
            ...value,
            [activePage.id]: true,
          }));
      } else current.markFailed(result.error);
    }, 900);
    return () => window.clearTimeout(timer);
  }, [
    activePage?.editorKind,
    activePage?.id,
    activePage?.recordKind,
    activePage?.templateVersion,
    site.id,
    store.dirty,
    store.pageId,
    store.revision,
    store.sections,
  ]);

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
  function addRecipe(recipe: SectionRecipe) {
    const section = createDefaultSection(recipe.type, recipe.variant);
    section.settings = {
      ...section.settings,
      ...structuredClone(recipe.settings),
    };
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
    if (!activePage) return;
    if (store.dirty) {
      store.markSaving();
      const saved =
        activePage.editorKind === "template"
          ? await saveTemplateDraft({
              siteId: site.id,
              templateId: store.pageId,
              expectedVersion: store.revision,
              sections: store.sections,
            })
          : activePage.editorKind === "record" && activePage.recordKind
            ? await saveRecordLayoutDraft({
                siteId: site.id,
                recordId: store.pageId,
                recordKind: activePage.recordKind,
                expectedRevision: store.revision,
                templateVersion: activePage.templateVersion ?? null,
                sections: store.sections,
              })
            : await savePageDraft({
                siteId: site.id,
                pageId: store.pageId,
                expectedRevision: store.revision,
                sections: store.sections,
              });
      if (!saved.ok) return store.markFailed(saved.error);
      store.markSaved(saved.revision);
      if (activePage.editorKind === "record")
        setRecordOverrides((value) => ({
          ...value,
          [activePage.id]: true,
        }));
    }
    setPublishing(true);
    const result = await publishFromBuilder(site.id);
    setPublishing(false);
    if (result.ok) setPublishOpen(false);
    else store.markFailed(result.error);
  }

  async function resetActiveRecord() {
    if (
      activePage?.editorKind !== "record" ||
      !activePage.recordKind ||
      !activePage.inheritedSections
    )
      return;
    store.markSaving();
    const result = await resetRecordLayout({
      siteId: site.id,
      recordId: activePage.id,
      recordKind: activePage.recordKind,
      expectedRevision: store.revision,
    });
    if (!result.ok) return store.markFailed(result.error);
    store.initialize(
      activePage.id,
      activePage.inheritedSections,
      result.revision,
    );
    setRecordOverrides((value) => ({ ...value, [activePage.id]: false }));
  }

  if (!activePage)
    return (
      <div className="glass rounded-3xl p-8">
        Create a page before opening the builder.
      </div>
    );
  return (
    <div className="-mx-4 -my-7 min-h-screen sm:-mx-7 lg:-mx-10 lg:-my-10 xl:h-dvh xl:min-h-0 xl:overflow-hidden">
      <header
        className={`sticky top-0 z-30 flex min-h-16 flex-wrap items-center gap-3 border-b px-4 ${panel}`}
      >
        <Link
          href="/admin/dashboard"
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
                className={`grid size-8 place-items-center rounded-lg ${device === item ? "bg-[#5BCD57] text-[#173028]" : "text-white/50"}`}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
        {activePage.editorKind === "template" ? (
          <span className="rounded-xl border border-[#95EE8E]/20 px-3 py-2 text-xs text-[#95EE8E]">
            Global {activePage.templateKind?.replaceAll("_", " ")} template
          </span>
        ) : activePage.editorKind === "record" ? (
          <div className="flex items-center gap-2">
            <span className="rounded-xl border border-[#95EE8E]/20 px-3 py-2 text-xs text-[#95EE8E]">
              {recordOverrides[activePage.id]
                ? "Custom record layout"
                : "Inheriting shared template"}
            </span>
            {recordOverrides[activePage.id] && (
              <button
                type="button"
                onClick={resetActiveRecord}
                className="min-h-10 rounded-xl border border-white/10 px-3 text-xs text-white/65 hover:bg-white/[.06]"
              >
                Reset to template
              </button>
            )}
            <Link
              target="_blank"
              href={`/preview/${site.id}/${activePage.slug}`}
              className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm"
            >
              <ExternalLink size={15} /> Preview
            </Link>
          </div>
        ) : (
          <Link
            target="_blank"
            href={`/preview/${site.id}/${activePage.slug}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm"
          >
            <ExternalLink size={15} /> Preview
          </Link>
        )}
        <button
          onClick={() => setPublishOpen(true)}
          className="min-h-10 rounded-xl bg-[#5BCD57] px-4 text-sm font-semibold text-[#173028]"
        >
          Publish changes
        </button>
      </header>

      <div className="grid min-h-[calc(100vh-4rem)] xl:h-[calc(100dvh-4rem)] xl:min-h-0 xl:grid-cols-[260px_minmax(0,1fr)_310px] xl:overflow-hidden">
        <aside
          className={`border-b p-4 xl:h-full xl:overflow-y-auto xl:border-b-0 xl:border-r ${panel}`}
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Sections</h2>
            <button
              onClick={() => setLibraryOpen(true)}
              className="grid size-9 place-items-center rounded-xl bg-[#5BCD57] text-[#173028]"
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
            href="/admin/pages"
            className="mt-5 block rounded-xl border border-white/10 p-3 text-center text-sm text-white/60"
          >
            Manage pages & navigation
          </Link>
        </aside>

        <main className="min-h-[46rem] min-w-0 overflow-hidden bg-[#03130f] p-4 sm:p-7 xl:h-full xl:min-h-0">
          <ResponsivePreview width={width} label={`${device} website preview`}>
            <SiteRenderer
              site={site}
              business={business}
              page={{ ...activePage, sections: store.sections }}
              theme={theme}
              experiences={experiences}
              rentals={rentals}
              packages={packages}
              activeExperience={experiences.find(
                (item) => item.id === activePage.activeExperienceId,
              )}
              activeRental={rentals.find(
                (item) => item.id === activePage.activeRentalId,
              )}
              basePath={`/preview/${site.id}`}
              preview
              editor={{
                selectedSectionId: store.selectedId,
                onSelectSection: store.select,
              }}
            />
          </ResponsivePreview>
        </main>

        <aside
          className={`border-t p-5 xl:h-full xl:overflow-y-auto xl:border-l xl:border-t-0 ${panel}`}
        >
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
          addRecipe={addRecipe}
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
              className="min-h-10 rounded-xl bg-[#5BCD57] px-4 text-sm font-semibold text-[#173028] disabled:opacity-50"
            >
              {publishing ? "Publishing…" : "Publish now"}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

function ResponsivePreview({
  width,
  label,
  children,
}: {
  width: string;
  label: string;
  children: ReactNode;
}) {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = useState<HTMLElement | null>(null);

  const prepareFrame = useCallback(() => {
    const frameDocument = frameRef.current?.contentDocument;
    if (!frameDocument) return;
    frameDocument.head
      .querySelectorAll("style, link[rel='stylesheet']")
      .forEach((node) => node.remove());
    document.head
      .querySelectorAll("style, link[rel='stylesheet']")
      .forEach((node) => frameDocument.head.appendChild(node.cloneNode(true)));
    frameDocument.documentElement.lang = document.documentElement.lang || "en";
    frameDocument.documentElement.className =
      document.documentElement.className;
    frameDocument.body.className = "m-0 min-h-screen bg-white";
    setMountNode(frameDocument.body);
  }, []);

  return (
    <div
      className="mx-auto h-full max-w-full overflow-hidden rounded-xl bg-white shadow-2xl transition-[width] duration-200"
      style={{ width }}
    >
      <iframe
        ref={frameRef}
        title={label}
        srcDoc="<!doctype html><html lang='en'><head></head><body></body></html>"
        onLoad={prepareFrame}
        className="block h-full min-h-[42rem] w-full border-0 bg-white xl:min-h-0"
      />
      {mountNode ? createPortal(children, mountNode) : null}
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
      className={`flex items-center rounded-xl border ${selected ? "border-[#5BCD57] bg-[#5BCD57]/10" : "border-white/10 bg-white/[.04]"}`}
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
  const reservedFields = new Set([
    "eyebrow",
    "title",
    "description",
    "body",
    "items",
    "alignment",
    "backgroundStyle",
    "spacing",
    ...(section.type === "hero"
      ? [
          "primaryCta",
          "primaryHref",
          "secondaryCta",
          "secondaryHref",
          "imageUrl",
          "overlay",
          "height",
          "focalPosition",
        ]
      : []),
  ]);
  const additionalFields = Object.entries(section.settings).filter(
    ([key, fieldValue]) =>
      !reservedFields.has(key) &&
      (typeof fieldValue === "string" ||
        typeof fieldValue === "number" ||
        typeof fieldValue === "boolean"),
  );
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-[#95EE8E]">
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
            <label className="text-xs text-white/60">
              Image overlay ({Number(section.settings.overlay ?? 45)}%)
              <input
                type="range"
                min="0"
                max="90"
                value={Number(section.settings.overlay ?? 45)}
                onChange={(event) =>
                  patch({ settings: { overlay: Number(event.target.value) } })
                }
                className="mt-2 w-full accent-[var(--brand-500)]"
              />
            </label>
            <label className="text-xs text-white/60">
              Hero height
              <select
                value={value("height") || "tall"}
                onChange={(event) =>
                  patch({ settings: { height: event.target.value } })
                }
                className={input}
              >
                {["compact", "standard", "tall", "screen"].map((item) => (
                  <option className="text-black" value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-xs text-white/60">
              Image focus
              <select
                value={value("focalPosition") || "center"}
                onChange={(event) =>
                  patch({ settings: { focalPosition: event.target.value } })
                }
                className={input}
              >
                {["center", "top", "bottom", "left", "right"].map((item) => (
                  <option className="text-black" value={item} key={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </>
        )}
        {additionalFields.map(([key, fieldValue]) => (
          <SettingField
            key={key}
            name={key}
            value={fieldValue as string | number | boolean}
            onChange={(nextValue) => patch({ settings: { [key]: nextValue } })}
          />
        ))}
        {Array.isArray(section.settings.items) && (
          <ItemsEditor
            items={section.settings.items}
            onChange={(items) => patch({ settings: { items } })}
          />
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
          Background
          <select
            value={value("backgroundStyle") || "default"}
            onChange={(event) =>
              patch({ settings: { backgroundStyle: event.target.value } })
            }
            className={input}
          >
            {["default", "surface", "primary", "accent"].map((item) => (
              <option className="text-black" value={item} key={item}>
                {item}
              </option>
            ))}
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
          className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-[#95EE8E]/30 text-xs text-[#95EE8E]"
        >
          <BookmarkPlus size={15} /> Save linked
        </button>
      </div>
    </div>
  );
}

function ItemsEditor({
  items,
  onChange,
}: {
  items: unknown[];
  onChange: (items: Array<Record<string, unknown>>) => void;
}) {
  const normalized = items.map((item) =>
    item && typeof item === "object" && !Array.isArray(item)
      ? (item as Record<string, unknown>)
      : { title: String(item ?? "") },
  );
  const update = (index: number, key: string, value: unknown) =>
    onChange(
      normalized.map((item, itemIndex) =>
        itemIndex === index ? { ...item, [key]: value } : item,
      ),
    );
  return (
    <fieldset className="grid gap-3 rounded-2xl border border-white/10 bg-white/[.025] p-3">
      <legend className="px-1 text-xs font-semibold text-white/70">
        Section items
      </legend>
      {normalized.map((item, index) => {
        const keys = Object.keys(item).filter((key) => {
          const fieldValue = item[key];
          return (
            typeof fieldValue === "string" ||
            typeof fieldValue === "number" ||
            typeof fieldValue === "boolean"
          );
        });
        return (
          <div
            className="grid gap-2 rounded-xl border border-white/8 p-3"
            key={index}
          >
            {keys.map((key) => (
              <SettingField
                compact
                key={key}
                name={key}
                value={item[key] as string | number | boolean}
                onChange={(nextValue) => update(index, key, nextValue)}
              />
            ))}
            <div className="flex items-center justify-between gap-2">
              <div className="flex gap-1">
                <button
                  type="button"
                  disabled={index === 0}
                  onClick={() =>
                    onChange(arrayMove(normalized, index, index - 1))
                  }
                  className="grid size-8 place-items-center rounded-lg border border-white/10 disabled:opacity-30"
                  aria-label={`Move item ${index + 1} up`}
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  type="button"
                  disabled={index === normalized.length - 1}
                  onClick={() =>
                    onChange(arrayMove(normalized, index, index + 1))
                  }
                  className="grid size-8 place-items-center rounded-lg border border-white/10 disabled:opacity-30"
                  aria-label={`Move item ${index + 1} down`}
                >
                  <ArrowDown size={14} />
                </button>
              </div>
              <button
                type="button"
                onClick={() =>
                  onChange(
                    normalized.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
                className="text-xs text-red-200/80"
              >
                Remove item
              </button>
            </div>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() =>
          onChange([...normalized, createBlankItem(normalized[0])])
        }
        className="min-h-10 rounded-xl border border-white/10 text-xs font-semibold text-white/65 hover:bg-white/[.06]"
      >
        + Add item
      </button>
    </fieldset>
  );
}

function SettingField({
  name,
  value,
  onChange,
  compact = false,
}: {
  name: string;
  value: string | number | boolean;
  onChange: (value: string | number | boolean) => void;
  compact?: boolean;
}) {
  const label = name.replace(/([A-Z])/g, " $1").replaceAll("_", " ");
  if (typeof value === "boolean")
    return (
      <label className="flex min-h-10 items-center gap-2 text-xs capitalize text-white/60">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="size-4 accent-[var(--brand-500)]"
        />
        {label}
      </label>
    );
  const multiline = /description|answer|body|caption|quote|content/i.test(name);
  return (
    <label
      className={`${compact ? "text-[11px]" : "text-xs"} capitalize text-white/60`}
    >
      {label}
      {multiline ? (
        <textarea
          rows={compact ? 3 : 4}
          value={String(value)}
          onChange={(event) => onChange(event.target.value)}
          className={`${input} py-2`}
        />
      ) : (
        <input
          type={typeof value === "number" ? "number" : "text"}
          inputMode={typeof value === "number" ? "decimal" : undefined}
          value={String(value)}
          onChange={(event) =>
            onChange(
              typeof value === "number"
                ? Number(event.target.value)
                : event.target.value,
            )
          }
          className={input}
        />
      )}
    </label>
  );
}

function createBlankItem(example?: Record<string, unknown>) {
  if (!example)
    return { title: "New item", description: "Add useful details." };
  return Object.fromEntries(
    Object.entries(example).map(([key, value]) => [
      key,
      typeof value === "number"
        ? 0
        : typeof value === "boolean"
          ? false
          : key === "question"
            ? "New question"
            : key === "answer"
              ? "Add an accurate answer."
              : key === "title" || key === "label"
                ? "New item"
                : "",
    ]),
  );
}

function SectionLibrary({
  query,
  setQuery,
  add,
  addRecipe,
  savedSections,
  addSaved,
  close,
}: {
  query: string;
  setQuery: (value: string) => void;
  add: (type: keyof typeof sectionRegistry) => void;
  addRecipe: (recipe: SectionRecipe) => void;
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
          className="min-h-11 w-full rounded-xl border border-white/10 bg-white/[.06] pl-10 pr-3 outline-none focus:border-[#95EE8E]"
        />
      </label>
      {!query && (
        <div className="mt-5">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-[var(--brand-300)]">
                Ready-made sections
              </p>
              <p className="mt-1 text-xs text-white/40">
                Conversion-focused starting points with fully editable content.
              </p>
            </div>
            <span className="text-[11px] text-white/30">
              {sectionRecipes.length} recipes
            </span>
          </div>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {sectionRecipes.map((recipe) => (
              <button
                key={recipe.id}
                onClick={() => addRecipe(recipe)}
                className="rounded-xl border border-[var(--brand-300)]/20 bg-[var(--brand-300)]/[.06] p-3 text-left transition hover:border-[var(--brand-300)]/55 hover:bg-[var(--brand-300)]/[.1]"
              >
                <span className="block text-sm font-medium">{recipe.name}</span>
                <span className="mt-1 block text-[11px] leading-5 text-white/40">
                  {recipe.description}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
      {savedSections.length > 0 && (
        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#95EE8E]">
            Saved sections
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {savedSections.map((saved) => (
              <button
                key={saved.id}
                onClick={() => addSaved(saved)}
                className="rounded-xl border border-[#95EE8E]/20 bg-[#95EE8E]/[.05] p-3 text-left"
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
            className="rounded-2xl border border-white/10 bg-white/[.04] p-4 text-left transition hover:border-[#95EE8E]/60 hover:bg-white/[.07]"
          >
            <span className="text-xs text-[#95EE8E]">{item.category}</span>
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
