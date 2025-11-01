"use client";
import type { InputHTMLAttributes } from "react";
import { cn } from "./_cn";

export function Checkbox(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input type="checkbox" {...props} className={cn(props.className)} />;
}
