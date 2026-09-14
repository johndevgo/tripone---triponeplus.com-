import type { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const styles = {
  primary:
    "border border-[#95EE8E]/45 bg-[#5BCD57] text-[#0b2a12] shadow-[0_10px_30px_rgba(91,205,87,.24)] hover:-translate-y-0.5 hover:bg-[#72dc6d] hover:shadow-[0_14px_38px_rgba(91,205,87,.32)]",
  secondary:
    "border border-white/15 bg-white/[.07] text-white hover:bg-white/[.12]",
  dark: "bg-[#075718] text-white hover:bg-[#11802A]",
  ghost: "text-current hover:bg-current/10",
  danger: "bg-red-600 text-white hover:bg-red-500",
};
const base =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 active:translate-y-px disabled:cursor-not-allowed disabled:opacity-50";
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
