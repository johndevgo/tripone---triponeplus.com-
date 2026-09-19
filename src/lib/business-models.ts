import type { BusinessCapability } from "@/lib/types";

export const businessModels = [
  {
    id: "tours",
    label: "Tours & activities",
    description:
      "Guided tours, day trips, excursions, safaris, outdoor activities and local experiences.",
    representative: "tour_operator",
    capabilities: [
      "tour_operator",
      "day_tour",
      "local_guide",
      "excursion",
      "adventure_activity",
      "safari",
      "trekking",
      "hiking",
      "diving",
      "snorkelling",
      "rafting",
      "atv_buggy",
      "water_sports",
      "motorcycle_tour",
      "jetski",
    ],
  },
  {
    id: "rentals",
    label: "Rentals",
    description:
      "Vehicles, boats, watercraft, outdoor gear and other bookable rental inventory.",
    representative: "boat_rental",
    capabilities: [
      "boat_rental",
      "motorcycle_rental",
      "vehicle_rental",
      "equipment_rental",
    ],
  },
  {
    id: "packages",
    label: "Travel packages",
    description:
      "Multi-day itineraries, holidays and packages assembled from services, stays and transfers.",
    representative: "travel_agency",
    capabilities: ["travel_agency", "multi_day_tour"],
  },
  {
    id: "other",
    label: "Other travel services",
    description:
      "A flexible operating area for tourism services outside the three core models.",
    representative: "other",
    capabilities: ["other"],
  },
] as const satisfies ReadonlyArray<{
  id: string;
  label: string;
  description: string;
  representative: BusinessCapability;
  capabilities: readonly BusinessCapability[];
}>;

export type BusinessModel = (typeof businessModels)[number]["id"];

export function businessModelForCapability(
  capability: BusinessCapability,
): BusinessModel {
  return (
    businessModels.find((model) =>
      (model.capabilities as readonly BusinessCapability[]).includes(
        capability,
      ),
    )?.id ?? "other"
  );
}

export function representativesForModels(
  selected: readonly BusinessModel[],
): BusinessCapability[] {
  return businessModels
    .filter((model) => selected.includes(model.id))
    .map((model) => model.representative);
}

export function representativeForModel(modelId: BusinessModel) {
  return businessModels.find((model) => model.id === modelId)!.representative;
}
