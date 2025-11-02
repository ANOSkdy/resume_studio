import { ResumePdfPayload } from "./schema";

const REACT_ELEMENT_TYPE = typeof Symbol === "function" ? Symbol.for("react.element") : 0xead0;

type HistoryEntry = ResumePdfPayload["history"][number];
type QualificationEntry = ResumePdfPayload["qualifications"][number];

type PlaceholderContext = Record<string, unknown>;

const PLACEHOLDER_REGEX = /{{\s*([^{}]+?)\s*}}/g;

function hasReactLikeMarker(value: Record<string, unknown>): boolean {
  if (!("$$typeof" in value)) return false;
  const marker = (value as any).$$typeof;
  if (marker === REACT_ELEMENT_TYPE) return true;
  if (typeof marker === "string") {
    const normalized = marker.toLowerCase();
    return normalized.includes("react.element");
  }
  return false;
}

function isReactElement(value: unknown): value is { props?: Record<string, unknown> } {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  if (hasReactLikeMarker(candidate)) {
    return true;
  }

  if (typeof candidate.type === "string" && typeof candidate.props === "object") {
    return true;
  }

  return false;
}

function extractTextFromReactElement(element: any): string {
  if (!element || typeof element !== "object") return "";

  const props = (element as any).props ?? {};
  const children = props.children;

  if (children === null || children === undefined) return "";
  if (typeof children === "string") return children;
  if (typeof children === "number" || typeof children === "boolean") {
    return String(children);
  }

  if (Array.isArray(children)) {
    return children
      .map(child => {
        if (typeof child === "string") return child;
        if (typeof child === "number" || typeof child === "boolean") return String(child);
        if (isReactElement(child)) return extractTextFromReactElement(child);
        if (child && typeof child === "object") return extractTextFromReactElement({ props: { children: child } });
        return "";
      })
      .filter(Boolean)
      .join("");
  }

  if (isReactElement(children)) {
    return extractTextFromReactElement(children);
  }

  if (typeof children === "object") {
    return extractTextFromReactElement({ props: { children } });
  }

  return "";
}

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
  if (isReactElement(value)) {
    return extractTextFromReactElement(value) || "";
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

function forcePlainValue(value: unknown): unknown {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(item => forcePlainValue(item));
  }
  if (isReactElement(value)) {
    return extractTextFromReactElement(value) || "";
  }
  if (value && typeof value === "object") {
    const next: Record<string, unknown> = {};
    for (const [key, nested] of Object.entries(value)) {
      next[key] = forcePlainValue(nested);
    }
    return next;
  }
  return "";
}

function coerceText(value: unknown): string {
  if (value === null || value === undefined) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (Array.isArray(value)) {
    return value
      .map(item => coerceText(item))
      .filter(Boolean)
      .join(" ");
  }
  if (isReactElement(value)) {
    return extractTextFromReactElement(value) || "";
  }
  if (value && typeof value === "object") {
    return extractTextFromReactElement({ props: { children: value } }) || "";
  }
  return "";
}

export function resolvePayloadPlaceholders(payload: ResumePdfPayload): ResumePdfPayload {
  const resolved = resolveValue(payload, payload) as ResumePdfPayload;
  const plainResolved = forcePlainValue(resolved) as ResumePdfPayload;
  const typedPlain = plainResolved as ResumePdfPayload;
  const sanitizedHistory = Array.isArray(typedPlain.history)
    ? typedPlain.history
        .map((entry: HistoryEntry) => ({
          year: coerceText(entry?.year),
          month: coerceText(entry?.month),
          desc: coerceText(entry?.desc),
          status: coerceText((entry as any)?.status),
        }))
        .filter((entry: HistoryEntry) => !isPrimitiveEmpty(entry))
    : [];

  const sanitizedQualifications = Array.isArray(typedPlain.qualifications)
    ? typedPlain.qualifications
        .map((entry: QualificationEntry) => ({
          year: coerceText(entry?.year),
          month: coerceText(entry?.month),
          desc: coerceText(entry?.desc),
        }))
        .filter((entry: QualificationEntry) => !isPrimitiveEmpty(entry))
    : [];

  return {
    ...typedPlain,
    history: sanitizedHistory,
    qualifications: sanitizedQualifications,
  };
}
