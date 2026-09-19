export const defaultPlatformSettings = {
  foundingFreeYears: 1,
  inactivityDays: 60,
  annualPrice: 99,
  currency: "USD",
  retentionEnabled: true,
} as const;

export type AuthActivity = {
  createdAt: string;
  lastSignInAt?: string | null;
};

export function inactiveAccountCutoff(
  now: Date,
  inactivityDays = defaultPlatformSettings.inactivityDays,
) {
  return new Date(now.getTime() - inactivityDays * 86_400_000);
}

export function isInactiveAccount(activity: AuthActivity, cutoff: Date) {
  const lastActivity = new Date(
    activity.lastSignInAt ?? activity.createdAt,
  ).getTime();
  return Number.isFinite(lastActivity) && lastActivity < cutoff.getTime();
}

export function formatPlanPrice(price: number, currency: string) {
  try {
    return new Intl.NumberFormat("en", {
      style: "currency",
      currency,
      maximumFractionDigits: Number.isInteger(price) ? 0 : 2,
    }).format(price);
  } catch {
    return `${currency} ${price.toLocaleString("en")}`;
  }
}

export function formatFreePeriod(years: number) {
  return `${years} ${years === 1 ? "year" : "years"}`;
}
