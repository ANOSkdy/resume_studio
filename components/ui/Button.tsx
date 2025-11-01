"use client";
import type { ButtonHTMLAttributes, PropsWithChildren } from "react";
import { cn } from "./_cn";

type Variant = "primary" | "secondary" | "ghost";
interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}
export function Button({ variant = "primary", className, children, ...rest }: PropsWithChildren<Props>) {
  const base = "btn";
  const v = variant === "primary" ? "btn-primary" : variant === "secondary" ? "btn-secondary" : "";
  return (
    <button {...rest} className={cn(base, v, className)}>{children}</button>
  );
}
