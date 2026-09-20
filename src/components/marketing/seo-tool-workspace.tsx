"use client";

import { useMemo, useState } from "react";
import {
  Calculator,
  Check,
  Clipboard,
  RotateCcw,
  WandSparkles,
} from "lucide-react";

type Field = {
  key: string;
  label: string;
  defaultValue: string;
  type?: "number" | "url" | "text";
  min?: number;
};

type ToolDefinition = {
  intro: string;
  fields: Field[];
  calculate: (values: Record<string, string>) => string;
};

export function SeoToolWorkspace({
  slug,
  title,
}: {
  slug: string;
  title: string;
}) {
  const definition = definitions[slug] ?? documentDefinition(slug);
  const initialValues = Object.fromEntries(
    definition.fields.map((field) => [field.key, field.defaultValue]),
  );
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const [copied, setCopied] = useState(false);
  const result = useMemo(
    () => definition.calculate(values),
    [definition, values],
  );

  async function copyResult() {
    await navigator.clipboard.writeText(result);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <section
      aria-labelledby="tool-workspace-title"
      className="glass mt-14 overflow-hidden rounded-[2rem]"
    >
      <div className="border-b border-white/10 bg-emerald-300/[.06] px-6 py-6 sm:px-8">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-[#95ee8e]">
          <Calculator size={16} /> Interactive workspace
        </p>
        <h2 id="tool-workspace-title" className="mt-3 text-2xl font-semibold">
          Use the {title.toLowerCase()}
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-white/55">
          {definition.intro} Your entries stay in this browser and are not
          saved.
        </p>
      </div>

      <div className="grid lg:grid-cols-[.9fr_1.1fr]">
        <form
          className="grid content-start gap-5 border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r"
          onSubmit={(event) => event.preventDefault()}
        >
          {definition.fields.map((field) => (
            <label key={field.key} className="grid gap-2 text-sm font-medium">
              {field.label}
              <input
                type={field.type ?? "text"}
                min={field.min}
                step={field.type === "number" ? "any" : undefined}
                value={values[field.key] ?? ""}
                onChange={(event) =>
                  setValues((current) => ({
                    ...current,
                    [field.key]: event.target.value,
                  }))
                }
                className="min-h-12 rounded-xl border border-white/12 bg-black/20 px-4 text-white outline-none transition placeholder:text-white/25 focus:border-emerald-300/55 focus:ring-2 focus:ring-emerald-300/15"
              />
            </label>
          ))}
          <button
            type="button"
            onClick={() => setValues(initialValues)}
            className="mt-1 inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/12 bg-white/[.05] px-4 text-sm font-semibold transition hover:bg-white/[.09]"
          >
            <RotateCcw size={16} /> Reset example
          </button>
        </form>

        <div className="flex min-h-80 flex-col p-6 sm:p-8">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.16em] text-white/40">
            <WandSparkles size={15} /> Live result
          </p>
          <pre className="mt-5 min-h-48 flex-1 whitespace-pre-wrap break-words rounded-2xl border border-emerald-300/15 bg-[#021912]/65 p-5 font-sans text-base leading-7 text-white/75">
            {result}
          </pre>
          <button
            type="button"
            onClick={copyResult}
            className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#5bcd57] px-5 text-sm font-semibold text-[#173028] transition hover:bg-[#70dd69]"
          >
            {copied ? <Check size={17} /> : <Clipboard size={17} />}
            {copied ? "Copied" : "Copy result"}
          </button>
        </div>
      </div>
    </section>
  );
}

const number = (values: Record<string, string>, key: string) => {
  const value = Number(values[key]);
  return Number.isFinite(value) ? value : 0;
};
const money = (value: number) =>
  new Intl.NumberFormat("en", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number.isFinite(value) ? value : 0);
const percentage = (value: number) => `${value.toFixed(2)}%`;
const numericField = (
  key: string,
  label: string,
  defaultValue: number,
): Field => ({
  key,
  label,
  defaultValue: String(defaultValue),
  type: "number",
  min: 0,
});

const definitions: Record<string, ToolDefinition> = {
  "tour-pricing-calculator": {
    intro:
      "Estimate a per-guest selling price from trip cost, capacity, margin and distribution commission.",
    fields: [
      numericField("cost", "Total operating cost (USD)", 1200),
      numericField("guests", "Paying guests", 8),
      numericField("margin", "Target profit margin (%)", 25),
      numericField("commission", "Distribution commission (%)", 15),
    ],
    calculate: (v) => {
      const denominator =
        1 - number(v, "margin") / 100 - number(v, "commission") / 100;
      const guests = Math.max(1, number(v, "guests"));
      return denominator > 0
        ? `Suggested price per guest: ${money(number(v, "cost") / guests / denominator)}\n\nFormula: total cost ÷ guests ÷ (1 − margin − commission). Review taxes, contingencies and market positioning before publishing.`
        : "Margin and commission must total less than 100%.";
    },
  },
  "tour-package-pricing-calculator": {
    intro:
      "Combine package components and apply a transparent markup per traveller.",
    fields: [
      numericField("stay", "Accommodation total", 900),
      numericField("transport", "Transport total", 450),
      numericField("activities", "Activities and guides", 650),
      numericField("travellers", "Travellers", 4),
      numericField("markup", "Markup (%)", 25),
    ],
    calculate: (v) => {
      const cost =
        number(v, "stay") + number(v, "transport") + number(v, "activities");
      const total = cost * (1 + number(v, "markup") / 100);
      return `Package cost: ${money(cost)}\nSuggested package price: ${money(total)}\nSuggested price per traveller: ${money(total / Math.max(1, number(v, "travellers")))}\n\nAdd taxes, contingencies and supplier terms where applicable.`;
    },
  },
  "tour-profit-margin-calculator": {
    intro:
      "Calculate gross profit and margin from revenue and direct operating cost.",
    fields: [
      numericField("revenue", "Revenue", 2500),
      numericField("cost", "Direct cost", 1650),
    ],
    calculate: (v) => {
      const revenue = number(v, "revenue");
      const profit = revenue - number(v, "cost");
      return `Gross profit: ${money(profit)}\nGross margin: ${percentage(revenue ? (profit / revenue) * 100 : 0)}`;
    },
  },
  "tour-markup-calculator": {
    intro:
      "Convert a cost and markup percentage into a proposed selling price.",
    fields: [
      numericField("cost", "Cost", 100),
      numericField("markup", "Markup (%)", 30),
    ],
    calculate: (v) => {
      const cost = number(v, "cost");
      const price = cost * (1 + number(v, "markup") / 100);
      return `Selling price: ${money(price)}\nGross profit: ${money(price - cost)}\nEquivalent margin: ${percentage(price ? ((price - cost) / price) * 100 : 0)}`;
    },
  },
  "tour-break-even-calculator": {
    intro:
      "Estimate the guests required for contribution to cover fixed trip costs.",
    fields: [
      numericField("fixed", "Fixed costs", 1000),
      numericField("price", "Price per guest", 180),
      numericField("variable", "Variable cost per guest", 55),
    ],
    calculate: (v) => {
      const contribution = number(v, "price") - number(v, "variable");
      return contribution > 0
        ? `Break-even guests: ${Math.ceil(number(v, "fixed") / contribution)}\nContribution per guest: ${money(contribution)}`
        : "Price per guest must be higher than variable cost per guest.";
    },
  },
  "ota-commission-calculator": {
    intro:
      "See the gross commission deducted from bookings sold through an OTA.",
    fields: [
      numericField("revenue", "Gross booking revenue", 5000),
      numericField("rate", "OTA commission (%)", 25),
    ],
    calculate: (v) => {
      const fee = number(v, "revenue") * (number(v, "rate") / 100);
      return `Estimated OTA commission: ${money(fee)}\nRevenue after commission: ${money(number(v, "revenue") - fee)}\n\nThis does not include payment, promotion or cancellation costs.`;
    },
  },
  "roas-calculator": ratioDefinition(
    "Ad-attributed revenue",
    "Ad spend",
    "Return on ad spend",
    "revenue",
    "spend",
    "×",
  ),
  "customer-acquisition-cost-calculator": ratioDefinition(
    "Sales and marketing spend",
    "New customers",
    "Customer acquisition cost",
    "spend",
    "customers",
    "currency",
  ),
  "cost-per-booking-calculator": ratioDefinition(
    "Campaign spend",
    "Confirmed bookings",
    "Cost per booking",
    "spend",
    "bookings",
    "currency",
  ),
  "tour-occupancy-calculator": percentDefinition(
    "Booked seats",
    "Available seats",
    "Occupancy rate",
    "booked",
    "available",
  ),
  "tour-capacity-calculator": {
    intro: "Estimate total scheduled capacity across a set of departures.",
    fields: [
      numericField("departures", "Number of departures", 12),
      numericField("seats", "Capacity per departure", 10),
    ],
    calculate: (v) =>
      `Scheduled capacity: ${Math.floor(number(v, "departures") * number(v, "seats"))} guest places`,
  },
  "guide-guest-ratio-calculator": {
    intro: "Calculate the operational guest-to-guide ratio for a departure.",
    fields: [
      numericField("guests", "Guests", 18),
      numericField("guides", "Guides", 3),
    ],
    calculate: (v) =>
      `Guest-to-guide ratio: ${(number(v, "guests") / Math.max(1, number(v, "guides"))).toFixed(1)} guests per guide\n\nConfirm legal, safety and route-specific requirements separately.`,
  },
  "tour-cancellation-rate-calculator": percentDefinition(
    "Cancelled bookings",
    "Total bookings",
    "Cancellation rate",
    "cancelled",
    "total",
  ),
  "travel-utm-builder": {
    intro: "Create a campaign URL with consistently encoded UTM parameters.",
    fields: [
      {
        key: "url",
        label: "Landing page URL",
        defaultValue: "https://example.com/tours",
        type: "url",
      },
      { key: "source", label: "Campaign source", defaultValue: "instagram" },
      { key: "medium", label: "Campaign medium", defaultValue: "paid_social" },
      {
        key: "campaign",
        label: "Campaign name",
        defaultValue: "autumn_escape",
      },
    ],
    calculate: (v) => {
      try {
        const url = new URL(v.url || "https://example.com");
        url.searchParams.set("utm_source", v.source || "source");
        url.searchParams.set("utm_medium", v.medium || "medium");
        url.searchParams.set("utm_campaign", v.campaign || "campaign");
        return url.toString();
      } catch {
        return "Enter a complete URL beginning with https://";
      }
    },
  },
  "travel-meta-title-generator": textGeneratorDefinition("meta title", 60),
  "travel-meta-description-generator": textGeneratorDefinition(
    "meta description",
    155,
  ),
  "tour-schema-generator": {
    intro:
      "Create a conservative JSON-LD starting point without invented ratings or offers.",
    fields: [
      {
        key: "name",
        label: "Business or experience name",
        defaultValue: "Mountain Path Tours",
      },
      {
        key: "url",
        label: "Canonical URL",
        defaultValue: "https://example.com/tours/mountain-path",
        type: "url",
      },
      {
        key: "description",
        label: "Accurate description",
        defaultValue:
          "Guided mountain day tours with published itineraries and enquiry options.",
      },
    ],
    calculate: (v) =>
      JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "TouristTrip",
          name: v.name,
          url: v.url,
          description: v.description,
        },
        null,
        2,
      ),
  },
};

function ratioDefinition(
  firstLabel: string,
  secondLabel: string,
  resultLabel: string,
  firstKey: string,
  secondKey: string,
  format: "×" | "currency",
): ToolDefinition {
  return {
    intro: `Calculate ${resultLabel.toLowerCase()} using two visible inputs.`,
    fields: [
      numericField(firstKey, firstLabel, 5000),
      numericField(secondKey, secondLabel, 1000),
    ],
    calculate: (v) => {
      const result = number(v, firstKey) / Math.max(1, number(v, secondKey));
      return `${resultLabel}: ${format === "currency" ? money(result) : `${result.toFixed(2)}×`}`;
    },
  };
}

function percentDefinition(
  firstLabel: string,
  secondLabel: string,
  resultLabel: string,
  firstKey: string,
  secondKey: string,
): ToolDefinition {
  return {
    intro: `Calculate ${resultLabel.toLowerCase()} with a transparent percentage formula.`,
    fields: [
      numericField(firstKey, firstLabel, 12),
      numericField(secondKey, secondLabel, 100),
    ],
    calculate: (v) =>
      `${resultLabel}: ${percentage((number(v, firstKey) / Math.max(1, number(v, secondKey))) * 100)}`,
  };
}

function textGeneratorDefinition(kind: string, limit: number): ToolDefinition {
  return {
    intro: `Draft a concise ${kind} from verified offer, location and brand inputs.`,
    fields: [
      {
        key: "offer",
        label: "Tour, package or service",
        defaultValue: "Guided Mountain Day Tour",
      },
      { key: "location", label: "Location", defaultValue: "Pokhara" },
      {
        key: "brand",
        label: "Business name",
        defaultValue: "Mountain Path Tours",
      },
    ],
    calculate: (v) => {
      const title =
        kind === "meta title"
          ? `${v.offer ?? ""} in ${v.location ?? ""} | ${v.brand ?? ""}`
          : `Explore ${(v.offer ?? "").toLowerCase()} in ${v.location ?? ""} from ${v.brand ?? ""}. Review the itinerary, practical details and enquiry options before planning your trip.`;
      return `${title.slice(0, limit).trim()}\n\nLength: ${Math.min(title.length, limit)} of ${limit} recommended characters`;
    },
  };
}

function documentDefinition(slug: string): ToolDefinition {
  const isItinerary = slug.includes("itinerary");
  const isInvoice = slug.includes("invoice");
  const noun = isItinerary
    ? "itinerary"
    : isInvoice
      ? "invoice"
      : "travel quote";
  return {
    intro: `Create an editable ${noun} draft from the essential customer and trip details.`,
    fields: [
      {
        key: "customer",
        label: isItinerary ? "Destination" : "Customer name",
        defaultValue: isItinerary ? "Kathmandu Valley" : "Alex Traveller",
      },
      {
        key: "service",
        label: isItinerary ? "Main experience" : "Tour or package",
        defaultValue: isItinerary
          ? "Culture, food and heritage"
          : "Five-day cultural journey",
      },
      numericField(
        "amount",
        isItinerary ? "Number of days" : "Quoted amount (USD)",
        isItinerary ? 5 : 1250,
      ),
    ],
    calculate: (v) => {
      if (isItinerary) {
        const days = Math.min(21, Math.max(1, Math.floor(number(v, "amount"))));
        return [
          `${v.customer}: ${days}-day itinerary`,
          ...Array.from(
            { length: days },
            (_, index) =>
              `Day ${index + 1}: ${v.service} — add timing, transport, inclusions and practical notes.`,
          ),
        ].join("\n");
      }
      return `${isInvoice ? "INVOICE" : "TRAVEL QUOTE"}\nCustomer: ${v.customer}\nService: ${v.service}\nAmount: ${money(number(v, "amount"))}\n\nAdd business identity, dates, inclusions, taxes, payment terms and validity before issuing.`;
    },
  };
}
