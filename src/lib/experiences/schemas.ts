import { z } from "zod";

const optionalText = z.string().trim().max(500).optional();
const optionalBoolean = z.boolean().optional();
const optionalNumber = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.number().nonnegative().optional(),
);

const generic = z.object({ notes: optionalText }).catchall(z.unknown());
const schemas: Record<string, z.ZodType<Record<string, unknown>>> = {
  jetski: z.object({
    maximumRiders: optionalNumber,
    driverMinimumAge: optionalNumber,
    passengerMinimumAge: optionalNumber,
    licenseRequired: optionalBoolean,
    safetyEquipment: optionalText,
    instructorIncluded: optionalBoolean,
  }),
  trekking: z.object({
    maximumAltitude: optionalNumber,
    accommodation: optionalText,
    meals: optionalText,
    guideIncluded: optionalBoolean,
    permits: optionalText,
    packingInformation: optionalText,
  }),
  hiking: z.object({
    maximumAltitude: optionalNumber,
    guideIncluded: optionalBoolean,
    packingInformation: optionalText,
  }),
  safari: z.object({
    pickupIncluded: optionalBoolean,
    pickupLocation: optionalText,
    vehicleType: optionalText,
    wildlifeHighlights: z.array(z.string().max(100)).max(30).optional(),
    mealInclusion: optionalText,
  }),
  boat_rental: z.object({
    boatType: optionalText,
    capacity: optionalNumber,
    captainIncluded: optionalBoolean,
    fuelIncluded: optionalBoolean,
  }),
  motorcycle_tour: z.object({
    routeSummary: optionalText,
    distance: optionalText,
    licenseRequired: optionalBoolean,
    minimumLicenseYears: optionalNumber,
    supportVehicle: optionalBoolean,
    ridingEquipment: optionalText,
  }),
};

export function experienceDetailsSchema(type: string) {
  return schemas[type] ?? generic;
}

export function parseExperienceDetails(type: string, value: unknown) {
  return experienceDetailsSchema(type).parse(value);
}

export const repeatableTextSchema = z
  .array(z.string().trim().min(1).max(500))
  .max(50);
export const itinerarySchema = z
  .array(
    z.object({
      title: z.string().trim().min(1).max(120),
      description: z.string().trim().max(1000),
      duration: z.string().trim().max(60).optional(),
    }),
  )
  .max(30);
export const experienceFaqSchema = z
  .array(
    z.object({
      question: z.string().trim().min(1).max(200),
      answer: z.string().trim().min(1).max(2000),
    }),
  )
  .max(30);
