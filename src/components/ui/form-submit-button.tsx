"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import { useFormStatus } from "react-dom";
import { LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function FormSubmitButton({
  children,
  pendingLabel = "Saving…",
  className,
  disabled,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      {...props}
      type="submit"
      disabled={disabled || pending}
      aria-disabled={disabled || pending}
      className={cn(
        "inline-flex items-center justify-center gap-2 transition disabled:cursor-wait disabled:opacity-60",
        className,
      )}
    >
      {pending && (
        <LoaderCircle aria-hidden size={15} className="animate-spin" />
      )}
      {pending ? pendingLabel : children}
    </button>
  );
}
