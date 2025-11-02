import React from "react";
import { Text } from "@react-pdf/renderer";

type PdfTextProps = React.ComponentProps<typeof Text>;

export function coerceText(value: unknown): string {
  if (value == null) return "";
  if (Array.isArray(value)) {
    return value
      .map(item => coerceText(item))
      .filter(Boolean)
      .join(" / ");
  }
  if (React.isValidElement(value)) return "";
  if (typeof value === "object") return "";
  return String(value);
}

export const SafeText: React.FC<PdfTextProps> = ({ children, ...props }) => {
  return <Text {...props}>{coerceText(children)}</Text>;
};

export const t = coerceText;

