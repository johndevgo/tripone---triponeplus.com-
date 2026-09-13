import "server-only";

import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

/** Request-scoped viewer lookup shared by marketing chrome and CTAs. */
export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});
