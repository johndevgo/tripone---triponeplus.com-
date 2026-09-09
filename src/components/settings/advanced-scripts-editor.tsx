"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  parseAdvancedScripts,
  parsePathRules,
  type AdvancedScript,
} from "@/lib/integrations/advanced-scripts";

export function AdvancedScriptsEditor({ initial }: { initial: unknown }) {
  const [scripts, setScripts] = useState(() => parseAdvancedScripts(initial));
  const update = (index: number, value: Partial<AdvancedScript>) =>
    setScripts((items) =>
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...value } : item,
      ),
    );
  return (
    <div className="grid gap-4">
      <input
        type="hidden"
        name="advancedScripts"
        value={JSON.stringify(scripts)}
      />
      {scripts.map((script, index) => (
        <article
          className="rounded-2xl border border-white/10 bg-black/10 p-5"
          key={script.id}
        >
          <div className="flex items-start justify-between gap-4">
            <label className="flex-1 text-sm">
              Name
              <input
                value={script.name}
                onChange={(event) =>
                  update(index, { name: event.target.value })
                }
                className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
              />
            </label>
            <button
              type="button"
              onClick={() =>
                setScripts((items) =>
                  items.filter((_, itemIndex) => itemIndex !== index),
                )
              }
              className="mt-7 grid size-11 place-items-center rounded-xl border border-red-300/20 text-red-200"
              aria-label={`Delete ${script.name || "script"}`}
            >
              <Trash2 size={17} />
            </button>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-3">
            <Select
              label="Placement"
              value={script.placement}
              onChange={(value) =>
                update(index, {
                  placement: value as AdvancedScript["placement"],
                })
              }
              options={[
                ["head", "Head"],
                ["body_start", "After body opens"],
                ["body_end", "Before body closes"],
              ]}
            />
            <Select
              label="Consent category"
              value={script.consentCategory}
              onChange={(value) =>
                update(index, {
                  consentCategory: value as AdvancedScript["consentCategory"],
                })
              }
              options={[
                ["essential", "Essential"],
                ["analytics", "Analytics"],
                ["marketing", "Marketing"],
              ]}
            />
            <label className="flex items-end gap-3 rounded-xl border border-white/10 px-4 py-3 text-sm">
              <input
                type="checkbox"
                checked={script.enabled}
                onChange={(event) =>
                  update(index, { enabled: event.target.checked })
                }
              />
              Enabled
            </label>
          </div>
          <label className="mt-4 block text-sm">
            External HTTPS script URL (optional)
            <input
              type="url"
              value={script.sourceUrl}
              onChange={(event) =>
                update(index, { sourceUrl: event.target.value })
              }
              placeholder="https://cdn.example.com/tracker.js"
              className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-black/20 px-3"
            />
          </label>
          <label className="mt-4 block text-sm">
            JavaScript (optional)
            <textarea
              value={script.code}
              onChange={(event) => update(index, { code: event.target.value })}
              rows={5}
              spellCheck={false}
              placeholder="window.vendorQueue = window.vendorQueue || [];"
              className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 font-mono text-xs leading-5"
            />
          </label>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <PathField
              label="Include paths"
              value={script.includePaths}
              onChange={(includePaths) => update(index, { includePaths })}
              placeholder="/* or /experiences/*"
            />
            <PathField
              label="Exclude paths"
              value={script.excludePaths}
              onChange={(excludePaths) => update(index, { excludePaths })}
              placeholder="/privacy, /thank-you"
            />
          </div>
        </article>
      ))}
      <button
        type="button"
        onClick={() =>
          setScripts((items) => [
            ...items,
            {
              id: `script_${crypto.randomUUID().replaceAll("-", "")}`,
              name: "New integration",
              placement: "body_end",
              consentCategory: "analytics",
              enabled: false,
              sourceUrl: "",
              code: "",
              includePaths: ["/*"],
              excludePaths: [],
            },
          ])
        }
        disabled={scripts.length >= 20}
        className="inline-flex min-h-11 items-center justify-center gap-2 justify-self-start rounded-xl border border-white/15 px-4 text-sm disabled:opacity-40"
      >
        <Plus size={16} /> Add advanced script
      </button>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<[string, string]>;
}) {
  return (
    <label className="text-sm">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-[#08271f] px-3"
      >
        {options.map(([option, name]) => (
          <option key={option} value={option}>
            {name}
          </option>
        ))}
      </select>
    </label>
  );
}

function PathField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  placeholder: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <textarea
        value={value.join("\n")}
        onChange={(event) => onChange(parsePathRules(event.target.value))}
        rows={3}
        placeholder={placeholder}
        className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 p-3 text-xs"
      />
    </label>
  );
}
