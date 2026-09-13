import { HeaderNavigation } from "@/components/marketing/header-navigation";
import { getCurrentUser } from "@/lib/auth/current-user";

export async function MarketingHeader() {
  const user = await getCurrentUser();
  return <HeaderNavigation authenticated={Boolean(user)} />;
}
