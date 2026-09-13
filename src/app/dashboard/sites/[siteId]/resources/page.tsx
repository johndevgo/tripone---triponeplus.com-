import { Boxes, Pencil, Plus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { resourceTypes } from "@/lib/operations/schemas";
import { saveResource, setResourceStatus } from "../operations-actions";
import { Empty, PageHead } from "../experiences/page";
import { Feedback, pretty } from "../bookings/page";
const input = "min-h-11 rounded-xl border border-white/10 bg-[#0b3027] px-3";
export default async function ResourcesPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ message?: string; error?: string }>;
}) {
  const { siteId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const { data } = await supabase
    .from("resources")
    .select(
      "id,name,resource_type,identifier,status,capacity,notes,image_url,specifications,updated_at",
    )
    .eq("site_id", siteId)
    .neq("status", "archived")
    .order("name");
  return (
    <>
      <PageHead
        eyebrow="Operations"
        title="Resources"
        action={
          <a
            href="#add-resource"
            className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]"
          >
            <Plus size={16} />
            Add resource
          </a>
        }
      />
      <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50">
        Manage the guides, vehicles, vessels and capacity pools needed to fulfil
        bookings.
      </p>
      <Feedback {...feedback} />
      {data?.length ? (
        <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.map((item) => (
            <article key={item.id} className="glass rounded-2xl p-5">
              <div className="flex items-start justify-between">
                <span className="grid size-11 place-items-center rounded-xl bg-emerald-300/10 text-emerald-200">
                  <Boxes />
                </span>
                <span className="rounded-full border border-white/10 px-2 py-1 text-xs">
                  {pretty(item.status)}
                </span>
              </div>
              <h2 className="mt-5 font-semibold">{item.name}</h2>
              <p className="mt-1 text-sm capitalize text-white/40">
                {pretty(item.resource_type)}
                {item.identifier ? ` · ${item.identifier}` : ""}
              </p>
              <p className="mt-4 text-sm text-white/60">
                Capacity <strong>{item.capacity}</strong>
              </p>
              {item.notes && (
                <p className="mt-3 line-clamp-2 text-xs leading-5 text-white/35">
                  {item.notes}
                </p>
              )}
              <form action={setResourceStatus} className="mt-4 flex gap-2">
                <input type="hidden" name="siteId" value={siteId} />
                <input type="hidden" name="resourceId" value={item.id} />
                <select
                  aria-label={`Status for ${item.name}`}
                  name="status"
                  defaultValue={item.status}
                  className="min-h-9 min-w-0 flex-1 rounded-lg border border-white/10 bg-[#0b3027] px-2 text-xs"
                >
                  <option value="available">Available</option>
                  <option value="unavailable">Unavailable</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="archived">Archived</option>
                </select>
                <button className="rounded-lg border border-white/10 px-3 text-xs">
                  Update
                </button>
              </form>
              <details className="group mt-3 border-t border-white/[.07] pt-3">
                <summary className="flex min-h-10 cursor-pointer list-none items-center gap-2 text-sm text-white/55 transition hover:text-white marker:hidden">
                  <Pencil size={14} />
                  Edit details
                </summary>
                <form action={saveResource} className="mt-3 grid gap-3">
                  <input type="hidden" name="siteId" value={siteId} />
                  <input type="hidden" name="resourceId" value={item.id} />
                  <ResourceFields resource={item} compact />
                  <button className="min-h-10 rounded-xl bg-[#F5A623] px-4 text-sm font-semibold text-[#173028]">
                    Save changes
                  </button>
                </form>
              </details>
            </article>
          ))}
        </div>
      ) : (
        <Empty
          icon={Boxes}
          title="No resources yet"
          copy="Add a guide, vehicle, boat, equipment item or reusable capacity pool."
        />
      )}
      <section
        id="add-resource"
        className="glass mt-7 scroll-mt-24 rounded-3xl p-6"
      >
        <h2 className="text-lg font-semibold">Add an operational resource</h2>
        <form
          action={saveResource}
          className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          <input type="hidden" name="siteId" value={siteId} />
          <ResourceFields />
          <button className="min-h-11 rounded-xl bg-[#F5A623] px-5 font-semibold text-[#173028] sm:col-span-2 lg:col-span-3">
            Save resource
          </button>
        </form>
      </section>
    </>
  );
}

type ResourceValue = {
  name: string;
  resource_type: string;
  identifier: string | null;
  status: string;
  capacity: number;
  notes: string;
  image_url: string | null;
  specifications: unknown;
};

function ResourceFields({
  resource,
  compact = false,
}: {
  resource?: ResourceValue;
  compact?: boolean;
}) {
  const fullSpan = compact ? "" : "lg:col-span-3";
  return (
    <>
      <label className="text-sm">
        Name
        <input
          required
          name="name"
          defaultValue={resource?.name}
          className={`${input} mt-2 w-full`}
        />
      </label>
      <label className="text-sm">
        Type
        <select
          name="resourceType"
          defaultValue={resource?.resource_type}
          className={`${input} mt-2 w-full`}
        >
          {resourceTypes.map((type) => (
            <option key={type} value={type}>
              {pretty(type)}
            </option>
          ))}
        </select>
      </label>
      <label className="text-sm">
        Identifier
        <input
          name="identifier"
          defaultValue={resource?.identifier ?? ""}
          placeholder="Vehicle plate, guide ID…"
          className={`${input} mt-2 w-full`}
        />
      </label>
      <label className="text-sm">
        Capacity
        <input
          required
          name="capacity"
          type="number"
          min="1"
          defaultValue={resource?.capacity ?? 1}
          className={`${input} mt-2 w-full`}
        />
      </label>
      <label className="text-sm">
        Status
        <select
          name="status"
          defaultValue={resource?.status ?? "available"}
          className={`${input} mt-2 w-full`}
        >
          <option value="available">Available</option>
          <option value="unavailable">Unavailable</option>
          <option value="maintenance">Maintenance</option>
          {resource && <option value="archived">Archived</option>}
        </select>
      </label>
      <label className={`text-sm ${compact ? "" : "sm:col-span-2"}`}>
        Image URL (optional)
        <input
          name="imageUrl"
          type="url"
          defaultValue={resource?.image_url ?? ""}
          className={`${input} mt-2 w-full`}
        />
      </label>
      <label className={`text-sm ${fullSpan}`}>
        Specifications
        <textarea
          name="specifications"
          rows={3}
          defaultValue={serializeSpecifications(resource?.specifications)}
          placeholder={"Seats: 6\nEngine: 250 HP"}
          className={`${input} mt-2 w-full py-3`}
        />
        <span className="mt-1 block text-xs text-white/30">
          One label and value per line.
        </span>
      </label>
      <label className={`text-sm ${fullSpan}`}>
        Notes
        <textarea
          name="notes"
          rows={3}
          defaultValue={resource?.notes}
          className={`${input} mt-2 w-full py-3`}
        />
      </label>
    </>
  );
}

function serializeSpecifications(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return "";
  return Object.entries(value)
    .filter((entry): entry is [string, string] => typeof entry[1] === "string")
    .map(([label, detail]) => `${label}: ${detail}`)
    .join("\n");
}
