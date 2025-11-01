"use client";
import { PropsWithChildren } from "react";

interface FieldProps extends PropsWithChildren {
  label?: string;
  htmlFor?: string;
  hint?: string;
  error?: string;
}
export function Field({ label, htmlFor, hint, error, children }: FieldProps) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errId = error ? `${htmlFor}-err` : undefined;
  const describedBy = [hintId, errId].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      {label && <label htmlFor={htmlFor}>{label}</label>}
      <div aria-describedby={describedBy}>{children}</div>
      {hint && <div id={hintId} className="field-hint">{hint}</div>}
      {error && <div id={errId} className="field-error" role="alert">{error}</div>}
    </div>
  );
}
