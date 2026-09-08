import { describe, expect, it } from "vitest";
import { resolveTemplateSections } from "./bindings";

const template = [
  {
    id: "hero",
    type: "hero",
    variant: "cinematic",
    visible: true,
    settings: {
      title: "{{experience.name}}",
      description:
        "Explore {{experience.location_name}} with {{business.name}}.",
    },
  },
];

describe("typed template bindings", () => {
  it("resolves only allowlisted record values", () => {
    const [hero] = resolveTemplateSections(template, null, {
      business: { name: "Summit Adventures" },
      experience: {
        name: "Mustang Ride",
        location_name: "Mustang",
      },
    });
    expect(hero?.settings).toMatchObject({
      title: "Mustang Ride",
      description: "Explore Mustang with Summit Adventures.",
    });
  });

  it("keeps explicit record overrides independent of template updates", () => {
    const override = [
      {
        ...template[0],
        id: "private-transfer",
        settings: { title: "Private {{experience.name}}" },
      },
    ];
    const [hero] = resolveTemplateSections(template, override, {
      experience: { name: "Mustang Ride" },
    });
    expect(hero?.id).toBe("private-transfer");
    expect(hero?.settings.title).toBe("Private Mustang Ride");
  });

  it("hydrates linked reusable sections from the published graph", () => {
    const linked = [
      {
        ...template[0],
        bindingMode: "linked",
        savedSectionId: "saved-1",
        savedSectionRevision: 1,
      },
    ];
    const [hero] = resolveTemplateSections(
      linked,
      null,
      { experience: { name: "Mustang Ride" } },
      [
        {
          id: "saved-1",
          section_type: "hero",
          variant: "split",
          settings: { title: "Updated {{experience.name}}" },
          revision: 2,
        },
      ],
    );
    expect(hero?.variant).toBe("split");
    expect(hero?.savedSectionRevision).toBe(2);
    expect(hero?.settings.title).toBe("Updated Mustang Ride");
  });
});
