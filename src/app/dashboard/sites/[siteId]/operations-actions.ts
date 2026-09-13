"use server";

import { randomUUID } from "node:crypto";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import {
  availabilityRuleFormSchema,
  bookingFormSchema,
  bookingUpdateFormSchema,
  bookingStatuses,
  departureFormSchema,
  leadStages,
  packageFormSchema,
  parseLines,
  resourceFormSchema,
} from "@/lib/operations/schemas";
import { slugify } from "@/lib/utils";
import { localDateTimeToIso } from "@/lib/operations/datetime";

type Client = Awaited<ReturnType<typeof createClient>>;

async function authenticated(path: string): Promise<Client> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(path)}`);
  return supabase;
}

function feedback(path: string, kind: "message" | "error", value: string) {
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}${kind}=${encodeURIComponent(value)}`;
}

function fail(path: string, error: unknown, fallback: string): never {
  const reference = randomUUID().slice(0, 8).toUpperCase();
  console.error("TripOne+ operation failed", { reference, error });
  const known = error as { code?: string; message?: string } | null;
  const message =
    known?.code === "23505"
      ? "A record with those details already exists."
      : known?.message?.includes("capacity") ||
          known?.message?.includes("allocated")
        ? known.message
        : `${fallback} Reference: ${reference}`;
  redirect(feedback(path, "error", message));
}

function isoFromLocal(
  value: FormDataEntryValue | null,
  timezone: FormDataEntryValue | null = "UTC",
) {
  const raw = String(value ?? "");
  if (!raw) return "";
  return localDateTimeToIso(raw, String(timezone || "UTC"));
}

export async function savePackage(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const id = String(formData.get("id") ?? "");
  const path = `/dashboard/sites/${siteId}/packages/${id || "new"}`;
  const itemTitles = formData.getAll("itemTitle");
  const itemKinds = formData.getAll("itemKind");
  const itemTargets = formData.getAll("itemTarget");
  const itemDays = formData.getAll("itemDay");
  const itemDescriptions = formData.getAll("itemDescription");
  const optionalItems = new Set(
    formData.getAll("itemOptional").map((value) => String(value)),
  );
  const items = itemTitles
    .map((title, index) => {
      const kind = String(itemKinds[index] ?? "custom");
      const target = String(itemTargets[index] ?? "");
      return {
        experienceId: kind === "experience" ? target : "",
        rentalProductId: kind === "rental" ? target : "",
        dayNumber: String(itemDays[index] ?? ""),
        title: String(title),
        description: String(itemDescriptions[index] ?? "").trim(),
        optional: optionalItems.has(String(index)),
        sortOrder: index,
      };
    })
    .filter((item) => item.title.trim());
  const itinerary = formData
    .getAll("itineraryTitle")
    .map((title, index) => ({
      day: index + 1,
      title: String(title).trim(),
      description: String(
        formData.getAll("itineraryDescription")[index] ?? "",
      ).trim(),
      accommodation: String(
        formData.getAll("itineraryAccommodation")[index] ?? "",
      ).trim(),
      meals: String(formData.getAll("itineraryMeals")[index] ?? "").trim(),
      distance: String(
        formData.getAll("itineraryDistance")[index] ?? "",
      ).trim(),
      hours: String(formData.getAll("itineraryHours")[index] ?? "").trim(),
    }))
    .filter((item) => item.title);
  const faqAnswers = formData.getAll("faqAnswer");
  const faqs = formData
    .getAll("faqQuestion")
    .map((question, index) => ({
      question: String(question).trim(),
      answer: String(faqAnswers[index] ?? "").trim(),
    }))
    .filter((faq) => faq.question && faq.answer);
  const payload = {
    ...Object.fromEntries(formData),
    siteId,
    id,
    slug: slugify(String(formData.get("slug") || formData.get("name") || "")),
    durationDays: String(formData.get("durationDays") ?? ""),
    priceFrom: String(formData.get("priceFrom") ?? ""),
    featured: formData.get("featured") === "on",
    gallery: parseLines(formData.get("galleryUrls"), 30),
    details: {
      startPoint: String(formData.get("startPoint") ?? ""),
      endPoint: String(formData.get("endPoint") ?? ""),
      difficulty: String(formData.get("difficulty") ?? ""),
      bestSeason: String(formData.get("bestSeason") ?? ""),
      groupSize: String(formData.get("groupSize") ?? ""),
      maxAltitude: String(formData.get("maxAltitude") ?? ""),
      accommodation: String(formData.get("accommodation") ?? ""),
      meals: String(formData.get("meals") ?? ""),
    },
    highlights: parseLines(formData.get("highlights")),
    inclusions: parseLines(formData.get("inclusions")),
    exclusions: parseLines(formData.get("exclusions")),
    policies: parseLines(formData.get("policies"), 30),
    itinerary,
    faqs,
    items,
    seoSettings: {
      title: String(formData.get("seoTitle") ?? ""),
      description: String(formData.get("seoDescription") ?? ""),
    },
  };
  const parsed = packageFormSchema.safeParse(payload);
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the package details.",
      ),
    );
  const supabase = await authenticated(path);
  const { data, error } = await supabase.rpc("save_package", {
    payload: parsed.data,
  });
  if (error) fail(path, error, "The package could not be saved.");
  revalidatePath(`/dashboard/sites/${siteId}/packages`);
  redirect(
    feedback(
      `/dashboard/sites/${siteId}/packages/${data}`,
      "message",
      "Package saved",
    ),
  );
}

export async function duplicatePackage(formData: FormData) {
  const parsed = z
    .object({ siteId: z.uuid(), packageId: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/packages`;
  const supabase = await authenticated(path);
  const { data, error } = await supabase.rpc("duplicate_package", {
    target_package: parsed.data.packageId,
  });
  if (error) fail(path, error, "The package could not be duplicated.");
  revalidatePath(path);
  redirect(
    feedback(
      `/dashboard/sites/${parsed.data.siteId}/packages/${data}`,
      "message",
      "Package duplicated as a draft",
    ),
  );
}

export async function createBooking(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const path = `/dashboard/sites/${siteId}/bookings/new`;
  const [targetKind, targetId] = String(
    formData.get("targetSelection") ?? "",
  ).split(":");
  let startsAt = "";
  let endsAt = "";
  try {
    startsAt = isoFromLocal(formData.get("startsAt"), formData.get("timezone"));
    endsAt = formData.get("endsAt")
      ? isoFromLocal(formData.get("endsAt"), formData.get("timezone"))
      : "";
  } catch {
    redirect(feedback(path, "error", "Enter a valid date, time and timezone."));
  }
  const parsed = bookingFormSchema.safeParse({
    ...Object.fromEntries(formData),
    siteId,
    experienceId: targetKind === "experience" ? targetId : "",
    rentalProductId: targetKind === "rental" ? targetId : "",
    packageId: targetKind === "package" ? targetId : "",
    startsAt,
    endsAt,
    idempotencyKey: String(formData.get("idempotencyKey") || randomUUID()),
  });
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the booking details.",
      ),
    );
  const supabase = await authenticated(path);
  const { data, error } = await supabase.rpc("create_booking", {
    payload: {
      ...parsed.data,
      customerSource:
        parsed.data.source === "website"
          ? "website_booking"
          : parsed.data.source,
    },
  });
  if (error) fail(path, error, "The booking could not be created.");
  revalidatePath(`/dashboard/sites/${siteId}/bookings`);
  revalidatePath(`/dashboard/sites/${siteId}/calendar`);
  redirect(
    feedback(
      `/dashboard/sites/${siteId}/bookings/${data}`,
      "message",
      "Booking created",
    ),
  );
}

export async function updateBooking(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const bookingId = z.uuid().parse(formData.get("bookingId"));
  const path = `/dashboard/sites/${siteId}/bookings/${bookingId}`;
  let startsAt = "";
  let endsAt = "";
  try {
    startsAt = isoFromLocal(formData.get("startsAt"), formData.get("timezone"));
    endsAt = formData.get("endsAt")
      ? isoFromLocal(formData.get("endsAt"), formData.get("timezone"))
      : "";
  } catch {
    redirect(feedback(path, "error", "Enter a valid date, time and timezone."));
  }
  const parsed = bookingUpdateFormSchema.safeParse({
    ...Object.fromEntries(formData),
    siteId,
    bookingId,
    startsAt,
    endsAt,
    addOns: parseLines(formData.get("addOns"), 30),
  });
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the booking details.",
      ),
    );
  const supabase = await authenticated(path);
  const { error } = await supabase.rpc("update_booking", {
    payload: parsed.data,
  });
  if (error) fail(path, error, "The booking could not be updated.");
  revalidatePath(path);
  revalidatePath(`/dashboard/sites/${siteId}/bookings`);
  revalidatePath(`/dashboard/sites/${siteId}/calendar`);
  redirect(feedback(path, "message", "Booking details updated"));
}

export async function transitionBooking(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      bookingId: z.uuid(),
      status: z.enum(bookingStatuses),
      note: z.string().max(2000),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/bookings/${parsed.data.bookingId}`;
  const supabase = await authenticated(path);
  const { error } = await supabase.rpc("transition_booking", {
    target_booking: parsed.data.bookingId,
    next_status: parsed.data.status,
    note: parsed.data.note,
  });
  if (error) fail(path, error, "The booking status could not be changed.");
  revalidatePath(path);
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/bookings`);
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/calendar`);
  redirect(feedback(path, "message", "Booking status updated"));
}

export async function assignBookingResource(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      bookingId: z.uuid(),
      resourceId: z.uuid(),
      quantity: z.coerce.number().int().positive(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/bookings/${parsed.data.bookingId}`;
  const supabase = await authenticated(path);
  const { error } = await supabase.rpc("assign_booking_resource", {
    target_booking: parsed.data.bookingId,
    target_resource: parsed.data.resourceId,
    requested_quantity: parsed.data.quantity,
  });
  if (error) fail(path, error, "The resource could not be assigned.");
  revalidatePath(path);
  redirect(feedback(path, "message", "Resource assigned"));
}

export async function unassignBookingResource(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      bookingId: z.uuid(),
      resourceId: z.uuid(),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/bookings/${parsed.data.bookingId}`;
  const supabase = await authenticated(path);
  const { error } = await supabase.rpc("unassign_booking_resource", {
    target_booking: parsed.data.bookingId,
    target_resource: parsed.data.resourceId,
  });
  if (error) fail(path, error, "The resource assignment could not be removed.");
  revalidatePath(path);
  redirect(feedback(path, "message", "Resource unassigned"));
}

export async function saveResource(formData: FormData) {
  const specifications = Object.fromEntries(
    parseLines(formData.get("specifications"), 50)
      .map((line) => {
        const [label, ...value] = line.split(":");
        return [label?.trim() ?? "", value.join(":").trim()];
      })
      .filter(([label, value]) => label && value),
  );
  const parsed = resourceFormSchema.safeParse({
    ...Object.fromEntries(formData),
    resourceId: String(formData.get("resourceId") ?? ""),
    specifications,
  });
  const siteId = String(formData.get("siteId") ?? "");
  const path = `/dashboard/sites/${siteId}/resources`;
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the resource details.",
      ),
    );
  const supabase = await authenticated(path);
  const values = {
    site_id: parsed.data.siteId,
    name: parsed.data.name,
    resource_type: parsed.data.resourceType,
    identifier: parsed.data.identifier || null,
    capacity: parsed.data.capacity,
    status: parsed.data.status,
    notes: parsed.data.notes,
    image_url: parsed.data.imageUrl || null,
    specifications: parsed.data.specifications,
  };
  const request = parsed.data.resourceId
    ? supabase
        .from("resources")
        .update(values)
        .eq("id", parsed.data.resourceId)
        .eq("site_id", parsed.data.siteId)
    : supabase.from("resources").insert(values);
  const { error } = await request;
  if (error) fail(path, error, "The resource could not be saved.");
  revalidatePath(path);
  redirect(
    feedback(
      path,
      "message",
      parsed.data.resourceId ? "Resource updated" : "Resource added",
    ),
  );
}

export async function setResourceStatus(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      resourceId: z.uuid(),
      status: z.enum(["available", "unavailable", "maintenance", "archived"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/resources`;
  const supabase = await authenticated(path);
  const { error } = await supabase
    .from("resources")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.resourceId)
    .eq("site_id", parsed.data.siteId);
  if (error) fail(path, error, "The resource status could not be updated.");
  revalidatePath(path);
  redirect(feedback(path, "message", "Resource status updated"));
}

export async function saveDeparture(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const path = `/dashboard/sites/${siteId}/availability`;
  const [targetKind, targetId] = String(
    formData.get("targetSelection") ?? "",
  ).split(":");
  const parsed = departureFormSchema.safeParse({
    ...Object.fromEntries(formData),
    siteId,
    experienceId: targetKind === "experience" ? targetId : "",
    rentalProductId: targetKind === "rental" ? targetId : "",
    packageId: targetKind === "package" ? targetId : "",
    startsAt: isoFromLocal(formData.get("startsAt"), formData.get("timezone")),
    endsAt: formData.get("endsAt")
      ? isoFromLocal(formData.get("endsAt"), formData.get("timezone"))
      : "",
  });
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the departure details.",
      ),
    );
  const supabase = await authenticated(path);
  const { error } = await supabase.from("departures").insert({
    site_id: siteId,
    experience_id: parsed.data.experienceId || null,
    rental_product_id: parsed.data.rentalProductId || null,
    package_id: parsed.data.packageId || null,
    starts_at: parsed.data.startsAt,
    ends_at: parsed.data.endsAt || null,
    capacity: parsed.data.capacity || null,
    minimum_participants: parsed.data.minimumParticipants || null,
    status: parsed.data.status,
    notes: parsed.data.notes,
  });
  if (error) fail(path, error, "The departure could not be created.");
  revalidatePath(path);
  revalidatePath(`/dashboard/sites/${siteId}/calendar`);
  redirect(feedback(path, "message", "Departure created"));
}

export async function saveAvailabilityRule(formData: FormData) {
  const siteId = z.uuid().parse(formData.get("siteId"));
  const path = `/dashboard/sites/${siteId}/availability`;
  const [targetKind, targetId] = String(
    formData.get("targetSelection") ?? "",
  ).split(":");
  const parsed = availabilityRuleFormSchema.safeParse({
    ...Object.fromEntries(formData),
    siteId,
    experienceId: targetKind === "experience" ? targetId : "",
    rentalProductId: targetKind === "rental" ? targetId : "",
    packageId: targetKind === "package" ? targetId : "",
    daysOfWeek: formData.getAll("daysOfWeek"),
    blackoutDates: parseLines(formData.get("blackoutDates"), 365),
    active: formData.get("active") === "on",
  });
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the availability rule.",
      ),
    );
  const supabase = await authenticated(path);
  const { error } = await supabase.from("availability_rules").insert({
    site_id: siteId,
    experience_id: parsed.data.experienceId || null,
    rental_product_id: parsed.data.rentalProductId || null,
    package_id: parsed.data.packageId || null,
    name: parsed.data.name,
    schedule_type: parsed.data.scheduleType,
    starts_on: parsed.data.startsOn || null,
    ends_on: parsed.data.endsOn || null,
    days_of_week: parsed.data.daysOfWeek,
    start_time: parsed.data.startTime || null,
    end_time: parsed.data.endTime || null,
    slot_interval_minutes: parsed.data.slotIntervalMinutes || null,
    blackout_dates: parsed.data.blackoutDates,
    capacity: parsed.data.capacity || null,
    minimum_participants: parsed.data.minimumParticipants || null,
    minimum_notice_hours: parsed.data.minimumNoticeHours,
    cutoff_hours: parsed.data.cutoffHours,
    active: parsed.data.active,
  });
  if (error) fail(path, error, "The availability rule could not be saved.");
  revalidatePath(path);
  redirect(feedback(path, "message", "Availability rule created"));
}

export async function setAvailabilityRuleActive(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      ruleId: z.uuid(),
      active: z.enum(["true", "false"]),
    })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/availability`;
  const supabase = await authenticated(path);
  const { error } = await supabase
    .from("availability_rules")
    .update({ active: parsed.data.active === "true" })
    .eq("id", parsed.data.ruleId)
    .eq("site_id", parsed.data.siteId);
  if (error) fail(path, error, "The availability rule could not be updated.");
  revalidatePath(path);
  redirect(feedback(path, "message", "Availability rule updated"));
}

export async function saveCustomer(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      name: z.string().trim().min(2).max(120),
      email: z.union([z.literal(""), z.email()]),
      phone: z.string().max(40),
      whatsapp: z.string().max(40),
      country: z.string().max(100),
      notes: z.string().max(10_000),
    })
    .refine((value) => value.email || value.phone, {
      message: "Add an email or phone number.",
    })
    .safeParse(Object.fromEntries(formData));
  const siteId = String(formData.get("siteId") ?? "");
  const path = `/dashboard/sites/${siteId}/customers`;
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the customer details.",
      ),
    );
  const supabase = await authenticated(path);
  const { error } = await supabase.from("customers").insert({
    site_id: parsed.data.siteId,
    name: parsed.data.name,
    email: parsed.data.email || null,
    phone: parsed.data.phone || null,
    whatsapp: parsed.data.whatsapp || null,
    country: parsed.data.country || null,
    notes: parsed.data.notes,
    source: "manual",
  });
  if (error) fail(path, error, "The customer could not be saved.");
  revalidatePath(path);
  redirect(feedback(path, "message", "Customer added"));
}

export async function updateCustomer(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      customerId: z.uuid(),
      name: z.string().trim().min(2).max(120),
      email: z.union([z.literal(""), z.email()]),
      phone: z.string().max(40),
      whatsapp: z.string().max(40),
      country: z.string().max(100),
      notes: z.string().max(10_000),
    })
    .refine((value) => value.email || value.phone, {
      message: "Add an email or phone number.",
    })
    .safeParse(Object.fromEntries(formData));
  const siteId = String(formData.get("siteId") ?? "");
  const customerId = String(formData.get("customerId") ?? "");
  const path = `/dashboard/sites/${siteId}/customers/${customerId}`;
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the customer details.",
      ),
    );
  const supabase = await authenticated(path);
  const { error } = await supabase
    .from("customers")
    .update({
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      whatsapp: parsed.data.whatsapp || null,
      country: parsed.data.country || null,
      notes: parsed.data.notes,
    })
    .eq("id", parsed.data.customerId)
    .eq("site_id", parsed.data.siteId);
  if (error) fail(path, error, "The customer could not be updated.");
  revalidatePath(path);
  revalidatePath(`/dashboard/sites/${siteId}/customers`);
  redirect(feedback(path, "message", "Customer updated"));
}

export async function saveManualLead(formData: FormData) {
  const parsed = z
    .object({
      siteId: z.uuid(),
      name: z.string().trim().min(2).max(100),
      email: z.email(),
      phone: z.string().max(40),
      message: z.string().max(3000),
      desiredDate: z.union([z.literal(""), z.iso.date()]),
      guests: z.union([z.literal(""), z.coerce.number().int().positive()]),
      status: z.enum(leadStages),
      followUpAt: z.string(),
      estimatedValue: z.union([z.literal(""), z.coerce.number().nonnegative()]),
      currency: z.string().length(3),
      requestedDestination: z.string().trim().max(200),
      interests: z.string().trim().max(500),
      budgetRange: z.string().trim().max(120),
    })
    .safeParse(Object.fromEntries(formData));
  const siteId = String(formData.get("siteId") ?? "");
  const path = `/dashboard/sites/${siteId}/leads`;
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the lead details.",
      ),
    );
  const supabase = await authenticated(path);
  const { data, error } = await supabase
    .from("leads")
    .insert({
      site_id: parsed.data.siteId,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      desired_date: parsed.data.desiredDate || null,
      guests: parsed.data.guests || null,
      status: parsed.data.status,
      source: "manual",
      follow_up_at: parsed.data.followUpAt
        ? isoFromLocal(parsed.data.followUpAt, formData.get("timezone"))
        : null,
      estimated_value: parsed.data.estimatedValue || null,
      currency: parsed.data.currency.toUpperCase(),
      requested_destination: parsed.data.requestedDestination || null,
      interests: parsed.data.interests
        ? parsed.data.interests
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [],
      budget_range: parsed.data.budgetRange || null,
    })
    .select("id")
    .single();
  if (error) fail(path, error, "The lead could not be saved.");
  await supabase.from("lead_activities").insert({
    site_id: parsed.data.siteId,
    lead_id: data.id,
    activity_type: "created",
    body: "Lead created manually",
  });
  revalidatePath(path);
  redirect(feedback(path, "message", "Lead added"));
}

export async function updateLeadStage(formData: FormData) {
  const parsed = z
    .object({ siteId: z.uuid(), leadId: z.uuid(), status: z.enum(leadStages) })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/leads`;
  const supabase = await authenticated(path);
  const { data: existing } = await supabase
    .from("leads")
    .select("status")
    .eq("id", parsed.data.leadId)
    .eq("site_id", parsed.data.siteId)
    .single();
  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.leadId)
    .eq("site_id", parsed.data.siteId);
  if (error) fail(path, error, "The lead stage could not be changed.");
  if (existing?.status !== parsed.data.status)
    await supabase.from("lead_activities").insert({
      site_id: parsed.data.siteId,
      lead_id: parsed.data.leadId,
      activity_type: "stage_changed",
      body: `${existing?.status ?? "unknown"} to ${parsed.data.status}`,
    });
  revalidatePath(path);
}

export async function updateLeadDetails(formData: FormData) {
  const [targetKind, targetId] = String(
    formData.get("targetSelection") ?? "",
  ).split(":");
  const parsed = z
    .object({
      siteId: z.uuid(),
      leadId: z.uuid(),
      name: z.string().trim().min(2).max(100),
      email: z.email(),
      phone: z.string().max(40),
      message: z.string().max(3000),
      desiredDate: z.union([z.literal(""), z.iso.date()]),
      guests: z.union([
        z.literal(""),
        z.coerce.number().int().positive().max(1000),
      ]),
      followUpAt: z.string(),
      estimatedValue: z.union([z.literal(""), z.coerce.number().nonnegative()]),
      currency: z.string().trim().length(3),
      requestedDestination: z.string().trim().max(200),
      interests: z.string().trim().max(500),
      budgetRange: z.string().trim().max(120),
      lostReason: z.string().trim().max(1000),
      internalNote: z.string().trim().max(3000),
      assignToMe: z.boolean(),
      experienceId: z.union([z.literal(""), z.uuid()]),
      rentalProductId: z.union([z.literal(""), z.uuid()]),
      packageId: z.union([z.literal(""), z.uuid()]),
    })
    .safeParse({
      ...Object.fromEntries(formData),
      assignToMe: formData.get("assignToMe") === "on",
      experienceId: targetKind === "experience" ? targetId : "",
      rentalProductId: targetKind === "rental" ? targetId : "",
      packageId: targetKind === "package" ? targetId : "",
    });
  const siteId = String(formData.get("siteId") ?? "");
  const leadId = String(formData.get("leadId") ?? "");
  const path = `/dashboard/sites/${siteId}/leads/${leadId}`;
  if (!parsed.success)
    redirect(
      feedback(
        path,
        "error",
        parsed.error.issues[0]?.message ?? "Review the lead details.",
      ),
    );
  let followUpAt: string | null = null;
  try {
    followUpAt = parsed.data.followUpAt
      ? isoFromLocal(parsed.data.followUpAt, formData.get("timezone"))
      : null;
  } catch {
    redirect(feedback(path, "error", "Enter a valid follow-up time."));
  }
  const supabase = await authenticated(path);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { error } = await supabase
    .from("leads")
    .update({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      message: parsed.data.message || null,
      desired_date: parsed.data.desiredDate || null,
      guests: parsed.data.guests || null,
      follow_up_at: followUpAt,
      estimated_value: parsed.data.estimatedValue || null,
      currency: parsed.data.currency.toUpperCase(),
      requested_destination: parsed.data.requestedDestination || null,
      interests: parsed.data.interests
        ? parsed.data.interests
            .split(",")
            .map((value) => value.trim())
            .filter(Boolean)
        : [],
      budget_range: parsed.data.budgetRange || null,
      lost_reason: parsed.data.lostReason || null,
      assigned_to: parsed.data.assignToMe ? user?.id : null,
      experience_id: parsed.data.experienceId || null,
      rental_product_id: parsed.data.rentalProductId || null,
      package_id: parsed.data.packageId || null,
    })
    .eq("id", parsed.data.leadId)
    .eq("site_id", parsed.data.siteId);
  if (error) fail(path, error, "The lead could not be updated.");
  await supabase.from("lead_activities").insert({
    site_id: parsed.data.siteId,
    lead_id: parsed.data.leadId,
    actor_id: user?.id,
    activity_type: parsed.data.internalNote ? "note" : "details_updated",
    body: parsed.data.internalNote || "Lead details updated",
  });
  revalidatePath(path);
  revalidatePath(`/dashboard/sites/${siteId}/leads`);
  redirect(feedback(path, "message", "Lead updated"));
}

export async function convertLeadToCustomer(formData: FormData) {
  const parsed = z
    .object({ siteId: z.uuid(), leadId: z.uuid() })
    .safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;
  const path = `/dashboard/sites/${parsed.data.siteId}/leads`;
  const supabase = await authenticated(path);
  const { data, error } = await supabase.rpc("convert_lead_to_customer", {
    target_lead: parsed.data.leadId,
  });
  if (error) fail(path, error, "The lead could not be converted.");
  revalidatePath(path);
  revalidatePath(`/dashboard/sites/${parsed.data.siteId}/customers`);
  redirect(
    feedback(
      `/dashboard/sites/${parsed.data.siteId}/customers/${data}`,
      "message",
      "Customer created from lead",
    ),
  );
}
