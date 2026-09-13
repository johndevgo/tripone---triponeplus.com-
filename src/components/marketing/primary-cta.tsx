import type { ComponentProps } from "react";
import { ButtonLink } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/auth/current-user";

type Props = Omit<ComponentProps<typeof ButtonLink>, "href"> & {
  guestHref?: string;
  guestLabel: React.ReactNode;
  dashboardLabel?: React.ReactNode;
};

export async function MarketingPrimaryCta({
  guestHref = "/signup",
  guestLabel,
  dashboardLabel = "Open dashboard",
  children,
  ...props
}: Props) {
  const user = await getCurrentUser();
  return (
    <ButtonLink {...props} href={user ? "/admin/dashboard" : guestHref}>
      {user ? dashboardLabel : guestLabel} {children}
    </ButtonLink>
  );
}
