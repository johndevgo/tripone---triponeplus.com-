export function isValidTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}

export function supportedTimeZones(current?: string | null) {
  const intl = Intl as typeof Intl & {
    supportedValuesOf?: (key: "timeZone") => string[];
  };
  const values = intl.supportedValuesOf?.("timeZone") ?? ["UTC"];
  return Array.from(
    new Set([
      "UTC",
      ...(current && isValidTimeZone(current) ? [current] : []),
      ...values,
    ]),
  ).sort((a, b) => a.localeCompare(b));
}
