type Business = {
  name: string;
  businessType?: string;
  email?: string;
  phone?: string | null;
  city?: string;
  country?: string;
  logoUrl?: string | null;
  socialUrls?: string[];
};

export function organizationJsonLd(business: Business, url: string) {
  return compact({
    "@context": "https://schema.org",
    "@type":
      business.businessType === "travel_agency"
        ? "TravelAgency"
        : "Organization",
    name: business.name,
    url,
    logo: business.logoUrl || undefined,
    email: business.email || undefined,
    telephone: business.phone || undefined,
    address:
      business.city && business.country
        ? {
            "@type": "PostalAddress",
            addressLocality: business.city,
            addressCountry: business.country,
          }
        : undefined,
    sameAs: business.socialUrls?.filter(Boolean),
  });
}

export function websiteJsonLd(name: string, url: string) {
  return { "@context": "https://schema.org", "@type": "WebSite", name, url };
}

export function breadcrumbJsonLd(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function experienceJsonLd(
  experience: {
    name: string;
    description: string;
    image?: string | null;
    price?: number | null;
    currency?: string;
    bookingUrl?: string | null;
    location?: string | null;
  },
  url: string,
) {
  return compact({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: experience.name,
    description: experience.description,
    image: experience.image || undefined,
    url,
    touristType: experience.location || undefined,
    offers:
      experience.price != null && experience.currency
        ? {
            "@type": "Offer",
            price: experience.price,
            priceCurrency: experience.currency,
            url: experience.bookingUrl || url,
          }
        : undefined,
  });
}

export function rentalJsonLd(
  rental: {
    name: string;
    description: string;
    image?: string | null;
    rate?: { amount: number | null; currency: string; pricingUnit: string };
    bookingUrl?: string | null;
  },
  url: string,
) {
  const rate = rental.rate;
  return compact({
    "@context": "https://schema.org",
    "@type": "Product",
    name: rental.name,
    description: rental.description,
    image: rental.image || undefined,
    url,
    offers:
      rate?.amount != null
        ? {
            "@type": "Offer",
            price: rate.amount,
            priceCurrency: rate.currency,
            url: rental.bookingUrl || url,
            unitText: rate.pricingUnit,
          }
        : undefined,
  });
}

export function faqJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

function compact<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}
