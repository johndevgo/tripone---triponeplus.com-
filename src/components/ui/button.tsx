import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary:
    "bg-[#F5A623] text-[#173028] shadow-[0_8px_25px_rgba(245,166,35,.22)] hover:bg-[#FFC857]",
  secondary:
    "border border-white/15 bg-white/[.07] text-white hover:bg-white/[.12]",
  dark: "bg-[#063D2E] text-white hover:bg-[#087A5A]",
  ghost: "text-current hover:bg-current/10",
  danger: "bg-red-600 text-white hover:bg-red-500",
};
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50";
export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: keyof typeof styles;
}) {
  return <button className={cn(base, styles[variant], className)} {...props} />;
}
export function ButtonLink({
  variant = "primary",
  className,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  variant?: keyof typeof styles;
}) {
  return <Link className={cn(base, styles[variant], className)} {...props} />;
}
