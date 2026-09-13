"use client";

import { useRef, useState } from "react";
import { trackPublicEvent } from "@/components/site/public-analytics";

export function BookingRequestForm({
  siteId,
  targetType,
  targetId,
  currency,
  sourcePage,
  departures = [],
  flow = targetType === "rental"
    ? "rental"
    : targetType === "package"
      ? "package"
      : "tour",
  preview = false,
}: {
  siteId: string;
  targetType: "experience" | "rental" | "package";
  targetId: string;
  currency: string;
  sourcePage: string;
  departures?: Array<{ id: string; startsAt: string; endsAt?: string | null }>;
  flow?: "tour" | "rental" | "transfer" | "package";
  preview?: boolean;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  const idempotencyKey = useRef<string | null>(null);
  const started = useRef(false);
  if (preview)
    return (
      <div className="rounded-[var(--site-radius)] border border-black/10 bg-[var(--site-surface)] p-6">
        <h3 className="font-semibold">Booking request preview</h3>
        <p className="mt-2 text-sm text-[var(--site-muted)]">
          Visitors can submit this form after the website is published. Preview
          mode never creates customer or booking records.
        </p>
      </div>
    );
  function trackStart() {
    if (started.current) return;
    started.current = true;
    void trackPublicEvent(
      "booking_started",
      targetType === "experience" ? targetId : undefined,
      targetType === "rental" ? targetId : undefined,
      targetType === "package" ? targetId : undefined,
    );
  }
  async function submit(formData: FormData) {
    setState("sending");
    trackStart();
    idempotencyKey.current ??= crypto.randomUUID();
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          ...Object.fromEntries(formData),
          siteId,
          targetType,
          targetId,
          currency,
          sourcePage,
          idempotencyKey: idempotencyKey.current,
          siteSlug: fallbackSlugFromPath(location.pathname) ?? "",
        }),
      });
      const body = (await response.json().catch(() => ({}))) as {
        error?: string;
      };
      if (!response.ok) throw new Error(body.error);
      setState("sent");
      void trackPublicEvent(
        "booking_submitted",
        targetType === "experience" ? targetId : undefined,
        targetType === "rental" ? targetId : undefined,
        targetType === "package" ? targetId : undefined,
      );
    } catch (requestError) {
      setState("error");
      setError(
        requestError instanceof Error && requestError.message
          ? requestError.message
          : "Could not submit your booking request. Please try again.",
      );
    }
  }
  if (state === "sent")
    return (
      <div
        role="status"
        className="rounded-[var(--site-radius)] bg-[var(--site-surface)] p-7"
      >
        <h3 className="text-xl font-semibold">Booking request received</h3>
        <p className="mt-2 text-[var(--site-muted)]">
          The operator can review availability and confirm the request. No
          payment has been taken.
        </p>
      </div>
    );
  return (
    <form
      action={submit}
      onFocus={trackStart}
      className="grid gap-3 rounded-[var(--site-radius)] bg-[var(--site-surface)] p-6 sm:grid-cols-2"
    >
      <input
        name="website"
        className="absolute -left-[9999px]"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />
      <Field name="name" label="Name" required />
      <Field name="email" label="Email" type="email" required />
      <Field name="phone" label="Phone (optional)" />
      {departures.length > 0 && (flow === "tour" || flow === "package") && (
        <label className="text-sm sm:col-span-2">
          Scheduled departure (optional)
          <select
            name="departureId"
            className="mt-2 min-h-11 w-full rounded-xl border border-black/10 bg-[var(--site-bg)] px-3"
          >
            <option value="">Request another date</option>
            {departures.map((departure) => (
              <option key={departure.id} value={departure.id}>
                {new Intl.DateTimeFormat(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(departure.startsAt))}
              </option>
            ))}
          </select>
        </label>
      )}
      <Field
        name="requestedDate"
        label={flow === "rental" ? "Pickup date" : "Requested date"}
        type="date"
        min={new Date().toISOString().slice(0, 10)}
        required
      />
      {flow === "rental" && (
        <Field
          name="requestedEndDate"
          label="Return date"
          type="date"
          min={new Date().toISOString().slice(0, 10)}
          required
        />
      )}
      {(flow === "rental" || flow === "transfer") && (
        <Field name="startTime" label="Start / pickup time" type="time" />
      )}
      {flow === "rental" && (
        <Field name="endTime" label="Return time" type="time" />
      )}
      {flow === "transfer" && (
        <>
          <Field name="pickupLocation" label="Pickup location" required />
          <Field name="dropoffLocation" label="Drop-off location" required />
          <Field name="luggage" label="Luggage details (optional)" />
        </>
      )}
      {flow === "package" && (
        <Field name="roomPreference" label="Room / group preference" />
      )}
      <Field
        name="adults"
        label={flow === "transfer" ? "Passengers" : "Adults"}
        type="number"
        min="0"
        value="1"
        required
      />
      <Field
        name="children"
        label="Children"
        type="number"
        min="0"
        value="0"
        required
      />
      {flow === "rental" ? (
        <Field
          name="quantity"
          label="Rental units"
          type="number"
          min="1"
          value="1"
          required
        />
      ) : (
        <input type="hidden" name="quantity" value="1" />
      )}
      <label className="text-sm sm:col-span-2">
        Special request (optional)
        <textarea
          name="message"
          rows={4}
          maxLength={3000}
          className="mt-2 w-full rounded-xl border border-black/10 bg-[var(--site-bg)] p-3"
        />
      </label>
      {state === "error" && (
        <p role="alert" className="text-sm text-red-700 sm:col-span-2">
          {error}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "sending"}
        className="site-primary-action min-h-11 rounded-xl bg-[var(--site-accent)] px-5 font-semibold sm:col-span-2"
      >
        {state === "sending" ? "Submitting…" : "Submit booking request"}
      </button>
      <p className="text-xs text-[var(--site-muted)] sm:col-span-2">
        This is a request, not a confirmed booking. No payment is collected.
      </p>
    </form>
  );
}
function Field({
  name,
  label,
  type = "text",
  value,
  min,
  required,
}: {
  name: string;
  label: string;
  type?: string;
  value?: string;
  min?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        defaultValue={value}
        min={min}
        required={required}
        className="mt-2 min-h-11 w-full rounded-xl border border-black/10 bg-[var(--site-bg)] px-3"
      />
    </label>
  );
}
function fallbackSlugFromPath(pathname: string) {
  return pathname.match(/^\/s\/([a-z0-9]+(?:-[a-z0-9]+)*)(?:\/|$)/)?.[1];
}
