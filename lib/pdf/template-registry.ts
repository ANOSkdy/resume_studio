import type { ResumePdfPayload } from "./schema";
import ResumeTemplate from "./templates/Resume";
import CareerTemplate from "./templates/Career";

export type TemplateKey = "resume" | "career" | "resume_jp";

export type PdfTemplateComponent = React.FC<{ data: ResumePdfPayload }>;

const REGISTRY: Record<TemplateKey, PdfTemplateComponent> = {
  resume: ResumeTemplate,
  career: CareerTemplate,
  resume_jp: ResumeTemplate,
};

export function resolveTemplate(rawKey: string): { key: TemplateKey; component: PdfTemplateComponent } {
  const normalized = (rawKey || "").toLowerCase().trim() as TemplateKey;
  if (!normalized || !(normalized in REGISTRY)) {
    throw new Error(`Unknown template: ${rawKey}`);
  }
  return { key: normalized, component: REGISTRY[normalized] };
}

export const availableTemplateKeys: TemplateKey[] = Object.keys(REGISTRY) as TemplateKey[];
