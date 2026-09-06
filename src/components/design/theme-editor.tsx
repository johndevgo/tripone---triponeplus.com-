"use client";

import { useState, useTransition } from "react";
import { RotateCcw, Save } from "lucide-react";
import {
  SiteRenderer,
  type PublicExperience,
  type SiteRendererProps,
} from "@/components/site/site-renderer";
import { getTheme, themes, type ThemeTokens } from "@/lib/site-generator";
import type { SiteSection, ThemeId } from "@/lib/types";
import {
  resetTheme,
  saveTheme,
} from "@/app/dashboard/sites/[siteId]/design/actions";

export function ThemeEditor({
  site,
  business,
  page,
  experiences,
  initial,
}: {
  site: SiteRendererProps["site"];
  business: SiteRendererProps["business"];
  page: { title: string; slug: string; sections: SiteSection[] };
  experiences: PublicExperience[];
  initial: ThemeTokens;
}) {
  const [theme, setTheme] = useState(initial);
  const [message, setMessage] = useState("");
  const [pending, start] = useTransition();
  const set = <K extends keyof ThemeTokens>(key: K, value: ThemeTokens[K]) =>
    setTheme((current) => ({ ...current, [key]: value }));
  const save = () =>
    start(async () => {
      const result = await saveTheme(site.id, theme);
      setMessage(
        result.ok
          ? "Theme saved to your working draft."
          : (result.error ?? "Save failed."),
      );
    });
  const reset = () =>
    start(async () => {
      const next = getTheme(theme.id);
      setTheme(next);
      const result = await resetTheme(site.id, theme.id);
      setMessage(
        result.ok
          ? "Theme reset to its preset."
          : (result.error ?? "Reset failed."),
      );
    });
  return (
    <div className="mt-8 grid gap-6 xl:grid-cols-[400px_minmax(0,1fr)]">
      <aside className="glass rounded-3xl p-6">
        <label className="text-sm text-white/60">
          Starter preset
          <select
            value={theme.id}
            onChange={(event) =>
              setTheme(getTheme(event.target.value as ThemeId))
            }
            className="mt-2 min-h-11 w-full rounded-xl bg-white/10 px-3"
          >
            {Object.values(themes).map((item) => (
              <option className="text-black" value={item.id} key={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <h2 className="mt-7 text-sm font-semibold">Colours</h2>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {Object.entries(theme.colors).map(([key, color]) => (
            <label className="text-xs capitalize text-white/50" key={key}>
              <span className="flex items-center gap-2">
                <input
                  type="color"
                  value={color}
                  onChange={(event) =>
                    setTheme((current) => ({
                      ...current,
                      colors: { ...current.colors, [key]: event.target.value },
                    }))
                  }
                  className="size-7 rounded border-0 bg-transparent"
                />
                {key}
              </span>
              <input
                value={color}
                onChange={(event) =>
                  /^#[0-9a-f]{0,6}$/i.test(event.target.value) &&
                  setTheme((current) => ({
                    ...current,
                    colors: { ...current.colors, [key]: event.target.value },
                  }))
                }
                className="mt-2 min-h-9 w-full rounded-lg border border-white/10 bg-white/[.05] px-2 uppercase"
              />
            </label>
          ))}
        </div>
        <h2 className="mt-7 text-sm font-semibold">Typography & shape</h2>
        <div className="mt-3 grid gap-3">
          <Control
            label="Heading font"
            value={theme.headingFont}
            options={[
              "var(--font-geist-sans)",
              "Georgia, serif",
              "Arial, sans-serif",
            ]}
            onChange={(value) =>
              set("headingFont", value as ThemeTokens["headingFont"])
            }
          />
          <Control
            label="Body font"
            value={theme.font}
            options={[
              "var(--font-geist-sans)",
              "Georgia, serif",
              "Arial, sans-serif",
            ]}
            onChange={(value) => set("font", value as ThemeTokens["font"])}
          />
          <Control
            label="Heading weight"
            value={String(theme.headingWeight)}
            options={["500", "600", "700", "800"]}
            onChange={(value) =>
              set(
                "headingWeight",
                Number(value) as ThemeTokens["headingWeight"],
              )
            }
          />
          <Control
            label="Text scale"
            value={theme.baseTextScale}
            options={["compact", "standard", "large"]}
            onChange={(value) =>
              set("baseTextScale", value as ThemeTokens["baseTextScale"])
            }
          />
          <Control
            label="Buttons"
            value={theme.buttonStyle}
            options={["solid", "outline", "pill"]}
            onChange={(value) =>
              set("buttonStyle", value as ThemeTokens["buttonStyle"])
            }
          />
          <Control
            label="Card radius"
            value={theme.radius}
            options={[
              "0rem",
              "0.25rem",
              "0.75rem",
              "0.875rem",
              "1.25rem",
              "2rem",
            ]}
            onChange={(value) => set("radius", value)}
          />
          <Control
            label="Card border"
            value={theme.cardBorder}
            options={["none", "subtle", "strong"]}
            onChange={(value) =>
              set("cardBorder", value as ThemeTokens["cardBorder"])
            }
          />
          <Control
            label="Shadow"
            value={theme.shadowStrength}
            options={["none", "soft", "medium"]}
            onChange={(value) =>
              set("shadowStrength", value as ThemeTokens["shadowStrength"])
            }
          />
          <Control
            label="Content width"
            value={theme.contentWidth}
            options={["narrow", "standard", "wide"]}
            onChange={(value) =>
              set("contentWidth", value as ThemeTokens["contentWidth"])
            }
          />
          <Control
            label="Section spacing"
            value={theme.spacingCharacter}
            options={["compact", "balanced", "airy"]}
            onChange={(value) =>
              set("spacingCharacter", value as ThemeTokens["spacingCharacter"])
            }
          />
          <Control
            label="Images"
            value={theme.imageTreatment}
            options={[
              "natural",
              "soft-rounded",
              "rounded",
              "cinematic",
              "editorial",
              "high-contrast",
            ]}
            onChange={(value) => set("imageTreatment", value)}
          />
          <Control
            label="Header height"
            value={theme.headerHeight}
            options={["compact", "standard", "tall"]}
            onChange={(value) =>
              set("headerHeight", value as ThemeTokens["headerHeight"])
            }
          />
        </div>
        <div className="mt-6 flex gap-3">
          <button
            disabled={pending}
            onClick={reset}
            className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm"
          >
            <RotateCcw size={15} /> Reset preset
          </button>
          <button
            disabled={pending}
            onClick={save}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#F5A623] px-3 text-sm font-semibold text-[#173028]"
          >
            <Save size={15} /> Save design
          </button>
        </div>
        {message && (
          <p aria-live="polite" className="mt-3 text-xs text-white/50">
            {message}
          </p>
        )}
      </aside>
      <main className="min-w-0 overflow-auto rounded-3xl bg-[#03130f] p-5">
        <div className="mx-auto max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
          <SiteRenderer
            site={site}
            business={business}
            page={page}
            theme={theme}
            experiences={experiences}
            basePath={`/preview/${site.id}`}
            preview
          />
        </div>
      </main>
    </div>
  );
}

function Control({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <label className="text-xs text-white/50">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-10 w-full rounded-xl bg-white/10 px-3 text-sm text-white"
      >
        {options.map((option) => (
          <option className="text-black" value={option} key={option}>
            {option.replace("var(--font-geist-sans)", "Geist")}
          </option>
        ))}
      </select>
    </label>
  );
}
