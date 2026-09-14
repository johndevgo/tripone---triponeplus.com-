"use client";

import { useRef, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";

const field =
  "min-h-11 w-full rounded-xl border border-white/10 bg-white/[.055] px-3 outline-none transition focus:border-[#95EE8E]/70 focus:ring-2 focus:ring-[#95EE8E]/15";

type ServiceOption = { id: string; name: string };
type PackageItemValue = {
  day_number?: number;
  experience_id?: string | null;
  rental_product_id?: string | null;
  title?: string;
  description?: string;
  optional?: boolean;
};
type ItineraryValue = {
  title?: string;
  description?: string;
  accommodation?: string;
  meals?: string;
  distance?: string;
  hours?: string;
};
type FaqValue = { question?: string; answer?: string };

function move<T>(rows: T[], from: number, to: number) {
  if (to < 0 || to >= rows.length) return rows;
  const next = [...rows];
  const [row] = next.splice(from, 1);
  if (row === undefined) return rows;
  next.splice(to, 0, row);
  return next;
}

function RowActions({
  index,
  count,
  onMove,
  onRemove,
}: {
  index: number;
  count: number;
  onMove: (to: number) => void;
  onRemove: () => void;
}) {
  return (
    <div
      className="flex items-center justify-end gap-1"
      aria-label="Row actions"
    >
      <button
        type="button"
        onClick={() => onMove(index - 1)}
        disabled={index === 0}
        aria-label="Move up"
        className="grid size-9 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
      >
        <ArrowUp size={15} />
      </button>
      <button
        type="button"
        onClick={() => onMove(index + 1)}
        disabled={index === count - 1}
        aria-label="Move down"
        className="grid size-9 place-items-center rounded-lg text-white/45 transition hover:bg-white/10 hover:text-white disabled:opacity-20"
      >
        <ArrowDown size={15} />
      </button>
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove row"
        className="grid size-9 place-items-center rounded-lg text-white/45 transition hover:bg-red-400/10 hover:text-red-300"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

export function PackageItemsRepeater({
  initialItems,
  experiences,
  rentals,
}: {
  initialItems: PackageItemValue[];
  experiences: ServiceOption[];
  rentals: ServiceOption[];
}) {
  const sequence = useRef(initialItems.length);
  const [rows, setRows] = useState(() =>
    (initialItems.length ? initialItems : [{}]).map((value, index) => ({
      key: `item-${index}`,
      value,
    })),
  );
  const add = () => {
    sequence.current += 1;
    setRows((current) => [
      ...current,
      { key: `item-${sequence.current}`, value: {} },
    ]);
  };
  return (
    <div className="grid gap-3">
      {rows.map(({ key, value }, index) => (
        <div
          key={key}
          className="rounded-2xl border border-white/10 bg-black/10 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#95EE8E]">
              Package item {index + 1}
            </p>
            <RowActions
              index={index}
              count={rows.length}
              onMove={(to) => setRows((current) => move(current, index, to))}
              onRemove={() =>
                setRows((current) => current.filter((row) => row.key !== key))
              }
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[90px_160px_1fr]">
            <input
              aria-label={`Day for item ${index + 1}`}
              name="itemDay"
              type="number"
              min="1"
              defaultValue={String(value.day_number ?? index + 1)}
              className={field}
            />
            <select
              aria-label={`Type for item ${index + 1}`}
              name="itemKind"
              defaultValue={
                value.experience_id
                  ? "experience"
                  : value.rental_product_id
                    ? "rental"
                    : "custom"
              }
              className={field}
            >
              <option value="custom">Custom service</option>
              <option value="experience">Tour / activity</option>
              <option value="rental">Rental</option>
            </select>
            <select
              aria-label={`Linked service for item ${index + 1}`}
              name="itemTarget"
              defaultValue={String(
                value.experience_id ?? value.rental_product_id ?? "",
              )}
              className={field}
            >
              <option value="">No linked service</option>
              <optgroup label="Tours, activities & transfers">
                {experiences.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Rentals">
                {rentals.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-[1fr_auto]">
            <input
              aria-label={`Title for item ${index + 1}`}
              name="itemTitle"
              defaultValue={String(value.title ?? "")}
              placeholder="Airport pickup, guided city tour, accommodation..."
              className={field}
            />
            <label className="flex min-h-11 items-center gap-2 rounded-xl border border-white/10 px-3 text-sm text-white/60">
              <input
                type="checkbox"
                name="itemOptional"
                value={index}
                defaultChecked={Boolean(value.optional)}
                className="size-4 accent-[#5BCD57]"
              />
              Optional
            </label>
          </div>
          <textarea
            aria-label={`Description for item ${index + 1}`}
            name="itemDescription"
            defaultValue={String(value.description ?? "")}
            rows={2}
            maxLength={3000}
            placeholder="What is included in this item?"
            className={`${field} mt-3 py-3`}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-[#95EE8E]/35 px-4 text-sm font-medium text-[#95EE8E] transition hover:bg-[#95EE8E]/10"
      >
        <Plus size={16} /> Add package item
      </button>
    </div>
  );
}

export function ItineraryRepeater({
  initialDays,
}: {
  initialDays: ItineraryValue[];
}) {
  const sequence = useRef(initialDays.length);
  const [rows, setRows] = useState(() =>
    (initialDays.length ? initialDays : [{}, {}, {}]).map((value, index) => ({
      key: `day-${index}`,
      value,
    })),
  );
  const add = () => {
    sequence.current += 1;
    setRows((current) => [
      ...current,
      { key: `day-${sequence.current}`, value: {} },
    ]);
  };
  return (
    <div className="grid gap-3">
      {rows.map(({ key, value }, index) => (
        <div
          key={key}
          className="rounded-2xl border border-white/10 bg-black/10 p-4"
        >
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-[.14em] text-[#95EE8E]">
              Day {index + 1}
            </p>
            <RowActions
              index={index}
              count={rows.length}
              onMove={(to) => setRows((current) => move(current, index, to))}
              onRemove={() =>
                setRows((current) => current.filter((row) => row.key !== key))
              }
            />
          </div>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <input
              name="itineraryTitle"
              aria-label={`Day ${index + 1} title`}
              defaultValue={value.title}
              placeholder="Arrival and old-town walk"
              className={field}
            />
            <input
              name="itineraryHours"
              aria-label={`Day ${index + 1} activity duration`}
              defaultValue={value.hours}
              placeholder="Activity time, e.g. 5–6 hours"
              className={field}
            />
            <textarea
              name="itineraryDescription"
              aria-label={`Day ${index + 1} description`}
              defaultValue={value.description}
              rows={3}
              placeholder="Day plan and key moments"
              className={`${field} py-3 sm:col-span-2`}
            />
            <input
              name="itineraryAccommodation"
              aria-label={`Day ${index + 1} accommodation`}
              defaultValue={value.accommodation}
              placeholder="Accommodation"
              className={field}
            />
            <input
              name="itineraryMeals"
              aria-label={`Day ${index + 1} meals`}
              defaultValue={value.meals}
              placeholder="Meals included"
              className={field}
            />
            <input
              name="itineraryDistance"
              aria-label={`Day ${index + 1} distance`}
              defaultValue={value.distance}
              placeholder="Distance, e.g. 12 km"
              className={field}
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-[#95EE8E]/35 px-4 text-sm font-medium text-[#95EE8E] transition hover:bg-[#95EE8E]/10"
      >
        <Plus size={16} /> Add itinerary day
      </button>
    </div>
  );
}

export function FaqRepeater({ initialFaqs }: { initialFaqs: FaqValue[] }) {
  const sequence = useRef(initialFaqs.length);
  const [rows, setRows] = useState(() =>
    (initialFaqs.length ? initialFaqs : [{}]).map((value, index) => ({
      key: `faq-${index}`,
      value,
    })),
  );
  return (
    <div className="grid gap-3">
      {rows.map(({ key, value }, index) => (
        <div
          key={key}
          className="grid gap-3 rounded-2xl border border-white/10 bg-black/10 p-4 sm:grid-cols-[1fr_auto]"
        >
          <div className="grid gap-3">
            <input
              name="faqQuestion"
              aria-label={`FAQ ${index + 1} question`}
              defaultValue={value.question}
              placeholder="What should guests bring?"
              className={field}
            />
            <textarea
              name="faqAnswer"
              aria-label={`FAQ ${index + 1} answer`}
              defaultValue={value.answer}
              rows={3}
              placeholder="Give a clear, factual answer."
              className={`${field} py-3`}
            />
          </div>
          <RowActions
            index={index}
            count={rows.length}
            onMove={(to) => setRows((current) => move(current, index, to))}
            onRemove={() =>
              setRows((current) => current.filter((row) => row.key !== key))
            }
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => {
          sequence.current += 1;
          setRows((current) => [
            ...current,
            { key: `faq-${sequence.current}`, value: {} },
          ]);
        }}
        className="inline-flex min-h-11 w-fit items-center gap-2 rounded-xl border border-dashed border-[#95EE8E]/35 px-4 text-sm font-medium text-[#95EE8E] transition hover:bg-[#95EE8E]/10"
      >
        <Plus size={16} /> Add FAQ
      </button>
    </div>
  );
}
