"use client";
import { useState, useTransition } from "react";
import { ArrowDown, ArrowUp, Plus, Save, Trash2 } from "lucide-react";
import {
  saveFooter,
  saveHeader,
  saveNavigation,
} from "@/app/dashboard/sites/[siteId]/pages/actions";
import type { NavigationItem } from "@/lib/types";

const input =
  "min-h-10 rounded-xl border border-white/10 bg-white/[.05] px-3 text-sm outline-none focus:border-[#FFC857]";
export function StructureEditor({
  siteId,
  initialNavigation,
  initialFooter,
  initialHeader,
}: {
  siteId: string;
  initialNavigation: NavigationItem[];
  initialFooter: Record<string, unknown>;
  initialHeader: Record<string, unknown>;
}) {
  const [items, setItems] = useState(initialNavigation);
  const [footer, setFooter] = useState({
    description: String(initialFooter.description ?? ""),
    copyright: String(initialFooter.copyright ?? ""),
    variant: String(initialFooter.variant ?? "columns"),
    bookingCta: String(initialFooter.bookingCta ?? ""),
    bookingHref: String(initialFooter.bookingHref ?? "/experiences"),
  });
  const [header, setHeader] = useState({
    variant: String(initialHeader.variant ?? "standard") as
      "standard" | "centered" | "compact",
    logoSize: String(initialHeader.logoSize ?? "medium") as
      "small" | "medium" | "large",
    ctaLabel: String(initialHeader.ctaLabel ?? "Contact us"),
    ctaHref: String(initialHeader.ctaHref ?? "/contact"),
    sticky: initialHeader.sticky !== false,
    transparentOverHero: initialHeader.transparentOverHero === true,
    showContactBar: initialHeader.showContactBar === true,
  });
  const [message, setMessage] = useState("");
  const [, start] = useTransition();
  const run = (task: () => Promise<{ ok: boolean; error?: string }>) =>
    start(async () => {
      const result = await task();
      setMessage(
        result.ok ? "Structure saved." : (result.error ?? "Could not save."),
      );
    });
  const move = (index: number, offset: number) =>
    setItems((current) => {
      const next = [...current];
      const target = index + offset;
      if (target < 0 || target >= next.length) return current;
      [next[index], next[target]] = [next[target]!, next[index]!];
      return next;
    });
  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-2">
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Global header</h2>
        <p className="mt-2 text-sm text-white/40">
          These settings affect every generated page after publishing.
        </p>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-white/55">
            Layout
            <select
              value={header.variant}
              onChange={(event) =>
                setHeader({
                  ...header,
                  variant: event.target.value as typeof header.variant,
                })
              }
              className={`${input} mt-2 w-full`}
            >
              <option className="text-black">standard</option>
              <option className="text-black">centered</option>
              <option className="text-black">compact</option>
            </select>
          </label>
          <label className="text-sm text-white/55">
            Logo size
            <select
              value={header.logoSize}
              onChange={(event) =>
                setHeader({
                  ...header,
                  logoSize: event.target.value as typeof header.logoSize,
                })
              }
              className={`${input} mt-2 w-full`}
            >
              <option className="text-black">small</option>
              <option className="text-black">medium</option>
              <option className="text-black">large</option>
            </select>
          </label>
          <Field
            label="CTA label"
            value={header.ctaLabel}
            set={(ctaLabel) => setHeader({ ...header, ctaLabel })}
          />
          <Field
            label="CTA link"
            value={header.ctaHref}
            set={(ctaHref) => setHeader({ ...header, ctaHref })}
          />
          {(
            [
              ["sticky", "Sticky navigation"],
              ["transparentOverHero", "Transparent over hero"],
              ["showContactBar", "Show contact bar"],
            ] as const
          ).map(([key, label]) => (
            <label className="flex items-center gap-2 text-sm" key={key}>
              <input
                type="checkbox"
                checked={header[key as keyof typeof header] as boolean}
                onChange={(event) =>
                  setHeader({ ...header, [key]: event.target.checked })
                }
              />
              {label}
            </label>
          ))}
        </div>
        <button
          onClick={() => run(() => saveHeader({ siteId, ...header }))}
          className="mt-5 flex min-h-10 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
        >
          <Save size={15} /> Save header
        </button>
      </section>
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Website navigation</h2>
        <p className="mt-2 text-sm text-white/40">
          Edit labels, safe links and order.
        </p>
        <div className="mt-5 grid gap-3">
          {items.map((item, index) => (
            <div
              className="grid grid-cols-[1fr_1fr_auto] gap-2"
              key={item.id ?? `${item.href}-${index}`}
            >
              <input
                aria-label="Navigation label"
                value={item.label}
                onChange={(e) =>
                  setItems(
                    items.map((x, i) =>
                      i === index ? { ...x, label: e.target.value } : x,
                    ),
                  )
                }
                className={input}
              />
              <input
                aria-label="Navigation link"
                value={item.href}
                onChange={(e) =>
                  setItems(
                    items.map((x, i) =>
                      i === index ? { ...x, href: e.target.value } : x,
                    ),
                  )
                }
                className={input}
              />
              <div className="flex">
                <button
                  aria-label="Move up"
                  onClick={() => move(index, -1)}
                  className="grid size-10 place-items-center"
                >
                  <ArrowUp size={14} />
                </button>
                <button
                  aria-label="Move down"
                  onClick={() => move(index, 1)}
                  className="grid size-10 place-items-center"
                >
                  <ArrowDown size={14} />
                </button>
                <button
                  aria-label="Remove link"
                  onClick={() => setItems(items.filter((_, i) => i !== index))}
                  className="grid size-10 place-items-center text-red-200"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() =>
            setItems([
              ...items,
              {
                id: crypto.randomUUID(),
                label: "External link",
                href: "https://",
                type: "external",
              },
            ])
          }
          className="mt-4 inline-flex items-center gap-2 text-sm text-[#FFC857]"
        >
          <Plus size={15} /> Add external link
        </button>
        <button
          onClick={() => run(() => saveNavigation({ siteId, items }))}
          className="mt-5 flex min-h-10 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
        >
          <Save size={15} /> Save navigation
        </button>
      </section>
      <section className="glass rounded-3xl p-6">
        <h2 className="text-xl font-semibold">Footer</h2>
        <div className="mt-5 grid gap-4">
          <Field
            label="Short description"
            value={footer.description}
            set={(description) => setFooter({ ...footer, description })}
          />
          <Field
            label="Copyright"
            value={footer.copyright}
            set={(copyright) => setFooter({ ...footer, copyright })}
          />
          <label className="text-sm text-white/55">
            Variant
            <select
              value={footer.variant}
              onChange={(e) =>
                setFooter({ ...footer, variant: e.target.value })
              }
              className={`${input} mt-2 w-full`}
            >
              <option className="text-black">columns</option>
              <option className="text-black">compact</option>
              <option className="text-black">editorial</option>
            </select>
          </label>
          <Field
            label="Booking CTA"
            value={footer.bookingCta}
            set={(bookingCta) => setFooter({ ...footer, bookingCta })}
          />
          <Field
            label="CTA link"
            value={footer.bookingHref}
            set={(bookingHref) => setFooter({ ...footer, bookingHref })}
          />
        </div>
        <button
          onClick={() => run(() => saveFooter({ siteId, ...footer }))}
          className="mt-5 flex min-h-10 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
        >
          <Save size={15} /> Save footer
        </button>
      </section>
      {message && (
        <p className="text-sm text-white/50 lg:col-span-2" aria-live="polite">
          {message}
        </p>
      )}
    </div>
  );
}
function Field({
  label,
  value,
  set,
}: {
  label: string;
  value: string;
  set: (value: string) => void;
}) {
  return (
    <label className="text-sm text-white/55">
      {label}
      <input
        value={value}
        onChange={(e) => set(e.target.value)}
        className={`${input} mt-2 w-full`}
      />
    </label>
  );
}
