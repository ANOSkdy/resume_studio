"use client";
import type { SelectHTMLAttributes } from "react";
import { cn } from "./_cn";

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={cn("select", props.className)} />;
}
