export type OperationsDemoFixture = {
  id: string;
  business: {
    name: string;
    primaryCapability: string;
    capabilities: string[];
    city: string;
    country: string;
    currency: string;
  };
  offerings: Array<{
    key: string;
    kind: "experience" | "rental";
    name: string;
    image: string;
    quoteOnly?: boolean;
  }>;
  packages: Array<{
    name: string;
    itemKeys: string[];
  }>;
};

/**
 * Truthful, demo-only operating models used by tests and product walkthroughs.
 * They intentionally contain no reviews, booking totals or performance claims.
 */
export const operationsDemoFixtures: OperationsDemoFixture[] = [
  {
    id: "himalayan-trekking",
    business: {
      name: "Himalayan Trail Works",
      primaryCapability: "trekking",
      capabilities: ["trekking", "hiking", "local_guide"],
      city: "Pokhara",
      country: "Nepal",
      currency: "NPR",
    },
    offerings: [
      {
        key: "ridge-day-hike",
        kind: "experience",
        name: "Ridge Day Hike",
        image: "/images/marketing/mountain-trek.webp",
      },
      {
        key: "trekking-poles",
        kind: "rental",
        name: "Trekking Pole Set",
        image: "/images/marketing/mountain-trek.webp",
      },
    ],
    packages: [
      {
        name: "Pokhara Trail Starter",
        itemKeys: ["ridge-day-hike", "trekking-poles"],
      },
    ],
  },
  {
    id: "motorcycle-tours",
    business: {
      name: "Valley Roadcraft",
      primaryCapability: "motorcycle_tour",
      capabilities: ["motorcycle_tour", "motorcycle_rental"],
      city: "Kathmandu",
      country: "Nepal",
      currency: "NPR",
    },
    offerings: [
      {
        key: "valley-riding-day",
        kind: "experience",
        name: "Valley Riding Day",
        image: "/images/marketing/local-guide.webp",
      },
      {
        key: "adventure-motorcycle",
        kind: "rental",
        name: "Adventure Motorcycle",
        image: "/images/marketing/local-guide.webp",
      },
    ],
    packages: [
      {
        name: "Guided Valley Ride",
        itemKeys: ["valley-riding-day", "adventure-motorcycle"],
      },
    ],
  },
  {
    id: "coastal-car-rental",
    business: {
      name: "Coastline Drive Hire",
      primaryCapability: "vehicle_rental",
      capabilities: ["vehicle_rental", "local_guide"],
      city: "Muscat",
      country: "Oman",
      currency: "OMR",
    },
    offerings: [
      {
        key: "compact-suv",
        kind: "rental",
        name: "Compact SUV",
        image: "/images/marketing/coastal-yacht.webp",
      },
      {
        key: "coastal-route-orientation",
        kind: "experience",
        name: "Coastal Route Orientation",
        image: "/images/marketing/coastal-yacht.webp",
      },
    ],
    packages: [],
  },
  {
    id: "travel-agency",
    business: {
      name: "Atlas Journey Desk",
      primaryCapability: "travel_agency",
      capabilities: ["travel_agency", "multi_day_tour"],
      city: "Marrakesh",
      country: "Morocco",
      currency: "MAD",
    },
    offerings: [
      {
        key: "medina-introduction",
        kind: "experience",
        name: "Medina Introduction",
        image: "/images/marketing/safari-dawn.webp",
      },
      {
        key: "desert-transfer",
        kind: "experience",
        name: "Desert Transfer and Orientation",
        image: "/images/marketing/safari-dawn.webp",
      },
    ],
    packages: [
      {
        name: "City and Desert Journey",
        itemKeys: ["medina-introduction", "desert-transfer"],
      },
    ],
  },
  {
    id: "mixed-water-operator",
    business: {
      name: "Blue Current Adventures",
      primaryCapability: "diving",
      capabilities: ["diving", "snorkelling", "boat_rental", "water_sports"],
      city: "Cebu",
      country: "Philippines",
      currency: "PHP",
    },
    offerings: [
      {
        key: "reef-discovery",
        kind: "experience",
        name: "Reef Discovery Dive",
        image: "/images/marketing/reef-diving.webp",
      },
      {
        key: "private-day-boat",
        kind: "rental",
        name: "Private Day Boat",
        image: "/images/marketing/ocean-hero.webp",
        quoteOnly: true,
      },
    ],
    packages: [
      {
        name: "Reef and Island Day",
        itemKeys: ["reef-discovery", "private-day-boat"],
      },
    ],
  },
];
