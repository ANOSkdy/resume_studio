"use client";
import type { InputHTMLAttributes } from "react";
import { cn } from "./_cn";

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("input", props.className)} />;
}
