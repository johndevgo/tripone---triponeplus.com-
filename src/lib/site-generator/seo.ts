import { slugify, truncate } from "@/lib/utils";

export function createPageSeo(title: string, brand: string, location?: string) {
  const full =
    title === "Home"
      ? `${brand}${location ? ` | Experiences in ${location}` : ""}`
      : `${title}${location ? ` in ${location}` : ""} | ${brand}`;
  return {
    title: truncate(full, 60),
    description: truncate(
      `Explore ${title.toLowerCase()} from ${brand}${location ? ` in ${location}` : ""}. View details and get in touch.`,
      155,
    ),
    canonicalPath: title === "Home" ? "/" : `/${slugify(title)}`,
    openGraph: { title: truncate(full, 60) },
  };
}

export function createExperienceSeo(
  name: string,
  brand: string,
  location?: string,
) {
  const title = truncate(
    `${name}${location ? ` in ${location}` : ""} | ${brand}`,
    60,
  );
  return {
    title,
    description: truncate(
      `Discover ${name}${location ? ` in ${location}` : ""} from ${brand}. View details, pricing and booking information.`,
      155,
    ),
    slug: slugify(`${name}${location ? ` ${location}` : ""}`),
    canonicalPath: `/experiences/${slugify(`${name}${location ? ` ${location}` : ""}`)}`,
  };
}
