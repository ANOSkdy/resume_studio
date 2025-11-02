import React from "react";

export function txt(v: unknown): string {
  if (v == null) return "";
  if (Array.isArray(v)) {
    return v
      .map(item => txt(item))
      .filter(Boolean)
      .join(" / ");
  }
  if (React.isValidElement(v)) return "";
  if (typeof v === "object") return "";
  return String(v);
}

