import { ResumePdfPayload } from "./schema";

type PlaceholderContext = Record<string, unknown>;

const PLACEHOLDER_REGEX = /{{\s*([^{}]+?)\s*}}/g;

function getValue(path: string, context: PlaceholderContext): unknown {
  return path.split(".").reduce<unknown>((acc, key) => {
    if (acc === undefined || acc === null) return "";
    if (typeof acc !== "object") return "";
    if (Array.isArray(acc)) {
      const index = Number(key);
      if (Number.isNaN(index) || index < 0 || index >= acc.length) return "";
      return acc[index];
    }
    return (acc as Record<string, unknown>)[key];
  }, context);
}

export function resolvePlaceholdersInString(
  value: string,
  context: PlaceholderContext,
): string {
  if (!value) return "";
  return value.replace(PLACEHOLDER_REGEX, (_, token: string) => {
    const resolved = getValue(token, context);
    if (resolved === undefined || resolved === null) return "";
    if (typeof resolved === "string") return resolved;
    if (typeof resolved === "number" || typeof resolved === "boolean") {
      return String(resolved);
    }
    return "";
  });
}

function isPrimitiveEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim().length === 0;
  if (typeof value === "number") return Number.isNaN(value);
  if (Array.isArray(value)) return value.every(isPrimitiveEmpty);
  if (typeof value === "object") {
    return Object.values(value as Record<string, unknown>).every(isPrimitiveEmpty);
  }
  return false;
}

function resolveValue(value: unknown, context: PlaceholderContext): unknown {
  if (typeof value === "string") {
    return resolvePlaceholdersInString(value, context);
  }
  if (Array.isArray(value)) {
    const resolved = value
      .map(item => resolveValue(item, context))
      .filter(item => !isPrimitiveEmpty(item));
    return resolved;
  }
  if (value && typeof value === "object") {
    const result: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      result[key] = resolveValue(nested, context);
    }
    return result;
  }
  return value ?? "";
}

export function resolvePayloadPlaceholders(payload: ResumePdfPayload): ResumePdfPayload {
  const resolved = resolveValue(payload, payload) as ResumePdfPayload;
  return {
    ...resolved,
    history: Array.isArray(resolved.history) ? resolved.history.filter(entry => !isPrimitiveEmpty(entry)) : [],
    qualifications: Array.isArray(resolved.qualifications)
      ? resolved.qualifications.filter(entry => !isPrimitiveEmpty(entry))
      : [],
  };
}
