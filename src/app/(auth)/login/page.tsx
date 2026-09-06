import Link from "next/link";
import { AuthCard, AuthMessage, inputClass } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { login } from "@/app/auth/actions";
export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string; next?: string }>;
}) {
  const p = await searchParams;
  return (
    <AuthCard
      title="Welcome back"
      description="Sign in to manage your websites and experiences."
    >
      <AuthMessage {...p} />
      <form action={login} className="mt-6 grid gap-5">
        <input type="hidden" name="next" value={p.next ?? "/dashboard"} />
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
        <label className="text-sm font-medium">
          Password
          <input
            className={inputClass}
            name="password"
            type="password"
            autoComplete="current-password"
            minLength={8}
            required
          />
        </label>
        <div className="flex justify-end">
          <Link
            className="text-sm text-[#FFC857] hover:underline"
            href="/forgot-password"
          >
            Forgot password?
          </Link>
        </div>
        <Button type="submit">Sign in</Button>
      </form>
      <p className="mt-6 text-center text-sm text-white/55">
        New to TripOne+?{" "}
        <Link className="text-[#FFC857] hover:underline" href="/signup">
          Create an account
        </Link>
      </p>
    </AuthCard>
  );
}
