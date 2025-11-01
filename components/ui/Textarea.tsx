"use client";
import type { TextareaHTMLAttributes } from "react";
import { cn } from "./_cn";

export function Textarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("textarea", props.className)} />;
}
