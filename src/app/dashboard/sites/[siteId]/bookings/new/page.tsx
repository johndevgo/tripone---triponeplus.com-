import { randomUUID } from "node:crypto";
import Link from "next/link";
import { ArrowLeft, CalendarPlus } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { oneRelation } from "@/lib/operations/relations";
import { createBooking } from "../../operations-actions";
import { Feedback } from "../page";
const input =
  "mt-2 min-h-11 w-full rounded-xl border border-white/10 bg-white/[.055] px-3 outline-none focus:border-[#95EE8E]/70";
export default async function NewBookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ siteId: string }>;
  searchParams: Promise<{ error?: string; leadId?: string }>;
}) {
  const { siteId } = await params;
  const feedback = await searchParams;
  const supabase = await createClient();
  const [
    { data: experiences },
    { data: rentals },
    { data: packages },
    { data: departures },
    { data: site },
  ] = await Promise.all([
    supabase
      .from("experiences")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("rental_products")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("packages")
      .select("id,name")
      .eq("site_id", siteId)
      .neq("status", "archived")
      .order("name"),
    supabase
      .from("departures")
      .select("id,starts_at,experience_id,rental_product_id,package_id")
      .eq("site_id", siteId)
      .eq("status", "open")
      .gte("starts_at", new Date().toISOString())
      .order("starts_at")
      .limit(100),
    supabase
      .from("sites")
      .select("businesses(currency,timezone)")
      .eq("id", siteId)
      .single(),
  ]);
  const { data: lead } = feedback.leadId
    ? await supabase
        .from("leads")
        .select(
          "id,name,email,phone,message,desired_date,guests,experience_id,rental_product_id,package_id",
        )
        .eq("id", feedback.leadId)
        .eq("site_id", siteId)
        .maybeSingle()
    : { data: null };
  const leadTarget = lead?.experience_id
    ? `experience:${lead.experience_id}`
    : lead?.rental_product_id
      ? `rental:${lead.rental_product_id}`
      : lead?.package_id
        ? `package:${lead.package_id}`
        : "";
  const business = oneRelation(site?.businesses);
  const timezone = business?.timezone ?? "UTC";
  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/admin/bookings"
        className="inline-flex items-center gap-2 text-sm text-white/45"
      >
        <ArrowLeft size={16} />
        Bookings
      </Link>
      <h1 className="mt-5 text-3xl font-semibold">Add a booking</h1>
      <p className="mt-2 text-sm text-white/45">
        Record a phone, WhatsApp, walk-in or manually confirmed reservation. No
        payment state is created.
      </p>
      <Feedback error={feedback.error} />
      <form action={createBooking} className="mt-8 grid gap-6">
        <input type="hidden" name="siteId" value={siteId} />
        <input type="hidden" name="idempotencyKey" value={randomUUID()} />
        <input type="hidden" name="leadId" value={lead?.id ?? ""} />
        <input type="hidden" name="timezone" value={timezone} />
        <Panel title="Customer">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field
              label="Customer name"
              name="customerName"
              value={lead?.name ?? ""}
              required
            />
            <Field
              label="Email"
              name="email"
              type="email"
              value={lead?.email ?? ""}
            />
            <Field label="Phone" name="phone" value={lead?.phone ?? ""} />
          </div>
        </Panel>
        <Panel title="Service & schedule">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm">
              Product or service
              <select
                required
                name="targetSelection"
                defaultValue={leadTarget}
                className={input}
              >
                <option value="">Choose one</option>
                <optgroup label="Tours & activities">
                  {experiences?.map((x) => (
                    <option key={x.id} value={`experience:${x.id}`}>
                      {x.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Rentals">
                  {rentals?.map((x) => (
                    <option key={x.id} value={`rental:${x.id}`}>
                      {x.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Packages">
                  {packages?.map((x) => (
                    <option key={x.id} value={`package:${x.id}`}>
                      {x.name}
                    </option>
                  ))}
                </optgroup>
              </select>
            </label>
            <label className="text-sm">
              Known departure (optional)
              <select name="departureId" className={input}>
                <option value="">Custom date/time</option>
                {departures?.map((x) => (
                  <option key={x.id} value={x.id}>
                    {new Date(x.starts_at).toLocaleString()}
                  </option>
                ))}
              </select>
            </label>
            <Field
              label={`Start (${timezone})`}
              name="startsAt"
              type="datetime-local"
              required
            />
            <Field
              label={`End (${timezone}, optional)`}
              name="endsAt"
              type="datetime-local"
            />
            <Field
              label="Adults"
              name="adults"
              type="number"
              value={String(lead?.guests ?? 1)}
              required
            />
            <Field
              label="Children"
              name="children"
              type="number"
              value="0"
              required
            />
            <Field
              label="Units / quantity"
              name="quantity"
              type="number"
              value="1"
              required
            />
          </div>
        </Panel>
        <Panel title="Commercial details">
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Quoted total" name="quotedTotal" type="number" />
            <Field
              label="Currency"
              name="currency"
              value={business?.currency ?? "USD"}
              required
            />
            <label className="text-sm">
              Source
              <select name="source" className={input}>
                {[
                  "manual",
                  "phone",
                  "whatsapp",
                  "walk_in",
                  "email",
                  "ota",
                  "partner",
                  "other",
                ].map((x) => (
                  <option value={x} key={x}>
                    {x.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm">
              Status
              <select name="status" defaultValue="pending" className={input}>
                <option value="draft">Draft</option>
                <option value="pending">Pending</option>
                <option value="awaiting_confirmation">
                  Awaiting confirmation
                </option>
                <option value="confirmed">Confirmed</option>
              </select>
            </label>
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <Area
              label="Customer notes"
              name="customerNotes"
              value={lead?.message ?? ""}
            />
            <Area label="Internal notes" name="internalNotes" />
          </div>
        </Panel>
        <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#5BCD57] px-6 font-semibold text-[#173028]">
          <CalendarPlus />
          Create booking
        </button>
      </form>
    </div>
  );
}
function Panel({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="glass rounded-3xl p-6">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}
function Field({
  label,
  name,
  type = "text",
  value,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        min={type === "number" ? 0 : undefined}
        defaultValue={value}
        required={required}
        className={input}
      />
    </label>
  );
}
function Area({
  label,
  name,
  value = "",
}: {
  label: string;
  name: string;
  value?: string;
}) {
  return (
    <label className="text-sm">
      {label}
      <textarea
        name={name}
        rows={4}
        defaultValue={value}
        className={`${input} py-3`}
      />
    </label>
  );
}
