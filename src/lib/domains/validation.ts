import { z } from "zod";

const reservedTripOneHosts = new Set([
  "triponeplus.com",
  "www.triponeplus.com",
  "app.triponeplus.com",
]);

export const hostnameSchema = z
  .string()
  .trim()
  .min(4)
  .max(253)
  .transform(normalizeHostname)
  .refine((value) => isHostname(value), "Enter a valid hostname.")
  .refine(
    (value) =>
      !reservedTripOneHosts.has(value) && !value.endsWith(".triponeplus.com"),
    "TripOne+ hostnames are managed automatically.",
  );

export function normalizeHostname(input: string) {
  let value = input.trim().toLowerCase().replace(/\.$/, "");
  if (value.includes("://")) {
    try {
      value = new URL(value).hostname.toLowerCase();
    } catch {
      return "";
    }
  }
  return value.replace(/^www\./, "");
}

export function isHostname(value: string) {
  if (
    value.length < 4 ||
    value.length > 253 ||
    value.includes("..") ||
    value === "localhost" ||
    /^\d{1,3}(?:\.\d{1,3}){3}$/.test(value)
  )
    return false;
  const labels = value.split(".");
  return (
    labels.length >= 2 &&
    labels.every(
      (label) =>
        label.length > 0 &&
        label.length <= 63 &&
        /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(label),
    )
  );
}

export function isApexHostname(hostname: string) {
  return hostname.split(".").length === 2;
}

export function getDnsFallback(hostname: string) {
  return isApexHostname(hostname)
    ? { type: "A", name: "@", value: "76.76.21.21" }
    : {
        type: "CNAME",
        name: hostname.split(".")[0]!,
        value: "cname.vercel-dns-0.com",
      };
}

export const redirectInputSchema = z.object({
  siteId: z.uuid(),
  sourcePath: z
    .string()
    .trim()
    .regex(/^\/(?!\/)[^?#]*$/, "Source must be a same-site path."),
  destinationPath: z.string().trim().refine(isSafeRedirectDestination, {
    message: "Destination must be a same-site path or an http(s) URL.",
  }),
  statusCode: z.coerce
    .number()
    .refine((value) => value === 301 || value === 302),
});

export function isSafeRedirectDestination(value: string) {
  if (/^\/(?!\/)[^\s]*$/.test(value)) return true;
  try {
    const url = new URL(value);
    return (
      (url.protocol === "https:" || url.protocol === "http:") &&
      !url.username &&
      !url.password
    );
  } catch {
    return false;
  }
}

export function wouldCreateRedirectLoop(
  source: string,
  destination: string,
  redirects: Array<{ source_path: string; destination_path: string }>,
) {
  if (source === destination) return true;
  if (!destination.startsWith("/")) return false;
  const map = new Map(
    redirects.map((item) => [item.source_path, item.destination_path]),
  );
  map.set(source, destination);
  let cursor: string | undefined = destination;
  const visited = new Set<string>();
  while (cursor?.startsWith("/")) {
    if (cursor === source || visited.has(cursor)) return true;
    visited.add(cursor);
    cursor = map.get(cursor);
  }
  return false;
}
