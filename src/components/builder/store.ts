import { create } from "zustand";
import type { SiteSection } from "@/lib/types";

type Snapshot = { sections: SiteSection[]; selectedId: string | null };
type BuilderStore = Snapshot & {
  pageId: string;
  history: Snapshot[];
  future: Snapshot[];
  dirty: boolean;
  saveState: "saved" | "saving" | "unsaved" | "failed";
  saveError: string | null;
  initialize: (pageId: string, sections: SiteSection[]) => void;
  select: (id: string | null) => void;
  mutate: (
    producer: (sections: SiteSection[]) => SiteSection[],
    selectedId?: string | null,
  ) => void;
  undo: () => void;
  redo: () => void;
  markSaving: () => void;
  markSaved: () => void;
  markFailed: (error: string) => void;
};

const clone = (sections: SiteSection[]) => structuredClone(sections);
export const useBuilderStore = create<BuilderStore>((set, get) => ({
  pageId: "",
  sections: [],
  selectedId: null,
  history: [],
  future: [],
  dirty: false,
  saveState: "saved",
  saveError: null,
  initialize: (pageId, sections) =>
    set({
      pageId,
      sections: clone(sections),
      selectedId: sections[0]?.id ?? null,
      history: [],
      future: [],
      dirty: false,
      saveState: "saved",
      saveError: null,
    }),
  select: (selectedId) => set({ selectedId }),
  mutate: (producer, selectedId) => {
    const current = get();
    const next = producer(clone(current.sections));
    set({
      sections: next,
      selectedId: selectedId === undefined ? current.selectedId : selectedId,
      history: [
        ...current.history.slice(-49),
        { sections: clone(current.sections), selectedId: current.selectedId },
      ],
      future: [],
      dirty: true,
      saveState: "unsaved",
      saveError: null,
    });
  },
  undo: () => {
    const current = get();
    const previous = current.history.at(-1);
    if (!previous) return;
    set({
      ...previous,
      history: current.history.slice(0, -1),
      future: [
        { sections: clone(current.sections), selectedId: current.selectedId },
        ...current.future,
      ].slice(0, 50),
      dirty: true,
      saveState: "unsaved",
    });
  },
  redo: () => {
    const current = get();
    const next = current.future[0];
    if (!next) return;
    set({
      ...next,
      history: [
        ...current.history,
        { sections: clone(current.sections), selectedId: current.selectedId },
      ].slice(-50),
      future: current.future.slice(1),
      dirty: true,
      saveState: "unsaved",
    });
  },
  markSaving: () => set({ saveState: "saving" }),
  markSaved: () => set({ dirty: false, saveState: "saved", saveError: null }),
  markFailed: (saveError) =>
    set({ saveState: "failed", saveError, dirty: true }),
}));
