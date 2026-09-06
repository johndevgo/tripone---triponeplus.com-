import { AuthCard, AuthMessage, inputClass } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { resetPassword } from "@/app/auth/actions";
export default async function Reset({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const p = await searchParams;
  return (
    <AuthCard
      title="Choose a new password"
      description="Use at least 8 characters and keep it unique to TripOne+."
    >
      <AuthMessage {...p} />
      <form action={resetPassword} className="mt-6 grid gap-5">
        <label className="text-sm font-medium">
          New password
          <input
            className={inputClass}
            name="password"
            type="password"
            autoComplete="new-password"
            minLength={8}
            required
          />
        </label>
        <Button type="submit">Update password</Button>
      </form>
    </AuthCard>
  );
}
