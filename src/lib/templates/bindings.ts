import { sectionsSchema, type SiteSection } from "@/lib/types";

type BindingValue = string | number | boolean | null | unknown[];
export type TemplateBindingContext = {
  business?: Record<string, unknown>;
  experience?: Record<string, unknown>;
  rental?: Record<string, unknown>;
  term?: Record<string, unknown>;
  location?: Record<string, unknown>;
};

const allowedBindings = new Set([
  "business.name",
  "business.city",
  "business.country",
  "business.phone",
  "business.whatsapp",
  "business.email",
  "experience.name",
  "experience.short_description",
  "experience.description",
  "experience.itinerary",
  "experience.inclusions",
  "experience.exclusions",
  "experience.location_name",
  "experience.price_from",
  "experience.currency",
  "rental.name",
  "rental.short_description",
  "rental.description",
  "rental.specifications",
  "rental.inclusions",
  "rental.exclusions",
  "rental.rental_terms",
  "rental.location_name",
  "rental.currency",
  "term.name",
  "term.description",
  "location.name",
  "location.description",
  "location.city",
  "location.region",
  "location.country",
]);
const exactBinding = /^\{\{([a-z_]+\.[a-z_]+)\}\}$/;
const embeddedBinding = /\{\{([a-z_]+\.[a-z_]+)\}\}/g;

export function resolveTemplateSections(
  templateSections: unknown,
  sectionsOverride: unknown,
  context: TemplateBindingContext,
  savedSections: readonly Record<string, unknown>[] = [],
): SiteSection[] {
  const source =
    validSections(sectionsOverride) ?? validSections(templateSections);
  if (!source) return [];
  const linked = hydrateLinkedSections(source, savedSections);
  const resolved = linked.map((section) => ({
    ...section,
    settings: resolveValue(section.settings, context) as Record<
      string,
      unknown
    >,
  }));
  const parsed = sectionsSchema.safeParse(resolved);
  return parsed.success ? parsed.data : [];
}

export function hydrateLinkedSections(
  sections: SiteSection[],
  savedSections: readonly Record<string, unknown>[],
) {
  const byId = new Map(
    savedSections
      .filter((saved) => typeof saved.id === "string")
      .map((saved) => [String(saved.id), saved]),
  );
  return sections.map((section) => {
    if (section.bindingMode !== "linked" || !section.savedSectionId)
      return section;
    const saved = byId.get(section.savedSectionId);
    if (!saved) return section;
    const candidate = {
      ...section,
      type: saved.section_type,
      variant: saved.variant,
      settings: saved.settings,
      savedSectionRevision: saved.revision,
    };
    const parsed = sectionsSchema.element.safeParse(candidate);
    return parsed.success ? parsed.data : section;
  });
}

function validSections(value: unknown) {
  if (value == null) return null;
  const parsed = sectionsSchema.safeParse(value);
  return parsed.success ? parsed.data : null;
}

function resolveValue(
  value: unknown,
  context: TemplateBindingContext,
): unknown {
  if (typeof value === "string") {
    const exact = value.match(exactBinding)?.[1];
    if (exact) return bindingValue(exact, context) ?? "";
    return value.replace(embeddedBinding, (_match, binding: string) => {
      const found = bindingValue(binding, context);
      return typeof found === "string" ||
        typeof found === "number" ||
        typeof found === "boolean"
        ? String(found)
        : "";
    });
  }
  if (Array.isArray(value))
    return value.map((item) => resolveValue(item, context));
  if (value && typeof value === "object")
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        resolveValue(item, context),
      ]),
    );
  return value;
}

function bindingValue(
  binding: string,
  context: TemplateBindingContext,
): BindingValue | undefined {
  if (!allowedBindings.has(binding)) return undefined;
  const [entity, field] = binding.split(".") as [
    keyof TemplateBindingContext,
    string,
  ];
  const value = context[entity]?.[field];
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    Array.isArray(value)
  )
    return value;
  return undefined;
}
