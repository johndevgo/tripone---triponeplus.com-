"use client";
import { useState } from "react";
import { trackPublicEvent } from "@/components/site/public-analytics";

export function LeadForm({
  siteId,
  experienceId,
  sourcePage,
}: {
  siteId: string;
  experienceId?: string;
  sourcePage: string;
}) {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState("");
  async function submit(formData: FormData) {
    setState("sending");
    const payload = Object.fromEntries(formData);
    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        ...payload,
        siteId,
        experienceId: experienceId ?? "",
        sourcePage,
      }),
    });
    const body = (await response.json()) as { error?: string };
    if (response.ok) {
      setState("sent");
      void trackPublicEvent("lead_submit", experienceId);
    } else {
      setState("error");
      setError(body.error ?? "Could not send your enquiry.");
    }
  }
  if (state === "sent")
    return (
      <div className="rounded-[var(--site-radius)] bg-[var(--site-surface)] p-7">
        <h3 className="text-xl font-semibold">Enquiry received</h3>
        <p className="mt-2 text-[var(--site-muted)]">
          The team can now follow up using the details you provided.
        </p>
      </div>
    );
  return (
    <form
      action={submit}
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
      <Field name="desiredDate" label="Desired date (optional)" type="date" />
      <Field name="guests" label="Guests (optional)" type="number" />
      <label className="text-sm sm:col-span-2">
        Message (optional)
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
        disabled={state === "sending"}
        className="site-primary-action min-h-11 rounded-xl bg-[var(--site-accent)] px-5 font-semibold sm:col-span-2"
      >
        {state === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}
function Field({
  name,
  label,
  type = "text",
  required,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="text-sm">
      {label}
      <input
        name={name}
        type={type}
        required={required}
        className="mt-2 min-h-11 w-full rounded-xl border border-black/10 bg-[var(--site-bg)] px-3"
      />
    </label>
  );
}
