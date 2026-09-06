import Link from "next/link";
import { AuthCard, AuthMessage, inputClass } from "@/components/auth/auth-card";
import { Button } from "@/components/ui/button";
import { signup } from "@/app/auth/actions";
export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const p = await searchParams;
  return (
    <AuthCard
      title="Build your travel website"
      description="Create your workspace first. Business setup comes next."
    >
      <AuthMessage {...p} />
      <form action={signup} className="mt-6 grid gap-5">
        <label className="text-sm font-medium">
          Your name
          <input
            className={inputClass}
            name="name"
            autoComplete="name"
            minLength={2}
            required
          />
        </label>
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
            autoComplete="new-password"
            minLength={8}
            required
          />
          <span className="mt-2 block text-xs font-normal text-white/40">
            At least 8 characters.
          </span>
        </label>
        <Button type="submit">Create account</Button>
      </form>
      <p className="mt-6 text-center text-sm text-white/55">
        Already have an account?{" "}
        <Link className="text-[#FFC857] hover:underline" href="/login">
          Sign in
        </Link>
      </p>
    </AuthCard>
  );
}
