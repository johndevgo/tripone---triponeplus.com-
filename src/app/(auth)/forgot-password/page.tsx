import Link from "next/link";
import { AuthCard, AuthMessage, inputClass } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { forgotPassword } from "@/app/auth/actions";
export default async function Forgot({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const p = await searchParams;
  return (
    <AuthCard
      title="Reset your password"
      description="We’ll send a secure reset link if an account matches this email."
    >
      <AuthMessage {...p} />
      <form action={forgotPassword} className="mt-6 grid gap-5">
        <label className="text-sm font-medium">
          Email
          <input
            className={inputClass}
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </label>
        <Button type="submit">Send reset link</Button>
      </form>
      <p className="mt-6 text-center text-sm">
        <Link className="text-[#FFC857]" href="/login">
          Back to sign in
        </Link>
      </p>
    </AuthCard>
  );
}
