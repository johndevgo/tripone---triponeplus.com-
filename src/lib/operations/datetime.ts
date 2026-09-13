/** Convert a timezone-free datetime-local value into an absolute ISO instant. */
export function localDateTimeToIso(value: string, timeZone: string) {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value)) {
    throw new Error("Enter a valid local date and time.");
  }
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  });
  const desiredAsUtc = Date.parse(`${value}:00Z`);
  let candidate = desiredAsUtc;

  // A second pass handles offset changes near daylight-saving transitions.
  for (let pass = 0; pass < 2; pass += 1) {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(new Date(candidate))
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value]),
    );
    const representedAsUtc = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute),
      Number(parts.second),
    );
    candidate += desiredAsUtc - representedAsUtc;
  }
  return new Date(candidate).toISOString();
}

export function isoToLocalDateTime(value: string, timeZone: string) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    })
      .formatToParts(new Date(value))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`;
}

/** Return a stable YYYY-MM-DD key for an instant in the business timezone. */
export function dateKeyInTimeZone(
  value: string | number | Date,
  timeZone: string,
) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(new Date(value))
      .filter((part) => part.type !== "literal")
      .map((part) => [part.type, part.value]),
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Add calendar days without letting the server timezone shift the date. */
export function addDaysToDateKey(value: string, days: number) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error("Enter a valid calendar date.");
  }
  const date = new Date(`${value}T12:00:00Z`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}
